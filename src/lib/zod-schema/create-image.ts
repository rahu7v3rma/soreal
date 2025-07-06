import {
  validAspectRatios as premiumValidAspectRatios,
  validFileFormats as premiumValidFileFormats,
  premiumDefaultAspectRatio,
  premiumDefaultFileFormat,
} from "@/constants/create-image/premium";
import {
  defaultStyle as standardImageDefaultStyle,
  defaultAspectRatio as standardImageDefaultAspectRatio,
  validAspectRatios as standardImageValidAspectRatios,
} from "@/constants/create-image/standard";
import {
  defaultScale as upscaleDefaultScale,
  validScales as upscaleValidScales,
} from "@/constants/create-image/upscale";
import { STANDARD_STYLE_PRESETS } from "@/constants/styles";
import { z } from "zod";

export const premiumRequestBodySchema = z
  .object({
    prompt: z.string().max(1000).default(""),
    aspectRatio: z
      .enum(premiumValidAspectRatios as [string, ...string[]])
      .default(premiumDefaultAspectRatio),
    imagePromptUrl: z.string().max(1000).optional(),
    fileFormat: z
      .enum(premiumValidFileFormats as [string, ...string[]])
      .default(premiumDefaultFileFormat),
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
  style: z
    .enum(Object.keys(STANDARD_STYLE_PRESETS) as [string, ...string[]])
    .default(standardImageDefaultStyle),
  aspectRatio: z
    .enum(standardImageValidAspectRatios as [string, ...string[]])
    .default(standardImageDefaultAspectRatio),
});

export const upscaleRequestBodySchema = z.object({
  imageUrl: z.string().min(1).max(1000),
  scale: z
    .number()
    .refine((val) => upscaleValidScales.includes(val), {
      message: "scale must be one of: " + upscaleValidScales.join(", "),
    })
    .default(upscaleDefaultScale),
});
