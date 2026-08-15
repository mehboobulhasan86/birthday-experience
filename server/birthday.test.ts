import { describe, expect, it } from "vitest";
import { demoBlueprint, sanitizeInput, validateBlueprint } from "@shared/birthday";
import { getScenePacingClass, getSceneVisualFamily } from "@shared/birthdayScene";

describe("birthday blueprint contract", () => {
  it("sanitizes markup and whitespace from creator input", () => {
    const result = sanitizeInput({ name: "  <Ahmed>  ", nickname: " Shani ", relationship: "Best friend", about: " cricket   and   Lahore ", message: " <b>Happy</b> ", tone: "everything" });
    expect(result.name).toBe("Ahmed");
    expect(result.about).toBe("cricket and Lahore");
    expect(result.message).toBe("bHappy/b");
  });

  it("creates a valid deterministic blueprint without inventing unsupported details", () => {
    const blueprint = demoBlueprint({ name: "Ahmed", nickname: "Shani", relationship: "Best friend", about: "Competitive cricket fan; we got lost in Lahore.", message: "Happy birthday bro.", tone: "everything" });
    expect(validateBlueprint(blueprint).success).toBe(true);
    expect(blueprint.primary_personalization_anchor).toContain("Lahore");
    expect(blueprint.scenes).toHaveLength(8);
    expect(JSON.stringify(blueprint)).not.toContain("Karachi");
  });

  it("maps blueprint metadata to different renderer families and pacing classes", () => {
    const playful = demoBlueprint({ name: "Ahmed", nickname: "Shani", relationship: "Best friend", about: "Competitive cricket fan; we got lost in Lahore.", message: "Happy birthday bro.", tone: "everything" });
    const heartfelt = demoBlueprint({ name: "Sara", nickname: "Sari", relationship: "Parent", about: "She taught me to cook and stayed beside me through university.", message: "Thank you for always being home.", tone: "heartfelt" });
    expect(new Set(playful.scenes.map((scene) => getSceneVisualFamily(scene, playful.visual_style))).size).toBeGreaterThan(1);
    expect(new Set(heartfelt.scenes.map((scene) => getSceneVisualFamily(scene, heartfelt.visual_style))).size).toBeGreaterThan(1);
    expect(getScenePacingClass(playful.scenes[0], playful.pacing.overall)).toContain("ai-pacing-slow_build");
    expect(getScenePacingClass(heartfelt.scenes[0], heartfelt.pacing.overall)).toContain("ai-overall-dynamic-to-emotional");
  });

  it("changes the fallback scene contract for materially different briefs", () => {
    const playful = demoBlueprint({ name: "Ahmed", nickname: "Shani", relationship: "Best friend", about: "Competitive cricket fan; we got lost in Lahore.", message: "Happy birthday bro.", tone: "everything" });
    const heartfelt = demoBlueprint({ name: "Sara", nickname: "Sari", relationship: "Parent", about: "She taught me to cook and stayed beside me through university.", message: "Thank you for always being home.", tone: "heartfelt" });
    expect(playful.visual_style).not.toBe(heartfelt.visual_style);
    expect(playful.arc_type).not.toBe(heartfelt.arc_type);
    expect(playful.music_mood).not.toBe(heartfelt.music_mood);
    expect(playful.scenes.map((scene) => scene.visual_concept)).not.toEqual(heartfelt.scenes.map((scene) => scene.visual_concept));
    expect(playful.source_details).not.toBe(heartfelt.source_details);
    expect(playful.scenes.map((scene) => scene.setup)).not.toEqual(heartfelt.scenes.map((scene) => scene.setup));
  });
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("birthday API boundaries", () => {
  it("rejects generation without an authenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.birthday.generate({
      name: "Ahmed",
      nickname: "Shani",
      relationship: "Best friend",
      about: "cricket",
      message: "Happy birthday",
      tone: "everything",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
