import { supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import {
  authMiddleware,
  ImageGenerationRequest,
  withMiddlewares,
} from "@/lib/middlewares/image";
import { SUPABASE_URL } from "@/constants/supabase";

async function getHandler(request: ImageGenerationRequest) {
  try {
    const getUserGenerations = await supabaseAdmin
      .from("user_generations")
      .select("prompt, generation_type, public_url, created_at")
      .eq("user_id", request.user.id);
    if (!getUserGenerations.data) {
      throw new Error("failed to get user generations", {
        cause: { getUserGenerations },
      });
    }

    const transformedImageList = getUserGenerations.data.map((image) => {
      const publicUrl = image.public_url.replace(
        `${SUPABASE_URL}/storage/v1/object/public/assets`,
        `https://api.soreal.app/assets`
      );

      return {
        ...image,
        public_url: publicUrl,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Image list fetched successfully",
      data: transformedImageList,
    });
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: { cause: JSON.stringify(error?.cause) },
    });

    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
}

export const GET = withMiddlewares(
  authMiddleware("get_image", "get-image"),
  getHandler
);
