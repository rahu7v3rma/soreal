import {
  premiumRequestBodySchema,
  removeBackgroundRequestBodySchema,
  standardRequestBodySchema,
  upscaleRequestBodySchema,
} from "@/lib/zod-schema/create-image";
import {
  PREMIUM_IMAGE_MODEL,
  REMOVE_BACKGROUND_IMAGE_VERSION,
  STANDARD_IMAGE_MODEL,
  UPSCALE_IMAGE_VERSION,
} from "@/constants/replicate";
import { sendImageGenerationEmail } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import Replicate, { Prediction } from "replicate";
import { z, ZodSchema } from "zod";
import { SUPABASE_URL } from "@/constants/supabase";

const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  generationsNotification: z.boolean(),
  creditBalance: z.number(),
});

export interface ImageGenerationRequest extends NextRequest {
  user: z.infer<typeof authUserSchema>;
  parsedRequestBody: Record<string, string | number>;
  replicateOutputUrl: string;
  imagePublicUrl: string;
  replicateInput?: {
    prompt?: string;
    go_fast?: boolean;
    megapixels?: string;
    num_outputs?: number;
    aspect_ratio?: string;
    output_format?: string;
    output_quality?: number;
    num_inference_steps?: number;
    raw?: boolean;
    safety_tolerance?: number;
    image_prompt?: string;
    image_prompt_strength?: number;
    image?: string;
    resolution?: string;
    scale?: number;
    face_enhance?: boolean;
  };
  creditRequirement?: number;
}

export const authMiddleware = (
  apiKeyAccessType: "create_image" | "get_image"
) => {
  return async (request: ImageGenerationRequest) => {
    try {
      const authorization = request.headers.get("authorization");
      if (!authorization) {
        throw new Error("unauthorized", { cause: { authorization } });
      }

      let authType = "accessToken";
      if (authorization.startsWith("Bearer ")) {
        authType = "apiKey";
      }

      if (authType === "accessToken") {
        const getUser = await supabaseAdmin.auth.getUser(authorization);
        if (!getUser.data.user) {
          throw new Error("unauthorized", { cause: { getUser } });
        }

        const getUserProfile = await supabaseAdmin
          .from("user_profiles")
          .select("*")
          .eq("user_id", getUser.data.user?.id)
          .single();
        if (!getUserProfile.data) {
          throw new Error("failed to get user profile", {
            cause: { getUserProfile },
          });
        }

        const getUserCredits = await supabaseAdmin
          .from("user_credits")
          .select("*")
          .eq("user_id", getUser.data.user?.id)
          .single();
        if (!getUserCredits.data) {
          throw new Error("failed to get user credits", {
            cause: { getUserCredits },
          });
        }

        const parsedUser = authUserSchema.safeParse({
          id: getUser.data.user?.id,
          email: getUser.data.user?.email,
          generationsNotification:
            getUserProfile.data.generations_notification || false,
          creditBalance: getUserCredits.data.credit_balance || 0,
        });
        if (!parsedUser.success) {
          throw new Error("failed to parse user", {
            cause: { parsedUserError: parsedUser.error.flatten().fieldErrors },
          });
        }

        request.user = parsedUser.data;
      }

      if (authType === "apiKey") {
        const requestApiKey = authorization.replace("Bearer ", "");
        if (!requestApiKey) {
          throw new Error("unauthorized", {
            cause: { requestApiKey, authorization },
          });
        }

        const getUserApiKey = await supabaseAdmin
          .from("user_api_keys")
          .select("*")
          .eq("api_key", requestApiKey)
          .filter("revoked", "not.is", true)
          .eq(apiKeyAccessType, true)
          .single();
        if (!getUserApiKey.data) {
          throw new Error("unauthorized", {
            cause: { getUserApiKey },
          });
        }

        const getUser = await supabaseAdmin.auth.admin.getUserById(
          getUserApiKey.data.user_id
        );
        if (!getUser.data?.user) {
          throw new Error("Failed to get user", {
            cause: { getUser },
          });
        }

        const getUserProfile = await supabaseAdmin
          .from("user_profiles")
          .select("*")
          .eq("user_id", getUser.data.user.id)
          .single();
        if (!getUserProfile.data) {
          throw new Error("Failed to get user profile", {
            cause: { getUserProfile },
          });
        }

        const getUserCredits = await supabaseAdmin
          .from("user_credits")
          .select("*")
          .eq("user_id", getUser.data.user.id)
          .single();
        if (!getUserCredits.data) {
          throw new Error("Failed to get user credits", {
            cause: { getUserCredits },
          });
        }

        const parsedUser = authUserSchema.safeParse({
          id: getUser.data.user.id,
          email: getUser.data.user.email,
          generationsNotification:
            getUserProfile.data.generations_notification || false,
          creditBalance: getUserCredits.data.credit_balance || 0,
        });
        if (!parsedUser.success) {
          throw new Error("failed to parse user", {
            cause: { parsedUserError: parsedUser.error.flatten().fieldErrors },
          });
        }

        request.user = parsedUser.data;
      }
    } catch (error: any) {
      const valid401Messages = ["unauthorized"];
      if (valid401Messages.includes(error?.message)) {
        return NextResponse.json(
          { success: false, message: error?.message, data: null },
          { status: 401 }
        );
      }

      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 401 }
      );
    }
  };
};

