import {
  ARTISTIC_STYLE_KEYWORDS,
  PREMIUM_ARTISTIC_QUALITY_PROMPT,
  PREMIUM_REALISTIC_QUALITY_PROMPT,
} from "@/constants/create-image/premium";
import {
  PREMIUM_IMAGE_FALLBACK_MODEL,
  PREMIUM_IMAGE_MODEL,
  PREMIUM_TEXT_MODEL,
  REMOVE_BACKGROUND_IMAGE_VERSION,
  STANDARD_IMAGE_MODEL,
  UPSCALE_IMAGE_VERSION,
} from "@/constants/replicate";
import { STANDARD_STYLE_PRESETS } from "@/constants/styles";
import { SUPABASE_URL } from "@/constants/supabase";
import { sendImageGenerationEmail } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  premiumRequestBodySchema,
  removeBackgroundRequestBodySchema,
  standardRequestBodySchema,
  upscaleRequestBodySchema,
} from "@/lib/zod-schema/create-image";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import Replicate, { Prediction } from "replicate";
import { z, ZodSchema } from "zod";
import { logger } from "../logger";
import { planNames } from "@/constants/subscription";

const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  generationsNotification: z.boolean(),
  topupCreditBalance: z.number(),
  subscriptionCreditBalance: z.number(),
  totalCreditBalance: z.number(),
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
    input_image?: string;
    image?: string;
    resolution?: string;
    scale?: number;
    face_enhance?: boolean;
  };
  creditRequirement?: number;
  replicatePremiumImagePromptFallbackInput?: {
    prompt?: string;
    control_image?: string;
    output_format?: string;
    safety_tolerance?: number;
    steps?: number;
    guidance?: number;
    prompt_upsampling?: boolean;
  };
}

