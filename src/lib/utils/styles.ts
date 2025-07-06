import {
  LEGACY_STYLE_PRESETS,
  STYLE_PRESETS,
  DEFAULT_STYLE_KEYWORDS,
  DEFAULT_STYLE_KEYWORDS_VARIATIONS,
} from "@/constants/styles";

export function getStyleDisplayName(
  styleString: string | null | undefined
): string {
  if (!styleString) {
    return "Default";
  }

  const normalizedStyle = styleString.trim().toLowerCase();

  for (const [presetKey, presetValue] of Object.entries(STYLE_PRESETS)) {
    if (normalizedStyle === presetValue.toLowerCase().trim()) {
      return presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
    }
  }

  for (const [presetKey, presetValue] of Object.entries(LEGACY_STYLE_PRESETS)) {
    if (normalizedStyle === presetValue.toLowerCase().trim()) {
      return presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
    }
  }

  if (normalizedStyle === DEFAULT_STYLE_KEYWORDS) {
    return "Default";
  }

  for (const defaultVariation of DEFAULT_STYLE_KEYWORDS_VARIATIONS) {
    if (normalizedStyle === defaultVariation.toLowerCase().trim()) {
      return "Default";
    }
  }

  return "Default";
}
