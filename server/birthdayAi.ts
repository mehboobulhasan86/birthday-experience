import { invokeLLM } from "./_core/llm";
import { demoBlueprint, experienceBlueprintSchema, sanitizeInput, type ExperienceBlueprint, type ExperienceInput } from "@shared/birthday";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["recipient", "visual_style", "arc_type", "primary_personalization_anchor", "personalization_anchors", "music_mood", "pacing", "creator_message", "source_details", "scenes"],
  properties: {
    recipient: { type: "object", additionalProperties: false, required: ["name", "nickname", "relationship"], properties: { name: { type: "string" }, nickname: { type: "string" }, relationship: { type: "string", enum: ["Best friend", "Partner", "Parent", "Sibling", "Colleague", "Other"] } } },
    visual_style: { type: "string", enum: ["bestfriend", "romantic", "family", "playful", "editorial"] },
    arc_type: { type: "string", enum: ["roast_to_sincere", "curious_to_warm", "playful_to_sincere", "quiet_to_joyful"] },
    primary_personalization_anchor: { type: "string" },
    personalization_anchors: { type: "array", items: { type: "string" } },
    music_mood: { type: "string", enum: ["upbeat_then_soft", "bright", "soft", "cinematic"] },
    pacing: { type: "object", additionalProperties: false, required: ["overall", "scene_transition"], properties: { overall: { type: "string" }, scene_transition: { type: "string", enum: ["cinematic", "snappy", "gentle"] } } },
    creator_message: { type: "string" },
    source_details: { type: "string" },
    scenes: { type: "array", minItems: 5, maxItems: 10, items: { type: "object", additionalProperties: false, required: ["type", "importance", "visual_concept", "interaction", "setup", "beats", "punchline", "pacing", "confirmed_details"], properties: { type: { type: "string", enum: ["mystery", "nickname", "hobby", "inside_joke", "memory", "roast", "emotional", "message", "celebration", "one_more_thing"] }, importance: { type: "string", enum: ["supporting", "primary", "climax"] }, visual_concept: { type: "string", minLength: 1 }, interaction: { type: "string", enum: ["tap_to_reveal", "tap_to_advance", "none"] }, setup: { type: "string" }, beats: { type: "array", minItems: 1, items: { type: "string", minLength: 1 } }, punchline: { type: "string" }, pacing: { type: "string", enum: ["quick", "steady", "slow_build", "quiet"] }, confirmed_details: { type: "array", items: { type: "string" } } } } },
  },
} as const;

export async function generateBlueprint(raw: ExperienceInput): Promise<{ blueprint: ExperienceBlueprint; provider: "mock" | "real"; fallback: boolean }> {
  const input = sanitizeInput(raw);
  if (process.env.BIRTHDAY_AI_PROVIDER !== "real") return { blueprint: demoBlueprint(input), provider: "mock", fallback: false };
  try {
    const response = await invokeLLM({
      model: process.env.BIRTHDAY_AI_MODEL,
      messages: [
        { role: "system", content: "You are the creative director of Birthday Experience. Return only a strict JSON Experience Blueprint. Use only confirmed details from the creator brief. Never invent locations, names, memories, or facts. If a detail is uncertain, omit it." },
        { role: "user", content: JSON.stringify({ task: "Create a personalized birthday journey blueprint", input }) },
      ],
      response_format: { type: "json_schema", json_schema: { name: "experience_blueprint", strict: true, schema } },
    });
    const content = response.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : JSON.stringify(content);
    const parsed = JSON.parse(text);
    const validated = experienceBlueprintSchema.safeParse(parsed);
    if (!validated.success) {
      const issueSummary = validated.error.issues
        .map(issue => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; ");
      throw new Error(`Blueprint validation failed: ${issueSummary}`);
    }
    return { blueprint: validated.data, provider: "real", fallback: false };
  } catch (error) {
    console.warn("[Birthday AI] Real provider failed; using deterministic fallback", error);
    return { blueprint: demoBlueprint(input), provider: "mock", fallback: true };
  }
}
