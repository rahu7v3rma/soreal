export const validAspectRatios = ["1:1", "16:9", "9:16"];

export const aspectRatioOptions = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Widescreen (16:9)" },
  { value: "9:16", label: "Mobile (9:16)" },
];

// Standard tier style restrictions - only landscape and portrait allowed
export const validStylePresets = ["landscape", "portrait"];

export const stylePresetOptions = [
  {
    value: "landscape",
    label: "Landscape",
    description: "Wide view of the full scene, expansive, panoramic",
  },
  {
    value: "portrait",
    label: "Portrait",
    description: "Chest or shoulders up, focused on the face, headshot style",
  },
];

export const aiSuggestions = [
  "Try adding more specific details about lighting",
  "Consider describing the environment or background",
  "Add information about the mood or atmosphere",
  "Specify camera settings like aperture or focal length",
  "Include details about textures or materials",
];

export const defaultStyle = "landscape";

export const defaultAspectRatio = "16:9";

export const standardImageApiUrl =
  "https://api.soreal.app/create-image/standard";
