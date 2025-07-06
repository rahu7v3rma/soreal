import { UPSCALE_IMAGE_CREDITS } from "@/constants/credits";
import {
  authMiddleware,
  creditRequirementMiddleware,
  deductCreditsMiddleware,
  generateReplicateImageMiddleware,
  responseMiddleware,
  saveImageMiddleware,
  sendEmailMiddleware,
  validateRequestBodyImageUrlMiddleware,
  validateRequestBodyMiddleware,
  withMiddlewares,
} from "@/lib/middlewares/image";
import { upscaleRequestBodySchema } from "@/lib/zod-schema/create-image";

export const POST = withMiddlewares(
  authMiddleware("create_image", "upscale"),
  validateRequestBodyMiddleware(upscaleRequestBodySchema),
  validateRequestBodyImageUrlMiddleware("imageUrl"),
  creditRequirementMiddleware(UPSCALE_IMAGE_CREDITS),
  generateReplicateImageMiddleware("upscale"),
  saveImageMiddleware("upscale"),
  sendEmailMiddleware,
  deductCreditsMiddleware(UPSCALE_IMAGE_CREDITS),
  responseMiddleware("upscale")
);
