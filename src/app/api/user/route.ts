import { supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { accessTokenMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";

async function deleteHandler(request: MiddlewareRequest) {
  try {
    const user = request.user;

    const deleteUserProfileResponse = await supabaseAdmin
      .from("user_profiles")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserProfileResponse.error) {
      throw new Error("failed to delete user profile", {
        cause: { deleteUserProfileResponse },
      });
    }

    try {
      await supabaseAdmin.from("user_credits").delete().eq("user_id", user.id);
    } catch {}

    const deleteUserTopupResponse = await supabaseAdmin
      .from("user_topup")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserTopupResponse.error) {
      throw new Error("failed to delete user topup", {
        cause: { deleteUserTopupResponse },
      });
    }

    const deleteUserSubscriptionResponse = await supabaseAdmin
      .from("user_subscription")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserSubscriptionResponse.error) {
      throw new Error("failed to delete user subscription", {
        cause: { deleteUserSubscriptionResponse },
      });
    }

    const deleteUserPaymentsResponse = await supabaseAdmin
      .from("user_payments")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserPaymentsResponse.error) {
      throw new Error("failed to delete user payments", {
        cause: { deleteUserPaymentsResponse },
      });
    }

    const deleteUserApiKeysResponse = await supabaseAdmin
      .from("user_api_keys")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserApiKeysResponse.error) {
      throw new Error("failed to delete user api keys", {
        cause: { deleteUserApiKeysResponse },
      });
    }

    const deleteUserRoleResponse = await supabaseAdmin
      .from("user_role")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserRoleResponse.error) {
      throw new Error("failed to delete user role", {
        cause: { deleteUserRoleResponse },
      });
    }

    const deleteUserGenerationsResponse = await supabaseAdmin
      .from("user_generations")
      .delete()
      .eq("user_id", user.id);
    if (deleteUserGenerationsResponse.error) {
      throw new Error("failed to delete user generations", {
        cause: { deleteUserGenerationsResponse },
      });
    }

    const getUserAssetsGenerationsResponse = await supabaseAdmin.storage
      .from("assets")
      .list(`users/${user.id}/generations`, {});
    if (getUserAssetsGenerationsResponse.error) {
      if (
        !getUserAssetsGenerationsResponse.error.message
          .toLowerCase()
          .includes("fewer than 1")
      ) {
        throw new Error("failed to get user assets generations", {
          cause: { getUserAssetsGenerationsResponse },
        });
      }
    }

    const getUserAssetsReferenceResponse = await supabaseAdmin.storage
      .from("assets")
      .list(`users/${user.id}/reference`, {});
    if (getUserAssetsReferenceResponse.error) {
      if (
        !getUserAssetsReferenceResponse.error.message
          .toLowerCase()
          .includes("fewer than 1")
      ) {
        throw new Error("failed to get user assets reference", {
          cause: { getUserAssetsReferenceResponse },
        });
      }
    }

    const getUserAssetsAvatarsResponse = await supabaseAdmin.storage
      .from("assets")
      .list(`users/${user.id}/avatar`, {});
    if (getUserAssetsAvatarsResponse.error) {
      if (
        !getUserAssetsAvatarsResponse.error.message
          .toLowerCase()
          .includes("fewer than 1")
      ) {
        throw new Error("failed to get user assets avatars", {
          cause: { getUserAssetsAvatarsResponse },
        });
      }
    }

    const deleteUserAssetsResponse = await supabaseAdmin.storage
      .from("assets")
      .remove([
        ...(getUserAssetsGenerationsResponse.data?.map(
          (file) => `users/${user.id}/generations/${file.name}`
        ) || []),
        ...(getUserAssetsReferenceResponse.data?.map(
          (file) => `users/${user.id}/reference/${file.name}`
        ) || []),
        ...(getUserAssetsAvatarsResponse.data?.map(
          (file) => `users/${user.id}/avatar/${file.name}`
        ) || []),
      ]);
    if (deleteUserAssetsResponse.error) {
      if (
        !deleteUserAssetsResponse.error.message
          .toLowerCase()
          .includes("fewer than 1")
      ) {
        throw new Error("failed to delete user assets", {
          cause: { deleteUserAssetsResponse },
        });
      }
    }

    const deleteUserResponse = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );
    if (deleteUserResponse.error) {
      throw new Error("failed to delete user", {
        cause: { deleteUserResponse },
      });
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully", data: null },
      { status: 200 }
    );
  } catch (error: unknown) {
    Sentry.captureException(error, {
      extra: { cause: error instanceof Error ? JSON.stringify(error.cause) : undefined },
    });

    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
}

export const DELETE = withMiddlewares(accessTokenMiddleware, deleteHandler);
