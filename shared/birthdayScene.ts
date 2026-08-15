import type { ExperienceBlueprint } from "./birthday";

type Scene = ExperienceBlueprint["scenes"][number];

export type SceneVisualFamily = "map" | "score" | "letter" | "gallery" | "collage";

export function getSceneVisualFamily(scene: Scene, visualStyle?: ExperienceBlueprint["visual_style"]): SceneVisualFamily {
  const value = `${scene.type} ${scene.visual_concept} ${scene.setup}`.toLowerCase();
  if (visualStyle === "romantic" || visualStyle === "editorial") return /hobby|roast|score|sport/.test(value) ? "score" : "letter";
  if (visualStyle === "family") return /memory|photo|message|emotional/.test(value) ? "gallery" : "collage";
  if (visualStyle === "playful") return /memory|location|journey/.test(value) ? "map" : "collage";
  if (/map|gps|city|journey|route|location|travel/.test(value)) return "map";
  if (/score|sport|cricket|game|performance|number|stat/.test(value)) return "score";
  if (/letter|message|quote|memory|note|heart|emotional/.test(value)) return "letter";
  if (/photo|portrait|collage|gallery|snapshot/.test(value)) return "gallery";
  return "collage";
}

export function getScenePacingClass(scene: Scene, overall?: string) {
  const normalized = overall?.toLowerCase().replace(/[^a-z]+/g, "-") || "ai-paced";
  return `ai-pacing-${scene.pacing} ai-overall-${normalized}`;
}
