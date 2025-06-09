import { validAspectRatios } from "@/constants/create-image/standard";
import { STANDARD_IMAGE_CREDITS } from "@/constants/credits";

export const apiEndpoints = [
  {
    name: "Standard Image Generation",
    endpoint: `https://api.soreal.app/create-image/standard`,
    method: "POST",
    description: "Generate a new standard image based on a text prompt.",
    parameters: [
      {
        name: "prompt",
        type: "string",
        required: true,
        description: "The text prompt describing the image to generate",
      },
      {
        name: "style",
        type: "string",
        required: false,
        description:
          "Style of the generated image (e.g., photorealistic, anime, sketch)",
      },
      {
        name: "aspectRatio",
        type: "string",
        required: false,
        description: `Aspect ratio of the output image. Valid values: ${validAspectRatios.join(", ")}`,
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
      rate: "10 requests per minute",
      tier: {
        basic: "1,000 calls/month",
        professional: "5,000 calls/month",
        enterprise: "20,000+ calls/month",
      },
      credits: STANDARD_IMAGE_CREDITS,
    },
  },
];
