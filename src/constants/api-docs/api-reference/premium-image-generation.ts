import {
  textToImageAspectRatios,
  imageToImageAspectRatios,
  validAspectRatios,
  validFileFormats,
  premiumDefaultAspectRatio,
  premiumDefaultFileFormat,
  premiumImageApiUrl,
} from "@/constants/create-image/premium";
import { PREMIUM_IMAGE_CREDITS } from "@/constants/credits";

export const apiEndpoints = [
  {
    name: "Premium Image Generation",
    endpoint: `${premiumImageApiUrl}`,
    method: "POST",
    description:
      "Generate ultra-high-quality images using advanced AI models for both text prompts and image references. Includes automatic quality enhancement.",
    parameters: [
      {
        name: "prompt",
        type: "string",
        required: false,
        defaults: null,
        options: null,
        description:
          "The detailed text prompt describing the image to generate. Either prompt or imagePromptUrl is required. Universal quality enhancement is automatically applied.",
      },
      {
        name: "aspectRatio",
        type: "string",
        required: false,
        defaults: premiumDefaultAspectRatio,
        options: validAspectRatios.join(", "),
        description: `Aspect ratio of the output image. When using text-only generation: ${textToImageAspectRatios.join(", ")}. When using a reference image: ${imageToImageAspectRatios.join(", ")}.`,
      },
      {
        name: "imagePromptUrl",
        type: "string",
        required: false,
        defaults: null,
        options: null,
        description:
          "URL of an image to use as reference. When provided, the system will use the image as a reference for generation. Either prompt or imagePromptUrl is required.",
      },
      {
        name: "fileFormat",
        type: "string",
        required: false,
        defaults: premiumDefaultFileFormat,
        options: validFileFormats.join(", "),
        description: "Output file format for the generated image.",
      },
    ],
    response: `{
  "success": true,
  "message": "Premium image generated successfully",
  "data": {
    "imageUrl": "https://api.soreal.app/assets/users/1/generations/1749381948150.png",
    "creditBalance": 940
  }
}`,
    errorCodes: [
      {
        code: 400,
        message: "Bad Request - Invalid parameters, Insufficient credits",
      },
      { code: 401, message: "Unauthorized - Invalid API key" },
      { code: 429, message: "Too Many Requests - Rate limit exceeded" },
      { code: 500, message: "Internal Server Error" },
    ],
    limits: {
      rate: "5 requests per minute",
      tier: {
        basic: "500 calls/month",
        professional: "2,500 calls/month",
        enterprise: "10,000+ calls/month",
      },
      credits: PREMIUM_IMAGE_CREDITS,
    },
  },
];
