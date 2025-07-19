import {
  FileText,
  Key,
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
    title: "Blog",
    href: "/admin/dashboard/blog",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "API Keys",
    href: "/admin/dashboard/api-keys",
    icon: <Key className="h-5 w-5" />,
  },
]; 