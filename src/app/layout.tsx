import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pokerbacking.be"),
  title: "Pokerbacking — Stake poker players, share their winnings",
  description:
    "Koop een percentage van een speler's tournament buy-in. Volg resultaten live en ontvang jouw deel van de winst als ze cashi.",
  openGraph: {
    title: "Pokerbacking — Stake poker players, share their winnings",
    description: "The staking marketplace for poker players and backers.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
