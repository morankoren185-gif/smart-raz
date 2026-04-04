"use client";

import { IllustrationWithEmojiFallback } from "@/components/kid/IllustrationWithEmojiFallback";
import { getSolarOrderHintItems } from "@/lib/space/solar-order-hint";
import type { PlanetId } from "@/content/space/lexicon";

type SolarOrderHintCardProps = Readonly<{
  variant?: "default" | "compact";
  /** הדגשה עדינה סביב כוכב קשור לשאלה הנוכחית (אופציונלי) */
  highlightPlanet?: PlanetId;
  className?: string;
}>;

/**
 * כרטיס עזר לא נטען — סדר כוכבי הלכת מהשמש, עם ויזואלים מהלקסיקון.
 */
export function SolarOrderHintCard({
  variant = "default",
  highlightPlanet,
  className = "",
}: SolarOrderHintCardProps) {
  const items = getSolarOrderHintItems();
  const isCompact = variant === "compact";

  return (
    <aside
      className={[
        "rounded-2xl border border-violet-400/35 bg-violet-950/30 px-3 py-3 shadow-inner backdrop-blur sm:px-4",
        className,
      ].join(" ")}
      aria-label="סדר כוכבי הלכת מהשמש — עזר ויזואלי"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-right">
        <span className="text-xl" aria-hidden>
          ☀️
        </span>
        <div className="min-w-0 flex-1">
          <p className={`font-semibold text-violet-100 ${isCompact ? "text-xs" : "text-sm"}`}>
            הסדר מהשמש
          </p>
          {!isCompact ? (
            <p className="text-xs text-white/60">מקרוב לרחוק — קצב קבוע, בלי לחץ.</p>
          ) : null}
        </div>
      </div>
      <div
        className={[
          "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          isCompact ? "" : "sm:grid sm:grid-cols-4 sm:overflow-visible",
        ].join(" ")}
      >
        {items.map(({ planet, position, visual }) => {
          const alt = visual.altHe?.trim() || planet;
          const isHi = highlightPlanet === planet;
          return (
            <div
              key={planet}
              className={[
                "flex min-w-[4.25rem] shrink-0 flex-col items-center rounded-xl border px-1.5 py-2 text-center transition-colors sm:min-w-0",
                isHi
                  ? "border-amber-400/55 bg-amber-500/15 ring-2 ring-amber-400/35"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <IllustrationWithEmojiFallback
                imageSrc={visual.imageSrc}
                emoji={visual.emoji}
                alt={alt}
                imgClassName={
                  isCompact
                    ? "h-9 w-9 object-contain sm:h-10 sm:w-10"
                    : "h-11 w-11 object-contain sm:h-12 sm:w-12"
                }
                emojiClassName={isCompact ? "text-2xl leading-none" : "text-3xl leading-none"}
              />
              <span className="mt-1 text-[0.65rem] font-bold tabular-nums text-amber-200/90">
                #{position}
              </span>
              <span dir="ltr" className="max-w-[5rem] truncate text-[0.65rem] font-medium text-white/90">
                {planet}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
