import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { MiddlewareRequest } from "./common";

export const validateRequestBodyMiddleware = (zodSchema: ZodSchema) => {
  return async (request: MiddlewareRequest) => {
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

      const valid400Messages = ["Invalid request body"];
      if (valid400Messages.includes(error?.message)) {
        return NextResponse.json(
          {
            success: false,
            message: error?.message,
            data: error?.cause?.responseData || null,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Internal Server Error", data: null },
        { status: 500 }
      );
    }
  };
};
