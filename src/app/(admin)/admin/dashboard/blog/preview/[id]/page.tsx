"use client";

import { useAdminBlog } from "@/context/admin-blog";
import { useSupabase, Blog } from "@/context/supabase";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PreviewBlogPageProps {
    params: {
        id: string;
    };
}

export default function PreviewBlogPage({ params }: PreviewBlogPageProps) {
    const { id } = params;
    const { previewBlog } = useAdminBlog();
    const { getBlog } = useSupabase();
    const router = useRouter();
    const [fallbackBlog, setFallbackBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!previewBlog) {
                try {
                    const blog = await getBlog({ id });
                    setFallbackBlog(blog);
                } catch (error) {
                    setFallbackBlog(null);
                }
            }
            setLoading(false);
        };

        fetchBlog();
    }, [id, previewBlog, getBlog]);

    if (loading) {
        return (
            <div className="space-y-6 w-full max-w-4xl">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Preview Blog</h1>
                    <p className="text-muted-foreground">Loading preview...</p>
                </div>
            </div>
        );
    }

    const displayBlog = previewBlog || fallbackBlog;

    if (!displayBlog) {
        return (
            <div className="space-y-6 w-full max-w-4xl">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Preview Blog</h1>
                    <p className="text-muted-foreground text-red-600">
                        Blog not found or failed to load.
                    </p>
                </div>
            </div>
        );
    }

    const getFeaturedImageUrl = () => {
        if (previewBlog?.featured_image_file && previewBlog.featured_image_file[0]) {
            return URL.createObjectURL(previewBlog.featured_image_file[0]);
        }
        return previewBlog?.featured_image_url || fallbackBlog?.featured_image_url;
    };

    const featuredImageUrl = getFeaturedImageUrl();

    const handleClosePreview = () => {
        router.push(`/admin/dashboard/blog/edit/${id}`);
    };

    return (
        <div className="space-y-6 w-full max-w-4xl relative">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Preview Blog</h1>
                <p className="text-muted-foreground">
                    {previewBlog ? "Live preview (unsaved changes)" : "Preview from database"}
                </p>
            </div>

            <div className="border rounded-lg p-8 bg-white">
                <article className="prose prose-lg max-w-none">
                    {/* Blog Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        {displayBlog.title || "Untitled Blog"}
                    </h1>

                    {/* Published Date */}
                    <div className="text-gray-600 mb-8">
                        {fallbackBlog && fallbackBlog.created_at && (
                            <>
                                Published on{" "}
                                {new Date(fallbackBlog.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                                {fallbackBlog.updated_at && fallbackBlog.updated_at !== fallbackBlog.created_at && (
                                    <span className="ml-4">
                                        • Updated on{" "}
                                        {new Date(fallbackBlog.updated_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Featured Image */}
                    {featuredImageUrl && (
                        <div className="mb-8">
                            <img
                                src={featuredImageUrl}
                                alt={displayBlog.title || "Featured image"}
                                className="w-full h-[400px] rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Blog Content */}
                    <div 
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: displayBlog.content || "No content available."
                        }}
                    />
                </article>
            </div>

            {/* Close Preview Button */}
            <div className="flex justify-start mt-8">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClosePreview}
                    className="flex items-center gap-2"
                >
                    <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Close Preview
                </Button>
            </div>
        </div>
    );
}
