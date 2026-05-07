import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AntiMager",
  description:
    "Modern Productivity SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`
          ${inter.variable}
          bg-[#020617]
          font-sans
          text-white
          antialiased
        `}
      >
        {children}

        <Toaster
          richColors
          position="top-right"
        />
      </body>
    </html>
  );
}