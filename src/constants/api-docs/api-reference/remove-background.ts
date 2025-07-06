import { REMOVE_BACKGROUND_IMAGE_CREDITS } from "@/constants/credits";
import { removeBackgroundApiUrl } from "@/constants/create-image/remove-background";

export const apiEndpoints = [
  {
    name: "Remove Background",
    endpoint: `${removeBackgroundApiUrl}`,
    method: "POST",
    description: "Remove the background from an existing image.",
    parameters: [
      {
        name: "imageUrl",
        type: "string",
        required: true,
        description:
          "URL of the image to process. Must be a valid and accessible image URL.",
      },
    ],
    response: `{
    "success": true,
    "message": "Image generated successfully",
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
        basic: "200 calls/month",
        professional: "1,000 calls/month",
        enterprise: "5,000+ calls/month",
      },
      credits: REMOVE_BACKGROUND_IMAGE_CREDITS,
    },
  },
];
