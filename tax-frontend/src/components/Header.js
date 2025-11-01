"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/90 shadow-md backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-90 transition">
          <img src="/img/taxcul.svg" alt="Tax Portal Logo" className="w-auto h-[28px]" />
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-lime-400 transition">
            Home
          </Link>
          <Link href="/paye-calculator" className="hover:text-lime-400 transition">
            Pay As You Earn
          </Link>
          <Link href="/income-tax-calculator" className="hover:text-lime-400 transition">
            Tax Planning
          </Link>
          <Link href="/contact" className="hover:text-lime-400 transition">
            Contact
          </Link>
        </div>

        {/* CTA */}
        <div className="ml-4">
          <Link
            href="/#calculator-cards"
            className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-lime-300 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
