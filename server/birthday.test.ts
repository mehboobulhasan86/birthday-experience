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
