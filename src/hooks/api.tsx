import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { useState } from "react";

export const useApi = () => {
  const { session, getUserSubscription } = useSupabase();
  const { toast } = useToast();

  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [
    requestTopupStripeCheckoutSessionLoading,
    setRequestTopupStripeCheckoutSessionLoading,
  ] = useState(false);
  const [
    requestSubscriptionStripeCheckoutSessionLoading,
    setRequestSubscriptionStripeCheckoutSessionLoading,
  ] = useState(false);
  const [
    requestCancelSubscriptionLoading,
    setRequestCancelSubscriptionLoading,
  ] = useState(false);
  const [
    requestSubscriptionDetailsLoading,
    setRequestSubscriptionDetailsLoading,
  ] = useState(false);

  const handleEnhancePrompt = async (prompt: string) => {
    try {
      if (!session?.accessToken) {
        throw new Error("session not found", {
          cause: {
            session,
          },
        });
      }

      setIsEnhancingPrompt(true);

      toast({
        title:
          "AI is improving your prompt with helpful keywords and descriptors.",
        duration: 5000,
      });

      const response = await axios.post(
        "/api/enhance-prompt",
        {
          prompt,
        },
        {
          headers: {
            authorization: session.accessToken,
          },
        }
      );
      if (!response.data.data) {
        throw new Error("no enhanced prompt returned from the api", {
          cause: {
            response: response.data,
          },
        });
      }

      if (
        response.data.data
          .replaceAll(/[^a-zA-Z]/g, "")
          .includes("couldntgenerateaclearimageprompt")
      ) {
        throw new Error("could not generate a clear image prompt", {
          cause: {
            chatwithResponse: response.data.data,
          },
        });
      }

      toast({
        title: "Successfully enhanced your prompt",
        duration: 5000,
      });

      return response.data.data;
    } catch (error: any) {
      if (error.message === "could not generate a clear image prompt") {
        toast({
          description: error.cause.chatwithResponse,
          variant: "destructive",
          duration: 5000,
        });
        return null;
      }

      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while enhancing your prompt",
        variant: "destructive",
        duration: 5000,
      });

      return null;
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const requestTopupStripeCheckoutSession = async ({
    type,
    quantity,
  }: {
    type: string;
    quantity: number;
  }) => {
    try {
      if (!session?.accessToken) {
        throw new Error("session not found", {
          cause: {
            session,
          },
        });
      }

      setRequestTopupStripeCheckoutSessionLoading(true);

      const response = await axios.post(
        "/api/billing/topup/checkout-session",
        {
          type: type,
          quantity: quantity,
        },
        {
          headers: {
            authorization: session.accessToken,
          },
        }
      );

      if (!response.data.data.url) {
        throw new Error("Failed to generate checkout session url", {
          cause: { response },
        });
      }

      window.open(response.data.data.url, "_blank");
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while requesting topup.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setRequestTopupStripeCheckoutSessionLoading(false);
    }
  };

  const requestSubscriptionStripeCheckoutSession = async ({
    planName,
    billingCycle,
    billingCycleAnchor,
    cancelExistingSubscription,
    trailEnd,
    existingSubscription,
  }: {
    planName: string;
    billingCycle: string;
    billingCycleAnchor?: number;
    cancelExistingSubscription?: boolean;
    trailEnd?: number;
    existingSubscription?: {
      planName: string;
      billingCycle: string;
    };
  }) => {
    try {
      if (!session?.accessToken) {
        throw new Error("session not found", {
          cause: {
            session,
          },
        });
      }

      setRequestSubscriptionStripeCheckoutSessionLoading(true);

      const requestBody: {
        planName: string;
        billingCycle: string;
        billingCycleAnchor?: number;
        cancelExistingSubscription?: boolean;
        trailEnd?: number;
        existingSubscription?: {
          planName: string;
          billingCycle: string;
        };
      } = {
        planName: planName,
        billingCycle: billingCycle,
      };
      if (billingCycleAnchor) {
        requestBody.billingCycleAnchor = billingCycleAnchor;
      }
      if (cancelExistingSubscription) {
        requestBody.cancelExistingSubscription = cancelExistingSubscription;
      }
      if (trailEnd) {
        requestBody.trailEnd = trailEnd;
      }
      if (existingSubscription) {
        requestBody.existingSubscription = existingSubscription;
      }

      const response = await axios.post(
        "/api/billing/subscription/checkout-session",
        requestBody,
        {
          headers: {
            authorization: session.accessToken,
          },
        }
      );

      if (!response.data.data.url) {
        throw new Error("Failed to generate checkout session url", {
          cause: { response },
        });
      }

      window.open(response.data.data.url, "_blank");
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title:
          "Something went wrong while requesting subscription checkout session.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setRequestSubscriptionStripeCheckoutSessionLoading(false);
    }
  };

  const requestCancelSubscription = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("session not found", {
          cause: {
            session,
          },
        });
      }

      setRequestCancelSubscriptionLoading(true);

      const response = await axios.post(
        "/api/billing/subscription/cancel",
        {},
        {
          headers: {
            authorization: session.accessToken,
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to cancel subscription", {
          cause: { response },
        });
      }

      toast({
        title: "Subscription canceled successfully",
        duration: 5000,
      });

      getUserSubscription();
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while canceling subscription.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setRequestCancelSubscriptionLoading(false);
    }
  };

  const requestSubscriptionDetails = async (): Promise<{
    subscriptionId: string;
    currentPeriodEnd: number;
  } | null> => {
    try {
      if (!session?.accessToken) {
        throw new Error("session not found", {
          cause: {
            session,
          },
        });
      }

      setRequestSubscriptionDetailsLoading(true);

      const response = await axios.get("/api/billing/subscription/get", {
        headers: {
          authorization: session.accessToken,
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to get subscription details", {
          cause: { response },
        });
      }

      return response.data.data;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while getting subscription details.",
        variant: "destructive",
        duration: 5000,
      });

      return null;
    } finally {
      setRequestSubscriptionDetailsLoading(false);
    }
  };

  return {
    handleEnhancePrompt,
    isEnhancingPrompt,
    requestTopupStripeCheckoutSession,
    requestTopupStripeCheckoutSessionLoading,
    requestSubscriptionStripeCheckoutSession,
    requestSubscriptionStripeCheckoutSessionLoading,
    requestCancelSubscription,
    requestCancelSubscriptionLoading,
    requestSubscriptionDetails,
    requestSubscriptionDetailsLoading,
  };
};
