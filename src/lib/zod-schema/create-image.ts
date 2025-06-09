import { z } from "zod";
import { validAspectRatios as standardValidAspectRatios } from "@/constants/create-image/standard";
import {
  validAspectRatios as premiumValidAspectRatios,
  validFileFormats as premiumValidFileFormats,
} from "@/constants/create-image/premium";
import { validScales as upscaleValidScales } from "@/constants/create-image/upscale";

export const premiumRequestBodySchema = z
  .object({
    prompt: z.string().min(1).max(1000).optional(),
    style: z.string().min(1).max(1000).optional(),
    aspectRatio: z
      .string()
      .min(1)
      .max(10)
      .refine(
        (val) => {
          if (val === undefined) return true;
          return premiumValidAspectRatios.includes(val);
        },
        {
          message:
            "aspectRatio must be one of: " +
            premiumValidAspectRatios.join(", "),
        }
      )
      .optional(),
    imagePromptUrl: z.string().min(1).max(1000).optional(),
    imagePromptStrength: z.number().min(0).max(1).optional(),
    fileFormat: z
      .string()
      .min(1)
      .max(10)
      .refine(
        (val) => {
          if (val === undefined) return true;
          return premiumValidFileFormats.includes(val);
        },
        {
          message:
            "fileFormat must be one of: " + premiumValidFileFormats.join(", "),
        }
      )
      .optional(),
  })
  .refine(
    (data) => {
      return data.prompt !== undefined || data.imagePromptUrl !== undefined;
    },
    {
      message: "Either prompt or imagePromptUrl is required",
      path: ["prompt", "imagePromptUrl"],
    }
  );

export const removeBackgroundRequestBodySchema = z.object({
  imageUrl: z.string().min(1).max(1000),
});

export const standardRequestBodySchema = z.object({
  prompt: z.string().min(1).max(500),
  style: z.string().min(1).max(1000).optional(),
  aspectRatio: z
    .string()
    .min(1)
    .max(10)
    .refine(
      (val) => {
        if (val === undefined) return true;
        return standardValidAspectRatios.includes(val);
      },
      {
        message:
          "aspectRatio must be a one of: " +
          standardValidAspectRatios.join(", "),
      }
    )
    .optional(),
});

export const upscaleRequestBodySchema = z.object({
  imageUrl: z.string().min(1).max(1000),
  scale: z
    .number()
    .refine((val) => upscaleValidScales.includes(val), {
      message: "scale must be one of: " + upscaleValidScales.join(", "),
    })
    .optional(),
});
