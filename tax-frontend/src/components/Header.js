"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FeedbackModal from "./FeedbackModal";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0F2F4E]/90 shadow-md backdrop-blur-md"
            : "bg-[#0F2F4E]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-90 transition">
              <img src="/img/taxcul.svg" alt="TaxCul Logo" className="w-auto h-[28px]" />
            </Link>
            {/* Beta pill */}
            <span className="bg-[#FFD700] text-[#0F2F4E] text-xs font-bold px-2 py-0.5 ml-1 mb-1 rounded-full uppercase">
              Beta
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="text-white hover:text-[#1ED760] transition">
              Home
            </Link>
            <Link href="/paye-calculator" className="text-white hover:text-[#1ED760] transition">
              Pay As You Earn
            </Link>
            <Link href="/income-tax-calculator-single" className="text-white hover:text-[#1ED760] transition">
              Single-Period Tax Planning
            </Link>
            <Link href="/income-tax-calculator" className="text-white hover:text-[#1ED760] transition">
              Multi-Period Tax Planning
            </Link>
            <Link href="/contact" className="text-white hover:text-[#1ED760] transition">
              Contact
            </Link>
            <button 
              onClick={openFeedbackModal}
              className="text-white hover:text-[#1ED760] transition text-sm font-medium"
            >
              Feedback
            </button>
          </div>

          {/* CTA */}
          <div className="ml-4">
            <Link
              href="/#calculator-cards"
              className="bg-[#1ED760] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1ED760]/90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={closeFeedbackModal} 
      />
    </>
  );
};

export default Header;