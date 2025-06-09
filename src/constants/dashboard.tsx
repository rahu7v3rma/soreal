import {
  ArrowUpToLine,
  CreditCard,
  HelpCircle,
  History,
  Home,
  Key,
  Layers,
  Scissors,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: NavItem[];
};

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Create",
    href: "/create",
    icon: <Sparkles className="h-5 w-5" />,
    submenu: [
      {
        title: "Standard Mode",
        href: "/create/standard",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        title: "Premium Mode",
        href: "/create/premium",
        icon: <Layers className="h-4 w-4" />,
      },
      {
        title: "Remove Background",
        href: "/create/remove-background",
        icon: <Scissors className="h-4 w-4" />,
      },
      {
        title: "Upscale",
        href: "/create/upscale",
        icon: <ArrowUpToLine className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "History",
    href: "/history",
    icon: <History className="h-5 w-5" />,
  },
  {
    title: "API Keys",
    href: "/api-keys",
    icon: <Key className="h-5 w-5" />,
  },
];

export const bottomNavItems: NavItem[] = [
  {
    title: "Support",
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];
