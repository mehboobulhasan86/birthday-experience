import { and, eq, sql } from "drizzle-orm";
import { experiences, generationUsage } from "../drizzle/schema";
import { getDb } from "./db";
import type { ExperienceBlueprint } from "@shared/birthday";

function today() { return new Date().toISOString().slice(0, 10); }

export async function getUsage(ownerId: number) {
  const db = await getDb();
  if (!db) return { generationCount: 0, regenerationCount: 0 };
  const rows = await db.select().from(generationUsage).where(and(eq(generationUsage.ownerId, ownerId), eq(generationUsage.usageDate, today()))).limit(1);
  return rows[0] ?? { generationCount: 0, regenerationCount: 0 };
}

export async function getGlobalGenerationCount() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ total: sql<number>`coalesce(sum(${generationUsage.generationCount}), 0)` }).from(generationUsage).where(eq(generationUsage.usageDate, today()));
  return Number(rows[0]?.total ?? 0);
}

export async function incrementUsage(ownerId: number, kind: "generation" | "regeneration") {
  const db = await getDb();
  if (!db) return;
  const current = await getUsage(ownerId);
  const values = { ownerId, usageDate: today(), generationCount: current.generationCount + (kind === "generation" ? 1 : 0), regenerationCount: current.regenerationCount + (kind === "regeneration" ? 1 : 0) };
  if ("id" in current) await db.update(generationUsage).set(values).where(eq(generationUsage.id, current.id));
  else await db.insert(generationUsage).values(values);
}

export async function createExperience(ownerId: number, slug: string, blueprint: ExperienceBlueprint) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(experiences).values({ ownerId, slug, recipientName: blueprint.recipient.name, blueprintJson: JSON.stringify(blueprint), status: "published", generationCount: 1 });
  return { id: Number(result[0].insertId), slug };
}

export async function getExperienceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  try { return { ...row, blueprint: JSON.parse(row.blueprintJson) as ExperienceBlueprint }; } catch { return null; }
}

export async function updateExperience(id: number, blueprint: ExperienceBlueprint) {
  const db = await getDb();
  if (!db) return;
  await db.update(experiences).set({ recipientName: blueprint.recipient.name, blueprintJson: JSON.stringify(blueprint), generationCount: 2, status: "published" }).where(eq(experiences.id, id));
}

export async function getExperienceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(experiences).where(and(eq(experiences.slug, slug), eq(experiences.status, "published"))).limit(1);
  const row = rows[0];
  if (!row) return null;
  try { return { ...row, blueprint: JSON.parse(row.blueprintJson) as ExperienceBlueprint }; } catch { return null; }
}
