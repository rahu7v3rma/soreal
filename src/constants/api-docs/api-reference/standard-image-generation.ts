import {
  validAspectRatios,
  validStylePresets,
  defaultStyle,
  defaultAspectRatio,
  standardImageApiUrl,
} from "@/constants/create-image/standard";
import { STANDARD_IMAGE_CREDITS } from "@/constants/credits";

export const apiEndpoints = [
  {
    name: "Standard Image Generation",
    endpoint: `${standardImageApiUrl}`,
    method: "POST",
    description: "Generate a new standard image based on a text prompt.",
    parameters: [
      {
        name: "prompt",
        type: "string",
        required: true,
        defaults: null,
        availableOptions: null,
        description: "The text prompt describing the image to generate",
      },
      {
        name: "style",
        type: "string",
        required: false,
        defaults: defaultStyle,
        options: validStylePresets.join(", "),
        description: `Style of the generated image. Standard tier is limited to specific presets only. Custom style keywords are not supported in the standard tier.`,
      },
      {
        name: "aspectRatio",
        type: "string",
        required: false,
        defaults: defaultAspectRatio,
        options: validAspectRatios.join(", "),
        description: `Aspect ratio of the output image.`,
      },
    ],
    response: `{
  "success": true,
  "message": "Standard image generated successfully",
  "data": {
    "imageUrl": "https://api.soreal.app/assets/users/1/generations/1749381948150.png",
    "creditBalance": 1000
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
