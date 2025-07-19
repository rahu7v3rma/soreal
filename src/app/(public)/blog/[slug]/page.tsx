import { getBlog, Blog } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Image from "next/image";

// Disable caching to ensure fresh data on every request
export const revalidate = 0;

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = params;

  const blog: Blog | null = await getBlog({ slug, archived: false });

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <article className="prose prose-lg max-w-none">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>

        {/* Published Date */}
        <div className="text-gray-600 mb-8">
          Published on{" "}
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {blog.updated_at && blog.updated_at !== blog.created_at && (
            <span className="ml-4">
              • Updated on{" "}
              {new Date(blog.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Featured Image */}
        {blog.featured_image_url && (
          <div className="mb-8">
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full h-[400px] rounded-lg object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}
