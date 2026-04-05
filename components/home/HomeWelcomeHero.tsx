import Image from "next/image";

/**
 * Hero עליון אחד: שורת לוגו (Smart Raz ⭐) + דמות רז ישירות ליד — בלי כרטיס/עטיפה סביב התמונה.
 * מובייל: עמודה ממורכזת — לוגו, מתחת דמות. דסקטופ: שורה ממורכזת — דמות מימין, לוגו משמאל (RTL + order).
 */
export function HomeWelcomeHero() {
  return (
    <section className="mb-8" aria-labelledby="home-welcome-heading">
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6 md:gap-8">
          <div
            dir="ltr"
            className="order-1 flex shrink-0 flex-row flex-nowrap items-center justify-center gap-2 sm:order-2"
          >
            <p className="inline-block bg-gradient-to-l from-amber-200 via-white to-teal-200 bg-clip-text text-[1.7rem] font-extrabold leading-none tracking-tight text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.35)] sm:text-4xl md:text-[2.5rem]">
              Smart Raz
            </p>
            <span className="shrink-0 text-xl leading-none sm:text-2xl" aria-hidden>
              ⭐
            </span>
          </div>

          <Image
            src="/branding/raz.png"
            alt="רז מחייך ומעודד — דמות Smart Raz"
            width={320}
            height={400}
            className="order-2 h-[9rem] w-auto max-w-[min(100%,14rem)] shrink-0 object-contain object-bottom sm:order-1 sm:h-[11.5rem] sm:max-w-none md:h-[12.5rem]"
            sizes="(min-width: 768px) 200px, (min-width: 640px) 184px, 144px"
            priority
          />
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
