import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { buildShareSlug, generationLimits, relationshipSchema, toneSchema, type ExperienceInput } from "@shared/birthday";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createExperience, getExperienceById, getExperienceBySlug, getGlobalGenerationCount, getUsage, incrementUsage, updateExperience } from "./birthdayDb";
import { generateBlueprint } from "./birthdayAi";
import { storagePut } from "./storage";
import { createExperiencePhoto } from "./photoDb";

const inputSchema = z.object({
  name: z.string().min(1).max(80),
  nickname: z.string().max(80).default(""),
  relationship: relationshipSchema,
  about: z.string().max(generationLimits.maxInputChars).default(""),
  message: z.string().max(1200).default(""),
  tone: toneSchema.default("everything"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  birthday: router({
    generate: protectedProcedure.input(inputSchema).mutation(async ({ ctx, input }) => {
      const usage = await getUsage(ctx.user.id);
      const globalUsage = await getGlobalGenerationCount();
      if (usage.generationCount >= generationLimits.dailyGenerations) throw new Error("Daily generation limit reached. Try again tomorrow.");
      if (globalUsage >= generationLimits.globalDailyRequests) throw new Error("Birthday Experience is at capacity for today. Try again tomorrow.");
      const result = await generateBlueprint(input as ExperienceInput);
      await incrementUsage(ctx.user.id, "generation");
      const slug = buildShareSlug(result.blueprint.recipient.name, result.blueprint.recipient.nickname);
      const created = await createExperience(ctx.user.id, slug, result.blueprint);
      return { ...result, slug, experienceId: created?.id ?? null };
    }),
    regenerate: protectedProcedure.input(inputSchema.extend({ experienceId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const usage = await getUsage(ctx.user.id);
      const existing = await getExperienceById(input.experienceId);
      if (!existing || existing.ownerId !== ctx.user.id) throw new Error("Experience not found.");
      if (existing.generationCount >= generationLimits.maxGenerationsPerExperience) throw new Error("This experience has reached its regeneration limit.");
      if (usage.regenerationCount >= generationLimits.dailyRegenerations) throw new Error("Daily regeneration limit reached. Try again tomorrow.");
      if (await getGlobalGenerationCount() >= generationLimits.globalDailyRequests) throw new Error("Birthday Experience is at capacity for today. Try again tomorrow.");
      const result = await generateBlueprint(input as ExperienceInput);
      await incrementUsage(ctx.user.id, "regeneration");
      await updateExperience(existing.id, result.blueprint);
      return { ...result, slug: existing.slug, experienceId: existing.id };
    }),
    addPhoto: protectedProcedure.input(z.object({ experienceId: z.number().int().positive(), fileName: z.string().regex(/^[a-zA-Z0-9._-]+$/).max(120), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), base64: z.string().max(4_000_000) })).mutation(async ({ ctx, input }) => {
      const existing = await getExperienceById(input.experienceId);
      if (!existing || existing.ownerId !== ctx.user.id) throw new Error("Experience not found.");
      const data = Buffer.from(input.base64.replace(/^data:[^;]+;base64,/, ""), "base64");
      if (data.byteLength > 3_000_000) throw new Error("Photo must be smaller than 3 MB.");
      const uploaded = await storagePut(`birthday/${ctx.user.id}/${input.fileName}`, data, input.contentType);
      const photoId = await createExperiencePhoto({ experienceId: input.experienceId, ownerId: ctx.user.id, storageKey: uploaded.key, url: uploaded.url });
      return { photoId, url: uploaded.url };
    }),
    read: publicProcedure.input(z.object({ slug: z.string().min(3).max(80) })).query(({ input }) => getExperienceBySlug(input.slug)),
  }),
});

export type AppRouter = typeof appRouter;
