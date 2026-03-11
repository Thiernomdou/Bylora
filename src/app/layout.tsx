import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bylora — Réussis ton entretien de naturalisation",
  description: "555 vraies questions d'entretien. Répétition espacée. 20 min/jour depuis ton téléphone.",
  openGraph: {
    title: "Bylora — Réussis ton entretien de naturalisation",
    description: "Révise les vraies questions en 20 min/jour depuis ton téléphone.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
