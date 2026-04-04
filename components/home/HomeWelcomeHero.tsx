import Image from "next/image";

/**
 * אזור פתיחה עליון — מותג Smart Raz + דמות רז בעיגול לבן ליד הכותרת (RTL).
 */
export function HomeWelcomeHero() {
  return (
    <section
      className="mb-8 rounded-3xl border border-white/10 px-4 py-6 sm:px-6 sm:py-7"
      aria-labelledby="home-welcome-heading"
    >
      <div className="flex flex-col gap-4">
        {/* שורת מותג: בעברית RTL — פריט ראשון מיושר לימין; העיגול ראשון ב-DOM = מימין לטקסט */}
        <div className="flex flex-row items-center justify-start gap-3 sm:gap-4">
          <div className="relative h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-full border-[3px] border-white/90 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.28)] sm:h-32 sm:w-32">
            <Image
              src="/branding/raz-hero.png"
              alt="רז מחייך ומעודד"
              width={256}
              height={256}
              className="size-full object-cover object-[center_28%] sm:object-[center_30%]"
              sizes="(min-width: 640px) 128px, 84px"
              priority
            />
          </div>
          <div
            dir="ltr"
            className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3"
          >
            <p
              className="bg-gradient-to-l from-amber-200 via-white to-teal-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.35)] sm:text-4xl"
            >
              Smart Raz
            </p>
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-400/15 text-sm shadow-[0_0_12px_rgba(251,191,36,0.25)]"
              aria-hidden
            >
              ⭐
            </span>
          </div>
        </div>

        <h1
          id="home-welcome-heading"
          className="text-right text-2xl font-bold leading-snug text-white sm:text-3xl"
        >
          ברוך הבא רז!
        </h1>
        <p className="max-w-lg text-right text-sm leading-relaxed text-white/80 sm:text-base">
          מוכנים לעוד מסע חכם היום?
        </p>
      </div>
    </section>
  );
}
