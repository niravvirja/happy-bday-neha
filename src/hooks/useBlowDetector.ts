import { useCallback, useEffect, useRef, useState } from "react";

import {
  AdaptiveBlowClassifier,
  frequencyBandPower,
  spectralFlatness,
} from "@/lib/blow-detection";

type Status = "idle" | "listening" | "denied" | "unsupported";

/**
 * Listens to the microphone and fires `onBlow` when a sustained
 * adaptive broadband burst (a breath into the mic) is detected.
 */
export function useBlowDetector(onBlow: () => void) {
  const [status, setStatus] = useState<Status>("idle");
  const [level, setLevel] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);
  const firedRef = useRef(false);
  const callbackRef = useRef(onBlow);
  callbackRef.current = onBlow;

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    if (cleanupRef.current) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx({ latencyHint: "interactive" });
      if (ctx.state !== "running") await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.25;
      analyser.minDecibels = -100;
      analyser.maxDecibels = -20;
      source.connect(analyser);

      const frequencyBins = new Float32Array(analyser.frequencyBinCount);
      const timeSamples = new Float32Array(analyser.fftSize);
      const classifier = new AdaptiveBlowClassifier();
      let raf = 0;
      firedRef.current = false;

      const tick = (now: number) => {
        analyser.getFloatTimeDomainData(timeSamples);
        analyser.getFloatFrequencyData(frequencyBins);

        let squareTotal = 0;
        for (const sample of timeSamples) squareTotal += sample * sample;

        const result = classifier.update(
          {
            rms: Math.sqrt(squareTotal / timeSamples.length),
            low: frequencyBandPower(frequencyBins, ctx.sampleRate, analyser.fftSize, 120, 1200),
            high: frequencyBandPower(frequencyBins, ctx.sampleRate, analyser.fftSize, 2200, 8000),
            flatness: spectralFlatness(frequencyBins, ctx.sampleRate, analyser.fftSize, 250, 8000),
          },
          now,
        );
        setLevel(result.level);

        if (result.detected && !firedRef.current) {
          firedRef.current = true;
          callbackRef.current();
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const resumeAudio = () => {
        if (document.visibilityState === "visible" && ctx.state === "suspended") void ctx.resume();
      };
      document.addEventListener("visibilitychange", resumeAudio);

      setStatus("listening");

      cleanupRef.current = () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("visibilitychange", resumeAudio);
        source.disconnect();
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
        setStatus("idle");
        setLevel(0);
      };
    } catch {
      setStatus("denied");
    }
  }, []);

  return { start, stop, status, level };
}
