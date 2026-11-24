import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-display", display: "swap" });
const body = Inter_Tight({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-body", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://middlemen.world"),
  title: "Middlemen · We know people.",
  description:
    "Middlemen is a deal house based in Pakistan, working worldwide. We connect businesses to buyers, partners and capital, and stay in the room until it closes.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Middlemen",
    description: "We know people. A deal house based in Pakistan, working worldwide.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0B0B0C", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.loader{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
