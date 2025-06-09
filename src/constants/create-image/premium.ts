export const validAspectRatios = ["1:1", "4:3", "3:2", "16:9", "3:4"];
export const validFileFormats = ["png", "jpg"];

export const aspectRatioOptions = [
  { value: "1:1", label: "1:1 Square" },
  { value: "3:2", label: "3:2 Landscape" },
  { value: "16:9", label: "16:9 Widescreen" },
  { value: "4:3", label: "4:3 Classic" },
  { value: "3:4", label: "3:4 Portrait Classic" },
];

export const realismPresets = [
  {
    name: "Portrait",
    description: "Chest or shoulders up, focused on the face",
    settings: {
      prompt: "Portrait photo focusing on face and upper body",
      style:
        "chest or shoulders up, focused on the face, headshot style, professional portrait, for headshots, profiles, or interviews",
      aspectRatio: "3:4",
      lighting: 60,
      detailLevel: 95,
      realism: 100,
      saturation: 50,
      contrast: 60,
    },
  },
  {
    name: "Landscape",
    description: "Wide view of the full scene",
    settings: {
      prompt: "Wide landscape view showing the full scene",
      style:
        "wide view of the full scene, expansive, panoramic, for travel, architecture, or background-focused shots",
      aspectRatio: "16:9",
      lighting: 65,
      detailLevel: 90,
      realism: 100,
      saturation: 55,
      contrast: 65,
    },
  },
  {
    name: "Hardlight",
    description: "Strong light with sharp, defined shadows",
    settings: {
      prompt: "Subject with strong directional lighting",
      style:
        "strong light with sharp, defined shadows, dramatic, high contrast, for dramatic portraits, fashion, or contrast-heavy images",
      aspectRatio: "3:2",
      lighting: 80,
      detailLevel: 90,
      realism: 100,
      saturation: 55,
      contrast: 75,
    },
  },
  {
    name: "Neonlit",
    description: "Bright, glowing colors with an artificial light feel",
    settings: {
      prompt: "Scene with neon lighting effects",
      style:
        "bright, glowing colors with an artificial light feel, vibrant, neon, for night scenes, city lights, or cyberpunk settings",
      aspectRatio: "16:9",
      lighting: 70,
      detailLevel: 85,
      realism: 90,
      saturation: 80,
      contrast: 70,
    },
  },
  {
    name: "Faded",
    description: "Muted tones with a soft, vintage look",
    settings: {
      prompt: "Scene with muted, vintage aesthetic",
      style:
        "muted tones with a soft, vintage look, retro, nostalgic, for retro, nostalgic, or film-style visuals",
      aspectRatio: "3:2",
      lighting: 50,
      detailLevel: 80,
      realism: 85,
      saturation: 40,
      contrast: 45,
    },
  },
  {
    name: "Staged",
    description: "Clean, even studio lighting",
    settings: {
      prompt: "Subject with clean studio lighting",
      style:
        "clean, even studio lighting, professional, controlled, for product shots, portraits, or editorial setups",
      aspectRatio: "1:1",
      lighting: 75,
      detailLevel: 95,
      realism: 100,
      saturation: 50,
      contrast: 55,
    },
  },
  {
    name: "Sunlit",
    description: "Warm, natural daylight",
    settings: {
      prompt: "Scene with warm natural sunlight",
      style:
        "warm, natural daylight, golden hour, outdoor, for outdoor, nature, or lifestyle photos",
      aspectRatio: "3:2",
      lighting: 70,
      detailLevel: 90,
      realism: 100,
      saturation: 60,
      contrast: 60,
    },
  },
  {
    name: "Shadowed",
    description: "Low light with deep contrast",
    settings: {
      prompt: "Moody scene with dramatic shadows",
      style:
        "low light with deep contrast, moody, noir, for moody, noir, or dramatic compositions",
      aspectRatio: "16:9",
      lighting: 30,
      detailLevel: 85,
      realism: 95,
      saturation: 45,
      contrast: 80,
    },
  },
  {
    name: "Washed",
    description: "Soft, pale light with low contrast",
    settings: {
      prompt: "Scene with soft, dreamy lighting",
      style:
        "soft, pale light with low contrast, dreamy, ethereal, for dreamy, calm, or romantic moods",
      aspectRatio: "3:2",
      lighting: 65,
      detailLevel: 80,
      realism: 90,
      saturation: 40,
      contrast: 40,
    },
  },
  {
    name: "Backglow",
    description: "Light behind the subject, creating a rim or silhouette",
    settings: {
      prompt: "Subject backlit with rim lighting",
      style:
        "light behind the subject, creating a rim or silhouette, backlit, for backlit scenes, sunrise/sunset, or silhouettes",
      aspectRatio: "3:2",
      lighting: 60,
      detailLevel: 85,
      realism: 95,
      saturation: 55,
      contrast: 70,
    },
  },
  {
    name: "Overcast",
    description: "Diffused natural light with minimal shadows",
    settings: {
      prompt: "Scene with soft, diffused lighting",
      style:
        "diffused natural light with minimal shadows, soft, even, for outdoor, soft-lit, or neutral-tone scenes",
      aspectRatio: "3:2",
      lighting: 60,
      detailLevel: 90,
      realism: 100,
      saturation: 45,
      contrast: 50,
    },
  },
  {
    name: "Closeup",
    description: "Tight frame on detail or expression",
    settings: {
      prompt: "Extreme close-up of subject detail",
      style:
        "tight frame on detail or expression, macro, closeup, for emotion, texture, or feature focus",
      aspectRatio: "1:1",
      lighting: 65,
      detailLevel: 100,
      realism: 100,
      saturation: 55,
      contrast: 65,
    },
  },
  {
    name: "Lowangle",
    description: "Shot from below, looking up",
    settings: {
      prompt: "Subject viewed from below",
      style:
        "shot from below, looking up, dramatic perspective, for dramatic or empowering perspectives",
      aspectRatio: "3:2",
      lighting: 65,
      detailLevel: 90,
      realism: 95,
      saturation: 55,
      contrast: 65,
    },
  },
  {
    name: "Topdown",
    description: "Shot directly from above",
    settings: {
      prompt: "Subject viewed from directly above",
      style:
        "shot directly from above, birds-eye view, overhead, for flat lays, food, or overhead views",
      aspectRatio: "1:1",
      lighting: 70,
      detailLevel: 95,
      realism: 100,
      saturation: 55,
      contrast: 60,
    },
  },
  {
    name: "Groundview",
    description: "Camera on the ground, angled up",
    settings: {
      prompt: "Scene viewed from ground level",
      style:
        "camera on the ground, angled up, worms-eye view, for kids, pets, or dramatic street shots",
      aspectRatio: "16:9",
      lighting: 65,
      detailLevel: 90,
      realism: 95,
      saturation: 55,
      contrast: 65,
    },
  },
  {
    name: "Overshoulder",
    description: "View from behind someone's shoulder",
    settings: {
      prompt: "Scene viewed from over someone's shoulder",
      style:
        "view from behind someone's shoulder, POV, perspective, for storytelling or point-of-view scenes",
      aspectRatio: "16:9",
      lighting: 60,
      detailLevel: 90,
      realism: 95,
      saturation: 50,
      contrast: 60,
    },
  },
];
