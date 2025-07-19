import { AdminBlogProvider } from "@/context/admin-blog";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminBlogProvider>
      {children}
    </AdminBlogProvider>
  );
}
