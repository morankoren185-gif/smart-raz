"use client";

import type { MissionPlayEndFlow } from "@/lib/flags/flag-mission-return-flow";
import { useRouter } from "next/navigation";

type FlagsMissionPlayEndActionsProps = Readonly<{
  flow: MissionPlayEndFlow;
}>;

/** כפתורי המשך מסלול אחרי משחק שיוצא ממשימת flags */
export function FlagsMissionPlayEndActions({ flow }: FlagsMissionPlayEndActionsProps) {
  const router = useRouter();
  return (
    <div className="mt-5 w-full max-w-md space-y-3 border-t border-white/15 pt-5 mx-auto">
      {flow.subline ? (
        <p className="text-center text-base leading-snug text-teal-100/95">{flow.subline}</p>
      ) : null}
      <button
        type="button"
        className="min-h-[3.5rem] w-full rounded-2xl bg-teal-500 px-5 text-lg font-bold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200 active:scale-[0.99] sm:min-h-14"
        onClick={() => router.push(flow.primaryHref)}
      >
        {flow.primaryLabel}
      </button>
    </div>
  );
}
