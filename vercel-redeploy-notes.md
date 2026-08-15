# Vercel Redeploy Notes

Source: https://vercel.com/mehboobulhasan86s-projects

The Vercel project is `birthday-experience`, linked to `mehboobulhasan86/birthday-experience`, with production domain `https://birthday-experience-alpha.vercel.app`.

## Deployment Fixes

The Vercel serverless entrypoint was corrected in `api/index.ts` to avoid importing `dotenv/config` in the production runtime. The Vercel configuration in `vercel.json` preserves the `/api/:path*` rewrite and now also rewrites `/birthday/:slug*` to the SPA entrypoint, preventing direct public birthday links from returning Vercel `404 NOT_FOUND` responses.

Relevant GitHub files are `vercel.json`, `api/index.ts`, and `server/_core/index.ts`. The routing fix was committed directly to the `main` branch through the authenticated GitHub session.

## Validation

The local post-fix production build completed successfully with `pnpm build`. The Vitest suite completed successfully with 2 test files and 4 tests passing. The live creator flow was exercised through brief creation, generation, six-scene recipient playback, final share screen, and public reader navigation.

After the routing fix redeployed, the public URL `https://birthday-experience-alpha.vercel.app/birthday/shani-x7k2` resolved to the Birthday Experience SPA instead of Vercel's 404 page, confirming the reader-route fallback is active.

## Remaining Limitation

The experience currently uses the project's mock-first AI fallback unless a real structured LLM provider is explicitly enabled and configured server-side. The production flow is therefore functional and cost-controlled, but generated copy is not yet backed by a live external LLM provider.
