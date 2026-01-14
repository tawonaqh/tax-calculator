'use client'

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Simplified Mode Toggle Component
 * Allows users to switch between Basic and Advanced modes
 */
export const SimplifiedModeToggle = ({ isSimplified, onToggle }) => {
  return (
    <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/10 rounded-xl p-4 mb-6 border border-[#1ED760]/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-1">
            {isSimplified ? '📊 Basic Mode' : '🚀 Advanced Mode'}
          </h3>
          <p className="text-sm text-[#0F2F4E]/70">
            {isSimplified 
              ? 'Simple tax planning with essential features only'
              : 'Full multi-currency, multi-period planning with scenarios'
            }
          </p>
        </div>
        
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-[#1ED760] rounded-lg hover:bg-[#1ED760]/5 transition-all duration-200 group"
        >
          <span className="text-[#0F2F4E] font-medium">
            Switch to {isSimplified ? 'Advanced' : 'Basic'} Mode
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg 
              className="w-5 h-5 text-[#1ED760]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </motion.div>
        </button>
      </div>
      
      {/* Feature comparison */}
      <div className="mt-4 pt-4 border-t border-[#EEEEEE]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-[#0F2F4E] mb-2">✓ Basic Mode Includes:</div>
            <ul className="space-y-1 text-[#0F2F4E]/70">
              <li>• Single period tax calculation</li>
              <li>• USD currency only</li>
              <li>• Essential tax adjustments</li>
              <li>• Capital allowances</li>
              <li>• PDF/Excel export</li>
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-[#0F2F4E] mb-2">⚡ Advanced Mode Adds:</div>
            <ul className="space-y-1 text-[#0F2F4E]/70">
              <li>• Multi-period projections (up to 5 years)</li>
              <li>• Multi-currency support (USD, ZiG, ZAR, GBP, EUR)</li>
              <li>• Scenario planning & comparison</li>
              <li>• Currency risk analysis</li>
              <li>• Exchange rate volatility modeling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
