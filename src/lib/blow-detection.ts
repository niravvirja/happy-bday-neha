export type AudioFeatures = {
  rms: number;
  low: number;
  high: number;
  flatness: number;
};

type AdaptiveValue = {
  mean: number;
  deviation: number;
};

export type BlowDetectionResult = {
  detected: boolean;
  level: number;
};

const MIN_VALUE = 1e-12;

function follow(value: AdaptiveValue, sample: number, elapsedMs: number) {
  const timeConstant = sample < value.mean ? 650 : 2600;
  const weight = 1 - Math.exp(-elapsedMs / timeConstant);
  const difference = sample - value.mean;
  value.mean += difference * weight;
  value.deviation += (Math.abs(difference) - value.deviation) * weight;
}

/**
 * Classifies a breath by how the signal changes relative to the microphone's
 * own recent ambient floor. No absolute microphone-volume threshold is used.
 */
export class AdaptiveBlowClassifier {
  private rms: AdaptiveValue | null = null;
  private low: AdaptiveValue | null = null;
  private high: AdaptiveValue | null = null;
  private previousTime: number | null = null;
  private candidateSince: number | null = null;
  private lastCandidateAt: number | null = null;

  update(features: AudioFeatures, now: number): BlowDetectionResult {
    if (!this.rms || !this.low || !this.high || this.previousTime === null) {
      this.rms = { mean: Math.max(features.rms, MIN_VALUE), deviation: Math.max(features.rms * 0.1, MIN_VALUE) };
      this.low = { mean: Math.max(features.low, MIN_VALUE), deviation: Math.max(features.low * 0.1, MIN_VALUE) };
      this.high = { mean: Math.max(features.high, MIN_VALUE), deviation: Math.max(features.high * 0.1, MIN_VALUE) };
      this.previousTime = now;
      return { detected: false, level: 0 };
    }

    const elapsedMs = Math.min(250, Math.max(1, now - this.previousTime));
    this.previousTime = now;

    const rmsRatio = features.rms / Math.max(this.rms.mean, MIN_VALUE);
    const lowRatio = features.low / Math.max(this.low.mean, MIN_VALUE);
    const highRatio = features.high / Math.max(this.high.mean, MIN_VALUE);
    const rmsRise = (features.rms - this.rms.mean) / Math.max(this.rms.deviation, this.rms.mean * 0.08, MIN_VALUE);
    const highRise = (features.high - this.high.mean) / Math.max(this.high.deviation, this.high.mean * 0.08, MIN_VALUE);

    // Blowing is noisy and broadband: unlike voiced speech, its upper-band
    // energy rises with the total signal and its spectrum is comparatively flat.
    const energetic = rmsRatio > 1.55 && rmsRise > 2.4;
    const broadband = highRatio > 1.7 && highRise > 2.2 && highRatio >= lowRatio * 0.72;
    const noiseLike = features.flatness > 0.12;
    const candidate = energetic && broadband && noiseLike;

    const confidence = Math.min(
      1,
      Math.max(0, Math.min(rmsRatio / 2.4, highRatio / 2.8, features.flatness / 0.3)),
    );

    if (candidate) {
      this.candidateSince ??= now;
      this.lastCandidateAt = now;
    } else if (this.lastCandidateAt === null || now - this.lastCandidateAt > 90) {
      this.candidateSince = null;
      this.lastCandidateAt = null;
    }

    const detected = this.candidateSince !== null && now - this.candidateSince >= 240;

    // Do not let a possible breath teach the ambient model that the breath is
    // normal. It resumes adapting as soon as the transient has passed.
    if (!candidate) {
      follow(this.rms, Math.max(features.rms, MIN_VALUE), elapsedMs);
      follow(this.low, Math.max(features.low, MIN_VALUE), elapsedMs);
      follow(this.high, Math.max(features.high, MIN_VALUE), elapsedMs);
    }

    return { detected, level: candidate ? confidence : Math.min(0.35, confidence * 0.35) };
  }
}

export function frequencyBandPower(
  bins: Float32Array,
  sampleRate: number,
  fftSize: number,
  fromHz: number,
  toHz: number,
) {
  const binHz = sampleRate / fftSize;
  const start = Math.max(1, Math.ceil(fromHz / binHz));
  const end = Math.min(bins.length, Math.floor(toHz / binHz) + 1);
  let power = 0;

  for (let index = start; index < end; index += 1) {
    const decibels = bins[index];
    if (decibels !== undefined && Number.isFinite(decibels)) power += 10 ** (decibels / 10);
  }

  return power / Math.max(1, end - start);
}

export function spectralFlatness(
  bins: Float32Array,
  sampleRate: number,
  fftSize: number,
  fromHz: number,
  toHz: number,
) {
  const binHz = sampleRate / fftSize;
  const start = Math.max(1, Math.ceil(fromHz / binHz));
  const end = Math.min(bins.length, Math.floor(toHz / binHz) + 1);
  let logarithmicPower = 0;
  let arithmeticPower = 0;
  let count = 0;

  for (let index = start; index < end; index += 1) {
    const decibels = bins[index];
    if (decibels === undefined || !Number.isFinite(decibels)) continue;
    const power = Math.max(10 ** (decibels / 10), MIN_VALUE);
    logarithmicPower += Math.log(power);
    arithmeticPower += power;
    count += 1;
  }

  if (count === 0 || arithmeticPower === 0) return 0;
  return Math.exp(logarithmicPower / count) / (arithmeticPower / count);
}