"use client";

import FileUpload from "@/components/create-image/file-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageCanvas } from "@/components/ui/image-canvas";
import { ImageViewer } from "@/components/ui/image-viewer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { REMOVE_BACKGROUND_IMAGE_CREDITS } from "@/constants/credits";
import { useHandleSubmit } from "@/hooks/create-image";
import { useDownloadImage } from "@/hooks/download-image";
import { useShareImage } from "@/hooks/share-image";
import {
  HelpCircle,
  Loader,
  Scissors,
  Upload as UploadIcon,
} from "lucide-react";
import { useState } from "react";

const Page = () => {
  const { handleShareImage } = useShareImage();
  const { handleDownloadImage, isDownloading } = useDownloadImage();

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const { handleSubmit, isLoading, generatedImage } = useHandleSubmit({
    requestUrl: "/api/create-image/remove-background",
    requestBody: {
      imageUrl: uploadedImageUrl,
    },
    creditRequirement: REMOVE_BACKGROUND_IMAGE_CREDITS,
  });

  return (
    <div className="space-y-6 w-full overflow-visible">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Scissors className="mr-2 h-6 w-6 text-primary" />
            Remove Background
          </h1>
          <p className="text-muted-foreground flex items-center">
            Automatically remove the background from any image
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>
                  Remove Background uses AI to automatically remove the
                  background from any image, creating a transparent PNG.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-6 pb-12 mb-0 w-full overflow-visible">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="lg:col-span-1 flex flex-col">
              <Card className="w-full flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UploadIcon className="mr-2 h-5 w-5 text-primary" />
                    Upload Image
                  </CardTitle>
                  <CardDescription>
                    Upload an image to remove its background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FileUpload
                      uploadedImageUrl={uploadedImageUrl}
                      setUploadedImageUrl={setUploadedImageUrl}
                    />

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <span>
                          Cost:{" "}
                          <strong>
                            {REMOVE_BACKGROUND_IMAGE_CREDITS} credits
                          </strong>
                        </span>
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !uploadedImageUrl}
                        className="px-8"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Scissors className="mr-2 h-4 w-4" />
                            Remove Background
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 flex flex-col max-h-[500px]">
              <ImageCanvas
                title="Canvas"
                description="Your processed image will appear here"
                generatedImage={generatedImage}
                isLoading={isLoading}
                emptyStateIcon={
                  <Scissors className="h-16 w-16 text-muted-foreground/50 mb-2" />
                }
                emptyStateMessage="No image processed yet"
                loadingMessage="Removing background..."
                onImageClick={() => setIsViewerOpen(true)}
                onShare={() => {
                  if (generatedImage) {
                    handleShareImage(generatedImage);
                  }
                }}
                onDownload={() => {
                  if (generatedImage) {
                    handleDownloadImage({
                      imageUrl: generatedImage,
                      promptText: "remove-background",
                    });
                  }
                }}
                isDownloading={isDownloading}
              />
            </div>
          </div>
        </div>
      </div>

      {isViewerOpen && generatedImage && (
        <ImageViewer
          imageUrl={generatedImage}
          alt="Remove background image"
          mode="Remove Background"
          onClose={() => setIsViewerOpen(false)}
          onDownload={() => {
            if (generatedImage) {
              handleDownloadImage({
                imageUrl: generatedImage,
                promptText: "remove-background",
              });
            }
          }}
          onShare={() => {
            if (generatedImage) {
              handleShareImage(generatedImage);
            }
          }}
        />
      )}
    </div>
  );
};

export default Page;
