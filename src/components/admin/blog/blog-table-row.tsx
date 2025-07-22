"use client";

import { Trash2, Loader, ExternalLink, Check, X } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabase, Blog } from "@/context/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface BlogTableRowProps {
  blog: Blog;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export default function BlogTableRow({ blog, isSelected, onSelectChange }: BlogTableRowProps) {
  const { deleteBlog, deleteBlogLoading } = useSupabase();
  const router = useRouter();
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<{
    id: string;
    title: string | null;
  } | null>(null);

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
      const success = await deleteBlog(blogToDelete.id);
      if (success) {
        setDeleteDialogOpen(false);
        setBlogToDelete(null);

        // Add a small delay to ensure database transaction is complete
        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    } finally {
      setDeletingBlogId(null);
    }
  };

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => {
          router.push(`/admin/dashboard/blog/edit/${blog.id}`);
        }}
      >
        <TableCell 
          onClick={(e) => e.stopPropagation()}
          className="w-[50px]"
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectChange}
            aria-label={`Select blog ${blog.title || 'Untitled'}`}
          />
        </TableCell>
        <TableCell className="font-medium dark:text-white">
          {blog.title || "Untitled"}
        </TableCell>
        <TableCell className="text-sm dark:text-zinc-200">
          {truncateText(blog.content, 28)}
        </TableCell>
        <TableCell className="text-muted-foreground dark:text-zinc-200 text-sm">
          {blog.slug || "-"}
        </TableCell>
        <TableCell className="text-muted-foreground dark:text-zinc-200 text-sm">
          {blog.featured_image_url ? (
            <img
              src={blog.featured_image_url}
              alt={blog.title || "Blog featured image"}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <span className="text-gray-400 dark:text-zinc-400">-</span>
          )}
        </TableCell>
        <TableCell className="text-muted-foreground dark:text-zinc-200 text-sm">
          {blog.updated_at
            ? formatDate(blog.updated_at)
            : formatDate(blog.created_at)}
        </TableCell>
        <TableCell className="text-muted-foreground dark:text-zinc-200 text-sm">
          <div className="flex justify-center">
            {blog.archived ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {/* Open in new tab button */}
            {blog.slug && !blog.archived && (
              <button
                className="p-1 hover:bg-muted rounded text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/blog/${blog.slug}`, '_blank');
                }}
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            
            {/* Delete button */}
            <button
              className="p-1 hover:bg-muted rounded text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(blog.id, blog.title);
              }}
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
    </>
  );
} 