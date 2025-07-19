import { subscriptionPrices } from "@/constants/api/billing";
import { accessTokenMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestBodyMiddleware } from "@/lib/middlewares/request";
import { getSubscriptionCheckoutSessionUrl } from "@/lib/stripe";
import {
  subscriptionCheckoutSessionRequestBodySchema,
  subscriptionCheckoutSessionResponseDataSchema,
} from "@/lib/zod-schema/billing";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

async function postHandler(request: MiddlewareRequest) {
  try {
    const {
      planName,
      billingCycle,
      billingCycleAnchor,
      cancelExistingSubscription,
      trailEnd,
      existingSubscription,
    } = request.parsedRequestBody as z.infer<
      typeof subscriptionCheckoutSessionRequestBodySchema
    >;

    const getSubscriptionCheckoutSessionUrlResponse =
      await getSubscriptionCheckoutSessionUrl({
        price: subscriptionPrices[`${planName}_${billingCycle}`],
        clientReferenceId: request.user.id,
        billingCycleAnchor,
        cancelExistingSubscription,
        trailEnd,
        existingSubscription,
        newSubscription: {
          planName,
          billingCycle,
        },
      });
    if (getSubscriptionCheckoutSessionUrlResponse.error) {
      throw new Error("Failed to create checkout session", {
        cause: {
          getSubscriptionCheckoutSessionUrlResponse,
        },
      });
    }
    const checkoutSessionUrl = getSubscriptionCheckoutSessionUrlResponse.data;

    const responseData = subscriptionCheckoutSessionResponseDataSchema.parse({
      url: checkoutSessionUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Subscription checkout session created successfully",
      data: responseData,
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

export const POST = withMiddlewares(
  accessTokenMiddleware,
  validateRequestBodyMiddleware(subscriptionCheckoutSessionRequestBodySchema),
  postHandler
);
