"use client";

import { Plus, Search, Clock, Trash2, Archive, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSupabase } from "@/context/supabase";
import Link from "next/link";
import BlogTableRow from "@/components/admin/blog/blog-table-row";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Disable caching to ensure fresh data on every request
export const revalidate = 0;

const blogsPerPage = 5;

export default function AdminBlogsPage() {
  const { blogs, getBlogsLoading, deleteBlogs, deleteBlogsLoading, updateBlogs, updateBlogsLoading, getBlogs } = useSupabase();
  const [blogsPage, setBlogsPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filteredBlogs, setFilteredBlogs] = useState<typeof blogs>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Update filtered blogs when blogs or search query changes
  useEffect(() => {
    let filtered = blogs;
    
    if (searchQuery.length > 0) {
      filtered = blogs.filter((blog) =>
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.slug?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort filtered blogs - always create a copy to avoid mutating the original array
    const sorted = [...filtered].sort((a, b) => {
      const aDate = new Date(a.updated_at || a.created_at).getTime();
      const bDate = new Date(b.updated_at || b.created_at).getTime();
      
      if (sortBy === "latest") {
        return bDate - aDate;
      } else {
        return aDate - bDate;
      }
    });
    
    setFilteredBlogs(sorted);
    setBlogsPage(1); // Reset to first page when filtering
    // Clear selections when filters change
    setSelectedRows([]);
  }, [blogs, searchQuery, sortBy]);

  const paginatedBlogs = filteredBlogs.slice(
    (blogsPage - 1) * blogsPerPage,
    blogsPage * blogsPerPage
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Handle individual row selection
  const handleRowSelect = (blogId: number, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, blogId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== blogId));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const allPaginatedIds = paginatedBlogs.map(blog => blog.id);
      setSelectedRows(allPaginatedIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Check if all visible rows are selected
  const isAllSelected = paginatedBlogs.length > 0 && paginatedBlogs.every(blog => selectedRows.includes(blog.id));

  // Handle archive action
  const handleArchive = async () => {
    if (selectedRows.length === 0) return;
    
    const success = await updateBlogs({
      blogIds: selectedRows,
      values: { archived: true }
    });
    
    if (success) {
      setSelectedRows([]); // Clear selection after successful archive
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    if (selectedRows.length === 0) return;
    
    const success = await deleteBlogs({
      blogIds: selectedRows
    });
    
    if (success) {
      setSelectedRows([]); // Clear selection after successful delete
    }
  };

  // Handle refresh action
  const handleRefresh = async () => {
    await getBlogs({ });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground dark:text-zinc-200">
          Manage and create blog posts for your platform.
        </p>
        {getBlogsLoading && <p className="text-muted-foreground">Loading...</p>}
        <p className="text-sm text-muted-foreground min-h-[20px]">
          {selectedRows.length > 0 ? (
            `${selectedRows.length} row${selectedRows.length === 1 ? '' : 's'} selected`
          ) : (
            <span className="invisible">0 rows selected</span>
          )}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-zinc-400" />
          <Input
            placeholder="Search by title, content, or slug..."
            className="pl-10 bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-[150px] bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="dark:bg-zinc-700 dark:border-zinc-600">
              <SelectItem value="latest" className="dark:text-white dark:hover:bg-zinc-600 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground dark:data-[state=checked]:bg-zinc-600 dark:data-[state=checked]:text-white">Latest First</SelectItem>
              <SelectItem value="oldest" className="dark:text-white dark:hover:bg-zinc-600 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground dark:data-[state=checked]:bg-zinc-600 dark:data-[state=checked]:text-white">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <Button
            disabled={selectedRows.length === 0 || updateBlogsLoading}
            variant="outline"
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600"
            onClick={handleArchive}
          >
            <Archive className="h-4 w-4" />
            <span>{updateBlogsLoading ? 'Archiving...' : 'Archive'}</span>
          </Button>
          <Button
            disabled={selectedRows.length === 0 || deleteBlogsLoading}
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleteBlogsLoading ? 'Deleting...' : 'Delete'}</span>
          </Button>
          <Button
            disabled={getBlogsLoading}
            variant="outline"
            className="flex items-center gap-2 bg-background dark:bg-zinc-700 text-foreground dark:text-zinc-100 border-border dark:border-zinc-600"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span>{getBlogsLoading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[20%] dark:text-zinc-100">Title</TableHead>
              <TableHead className="w-[20%] dark:text-zinc-100">Content</TableHead>
              <TableHead className="w-[20%] dark:text-zinc-100">Slug</TableHead>
              <TableHead className="w-[150px] dark:text-zinc-100">Featured Image</TableHead>
              <TableHead className="w-[120px] dark:text-zinc-100">Updated At</TableHead>
              <TableHead className="w-[80px] dark:text-zinc-100">Archived</TableHead>
              <TableHead className="w-[100px] dark:text-zinc-100">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBlogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground dark:text-zinc-200"
                >
                  {searchQuery
                    ? `No blogs found matching "${searchQuery}". Try adjusting your search.`
                    : "No blogs found. Create your first blog post to get started."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedBlogs.map((blog) => (
                <BlogTableRow
                  key={blog.id}
                  blog={blog}
                  isSelected={selectedRows.includes(blog.id)}
                  onSelectChange={(checked: boolean) => handleRowSelect(blog.id, checked)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredBlogs.length > blogsPerPage && (
        <div className="pt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setBlogsPage((p) => Math.max(1, p - 1))}
                  className={
                    blogsPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({
                length: totalPages,
              }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={blogsPage === i + 1}
                    onClick={() => setBlogsPage(i + 1)}
                    className={
                      blogsPage === i + 1
                        ? "pointer-events-none text-zinc-900"
                        : "cursor-pointer"
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setBlogsPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    blogsPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
