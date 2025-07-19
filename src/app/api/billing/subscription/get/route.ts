import { accessTokenMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";

async function getHandler(request: MiddlewareRequest) {
  try {
    const supabaseUserSubscription = await supabaseAdmin
      .from("user_subscription")
      .select("*")
      .eq("user_id", request.user.id)
      .single();
    if (!supabaseUserSubscription) {
      throw new Error("User subscription not found", {
        cause: {
          supabaseUserSubscription,
        },
      });
    }

    const userSubscription = z
      .object({
        stripe_subscription_id: z.string().min(1),
      })
      .safeParse(supabaseUserSubscription.data);
    if (!userSubscription.success) {
      throw new Error("User subscription not found", {
        cause: {
          supabaseUserSubscription,
          userSubscription: userSubscription.error.flatten().fieldErrors,
        },
      });
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      userSubscription.data.stripe_subscription_id
    );
    if (!stripeSubscription) {
      throw new Error("Subscription not found", {
        cause: {
          stripeSubscription,
        },
      });
    }

    const subscription = z
      .object({
        id: z.string().min(1),
        currentPeriodEnd: z.number().min(1),
      })
      .safeParse({
        id: stripeSubscription.id,
        currentPeriodEnd: stripeSubscription.items.data[0].current_period_end,
      });
    if (!subscription.success) {
      throw new Error("Invalid subscription", {
        cause: {
          subscription: subscription.error.flatten().fieldErrors,
          stripeSubscription,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription retrieved successfully",
      data: {
        subscriptionId: subscription.data.id,
        currentPeriodEnd: subscription.data.currentPeriodEnd,
      },
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

export const GET = withMiddlewares(accessTokenMiddleware, getHandler);
