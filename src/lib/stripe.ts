import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getTopupCheckoutSessionUrl({
  price,
  quantity,
  clientReferenceId,
}: {
  price: string;
  quantity: number;
  clientReferenceId: string;
}) {
  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/billing/topup/checkout-session/verify?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}`,
    line_items: [
      {
        price,
        quantity,
      },
    ],
    mode: "payment",
    client_reference_id: clientReferenceId,
  });
  if (!checkoutSession.url) {
    return {
      error: { message: "Checkout session URL is missing", checkoutSession },
    };
  }
  return { data: checkoutSession.url };
}

export async function getTopupCheckoutSession(sessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (checkoutSession.status !== "complete") {
    return {
      error: { message: "Checkout session is not complete", checkoutSession },
    };
  }
  if (checkoutSession.payment_status !== "paid") {
    return {
      error: { message: "Payment not completed", checkoutSession },
    };
  }
  if (!checkoutSession.client_reference_id) {
    return {
      error: { message: "Client reference ID is missing", checkoutSession },
    };
  }
  if (!checkoutSession.amount_total) {
    return {
      error: { message: "Payment amount is missing", checkoutSession },
    };
  }
  if (typeof checkoutSession.payment_intent !== "string") {
    return {
      error: { message: "Payment intent is missing", checkoutSession },
    };
  }
  return { data: checkoutSession };
}

export async function getTopupQuantity(sessionId: string) {
  const sessionLineItems =
    await stripe.checkout.sessions.listLineItems(sessionId);
  const quantityPurchased = Number(sessionLineItems.data[0].quantity);
  if (isNaN(quantityPurchased) || quantityPurchased <= 0) {
    return {
      error: { message: "Quantity purchased is invalid", sessionLineItems },
    };
  }
  return { data: quantityPurchased };
}

export async function getTopupPriceId(sessionId: string) {
  const sessionLineItems =
    await stripe.checkout.sessions.listLineItems(sessionId);
  const priceId = sessionLineItems?.data?.[0].price?.id;
  if (!priceId) {
    return {
      error: { message: "Price ID is missing", sessionLineItems },
    };
  }
  return { data: priceId };
}

export async function getTopupPriceCreditAmount(priceId: string) {
  const price = await stripe.prices.retrieve(priceId);
  const creditAmount = Number(price.metadata.credit_amount);
  if (isNaN(creditAmount) || creditAmount <= 0) {
    return {
      error: { message: "Credit amount is invalid", price },
    };
  }
  return { data: creditAmount };
}

export async function getSubscriptionCheckoutSessionUrl({
  price,
  clientReferenceId,
  billingCycleAnchor,
  cancelExistingSubscription,
  trailEnd,
  existingSubscription,
  newSubscription,
}: {
  price: string;
  clientReferenceId: string;
  billingCycleAnchor?: number;
  cancelExistingSubscription?: boolean;
  trailEnd?: number;
  existingSubscription?: {
    planName: string;
    billingCycle: string;
  };
  newSubscription?: {
    planName: string;
    billingCycle: string;
  };
}) {
  const checkoutSessionConfig: Stripe.Checkout.SessionCreateParams = {
    success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/billing/subscription/checkout-session/verify?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}`,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    mode: "subscription",
    client_reference_id: clientReferenceId,
  };

  if (billingCycleAnchor) {
    checkoutSessionConfig.subscription_data = {
      billing_cycle_anchor: billingCycleAnchor,
      proration_behavior: "none",
    };
  }

  if (trailEnd) {
    checkoutSessionConfig.subscription_data = {
      trial_end: trailEnd,
    };
  }

  if (cancelExistingSubscription) {
    checkoutSessionConfig.metadata = {
      cancel_existing_subscription: "true",
    };
    if (existingSubscription) {
      checkoutSessionConfig.metadata = {
        ...checkoutSessionConfig.metadata,
        existing_subscription_plan_name: existingSubscription.planName,
        existing_subscription_billing_cycle: existingSubscription.billingCycle,
      };
    }
    if (newSubscription) {
      checkoutSessionConfig.metadata = {
        ...checkoutSessionConfig.metadata,
        new_subscription_plan_name: newSubscription.planName,
        new_subscription_billing_cycle: newSubscription.billingCycle,
      };
    }
  }

  const checkoutSession = await stripe.checkout.sessions.create(
    checkoutSessionConfig
  );
  if (!checkoutSession.url) {
    return {
      error: { message: "Checkout session URL is missing", checkoutSession },
    };
  }

  return { data: checkoutSession.url };
}

export async function getSubscriptionCheckoutSession(sessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (checkoutSession.status !== "complete") {
    return {
      error: { message: "Checkout session is not complete", checkoutSession },
    };
  }
  if (checkoutSession.metadata?.cancel_existing_subscription !== "true") {
    if (checkoutSession.payment_status !== "paid") {
      return {
        error: { message: "Payment not completed", checkoutSession },
      };
    }
  }
  if (!checkoutSession.client_reference_id) {
    return {
      error: { message: "Client reference ID is missing", checkoutSession },
    };
  }
  if (checkoutSession.metadata?.cancel_existing_subscription !== "true") {
    if (!checkoutSession.amount_total) {
      return {
        error: { message: "Payment amount is missing", checkoutSession },
      };
    }
  }
  if (checkoutSession.metadata?.cancel_existing_subscription !== "true") {
    if (typeof checkoutSession.invoice !== "string") {
      return {
        error: { message: "Invoice is missing", checkoutSession },
      };
    }
  }
  if (checkoutSession.mode !== "subscription") {
    return {
      error: {
        message: "Checkout session is not a subscription",
        checkoutSession,
      },
    };
  }
  if (typeof checkoutSession.subscription !== "string") {
    return {
      error: { message: "Subscription is missing", checkoutSession },
    };
  }
  return {
    data: {
      sessionId: checkoutSession.id,
      subscriptionId: checkoutSession.subscription,
      clientReferenceId: checkoutSession.client_reference_id,
      invoiceId: checkoutSession.invoice,
      metadata: checkoutSession.metadata,
    },
  };
}

export async function getSubscriptionCheckoutSessionSubscription(
  subscriptionId: string,
  checkoutSessionMetadata?: Stripe.Metadata | null
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const planName = subscription.items.data?.[0]?.price?.metadata?.plan_name;
  if (!planName) {
    return {
      error: { message: "Plan name is missing", subscription },
    };
  }

  const billingCycle =
    subscription.items.data?.[0]?.price?.metadata?.billing_cycle;
  if (!billingCycle) {
    return {
      error: { message: "Billing cycle is missing", subscription },
    };
  }

  if (subscription.status !== "active") {
    return {
      error: { message: "Subscription is not active", subscription },
    };
  }

  const creditAmount = Number(
    subscription.items.data?.[0]?.price?.metadata?.credit_amount
  );
  if (isNaN(creditAmount) || creditAmount <= 0) {
    return {
      error: { message: "Credit amount is invalid", subscription },
    };
  }

  const currentPeriodEnd = subscription.items.data[0].current_period_end;
  if (!currentPeriodEnd) {
    return {
      error: { message: "Billing cycle anchor is missing", subscription },
    };
  }

  return {
    data: {
      subscriptionId: subscription.id,
      creditAmount,
      planName,
      billingCycle,
      currentPeriodEnd,
      status: subscription.status,
      createdAt: subscription.created,
    },
  };
}
