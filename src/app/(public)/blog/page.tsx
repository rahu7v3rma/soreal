import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogs } from "@/lib/supabase/admin";
import Link from "next/link";

// Disable caching to ensure fresh data on every request
export const revalidate = 0;

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Helper function to truncate content with ellipsis
const truncateContent = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

export default async function BlogPage() {
  const blogs = await getBlogs({ archived: false });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Blog heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Discover the latest insights, tutorials, and updates from the world of AI-powered image generation.
        </p>
      </div>

      {/* Blog cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group"
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              {/* Featured Image */}
              {blog.featured_image_url && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={blog.featured_image_url}
                    alt={blog.title || "Blog post image"}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-[#2fceb9] dark:group-hover:text-[#5E00FF] transition-colors">
                  {blog.title}
                </CardTitle>

                {/* Date information */}
                <div className="flex flex-col space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>
                      {blog.updated_at && blog.created_at !== blog.updated_at 
                        ? `Updated: ${formatDate(blog.updated_at)}`
                        : `Created: ${formatDate(blog.created_at)}`
                      }
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {truncateContent(blog.content || "")}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty state when no blogs */}
      {blogs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No blog posts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Check back soon for new content!
          </p>
        </div>
      )}
    </div>
  );
} 