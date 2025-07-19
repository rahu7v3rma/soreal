import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, getBlog } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { adminAccessMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestBodyMiddleware } from "@/lib/middlewares/request";

// Zod Schema for Blog Creation API
const createBlogApiSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  featured_image_url: z
    .string()
    .url("Must be a valid URL")
    .optional(),
  archived: z.boolean().optional().default(false),
});

type CreateBlogApiData = z.infer<typeof createBlogApiSchema>;

async function postHandler(request: MiddlewareRequest) {
  try {
    const data = request.parsedRequestBody as CreateBlogApiData;

    // Check if slug already exists
    const existingBlog = await getBlog({ slug: data.slug });
    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "This slug is already in use. Please choose a different slug.",
          data: null,
        },
        { status: 409 }
      );
    }

    // Create the blog using supabase admin client
    const insertBlog = await supabaseAdmin
      .from("blogs")
      .insert({
        title: data.title,
        content: data.content,
        slug: data.slug,
        featured_image_url: data.featured_image_url || null,
        archived: data.archived,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!insertBlog.data || insertBlog.error) {
      throw new Error("Failed to create blog in database", {
        cause: {
          insertBlog,
          requestBody: data,
        },
      });
    }

    // Return success response with created blog data
    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        data: {
          id: insertBlog.data.id,
          title: insertBlog.data.title,
          content: insertBlog.data.content,
          slug: insertBlog.data.slug,
          featured_image_url: insertBlog.data.featured_image_url,
          archived: insertBlog.data.archived,
          created_at: insertBlog.data.created_at,
          updated_at: insertBlog.data.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        cause: JSON.stringify(error?.cause),
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
  adminAccessMiddleware(["create_blog"]),
  validateRequestBodyMiddleware(createBlogApiSchema),
  postHandler
);
