# Birthday Page for Neha Jain

A single, fully responsive page — no extra routes, no generic AI-template look. Warm cream paper, dusty rose, deep wine ink, with an editorial serif + clean sans pairing loaded from Google Fonts.

## The flow (one page, three beats)

1. **Opening**
   Cream canvas with soft grain, a hand-drawn-feeling floral/confetti frame, and a large serif greeting: "Happy Birthday, Neha Jain". Letters rise in one by one; a small date/ribbon detail sits under it.

2. **The cake**
   An animated CSS/SVG birthday cake: layered tiers, drip icing, candles with flickering flames, rising sparkles, and a slow float. Fully vector so it stays crisp on any screen.

3. **The question**
   Centered card: *"So, are you ready to share your smile, stresses and secrets with me?"*
   Two buttons: **YES** and **NO**.
   - Each tap on NO makes YES grow one step (about 6 steps, capped at a comfortable max so it never overflows on mobile), while NO shrinks and its label softens through a cheeky sequence ("No", "Are you sure?", "Really?", "Think again", "Last chance", "Okay fine…").
   - After the cap is reached, NO morphs into a second YES — both buttons say YES, so there's only one way forward.
   - Motion is spring-based, not a linear scale; NO nudges slightly away on hover (desktop only, so mobile taps still work).

4. **YES → celebration takeover**
   Full-screen confetti burst, candles blow out with a puff of smoke, the page warms up, and a message card scales in with a short birthday note plus a replay/"blow candles again" touch.

## Craft details

- Responsive from 320px up: fluid type via `clamp()`, cake scales with the viewport, buttons stack on narrow screens.
- Respects `prefers-reduced-motion` — animations become simple fades.
- Accessible: real buttons, focus rings, `aria-live` on the changing NO label.
- Unique page title, description, and og/twitter tags on the route.

## Technical notes

- Rewrite `src/routes/index.tsx` as the only page; small local components for `Cake`, `Confetti`, and `QuestionCard`.
- Fonts: `<link>` tags in `src/routes/__root.tsx` (Fraunces / Playfair-style display serif + a clean grotesk for body), registered as `--font-*` tokens in `src/styles.css`.
- Palette (#FBF6EF cream, #E7B7B0 rose, #8C4A52 wine, #2E2320 ink) converted to oklch semantic tokens in `src/styles.css` — no hardcoded color classes in components.
- Animation via `motion` (Motion for React) for spring button growth and the celebration sequence; keyframes for flame flicker and float. Canvas-free confetti using lightweight animated DOM particles.
- No backend, no data persistence.
