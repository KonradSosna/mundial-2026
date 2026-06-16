import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mundial 2026 – Typer",
  description: "Obstawiaj mecze Mistrzostw Świata 2026",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mundial 2026",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#15803d" />
      </head>
      <body className={`${geist.className} min-h-screen`} suppressHydrationWarning>
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/stadium.jpg')" }}
        />
        <div className="fixed inset-0 -z-10 bg-black/55" />
        <AuthProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
