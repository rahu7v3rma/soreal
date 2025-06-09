import { ImageIcon, Palette, Zap } from "lucide-react";

export const INTERESTS = [
  { id: "photorealistic", label: "Photorealistic", category: "style" },
  { id: "cartoon", label: "Cartoon/Animated", category: "style" },
  { id: "digital-art", label: "Digital Art", category: "style" },
  { id: "painting", label: "Painting", category: "style" },

  { id: "people", label: "People/Portraits", category: "subject" },
  { id: "landscapes", label: "Landscapes/Nature", category: "subject" },
  { id: "abstract", label: "Abstract", category: "subject" },
  { id: "products", label: "Products/Commercial", category: "subject" },
];

export const USAGE_GOALS = [
  { id: "personal", label: "Personal projects" },
  { id: "professional", label: "Professional work" },
  { id: "social-media", label: "Social media content" },
  { id: "other", label: "Other" },
];

export const features = [
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: "Create Images",
    description: "Generate stunning AI images with simple text prompts",
  },
  {
    icon: <Palette className="h-8 w-8 text-primary" />,
    title: "Explore Styles",
    description: "Try different styles and settings to perfect your creations",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Enhance Prompts",
    description: "Use AI to improve your prompts for better results",
  },
];
