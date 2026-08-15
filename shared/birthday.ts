import { z } from "zod";

export const relationshipSchema = z.enum(["Best friend", "Partner", "Parent", "Sibling", "Colleague", "Other"]);
export const toneSchema = z.enum(["laugh", "heartfelt", "roast", "everything"]);
export const sceneTypeSchema = z.enum(["mystery", "nickname", "hobby", "inside_joke", "memory", "roast", "emotional", "message", "celebration", "one_more_thing"]);
export const anchorSchema = z.string().min(1).max(80);

export const sceneSchema = z.object({
  type: sceneTypeSchema,
  importance: z.enum(["supporting", "primary", "climax"]),
  visual_concept: z.string().min(1).max(120),
  interaction: z.enum(["tap_to_reveal", "tap_to_advance", "none"]),
  setup: z.string().max(280),
  beats: z.array(z.string().max(240)).min(1).max(6),
  punchline: z.string().max(280),
  pacing: z.enum(["quick", "steady", "slow_build", "quiet"]),
  confirmed_details: z.array(z.string().max(120)).max(6),
});

export const experienceBlueprintSchema = z.object({
  recipient: z.object({ name: z.string().min(1).max(80), nickname: z.string().max(80), relationship: relationshipSchema }),
  visual_style: z.enum(["bestfriend", "romantic", "family", "playful", "editorial"]),
  arc_type: z.enum(["roast_to_sincere", "curious_to_warm", "playful_to_sincere", "quiet_to_joyful"]),
  primary_personalization_anchor: anchorSchema,
  personalization_anchors: z.array(anchorSchema).min(1).max(4),
  music_mood: z.enum(["upbeat_then_soft", "bright", "soft", "cinematic"]),
  pacing: z.object({ overall: z.string().max(80), scene_transition: z.enum(["cinematic", "snappy", "gentle"]) }),
  creator_message: z.string().max(1200),
  source_details: z.string().max(4000),
  scenes: z.array(sceneSchema).min(5).max(10),
});

export type ExperienceBlueprint = z.infer<typeof experienceBlueprintSchema>;
export type ExperienceInput = { name: string; nickname: string; relationship: z.infer<typeof relationshipSchema>; about: string; message: string; tone: z.infer<typeof toneSchema> };

export const generationLimits = {
  dailyGenerations: 3,
  dailyRegenerations: 3,
  maxGenerationsPerExperience: 2,
  globalDailyRequests: 1000,
  maxInputChars: 4000,
  requestTimeoutMs: 30000,
} as const;

export function sanitizeText(value: string, max = 4000) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function sanitizeInput(input: ExperienceInput): ExperienceInput {
  return {
    name: sanitizeText(input.name, 80),
    nickname: sanitizeText(input.nickname, 80),
    relationship: input.relationship,
    about: sanitizeText(input.about, generationLimits.maxInputChars),
    message: sanitizeText(input.message, 1200),
    tone: input.tone,
  };
}

export function slugBase(name: string, nickname: string) {
  const base = sanitizeText(nickname || name || "birthday").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 42);
  return base || "someone";
}

export function buildShareSlug(name: string, nickname: string, suffix = Math.random().toString(36).slice(2, 6)) {
  return `${slugBase(name, nickname)}-${suffix}`;
}

export function validateBlueprint(value: unknown) {
  return experienceBlueprintSchema.safeParse(value);
}

export function demoBlueprint(input: ExperienceInput): ExperienceBlueprint {
  const anchor = input.about.toLowerCase().includes("lahore") ? "Lahore inside joke" : input.about.toLowerCase().includes("cricket") ? "competitive cricket energy" : input.nickname || "their unmistakable personality";
  const display = input.nickname || input.name;
  return {
    recipient: { name: input.name, nickname: input.nickname, relationship: input.relationship },
    visual_style: input.relationship === "Best friend" ? "bestfriend" : "editorial",
    arc_type: input.tone === "heartfelt" ? "quiet_to_joyful" : "roast_to_sincere",
    primary_personalization_anchor: anchor,
    personalization_anchors: [input.nickname || input.name, anchor, input.about.toLowerCase().includes("cricket") ? "cricket" : "personality"].slice(0, 3),
    music_mood: input.tone === "heartfelt" ? "soft" : "upbeat_then_soft",
    pacing: { overall: "dynamic_to_emotional", scene_transition: "cinematic" },
    creator_message: input.message,
    source_details: input.about,
    scenes: [
      { type: "mystery", importance: "supporting", visual_concept: "sealed_letter", interaction: "tap_to_reveal", setup: "Someone made something for you.", beats: ["A private cut is waiting.", "No generic birthday card energy."], punchline: "Open when you're ready.", pacing: "slow_build", confirmed_details: [] },
      { type: "nickname", importance: "primary", visual_concept: "identity_reveal", interaction: "tap_to_reveal", setup: "There was one name only certain people use...", beats: ["A little closer.", display.toUpperCase()], punchline: display.toUpperCase(), pacing: "slow_build", confirmed_details: input.nickname ? ["nickname"] : [] },
      { type: "hobby", importance: "supporting", visual_concept: input.about.toLowerCase().includes("cricket") ? "cricket_scoreboard" : "personality_hud", interaction: "tap_to_advance", setup: "A completely objective report.", beats: ["AGE: +1", input.about.toLowerCase().includes("cricket") ? "CONFIDENCE: MAX" : "CHARISMA: UNFAIR", "MATURITY: ERROR"], punchline: "The numbers are not looking good.", pacing: "quick", confirmed_details: input.about.toLowerCase().includes("cricket") ? ["cricket"] : [] },
      { type: "inside_joke", importance: "climax", visual_concept: "gps_recalculation", interaction: "tap_to_reveal", setup: input.about.toLowerCase().includes("lahore") ? "GPS INITIALIZING... DESTINATION: LAHORE" : "The file marked: only we would understand this.", beats: input.about.toLowerCase().includes("lahore") ? ["RECALCULATING...", "RECALCULATING...", "3 HOURS LATER", "CURRENT LOCATION: UNKNOWN"] : ["A memory too specific to explain.", "A punchline that belongs to both of you."], punchline: input.about.toLowerCase().includes("lahore") ? "One city. Two idiots. Zero sense of direction." : "No context. Somehow, perfect.", pacing: "slow_build", confirmed_details: input.about.toLowerCase().includes("lahore") ? ["Lahore", "three hours"] : [sanitizeText(input.about, 120)] },
      { type: "emotional", importance: "supporting", visual_concept: "quiet_pivot", interaction: "tap_to_advance", setup: "But jokes aside...", beats: ["This is the part where the room gets quieter."], punchline: "Keep going.", pacing: "quiet", confirmed_details: [] },
      { type: "message", importance: "climax", visual_concept: "letter_in_dark", interaction: "tap_to_advance", setup: "The words only you could write.", beats: input.message ? input.message.split(/(?<=[.!?])\s+/).slice(0, 4) : ["Happy birthday. You are loved."], punchline: "", pacing: "quiet", confirmed_details: input.message ? ["creator message"] : [] },
      { type: "celebration", importance: "climax", visual_concept: "lantern_burst", interaction: "tap_to_advance", setup: "HAPPY BIRTHDAY", beats: [display.toUpperCase()], punchline: "...one more thing", pacing: "quick", confirmed_details: [] },
      { type: "one_more_thing", importance: "supporting", visual_concept: "private_postscript", interaction: "none", setup: "One more thing.", beats: ["Stay exactly the same."], punchline: "The world is better with you in it.", pacing: "quiet", confirmed_details: [] },
    ],
  };
}
