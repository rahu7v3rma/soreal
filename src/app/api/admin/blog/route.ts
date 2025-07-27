import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, getBlog, getBlogs, deleteBlogs, updateBlog, Blog } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";
import { adminAccessMiddleware } from "@/lib/middlewares/auth";
import { MiddlewareRequest, withMiddlewares } from "@/lib/middlewares/common";
import { validateRequestBodyMiddleware, validateRequestQueryMiddleware } from "@/lib/middlewares/request";

// Zod Schema for Blog Creation API
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

// Zod Schema for Blog List API
const getBlogApiSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().max(100).optional(),
  sort: z.enum(["latest", "oldest"]).optional().default("latest"),
});

// Zod Schema for Blog Delete API
const deleteBlogApiSchema = z.object({
  blogIds: z.array(z.number()).min(1, "At least one blog ID is required").max(10, "At most 10 blog IDs are allowed"),
});

// Zod Schema for Blog Update API
const updateBlogApiSchema = z.object({
  blogs: z.array(
    z.object({
      id: z
        .number()
        .optional(),
      title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters")
        .optional(),
      content: z
        .string()
        .min(1, "Content is required")
        .max(10000, "Content must be less than 10000 characters")
        .optional(),
      slug: z
        .string()
        .min(1, "Slug is required")
        .max(100, "Slug must be less than 100 characters")
        .regex(
          /^[a-z0-9-]+$/,
          "Slug must be lowercase letters, numbers, and hyphens only"
        )
        .optional(),
      featured_image_url: z
        .string()
        .url("Must be a valid URL")
        .optional(),
      archived: z.boolean().optional(),
    })
  )
});

// Function to generate slug from title (same as in create page)
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replaceAll(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replaceAll(/^-|-$/g, "") // Remove leading and trailing hyphens
    .slice(0, 100); // Limit to 100 characters
};

type CreateBlogApiData = z.infer<typeof createBlogApiSchema>;
type GetBlogApiData = z.infer<typeof getBlogApiSchema>;
type DeleteBlogApiData = z.infer<typeof deleteBlogApiSchema>;
type UpdateBlogApiData = z.infer<typeof updateBlogApiSchema>;

async function postHandler(request: MiddlewareRequest) {
  try {
    const data = request.parsedRequestBody as CreateBlogApiData;

    // Auto-generate slug from title if not provided
    const slug = data.slug || generateSlug(data.title);

    // Check if slug already exists
    const existingBlog = await getBlog({ slug: slug });
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
        slug: slug,
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

async function getHandler(request: MiddlewareRequest) {
  try {
    const params = request.parsedRequestQuery as GetBlogApiData;

    // Transform search string to search object
    const searchObject = params.search ? {
      title: params.search,
      content: params.search,
      slug: params.search,
    } : undefined;

    // Transform sort string to sort object
    const sortObject = {
      updated_at: params.sort === "oldest" ? "asc" as const : "desc" as const,
    };

    // Get blogs with transformed parameters
    const blogs = await getBlogs({
      limit: params.limit,
      page: params.page,
      search: searchObject,
      sort: sortObject,
    });

    // Return success response with blogs data
    return NextResponse.json(
      {
        success: true,
        message: "Blogs retrieved successfully",
        data: blogs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(error);

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

async function deleteHandler(request: MiddlewareRequest) {
  try {
    const data = request.parsedRequestBody as DeleteBlogApiData;

    // Get available blogs by IDs to validate which ones exist
    const availableBlogs = await getBlogs({ ids: data.blogIds });
    
    // Separate valid and invalid IDs
    const validIds = availableBlogs.map(blog => Number(blog.id));
    const invalidIds = data.blogIds.filter(id => !validIds.includes(id));
    
    // Process only valid IDs through delete blogs
    if (validIds.length > 0) {
      await deleteBlogs(validIds);
    }

    // Return enhanced response with detailed information
    return NextResponse.json(
      {
        success: true,
        message: "Successfully processed blog deletion request",
        data: {
          validIds,
          invalidIds,
          deletedBlogs: availableBlogs
        },
      },
      { status: 200 }
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

async function putHandler(request: MiddlewareRequest) {
  try {
    const data = request.parsedRequestBody as UpdateBlogApiData;

    // Filter blogs with and without ID
    const blogsWithoutId = data.blogs.filter(blog => !blog.id);
    const blogsWithId = data.blogs.filter(blog => blog.id);

    // Get IDs from blogs with ID
    const requestedIds = blogsWithId.map(blog => blog.id!);

    // Get available blogs from database
    const availableBlogs = await getBlogs({ ids: requestedIds });
    const availableIds = availableBlogs.map(blog => blog.id);

    // Separate valid and invalid IDs
    const blogsWithValidId = blogsWithId.filter(blog => availableIds.includes(blog.id!));
    const blogsWithInvalidId = blogsWithId.filter(blog => !availableIds.includes(blog.id!));

    // Check for slug conflicts and separate blogs
    const blogsWithSlugConflict = [];
    const blogsToUpdate = [];

    for (const blogUpdate of blogsWithValidId) {
      // Check for slug conflicts
      if (blogUpdate.slug) {
        const existingBlog = await getBlog({ slug: blogUpdate.slug });
        if (existingBlog && existingBlog.id !== blogUpdate.id) {
          blogsWithSlugConflict.push(blogUpdate);
          continue;
        }
      }
      blogsToUpdate.push(blogUpdate);
    }

    // Update blogs without conflicts
    const updatedBlogs: Blog[] = [];
    for (const blogUpdate of blogsToUpdate) {
      const updatedBlog = await updateBlog(blogUpdate.id!, {
        title: blogUpdate.title,
        content: blogUpdate.content,
        slug: blogUpdate.slug,
        featured_image_url: blogUpdate.featured_image_url,
        archived: blogUpdate.archived,
      });

      if (updatedBlog) {
        updatedBlogs.push(updatedBlog);
      }
    }

    // Return response with four categories
    return NextResponse.json(
      {
        success: true,
        message: "Successfully processed blog update request",
        data: {
          blogsWithoutId: blogsWithoutId,
          blogsWithInvalidId: blogsWithInvalidId,
          blogsWithSlugConflict: blogsWithSlugConflict,
          updatedBlogs: updatedBlogs,
        },
      },
      { status: 200 }
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

export const GET = withMiddlewares(
  adminAccessMiddleware(["list_blog"]),
  validateRequestQueryMiddleware(getBlogApiSchema),
  getHandler
);

export const DELETE = withMiddlewares(
  adminAccessMiddleware(["remove_blog"]),
  validateRequestBodyMiddleware(deleteBlogApiSchema),
  deleteHandler
);

export const PUT = withMiddlewares(
  adminAccessMiddleware(["update_blog"]),
  validateRequestBodyMiddleware(updateBlogApiSchema),
  putHandler
);
