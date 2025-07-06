import { REMOVE_BACKGROUND_IMAGE_CREDITS } from "@/constants/credits";
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
import { removeBackgroundRequestBodySchema } from "@/lib/zod-schema/create-image";

export const POST = withMiddlewares(
  authMiddleware("create_image", "remove-background"),
  validateRequestBodyMiddleware(removeBackgroundRequestBodySchema),
  validateRequestBodyImageUrlMiddleware("imageUrl"),
  creditRequirementMiddleware(REMOVE_BACKGROUND_IMAGE_CREDITS),
  generateReplicateImageMiddleware("remove-background"),
  saveImageMiddleware("remove-background"),
  sendEmailMiddleware,
  deductCreditsMiddleware(REMOVE_BACKGROUND_IMAGE_CREDITS),
  responseMiddleware("remove-background")
);
