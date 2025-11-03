'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen mt-2 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white text-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Animated background element */}
          <div className="absolute inset-0 bg-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Main 404 display */}
          <div className="relative bg-gray-800/40 backdrop-blur-sm border border-lime-400/20 rounded-3xl p-12 shadow-2xl">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-8xl md:text-9xl font-extrabold mb-6 bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent"
            >
              404
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-lime-400/10 rounded-2xl border border-lime-400/20">
                <Calculator className="w-12 h-12 text-lime-400" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-lime-400 mb-4"
            >
              Tax Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-gray-300 mb-8 max-w-md mx-auto leading-relaxed"
            >
              The tax calculator or page you're looking for seems to have gone on a break. 
              Let's get you back to calculating taxes!
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Link
          href="/"
          className="flex items-center gap-3 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-gray-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-lime-400/25 group"
        >
          <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
          Back to Tax Hub
        </Link>

        <Link
          href="/income-tax-calculator"
          className="flex items-center gap-3 bg-gray-800/60 hover:bg-gray-700/60 text-lime-400 font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-lime-400/30 hover:border-lime-400/50 group"
        >
          <Calculator className="w-5 h-5 transition-transform group-hover:scale-110" />
          Tax Planning
        </Link>
      </motion.div>

      {/* Additional helpful links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 p-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-md"
      >
        <h3 className="text-lime-400 font-semibold mb-3">Quick Tax Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Link href="/self-employment-tax-calculator" className="text-gray-300 hover:text-lime-400 transition-colors">
            • Income Tax
          </Link>
          <Link href="/withholding-tax-interest" className="text-gray-300 hover:text-lime-400 transition-colors">
            • Withholding Tax
          </Link>
          <Link href="/agriculture-tax" className="text-gray-300 hover:text-lime-400 transition-colors">
            • Agriculture Tax
          </Link>
          <Link href="/insurance-tax" className="text-gray-300 hover:text-lime-400 transition-colors">
            • Insurance Tax
          </Link>
        </div>
      </motion.div>

      {/* Floating elements for visual interest */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-10 left-10 text-xs text-gray-500"
      >
        Error Code: TAX_404_NOT_FOUND
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1.2 }}
        className="fixed top-1/4 right-10 text-6xl text-lime-400/20 rotate-12 font-mono"
      >
        $ $ $
      </motion.div>
    </div>
  )
}