import { describe, expect, test } from "bun:test";

import { AdaptiveBlowClassifier, type AudioFeatures } from "../src/lib/blow-detection";

const ambient: AudioFeatures = { rms: 0.012, low: 0.00002, high: 0.000004, flatness: 0.08 };

function feed(classifier: AdaptiveBlowClassifier, frames: AudioFeatures[], interval = 40) {
  return frames.map((frame, index) => classifier.update(frame, index * interval));
}

describe("AdaptiveBlowClassifier", () => {
  test("ignores ambient noise and an isolated loud spike", () => {
    const classifier = new AdaptiveBlowClassifier();
    const frames = [
      ...Array<AudioFeatures>(20).fill(ambient),
      { rms: 0.07, low: 0.0002, high: 0.00008, flatness: 0.35 },
      ...Array<AudioFeatures>(10).fill(ambient),
    ];

    expect(feed(classifier, frames).some((result) => result.detected)).toBe(false);
  });

  test("ignores loud narrowband speech-like audio", () => {
    const classifier = new AdaptiveBlowClassifier();
    const speech = { rms: 0.07, low: 0.00035, high: 0.00001, flatness: 0.04 };
    const frames = [...Array<AudioFeatures>(20).fill(ambient), ...Array<AudioFeatures>(12).fill(speech)];

    expect(feed(classifier, frames).some((result) => result.detected)).toBe(false);
  });

  test("detects a sustained broadband breath at quiet and loud gain levels", () => {
    for (const gain of [0.25, 4]) {
      const classifier = new AdaptiveBlowClassifier();
      const scaledAmbient = {
        ...ambient,
        rms: ambient.rms * gain,
        low: ambient.low * gain * gain,
        high: ambient.high * gain * gain,
      };
      const breath = {
        rms: scaledAmbient.rms * 4,
        low: scaledAmbient.low * 6,
        high: scaledAmbient.high * 9,
        flatness: 0.42,
      };
      const frames = [
        ...Array<AudioFeatures>(20).fill(scaledAmbient),
        ...Array<AudioFeatures>(10).fill(breath),
      ];

      expect(feed(classifier, frames).some((result) => result.detected)).toBe(true);
    }
  });
});