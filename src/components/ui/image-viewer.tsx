"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, Share, X } from "lucide-react";
import Image from "next/image";
import React from "react";

export function ImageViewer({
  imageUrl,
  alt,
  prompt,
  onClose,
  onDownload,
  aspectRatio,
  mode,
  onShare,
}: {
  imageUrl: string;
  alt: string;
  prompt?: string;
  onClose: () => void;
  onDownload?: (e: React.MouseEvent) => void;
  aspectRatio?: string;
  mode?: string;
  onShare?: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()} modal>
      <DialogContent className="p-0 bg-transparent overflow-hidden [&>button]:border [&>button]:border-black/20 [&>button]:p-[6px] flex">
        <div className="flex flex-col w-[95vw] h-[95vh] border border-black/20 relative bg-white rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 text-white/80 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-6 w-6 text-black" />
          </Button>

          <div className="flex flex-col md:flex-row h-full w-full">
            <div className="flex items-center bg-black/20 w-full">
              <div className="w-[70%] h-full relative">
                <Image
                  src={
                    imageUrl &&
                    typeof imageUrl === "string" &&
                    imageUrl.startsWith("http")
                      ? imageUrl
                      : "/image-placeholder.png"
                  }
                  alt={alt || "Image"}
                  fill
                  className="object-contain z-10"
                />
              </div>
              <div className="p-6 space-y-6 text-black w-[30%] flex flex-col justify-start items-start h-full bg-white">
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-black">
                    Image Details
                  </h3>
                  <p className="text-sm">Information about this generation</p>
                </div>

                <div className="space-y-4">
                  {prompt && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Prompt</h4>
                      <Badge
                        variant="outline"
                        className="bg-black/20 text-black px-4 py-2"
                      >
                        {prompt}
                      </Badge>
                    </div>
                  )}

                  {aspectRatio && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Aspect Ratio</h4>
                      <Badge
                        variant="outline"
                        className="bg-black/20 text-black"
                      >
                        {aspectRatio}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-1">Mode</h4>
                    <Badge
                      variant="outline"
                      className="bg-black/20 text-black px-4 py-2"
                    >
                      {(() => {
                        // Use explicit mode prop if provided
                        if (mode) {
                          return mode;
                        }
                        
                        // Fallback: determine mode from current URL or default to Premium
                        if (typeof window !== 'undefined') {
                          const path = window.location.pathname;
                          if (path.includes('/standard')) return 'Standard';
                          if (path.includes('/premium')) return 'Premium';
                          if (path.includes('/upscale')) return 'Upscale';
                          if (path.includes('/remove-background')) return 'Remove Background';
                        }
                        
                        // Default fallback
                        return 'Premium';
                      })()}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium mb-3">Actions</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="text-black border-black/20 hover:opacity-80"
                      onClick={onShare}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="text-black border-black/20 hover:opacity-80 w-max"
                      onClick={onDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageViewer;
