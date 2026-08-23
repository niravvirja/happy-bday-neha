# Envelope Redesign — Neha's Birthday Page

Rebuild the whole page around one idea: a folded paper envelope that sits alone on screen, gets tapped, unfolds with a tactile origami motion, and lifts a letter out that fills the screen perfectly on both mobile and desktop. Same colors (cream / rose / wine / gold), same fonts (Sora + Space Grotesk) — only the UI changes.

## The flow

```text
1  SEAL      envelope resting, wax seal pulsing, "tap to open"
2  UNFOLD    top flap folds back, side flaps ease open, seal cracks
3  LIFT      letter slides up out of the envelope, scales into place
4  LETTER    full birthday wishes, scrollable, close button folds it back
```

### 1. Loading / seal screen
- Centred envelope on the grainy cream background, soft glow behind it, a drop shadow that breathes.
- Real folded look: top flap, left/right flaps, bottom flap as clip-path panels with subtle paper texture and edge highlights so folds read as creases, not flat triangles.
- Wax seal in wine/gold at the fold point with the initial "N", gently pulsing. Small caption underneath: "a letter for you — tap to open".
- Envelope is sized in `clamp()` so it feels right at 360px wide and at 1440px.

### 2. Opening animation
- Tap (or Enter/Space) triggers a sequenced CSS animation: seal cracks and fades, top flap rotates back on `transformOrigin: top` in 3D, side flaps settle, then the letter rises and expands.
- Shadow stretches as the letter lifts, so it reads as physical depth.
- Respects `prefers-reduced-motion`: instant cross-fade instead of the fold.

### 3. The letter
- A paper card with a deckled edge, faint ruled texture and a gold hairline border. Fits the viewport exactly: full-bleed sheet with safe-area padding on mobile, a centred A5-proportioned sheet on desktop.
- Content, in order:
  - small "for Neha" eyebrow
  - "Happy Birthday" in the display face, plus her name
  - the handwritten-feeling wish paragraph (kept and expanded from the current copy)
  - a signed-off line at the bottom
  - a close control that folds the letter back into the envelope
- Long copy scrolls inside the sheet, never the page — no layout jumps on small screens.

### 4. Celebration
- Existing Lottie confetti + poppers fire once the letter is fully out, layered behind/above the sheet at low opacity so text stays readable.
- The cake + blow-the-candles ritual moves inside the letter as an optional second beat: a small cake at the foot of the letter with "make a wish — blow" that uses the existing mic detector, then swaps the letter's headline to "Wish Granted". Nothing is lost, it just lives inside the envelope story now.

## Responsiveness
- Every stage sized with `clamp()` / `dvh` and safe-area insets; envelope and letter share one aspect ratio so the unfold lands perfectly at any width.
- Verified at 375x812 and 1440x900 with screenshots before I call it done.

## Technical notes
- New components under `src/components/envelope/`: `Envelope.tsx` (flaps + seal + shadow), `Letter.tsx` (sheet + wishes), and a small `useEnvelopeStage` state machine (`sealed | opening | open | closing`).
- `src/routes/index.tsx` becomes the orchestrator: stage state, Lottie celebration layer, reuse of `useBlowDetector` and `LottieBox`.
- Animation with CSS keyframes + `transform-style: preserve-3d` (no GSAP/jQuery dependency added); keyframes and envelope paper/fold tokens added to `src/styles.css` alongside the existing tokens.
- No color or font values invented — everything maps to existing tokens (`--wine`, `--rose`, `--rose-deep`, `--gold`, `--cream`, `font-display`).
- Route `head()` metadata updated to match the envelope framing.
