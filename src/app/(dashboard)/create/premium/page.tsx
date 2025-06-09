"use client";

import EnhancePrompt from "@/components/create-image/enhance-prompt";
import FileUpload from "@/components/create-image/file-upload";
import { Button } from "@/components/shared/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { ImageCanvas } from "@/components/shared/image-canvas";
import { ImageViewer } from "@/components/shared/image-viewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import { Slider } from "@/components/shared/slider";
import { Switch } from "@/components/shared/switch";
import { Textarea } from "@/components/shared/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shared/tooltip";
import {
  aspectRatioOptions,
  realismPresets,
  validFileFormats,
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
  Sliders,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RequestBody = {
  prompt?: string;
  style?: string;
  aspectRatio?: string;
  fileFormat?: string;
  imagePromptUrl?: string;
  imagePromptStrength?: number;
};

const Page = () => {
  const router = useRouter();
  const { handleShareImage } = useShareImage();
  const { handleDownloadImage, isDownloading } = useDownloadImage();

  const [prompt, setPrompt] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [showImagePromptStrength, setShowImagePromptStrength] = useState(false);
  const [imagePromptStrength, setImagePromptStrength] = useState(0.1);
  const [style, setStyle] = useState(
    "photorealistic, 8K, hyperdetailed, professional photography, sharp focus, DSLR, natural lighting, cinematic, HDR"
  );
  const [aspectRatio, setAspectRatio] = useState("3:2");
  const [fileFormat, setFileFormat] = useState(validFileFormats[0]);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [requestBody, setRequestBody] = useState<RequestBody>({});

  const { handleSubmit, isLoading, generatedImage } = useHandleSubmit({
    requestUrl: "/api/create-image/premium",
    requestBody,
    creditRequirement: PREMIUM_IMAGE_CREDITS,
  });

  const handleApplyPreset = (presetName: string) => {
    if (selectedPreset === presetName) {
      setStyle(
        "photorealistic, 8K, hyperdetailed, professional photography, sharp focus, DSLR, natural lighting, cinematic, HDR"
      );
      setAspectRatio("3:2");
      setSelectedPreset("");
    } else {
      const preset = realismPresets.find((p) => p.name === presetName);
      if (preset) {
        setStyle(preset.settings.style);
        setAspectRatio(preset.settings.aspectRatio);
        setSelectedPreset(presetName);
      }
    }
  };

  useEffect(() => {
    setShowImagePromptStrength(!!uploadedImageUrl);
  }, [uploadedImageUrl]);

  useEffect(() => {
    const requestBody: RequestBody = {
      style,
      aspectRatio,
      fileFormat,
    };
    if (prompt) {
      requestBody.prompt = prompt;
    }
    if (uploadedImageUrl) {
      requestBody.imagePromptUrl = uploadedImageUrl;
      requestBody.imagePromptStrength = imagePromptStrength;
    }

    setRequestBody(requestBody);
  }, [
    prompt,
    style,
    aspectRatio,
    fileFormat,
    uploadedImageUrl,
    imagePromptStrength,
  ]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Layers className="mr-2 h-6 w-6 text-primary" />
            Premium Mode
          </h1>
          <p className="text-muted-foreground flex items-center text-lg">
            Fine-tuned settings for photorealistic image generation. Premium
            Mode creates highly detailed, photorealistic images with fine-tuned
            controls for lighting, detail, and color.
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
          <Card className="border-primary/20 w-full subtle-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 h-5 w-5 text-primary" />
                  Style Presets
                </CardTitle>
              </div>
              <CardDescription>
                Style Presets are optional – use them for quick visual styles or
                framing suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 justify-items-center">
                {realismPresets.map((preset) => (
                  <Card
                    key={preset.name}
                    className={`cursor-pointer transition-all hover:border-primary/50 w-full h-full ${selectedPreset === preset.name ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => handleApplyPreset(preset.name)}
                  >
                    <CardHeader className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <CardTitle className="text-base">
                          {preset.name}
                        </CardTitle>
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div
                                className="ml-1 inline-flex items-center justify-center z-10 relative"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              >
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[200px] z-50"
                            >
                              <p className="text-xs">
                                Applies style settings for{" "}
                                {preset.description.toLowerCase()}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

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

                    {showImagePromptStrength && (
                      <div className="p-3 border border-blue-200 bg-blue-50rounded-md">
                        <div className="mb-3">
                          <div className="flex items-center">
                            <label className="text-sm font-medium flex items-center">
                              <Sliders className="h-4 w-4 mr-1 text-blue-500" />
                              Reference Image Strength:{" "}
                              {Math.round(imagePromptStrength * 100)}%
                            </label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                  >
                                    <HelpCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  align="start"
                                  className="max-w-xs p-3"
                                >
                                  <p className="text-xs">
                                    Adjust how much the reference image
                                    influences the generated result. Higher
                                    values keep more details from the reference
                                    image.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <div className="relative pt-6 pb-2 w-full">
                          <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                            <span>Subtle influence</span>
                            <span>Strong influence</span>
                          </div>
                          <Slider
                            value={[imagePromptStrength * 100]}
                            min={1}
                            max={100}
                            step={1}
                            onValueChange={(value) =>
                              setImagePromptStrength(value[0] / 100)
                            }
                          />
                        </div>
                      </div>
                    )}

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
                                {aspectRatioOptions.map((option) => (
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
          style={style}
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