export const validateRequestBodyMiddleware = (zodSchema: ZodSchema) => {
  return async (request: ImageGenerationRequest) => {
    try {
      const requestBody = await request.json();

      const parsedRequestBody = zodSchema.safeParse(requestBody);
      if (!parsedRequestBody.success) {
        throw new Error("Invalid request body", {
          cause: {
            responseData: parsedRequestBody.error.flatten().fieldErrors,
          },
        });
      }

      request.parsedRequestBody = parsedRequestBody.data;

    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          data: error?.cause?.responseData || null,
        },
        { status: 400 }
      );
    }
  };
};

export const validateRequestBodyImageUrlMiddleware = (
  requestBodyKey: string
) => {
  return async (request: ImageGenerationRequest) => {
    try {
      const imageUrl = request.parsedRequestBody[requestBodyKey];
      if (imageUrl) {
        const imageUrlResponse = await axios.head(String(imageUrl));
        if (imageUrlResponse.status !== 200) {
          throw new Error(`invalid requestBodyKey: ${requestBodyKey}`, {
            cause: {
              requestBodyKey,
              imageUrlResponse,
            },
          });
        }

        const imageUrlType = imageUrlResponse.headers["content-type"];
        if (!imageUrlType?.includes("image/")) {
          throw new Error(`invalid requestBodyKey: ${requestBodyKey}`, {
            cause: {
              requestBodyKey,
              imageUrlResponse,
              imageUrlType,
            },
          });
        }
      }
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body image url",
          data: null,
        },
        { status: 400 }
      );
    }
  };
};

