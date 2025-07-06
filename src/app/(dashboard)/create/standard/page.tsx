"use client";

import EnhancePrompt from "@/components/create-image/enhance-prompt";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  aiSuggestions,
  aspectRatioOptions,
  defaultStyle,
  defaultAspectRatio,
} from "@/constants/create-image/standard";
import { STANDARD_IMAGE_CREDITS } from "@/constants/credits";
import { STANDARD_STYLE_PRESETS } from "@/constants/styles";
import { useHandleSubmit } from "@/hooks/create-image";
import { useDownloadImage } from "@/hooks/download-image";
import { useShareImage } from "@/hooks/share-image";
import {
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  PenTool,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const { handleShareImage } = useShareImage();
  const { handleDownloadImage, isDownloading } = useDownloadImage();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] =
    useState<keyof typeof STANDARD_STYLE_PRESETS>(defaultStyle);
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  const { handleSubmit, isLoading, generatedImage } = useHandleSubmit({
    requestUrl: "/api/create-image/standard",
    requestBody: {
      prompt,
      style,
      aspectRatio,
    },
    creditRequirement: STANDARD_IMAGE_CREDITS,
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Zap className="h-8 w-8" style={{ color: "#2fceb9" }} />
            Standard Mode
          </h1>
          <p className="text-muted-foreground text-lg">
            Fast and efficient AI image generation with simplified controls.
            Perfect for quick creations, social media content, and everyday
            image needs. For advanced features and higher quality outputs, try
            Premium Mode.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Link href="/create/premium">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                style={{ backgroundColor: "#2fceb9", color: "white" }}
              >
                <Layers className="h-4 w-4" />
                <span>Switch to Premium Mode</span>
              </Button>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm p-3">
                  <p>
                    Choose this for advanced creative control and maximum
                    quality. Best for professional visuals, client work, or
                    detailed concept art.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <span>Tips for Better Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p>
                For best results, be specific about details like lighting,
                environment, mood, and perspective.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" style={{ color: "#2fceb9" }} />
                <span>Prompt Editor</span>
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
                      <label htmlFor="prompt" className="text-sm font-medium">
                        Image Description
                      </label>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prompt.length} / 500 characters
                    </div>
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    maxLength={500}
                  />
                </div>

                <div className="space-y-2">
                  <EnhancePrompt
                    prompt={prompt}
                    setPrompt={setPrompt}
                    setIsEnhancingPrompt={setIsEnhancingPrompt}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="style" className="text-sm font-medium">
                    Style
                  </label>
                  <Select
                    value={style}
                    onValueChange={(value) => {
                      setStyle(value as keyof typeof STANDARD_STYLE_PRESETS);
                    }}
                  >
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(STANDARD_STYLE_PRESETS).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Style Presets are optional – use them for quick visual
                    styles or framing suggestions.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="aspect-ratio" className="text-sm font-medium">
                    Aspect Ratio
                  </label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspect-ratio">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatioOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !prompt || isEnhancingPrompt}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-pulse">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  <div className="mt-2 text-center text-sm">
                    <span className="text-muted-foreground">Cost: </span>
                    <span className="font-medium">
                      {STANDARD_IMAGE_CREDITS} credits
                    </span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <ImageCanvas
            title="Canvas"
            description="Your AI-generated creation will appear here"
            generatedImage={generatedImage}
            isLoading={isLoading}
            emptyStateIcon={
              <Zap className="h-16 w-16 text-muted-foreground/50 mb-2" />
            }
            emptyStateMessage="No image generated yet"
            loadingMessage="Creating your masterpiece..."
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

      {isViewerOpen && generatedImage && (
        <ImageViewer
          imageUrl={generatedImage}
          alt={prompt}
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
          mode="Standard"
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
