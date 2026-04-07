import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3Pay — Crypto Checkout Demo",
  description: "Pay with Ethereum — merchant demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.className} h-full antialiased`}>
      <body className="min-h-full bg-[#0f0f0f] text-[#f5f5f5] flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}
