import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../style/globals.css";
import Providers from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "지하철 근무표",
  description: "지하철 월 별 근무표",
  icons: {
    icon: "/work-calendar-icon.png",
    apple: "/work-calendar-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "지하철 근무표",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-auto ">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
