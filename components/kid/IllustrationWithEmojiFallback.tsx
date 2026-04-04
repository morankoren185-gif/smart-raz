"use client";

import { illustrationDisplayMode } from "@/lib/ui/illustrationDisplayMode";
import { useCallback, useState } from "react";

type IllustrationWithEmojiFallbackProps = Readonly<{
  imageSrc?: string | null;
  emoji: string;
  alt: string;
  imgClassName: string;
  emojiClassName: string;
}>;

/**
 * איור מתוך imageSrc; אם אין נתיב או שהטעינה נכשלה — אימוג׳י (fallback יציב לילדים).
 */
export function IllustrationWithEmojiFallback({
  imageSrc,
  emoji,
  alt,
  imgClassName,
  emojiClassName,
}: IllustrationWithEmojiFallbackProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const onError = useCallback(() => setLoadFailed(true), []);
  const mode = illustrationDisplayMode(imageSrc, loadFailed);
  const src = imageSrc?.trim();
  const altText = alt.trim();

  if (mode === "image" && src) {
    /* נכסים חיצוניים/דינמיים — לא next/image ללא remotePatterns לכל מקור */
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={altText} className={imgClassName} decoding="async" onError={onError} />;
  }

  if (loadFailed && altText) {
    return (
      <span className={emojiClassName} role="img" aria-label={altText}>
        {altText}
      </span>
    );
  }

  return (
    <span className={emojiClassName} role="img" aria-label={altText || undefined}>
      {emoji}
    </span>
  );
}
