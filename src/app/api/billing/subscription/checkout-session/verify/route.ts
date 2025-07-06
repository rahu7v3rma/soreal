import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestQueryMiddleware } from "@/lib/middlewares/request";
import {
  getSubscriptionCheckoutSession,
  getSubscriptionCheckoutSessionSubscription,
  stripe,
} from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { subscriptionCheckoutSessionVerifyRequestQuerySchema } from "@/lib/zod-schema/billing";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

async function postHandler(request: MiddlewareRequest) {
  try {
    const parsedRequestQuery = request.parsedRequestQuery as z.infer<
      typeof subscriptionCheckoutSessionVerifyRequestQuerySchema
    >;
    const checkoutSessionId = parsedRequestQuery.CHECKOUT_SESSION_ID;

    const getSubscriptionCheckoutSessionResponse =
      await getSubscriptionCheckoutSession(checkoutSessionId);
    if (getSubscriptionCheckoutSessionResponse.error) {
      throw new Error("Invalid checkout session ID", {
        cause: { getSubscriptionCheckoutSessionResponse },
      });
    }
    const session = getSubscriptionCheckoutSessionResponse.data;

    const getSubscriptionCheckoutSessionSubscriptionResponse =
      await getSubscriptionCheckoutSessionSubscription(
        session.subscriptionId,
        session.metadata
      );
    if (getSubscriptionCheckoutSessionSubscriptionResponse.error) {
      throw new Error("Invalid subscription", {
        cause: { getSubscriptionCheckoutSessionSubscriptionResponse },
      });
    }
    const subscription =
      getSubscriptionCheckoutSessionSubscriptionResponse.data;

    const getUser = await supabaseAdmin.auth.admin.getUserById(
      session.clientReferenceId
    );
    if (!getUser.data.user) {
      throw new Error("User data not found", {
        cause: { getUser },
      });
    }
    const user = getUser.data.user;

    if (session.metadata?.cancel_existing_subscription === "true") {
      const getUserSubscriptionResponse = await supabaseAdmin
        .from("user_subscription")
        .select("stripe_subscription_id")
        .eq("user_id", user.id)
        .single();
      if (!getUserSubscriptionResponse.data) {
        throw new Error("User subscription not found", {
          cause: { getUserSubscriptionResponse },
        });
      }
      const stripeSubscriptionId =
        getUserSubscriptionResponse.data.stripe_subscription_id;
      if (!stripeSubscriptionId) {
        throw new Error("Stripe subscription ID not found", {
          cause: { getUserSubscriptionResponse },
        });
      }

      const getSubscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);
      if (!getSubscription) {
        throw new Error("Subscription not found", {
          cause: { getSubscription },
        });
      }

      if (getSubscription.status !== "canceled") {
        const cancelSubscriptionResponse =
          await stripe.subscriptions.cancel(stripeSubscriptionId);
        if (cancelSubscriptionResponse.status !== "canceled") {
          throw new Error("Failed to cancel subscription", {
            cause: {
              cancelSubscriptionResponse,
            },
          });
        }
      }
    }

    const creditResetDate = new Date(subscription.createdAt * 1000);
    creditResetDate.setUTCMonth(creditResetDate.getUTCMonth() + 1);
    creditResetDate.setUTCDate(creditResetDate.getUTCDate() + 1);

    const updateUserSubscription = await supabaseAdmin
      .from("user_subscription")
      .update({
        credit_balance: subscription.creditAmount,
        plan_name: subscription.planName,
        billing_cycle: subscription.billingCycle,
        stripe_subscription_id: subscription.subscriptionId,
        credit_reset_date: creditResetDate.toISOString(),
        cancelled: false,
        subscription_end_date: null,
      })
      .eq("user_id", user.id)
      .select()
      .single();
    if (!updateUserSubscription.data || updateUserSubscription.error) {
      throw new Error("Failed to update user subscription", {
        cause: { updateUserSubscription },
      });
    }

    const insertUserPayment = await supabaseAdmin
      .from("user_payments")
      .insert({
        user_id: user.id,
        stripe_invoice_id: session.invoiceId,
      })
      .select()
      .single();
    if (!insertUserPayment.data || insertUserPayment.error) {
      throw new Error("Failed to insert user payment entry", {
        cause: { insertUserPayment },
      });
    }

    return NextResponse.redirect(
      new URL("/billing?subscription_payment_success=1", request.url),
      { status: 302 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        cause: error?.cause,
      },
    });

    return NextResponse.redirect(
      new URL("/billing?subscription_payment_failed=1", request.url),
      { status: 302 }
    );
  }
}

export const GET = withMiddlewares(
  validateRequestQueryMiddleware(
    subscriptionCheckoutSessionVerifyRequestQuerySchema
  ),
  postHandler
);
