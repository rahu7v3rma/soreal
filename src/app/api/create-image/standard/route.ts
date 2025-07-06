import { STANDARD_IMAGE_CREDITS } from "@/constants/credits";
import {
  authMiddleware,
  creditRequirementMiddleware,
  deductCreditsMiddleware,
  generateReplicateImageMiddleware,
  responseMiddleware,
  saveImageMiddleware,
  sendEmailMiddleware,
  validateRequestBodyMiddleware,
  withMiddlewares,
} from "@/lib/middlewares/image";
import { standardRequestBodySchema } from "@/lib/zod-schema/create-image";

export const POST = withMiddlewares(
  authMiddleware("create_image", "standard"),
  validateRequestBodyMiddleware(standardRequestBodySchema),
  creditRequirementMiddleware(STANDARD_IMAGE_CREDITS),
  generateReplicateImageMiddleware("standard"),
  saveImageMiddleware("standard"),
  sendEmailMiddleware,
  deductCreditsMiddleware(STANDARD_IMAGE_CREDITS),
  responseMiddleware("standard")
);
