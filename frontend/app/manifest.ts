import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "지하철 근무표",
    short_name: "근무일지",
    description: "지하철 월 별 근무표",
    start_url: "/",
    display: "standalone",
    // Match --background in style/globals.css so the launch splash blends
    // into the first painted frame instead of flashing a different colour.
    background_color: "#f2f4f6",
    theme_color: "#f2f4f6",
    icons: [
      {
        src: "/work-calendar-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/work-calendar-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
