'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Calculator, Users, Building } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E] flex flex-col items-center justify-center px-6 py-12 text-center">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <img src="/img/taxcul.svg" alt="TaxCul" className="h-10 w-auto mx-auto" />
      </motion.div>

      {/* 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-[#1ED760]/10 rounded-full blur-3xl" />
        <h1 className="relative text-[120px] md:text-[160px] font-extrabold leading-none bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] bg-clip-text text-transparent drop-shadow-2xl">
          404
        </h1>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-12"
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#1ED760]/25 transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <Calculator className="w-5 h-5" />
          Go to Dashboard
        </Link>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-sm w-full"
      >
        <p className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Link href="/simple-payroll" className="flex items-center gap-2 text-white/70 hover:text-[#1ED760] transition-colors">
            <Calculator className="w-4 h-4" /> Simple Payroll
          </Link>
          <Link href="/paye-calculator" className="flex items-center gap-2 text-white/70 hover:text-[#1ED760] transition-colors">
            <Calculator className="w-4 h-4" /> PAYE Calculator
          </Link>
          <Link href="/employees" className="flex items-center gap-2 text-white/70 hover:text-[#1ED760] transition-colors">
            <Users className="w-4 h-4" /> Employees
          </Link>
          <Link href="/company/profile" className="flex items-center gap-2 text-white/70 hover:text-[#1ED760] transition-colors">
            <Building className="w-4 h-4" /> Company
          </Link>
        </div>
      </motion.div>

      {/* Error code */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/20 text-xs mt-8 font-mono"
      >
        ERROR: PAGE_NOT_FOUND
      </motion.p>
    </div>
  )
}
