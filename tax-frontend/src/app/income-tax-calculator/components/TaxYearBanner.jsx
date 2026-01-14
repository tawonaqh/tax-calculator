'use client'

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Tax Year Banner Component
 * Displays current tax year and recent updates
 */
export const TaxYearBanner = () => {
  const taxUpdates = [
    {
      date: 'January 2026',
      title: 'New Digital Services Tax',
      description: '15% withholding tax on foreign digital platforms (Netflix, Spotify, etc.)',
      type: 'new',
      color: 'red'
    },
    {
      date: 'January 2025',
      title: 'PAYE Bands Updated',
      description: 'Tax-free threshold: USD $100/month or ZiG 2,800/month',
      type: 'update',
      color: 'blue'
    },
    {
      date: 'January 2025',
      title: 'VAT Rate Increase',
      description: 'VAT increased from 14.5% to 15%',
      type: 'update',
      color: 'yellow'
    }
  ];
  
  return (
    <div className="bg-gradient-to-r from-[#0F2F4E] to-[#0F2F4E]/90 rounded-xl p-6 mb-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-[#1ED760]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold">Zimbabwe Tax Rules 2025/2026</h3>
          </div>
          <p className="text-white/80 text-sm">
            All calculations use the latest ZIMRA-approved tax rates and regulations
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <svg className="w-5 h-5 text-[#1ED760]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Last Updated: January 2026</span>
        </div>
      </div>
      
      {/* Recent Updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {taxUpdates.map((update, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                update.type === 'new' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {update.type === 'new' ? 'NEW' : 'UPDATED'}
              </span>
              <span className="text-xs text-white/70">{update.date}</span>
            </div>
            <h4 className="text-sm font-semibold mb-1">{update.title}</h4>
            <p className="text-xs text-white/80">{update.description}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Key Tax Rates Summary */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div>
            <div className="text-xs text-white/70 mb-1">Corporate Tax</div>
            <div className="text-lg font-bold text-[#1ED760]">25%</div>
          </div>
          <div>
            <div className="text-xs text-white/70 mb-1">AIDS Levy</div>
            <div className="text-lg font-bold text-[#1ED760]">3%</div>
          </div>
          <div>
            <div className="text-xs text-white/70 mb-1">VAT</div>
            <div className="text-lg font-bold text-[#1ED760]">15%</div>
          </div>
          <div>
            <div className="text-xs text-white/70 mb-1">Digital Services</div>
            <div className="text-lg font-bold text-[#FFD700]">15%</div>
          </div>
          <div>
            <div className="text-xs text-white/70 mb-1">Max PAYE Rate</div>
            <div className="text-lg font-bold text-[#1ED760]">40%</div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-yellow-100">
            <strong>Important:</strong> Tax calculations are for planning purposes only. 
            Always consult with a qualified tax professional or ZIMRA for official tax advice and compliance.
            Tax laws may change - verify current rates before filing.
          </p>
        </div>
      </div>
    </div>
  );
};
