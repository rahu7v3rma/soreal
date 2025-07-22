import { NextResponse } from "next/server";
import { z } from "zod";
import { getBlog, supabaseAdmin } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { adminAccessMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestBodyMiddleware } from "@/lib/middlewares/request";

// Zod Schema for Blog Update API - all fields optional
const updateBlogApiSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10000 characters").optional(),
  featured_image_url: z
    .string()
    .url("Must be a valid URL")
    .max(300, "Featured image URL must be less than 300 characters")
    .optional(),
  archived: z.boolean().optional(),
});

type UpdateBlogApiData = z.infer<typeof updateBlogApiSchema>;

async function getHandler(
  request: MiddlewareRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate that ID is provided
    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID provided",
          data: null,
        },
        { status: 400 }
      );
    }

    // Get the blog by ID
    const blog = await getBlog({ id });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Return success response with blog data
    return NextResponse.json(
      {
        success: true,
        message: "Blog retrieved successfully",
        data: {
          id: blog.id,
          title: blog.title,
          content: blog.content,
          slug: blog.slug,
          featured_image_url: blog.featured_image_url,
          archived: blog.archived,
          created_at: blog.created_at,
          updated_at: blog.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        blogId: params?.id,
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

async function putHandler(
  request: MiddlewareRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate that ID is provided
    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID provided",
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if blog exists
    const existingBlog = await getBlog({ id });
    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const data = request.parsedRequestBody as UpdateBlogApiData;

    // Prepare update object - only include fields that are provided
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.featured_image_url !== undefined) updateData.featured_image_url = data.featured_image_url;
    if (data.archived !== undefined) updateData.archived = data.archived;

    // Update the blog
    const updateBlog = await supabaseAdmin
      .from("blogs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (!updateBlog.data || updateBlog.error) {
      throw new Error("Failed to update blog in database", {
        cause: {
          updateBlog,
          requestBody: data,
          blogId: id,
        },
      });
    }

    // Return success response with updated blog data
    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully",
        data: {
          id: updateBlog.data.id,
          title: updateBlog.data.title,
          content: updateBlog.data.content,
          slug: updateBlog.data.slug,
          featured_image_url: updateBlog.data.featured_image_url,
          archived: updateBlog.data.archived,
          created_at: updateBlog.data.created_at,
          updated_at: updateBlog.data.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        blogId: params?.id,
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

async function deleteHandler(
  request: MiddlewareRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate that ID is provided
    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID provided",
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if blog exists
    const existingBlog = await getBlog({ id });
    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Delete the blog
    const deleteBlog = await supabaseAdmin
      .from("blogs")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (deleteBlog.error) {
      throw new Error("Failed to delete blog from database", {
        cause: {
          deleteBlog,
          blogId: id,
        },
      });
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
        data: {
          id: deleteBlog.data.id,
          title: deleteBlog.data.title,
          slug: deleteBlog.data.slug,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        blogId: params?.id,
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

export const GET = withMiddlewares(
  adminAccessMiddleware(["get_blog"]),
  getHandler
);

export const PUT = withMiddlewares(
  adminAccessMiddleware(["update_blog"]),
  validateRequestBodyMiddleware(updateBlogApiSchema),
  putHandler
);

export const DELETE = withMiddlewares(
  adminAccessMiddleware(["remove_blog"]),
  deleteHandler
);
