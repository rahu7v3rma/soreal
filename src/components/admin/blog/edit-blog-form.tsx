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
import { Blog } from "@/lib/supabase/admin";
import { useAdminBlog } from "@/context/admin-blog";

// Zod Schema for Blog Update
const updateBlogSchema = z.object({
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
        .max(300, "Featured image URL must be less than 300 characters")
        .optional()
        .or(z.literal("")),
    archived: z.boolean(),
});

type UpdateBlogFormData = z.infer<typeof updateBlogSchema>;

interface EditBlogFormProps {
    blog: Blog;
}

export default function EditBlogForm({ blog }: EditBlogFormProps) {
    const { toast } = useToast();
    const { uploadImage, updateBlog, updateBlogLoading, getBlog } = useSupabase();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { previewBlog, setPreviewBlog } = useAdminBlog();

    // Use preview data if available, otherwise use original blog data
    const getInitialValues = () => {
        if (previewBlog) {
            return {
                title: previewBlog.title || "",
                content: previewBlog.content || "",
                slug: previewBlog.slug || "",
                featured_image_file: previewBlog.featured_image_file || undefined,
                featured_image_url: previewBlog.featured_image_url || "",
                archived: Boolean(previewBlog.archived),
            };
        }
        return {
            title: blog.title || "",
            content: blog.content || "",
            slug: blog.slug || "",
            featured_image_file: undefined,
            featured_image_url: blog.featured_image_url || "",
            archived: Boolean(blog.archived),
        };
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm<UpdateBlogFormData>({
        resolver: zodResolver(updateBlogSchema),
        defaultValues: getInitialValues(),
    });

    const watchedValues = watch();

    const onSubmit = async (data: UpdateBlogFormData) => {
        try {
            setIsSubmitting(true);

            // Check if slug already exists (excluding current blog)
            if (data.slug !== blog.slug) {
                const existingBlog = await getBlog({ slug: data.slug });
                if (existingBlog && existingBlog.id !== blog.id) {
                    toast({
                        title: "Slug already exists",
                        description: "This slug is already in use. Please choose a different slug.",
                        variant: "destructive",
                    });
                    return;
                }
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

            // Update the blog
            const success = await updateBlog(blog.id, {
                title: data.title,
                content: data.content,
                slug: data.slug,
                featuredImageUrl: featuredImageUrl || undefined,
                archived: data.archived,
            });

            if (success) {
                // Navigate back to admin dashboard blogs main page
                router.push("/admin/dashboard/blog");
                router.refresh();
                // Success toast is handled by the updateBlog function
            }
        } catch (error) {
            toast({
                title: "Error updating blog",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground dark:text-white">Title *</Label>
                <Input
                    id="title"
                    placeholder="Enter blog title..."
                    {...register("title")}
                    onChange={(e) => {
                        const value = e.target.value;
                        const truncatedValue = value.length > 200 ? value.slice(0, 200) : value;
                        setValue("title", truncatedValue);
                    }}
                    className={`${errors.title ? "border-destructive" : ""} bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-400`}
                />
                <div className="flex justify-between">
                    {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground dark:text-zinc-400 ml-auto">
                        {watch("title")?.length || 0}/200 characters
                    </p>
                </div>
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
                <Label htmlFor="slug" className="text-foreground dark:text-white">Slug *</Label>
                <div>
                    <Input
                        id="slug"
                        placeholder="blog-url-slug"
                        {...register("slug")}
                        disabled={true}
                        className={`${errors.slug ? "border-destructive" : ""} bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-400`}
                    />
                </div>
                {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
                <p className="text-xs text-muted-foreground dark:text-zinc-400">
                    This will be used in the blog URL. Only lowercase letters, numbers,
                    and hyphens are allowed.
                </p>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
                <Label htmlFor="content" className="text-foreground dark:text-white">Content *</Label>
                <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    {...register("content")}
                    className={`min-h-[300px] ${errors.content ? "border-destructive" : ""} bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-400`}
                    onChange={(e) => {
                        const value = e.target.value;
                        const truncatedValue = value.length > 10000 ? value.slice(0, 10000) : value;
                        setValue("content", truncatedValue);
                    }}
                />
                <div className="flex justify-between">
                    <div>
                        {errors.content && (
                            <p className="text-sm text-destructive">{errors.content.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground dark:text-zinc-400">
                            Available formats: text, html
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-zinc-400">
                        {watch("content")?.length || 0}/10000 characters
                    </p>
                </div>
            </div>

            {/* Upload Featured Image Field */}
            <div className="space-y-2">
                <Label htmlFor="featured_image_file" className="text-foreground dark:text-white">Upload Featured Image</Label>
                <FileInput
                    id="featured_image_file"
                    accept="image/*"
                    {...register("featured_image_file")}
                    className={`${errors.featured_image_file ? "border-destructive" : ""} bg-background dark:bg-zinc-700 border-border dark:border-zinc-600`}
                />
                {errors.featured_image_file && (
                    <p className="text-sm text-destructive">
                        {typeof errors.featured_image_file.message === 'string'
                            ? errors.featured_image_file.message
                            : "Please select a valid image file"}
                    </p>
                )}
                <p className="text-xs text-muted-foreground dark:text-zinc-400">
                    Optional: Upload an image file to use as the featured image.
                </p>

                {/* Uploaded Image Preview */}
                {watch("featured_image_file") && watch("featured_image_file")?.[0] && (
                    <div className="mt-4 p-4 border border-border dark:border-zinc-600 rounded-lg bg-muted/50 dark:bg-zinc-700/50">
                        <p className="text-sm font-medium mb-2 text-foreground dark:text-white">Uploaded Image Preview:</p>
                        <div className="relative w-full max-w-md">
                            <img
                                src={URL.createObjectURL(watch("featured_image_file")![0])}
                                alt="Uploaded image preview"
                                className="w-full h-auto rounded-md border border-border dark:border-zinc-600"
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
                <Label htmlFor="featured_image_url" className="text-foreground dark:text-white">Featured Image URL</Label>
                <Input
                    id="featured_image_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...register("featured_image_url")}
                    onChange={(e) => {
                        const value = e.target.value;
                        const truncatedValue = value.length > 300 ? value.slice(0, 300) : value;
                        setValue("featured_image_url", truncatedValue);
                    }}
                    className={`${errors.featured_image_url ? "border-destructive" : ""} bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-400`}
                />
                <div className="flex justify-between">
                    <div>
                        {errors.featured_image_url && (
                            <p className="text-sm text-destructive">
                                {errors.featured_image_url.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground dark:text-zinc-400">
                            Optional: Provide a URL for the blog's featured image.
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-zinc-400">
                        {watch("featured_image_url")?.length || 0}/300 characters
                    </p>
                </div>

                {/* Featured Image Preview */}
                {watch("featured_image_url") && (
                    <div className="mt-4 p-4 border border-border dark:border-zinc-600 rounded-lg bg-muted/50 dark:bg-zinc-700/50">
                        <p className="text-sm font-medium mb-2 text-foreground dark:text-white">Featured Image Preview:</p>
                        <div className="relative w-full max-w-md">
                            <img
                                src={watch("featured_image_url")}
                                alt="Featured image preview"
                                className="w-full h-auto rounded-md border border-border dark:border-zinc-600"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                                onLoad={(e) => {
                                    e.currentTarget.style.display = 'block';
                                    e.currentTarget.nextElementSibling?.classList.add('hidden');
                                }}
                            />
                            <div className="hidden p-4 text-center text-sm text-muted-foreground dark:text-zinc-300 bg-muted dark:bg-zinc-700 rounded-md border border-border dark:border-zinc-600">
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
                    className="text-sm font-normal cursor-pointer text-foreground dark:text-white"
                >
                    Archive this blog (it won't be publicly visible)
                </Label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting || updateBlogLoading}
                    className="min-w-[120px]"
                >
                    {isSubmitting || updateBlogLoading ? "Updating..." : "Update Blog"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset({
                        title: blog.title || "",
                        content: blog.content || "",
                        slug: blog.slug || "",
                        featured_image_file: undefined,
                        featured_image_url: blog.featured_image_url || "",
                        archived: Boolean(blog.archived),
                    })}
                    disabled={isSubmitting || updateBlogLoading}
                    className="border-border dark:border-zinc-600 text-foreground dark:text-zinc-900 hover:bg-muted dark:hover:bg-zinc-700 hover:text-foreground dark:hover:text-white"
                >
                    Reset to Original
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset({
                        title: "",
                        content: "",
                        slug: "",
                        featured_image_file: undefined,
                        featured_image_url: "",
                        archived: false,
                    })}
                    disabled={isSubmitting || updateBlogLoading}
                    className="border-border dark:border-zinc-600 text-foreground dark:text-zinc-900 hover:bg-muted dark:hover:bg-zinc-700 hover:text-foreground dark:hover:text-white"
                >
                    Clear Form
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        setPreviewBlog({
                            title: watchedValues.title,
                            content: watchedValues.content,
                            slug: watchedValues.slug,
                            featured_image_file: watchedValues.featured_image_file,
                            featured_image_url: watchedValues.featured_image_url || undefined,
                            archived: watchedValues.archived,
                        });
                        router.replace(`/admin/dashboard/blog/preview/${blog.id}`);
                    }}
                    disabled={isSubmitting || updateBlogLoading}
                >
                    Preview Blog
                </Button>
            </div>
        </form>
    );
}
