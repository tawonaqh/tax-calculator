"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { FaUser } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 px-4 pt-2">
        <nav
          className={`mx-auto transition-all duration-300 rounded-full ${
            scrolled
              ? "bg-[#0F2F4E]/95 backdrop-blur-md shadow-lg"
              : "bg-[#0F2F4E] shadow-md"
          }`}
          style={{
            maxWidth: "min(90%, 1400px)",
          }}
        >
          <div className="px-8 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:opacity-90 transition">
                <img src="/img/taxcul.svg" alt="TaxCul Logo" className="w-auto h-[24px]" />
              </Link>
              {/* Beta pill */}
              <span className="bg-[#FFD700] text-[#0F2F4E] text-xs font-medium px-2 py-0.5 ml-1 rounded-full uppercase">
                Beta
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 text-sm font-medium items-center">
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
                <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-[#0F2F4E] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <Link
                    href="/simple-payroll"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                  >
                    Simple Payroll
                  </Link>
                  <Link
                    href="/paye-calculator"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
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
                <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-[#0F2F4E] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <Link
                    href="/income-tax-calculator-single"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                  >
                    Single-Period Tax Planning
                  </Link>
                  <Link
                    href="/income-tax-calculator"
                    className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
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

            {/* CTA Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white hover:text-[#1ED760] transition">
                    <FaUser />
                    <span className="text-sm hidden sm:inline">{user.name}</span>
                    <MdOutlineArrowDropDown />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#0F2F4E] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/employees"
                      className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                    >
                      Employees
                    </Link>
                    <Link
                      href="/payroll/history"
                      className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                    >
                      Payroll History
                    </Link>
                    <Link
                      href="/company/profile"
                      className="block px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                    >
                      Company Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
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
                    className="bg-[#1ED760] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#1ED760]/90 transition shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-1 hover:text-[#1ED760] transition"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto rounded-2xl bg-[#0F2F4E]/95 backdrop-blur-md shadow-lg overflow-hidden" style={{ maxWidth: "min(90%, 1400px)" }}>
            <div className="flex flex-col py-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                Home
              </Link>

              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                >
                  Dashboard
                </Link>
              )}

              <Link
                href="/simple-payroll"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                Simple Payroll
              </Link>

              <Link
                href="/paye-calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                PAYE Calculator
              </Link>

              <Link
                href="/income-tax-calculator-single"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                Single-Period Tax Planning
              </Link>

              <Link
                href="/income-tax-calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                Multi-Period Tax Planning
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                Contact
              </Link>

              <button
                onClick={openFeedbackModal}
                className="px-6 py-3 text-left text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
              >
                Feedback
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={closeFeedbackModal} 
      />
    </>
  );
};

export default Header;