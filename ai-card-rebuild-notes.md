# AI Card Composer Rebuild

## Root cause
The previous upgrade changed scene metadata and CSS classes, but the recipient experience still had a fixed entry scene, a fixed final celebration scene, and one generic DynamicBirthdayScene shell. The model authored copy inside predefined slots rather than authoring the card structure itself.

## Correction
The blueprint now carries model-authored `card_layout`, per-scene `render_mode`, and concise `asset_direction`. The renderer uses distinct DOM structures for poster, polaroid, journal, dashboard, map, and letter modes. It also maps each scene to concrete background, texture, lighting, typography, and motif tokens, which visibly change the rendered card. Public reader and private preview share the same renderer. Fallback experiences use the same dynamic pipeline.

The built-in structured model rejected a nested asset-token object with empty output, so the stable implementation keeps asset direction as model-authored text and derives a strict renderer-token preset from the selected render mode. This preserves reliable real generation while making the art direction visible.

## Validation
Real Manus provider test: passed, including validated blueprint generation after schema simplification.
Deterministic renderer tests: 5 passed.
Production build: passed.

## Remaining validation
A browser-level comparison of two completed generated experiences is still required before describing the visual result as fully resolved. The root landing screenshot alone is not sufficient evidence because it shows the marketing/demo shell, not two generated recipient cards.
