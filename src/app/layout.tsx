import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://citoyenfacile.fr"),
  title: "CitoyenFacile — Prépare ton examen civique et réussis ta naturalisation",
  description: "Prépare ton examen civique 2026 avec 555 questions officielles. Mode révision, simulateur d'examen, suivi de progression. Naturalisation et titre de séjour.",
  keywords: [
    "examen civique 2026",
    "naturalisation française",
    "questions civiques",
    "préparer entretien naturalisation",
    "titre de séjour examen",
    "CitoyenFacile",
  ],
  openGraph: {
    title: "CitoyenFacile — Prépare ton examen civique et réussis ta naturalisation",
    description: "Prépare ton examen civique 2026 avec 555 questions officielles. Mode révision, simulateur d'examen, suivi de progression. Naturalisation et titre de séjour.",
    locale: "fr_FR",
    type: "website",
    url: "https://citoyenfacile.fr",
    siteName: "CitoyenFacile",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CitoyenFacile — Prépare ton examen civique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CitoyenFacile — Prépare ton examen civique et réussis ta naturalisation",
    description: "555 questions officielles. Mode révision, simulateur d'examen, suivi de progression.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://citoyenfacile.fr",
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
