import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";
import { accessTokenMiddleware } from "@/lib/middlewares/auth";
import { z } from "zod";
import { validateRequestBodyMiddleware } from "@/lib/middlewares/request";
import { CHATWITH_ENHANCE_PROMPT_CHATBOT_ID } from "@/constants/chatwith";
import { withMiddlewares, MiddlewareRequest } from "@/lib/middlewares/common";

const requestBodySchema = z.object({
  prompt: z.string().min(1).max(500),
});

const CHATWITH_API_KEY = process.env.CHATWITH_API_KEY;

async function postHandler(request: MiddlewareRequest) {
  try {
    if (!CHATWITH_API_KEY) {
      throw new Error("missing chatwith api key");
    }

    const { prompt } = request.parsedRequestBody as z.infer<
      typeof requestBodySchema
    >;

    const chatwithInputs = {
      prompt,
      standardChatbotId: CHATWITH_ENHANCE_PROMPT_CHATBOT_ID,
      apiKey: CHATWITH_API_KEY,
    };

    const response = await axios.post(
      `https://api.chatwith.tools/v1/chatbot/${chatwithInputs.standardChatbotId}/chat`,
      {
        message: prompt,
        conversationId: null,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${chatwithInputs.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const enhancedPrompt = response.data?.text?.replace("\n", "");
    if (!enhancedPrompt) {
      throw new Error("no enhanced prompt returned from api.chatwith.tools", {
        cause: {
          response: response.data,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Prompt enhanced successfully",
      data: enhancedPrompt,
    });
  } catch (error: unknown) {
    Sentry.captureException(error, {
      extra: {
        cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export const POST = withMiddlewares(
  accessTokenMiddleware,
  validateRequestBodyMiddleware(requestBodySchema),
  postHandler
);
