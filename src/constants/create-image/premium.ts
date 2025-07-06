// Aspect ratios supported without reference image (text-to-image generation)
export const textToImageAspectRatios = ["1:1", "9:16", "16:9", "3:4", "4:3"];

// Aspect ratios supported with reference image (image-to-image generation)
export const imageToImageAspectRatios = ["21:9", "16:9", "3:2", "4:3", "5:4", "1:1", "4:5", "3:4", "2:3", "9:16", "9:21"];

// Combined valid aspect ratios for validation
export const validAspectRatios = ["21:9", "16:9", "3:2", "4:3", "5:4", "1:1", "4:5", "3:4", "2:3", "9:16", "9:21"];
export const validFileFormats = ["png", "jpg"];

// Aspect ratio options for text-to-image generation
export const textToImageOptions = [
  { value: "1:1",  label: "Square (1:1) — Best for: Instagram posts" },
  { value: "16:9", label: "Landscape (16:9) — Best for: hero images" },
  { value: "4:3",  label: "Classic (4:3) — Best for: presentation slides" },
  { value: "3:4",  label: "Tall (3:4) — Best for: book or poster covers" },
  { value: "9:16", label: "Mobile (9:16) — Best for: stories & reels" }
];

// Aspect ratio options for image-to-image generation
export const imageToImageOptions = [
  { value: "21:9", label: "Ultra-Wide (21:9) — Best for: web banners" },
  { value: "16:9", label: "Landscape (16:9) — Best for: hero images" },
  { value: "3:2",  label: "Standard (3:2) — Best for: DSLR-style photos" },
  { value: "4:3",  label: "Classic (4:3) — Best for: presentation slides" },
  { value: "5:4",  label: "Print (5:4) — Best for: magazine layouts" },
  { value: "1:1",  label: "Square (1:1) — Best for: Instagram posts" },
  { value: "4:5",  label: "Portrait (4:5) — Best for: feed images" },
  { value: "3:4",  label: "Tall (3:4) — Best for: book or poster covers" },
  { value: "2:3",  label: "Photo (2:3) — Best for: 4×6 prints" },
  { value: "9:16", label: "Mobile (9:16) — Best for: stories & reels" },
  { value: "9:21", label: "Ultra-Tall (9:21) — Best for: full-screen phones" }
];

// Dynamic aspect ratio options - will be filtered based on whether image reference is provided
export const aspectRatioOptions = imageToImageOptions;

// Quality enhancement prompts for different styles
export const PREMIUM_REALISTIC_QUALITY_PROMPT = "high-resolution, ultra-detailed image using natural lighting. Include realistic shadows, true-to-life colors, accurate reflections, and subtle depth of field. Keep the composition clean, with sharp focus on the subject and balanced, organic lighting. Textures should look real and physically accurate. The final image should feel like it was taken with a professional DSLR. ⸻ Rendering Guidelines • No text, logos, or watermarks (unless requested) • No humans or humanoid figures • No anatomical errors or surreal features • No floating, intersecting, or malformed objects • No low-resolution areas, blur, or artifacts • No background clutter or distracting elements • No exaggerated colors or unnatural effects • No motion blur unless intentional • No borders, vignettes, or lens distortion";

export const PREMIUM_ARTISTIC_QUALITY_PROMPT = "High-quality detailed artwork with clean lines and consistent style. Well-balanced composition with appropriate lighting for the artistic medium. Coherent color palette and visual consistency throughout. Sharp, clear details without blur or artifacts. Professional artistic finish with smooth rendering and proper proportions. Ultra-detailed execution with fine texture work and precise line quality. Harmonious color relationships and thoughtful contrast. Clean edges and smooth gradients where appropriate. – No text or logos unless requested – No humans – No extra limbs, digits, or anatomical inaccuracies – No intersecting or floating objects – No malformed or distorted features – No low-resolution areas or blur – No visual artifacts or inconsistent styling – No mixed art styles within single image – No incomplete or cut-off elements – No watermarks or signatures – No frame borders unless part of artistic intent – No muddy or unclear details – No color bleeding or poor blending – No perspective errors or impossible geometry – No repetitive patterns unless intentional – No pixelation or compression artifacts";

// Keywords that indicate artistic/non-realistic styles
export const ARTISTIC_STYLE_KEYWORDS = [
  'cartoon', 'anime', 'manga', 'comic', 'illustration', 'drawing', 'sketch', 'painting',
  'watercolor', 'oil painting', 'digital art', 'concept art', 'fantasy art', 'stylized',
  'animated', 'cel-shaded', 'vector', 'minimalist', 'abstract', 'impressionist',
  'expressionist', 'cubist', 'surreal', 'pop art', 'street art', 'graffiti',
  'pixel art', 'low poly', '3d render', 'clay', 'sculpture', 'origami'
];

export const premiumDefaultAspectRatio = "16:9";

export const premiumDefaultFileFormat = "png";

export const premiumImageApiUrl = "https://api.soreal.app/create-image/premium";