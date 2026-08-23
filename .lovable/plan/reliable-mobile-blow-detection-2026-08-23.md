# Reliable mobile blow detection

## Goal
Make a real breath reliably extinguish the candles on mobile without returning to the false-positive behavior, and remove the fixed 1.5-second calibration and device-specific volume cutoffs.

## Implementation
- Rework `useBlowDetector` around a continuously adapting ambient-noise model instead of a one-time 90-frame calibration.
- Explicitly start/resume the Web Audio context after microphone permission and resume it again when the page returns from the background, addressing suspended audio input on mobile Safari and Chrome.
- Analyze both time-domain energy and the shape of the frequency spectrum:
  - compare current RMS energy with its own rolling ambient baseline;
  - require broadband/high-frequency breath energy rather than loudness alone;
  - use normalized ratios so quiet and loud phone microphones are treated consistently.
- Track ambient level and variance continuously only during non-candidate audio, preventing an actual blow from raising its own baseline.
- Replace animation-frame counts with elapsed timestamps so detection behaves consistently at 30 Hz, 60 Hz, low-power mode, and throttled mobile rendering.
- Use a larger FFT and floating-point analyzer data for more stable frequency measurements on common 44.1/48 kHz mobile inputs.
- Keep microphone constraints as optional hints only; the detector will remain functional when a browser ignores noise-suppression or gain-control preferences.
- Preserve the existing manual candle button and denied/unsupported states.

## Validation
- Add focused tests around the extracted signal-classification logic using synthetic ambient noise, speech-like narrowband input, isolated spikes, and sustained broadband breath input.
- Run the relevant tests and the project build check. Per request, no screenshot workflow will be used.

## Technical notes
- There is no browser API that labels a sound as a “blow”; reliable detection still requires classification parameters. Those parameters will describe relative signal shape and short event continuity—not hardcoded microphone volume or a mandatory calibration delay.
- The implementation follows Web Audio guidance for resuming suspended contexts and the browser constraint model, where requested microphone processing settings are not guaranteed: [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), [MDN MediaTrackSettings](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings).
