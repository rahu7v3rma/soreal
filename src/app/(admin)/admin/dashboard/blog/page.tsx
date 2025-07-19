import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/supabase/admin";
import Link from "next/link";
import BlogTableRow from "@/components/admin/blog/blog-table-row";

// Disable caching to ensure fresh data on every request
export const revalidate = 0;

export default async function AdminBlogsPage() {
  // Fetch blogs server-side using admin supabase function
  const blogs = await getBlogs({});

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">
          Manage and create blog posts for your platform.
        </p>
      </div>

      <div className="flex justify-start">
        <Link href="/admin/dashboard/blog/create">
          <Button
            className="flex items-center gap-2"
            style={{ backgroundColor: "#2fceb9", color: "white" }}
          >
            <Plus className="h-4 w-4" />
            <span>Create Blog</span>
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[200px]">Content</TableHead>
              <TableHead className="w-[80px]">Archived</TableHead>
              <TableHead className="w-[120px]">Slug</TableHead>
              <TableHead className="w-[150px]">Featured Image</TableHead>
              <TableHead className="w-[120px]">Created At</TableHead>
              <TableHead className="w-[120px]">Updated At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-muted-foreground"
                >
                  No blogs found. Create your first blog post to get started.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <BlogTableRow
                  key={blog.id}
                  blog={blog}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
