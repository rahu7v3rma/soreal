import { ArrowUpRight, Box, Sparkles, Wand2 } from "lucide-react";

export const creationModes = [
  {
    title: "Standard",
    description: "Generate AI images using text prompts",
    icon: <Wand2 className="h-10 w-10 text-primary" />,
    href: "/create/standard",
    color:
      "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20",
  },
  {
    title: "Premium",
    description: "Create photorealistic images with advanced controls",
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    href: "/create/premium",
    color:
      "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20",
  },
  {
    title: "Remove Background",
    description: "Automatically remove backgrounds from images",
    icon: <Box className="h-10 w-10 text-primary" />,
    href: "/create/remove-background",
    color:
      "bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20",
  },
  {
    title: "Upscale",
    description: "Enhance image resolution and quality",
    icon: <ArrowUpRight className="h-10 w-10 text-primary" />,
    href: "/create/upscale",
    color:
      "bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20",
  },
];
