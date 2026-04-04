import { IllustrationWithEmojiFallback } from "./IllustrationWithEmojiFallback";

type BigChoiceButtonProps = {
  label: string;
  emoji?: string;
  imageSrc?: string;
  altHe?: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

/** כפתור מגע/עכבר גדול עם יעד לחיצה נוח */
export function BigChoiceButton({
  label,
  emoji,
  imageSrc,
  altHe,
  selected,
  onClick,
  disabled,
}: BigChoiceButtonProps) {
  const trimmedLabel = label.trim();
  const alt = (altHe?.trim() || trimmedLabel || emoji || "").trim();
  const attemptImage = Boolean(imageSrc?.trim());
  const showIllustration = attemptImage || Boolean(emoji);
  /** תמונה/אימוג׳י לבד (בלי טקסט בחירה) — עמודה יציבה; טקסט+אייקון — שורה */
  const layoutColumn = !trimmedLabel && showIllustration;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-4 text-lg font-semibold shadow-lg transition",
        layoutColumn ? "flex-col" : "flex-row",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200",
        "active:scale-[0.98]",
        selected
          ? "border-amber-300 bg-amber-400/30 text-white"
          : "border-white/25 bg-white/15 text-white hover:bg-white/25",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {showIllustration ? (
        <div className="flex min-h-14 min-w-14 shrink-0 items-center justify-center sm:min-h-16 sm:min-w-16">
          <IllustrationWithEmojiFallback
            imageSrc={imageSrc}
            emoji={emoji ?? "⭐"}
            alt={alt}
            imgClassName="h-14 w-14 object-contain sm:h-16 sm:w-16"
            emojiClassName="text-2xl"
          />
        </div>
      ) : null}
      {trimmedLabel ? <span>{label}</span> : null}
    </button>
  );
}
