import { getBlog, Blog } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import EditBlogForm from "@/components/admin/blog/edit-blog-form";

// Disable caching to ensure fresh data on every request
export const revalidate = 0;

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = params;

  const blog: Blog | null = await getBlog({ id });

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6 w-full max-w-4xl bg-background dark:bg-zinc-800 text-foreground dark:text-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">Edit Blog</h1>
        <p className="text-muted-foreground dark:text-zinc-300">
          Update and republish your blog content.
        </p>
      </div>

      <EditBlogForm blog={blog} />
    </div>
  );
}
