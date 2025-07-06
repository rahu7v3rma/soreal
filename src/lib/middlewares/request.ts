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

export const validateRequestQueryMiddleware = (zodSchema: ZodSchema) => {
  return async (request: MiddlewareRequest) => {
    try {
      const url = new URL(request.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());

      const parsedRequestQuery = zodSchema.safeParse(queryParams);
      if (!parsedRequestQuery.success) {
        throw new Error("Invalid request query", {
          cause: {
            responseData: parsedRequestQuery.error.flatten().fieldErrors,
          },
        });
      }

      request.parsedRequestQuery = parsedRequestQuery.data;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      const valid400Messages = ["Invalid request query"];
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
