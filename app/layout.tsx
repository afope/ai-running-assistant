import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Adi font setup - using adineuePRO-Regular
const adiFont = localFont({
  src: [
    {
      path: "./fonts/adineuePRO-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-adi",
  fallback: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "adi Running Assistant",
  description: "Your personal running coach powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${adiFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
