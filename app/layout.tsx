import { ProgressAndTimeProvider } from "@/components/providers/ProgressAndTimeProvider";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "מסע כוכבים — למידה משחקית",
  description: "תרגול אנגלית, עברית וחשבון לגילאי 5–7 — חוויה רגועה ומעודדת.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <ProgressAndTimeProvider>{children}</ProgressAndTimeProvider>
      </body>
    </html>
  );
}
