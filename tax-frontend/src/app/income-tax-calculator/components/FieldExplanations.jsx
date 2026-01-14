'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Field Explanations Component
 * Provides helpful tooltips and explanations for tax fields
 */
export const FieldExplanation = ({ title, children, position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#1ED760] rounded-full hover:bg-[#1ED760]/80 focus:outline-none focus:ring-2 focus:ring-[#1ED760] focus:ring-offset-2 transition-all"
      >
        ?
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-[#EEEEEE] ${
              position === 'right' ? 'left-full ml-2 top-0' : 
              position === 'left' ? 'right-full mr-2 top-0' : 
              position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : 
              'top-full mt-2 left-1/2 -translate-x-1/2'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-5 h-5 text-[#1ED760] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-semibold text-[#0F2F4E]">{title}</h4>
            </div>
            <div className="text-xs text-[#0F2F4E]/80 leading-relaxed">
              {children}
            </div>
            
            {/* Arrow pointer */}
            <div className={`absolute w-2 h-2 bg-white border-[#EEEEEE] transform rotate-45 ${
              position === 'right' ? 'left-0 top-3 -translate-x-1/2 border-l border-t' : 
              position === 'left' ? 'right-0 top-3 translate-x-1/2 border-r border-b' : 
              position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-l' : 
              'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-r'
            }`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Common Tax Field Explanations
 */
export const TaxFieldExplanations = {
  capitalAllowances: {
    title: 'Capital Allowances',
    content: (
      <>
        <p className="mb-2">
          Tax deductions for business assets like vehicles, equipment, and buildings.
        </p>
        <p className="mb-2 font-medium">Rates (per year):</p>
        <ul className="space-y-1 ml-3">
          <li>• Motor Vehicles: 20-50%</li>
          <li>• Equipment: 10-50%</li>
          <li>• Buildings: 2.5-5%</li>
        </ul>
        <p className="mt-2 text-[#1ED760]">
          Tip: Use special initial allowance (50%) in first year for maximum benefit
        </p>
      </>
    )
  },
  
  aidsLevy: {
    title: 'AIDS Levy',
    content: (
      <>
        <p className="mb-2">
          A 3% levy charged on the calculated tax amount (not on income).
        </p>
        <p className="mb-2">
          <strong>Example:</strong> If your tax is $1,000, AIDS Levy = $30 (3% of $1,000)
        </p>
        <p className="text-[#0F2F4E]/70">
          This levy funds HIV/AIDS programs in Zimbabwe and is mandatory for all taxpayers.
        </p>
      </>
    )
  },
  
  nssaCap: {
    title: 'NSSA Contribution Cap',
    content: (
      <>
        <p className="mb-2">
          NSSA contributions are capped at <strong>$700 USD per year</strong> per employee.
        </p>
        <p className="mb-2">
          Both employer and employee contributions count toward this cap.
        </p>
        <p className="text-[#1ED760]">
          Tip: High earners won't pay NSSA on income above the cap
        </p>
      </>
    )
  },
  
  medicalCredit: {
    title: 'Medical Aid Tax Credit',
    content: (
      <>
        <p className="mb-2">
          Medical aid contributions give a <strong>50% tax credit</strong> (not a deduction).
        </p>
        <p className="mb-2">
          <strong>Example:</strong> If you pay $200/month for medical aid, you get $100/month tax credit.
        </p>
        <p className="text-yellow-600">
          Important: This is deducted from your tax, not your income
        </p>
      </>
    )
  },
  
  currencyMix: {
    title: 'Currency Mix',
    content: (
      <>
        <p className="mb-2">
          The percentage of your business revenue/expenses in each currency.
        </p>
        <p className="mb-2 font-medium">Risk Levels:</p>
        <ul className="space-y-1 ml-3">
          <li className="text-green-600">• USD &gt; 70%: Low risk</li>
          <li className="text-yellow-600">• ZWG 20-40%: Moderate risk</li>
          <li className="text-red-600">• ZWG &gt; 40%: High risk</li>
        </ul>
        <p className="mt-2 text-[#0F2F4E]/70">
          Higher ZWG exposure increases exchange rate risk
        </p>
      </>
    )
  },
  
  exchangeRateScenario: {
    title: 'Exchange Rate Scenarios',
    content: (
      <>
        <p className="mb-2">Model different exchange rate volatility levels:</p>
        <ul className="space-y-2 ml-3">
          <li>
            <strong className="text-green-600">Stable:</strong> ±5% volatility
            <br />
            <span className="text-xs">Best case - minimal currency fluctuation</span>
          </li>
          <li>
            <strong className="text-yellow-600">Moderate:</strong> ±15% volatility
            <br />
            <span className="text-xs">Realistic scenario for Zimbabwe</span>
          </li>
          <li>
            <strong className="text-red-600">High:</strong> ±35% volatility
            <br />
            <span className="text-xs">Worst case - significant devaluation</span>
          </li>
        </ul>
      </>
    )
  },
  
  digitalServicesTax: {
    title: 'Digital Services Tax (NEW 2026)',
    content: (
      <>
        <p className="mb-2">
          <strong>15% withholding tax</strong> on payments to foreign digital platforms.
        </p>
        <p className="mb-2 font-medium">Applies to:</p>
        <ul className="space-y-1 ml-3">
          <li>• Streaming (Netflix, Spotify)</li>
          <li>• Cloud services (AWS, Azure)</li>
          <li>• Ride-hailing (Bolt, InDrive)</li>
          <li>• Software subscriptions</li>
        </ul>
        <p className="mt-2 text-red-600">
          Must be withheld and remitted to ZIMRA by 10th of following month
        </p>
      </>
    )
  },
  
  zimdefSdf: {
    title: 'ZIMDEF & SDF',
    content: (
      <>
        <p className="mb-2">Mandatory levies on payroll:</p>
        <ul className="space-y-2 ml-3">
          <li>
            <strong>ZIMDEF:</strong> 1% of gross payroll
            <br />
            <span className="text-xs">Zimbabwe Manpower Development Fund</span>
          </li>
          <li>
            <strong>SDF:</strong> 0.5% of gross payroll
            <br />
            <span className="text-xs">Skills Development Fund</span>
          </li>
        </ul>
        <p className="mt-2 text-[#0F2F4E]/70">
          These are employer costs, not deducted from employee salaries
        </p>
      </>
    )
  },
  
  transferPricing: {
    title: 'Transfer Pricing',
    content: (
      <>
        <p className="mb-2">
          Rules for transactions between related companies in different countries.
        </p>
        <p className="mb-2">
          <strong>Threshold:</strong> Transactions over $100,000 require documentation
        </p>
        <p className="text-yellow-600">
          Important: Must use arm's length pricing for cross-border transactions
        </p>
      </>
    )
  }
};

/**
 * Quick Help Panel Component
 */
export const QuickHelpPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F2F4E]">Quick Help Guide</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(TaxFieldExplanations).map(([key, { title, content }]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-2">{title}</h3>
              <div className="text-sm text-[#0F2F4E]/80">
                {content}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/10 rounded-lg border border-[#1ED760]/20">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-2">Need More Help?</h3>
          <p className="text-sm text-[#0F2F4E]/80 mb-3">
            For complex tax situations, we recommend consulting with:
          </p>
          <ul className="text-sm text-[#0F2F4E]/80 space-y-1 ml-4">
            <li>• A qualified Zimbabwe tax consultant</li>
            <li>• Your company's accountant or CFO</li>
            <li>• ZIMRA directly for official guidance</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};
