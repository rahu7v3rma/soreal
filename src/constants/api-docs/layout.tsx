import {
  ArrowUpToLine,
  Code,
  FileText,
  Home,
  ImageIcon,
  Scissors,
  Zap,
} from "lucide-react";

export const docsNavItems = [
  {
    title: "Welcome",
    href: "/api-docs",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Quick Start",
    href: "/api-docs/quick-start",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "API Reference",
    href: "/api-docs/api-reference",
    icon: <Code className="h-5 w-5" />,
    submenu: [
      {
        title: "Get Images",
        href: "/api-docs/api-reference/get-images",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: "Create Standard Image",
        href: "/api-docs/api-reference/standard-image-generation",
        icon: <ImageIcon className="h-4 w-4" />,
      },
      {
        title: "Create Premium Image",
        href: "/api-docs/api-reference/premium-image-generation",
        icon: <ImageIcon className="h-4 w-4" />,
      },
      {
        title: "Remove Background",
        href: "/api-docs/api-reference/remove-background",
        icon: <Scissors className="h-4 w-4" />,
      },
      {
        title: "Upscale Image",
        href: "/api-docs/api-reference/upscale-image",
        icon: <ArrowUpToLine className="h-4 w-4" />,
      },
    ],
  },
];
