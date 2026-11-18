import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "../style/globals.css";
import Providers from "../providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { appleStartupImages } from "@/lib/splashScreens";

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
    startupImage: appleStartupImages(),
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#17171c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-strong">
        <ThemeProvider>
          <Providers>
            <div className="flex flex-col w-full min-h-screen">{children}</div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