export const creditRequirementMiddleware = (creditRequirement: number) => {
  return async (request: ImageGenerationRequest) => {
    try {
      if (isNaN(creditRequirement)) {
        throw new Error("creditRequirement is not a number", {
          cause: { request },
        });
      }

      if (isNaN(request.user.creditBalance)) {
        throw new Error("user.creditBalance is not a number", {
          cause: { request },
        });
      }

      if (request.user.creditBalance < creditRequirement) {
        throw new Error(
          "You don't have enough credits to generate an image. Please purchase more credits.",
          {
            cause: { request },
          }
        );
      }

      request.creditRequirement = creditRequirement;
    } catch (error: any) {
      const valid400Messages = [
        "You don't have enough credits to generate an image. Please purchase more credits.",
      ];
      if (valid400Messages.includes(error?.message)) {
        return NextResponse.json(
          { success: false, message: error?.message, data: null },
          { status: 400 }
        );
      }

      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
};

export const generateReplicateImageMiddleware = (
  generateType: "standard" | "premium" | "remove-background" | "upscale"
) => {
  return async (request: ImageGenerationRequest) => {
    try {
      if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error("REPLICATE_API_TOKEN is not defined");
      }

      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
      if (!replicate) {
        throw new Error("Failed to initialize Replicate", {
          cause: { replicate },
        });
      }

      let replicateModel: string | null = null;
      let replicateVersion: string | null = null;
      if (generateType === "standard") {
        replicateModel = STANDARD_IMAGE_MODEL;
      }
      if (generateType === "premium") {
        replicateModel = PREMIUM_IMAGE_MODEL;
      }
      if (generateType === "remove-background") {
        replicateVersion = REMOVE_BACKGROUND_IMAGE_VERSION;
      }
      if (generateType === "upscale") {
        replicateVersion = UPSCALE_IMAGE_VERSION;
      }

      if (generateType === "standard" || generateType === "premium") {
        if (!replicateModel) {
          throw new Error("replicateModel is not defined", {
            cause: { replicateModel },
          });
        }
      }

      if (generateType === "remove-background" || generateType === "upscale") {
        if (!replicateVersion) {
          throw new Error("replicateVersion is not defined", {
            cause: { replicateVersion },
          });
        }
      }

      request.replicateInput = {};
      if (generateType === "standard") {
        let { prompt, style, aspectRatio } =
          request.parsedRequestBody as z.infer<
            typeof standardRequestBodySchema
          >;

        if (style) {
          prompt = prompt + `, ${style}`;
        }

        if (!aspectRatio) {
          aspectRatio = "1:1";
        }

        request.replicateInput = {
          prompt: prompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 80,
          num_inference_steps: 4,
        };
      }
      if (generateType === "premium") {
        let {
          prompt,
          style,
          aspectRatio,
          fileFormat,
          imagePromptUrl,
          imagePromptStrength,
        } = request.parsedRequestBody as z.infer<
          typeof premiumRequestBodySchema
        >;

        if (!prompt) {
          prompt = "";
        }
        if (style) {
          prompt = prompt + `, ${style}`;
        }

        if (!aspectRatio) {
          aspectRatio = "1:1";
        }

        if (!fileFormat) {
          fileFormat = "png";
        }

        let imagePromptUrlParams:
          | {
              image_prompt: string;
              image_prompt_strength: number;
            }
          | {} = {};
        if (imagePromptUrl) {
          if (!imagePromptStrength) {
            imagePromptStrength = 0.1;
          }

          imagePromptUrlParams = {
            image_prompt: imagePromptUrl,
            image_prompt_strength: imagePromptStrength,
          };
        }

        request.replicateInput = {
          raw: true,
          prompt: prompt,
          aspect_ratio: aspectRatio,
          output_format: fileFormat,
          safety_tolerance: 4,
          ...imagePromptUrlParams,
        };
      }
      if (generateType === "remove-background") {
        const { imageUrl } = request.parsedRequestBody as z.infer<
          typeof removeBackgroundRequestBodySchema
        >;
        request.replicateInput = {
          image: imageUrl,
          resolution: "",
        };
      }
      if (generateType === "upscale") {
        let { imageUrl, scale } = request.parsedRequestBody as z.infer<
          typeof upscaleRequestBodySchema
        >;

        if (!scale) {
          scale = 4;
        }

        request.replicateInput = {
          image: imageUrl,
          scale: scale,
          face_enhance: true,
        };
      }

      if (!Object.keys(request.replicateInput).length) {
        throw new Error("replicateInput is not defined", {
          cause: { replicateInput: request.replicateInput },
        });
      }

      let prediction: Prediction | null = null;

      if (generateType === "standard" || generateType === "premium") {
        if (replicateModel) {
          const replicateInputs = {
            model: replicateModel,
            input: request.replicateInput,
          };

          prediction = await replicate.predictions.create(replicateInputs);
        }
      }

      if (generateType === "remove-background" || generateType === "upscale") {
        if (replicateVersion) {
          const replicateInputs = {
            version: replicateVersion,
            input: request.replicateInput,
          };

          prediction = await replicate.predictions.create(replicateInputs);
        }
      }

      if (!prediction) {
        throw new Error("Failed to create prediction", {
          cause: { prediction },
        });
      }

      if (!prediction?.id) {
        throw new Error("Failed to create prediction", {
          cause: { prediction },
        });
      }

      const maxTries = 10;
      let tries = 0;
      let getPrediction;
      while (tries < maxTries) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        getPrediction = await replicate.predictions.get(prediction.id);
        if (
          !getPrediction ||
          getPrediction?.status?.match(/failed|canceled/i)
        ) {
          throw new Error("Failed to get prediction", {
            cause: { getPrediction },
          });
        }
        if (getPrediction?.status?.match(/succeeded/i)) {
          break;
        }
        tries++;
      }

      let outputUrl: string | null = null;
      if (generateType === "standard") {
        outputUrl = getPrediction?.output?.[0];
      }
      if (
        generateType === "premium" ||
        generateType === "upscale" ||
        generateType === "remove-background"
      ) {
        outputUrl = getPrediction?.output;
      }
      if (!outputUrl) {
        throw new Error("Failed to get prediction output", {
          cause: { getPrediction },
        });
      }

      request.replicateOutputUrl = outputUrl;
    } catch (error: any) {
      const validReplicateErrorMessages = [
        "Error generating image: NSFW content detected",
      ];
      if (
        validReplicateErrorMessages.includes(error?.cause?.getPrediction?.error)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error?.cause?.getPrediction?.error,
            data: null,
          },
          { status: 400 }
        );
      }

      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
};

