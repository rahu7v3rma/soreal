import { useToast } from "@/components/ui/toast";
import * as Sentry from "@sentry/nextjs";

export const useShareImage = () => {
  const { toast } = useToast();

  const handleShareImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) {
        throw new Error("No image URL provided", {
          cause: { imageUrl },
        });
      }

      await navigator.clipboard.writeText(imageUrl);

      toast({
        title: "Image link copied to clipboard",
        duration: 5000,
      });
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      toast({
        title: "Failed to copy image link to clipboard",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  return { handleShareImage };
};