export const authMiddleware = (
  apiKeyAccessType: "create_image" | "get_image",
  generateType:
    | "standard"
    | "premium"
    | "remove-background"
    | "upscale"
    | "get-image"
) => {
  return async (request: ImageGenerationRequest) => {
    logger.info(`Generating image: ${generateType}`);
    try {
      const authorization = request.headers.get("authorization");

      if (!authorization) {
        throw new Error("unauthorized", { cause: { authorization } });
      }

      let authType = "accessToken";
      if (authorization.startsWith("Bearer ")) {
        authType = "apiKey";
      }

      const getUserDetails = async (
        userId: string,
        email?: string,
        authType: "accessToken" | "apiKey" = "accessToken"
      ) => {
        const getUserProfile = await supabaseAdmin
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (!getUserProfile.data) {
          throw new Error("Failed to get user profile", {
            cause: { getUserProfile },
          });
        }

        const getUserTopup = await supabaseAdmin
          .from("user_topup")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (!getUserTopup.data) {
          throw new Error("Failed to get user topup", {
            cause: { getUserTopup },
          });
        }

        const getUserSubscription = await supabaseAdmin
          .from("user_subscription")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (!getUserSubscription.data) {
          throw new Error("Failed to get user subscription", {
            cause: { getUserSubscription },
          });
        }

        if (authType === "apiKey") {
          if (getUserSubscription.data.plan_name !== planNames.growth) {
            throw new Error(
              `Please upgrade to ${planNames.growth} plan to use the API features.`,
              {
                cause: { getUserSubscription },
              }
            );
          }

          if (
            getUserSubscription.data.cancelled &&
            !getUserSubscription.data.subscription_end_date
          ) {
            throw new Error(
              "Subscription does not have an end date while being cancelled",
              {
                cause: { getUserSubscription },
              }
            );
          }

          if (getUserSubscription.data.subscription_end_date) {
            const subscriptionEndDate = new Date(
              getUserSubscription.data.subscription_end_date
            );
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (subscriptionEndDate <= today) {
              throw new Error(
                "Your subscription has expired. Please renew your subscription to continue using the API features.",
                {
                  cause: { getUserSubscription },
                }
              );
            }
          }
        }

        const totalCreditBalance =
          getUserTopup.data.credit_balance +
          getUserSubscription.data.credit_balance;

        const parsedUser = authUserSchema.safeParse({
          id: userId,
          email: email,
          generationsNotification: getUserProfile.data.generations_notification,
          topupCreditBalance: getUserTopup.data.credit_balance,
          subscriptionCreditBalance: getUserSubscription.data.credit_balance,
          totalCreditBalance,
        });
        if (!parsedUser.success) {
          throw new Error("failed to parse user", {
            cause: { parsedUserError: parsedUser.error.flatten().fieldErrors },
          });
        }

        return parsedUser.data;
      };

      if (authType === "accessToken") {
        const getUser = await supabaseAdmin.auth.getUser(authorization);
        if (!getUser.data.user) {
          throw new Error("unauthorized", { cause: { getUser } });
        }

        request.user = await getUserDetails(
          getUser.data.user.id,
          getUser.data.user.email,
          "accessToken"
        );
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

        request.user = await getUserDetails(
          getUserApiKey.data.user_id,
          getUser.data.user.email,
          "apiKey"
        );
      }

      logger.info(`Request user:`, {
        user: request.user,
      });
    } catch (error: any) {
      logger.error("Failed to get user", error);

      const valid401Messages = ["unauthorized"];
      if (valid401Messages.includes(error?.message)) {
        return NextResponse.json(
          { success: false, message: error?.message, data: null },
          { status: 401 }
        );
      }

      const valid403Messages = [
        `Please upgrade to ${planNames.growth} plan to use the API features.`,
        "Your subscription has expired. Please renew your subscription to continue using the API features.",
      ];
      if (valid403Messages.includes(error?.message)) {
        return NextResponse.json(
          { success: false, message: error?.message, data: null },
          { status: 403 }
        );
      }

      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
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
      let requestBody;
      try {
        requestBody = await request.json();
      } catch (bodyError: any) {
        throw new Error("Failed to parse request body", {
          cause: { bodyError: bodyError.message },
        });
      }

      const parsedRequestBody = zodSchema.safeParse(requestBody);
      if (!parsedRequestBody.success) {
        throw new Error("Invalid request body", {
          cause: {
            responseData: parsedRequestBody.error.flatten().fieldErrors,
          },
        });
      }

      request.parsedRequestBody = parsedRequestBody.data;

      logger.info(`Request body: `, request.parsedRequestBody);
    } catch (error: any) {
      if (error?.cause?.responseData) {
        logger.error(
          "Failed to validate request body",
          error?.cause?.responseData
        );
      } else {
        logger.error("Failed to validate request body", error);
      }

      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
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

      logger.info(`Request body image url`, {
        requestBodyKey,
        requestBody: request.parsedRequestBody,
      });
    } catch (error: any) {
      logger.error("Failed to validate request body image url", error);
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
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
      if (typeof creditRequirement !== "number") {
        throw new Error("creditRequirement is not a number", {
          cause: { request },
        });
      }

      if (typeof request.user.totalCreditBalance !== "number") {
        throw new Error("user.totalCreditBalance is not a number", {
          cause: { request },
        });
      }

      if (request.user.totalCreditBalance < creditRequirement) {
        throw new Error(
          "You don't have enough credits to generate an image. Please purchase more credits.",
          {
            cause: { request },
          }
        );
      }

      request.creditRequirement = creditRequirement;

      logger.info(`Credit requirement met`, {
        creditRequirement,
        topupCreditBalance: request.user.topupCreditBalance,
        subscriptionCreditBalance: request.user.subscriptionCreditBalance,
        totalCreditBalance: request.user.totalCreditBalance,
      });
    } catch (error: any) {
      logger.error("Failed to check credit requirement", error);
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
          cause: JSON.stringify(error?.cause),
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
      let replicatePremiumImagePromptFallbackModel: string | null = null;
      if (generateType === "standard") {
        replicateModel = STANDARD_IMAGE_MODEL;
      }
      if (generateType === "premium") {
        if (request.parsedRequestBody.imagePromptUrl) {
          replicateModel = PREMIUM_IMAGE_MODEL;
          replicatePremiumImagePromptFallbackModel =
            PREMIUM_IMAGE_FALLBACK_MODEL;
        } else {
          replicateModel = PREMIUM_TEXT_MODEL;
        }
      }
      if (generateType === "remove-background") {
        replicateVersion = REMOVE_BACKGROUND_IMAGE_VERSION;
      }
      if (generateType === "upscale") {
        replicateVersion = UPSCALE_IMAGE_VERSION;
      }

      request.replicateInput = {};
      request.replicatePremiumImagePromptFallbackInput = {};
      if (generateType === "standard") {
        let { prompt, style, aspectRatio } =
          request.parsedRequestBody as z.infer<
            typeof standardRequestBodySchema
          >;

        const resolvedStyle =
          STANDARD_STYLE_PRESETS[style as keyof typeof STANDARD_STYLE_PRESETS];
        prompt = prompt + `, ${resolvedStyle}`;

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
        let { prompt, aspectRatio, fileFormat, imagePromptUrl } =
          request.parsedRequestBody as z.infer<typeof premiumRequestBodySchema>;

        const isArtisticStyle = ARTISTIC_STYLE_KEYWORDS.some((keyword) =>
          prompt.toLowerCase().includes(keyword.toLowerCase())
        );
        const qualityPrompt = isArtisticStyle
          ? PREMIUM_ARTISTIC_QUALITY_PROMPT
          : PREMIUM_REALISTIC_QUALITY_PROMPT;
        if (prompt.length > 0) {
          prompt = `${prompt}, ${qualityPrompt}`;
        } else {
          prompt = qualityPrompt;
        }

        if (imagePromptUrl) {
          request.replicateInput = {
            prompt: prompt,
            aspect_ratio: aspectRatio,
            output_format: fileFormat,
            safety_tolerance: 2,
            input_image: imagePromptUrl,
          };
          request.replicatePremiumImagePromptFallbackInput = {
            prompt: prompt,
            control_image: imagePromptUrl,
            output_format: fileFormat,
            safety_tolerance: 2,
            steps: 28,
            guidance: 25,
            prompt_upsampling: false,
          };
        } else {
          request.replicateInput = {
            prompt: prompt,
            aspect_ratio: aspectRatio,
            output_format: fileFormat,
            safety_tolerance: 4,
          };
        }
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
        request.replicateInput = {
          image: imageUrl,
          scale: scale,
          face_enhance: true,
        };
      }

      let prediction: Prediction | null = null;
      if (generateType === "standard" || generateType === "premium") {
        if (replicateModel) {
          const replicateInputs = {
            model: replicateModel,
            input: request.replicateInput,
          };
          logger.info(`Replicate inputs`, {
            replicateInputs,
          });

          prediction = await replicate.predictions.create(replicateInputs);
        }
      }
      if (generateType === "remove-background" || generateType === "upscale") {
        if (replicateVersion) {
          const replicateInputs = {
            version: replicateVersion,
            input: request.replicateInput,
          };
          logger.info(`Replicate inputs`, {
            replicateInputs,
          });
          prediction = await replicate.predictions.create(replicateInputs);
        }
      }
      if (!prediction?.id) {
        throw new Error("Failed to create prediction", {
          cause: { prediction },
        });
      }

      const maxTries = 15;
      let tries = 0;
      let getPrediction;
      while (tries < maxTries) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        getPrediction = await replicate.predictions.get(prediction.id);

        if (
          tries >= 8 &&
          generateType === "premium" &&
          request.parsedRequestBody.imagePromptUrl &&
          replicatePremiumImagePromptFallbackModel &&
          Object.keys(request.replicatePremiumImagePromptFallbackInput).length
        ) {
          const fallbackPredictionInput = {
            model: replicatePremiumImagePromptFallbackModel,
            input: request.replicatePremiumImagePromptFallbackInput,
          };
          logger.info(`Fallback prediction input`, {
            fallbackPredictionInput,
          });
          const fallbackPrediction = await replicate.predictions.create(
            fallbackPredictionInput
          );
          if (fallbackPrediction.id) {
            getPrediction = await replicate.predictions.get(
              fallbackPrediction.id
            );
          }
        }

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

      logger.info(`Replicate output url`, {
        outputUrl,
      });
    } catch (error: any) {
      logger.error("Failed to generate replicate image", error);

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
          cause: JSON.stringify(error?.cause),
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
        fileFormat = String(request.parsedRequestBody.fileFormat);
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

      logger.info(`Image saved`, {
        userGenerationData: saveGenerationResponse.data,
      });
    } catch (error: any) {
      logger.error("Failed to save image", error);
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
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

      logger.info(`Email sent`, {
        userEmail: request.user.email,
        imagePublicUrl: request.imagePublicUrl,
      });
    }
  } catch (error: any) {
    logger.error("Failed to send email", error);

    Sentry.captureException(error, {
      extra: {
        cause: JSON.stringify(error?.cause),
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
      if (typeof creditRequirement !== "number") {
        throw new Error("creditRequirement is not a number", {
          cause: { request },
        });
      }

      if (typeof request.user.topupCreditBalance !== "number") {
        throw new Error("user.topupCreditBalance is not a number", {
          cause: { request },
        });
      }

      if (typeof request.user.subscriptionCreditBalance !== "number") {
        throw new Error("user.subscriptionCreditBalance is not a number", {
          cause: { request },
        });
      }

      if (request.user.subscriptionCreditBalance >= creditRequirement) {
        const newSubscriptionCreditBalance =
          request.user.subscriptionCreditBalance - creditRequirement;
        const deductCreditsResponse = await supabaseAdmin
          .from("user_subscription")
          .update({
            credit_balance: newSubscriptionCreditBalance,
          })
          .eq("user_id", request.user.id)
          .select()
          .single();
        if (deductCreditsResponse.error || !deductCreditsResponse.data) {
          throw new Error("Failed to deduct credits", {
            cause: { deductCreditsResponse },
          });
        }
        request.user.subscriptionCreditBalance = newSubscriptionCreditBalance;
      } else {
        const newTopupCreditBalance =
          request.user.topupCreditBalance - creditRequirement;

        const deductCreditsResponse = await supabaseAdmin
          .from("user_topup")
          .update({
            credit_balance: newTopupCreditBalance,
          })
          .eq("user_id", request.user.id)
          .select()
          .single();
        if (deductCreditsResponse.error || !deductCreditsResponse.data) {
          throw new Error("Failed to deduct credits", {
            cause: { deductCreditsResponse },
          });
        }
        request.user.topupCreditBalance = newTopupCreditBalance;
      }

      request.user.totalCreditBalance =
        request.user.topupCreditBalance +
        request.user.subscriptionCreditBalance;

      logger.info(`Credits deducted`, {
        topupCreditBalance: request.user.topupCreditBalance,
        subscriptionCreditBalance: request.user.subscriptionCreditBalance,
        totalCreditBalance: request.user.totalCreditBalance,
      });
    } catch (error: any) {
      logger.error("Failed to deduct credits", error);

      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
};

export const responseMiddleware = (
  generateType: "standard" | "premium" | "remove-background" | "upscale"
) => {
  return async (request: ImageGenerationRequest) => {
    try {
      let responseMessage = "Image generated successfully";
      if (generateType === "standard") {
        responseMessage = "Standard image generated successfully";
      }
      if (generateType === "premium") {
        responseMessage = "Premium image generated successfully";
      }
      if (generateType === "remove-background") {
        responseMessage = "Background removed successfully";
      }
      if (generateType === "upscale") {
        responseMessage = "Image upscaled successfully";
      }

      return NextResponse.json(
        {
          success: true,
          message: responseMessage,
          data: {
            imageUrl: request.imagePublicUrl,
            creditBalance: request.user.totalCreditBalance,
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      logger.error("Failed to generate response", error);

      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
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
