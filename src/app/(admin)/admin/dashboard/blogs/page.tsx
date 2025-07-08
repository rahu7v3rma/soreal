"use client";

import { Edit, Trash2, Loader, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

export default function AdminBlogsPage() {
  const { blogs, getBlogs, getBlogsLoading, deleteBlog, deleteBlogLoading } =
    useSupabase();
  const router = useRouter();
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<{
    id: string;
    title: string | null;
  } | null>(null);

  useEffect(() => {
    getBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return "No content available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDelete = (blogId: string, blogTitle: string | null) => {
    setBlogToDelete({ id: blogId, title: blogTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    setDeletingBlogId(blogToDelete.id);
    try {
      await deleteBlog(blogToDelete.id);
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } finally {
      setDeletingBlogId(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
        <p className="text-muted-foreground">
          Manage and create blog posts for your platform.
        </p>
      </div>

      <div className="flex justify-start">
        <Button
          className="flex items-center gap-2"
          style={{ backgroundColor: "#2fceb9", color: "white" }}
          onClick={() => router.push("/admin/dashboard/blogs/create")}
        >
          <Plus className="h-4 w-4" />
          <span>Create Blog</span>
        </Button>
      </div>

      <div className="rounded-md border">
        {getBlogsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Loading blogs...</span>
          </div>
        ) : (
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
                  <TableRow key={blog.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {blog.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {blog.title || "Untitled"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {truncateText(blog.content, 80)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {blog.archived ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {blog.slug || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {blog.featured_image_url ? (
                        <img
                          src={blog.featured_image_url}
                          alt={blog.title || "Blog featured image"}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(blog.created_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {blog.updated_at
                        ? formatDate(blog.updated_at)
                        : formatDate(blog.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1 hover:bg-muted rounded"
                          onClick={() => router.push(`/admin/dashboard/blogs/edit?id=${blog.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 hover:bg-muted rounded text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDelete(blog.id, blog.title)}
                          disabled={
                            deletingBlogId === blog.id || deleteBlogLoading
                          }
                        >
                          {deletingBlogId === blog.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal
          container={
            typeof document !== "undefined" ? document.body : undefined
          }
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[999]" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Delete Blog
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Are you sure you want to delete the blog "
              {blogToDelete?.title || "Untitled"}"? This action cannot be
              undone.
            </Dialog.Description>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setBlogToDelete(null);
                }}
                disabled={deleteBlogLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteBlogLoading}
              >
                {deleteBlogLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
