import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  recipientName: varchar("recipientName", { length: 80 }).notNull(),
  blueprintJson: text("blueprintJson").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  generationCount: int("generationCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const generationUsage = mysqlTable("generationUsage", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  usageDate: varchar("usageDate", { length: 10 }).notNull(),
  generationCount: int("generationCount").default(0).notNull(),
  regenerationCount: int("regenerationCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const experiencePhotos = mysqlTable("experiencePhotos", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  ownerId: int("ownerId").notNull(),
  storageKey: varchar("storageKey", { length: 255 }).notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;
export type GenerationUsage = typeof generationUsage.$inferSelect;
export type ExperiencePhoto = typeof experiencePhotos.$inferSelect;