# Birthday Experience — Design Direction

## Three stylistic approaches

### Theme Name: Paper Lantern Cinema
**Very Brief Intro:** A warm editorial system inspired by handwritten notes, paper ephemera, and intimate film titles. It turns the creator flow into a calm invitation and the recipient flow into a tactile keepsake.

**Probability:** 0.07

### Theme Name: Midnight Arcade
**Very Brief Intro:** A kinetic dark-mode world with playful game HUD references, electric color, and celebratory motion. It makes inside jokes feel like unlockable scenes rather than static copy.

**Probability:** 0.04

### Theme Name: Soft Signal
**Very Brief Intro:** A modern, airy visual language built from off-white space, ink typography, and one saturated signal color. The experience feels quietly premium, with surprise arriving through pacing rather than visual noise.

**Probability:** 0.08

## Chosen direction: Paper Lantern Cinema

### Design Movement
Contemporary editorial design with cinematic title cards, tactile paper textures, and the intimacy of a personal letter.

### Core Principles
1. **Specificity over decoration:** every visual flourish should support a personal detail, not generic birthday language.
2. **Quiet setup, earned spectacle:** creator screens are serene and effortless; recipient screens build from curiosity into a controlled celebration.
3. **Editorial hierarchy:** oversized display type, small captions, and intentional whitespace create a sense of authorship.
4. **Tactile warmth:** warm paper tones, ink-like contrast, copper accents, and soft grain make the product feel made by hand.

### Color Philosophy
The creator side uses warm bone and parchment as a low-friction canvas, with deep ink for trust and legibility. The signature brand color is **copper orange**, used like a match strike: scarce, vivid, and reserved for moments of action or reveal. The recipient side shifts into charcoal plum and ember, preserving warmth while creating enough contrast for cinematic immersion.

### Layout Paradigm
Use an asymmetric split-stage composition: a narrow editorial rail for context and a larger narrative canvas for the main interaction. Avoid a centered SaaS panel. On the recipient side, use full-bleed scene stages with anchored captions and floating objects that create depth.

### Signature Elements
- A small copper match-strike mark used as the brand symbol and progress cue.
- Film-caption metadata such as `SCENE 02 / INSIDE JOKE` and `PRIVATE CUT`.
- Paper grain, route lines, scoreboards, and handwritten-style annotation as scene-specific texture rather than decorative chrome.

### Interaction Philosophy
Interactions should feel like turning a page or opening a keepsake: deliberate, tactile, and rewarding. The system never asks the creator to make design decisions it can make itself. On the recipient side, each tap should reveal a little more context and make the recipient feel recognized.

### Animation
Use short, directional motion for creator controls: 180–260ms ease-out transitions, subtle lift on focus, and staggered entrances. Recipient scenes use distinct motion languages: blur-to-clear for a nickname reveal, route-drawing and pulsing pins for the inside joke, depth zoom for emotional pivots, and restrained particle bursts only at celebration. Respect `prefers-reduced-motion` by replacing scene motion with opacity and instant state changes.

### Typography System
Use **DM Serif Display** for cinematic headlines and reveals, paired with **Manrope** for interface copy, captions, and controls. Display headlines should be large and sparse; interface copy should stay compact with generous line-height. Metadata uses uppercase Manrope with tracking of 0.16em.

### Brand Essence
A personal birthday experience maker for people who want to make someone feel unmistakably known, without becoming a designer.

**Personality:** observant, warm, mischievous.

### Brand Voice
Headlines sound like a confident friend with good timing. CTAs are direct and inviting; microcopy is lightly conspiratorial without becoming childish.

- “Don’t just say happy birthday. Make it land.”
- “Give us the good stuff. We’ll make the reveal.”

### Wordmark & Logo
The mark is a minimal copper match-strike: a short diagonal flame over a small offset line, suggesting a spark, a private signal, and the instant before a story begins. The wordmark is set in DM Serif Display with a small square period, never as default body text.

### Signature Brand Color
**Copper Match — `#D9683B`**

### MVP Product Scope
The MVP will include:

- A landing page that explains the product and includes a living phone-shaped demo.
- A three-step creator flow with name, nickname, relationship, natural-language details, optional inline additions, personal message, and tone.
- A premium generation sequence that uses the recipient’s name and editorial copy rather than technical loading language.
- A deterministic mock blueprint provider that transforms the Ahmed/Shani example into a structured story with nickname, cricket, Lahore GPS, message, and celebration scenes.
- A full-screen recipient experience with tap-to-open envelope, nickname reveal, cricket scoreboard, interactive Lahore route reveal, emotional message, and celebration.
- A share-ready completion state with copy link, WhatsApp share, share, and preview actions. In this static MVP these actions are local/demo-safe and do not persist to a backend.

### Product Architecture Notes
The frontend models an `AIProvider` interface with a default `MockProvider`; the mock returns the same structured blueprint shape intended for a future secure server-side `/api/generate` provider. Rendering and animation remain deterministic in the client. No fabricated memories are introduced: scene copy is derived only from supplied details or clearly marked creative framing.

## Style Decisions

- The wordmark must feel authored: use the copper match-strike mark with a DM Serif Display wordmark treatment, never a plain sans-serif product label.
- Paper texture is visibly present but quiet on creator-facing surfaces: warm parchment, subtle grain, and editorial rules are the base material language.
- Every major landing section includes at least one specific private-cut detail — nickname, scene label, inside joke, route, scoreboard, or message fragment — so the brand promise is shown rather than merely described.
- Copper remains scarce and ceremonial: it marks action, reveal, and emotional punctuation rather than becoming a general UI color.
