# Mic-only blow + smooth letter animation

## 1. Blow the candles by mic only

Remove the "Blow the candles" tap fallback button on the cake step. After "I made my wish", the only path is the live mic: the level bar and "now blow, neha" stay, and the candles only go out when the detector fires.

- If the mic is blocked or unsupported, show a short line explaining mic access is needed to blow the candles (with a retry), instead of silently dead-ending.

## 2. Rebuild the letter animation (no jitter)

The current open sequence stacks several things that fight each other: a 3D `rotateY(180deg)` flip, non-uniform `scaleX`/`scaleY` on a large sheet, and z-index swaps mid-flight via `steps(1)` keyframes. That combination is what reads as jittery — the flip re-rasterizes text-bearing layers and the z-index switch lands on a different frame than the motion.

Replace it with a simpler, physical motion:

```text
seal cracks  ->  top flap folds back  ->  sheet slides straight up out of the pocket  ->  sheet scales up to full size
```

- No `rotateY` flip and no separate blank back-face; the sheet keeps one face throughout.
- Motion uses uniform `translateY` + uniform `scale` only, on a single compositor-promoted layer.
- Stacking is decided once at the start of the lift (letter above the pocket from the first frame) instead of animated z-index keyframes, so no frame-boundary pops.
- Letter content fades in only after the sheet has settled, so no text is scaled during motion.
- Close plays the same motion reversed.
- `prefers-reduced-motion`: plain cross-fade.

Verified with screenshots at 375x812 and 1440x900.

## Technical notes
- `src/styles.css`: drop `letter-layer-lift` / `letter-layer-drop` / `flap-layer-*` step keyframes and the `rotateY` variants of `letter-from-pocket` / `letter-into-pocket`; rewrite as `translate3d` + `scale` keyframes with `will-change: transform` and `backface-visibility` no longer needed.
- `src/components/envelope/Envelope.tsx`: remove the `letter-face-back` element; static z-index rules per stage.
- `src/routes/index.tsx`: remove the fallback blow button and its handler; keep `useBlowDetector` as the only success trigger; add the mic-unavailable message.
