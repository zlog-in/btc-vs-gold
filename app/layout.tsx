import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitcoin vs Gold - Market Cap Comparison",
  description:
    "Compare the market capitalization of Bitcoin and Gold with daily updated data and visual charts.",
  keywords: ["Bitcoin", "Gold", "Market Cap", "Cryptocurrency", "Investment"],
  icons: {
    icon: "/btclogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
