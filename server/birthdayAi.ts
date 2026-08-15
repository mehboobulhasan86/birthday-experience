import { invokeLLM } from "./_core/llm";
import { assetTokensFor, demoBlueprint, experienceBlueprintSchema, sanitizeInput, type ExperienceBlueprint, type ExperienceInput } from "@shared/birthday";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["recipient", "card_layout", "visual_style", "arc_type", "primary_personalization_anchor", "personalization_anchors", "music_mood", "pacing", "creator_message", "source_details", "scenes"],
  properties: {
    recipient: { type: "object", additionalProperties: false, required: ["name", "nickname", "relationship"], properties: { name: { type: "string" }, nickname: { type: "string" }, relationship: { type: "string", enum: ["Best friend", "Partner", "Parent", "Sibling", "Colleague", "Other"] } } },
    card_layout: { type: "string", enum: ["cinema", "scrapbook", "editorial", "terminal", "postcard"] },
    visual_style: { type: "string", enum: ["bestfriend", "romantic", "family", "playful", "editorial"] },
    arc_type: { type: "string", enum: ["roast_to_sincere", "curious_to_warm", "playful_to_sincere", "quiet_to_joyful"] },
    primary_personalization_anchor: { type: "string" },
    personalization_anchors: { type: "array", maxItems: 4, items: { type: "string", maxLength: 80 } },
    music_mood: { type: "string", enum: ["upbeat_then_soft", "bright", "soft", "cinematic"] },
    pacing: { type: "object", additionalProperties: false, required: ["overall", "scene_transition"], properties: { overall: { type: "string" }, scene_transition: { type: "string", enum: ["cinematic", "snappy", "gentle"] } } },
    creator_message: { type: "string" },
    source_details: { type: "string" },
    scenes: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", additionalProperties: false, required: ["type", "render_mode", "importance", "visual_concept", "asset_direction", "interaction", "setup", "beats", "punchline", "pacing", "confirmed_details"], properties: { type: { type: "string", enum: ["mystery", "nickname", "hobby", "inside_joke", "memory", "roast", "emotional", "message", "celebration", "one_more_thing"] }, render_mode: { type: "string", enum: ["poster", "polaroid", "journal", "dashboard", "map", "letter"] }, importance: { type: "string", enum: ["supporting", "primary", "climax"] }, visual_concept: { type: "string", minLength: 1, maxLength: 40 }, asset_direction: { type: "string", minLength: 1, maxLength: 52 }, interaction: { type: "string", enum: ["tap_to_reveal", "tap_to_advance", "none"] }, setup: { type: "string", minLength: 1, maxLength: 64 }, beats: { type: "array", minItems: 1, maxItems: 1, items: { type: "string", minLength: 1, maxLength: 52 } }, punchline: { type: "string", maxLength: 48 }, pacing: { type: "string", enum: ["quick", "steady", "slow_build", "quiet"] }, confirmed_details: { type: "array", maxItems: 1, items: { type: "string", maxLength: 42 } } } } },
  },
} as const;

export async function generateBlueprint(raw: ExperienceInput): Promise<{ blueprint: ExperienceBlueprint; provider: "mock" | "real"; fallback: boolean }> {
  const input = sanitizeInput(raw);
  if (process.env.BIRTHDAY_AI_PROVIDER !== "real") return { blueprint: demoBlueprint(input), provider: "mock", fallback: false };
  try {
    const request = () => invokeLLM({
      model: process.env.BIRTHDAY_AI_MODEL === "gpt-5-nano" ? "gpt-5-mini" : process.env.BIRTHDAY_AI_MODEL,
      max_completion_tokens: 5000,
      reasoning: { effort: "minimal" },
      messages: [
        { role: "system", content: "You are the creative director and card art director of Birthday Experience. Return only a strict JSON Experience Blueprint. This is not a nickname substitution task: transform the complete creator brief into an original mini-story and a distinct card design. Use the relationship to choose intimacy and language, use the tone to choose comedic versus tender beats, and mine the about text for concrete habits, hobbies, memories, places, phrases, and inside jokes. Never invent locations, names, memories, or facts; if a detail is uncertain, omit it. Choose card_layout, arc_type, visual_style, music_mood, and pacing for this specific person. Create exactly 5 concise scenes with a beginning, middle, and emotional payoff. For every scene, choose render_mode based on the actual content: poster for a bold statement, polaroid for a photo-like memory, journal for an intimate entry, dashboard for quantified hobby/roast details, map for a real place or journey, or letter for direct emotion. Also author asset_direction in 12 words or fewer: a plain-language art direction. The server maps the authored direction and render mode to concrete visual tokens so the renderer treatment matches the brief. Keep every field ultra-compact; each scene must stay under 35 words total, with exactly one short beat and one confirmed detail so the JSON completes within the response budget. Do not repeat a scene type or render mode unless the brief truly requires it. The frontend will render different DOM structures for each render_mode, so these choices must be semantically meaningful and must not default to a generic name reveal, scoreboard, map, message, or celebration sequence unless the creator brief genuinely supports that treatment." },
        { role: "user", content: JSON.stringify({ task: "Compose a one-off birthday experience from every available input field", requirements: ["Make habits, bond, memories, story details, and tone visible in the scenes", "Let the scene array determine the sequence and visual treatment", "Prefer specific details over generic birthday language"], input }) },
      ],
      response_format: { type: "json_schema", json_schema: { name: "experience_blueprint", strict: true, schema } },
    });
    const response = await request();
    const choice = response.choices?.[0];
    const content = choice?.message?.content;
    if (choice?.finish_reason === "length" || typeof content !== "string" || !content.trim()) {
      throw new Error(`Structured blueprint response incomplete: ${choice?.finish_reason || "empty content"}`);
    }
    const text = content.trim();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Structured blueprint response was not valid JSON");
    }
    const normalized = {
      ...parsed,
      primary_personalization_anchor: typeof parsed?.primary_personalization_anchor === "string" && parsed.primary_personalization_anchor.trim()
        ? parsed.primary_personalization_anchor
        : input.nickname || input.name,
      personalization_anchors: Array.isArray(parsed?.personalization_anchors) && parsed.personalization_anchors.length > 0
        ? parsed.personalization_anchors
        : [input.about.slice(0, 80) || input.relationship],
      scenes: Array.isArray(parsed?.scenes)
        ? parsed.scenes.map((scene: Record<string, unknown>, index: number) => ({
            ...scene,
            asset_tokens: scene.asset_tokens ?? assetTokensFor(String(scene.render_mode || "poster"), index),
          }))
        : parsed?.scenes,
    };
    const validated = experienceBlueprintSchema.safeParse(normalized);
    const groundedTerms = Array.from(new Set((input.about.toLowerCase().match(/[a-z][a-z'-]{4,}/g) || []).filter(term => !["about", "every", "their", "there", "which", "where", "would", "could", "always", "makes", "person", "quiet", "small", "someone", "really", "still"].includes(term))));
    const generatedText = JSON.stringify(normalized).toLowerCase();
    const groundedMatches = groundedTerms.filter(term => generatedText.includes(term));
    const unrelatedDemoTerms = ["shani", "lahore", "cricket"].filter(term => !input.about.toLowerCase().includes(term) && !input.message.toLowerCase().includes(term));
    if (groundedTerms.length > 0 && groundedMatches.length < Math.min(2, groundedTerms.length)) {
      throw new Error("Blueprint was not sufficiently grounded in the submitted memory details");
    }
    if (unrelatedDemoTerms.some(term => generatedText.includes(term))) {
      throw new Error("Blueprint contained unrelated demo details");
    }
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
