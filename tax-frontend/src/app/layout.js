import Chatbot from "@/components/Chatbot";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tax Calculator Zimbabwe | TaxCul App",
  description:
    "Simplify your tax calculations with our easy-to-use AI-powered tax calculator specifically designed for the Zimbabwean environment. Fast, quick, and compliant.",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    other: [
      {
        rel: "icon",
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },

  openGraph: {
    title: "Tax Calculator Zimbabwe | TaxCul App",
    description:
      "Simplify your tax calculations with our easy-to-use AI-powered tax calculator.",
    images: ["/og-image.png"],
    type: "website",
    locale: "en_ZW",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="w-full min-h-screen flex flex-col bg-[#EEEEEE] text-[#0F2F4E]">
          <Analytics />
          <SpeedInsights />
          <Header />
          {children}
          <Chatbot />
        </div>
      </body>
    </html>
  );
}