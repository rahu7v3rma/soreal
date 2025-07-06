"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSupabase } from "@/context/supabase";
import { HelpCircle, Loader, Upload as UploadIcon, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useTestImageUrl } from "@/hooks/create-image";

const FileUpload = ({
  uploadedImageUrl,
  setUploadedImageUrl,
}: {
  uploadedImageUrl: string;
  setUploadedImageUrl: (url: string) => void;
}) => {
  const { uploadImage, uploadImageLoading } = useSupabase();
  const { isTestingUrl, testImageUrl } = useTestImageUrl();

  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const uploadedImage = await uploadImage(file, "reference");
    if (uploadedImage) {
      setUploadedImageUrl(uploadedImage);
    }

    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedImage = await uploadImage(file, "reference");
    if (uploadedImage) {
      setUploadedImageUrl(uploadedImage);
    }

    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <label
            htmlFor="image-prompt"
            className="text-sm font-medium flex items-center"
          >
            <UploadIcon className="h-4 w-4 mr-1 text-blue-500" />
            Reference Image
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
              <TooltipContent side="top" align="start" className="max-w-sm p-4">
                <h4 className="font-medium mb-2">Using Reference Images:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    Upload a reference image to influence the generated result
                  </li>
                  <li>Supported formats: JPEG, PNG, GIF, WebP</li>
                  <li>Maximum file size: 5MB</li>
                  <li>
                    Use the strength slider to control how much the reference
                    image influences the result
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div
        onClick={handleFileClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-[120px] cursor-pointer border-2 border-dashed ${isDragging ? "border-primary border-solid bg-primary/5" : "border-gray-300"} rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground mt-4 hover:border-primary/50`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-y-2">
          {uploadImageLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm">Uploading...</p>
            </>
          ) : isDragging ? (
            <>
              <UploadIcon size={20} className="text-primary" />
              <p className="text-sm font-medium text-primary">Drop to upload</p>
            </>
          ) : (
            <>
              <UploadIcon size={20} className="text-muted-foreground" />
              <p className="text-sm">Upload file</p>
              <div className="flex flex-col items-center gap-y-1">
                <p className="text-xs text-muted-foreground">
                  Drag and drop or{" "}
                  <span className="underline cursor-pointer transition hover:text-foreground">
                    select file
                  </span>{" "}
                  to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {uploadedImageUrl && (
        <div className="mt-4 p-2 border rounded relative group">
          <img
            src={uploadedImageUrl}
            alt="Uploaded reference"
            className="w-full h-auto max-h-[200px] object-contain"
            width={500}
            height={200}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setUploadedImageUrl("");
              setImageUrl("");
            }}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="space-y-2 bg-muted/30 p-3 rounded-md border border-border/50 mt-4">
        <div className="flex items-center">
          <label
            htmlFor="manual-image-url"
            className="text-sm font-medium flex items-center"
          >
            <UploadIcon className="h-4 w-4 mr-1 text-blue-500" />
            Or enter an image URL
          </label>
        </div>
        <Input
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              const testImageResponse = await testImageUrl({ url: imageUrl });
              if (testImageResponse) {
                setUploadedImageUrl(imageUrl);
              }
            }}
          >
            {isTestingUrl ? (
              <>
                <Loader className="h-5 w-5 animate-spin text-primary" />{" "}
                Testing...
              </>
            ) : (
              "Use This URL"
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setUploadedImageUrl("");
              setImageUrl("");
            }}
            disabled={!uploadedImageUrl}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
