import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, getBlogs, Blog } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { adminAccessMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestBodyMiddleware } from "@/lib/middlewares/request";

// Zod Schema for Blog Creation API (same as in single blog route)
const createBlogApiSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10000 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ).optional(),
  featured_image_url: z
    .string()
    .url("Must be a valid URL")
    .optional(),
  archived: z.boolean().optional().default(false),
});

// Zod Schema for Multiple Blog Creation API (array of blog objects)
const createMultipleBlogsApiSchema = z.object({
  blogs: z.array(createBlogApiSchema),
});

// Function to generate slug from title (same as in single blog route)
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replaceAll(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replaceAll(/^-|-$/g, "") // Remove leading and trailing hyphens
    .slice(0, 100); // Limit to 100 characters
};

type CreateBlogApiData = z.infer<typeof createBlogApiSchema>;
type CreateMultipleBlogsApiData = z.infer<typeof createMultipleBlogsApiSchema>;

async function postHandler(request: MiddlewareRequest) {
  try {
    const { blogs: dataArray } =
      request.parsedRequestBody as CreateMultipleBlogsApiData;

    // Generate slugs for blogs that don't have them
    const blogsToProcess = dataArray.map(data => ({
      ...data,
      slug: data.slug || generateSlug(data.title)
    }));

    // Extract all slugs to check for existing ones
    const slugsToCheck = blogsToProcess.map(blog => blog.slug);

    // Get existing blogs with these slugs
    const existingBlogs = await getBlogs({ slugs: slugsToCheck });
    const existingSlugs = new Set(existingBlogs.map(blog => blog.slug));

    // Separate blogs into existing and new ones
    const existingBlogsData = blogsToProcess.filter(blog => existingSlugs.has(blog.slug));
    const newBlogsData = blogsToProcess.filter(blog => !existingSlugs.has(blog.slug));

    let createdBlogs: Blog[] = [];

    // Create new blogs if any
    if (newBlogsData.length > 0) {
      const blogsToInsert = newBlogsData.map(blog => ({
        title: blog.title,
        content: blog.content,
        slug: blog.slug,
        featured_image_url: blog.featured_image_url || null,
        archived: blog.archived,
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabaseAdmin
        .from("blogs")
        .insert(blogsToInsert)
        .select();

      if (error) {
        throw new Error("Failed to create blogs in database", {
          cause: {
            error,
            requestBody: newBlogsData,
          },
        });
      }

      if (data) {
        createdBlogs = data.map(blog => ({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          slug: blog.slug,
          featured_image_url: blog.featured_image_url,
          archived: blog.archived,
          created_at: blog.created_at,
          updated_at: blog.updated_at,
        }));
      }
    }

    // Return success response with existing blogs and created blogs
    return NextResponse.json(
      {
        success: true,
        message: "Multiple blogs processed successfully",
        data: {
          existingSlugs: existingBlogsData,
          createdBlogs: createdBlogs,
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
  validateRequestBodyMiddleware(createMultipleBlogsApiSchema),
  postHandler
);
