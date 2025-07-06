import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";

const Deno = {
  env: {
    get: (key: string): string | undefined => {
      return process.env[key];
    },
  },
};

const logger = {
  now: () => {
    return new Date().toISOString();
  },
  info: (message: string, object?: any) => {
    console.info(`${logger.now()} - INFO - ${message}`);
    if (object) {
      console.info(JSON.stringify(object));
    }
  },
  error: (message: string, error?: any) => {
    console.error(`${logger.now()} - ERROR - ${message}`);
    if (error) {
      console.error(JSON.stringify(error));
    }
  },
};

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN"),
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

const refillCredits = async () => {
  try {
    const today = new Date();
    logger.info(
      `Started refilling credits for ${today.toISOString().split("T")[0]}`
    );

    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Setup Stripe client
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

    // Fetch all subscriptions
    const { data: subscriptions, error } = await supabase
      .from("user_subscription")
      .select("*")
      .eq("credit_reset_date", today.toISOString().split("T")[0]);
    if (error || !subscriptions) {
      throw new Error("Error fetching subscriptions", { cause: error });
    }
    if (subscriptions?.length === 0) {
      logger.info("No subscriptions found");
      return new Response(
        JSON.stringify({
          success: true,
        })
      );
    }
    logger.info(`Found ${subscriptions.length} subscriptions`);

    // Process each subscription
    const processedSubscriptions = [];
    for (const subscription of subscriptions) {
      try {
        // Skip if no Stripe subscription ID
        if (!subscription.stripe_subscription_id) {
          throw new Error("Subscription without Stripe subscription ID", {
            cause: subscription,
          });
        }
        logger.info(
          `Processing subscription ${subscription.stripe_subscription_id} for user ${subscription.user_id}`
        );

        // Retrieve Stripe subscription
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id
        );
        if (!stripeSubscription) {
          throw new Error("Subscription without Stripe subscription", {
            cause: subscription,
          });
        }
        logger.info(
          `Retrieved Stripe subscription ${subscription.stripe_subscription_id}`
        );

        // Check subscription status
        if (stripeSubscription?.status !== "active") {
          logger.info(
            `Inactive subscription ${subscription.stripe_subscription_id} with status: ${stripeSubscription.status}, updating credit_reset_date to null`
          );
          
          // Update credit_reset_date to null for inactive subscription
          const { error: updateError } = await supabase
            .from("user_subscription")
            .update({
              credit_reset_date: null,
            })
            .eq("stripe_subscription_id", subscription.stripe_subscription_id);
          
          if (updateError) {
            logger.error(
              `Failed to update credit_reset_date for inactive subscription ${subscription.stripe_subscription_id}:`,
              updateError
            );
          } else {
            logger.info(
              `Successfully updated credit_reset_date to null for inactive subscription ${subscription.stripe_subscription_id}`
            );
          }
          
          continue;
        }
        logger.info(
          `Subscription ${subscription.stripe_subscription_id} is active`
        );

        // Validate subscription credit amount
        const creditAmount = Number(
          stripeSubscription.items.data?.[0]?.price?.metadata?.credit_amount
        );
        if (isNaN(creditAmount) || creditAmount <= 0) {
          throw new Error("Subscription with invalid credit amount", {
            cause: subscription,
          });
        }
        logger.info(
          `Subscription ${subscription.stripe_subscription_id} has credit amount: ${creditAmount}`
        );

        // Update credits in database
        const creditResetDate = new Date();
        creditResetDate.setUTCMonth(creditResetDate.getUTCMonth() + 1);
        creditResetDate.setUTCDate(creditResetDate.getUTCDate() + 1);
        const { data: updatedSubscription, error: updateError } = await supabase
          .from("user_subscription")
          .update({
            credit_balance: creditAmount,
            credit_reset_date: creditResetDate.toISOString(),
          })
          .eq("stripe_subscription_id", subscription.stripe_subscription_id)
          .select()
          .single();
        if (updateError || !updatedSubscription) {
          throw new Error("Failed to update credits", {
            cause: updateError,
          });
        }
        logger.info(
          `Successfully updated credits for subscription ${subscription.stripe_subscription_id}`,
          updatedSubscription
        );

        processedSubscriptions.push(subscription.stripe_subscription_id);

        logger.info(
          `Successfully processed subscription ${subscription.stripe_subscription_id} for user ${subscription.user_id}`
        );
      } catch (error) {
        logger.error(
          `Error processing subscription ${subscription.stripe_subscription_id}:`,
          error
        );

        Sentry.captureException("Error processing subscription", {
          extra: {
            subscriptionId: subscription.stripe_subscription_id,
            userId: subscription.user_id,
            cause: error,
          },
        });

        continue;
      }
    }

    logger.info(
      `Successfully processed ${processedSubscriptions.length} out of ${subscriptions.length} subscriptions`
    );

    return new Response(
      JSON.stringify({
        success: true,
      })
    );
  } catch (error) {
    logger.error("Unexpected error while refilling credits:", error);

    Sentry.captureException("Unexpected error while refilling credits", {
      extra: {
        cause: error,
      },
    });

    return new Response(
      JSON.stringify({
        success: false,
      })
    );
  }
};

export default refillCredits;
