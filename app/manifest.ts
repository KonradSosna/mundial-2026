import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mundial 2026 – Typer",
    short_name: "Mundial 2026",
    description: "Obstawiaj mecze Mistrzostw Świata 2026",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#052e16",
    theme_color: "#15803d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
