"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileInput } from "@/components/ui/file-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Pencil } from "lucide-react";

// Zod Schema for Blog Creation
const createBlogSchema = z.object({
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
  featured_image_file: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true; // Optional field
      if (typeof window !== 'undefined' && files instanceof FileList) {
        return files[0]?.type?.startsWith("image/");
      }
      return true; // Skip validation on server
    }, "Please select a valid image file"),
  featured_image_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  archived: z.boolean(),
});

type CreateBlogFormData = z.infer<typeof createBlogSchema>;

export default function CreateBlogPage() {
  const { toast } = useToast();
  const { uploadImage, createBlog, createBlogLoading, getBlog } = useSupabase();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
      featured_image_file: undefined,
      featured_image_url: "",
      archived: false,
    },
  });

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replaceAll(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
      .replaceAll(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
      .replaceAll(/^-|-$/g, ""); // Remove leading and trailing hyphens
  };

  // Watch for title changes and auto-populate slug
  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue) {
      const newSlug = generateSlug(titleValue);
      setValue("slug", newSlug);
    }
  }, [titleValue, setValue]);

  const onSubmit = async (data: CreateBlogFormData) => {
    try {
      setIsSubmitting(true);

      // Check if slug already exists
      const existingBlog = await getBlog({ slug: data.slug });
      if (existingBlog) {
        toast({
          title: "Slug already exists",
          description: "This slug is already in use. Please choose a different slug.",
          variant: "destructive",
        });
        return;
      }

      // Handle featured image upload if file is provided
      let featuredImageUrl = data.featured_image_url || "";

      if (data.featured_image_file && data.featured_image_file[0]) {
        const uploadedUrl = await uploadImage(
          data.featured_image_file[0],
          "blog"
        );
        if (uploadedUrl) {
          featuredImageUrl = uploadedUrl;
        }
      }

      // Create the blog
      const success = await createBlog({
        title: data.title,
        content: data.content,
        slug: data.slug,
        featuredImageUrl: featuredImageUrl || undefined,
        archived: data.archived,
      });

      if (success) {
        reset();
        // Navigate back to admin dashboard blogs main page
        router.push("/admin/dashboard/blog");
        router.refresh();
        // Success toast is handled by the createBlog function
      }
    } catch (error) {
      toast({
        title: "Error creating blog",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create a Blog</h1>
        <p className="text-muted-foreground">
          Write and publish engaging content for your audience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter blog title..."
            {...register("title")}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Slug Field */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <div className="relative">
            <Input
              id="slug"
              placeholder="blog-url-slug"
              {...register("slug")}
              disabled={!isSlugEditable}
              className={`${errors.slug ? "border-destructive" : ""} pr-10`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setIsSlugEditable(!isSlugEditable)}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            This will be used in the blog URL. Only lowercase letters, numbers,
            and hyphens are allowed.
          </p>
        </div>

        {/* Content Field */}
        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            placeholder="Write your blog content here..."
            {...register("content")}
            className={`min-h-[300px] ${errors.content ? "border-destructive" : ""}`}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Available formats: text, html
          </p>
        </div>

        {/* Upload Featured Image Field */}
        <div className="space-y-2">
          <Label htmlFor="featured_image_file">Upload Featured Image</Label>
          <FileInput
            id="featured_image_file"
            accept="image/*"
            {...register("featured_image_file")}
            className={errors.featured_image_file ? "border-destructive" : ""}
          />
          {errors.featured_image_file && (
            <p className="text-sm text-destructive">
              {typeof errors.featured_image_file.message === 'string' 
                ? errors.featured_image_file.message 
                : "Please select a valid image file"}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Optional: Upload an image file to use as the featured image.
          </p>

          {/* Uploaded Image Preview */}
          {watch("featured_image_file") && watch("featured_image_file")?.[0] && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Uploaded Image Preview:</p>
              <div className="relative w-full max-w-md">
                <img
                  src={URL.createObjectURL(watch("featured_image_file")![0])}
                  alt="Uploaded image preview"
                  className="w-full h-auto rounded-md border"
                  onLoad={(e) => {
                    // Store the src value before setTimeout to avoid null reference
                    const srcUrl = e.currentTarget.src;
                    // Clean up the object URL after the image loads
                    setTimeout(() => {
                      URL.revokeObjectURL(srcUrl);
                    }, 1000);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Featured Image URL Field */}
        <div className="space-y-2">
          <Label htmlFor="featured_image_url">Featured Image URL</Label>
          <Input
            id="featured_image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
            {...register("featured_image_url")}
            className={errors.featured_image_url ? "border-destructive" : ""}
          />
          {errors.featured_image_url && (
            <p className="text-sm text-destructive">
              {errors.featured_image_url.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Optional: Provide a URL for the blog's featured image.
          </p>

          {/* Featured Image Preview */}
          {watch("featured_image_url") && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Featured Image Preview:</p>
              <div className="relative w-full max-w-md">
                <img
                  src={watch("featured_image_url")}
                  alt="Featured image preview"
                  className="w-full h-auto rounded-md border"
                />
                <div className="hidden p-4 text-center text-sm text-muted-foreground bg-muted rounded-md border">
                  Unable to load image. Please check the URL.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Archived Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="archived"
            checked={watch("archived")}
            onCheckedChange={(checked) => setValue("archived", !!checked)}
          />
          <Label
            htmlFor="archived"
            className="text-sm font-normal cursor-pointer"
          >
            Archive this blog (it won't be publicly visible)
          </Label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || createBlogLoading}
            className="min-w-[120px]"
          >
            {isSubmitting || createBlogLoading ? "Creating..." : "Create Blog"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting || createBlogLoading}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
