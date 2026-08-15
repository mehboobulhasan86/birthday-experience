import { describe, expect, it } from "vitest";
import { invokeLLM } from "./_core/llm";
import { generateBlueprint } from "./birthdayAi";

describe("configured birthday AI provider", () => {
  it("can reach the configured Manus model", async () => {
    expect(process.env.BIRTHDAY_AI_PROVIDER).toBe("real");
    expect(process.env.BIRTHDAY_AI_MODEL).toBeTruthy();

    const response = await invokeLLM({
      model: process.env.BIRTHDAY_AI_MODEL,
      messages: [
        { role: "system", content: "Reply with exactly OK." },
        { role: "user", content: "Health check" },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    expect(typeof content).toBe("string");
    expect((content as string).trim().length).toBeGreaterThan(0);
  }, 30_000);

  it("generates a validated birthday blueprint with the real provider", async () => {
    const result = await generateBlueprint({
      name: "Maya",
      nickname: "May",
      relationship: "Best friend",
      about: "Maya is the friend who turns every quiet evening into a competitive cricket match, keeps a running list of terrible puns, and once got us lost in Lahore while searching for the best chai. We have supported each other through career changes and still laugh at the same old voice note.",
      message: "Happy birthday, May. More ridiculous adventures ahead.",
      tone: "everything",
    });

    expect(["mock", "real"]).toContain(result.provider);
    expect(typeof result.fallback).toBe("boolean");
    expect(result.blueprint.recipient.name).toBe("Maya");
    expect(result.blueprint.scenes.length).toBeGreaterThanOrEqual(5);
    expect(new Set(result.blueprint.scenes.map((scene) => scene.type)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(result.blueprint.scenes.map((scene) => scene.visual_concept)).size).toBeGreaterThanOrEqual(4);
    expect(result.blueprint.scenes.every((scene) => scene.setup.length > 0 && scene.beats.length > 0)).toBe(true);
    expect(JSON.stringify(result.blueprint).toLowerCase()).toContain("maya");
  }, 60_000);
});
