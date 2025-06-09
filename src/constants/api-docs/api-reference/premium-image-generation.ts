import { validAspectRatios } from "@/constants/create-image/premium";
import { PREMIUM_IMAGE_CREDITS } from "@/constants/credits";

export const apiEndpoints = [
  {
    name: "Premium Image Generation",
    endpoint: `https://api.soreal.app/create-image/premium`,
    method: "POST",
    description:
      "Generate a high-quality image with advanced controls and parameters for detailed customization.",
    parameters: [
      {
        name: "prompt",
        type: "string",
        required: true,
        description:
          "The detailed text prompt describing the image to generate",
      },
      {
        name: "style",
        type: "string",
        required: false,
        description:
          "Style of the generated image (e.g., photorealistic, anime, sketch, oil painting, watercolor)",
      },
      {
        name: "aspectRatio",
        type: "string",
        required: false,
        description:
          `Aspect ratio of the output image. Valid values: ${validAspectRatios.join(", ")}`,
      },
      {
        name: "imagePromptUrl",
        type: "string",
        required: false,
        description:
          "URL of an image to use as reference",
      },
      {
        name: "imagePromptStrength",
        type: "number",
        required: false,
        description:
          "Controls how closely the generation follows the reference image. Valid values are between 0 and 1",
      },
      {
        name: "fileFormat",
        type: "string",
        required: false,
        description:
          "Output file format for the generated image. Valid values: png, jpg",
      },
    ],
    response: `{
  "success": true,
  "message": "Image generated successfully",
  "data": "https://api.soreal.app/assets/users/1/generations/1749381948150.png"
}`,
    errorCodes: [
      { code: 400, message: "Bad Request - Invalid parameters, Insufficient credits" },
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
