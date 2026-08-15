# Birthday Experience Upgrade and GitHub Handoff

- [x] Preserve the Paper Lantern Cinema visual direction and inspect the existing scene architecture.
- [x] Upgrade the static project to a full-stack AI-ready application with server-side generation and persistence.
- [x] Add the strict Experience Blueprint schema, validator, mock-first provider, and gated real LLM path.
- [x] Add sanitization, human-readable slugs, global/per-experience limits, authenticated generation, publishing, and public reader routes.
- [x] Add optional validated S3-backed photo uploads and blueprint-driven recipient scenes.
- [x] Validate TypeScript, Vitest, production build, desktop/mobile screenshots, and protected API boundaries.
- [x] Reconnect GitHub CLI with repository and workflow write scopes.
- [x] Push and verify the upgraded project on GitHub.

GitHub repository: https://github.com/mehboobulhasan86/birthday-experience
GitHub main branch: c8e8bd7e150dc4befeab395de47d44a8738c3836

## Vercel Redeploy

- [x] Open the logged-in Vercel dashboard and identify the existing project or import flow.
- [x] Configure Vercel to use the updated GitHub main branch.
- [x] Confirm and execute the Vercel redeploy.
- [x] Verify the deployment and report the live URL.

## Vercel Build Fix

- [x] Add a Vercel-compatible frontend build configuration without disrupting Manus hosting.
- [x] Validate the corrected build locally and push the deployment fix to GitHub.
- [x] Redeploy from the updated main branch and verify the live Vercel response.
- [x] Report the deployment fix, live status, and any remaining backend limitation.

## Browser Deployment-Fix Upload

- [x] Prepare the five deployment-fix files for browser upload.
- [x] Upload and commit the Vercel deployment fix on GitHub.
- [x] Redeploy from main and verify the live Vercel response.
- [x] Report the corrected deployment status and any limitations.
- [x] Fix Vercel SPA fallback so public /birthday/:slug reader links resolve instead of returning 404.
- [x] Run and record a local post-fix production build and Vitest validation.
- [x] Document the final deployment status, public URL, and remaining mock-AI limitation.
- [x] Connect the Manus built-in LLM securely on the server and verify real personalized generation.
- [x] Align the structured LLM schema with the strict Experience Blueprint validator.
- [x] Validate the provider health check, real blueprint generation, full test suite, and production build.
- [x] Replace the rigid recipient template with AI-driven scene composition, personalization, interactions, and visual variation based on the full creator brief.
- [x] Wire the dynamic AI scene renderer into both the private preview and public birthday reader.
- [x] Strengthen the real-provider prompt and strict schema for distinct scene types and visual concepts.
- [x] Validate multiple personalized scene outputs with the real provider, full Vitest suite, and production build.
- [x] Drive full-experience visual treatment from blueprint visual_style, arc_type, music_mood, and pacing.
- [x] Add a deterministic contract test proving materially different briefs map to different scene families and pacing classes.
- [x] Ensure fallback/demo blueprints use the same dynamic renderer instead of reverting to rigid scenes.
- [x] Investigate and document why the user-visible card still feels like one rigid template.
- [x] Redesign the blueprint to author variable card layouts, content blocks, and asset directions.
- [x] Implement materially different rendered card structures from different briefs.
- [x] Add explicit AI-authored asset-direction text to every scene blueprint and map it to structured visual tokens.
- [x] Wire asset directions into visible visual treatments through concrete background, texture, lighting, typography, and motif tokens.
- [ ] Validate two complete experiences visually and functionally before claiming the issue is fixed.
- [ ] Create and compare five live cards for contrasting profiles in the cloud browser.
- [x] Preserve the generated blueprint scenes and AI layout metadata in the private preview after the server response.
- [x] Push the stale-blueprint repair and current AI card-composer changes to GitHub main and trigger the Vercel redeploy.
- [ ] Re-run the five-profile live comparison against the updated production deployment.
- [ ] Verify the synced preview version and create five contrasting live cards for comparison.
- [x] Fix the Vite HMR websocket mismatch between the proxied preview URL and the local dev server.
- [x] Verify the browser console no longer reports the websocket failure after the middleware bridge fix.
- [x] Verify client changes are accepted by the managed restart-on-change preview workflow; true proxied Vite hot-update is intentionally not used because the preview does not expose the internal websocket.
- [x] Fix the real-provider blueprint validation failure caused by overlong personalization anchors and re-run the full test suite/build.
- [x] Reduce structured blueprint output complexity and switch the unreliable nano route to the built-in gpt-5-mini workhorse.
- [x] Add explicit empty-content and finish_reason length guards to structured blueprint generation.
- [x] Replace the unbounded second LLM call with an explicit bounded safe-fallback path for malformed or incomplete structured output.
- [x] Confirm the new Vercel deployment is ready before resuming the five-profile production comparison; deployment 2966d8b is Ready and serves the Birthday Experience homepage at https://birthday-experience-n8f4kwglo-mehboobulhasan86s-projects.vercel.app/.
- [x] Investigate why contrasting Mimi and Raf briefs produced the same cricket scoreboard sequence; strengthen real-provider acceptance with multi-term grounding and rejection of unrelated Shani/Lahore/cricket demo entities. Eight tests and production build pass.
- [x] Publish the stronger grounding guard to GitHub/Vercel and rerun Mimi versus Raf production validation; the live rerun still exposed a second hardcoded server fallback.
- [x] Prevent the remaining stale Shani/cricket demo from leaking through fresh-card entry points by resetting both landing and SharePage creation flows to a blank brief; final production redeploy remains pending.
- [x] Add grounded-output validation and brief-aware fallback scenes; the deterministic suite passes, but the latest real-provider test intermittently timed out at 90 seconds and needs a reliability follow-up.
- [x] Resolve the intermittent real-provider timeout without weakening grounded fallback behavior, then rerun tests and build; bounded 45-second fallback deadline, 8 tests, and production build pass.
- [x] Reset every new-card entry point, including SharePage, to a blank brief so demo Shani/cricket/Lahore data cannot leak into a fresh profile.
- [ ] Publish the final creator-reset and bounded-provider changes to GitHub/Vercel and rerun Mimi versus Raf production validation.
- [x] Clear the Step 02 default About-text demo string and replace its visible placeholder with neutral guidance; 8 tests and production build pass, with no remaining merge markers.
