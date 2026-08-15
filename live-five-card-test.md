# Live five-card comparison

## Production preview
URL: https://birthday-experience-alpha.vercel.app/

## Card 1 — Rafi
Creator brief: Rafi, nickname Raf, best friend; cricket obsession; Lahore chai memory; competitive personality; playful roast tone.

Observed after generation: the live production flow entered a recipient experience labeled `A PRIVATE CUT FOR RAF`. Scene 01 displayed `SCENE 01 / THE NAME`, the authored nickname `RAF`, and a personalized heading. This confirms the current production deployment is no longer showing the previous Shani demo blueprint for this card. Further scenes still need inspection for cricket/Lahore details and structural variation.

## Card 1 finding — stale scene persists
After advancing to Scene 02, production displayed the old fixed content: `SCENE 02 / PERFORMANCE REVIEW`, `SHANI XI`, `CONFIDENCE: MAX`, and `MATURITY: ERROR`. The generated Rafi intro is personalized, but later scenes are still stale demo content. This proves the production deployment is only partially updated or the generated scene sequence is still not being persisted/served for later scenes.

## Deployment sync
GitHub main now contains commit `e710618` (`Merge GitHub deployment fixes with AI scene composer`). Vercel automatically created production deployment `birthday-experience-99c2bqd06-mehboobulhasan86s-projects.vercel.app`; it was still Building at the time of inspection, while the prior `2fd5a6b` deployment remained Ready.

## Corrected Vercel deployment validation — Raf

Deployment: `https://birthday-experience-n8f4kwglo-mehboobulhasan86s-projects.vercel.app/` (GitHub/Vercel commit `2966d8b`). The deployment now serves the actual Birthday Experience homepage and generated a personalized card for Raf/Rafi.

The intro shows `A PRIVATE CUT FOR RAFI`, confirming the recipient data reached generation. Opening the first authored card scene shows `AI CARD / 01 / MYSTERY LETTER / SLOW BUILD`, render mode `sealed_letter`, and visual direction `Warm cream paper, a small copper seal, low lantern glow, no photography.` This is materially different from the stale `SHANI XI / PERFORMANCE REVIEW` scene seen before the redeploy and confirms the corrected production renderer is receiving AI-authored layout metadata.

Raf sequence continued successfully: Scene 02 is an AI-authored `NICKNAME POSTER / SLOW BUILD` with `identity_reveal`, dark-plum oversized typography, and a handwritten accent. Scene 03 is a materially different `HOBBY DASHBOARD / QUICK` with `cricket_scoreboard`, night-stadium green, chalk lines, scoreboard numerals, and monospace labels. It contains no stale Shani demo content and directly reflects the cricket brief.

Raf Scene 04 is an `INSIDE JOKE MAP / SLOW BUILD` with `gps_recalculation`, indigo street-map grid, copper route line, two pins, and the authored headline `GPS INITIALIZING... DESTINATION: LAHORE`. Scene 05 is an `EMOTIONAL LETTER / QUIET` with `quiet_pivot`, soft blush paper, negative space, and pressed-flower silhouette. The single card now demonstrates five distinct visual families: sealed letter, nickname poster, cricket scoreboard, Lahore map, and emotional letter.

## Card 2 — Mimi / Mira partner profile

Creator brief: Mira, nickname Mimi, partner; rainy rooftop meeting, seasonal song, grocery adventures, warm quiet bond; heartfelt tone.

Observed on the corrected deployment: intro reads `A PRIVATE CUT FOR MIMI`, proving the nickname reaches generation. The first authored scene is again a `MYSTERY LETTER / SLOW BUILD` with `sealed_letter` and warm cream/copper visual tokens. This profile has not yet reached later scenes, so its full layout-family comparison remains pending.

### Card 2 decisive finding — residual rigidity

Mimi’s Scene 02 and Scene 03 match Raf’s structure exactly: `NICKNAME POSTER / SLOW BUILD` followed by `HOBBY DASHBOARD / QUICK`, with the same `cricket_scoreboard`, night-stadium green treatment, and `A completely objective report.` headline. This confirms the production renderer is now dynamic, but the production generator is still returning a fixed fallback or non-personalized blueprint for at least these contrasting profiles. The remaining three profiles are paused until the fallback/LLM input path is corrected; otherwise the comparison would only reproduce the same rigid sequence.
