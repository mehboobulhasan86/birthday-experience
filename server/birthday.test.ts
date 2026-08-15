import { describe, expect, it } from "vitest";
import { demoBlueprint, sanitizeInput, validateBlueprint } from "@shared/birthday";

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
