import { Suspense, lazy, useEffect, useState } from "react";

const Lottie = lazy(() => import("lottie-react").then((m) => ({ default: m.LottieSvg })));

type Props = {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
};

/**
 * Client-only Lottie renderer. The engine touches `document` on import,
 * so the module is loaded lazily after hydration.
 */
export function LottieBox({ animationData, loop = true, autoplay = true, className = "" }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={className} aria-hidden />;

  return (
    <Suspense fallback={<div className={className} aria-hidden />}>
      <Lottie src={animationData as object} loop={loop} autoplay={autoplay} className={className} />
    </Suspense>
  );
}
