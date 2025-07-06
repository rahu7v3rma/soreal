import { ArrowUp, Zap, Layers, Scissors } from "lucide-react";

export const modes = [
  {
    icon: <Zap size={28} />,
    title: "Standard",
    description: "Quickly generate high-quality results using a short prompt.",
  },
  {
    icon: <Layers size={28} />,
    title: "Premium",
    description:
      "Create highly detailed, photorealistic visuals ready for client use.",
  },
  {
    icon: <Scissors size={28} />,
    title: "Remove Background",
    description:
      "Instantly isolate the subject for clean cutouts, ads, or product shots.",
  },
  {
    icon: <ArrowUp size={28} />,
    title: "Upscale",
    description:
      "Increase image size while keeping sharp detail, ideal for print and close-up use.",
  },
];
