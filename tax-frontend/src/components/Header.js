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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (isMobileMenuOpen && !target.closest('nav') && !target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 px-3 sm:px-4 pt-2 sm:pt-4">
        <nav
          className={`mx-auto transition-all duration-300 rounded-full ${
            scrolled
              ? "bg-[#0F2F4E]/95 backdrop-blur-md shadow-lg"
              : "bg-[#0F2F4E] shadow-md"
          }`}
          style={{
            maxWidth: "min(95%, 1400px)",
          }}
        >
          <div className="px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Link href="/" className="hover:opacity-90 transition">
                <img src="/img/taxcul.svg" alt="TaxCul Logo" className="w-auto h-[20px] sm:h-[24px]" />
              </Link>
              {/* Beta pill */}
              <span className="bg-[#FFD700] text-[#0F2F4E] text-[9px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full uppercase leading-none">
                Beta
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium items-center">
              <Link href="/" className="text-white hover:text-[#1ED760] transition whitespace-nowrap">
                Home
              </Link>

              {user && (
                <Link href="/dashboard" className="text-white hover:text-[#1ED760] transition whitespace-nowrap">
                  Dashboard
                </Link>
              )}

              {/* PAYE Dropdown */}
              <div className="relative group">
                <button className="text-white hover:text-[#1ED760] transition flex items-center gap-1 whitespace-nowrap">
                  PAYE
                  <MdOutlineArrowDropDown />
                </button>

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
                <button className="text-white hover:text-[#1ED760] transition flex items-center gap-1 whitespace-nowrap">
                  Tax Planning
                  <MdOutlineArrowDropDown />
                </button>

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

              <Link href="/contact" className="text-white hover:text-[#1ED760] transition whitespace-nowrap">
                Contact
              </Link>

              <button
                onClick={openFeedbackModal}
                className="text-white hover:text-[#1ED760] transition text-sm font-medium whitespace-nowrap"
              >
                Feedback
              </button>
            </div>

            {/* CTA Section - Fixed height for consistency */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 sm:gap-2 text-white hover:text-[#1ED760] transition h-8 sm:h-9">
                    <FaUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm hidden xs:inline">{user.name}</span>
                    <MdOutlineArrowDropDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  {/* Login Button - Consistent height */}
                  <Link
                    href="/login"
                    className="text-white hover:text-[#1ED760] transition text-xs sm:text-sm font-medium whitespace-nowrap px-1 sm:px-0 h-8 sm:h-9 flex items-center"
                  >
                    Login
                  </Link>
                  
                  {/* Get Started Button - Fixed padding to match user button height */}
                  <Link
                    href="/#calculator-cards"
                    className="bg-[#1ED760] text-white px-3 sm:px-5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#1ED760]/90 transition shadow-md whitespace-nowrap flex items-center h-8 sm:h-9"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Button - Consistent height */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="md:hidden text-white hover:text-[#1ED760] transition flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <HiX size={20} className="sm:w-6 sm:h-6" /> : <HiMenu size={20} className="sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="mobile-menu fixed top-[60px] sm:top-[68px] left-0 right-0 bottom-0 z-50 md:hidden">
              <div className="h-full overflow-y-auto bg-[#0F2F4E] shadow-xl">
                <div className="flex flex-col py-4">
                  {/* User info if logged in - show in mobile menu */}
                  {user && (
                    <div className="px-6 py-4 border-b border-white/20 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#1ED760]/20 p-2 rounded-full">
                          <FaUser className="w-5 h-5 text-[#1ED760]" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{user.name}</div>
                          <div className="text-white/60 text-xs">Logged in</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-4 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    <span className="text-base font-medium">Home</span>
                  </Link>

                  {user && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-6 py-4 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                    >
                      <span className="text-base font-medium">Dashboard</span>
                    </Link>
                  )}

                  {/* PAYE Section */}
                  <div className="px-6 py-3 text-[#1ED760] text-xs font-semibold uppercase tracking-wider mt-2">
                    PAYE
                  </div>
                  <Link
                    href="/simple-payroll"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    Simple Payroll
                  </Link>
                  <Link
                    href="/paye-calculator"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    PAYE Calculator
                  </Link>

                  {/* Tax Planning Section */}
                  <div className="px-6 py-3 text-[#1ED760] text-xs font-semibold uppercase tracking-wider mt-2">
                    Tax Planning
                  </div>
                  <Link
                    href="/income-tax-calculator-single"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    Single-Period Tax Planning
                  </Link>
                  <Link
                    href="/income-tax-calculator"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    Multi-Period Tax Planning
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-4 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    <span className="text-base font-medium">Contact</span>
                  </Link>

                  <button
                    onClick={openFeedbackModal}
                    className="px-6 py-4 text-left text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                  >
                    <span className="text-base font-medium">Feedback</span>
                  </button>

                  {/* Show login/register in mobile menu if not logged in */}
                  {!user && (
                    <>
                      <div className="mt-4 px-6 py-4 border-t border-white/20">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-center bg-white/10 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition mb-3"
                        >
                          Login
                        </Link>
                        <Link
                          href="/#calculator-cards"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-center bg-[#1ED760] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#1ED760]/90 transition"
                        >
                          Get Started
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Account section for logged in users */}
                  {user && (
                    <>
                      <div className="px-6 py-3 text-[#1ED760] text-xs font-semibold uppercase tracking-wider mt-2">
                        Account
                      </div>
                      <Link
                        href="/employees"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                      >
                        Employees
                      </Link>
                      <Link
                        href="/payroll/history"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                      >
                        Payroll History
                      </Link>
                      <Link
                        href="/company/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-8 py-3 text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition border-b border-white/10"
                      >
                        Company Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-8 py-3 text-left text-white hover:bg-[#1ED760]/10 hover:text-[#1ED760] transition"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
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