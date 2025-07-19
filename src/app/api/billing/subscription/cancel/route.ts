import { accessTokenMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

async function postHandler(request: MiddlewareRequest) {
  try {
    const getUserSubscriptionResponse = await supabaseAdmin
      .from("user_subscription")
      .select("*")
      .eq("user_id", request.user.id)
      .single();
    if (
      getUserSubscriptionResponse.error ||
      !getUserSubscriptionResponse.data
    ) {
      throw new Error("Failed to get user subscription", {
        cause: {
          getUserSubscriptionResponse,
        },
      });
    }
    const stripeSubscriptionId =
      getUserSubscriptionResponse.data.stripe_subscription_id;

    const cancelSubscriptionResponse =
      await stripe.subscriptions.cancel(stripeSubscriptionId);
    if (cancelSubscriptionResponse.status !== "canceled") {
      throw new Error("Failed to cancel subscription", {
        cause: {
          cancelSubscriptionResponse,
        },
      });
    }

    const updatedUserSubscription = await supabaseAdmin
      .from("user_subscription")
      .update({
        cancelled: true,
        subscription_end_date: new Date(
          cancelSubscriptionResponse.items.data[0]?.current_period_end * 1000
        ),
      })
      .eq("user_id", request.user.id)
      .select()
      .single();
    if (updatedUserSubscription.error || !updatedUserSubscription.data) {
      throw new Error("Failed to update user subscription", {
        cause: {
          updatedUserSubscription,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription canceled successfully",
      data: null,
    });
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        cause: JSON.stringify(error?.cause),
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export const POST = withMiddlewares(accessTokenMiddleware, postHandler);
