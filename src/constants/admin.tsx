import {
  FileText,
  LayoutDashboard,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: NavItem[];
};

export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Blogs",
    href: "/admin/dashboard/blogs",
    icon: <FileText className="h-5 w-5" />,
  },
]; 