import {
  defaultScale,
  validScales,
  upscaleApiUrl,
} from "@/constants/create-image/upscale";
import { UPSCALE_IMAGE_CREDITS } from "@/constants/credits";

export const apiEndpoints = [
  {
    name: "Upscale Image",
    endpoint: `${upscaleApiUrl}`,
    method: "POST",
    description: "Upscale an existing image to a higher resolution.",
    parameters: [
      {
        name: "imageUrl",
        type: "string",
        required: true,
        defaults: null,
        options: null,
        description:
          "URL of the image to upscale. Must be a valid and accessible image URL.",
      },
      {
        name: "scale",
        type: "number",
        required: false,
        defaults: defaultScale,
        options: validScales.join(", "),
        description: "Scale factor for image upscaling.",
      },
    ],
    response: `{
    "success": true,
    "message": "Image upscaled successfully",
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
      rate: "5 requests per minute",
      tier: {
        basic: "100 calls/month",
        professional: "500 calls/month",
        enterprise: "2,000+ calls/month",
      },
      credits: UPSCALE_IMAGE_CREDITS,
    },
  },
];
