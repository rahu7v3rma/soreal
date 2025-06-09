import { validScales } from "@/constants/create-image/upscale";
import { UPSCALE_IMAGE_CREDITS } from "@/constants/credits";

export const apiEndpoints = [
  {
    name: "Upscale Image",
    endpoint: `https://api.soreal.app/create-image/upscale`,
    method: "POST",
    description: "Upscale an existing image to a higher resolution.",
    parameters: [
      {
        name: "imageUrl",
        type: "string",
        required: true,
        description:
          "URL of the image to upscale. Must be a valid and accessible image URL.",
      },
      {
        name: "scale",
        type: "number",
        required: false,
        description: `Scale factor. Valid values are ${validScales.join(", ")}`,
      },
    ],
    response: `{
    "success": true,
    "message": "Image generated successfully",
    "data": "https://api.soreal.app/assets/users/1/generations/1749381948150.png"
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
