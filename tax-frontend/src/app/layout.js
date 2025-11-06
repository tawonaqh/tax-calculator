import Chatbot from "@/components/Chatbot";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
  description: "Simplify your tax calculations with our easy-to-use AI-powered tax calculator specifically designed for the Zimbabwean environment. Fast, quick, and compliant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="w-full min-h-screen flex flex-col bg-[#EEEEEE] text-[#0F2F4E]">
          <Header />
          {children}
          <Chatbot />
        </div>
      </body>
    </html>
  );
}