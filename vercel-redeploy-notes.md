# Vercel Redeploy and LLM Notes

The Vercel project is `birthday-experience`, linked to `mehboobulhasan86/birthday-experience`, with production domain `https://birthday-experience-alpha.vercel.app`.

## Deployment Fixes

The Vercel serverless entrypoint in `api/index.ts` no longer imports `dotenv/config` in production. `vercel.json` preserves the `/api/:path*` rewrite and rewrites `/birthday/:slug*` to the SPA entrypoint so direct public birthday links resolve correctly.

## Manus Built-in LLM

Real generation is enabled server-side with `BIRTHDAY_AI_PROVIDER=real` and model `gpt-5-nano`. No API key was added to the frontend. The existing deterministic fallback remains active if a provider request fails or the returned blueprint does not pass validation.

The structured JSON schema in `server/birthdayAi.ts` was tightened to match the shared Zod contract, including scene type, importance, interaction, pacing, non-empty visual concepts, and non-empty beat arrays. This prevents valid model responses from being rejected by mismatched enum or minimum-value rules.

## Validation

The lightweight Manus provider health test passed. A real structured birthday blueprint generation test passed with `provider: "real"` and `fallback: false`. The full suite passed with 3 test files and 6 tests. The production build also passed with `pnpm build`.

The creator flow now uses the Manus LLM for personalized blueprint generation when the environment is configured, while preserving strict cost limits and validation. The public recipient experience continues to render persisted blueprints at `/birthday/:slug`.
