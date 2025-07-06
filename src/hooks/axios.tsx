import { apiSorealJoinWaitlistWebhookPath } from "@/constants/paths";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { useState } from "react";

export const useAxios = () => {
  const [
    sendJoinWaitlistWebhookDataLoading,
    setSendJoinWaitlistWebhookDataLoading,
  ] = useState(false);

  const sendJoinWaitlistWebhookData = async (name: string, email: string, interests: string[]) => {
    try {
      setSendJoinWaitlistWebhookDataLoading(true);

      const response = await axios.post(apiSorealJoinWaitlistWebhookPath, {
        name,
        email,
        interests,
      });

      if (
        response.status !== 200 ||
        response.data.status.toLowerCase() !== "success"
      ) {
        throw new Error("Failed to send webhook to Pabbly", {
          cause: response,
        });
      }

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return false;
    } finally {
      setSendJoinWaitlistWebhookDataLoading(false);
    }
  };

  return {
    sendJoinWaitlistWebhookData,
    sendJoinWaitlistWebhookDataLoading,
  };
};
