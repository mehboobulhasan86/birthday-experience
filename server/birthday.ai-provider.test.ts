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
      about: "We got lost together in Lahore after a cricket match.",
      message: "Happy birthday, May. More ridiculous adventures ahead.",
      tone: "everything",
    });

    expect(result.provider).toBe("real");
    expect(result.fallback).toBe(false);
    expect(result.blueprint.recipient.name).toBe("Maya");
    expect(result.blueprint.scenes.length).toBeGreaterThanOrEqual(5);
  }, 45_000);
});
