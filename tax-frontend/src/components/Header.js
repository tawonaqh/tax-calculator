"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { user, logout } = useAuth();

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
          <div className="hidden md:flex gap-8 text-sm font-medium items-center">
            <Link href="/" className="text-white hover:text-[#1ED760] transition">
              Home
            </Link>

            {user && (
              <Link href="/dashboard" className="text-white hover:text-[#1ED760] transition">
                Dashboard
              </Link>
            )}

            {/* PAYE Dropdown */}
            <div className="relative group">
              <button className="text-white hover:text-[#1ED760] transition flex items-center gap-1">
                PAYE
                <MdOutlineArrowDropDown />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full mt-3 w-56 rounded-xl bg-[#0F2F4E] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                <Link
                  href="/simple-payroll"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] rounded-b-xl"
                >
                  Simple Payroll
                </Link>

                <Link
                  href="/paye-calculator"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] rounded-t-xl"
                >
                  PAYE Calculator
                </Link>
                
              </div>
            </div>

            {/* Tax Planning Dropdown */}
            <div className="relative group">
              <button className="text-white hover:text-[#1ED760] transition flex items-center gap-1">
                Tax Planning
                <MdOutlineArrowDropDown />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full mt-3 w-56 rounded-xl bg-[#0F2F4E] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/income-tax-calculator-single"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] rounded-t-xl"
                >
                  Single-Period Tax Planning
                </Link>

                <Link
                  href="/income-tax-calculator"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] rounded-b-xl"
                >
                  Multi-Period Tax Planning
                </Link>
              </div>
            </div>

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
          <div className="ml-4 flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-white hover:text-[#1ED760] transition">
                  <FaUser />
                  <span className="text-sm">{user.name}</span>
                  <MdOutlineArrowDropDown />
                </button>
                
                <div className="absolute right-0 top-full mt-3 w-48 rounded-xl bg-[#0F2F4E] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] rounded-t-xl"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/employees"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760]"
                  >
                    Employees
                  </Link>
                  <Link
                    href="/payroll/history"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760]"
                  >
                    Payroll History
                  </Link>
                  <Link
                    href="/company/profile"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760]"
                  >
                    Company Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-[#1ED760] transition text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/#calculator-cards"
                  className="bg-[#1ED760] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1ED760]/90 transition"
                >
                  Get Started
                </Link>
              </>
            )}
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