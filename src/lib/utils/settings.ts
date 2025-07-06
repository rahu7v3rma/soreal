import { Generation } from "@/context/supabase";
import { getStyleDisplayName } from "./styles";
import { SUPABASE_URL } from "@/constants/supabase";
import Papa from "papaparse";

export const generateExportCsv = (generations: Generation[]) => {
  const csvData = generations.map((generation) => ({
    "Generation Type": generation.generation_type || "N/A",
    "Public URL":
      generation.public_url?.replace(
        `${SUPABASE_URL}/storage/v1/object/public/assets`,
        `https://api.soreal.app/assets`
      ) || "N/A",
    Prompt: generation.prompt || "N/A",
    "Aspect Ratio": generation.aspect_ratio || "N/A",
    Style: getStyleDisplayName(generation.style),
    "Image Prompt URL": generation.image_prompt_url || "N/A",
    "Image URL": generation.image_url || "N/A",
    Scale: generation.scale || "N/A",
    "Credit Requirement": generation.credit_requirement || "N/A",
  }));

  const csvString = Papa.unparse(csvData);

  return csvString;
};
