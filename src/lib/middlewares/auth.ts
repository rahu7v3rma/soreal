import { supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { MiddlewareRequest } from "./common";

const authUserSchema = z.object({
  id: z.string(),
});

export const accessTokenMiddleware = async (request: MiddlewareRequest) => {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization) {
      throw new Error("unauthorized", { cause: { authorization } });
    }

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

    const getUserTopup = await supabaseAdmin
      .from("user_topup")
      .select("*")
      .eq("user_id", getUser.data.user?.id)
      .single();
    if (!getUserTopup.data) {
      throw new Error("failed to get user topup", {
        cause: { getUserTopup },
      });
    }

    const parsedUser = authUserSchema.safeParse({
      id: getUser.data.user?.id,
    });
    if (!parsedUser.success) {
      throw new Error("failed to parse user", {
        cause: { parsedUserError: parsedUser.error.flatten().fieldErrors },
      });
    }

    request.user = parsedUser.data;
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
        cause: JSON.stringify(error?.cause),
      },
    });

    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 401 }
    );
  }
};

export const adminAccessMiddleware =
  (permissions: string[]) => async (request: MiddlewareRequest) => {
    try {
      const authorization = request.headers.get("authorization");
      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error("unauthorized", { cause: { authorization } });
      }

      const apiKey = authorization.split(" ")[1];
      if (!apiKey) {
        throw new Error("unauthorized", { cause: { authorization } });
      }

      const { data: apiKeyData, error: apiKeyError } = await supabaseAdmin
        .from("admin_api_keys")
        .select("permissions")
        .eq("api_key_token", apiKey)
        .filter("revoked", "not.is", true)
        .single();

      if (apiKeyError || !apiKeyData) {
        throw new Error("unauthorized", { cause: { apiKeyError } });
      }

      const existingPermissions = apiKeyData.permissions as string[];
      const hasAllPermissions = permissions.every((p) =>
        existingPermissions.includes(p)
      );

      if (!hasAllPermissions) {
        throw new Error("forbidden", {
          cause: { required: permissions, existing: existingPermissions },
        });
      }
    } catch (error: any) {
      const valid401Messages = ["unauthorized"];
      if (valid401Messages.includes(error?.message)) {
        return NextResponse.json(
          { success: false, message: error?.message, data: null },
          { status: 401 }
        );
      }

      const valid403Messages = ["forbidden"];
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
        { status: 500 }
      );
    }
  };
