# Letter interior: staged reveal

Redesign the inside of the letter as a two-step sequence instead of one crowded screen. Nothing appears instantly — the paper settles first, then content arrives.

## Step 0 — blank paper (~350ms)
The letter opens as an empty sheet. No text, no cake. Only the fold/close control.

## Step 1 — the wish
Content arrives with a staggered entrance (each element fades and rises ~80ms after the previous):
1. small line: "delivered today, for neha"
2. "happy birthday" in Tangerine (lowercase, rose)
3. "NEHA JAIN" in display uppercase
4. one short warm line of wish text
5. `Next` button (rounded, wine)

No cake on this step — the title gets the full sheet, centered and generous.

## Step 2 — the cake
Pressing Next cross-fades the wish out and the cake in (title slides up and out, cake scales in):
- large cake animation, noticeably bigger than today since it is alone on the sheet
- prompt: "make a wish, then blow gently toward your mic"
- `I made my wish` button, then the existing live mic-level bar, "now blow, neha", and the "or tap to blow" fallback
- on success: confetti + "Wish Granted" / "the candles are out" as today
- a small back arrow to return to step 1 (wish stays readable)

## Feel
Modern-web, not AI-template: CSS-only staged transitions driven by a step state, `cubic-bezier` easing, transform+opacity only (no layout thrash), `prefers-reduced-motion` respected. Same palette, fonts and paper texture — only structure and choreography change.

## Technical notes
- `src/routes/index.tsx`: add `phase` state (`blank` → `wish` → `cake`), drive the letter children off it; move the "delivered today" line inside the letter.
- Staggered entrance via a small `Reveal` wrapper using `animate-[fade-in_...]` with per-item `animation-delay`, plus keyframes in `src/styles.css` if a rise/scale variant is needed.
- Cake container grows to roughly `h-[clamp(210px,52vw,300px)]`.
- Mic logic in `src/hooks/useBlowDetector.ts` unchanged; envelope open/close animation untouched (the z-index flicker fix stays as is).
