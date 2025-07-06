import { topupPrices } from "@/constants/api/billing";
import { accessTokenMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestBodyMiddleware } from "@/lib/middlewares/request";
import { getTopupCheckoutSessionUrl } from "@/lib/stripe";
import {
  topupCheckoutSessionRequestBodySchema,
  topupCheckoutSessionResponseDataSchema,
} from "@/lib/zod-schema/billing";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

async function postHandler(request: MiddlewareRequest) {
  try {
    const { type, quantity } = request.parsedRequestBody as z.infer<
      typeof topupCheckoutSessionRequestBodySchema
    >;

    const getTopupCheckoutSessionUrlResponse = await getTopupCheckoutSessionUrl(
      {
        price: topupPrices[type],
        quantity,
        clientReferenceId: request.user.id,
      }
    );
    if (getTopupCheckoutSessionUrlResponse.error) {
      throw new Error("Failed to create checkout session", {
        cause: {
          getTopupCheckoutSessionUrlResponse,
        },
      });
    }
    const checkoutSessionUrl = getTopupCheckoutSessionUrlResponse.data;

    const responseData = topupCheckoutSessionResponseDataSchema.parse({
      url: checkoutSessionUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Checkout session created successfully",
      data: responseData,
    });
  } catch (error: unknown) {
    Sentry.captureException(error);

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
  validateRequestBodyMiddleware(topupCheckoutSessionRequestBodySchema),
  postHandler
);
