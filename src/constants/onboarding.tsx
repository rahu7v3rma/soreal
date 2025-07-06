import { ImageIcon, Palette, Zap } from "lucide-react";

export const STYLE_PREFERENCES = [
  { id: "photorealistic", label: "Photorealistic" },
  { id: "digital-art", label: "Digital Art" },
  { id: "illustrated-cartoon", label: "Illustrated / Cartoon" },
  { id: "painterly", label: "Painterly" },
  { id: "3d-rendered", label: "3D / Rendered" },
];

export const SUBJECT_PREFERENCES = [
  { id: "people-characters", label: "People or Characters" },
  { id: "landscapes-nature", label: "Landscapes & Nature" },
  { id: "products-branding", label: "Products & Branding" },
  { id: "abstract-conceptual", label: "Abstract & Conceptual" },
  { id: "scenes-environments", label: "Scenes or Environments" },
];

export const USAGE_GOALS = [
  { id: "client-work", label: "Create visuals for client work" },
  { id: "personal-portfolio", label: "Build a personal portfolio" },
  { id: "social-content", label: "Generate content quickly for social platforms" },
  { id: "creative-experiments", label: "Experiment with creative ideas" },
  { id: "other", label: "Other" },
];

// Legacy export for backward compatibility
export const INTERESTS = [...STYLE_PREFERENCES, ...SUBJECT_PREFERENCES];

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
