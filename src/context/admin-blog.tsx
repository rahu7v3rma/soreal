"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface PreviewBlogInput {
  title: string;
  content: string;
  slug: string;
  featured_image_file?: FileList;
  featured_image_url?: string;
  archived: boolean;
}

interface AdminBlogContextType {
  previewBlog: PreviewBlogInput | null;
  setPreviewBlog: (blog: PreviewBlogInput | null) => void;
}

const AdminBlogContext = createContext<AdminBlogContextType | undefined>(undefined);

interface AdminBlogProviderProps {
  children: ReactNode;
}

export function AdminBlogProvider({ children }: AdminBlogProviderProps) {
  const [previewBlog, setPreviewBlog] = useState<PreviewBlogInput | null>(null);

  useEffect(() => {
    return () => {
      setPreviewBlog(null);
    };
  }, []);

  return (
    <AdminBlogContext.Provider value={{ previewBlog, setPreviewBlog }}>
      {children}
    </AdminBlogContext.Provider>
  );
}

export function useAdminBlog() {
  const context = useContext(AdminBlogContext);
  if (context === undefined) {
    throw new Error("useAdminBlog must be used within an AdminBlogProvider");
  }
  return context;
}
