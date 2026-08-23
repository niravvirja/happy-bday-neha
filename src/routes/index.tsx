import { MicrophoneIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import cakeAnimation from "@/assets/lottie/cake.json";
import confettiAnimation from "@/assets/lottie/confetti.json";
import popperAnimation from "@/assets/lottie/popper.json";
import { LottieBox } from "@/components/birthday/LottieBox";
import { Envelope, type EnvelopeStage } from "@/components/envelope/Envelope";
import { useBlowDetector } from "@/hooks/useBlowDetector";

const NAME = "Neha";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Sealed Letter for Neha — Happy Birthday" },
      {
        name: "description",
        content:
          "Tap the wax seal, unfold the envelope and read the birthday letter written for Neha — then blow out the candles to seal the wish.",
      },
      { property: "og:title", content: "A Sealed Letter for Neha — Happy Birthday" },
      {
        property: "og:description",
        content: "Unfold the envelope, read the letter, blow out the candles and make the wish.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnvelopePage,
});

type Phase = "blank" | "wish" | "cake";

function EnvelopePage() {
  const [stage, setStage] = useState<EnvelopeStage>("sealed");
  const [phase, setPhase] = useState<Phase>("blank");
  const [blown, setBlown] = useState(false);
  const [started, setStarted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { start, stop, status, level } = useBlowDetector(() => setBlown(true));

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (blown) stop();
  }, [blown, stop]);

  const open = useCallback(() => {
    setStage("opening");
    timers.current.push(setTimeout(() => setStage("open"), 1650));
    timers.current.push(setTimeout(() => setPhase("wish"), 2000));
  }, []);

  const close = useCallback(() => {
    stop();
    setStarted(false);
    setBlown(false);
    setPhase("blank");
    setStage("closing");
    timers.current.push(setTimeout(() => setStage("sealed"), 1500));
  }, [stop]);

  const begin = useCallback(() => {
    setStarted(true);
    void start();
  }, [start]);

  const micBroken = status === "denied" || status === "unsupported";

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden page-aurora paper-grain">
      {blown ? <Confetti /> : null}

      <div className="relative z-10 grid h-full w-full place-items-center px-6">
        <div className="flex flex-col items-center">
          <p className={`mb-10 w-full text-center text-[0.58rem] uppercase tracking-[0.5em] text-muted-foreground transition-opacity duration-300 ${stage === "sealed" ? "opacity-100" : "opacity-0"}`}>
            delivered today, for {NAME.toLowerCase()}
          </p>
          <Envelope
            stage={stage}
            initial={NAME.charAt(0)}
            caption="tap the seal to open"
            onOpen={open}
            onClose={close}
            name={NAME}
          >
            {phase === "blank" ? (
              <span aria-hidden className="block h-2 w-2" />
            ) : phase === "wish" ? (
              <div className="flex h-full w-full flex-col items-center text-center">
                <div className="flex flex-1 min-h-0 flex-col items-center gap-5 overflow-hidden px-1 pb-2">
                  <Reveal delay={0}>
                    <p className="text-[0.55rem] uppercase tracking-[0.5em] text-muted-foreground">
                      delivered today, for {NAME.toLowerCase()}
                    </p>
                  </Reveal>

                  <h1 className="font-display text-wine">
                    <Reveal delay={120}>
                      <span className="block text-[clamp(2.1rem,9.6vw,3.4rem)] font-extrabold uppercase leading-[0.95] tracking-[0.02em] text-wine">
                        Happy Birthday
                      </span>
                    </Reveal>
                  </h1>

                  <Reveal delay={360}>
                    <span className="block h-px w-16 bg-wine/40" />
                  </Reveal>

                  <Reveal delay={440}>
                    <p className="max-w-[34ch] text-justify text-[0.82rem] leading-[1.75] text-muted-foreground">
                      I hope this year is gentle with you. I hope the things you pray for
                      quietly, without telling anyone, find their way to you anyway. I hope
                      you laugh the loud, unguarded kind of laugh more often, sleep without a
                      heavy heart, and get loved exactly the way you love people. And on the
                      hard days, I hope you remember how rare you are. Happy birthday, Neha —
                      the world is softer because you're in it.
                    </p>
                  </Reveal>
                </div>

                <div className="flex h-20 shrink-0 items-end justify-center pb-3">
                  <Reveal delay={560}>
                    <button
                      type="button"
                      onClick={() => setPhase("cake")}
                      className="rounded-full bg-wine px-9 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-primary-foreground transition-transform active:scale-95"
                    >
                      Next
                    </button>
                  </Reveal>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center text-center">
                <div className="flex flex-1 min-h-0 flex-col items-center gap-5 overflow-hidden px-1 pb-2">

                  {blown ? (
                    <Reveal delay={0}>
                      <h2 className="font-display text-[clamp(1.5rem,7vw,2.5rem)] font-extrabold uppercase leading-none text-wine">
                        Wish Granted
                      </h2>
                    </Reveal>
                  ) : null}

                  <Reveal delay={60} pop>
                  <div className="h-[clamp(210px,52vw,260px)] w-[clamp(175px,42vw,208px)]">
                      <LottieBox
                        animationData={cakeAnimation}
                        className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                      />
                    </div>
                  </Reveal>

                  {blown ? (
                    <p className="text-[0.6rem] uppercase tracking-[0.42em] text-wine">
                      the candles are out
                    </p>
                  ) : !started ? (
                    <Reveal delay={260}>
                      <ol className="mx-auto max-w-[28ch] space-y-2.5 text-left text-[0.8rem] leading-relaxed text-muted-foreground">
                        {[
                          <>close your eyes for a moment.</>,
                          <>pray to god for whatever your heart needs this year.</>,
                          <>
                            then tap the button below and{" "}
                            <span className="inline-flex items-baseline gap-1 font-medium text-wine">
                              <MicrophoneIcon
                                weight="fill"
                                className="h-[0.95em] w-[0.95em] translate-y-[0.12em]"
                              />
                              blow at the mic
                            </span>{" "}
                            to put the candles out.
                          </>,
                        ].map((text, i) => (
                          <li key={i} className="grid grid-cols-[1.6rem_1fr] items-start gap-x-2">
                            <span className="font-display text-[0.7rem] font-bold leading-[1.7] text-wine">
                              {`0${i + 1}`}
                            </span>
                            <span className="block">{text}</span>
                          </li>
                        ))}
                      </ol>
                    </Reveal>

                  ) : micBroken ? (
                    <p className="max-w-[28ch] text-[0.78rem] leading-relaxed text-muted-foreground">
                      the mic is blocked, so the candles can't hear you. allow microphone
                      access in your browser, then try again.
                    </p>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <p className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.42em] text-wine">
                        <MicrophoneIcon weight="fill" className="h-3.5 w-3.5" />
                        now blow, {NAME.toLowerCase()}
                      </p>
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-wine transition-[width] duration-100"
                          style={{ width: `${Math.min(100, Math.round(level * 130))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!blown ? (
                  <>
                    {!started ? (
                      <p className="inline-flex items-center justify-center gap-1.5 text-[0.55rem] uppercase tracking-[0.38em] text-muted-foreground">
                        <MicrophoneIcon weight="fill" className="h-3 w-3" />
                        then blow toward your mic
                      </p>
                    ) : null}
                    <div className="flex h-20 shrink-0 items-end justify-center pb-3">
                      {!started ? (
                        <button
                          type="button"
                          onClick={begin}
                          className="rounded-full bg-wine px-9 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-primary-foreground transition-transform active:scale-95"
                        >
                          I made my wish
                        </button>
                      ) : micBroken ? (
                        <button
                          type="button"
                          onClick={begin}
                          className="rounded-full border border-wine/50 px-9 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-wine transition-transform active:scale-95"
                        >
                          Try the mic again
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </Envelope>
        </div>
      </div>
    </main>
  );
}

/** Staggered entrance wrapper — transform + opacity only. */
function Reveal({
  delay = 0,
  pop = false,
  children,
}: {
  delay?: number;
  pop?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        animation: `${pop ? "reveal-pop" : "reveal-rise"} 0.6s cubic-bezier(0.22, 0.9, 0.25, 1) both`,
        animationDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}


/** Celebration layer once the candles are out. */
function Confetti() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden animate-[fade-in_0.6s_ease-out_both]"
      aria-hidden
    >
      <LottieBox
        animationData={confettiAnimation}
        className="absolute inset-0 h-full w-full scale-[1.9] opacity-70"
      />
      <div className="absolute -left-14 -bottom-6 w-40 opacity-60">
        <LottieBox animationData={popperAnimation} loop={false} className="w-full" />
      </div>
      <div className="absolute -right-14 top-4 w-40 -scale-x-100 opacity-50">
        <LottieBox animationData={popperAnimation} loop={false} className="w-full" />
      </div>
    </div>
  );
}
