import { useToast } from "@/components/shared/toast";
import { useSupabase } from "@/context/supabase";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { useState } from "react";

export const useApi = () => {
  const { session } = useSupabase();
  const { toast } = useToast();

  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  const handleEnhancePrompt = async (prompt: string) => {
    try {
      if (!session?.accessToken) {
        throw new Error("user not found", {
          cause: {
            user: session,
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
            authorization: session?.accessToken,
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
        response.data.data.includes(
          "I couldn’t generate a clear image prompt"
        )
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
          cause: error?.cause,
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

  return {
    handleEnhancePrompt,
    isEnhancingPrompt,
  };
};
