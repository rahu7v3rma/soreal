import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import axios from "axios";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export const useTestImageUrl = () => {
  const { toast } = useToast();

  const [isTestingUrl, setIsTestingUrl] = useState(false);

  const testImageUrl = async ({ url }: { url: string }) => {
    try {
      if (!url) {
        throw new Error("No image URL provided", {
          cause: { url },
        });
      }

      setIsTestingUrl(true);

      const urlObject = new URL(url);

      const response = await fetch(urlObject.toString(), { method: "HEAD" });

      if (!response.ok) {
        throw new Error("Reference image URL is not valid", {
          cause: { url },
        });
      }

      const responseHeaders = response.headers;
      const contentType = responseHeaders.get("content-type");
      if (!contentType?.startsWith("image/")) {
        throw new Error("Reference image URL is not valid", {
          cause: { url },
        });
      }

      toast({
        title: "Reference image URL is valid",
        duration: 5000,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Reference image URL is not valid",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsTestingUrl(false);
    }
  };

  return { isTestingUrl, setIsTestingUrl, testImageUrl };
};

export const useHandleSubmit = ({
  requestUrl,
  requestBody,
  creditRequirement,
}: {
  requestUrl: string;
  requestBody: Record<string, string | number>;
  creditRequirement: number;
}) => {
  const {
    authUser,
    userTopup,
    getUserTopup,
    getUserGenerations,
    getUserSubscription,
  } = useSupabase();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!authUser?.id) {
        throw new Error("User not authenticated", {
          cause: {
            authUser,
            userTopup,
          },
        });
      }

      if (isNaN(creditRequirement)) {
        throw new Error("Invalid credit requirement", {
          cause: {
            creditRequirement,
            userCreditBalance: userTopup?.creditBalance,
          },
        });
      }

      let creditBalance = userTopup?.creditBalance;
      if (creditBalance === null) {
        creditBalance = 0;
      }

      if (typeof creditBalance !== "number") {
        throw new Error("User credit balance is not defined", {
          cause: {
            userTopup,
          },
        });
      }

      if (creditBalance < creditRequirement) {
        toast({
          title: "You don't have enough credits",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      setIsLoading(true);

      setGeneratedImage(null);

      const response = await axios.post(requestUrl, requestBody, {
        headers: { authorization: authUser.id },
      });

      const imageUrl = response?.data?.data?.imageUrl;
      if (!imageUrl) {
        throw new Error("No image URL returned from the API", {
          cause: response,
        });
      }

      setGeneratedImage(imageUrl);

      getUserTopup();

      getUserGenerations();

      getUserSubscription();
    } catch (error: any) {
      const valid400Messages = [
        "You don't have enough credits to generate an image. Please purchase more credits.",
      ];
      if (valid400Messages.includes(error.response.data.message)) {
        toast({
          title:
            "You don't have enough credits to generate an image. Please purchase more credits.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      toast({
        title: "Something went wrong while generating your image",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, generatedImage };
};
