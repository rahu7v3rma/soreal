import { PREMIUM_IMAGE_CREDITS } from "@/constants/credits";
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
  withMiddlewares
} from "@/lib/middlewares/image";
import { premiumRequestBodySchema } from "@/lib/zod-schema/create-image";

export const POST = withMiddlewares(
  authMiddleware("create_image", "premium"),
  validateRequestBodyMiddleware(premiumRequestBodySchema),
  validateRequestBodyImageUrlMiddleware("imagePromptUrl"),
  creditRequirementMiddleware(PREMIUM_IMAGE_CREDITS),
  generateReplicateImageMiddleware("premium"),
  saveImageMiddleware("premium"),
  sendEmailMiddleware,
  deductCreditsMiddleware(PREMIUM_IMAGE_CREDITS),
  responseMiddleware("premium")
);
