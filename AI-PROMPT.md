# Reusable prompt (paste into any AI app builder)

Build a **single-page, mobile-first birthday website** for a person named **Neha**. No routing, no scrolling — the whole experience lives in one `100dvh` viewport with hidden scrollbars.

## Look & feel
- Premium editorial minimalism. Warm cream paper background with a soft radial glow and subtle paper grain.
- Palette: cream `#FBF4EE` background, deep wine `#6E2639` for headlines, dusty rose `#C46A7F` accents, muted warm grey text.
- Typography from Google Fonts: **Sora** (700/800, uppercase, tight leading) for display headings, **Space Grotesk** for body/labels. Wide letter-spacing on small uppercase labels. No calligraphy, no Inter/Poppins, no purple-on-white AI gradients.
- All colors as semantic CSS design tokens; no hardcoded color utility classes in components.

## Layout (one screen, three rows: header / cake stage / controls)
1. Header: tiny uppercase kicker "today is yours", then `HAPPY BIRTHDAY` as one heading that wraps naturally (never a hardcoded `<br>`), then the name **NEHA** in the display font, clearly readable (about half the heading size), rose colored, letter-spaced.
2. Cake stage: a large **Lottie** birthday-cake animation with a gentle floating loop and a blurred radial halo behind it. It must scale to fit the available row on both mobile and desktop — never overflow or push the controls off-screen.
3. Controls: one line of copy ("Close your eyes, make a wish — then blow."), a primary pill button "Blow the candles", and a subtle text link "or tap to blow".

## Interaction
- "Blow the candles" requests microphone access and uses the Web Audio API (`AnalyserNode`, low-frequency energy over a threshold, sustained for a few frames) to detect a real breath. Show a live level meter while listening.
- Fallback: if the mic is denied/unsupported, the text link triggers the same celebration.
- On blow: the cake **unmounts entirely** and the full page becomes a celebration takeover — big Lottie confetti across the viewport, two party-popper bursts in opposite corners, a scale-in "WISH GRANTED" lockup, a warm personal birthday message, and a "Light them again" button that resets the state.

## Quality bar
- Perfect on a 390×844 phone AND a 1440×900 desktop: nothing clipped, nothing off-screen, no scrollbar.
- Respect safe-area insets, use `dvh`, keep animations smooth and tasteful (fade-in, scale-in, float loops).
- SEO head tags: unique title, description, og/twitter meta.
