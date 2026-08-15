import { experiencePhotos } from "../drizzle/schema";
import { getDb } from "./db";

export async function createExperiencePhoto(input: { experienceId: number; ownerId: number; storageKey: string; url: string }) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(experiencePhotos).values(input);
  return Number(result[0].insertId);
}
