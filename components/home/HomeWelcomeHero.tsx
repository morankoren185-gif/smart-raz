import Image from "next/image";

/**
 * אזור פתיחה עליון — מותג Smart Raz, ברכה אישית, ודמות רז (מובייל קודם).
 */
export function HomeWelcomeHero() {
  return (
    <section
      className="mb-8 rounded-3xl border border-white/10 px-4 py-6 sm:px-6 sm:py-7"
      aria-labelledby="home-welcome-heading"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 text-right">
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/40 bg-amber-400/15 text-sm shadow-[0_0_12px_rgba(251,191,36,0.25)]"
              aria-hidden
            >
              ⭐
            </span>
            <p
              className="bg-gradient-to-l from-amber-200 via-white to-teal-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.35)] sm:text-4xl"
            >
              Smart Raz
            </p>
          </div>
          <h1
            id="home-welcome-heading"
            className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl"
          >
            ברוך הבא רז!
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            מוכנים לעוד מסע חכם היום?
          </p>
        </div>

        <div className="relative shrink-0">
          <Image
            src="/branding/raz-hero.png"
            alt="רז מחייך ומעודד — דמות מסע הלמידה"
            width={220}
            height={275}
            className="h-auto w-[9.5rem] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] sm:w-[11rem]"
            sizes="(min-width: 640px) 11rem, 9.5rem"
            priority
          />
        </div>
      </div>
    </section>
  );
}
