export const STANDARD_IMAGE_MODEL = "black-forest-labs/flux-schnell";

// Premium API Migration: Imagen 4 Ultra for text-only prompts, Flux-Kontext-Pro for image reference prompts
export const PREMIUM_TEXT_MODEL = "google/imagen-4-ultra"; // Imagen 4 Ultra for text-only prompts
export const PREMIUM_IMAGE_MODEL = "black-forest-labs/flux-kontext-pro"; // Flux-Kontext-Pro for image reference prompts
export const PREMIUM_IMAGE_FALLBACK_MODEL = "black-forest-labs/flux-canny-pro"; // Fallback for image reference prompts

export const REMOVE_BACKGROUND_IMAGE_VERSION =
  "f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7";
export const UPSCALE_IMAGE_VERSION =
  "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
