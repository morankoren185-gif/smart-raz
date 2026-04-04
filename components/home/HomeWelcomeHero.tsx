import Image from "next/image";

/**
 * Hero עליון: לוגו טיפוגרפי Smart Raz + דמות רז (PNG שקוף) באותה שורה — בלי כרטיס/עיגול פרופיל.
 */
export function HomeWelcomeHero() {
  return (
    <section className="mb-8" aria-labelledby="home-welcome-heading">
      <div className="flex flex-col gap-4">
        {/*
          RTL: flex-row + justify-start → הפריט הראשון נצמד לימין.
          סדר DOM: דמות ואז טקסט הלוגו → הדמות מימין, «Smart Raz» משמאל, ישור שורות לבסיס (items-end).
        */}
        <div className="flex flex-row flex-nowrap items-end justify-start gap-2 sm:gap-4">
          <div className="relative shrink-0 select-none">
            <Image
              src="/branding/raz-hero.png"
              alt="רז מחייך ומעודד — דמות Smart Raz"
              width={320}
              height={400}
              className="h-[7.75rem] w-auto object-contain object-bottom drop-shadow-[0_12px_32px_rgba(0,0,0,0.38)] sm:h-[10.25rem] md:h-[11rem]"
              sizes="(min-width: 768px) 176px, (min-width: 640px) 164px, 124px"
              priority
            />
          </div>
          <div
            dir="ltr"
            className="min-w-0 flex-1 pb-0.5 text-right sm:pb-1"
          >
            <p className="inline-block bg-gradient-to-l from-amber-200 via-white to-teal-200 bg-clip-text text-[1.65rem] font-extrabold leading-none tracking-tight text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.35)] sm:text-4xl md:text-[2.5rem]">
              Smart Raz
            </p>
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
