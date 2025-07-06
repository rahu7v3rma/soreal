import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestQueryMiddleware } from "@/lib/middlewares/request";
import {
  getTopupCheckoutSession,
  getTopupPriceCreditAmount,
  getTopupPriceId,
  getTopupQuantity,
} from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { topupCheckoutSessionVerifyRequestQuerySchema } from "@/lib/zod-schema/billing";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

async function postHandler(request: MiddlewareRequest) {
  try {
    const parsedRequestQuery = request.parsedRequestQuery as z.infer<
      typeof topupCheckoutSessionVerifyRequestQuerySchema
    >;
    const checkoutSessionId = parsedRequestQuery.CHECKOUT_SESSION_ID;

    const getTopupCheckoutSessionResponse =
      await getTopupCheckoutSession(checkoutSessionId);
    if (getTopupCheckoutSessionResponse.error) {
      throw new Error("Invalid checkout session ID", {
        cause: { getTopupCheckoutSessionResponse },
      });
    }
    const session = getTopupCheckoutSessionResponse.data;

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("User ID is missing", { cause: { session } });
    }

    const getTopupQuantityResponse = await getTopupQuantity(session.id);
    if (getTopupQuantityResponse.error) {
      throw new Error("Invalid quantity purchased", {
        cause: { getTopupQuantityResponse },
      });
    }
    const quantityPurchased = getTopupQuantityResponse.data;

    const getTopupPriceIdResponse = await getTopupPriceId(session.id);
    if (getTopupPriceIdResponse.error) {
      throw new Error("Invalid price ID", {
        cause: { getTopupPriceIdResponse },
      });
    }
    const priceId = getTopupPriceIdResponse.data;

    const getTopupPriceCreditAmountResponse =
      await getTopupPriceCreditAmount(priceId);
    if (getTopupPriceCreditAmountResponse.error) {
      throw new Error("Invalid price credit amount", {
        cause: { getTopupPriceCreditAmountResponse },
      });
    }
    const creditsPurchased = getTopupPriceCreditAmountResponse.data;

    const totalCreditsPurchased = creditsPurchased * quantityPurchased;

    const getUser = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!getUser.data.user) {
      throw new Error("User data not found", {
        cause: { getUser },
      });
    }
    const user = getUser.data.user;

    const getUserTopup = await supabaseAdmin
      .from("user_topup")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!getUserTopup.data || getUserTopup.error) {
      throw new Error("User topup data not found", {
        cause: { getUserTopup },
      });
    }
    const userCreditBalance = getUserTopup.data.credit_balance || 0;

    const updateUserTopup = await supabaseAdmin
      .from("user_topup")
      .update({
        credit_balance: userCreditBalance + totalCreditsPurchased,
      })
      .eq("user_id", user.id)
      .select();
    if (updateUserTopup.error) {
      throw new Error("Failed to update user topup", {
        cause: { updateUserTopup },
      });
    }

    const insertUserPayment = await supabaseAdmin
      .from("user_payments")
      .insert({
        user_id: user.id,
        stripe_payment_intent_id: session.payment_intent,
      })
      .select()
      .single();
    if (!insertUserPayment.data || insertUserPayment.error) {
      throw new Error("Failed to insert user payment entry", {
        cause: { insertUserPayment },
      });
    }

    return NextResponse.redirect(
      new URL("/billing?topup_payment_success=1", request.url),
      { status: 302 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        cause: error?.cause,
      },
    });

    return NextResponse.redirect(
      new URL("/billing?topup_payment_failed=1", request.url),
      { status: 302 }
    );
  }
}

export const GET = withMiddlewares(
  validateRequestQueryMiddleware(topupCheckoutSessionVerifyRequestQuerySchema),
  postHandler
);