export const saveImageMiddleware = (
  generationType: "standard" | "premium" | "remove-background" | "upscale"
) => {
  return async (request: ImageGenerationRequest) => {
    try {
      const imageResponse = await axios.get(request.replicateOutputUrl, {
        responseType: "arraybuffer",
      });
      if (!imageResponse.data) {
        throw new Error("Failed to get imageResponse", {
          cause: { imageResponse },
        });
      }

      const imageBuffer = Buffer.from(imageResponse.data, "binary");

      let fileFormat = "webp";
      if (generationType === "premium") {
        if (!request.parsedRequestBody.fileFormat) {
          fileFormat = "png";
        } else {
          fileFormat = String(request.parsedRequestBody.fileFormat);
        }
      }

      const fileName = `users/${request.user.id}/generations/${Date.now()}.${fileFormat}`;

      const uploadImageResponse = await supabaseAdmin.storage
        .from("assets")
        .upload(fileName, imageBuffer, {
          contentType: `image/${fileFormat}`,
        });
      if (uploadImageResponse.error) {
        throw new Error("Failed to upload image to supabase", {
          cause: { uploadImageResponse },
        });
      }

      const getImageResponse = supabaseAdmin.storage
        .from("assets")
        .getPublicUrl(fileName);
      if (!getImageResponse.data?.publicUrl) {
        throw new Error("Failed to get supabase public URL", {
          cause: { getImageResponse },
        });
      }

      const publicUrl = getImageResponse.data.publicUrl.replace(
        SUPABASE_URL + "/storage/v1/object/public/assets",
        `https://api.soreal.app/assets`
      );
      if (!publicUrl) {
        throw new Error("Failed to get supabase public URL", {
          cause: { getImageResponse },
        });
      }

      const saveGenerationResponse = await supabaseAdmin
        .from("user_generations")
        .insert({
          user_id: request.user.id,
          public_url: publicUrl,
          prompt: request.parsedRequestBody?.prompt || null,
          aspect_ratio: request.replicateInput?.aspect_ratio || null,
          generation_type: generationType,
          style: request.parsedRequestBody.style || null,
          image_prompt_url: request.replicateInput?.image_prompt || null,
          image_prompt_strength:
            request.replicateInput?.image_prompt_strength || null,
          image_url: request.replicateInput?.image || null,
          scale: request.replicateInput?.scale || null,
          credit_requirement: request.creditRequirement || null,
        })
        .select()
        .single();
      if (!saveGenerationResponse.data?.public_url) {
        throw new Error("Failed to save image row", {
          cause: { saveGenerationResponse },
        });
      }

      request.imagePublicUrl = saveGenerationResponse.data.public_url;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
};

export const sendEmailMiddleware = async (request: ImageGenerationRequest) => {
  try {
    if (request.user.generationsNotification) {
      const sendEmailResponse = await sendImageGenerationEmail(
        request.user.email,
        request.imagePublicUrl
      );
      if (sendEmailResponse.error) {
        throw new Error("Failed to send email", {
          cause: { sendEmailResponse },
        });
      }
    }
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        cause: error?.cause,
      },
    });

    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
};

export const deductCreditsMiddleware = (creditRequirement: number) => {
  return async (request: ImageGenerationRequest) => {
    try {
      if (isNaN(creditRequirement)) {
        throw new Error("creditRequirement is not a number", {
          cause: { request },
        });
      }

      if (isNaN(request.user.creditBalance)) {
        throw new Error("user.creditBalance is not a number", {
          cause: { request },
        });
      }

      const deductCreditsResponse = await supabaseAdmin
        .from("user_credits")
        .update({
          credit_balance: request.user.creditBalance - creditRequirement,
        })
        .eq("user_id", request.user.id);
      if (deductCreditsResponse.error) {
        throw new Error("Failed to deduct credits", {
          cause: { deductCreditsResponse },
        });
      }
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
};

export const responseMiddleware = async (request: ImageGenerationRequest) => {
  try {
    return NextResponse.json(
      {
        success: true,
        message: "Image generated successfully",
        data: request.imagePublicUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        cause: error?.cause,
      },
    });

    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
};

export const withMiddlewares = (
  ...middlewares: ((
    request: ImageGenerationRequest
  ) => Promise<NextResponse<any> | undefined>)[]
) => {
  return async (request: NextRequest) => {
    const extendedRequest = request as ImageGenerationRequest;
    for (const middleware of middlewares) {
      const response = await middleware(extendedRequest);
      if (response) return response;
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  };
};
