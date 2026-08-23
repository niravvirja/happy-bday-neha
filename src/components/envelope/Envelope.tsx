import { Heart, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type EnvelopeStage = "sealed" | "opening" | "open" | "closing";

type Props = {
  stage: EnvelopeStage;
  initial: string;
  caption: string;
  onOpen: () => void;
  onClose: () => void;
  name: string;
  children: ReactNode;
};

const CLIP_TOP = "polygon(0% 0%, 50% 100%, 100% 0%)";
const CLIP_BOTTOM = "polygon(0% 100%, 50% 0%, 100% 100%)";
const CLIP_LEFT = "polygon(0% 0%, 100% 50%, 0% 100%)";
const CLIP_RIGHT = "polygon(100% 0%, 0% 50%, 100% 100%)";

/**
 * A folded paper envelope: back panel, letter peeking inside,
 * four creased flaps and a wax seal. Tapping it unfolds the top flap.
 */
export function Envelope({ stage, initial, caption, onOpen, onClose, name, children }: Props) {
  const interactive = stage === "sealed";

  // Stacking is driven by state, not by keyframes: the letter clears the pocket
  // ~0.95s into the open sequence and drops back behind it ~0.57s into the close.
  const [lifted, setLifted] = useState(false);
  useEffect(() => {
    if (stage === "opening") {
      const t = setTimeout(() => setLifted(true), 1000);
      return () => clearTimeout(t);
    }
    if (stage === "closing") {
      const t = setTimeout(() => setLifted(false), 660);
      return () => clearTimeout(t);
    }
    setLifted(stage === "open");
    return;
  }, [stage]);

  return (
    <div className="envelope-scene" data-stage={stage} data-lifted={lifted}>
      <div
        role="button"
        tabIndex={interactive ? 0 : -1}
        aria-label="Open the letter"
        onClick={() => interactive && onOpen()}
        onKeyDown={(e) => {
          if (interactive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpen();
          }
        }}
        className={`envelope-body select-none outline-none ${interactive ? "cursor-pointer" : ""}`}
      >
        {/* back panel */}
        <div
          className="absolute inset-0 rounded-[0.6rem] env-paper-deep"
          aria-hidden
        />

        {/* The letter: begins tucked in the pocket, rises, clears the envelope,
            then flips over as it comes forward and expands. */}
        <div className="envelope-letter-layer">
          <article className="envelope-letter" aria-label={`A birthday letter for ${name}`}>
            {/* blank reverse side, visible while the letter rises */}
            <div className="letter-face letter-face-back letter-paper paper-grain" aria-hidden />

            {/* written side, revealed by the flip */}
            <div className="letter-face letter-paper paper-grain">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
                aria-label="Fold the letter back"
                className="letter-close absolute right-3 top-3 z-20 rounded-full text-wine shadow-none"
              >
                <X />
              </Button>
              <div className="relative z-10 grid h-full place-items-center overflow-hidden px-6 py-6 sm:px-10 sm:py-8">
                {children}
              </div>
            </div>
          </article>
        </div>



        {/* side + bottom creases */}
        <div
          className="absolute inset-y-0 left-0 z-30 w-1/2 env-paper"
          style={{ clipPath: CLIP_LEFT }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 z-30 w-1/2 env-paper"
          style={{ clipPath: CLIP_RIGHT }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 z-30 h-[64%] env-paper-lit"
          style={{ clipPath: CLIP_BOTTOM }}
          aria-hidden
        />

        {/* top flap — wrapper owns the stacking switch, inner div the rotation */}
        <div className="envelope-flap-layer" aria-hidden>
          <div className="envelope-flap env-paper-lit" style={{ clipPath: CLIP_TOP }} />
        </div>

        {/* wax seal */}
        <div className="envelope-seal" aria-hidden>
          <span className="envelope-seal-ring">
            <Heart className="envelope-seal-heart" strokeWidth={1.8} />
          </span>
          <span className="sr-only">{initial}</span>
        </div>
      </div>

      <p
        className={`absolute inset-x-0 top-[calc(100%+2.25rem)] w-full text-center text-[0.6rem] uppercase tracking-[0.42em] text-muted-foreground transition-opacity duration-500 ${
          interactive ? "opacity-100" : "opacity-0"
        }`}
      >
        {caption}
      </p>
    </div>
  );
}
