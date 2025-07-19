"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader,
  Image as ImageIcon,
  Maximize2,
  AlertCircle,
  Share2,
  Download,
} from "lucide-react";

export function ImageCanvas({
  title = "Canvas",
  description = "Your generated image will appear here",
  generatedImage,
  isLoading,
  error,
  emptyStateIcon,
  emptyStateMessage = "No image generated yet",
  loadingMessage = "Generating your image...",
  onImageClick,
  onShare,
  onDownload,
  isDownloading = false,
  downloadFilename = "soreal-image",
  className = "",
  customEmptyStateText,
}: {
  title?: string;
  description?: string;
  generatedImage: string | null;
  isLoading: boolean;
  error?: string | null;
  emptyStateIcon?: React.ReactNode;
  emptyStateMessage?: string;
  loadingMessage?: string;
  onImageClick?: () => void;
  onShare?: (imageUrl: string) => void;
  onDownload?: (imageUrl: string, filename?: string) => void;
  isDownloading?: boolean;
  downloadFilename?: string;
  className?: string;
  customEmptyStateText?: string;
}) {
  const defaultEmptyIcon = (
    <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-2" />
  );

  return (
    <Card className={`w-full flex-1 subtle-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <ImageIcon className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 min-h-[400px] flex-1">
        {generatedImage ? (
          <div
            className="relative w-full h-full group cursor-pointer"
            onClick={onImageClick}
          >
            <img
              src={generatedImage}
              alt="Generated image"
              width={800}
              height={800}
              className="object-contain max-h-[400px] w-auto mx-auto hover:opacity-95 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button variant="secondary" size="sm" className="shadow-lg">
                <Maximize2 className="h-4 w-4 mr-1" />
                View Full Size
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            {error ? (
              <AlertCircle className="h-16 w-16 text-destructive mb-2" />
            ) : (
              <Loader className="h-16 w-16 text-primary animate-spin mb-2" />
            )}
            <p className="text-xl font-medium text-center">
              {error || loadingMessage}
            </p>
            {!error && (
              <p className="text-sm text-muted-foreground text-center">
                This may take a few moments
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 text-center p-6">
            {emptyStateIcon || defaultEmptyIcon}
            <h3 className="text-lg font-medium">{emptyStateMessage}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {customEmptyStateText ||
                "Fill in the form and click Generate to create your image"}
            </p>
          </div>
        )}
      </CardContent>
      {generatedImage && (onShare || onDownload) && (
        <CardFooter className="flex justify-end p-4 bg-muted/20">
          <div className="flex items-center gap-2">
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(generatedImage)}
                disabled={isDownloading}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(generatedImage, downloadFilename)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader className="h-4 w-4 mr-1 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
