"use client";

import EnhancePrompt from "@/components/create-image/enhance-prompt";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  textToImageOptions,
  imageToImageOptions,
  validFileFormats,
  premiumDefaultAspectRatio,
  premiumDefaultFileFormat,
} from "@/constants/create-image/premium";
import { PREMIUM_IMAGE_CREDITS } from "@/constants/credits";
import { useHandleSubmit } from "@/hooks/create-image";
import { useDownloadImage } from "@/hooks/download-image";
import { useShareImage } from "@/hooks/share-image";
import {
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Loader,
  Maximize2,
  PenTool,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RequestBody = {
  prompt?: string;
  aspectRatio?: string;
  fileFormat?: string;
  imagePromptUrl?: string;
};

const Page = () => {
  const router = useRouter();
  const { handleShareImage } = useShareImage();
  const { handleDownloadImage, isDownloading } = useDownloadImage();

  const [prompt, setPrompt] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState(premiumDefaultAspectRatio);
  const [fileFormat, setFileFormat] = useState(premiumDefaultFileFormat);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [requestBody, setRequestBody] = useState<RequestBody>({});

  // Get current aspect ratio options based on whether image is uploaded
  const currentAspectRatioOptions = uploadedImageUrl
    ? imageToImageOptions
    : textToImageOptions;

  const { handleSubmit, isLoading, generatedImage } = useHandleSubmit({
    requestUrl: "/api/create-image/premium",
    requestBody,
    creditRequirement: PREMIUM_IMAGE_CREDITS,
  });

  // Reset aspect ratio when switching between text-to-image and image-to-image modes
  useEffect(() => {
    const availableRatios = uploadedImageUrl
      ? imageToImageOptions
      : textToImageOptions;
    const currentRatioAvailable = availableRatios.some(
      (option) => option.value === aspectRatio
    );

    if (!currentRatioAvailable) {
      setAspectRatio("16:9"); // Default to landscape which is available in both modes
    }
  }, [uploadedImageUrl, aspectRatio]);

  useEffect(() => {
    const requestBody: RequestBody = {
      aspectRatio,
      fileFormat,
    };
    if (prompt) {
      requestBody.prompt = prompt;
    }
    if (uploadedImageUrl) {
      requestBody.imagePromptUrl = uploadedImageUrl;
    }

    setRequestBody(requestBody);
  }, [prompt, aspectRatio, fileFormat, uploadedImageUrl]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Layers className="mr-2 h-6 w-6 text-primary" />
            Premium Mode
          </h1>
          <p className="text-muted-foreground flex items-center text-lg">
            Premium Mode delivers ultra-realistic image generation with precise
            control over lighting, detail, and color.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push("/create/standard")}
              className="flex items-center gap-2"
              style={{ backgroundColor: "#2fceb9", color: "white" }}
            >
              <Zap className="h-4 w-4" />
              Switch to Standard Mode
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm p-3">
                  <p>
                    Use this for fast, everyday image creation—great for social
                    media posts, product sketches, or casual prompts.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-12 mb-0 w-full overflow-visible">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
            <div className="lg:col-span-2 flex flex-col">
              <Card className="w-full flex-1 subtle-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool
                      className="mr-2 h-5 w-5"
                      style={{ color: "#2fceb9" }}
                    />
                    Prompt Editor
                  </CardTitle>
                  <CardDescription>
                    Describe what you want to generate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <label
                            htmlFor="prompt"
                            className="text-sm font-medium"
                          >
                            Image Description
                          </label>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {prompt.length} / 1000 characters
                        </div>
                      </div>
                      <Textarea
                        placeholder="Describe what you want to see in your image (e.g., 'A sunset over mountains with a lake')"
                        className="min-h-[120px] text-base resize-none focus:ring-2 focus:ring-primary/50 transition-all border-enhanced"
                        value={prompt}
                        onChange={(e) =>
                          setPrompt(e.target.value.trim() ? e.target.value : "")
                        }
                        maxLength={1000}
                      />
                    </div>

                    <div className="space-y-2">
                      <EnhancePrompt
                        prompt={prompt}
                        setPrompt={setPrompt}
                        setIsEnhancingPrompt={setIsEnhancingPrompt}
                      />
                    </div>

                    <FileUpload
                      uploadedImageUrl={uploadedImageUrl}
                      setUploadedImageUrl={setUploadedImageUrl}
                    />

                    <div className="flex items-center justify-between py-2 px-1">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-medium">
                          Cost Per Image: {PREMIUM_IMAGE_CREDITS} credits
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">
                          Advanced Controls
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {showAdvancedControls ? "On" : "Off"}
                          </span>
                          <Switch
                            checked={showAdvancedControls}
                            onCheckedChange={setShowAdvancedControls}
                          />
                        </div>
                      </div>

                      {showAdvancedControls && (
                        <>
                          <div className="space-y-2">
                            <label
                              htmlFor="aspect-ratio"
                              className="text-sm font-medium flex items-center"
                            >
                              <Maximize2 className="h-4 w-4 mr-1 text-emerald-500" />
                              Aspect Ratio
                            </label>
                            {uploadedImageUrl && (
                              <p className="text-xs text-muted-foreground mb-2">
                                Extended aspect ratios available when using a
                                reference image
                              </p>
                            )}
                            <Select
                              value={aspectRatio}
                              onValueChange={setAspectRatio}
                            >
                              <SelectTrigger
                                className="w-full"
                                id="aspect-ratio"
                              >
                                <SelectValue placeholder="Select aspect ratio" />
                              </SelectTrigger>
                              <SelectContent>
                                {currentAspectRatioOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="my-6"></div>
                          <div className="space-y-2">
                            <label
                              htmlFor="file-format"
                              className="text-sm font-medium flex items-center"
                            >
                              <ImageIcon className="h-4 w-4 mr-1 text-emerald-500" />
                              File Format
                            </label>
                            <Select
                              value={fileFormat}
                              onValueChange={setFileFormat}
                            >
                              <SelectTrigger
                                className="w-full"
                                id="file-format"
                              >
                                <SelectValue placeholder="Select file format" />
                              </SelectTrigger>
                              <SelectContent>
                                {validFileFormats.map((format) => (
                                  <SelectItem key={format} value={format}>
                                    {format.toUpperCase()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={
                        isLoading ||
                        (!prompt && !uploadedImageUrl) ||
                        isEnhancingPrompt
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <ImageCanvas
                title="Canvas"
                description="Your photorealistic image will appear here"
                generatedImage={generatedImage}
                isLoading={isLoading}
                emptyStateIcon={
                  <Layers className="h-16 w-16 text-muted-foreground/50 mb-2" />
                }
                emptyStateMessage="No image generated yet"
                loadingMessage="Generating your image..."
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
                      promptText: prompt,
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
          alt={prompt || "Generated image"}
          prompt={prompt}
          onClose={() => setIsViewerOpen(false)}
          onDownload={() => {
            if (generatedImage) {
              handleDownloadImage({
                imageUrl: generatedImage,
                promptText: prompt,
              });
            }
          }}
          aspectRatio={aspectRatio}
          mode="Premium"
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
