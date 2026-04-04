import Image from "next/image";

/**
 * Hero עליון: שורת לוגו (Smart Raz ⭐) + דמות רז באותו container — בלי כרטיס או מסגרת.
 * מובייל: לוגו → דמות → ברכה. דסקטופ (RTL): דמות מימין, לוגו לידה משמאל; ברכה מתחת לכל הרוחב.
 */
export function HomeWelcomeHero() {
  return (
    <section className="mb-8" aria-labelledby="home-welcome-heading">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-end sm:justify-start sm:gap-4">
          <div
            dir="ltr"
            className="order-1 flex shrink-0 flex-row flex-nowrap items-center justify-end gap-2 sm:order-2 sm:min-w-0 sm:flex-1 sm:pb-0.5 md:pb-1"
          >
            <p className="inline-block bg-gradient-to-l from-amber-200 via-white to-teal-200 bg-clip-text text-[1.65rem] font-extrabold leading-none tracking-tight text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.35)] sm:text-4xl md:text-[2.5rem]">
              Smart Raz
            </p>
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-xl leading-none sm:text-2xl"
              aria-hidden
            >
              ⭐
            </span>
          </div>
          <div className="order-2 flex justify-end sm:order-1 sm:shrink-0">
            <Image
              src="/branding/raz-hero.png"
              alt="רז מחייך ומעודד — דמות Smart Raz"
              width={320}
              height={400}
              className="h-[8rem] w-auto object-contain object-bottom drop-shadow-[0_12px_32px_rgba(0,0,0,0.38)] sm:h-[10.5rem] md:h-[11.25rem]"
              sizes="(min-width: 768px) 180px, (min-width: 640px) 168px, 128px"
              priority
            />
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
