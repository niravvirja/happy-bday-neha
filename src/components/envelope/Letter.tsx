import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  name: string;
  onClose: () => void;
  closing: boolean;
  children: ReactNode;
};

/**
 * The sheet that lifts out of the envelope. Fills the viewport neatly on
 * phones and settles into a letter-proportioned card on larger screens.
 */
export function Letter({ name, onClose, closing, children }: Props) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center px-4 py-[max(1rem,env(safe-area-inset-top))]">
      <article
        className="relative flex w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.25rem] letter-paper paper-grain"
        style={{
          height: "min(78dvh, 40rem)",
          border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
          transformOrigin: "50% 100%",
          animation: closing
            ? "letter-rise 0.4s ease-in reverse forwards"
            : "letter-rise 0.75s cubic-bezier(0.22, 0.9, 0.25, 1) both",
        }}
        aria-label={`A birthday letter for ${name}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fold the letter back"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border/70 text-wine transition-transform active:scale-90"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 min-h-0 flex-1 grid place-items-center overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
          {children}
        </div>
      </article>
    </div>
  );
}
