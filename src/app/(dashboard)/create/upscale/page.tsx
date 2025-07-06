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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { defaultScale, validScales } from "@/constants/create-image/upscale";
import { UPSCALE_IMAGE_CREDITS } from "@/constants/credits";
import { useHandleSubmit } from "@/hooks/create-image";
import { useDownloadImage } from "@/hooks/download-image";
import { useShareImage } from "@/hooks/share-image";
import {
  ArrowUpToLine,
  HelpCircle,
  Loader,
  Upload as UploadIcon,
} from "lucide-react";
import { useState } from "react";

const Page = () => {
  const { handleShareImage } = useShareImage();
  const { handleDownloadImage, isDownloading } = useDownloadImage();

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [resolution, setResolution] = useState<number>(defaultScale);

  const { handleSubmit, isLoading, generatedImage } = useHandleSubmit({
    requestUrl: "/api/create-image/upscale",
    requestBody: {
      imageUrl: uploadedImageUrl,
      scale: resolution,
    },
    creditRequirement: UPSCALE_IMAGE_CREDITS,
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <ArrowUpToLine className="mr-2 h-6 w-6 text-primary" />
            Upscale Image
          </h1>
          <p className="text-muted-foreground flex items-center">
            Enhance and upscale your images with AI
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
                  Upscale enhances your images to higher resolutions while
                  improving quality and details.
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
                    Upload an image to upscale and enhance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FileUpload
                      uploadedImageUrl={uploadedImageUrl}
                      setUploadedImageUrl={setUploadedImageUrl}
                    />

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-sm font-medium">Upscale Settings</h3>

                      <div className="space-y-3">
                        <div className="space-y-1 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="resolution" className="text-sm">
                              Resolution: {resolution}x
                            </Label>
                          </div>
                          <Slider
                            id="resolution"
                            min={2}
                            max={8}
                            step={2}
                            value={[resolution]}
                            onValueChange={(value) => setResolution(value[0])}
                          />
                          <div className="flex justify-between text-xs px-1">
                            {validScales.map((v) => (
                              <span key={v}>{v}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <span>
                          Cost: <strong>{UPSCALE_IMAGE_CREDITS} credits</strong>
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
                            <ArrowUpToLine className="mr-2 h-4 w-4" />
                            Upscale Image
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 max-h-[500px]">
              <ImageCanvas
                title="Canvas"
                description="Your upscaled image will appear here"
                generatedImage={generatedImage}
                isLoading={isLoading}
                emptyStateIcon={
                  <ArrowUpToLine className="h-16 w-16 text-muted-foreground/50 mb-2" />
                }
                emptyStateMessage="No image upscaled yet"
                loadingMessage="Upscaling image..."
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
                      promptText: "upscaled-image",
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
          alt="Upscaled image"
          mode="Upscale"
          onClose={() => setIsViewerOpen(false)}
          onDownload={() => {
            if (generatedImage) {
              handleDownloadImage({
                imageUrl: generatedImage,
                promptText: "upscaled-image",
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
