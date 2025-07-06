import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { downloadBlob } from "@/lib/utils/common";

export const useDownloadImage = () => {
  const { toast } = useToast();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadImage = async ({
    imageUrl,
    promptText = "soreal-image",
  }: {
    imageUrl: string;
    promptText?: string;
  }) => {
    try {
      if (!imageUrl) {
        throw new Error("No image URL provided", {
          cause: { imageUrl },
        });
      }

      setIsDownloading(true);

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image url", {
          cause: { imageUrl },
        });
      }

      const blob = await response.blob();
      const filename = `${promptText
        .substring(0, 20)
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}-${Date.now()}.${imageUrl.split(".").pop()}`;

      downloadBlob(blob, filename);

      setIsDownloading(false);
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? error.cause : undefined,
        },
      });

      toast({
        title: "Something went wrong while downloading your image",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDownloadImage, isDownloading };
};
