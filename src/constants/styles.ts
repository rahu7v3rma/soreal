// Default style keywords for photorealistic image generation
export const DEFAULT_STYLE_KEYWORDS =
  "photorealistic, 8K, hyperdetailed, professional photography, sharp focus, DSLR, natural lighting, cinematic, HDR";

// Style presets mapping preset names to their keyword strings
export const STYLE_PRESETS = {
  default: DEFAULT_STYLE_KEYWORDS,
  portrait:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, chest or shoulders up, focused on the face, headshot style, professional portrait, for headshots, profiles, or interviews",
  landscape:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, wide view of the full scene, expansive, panoramic, for travel, architecture, or background-focused shots",
  hardlight:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, strong light with sharp, defined shadows, dramatic, high contrast, for dramatic portraits, fashion, or contrast-heavy images",
  neonlit:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, bright, glowing colors with an artificial light feel, vibrant, neon, for night scenes, city lights, or cyberpunk settings",
  faded:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, muted tones with a soft, vintage look, retro, nostalgic, for retro, nostalgic, or film-style visuals",
  staged:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, clean, even studio lighting, professional, controlled, for product shots, portraits, or editorial setups",
  sunlit:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, warm, natural daylight, golden hour, outdoor, for outdoor, nature, or lifestyle photos",
  shadowed:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, low light with deep contrast, moody, noir, for moody, noir, or dramatic compositions",
  washed:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, soft, pale light with low contrast, dreamy, ethereal, for dreamy, calm, or romantic moods",
  backglow:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, light behind the subject, creating a rim or silhouette, backlit, for backlit scenes, sunrise/sunset, or silhouettes",
  overcast:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, diffused natural light with minimal shadows, soft, even, for outdoor, soft-lit, or neutral-tone scenes",
  closeup:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, tight frame on detail or expression, macro, closeup, for emotion, texture, or feature focus",
  lowangle:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, shot from below, looking up, dramatic perspective, for dramatic or empowering perspectives",
  topdown:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, shot directly from above, birds-eye view, overhead, for flat lays, food, or overhead views",
  groundview:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, camera on the ground, angled up, worms-eye view, for kids, pets, or dramatic street shots",
  overshoulder:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, view from behind someone's shoulder, POV, perspective, for storytelling or point-of-view scenes",
} as const;

// TypeScript type for style preset keys
export type StylePreset = keyof typeof STYLE_PRESETS;

export const STANDARD_STYLE_PRESETS = {
  portrait:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, chest or shoulders up, focused on the face, headshot style, professional portrait, for headshots, profiles, or interviews",
  landscape:
    "Ultra-sharp 8K photo, DSLR camera, natural light, HDR, realistic color and texture, crisp focus, soft shadows, true-to-life tones, fine surface detail, subtle depth of field, clean background, wide view of the full scene, expansive, panoramic, for travel, architecture, or background-focused shots",
};

export const LEGACY_STYLE_PRESETS = {
  portrait:
    "chest or shoulders up, focused on the face, headshot style, professional portrait, for headshots, profiles, or interviews",
  landscape:
    "wide view of the full scene, expansive, panoramic, for travel, architecture, or background-focused shots",
  hardlight:
    "strong light with sharp, defined shadows, dramatic, high contrast, for dramatic portraits, fashion, or contrast-heavy images",
  neonlit:
    "bright, glowing colors with an artificial light feel, vibrant, neon, for night scenes, city lights, or cyberpunk settings",
  faded:
    "muted tones with a soft, vintage look, retro, nostalgic, for retro, nostalgic, or film-style visuals",
  staged:
    "clean, even studio lighting, professional, controlled, for product shots, portraits, or editorial setups",
  sunlit:
    "warm, natural daylight, golden hour, outdoor, for outdoor, nature, or lifestyle photos",
  shadowed:
    "low light with deep contrast, moody, noir, for moody, noir, or dramatic compositions",
  washed:
    "soft, pale light with low contrast, dreamy, ethereal, for dreamy, calm, or romantic moods",
  backglow:
    "light behind the subject, creating a rim or silhouette, backlit, for backlit scenes, sunrise/sunset, or silhouettes",
  overcast:
    "diffused natural light with minimal shadows, soft, even, for outdoor, soft-lit, or neutral-tone scenes",
  closeup:
    "tight frame on detail or expression, macro, closeup, for emotion, texture, or feature focus",
  lowangle:
    "shot from below, looking up, dramatic perspective, for dramatic or empowering perspectives",
  topdown:
    "shot directly from above, birds-eye view, overhead, for flat lays, food, or overhead views",
  groundview:
    "camera on the ground, angled up, worms-eye view, for kids, pets, or dramatic street shots",
  overshoulder:
    "view from behind someone's shoulder, POV, perspective, for storytelling or point-of-view scenes",
};

export const DEFAULT_STYLE_KEYWORDS_VARIATIONS = [
  "photorealistic, high resolution, 8k, hyperdetailed, professional photography, sharp focus, dslr, natural lighting, cinematic, hdr",
];
