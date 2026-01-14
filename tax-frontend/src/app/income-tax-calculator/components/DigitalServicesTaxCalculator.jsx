'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Digital Services Tax Calculator Component
 * NEW: 15% Withholding Tax on Foreign Digital Services (Effective January 2026)
 */
export const DigitalServicesTaxCalculator = () => {
  const [formData, setFormData] = useState({
    serviceName: '',
    monthlyPayment: '',
    annualPayment: '',
    serviceType: 'streaming'
  });
  
  const [results, setResults] = useState(null);
  
  const digitalServices = [
    { value: 'streaming', label: 'Streaming Services', examples: 'Netflix, Spotify, Disney+, Apple Music' },
    { value: 'cloud', label: 'Cloud Services', examples: 'AWS, Azure, Google Cloud' },
    { value: 'internet', label: 'Internet Services', examples: 'Starlink, Satellite Internet' },
    { value: 'ridehailing', label: 'Ride-Hailing Apps', examples: 'Bolt, InDrive, Uber' },
    { value: 'ecommerce', label: 'E-Commerce Platforms', examples: 'Amazon, eBay, AliExpress' },
    { value: 'software', label: 'Software Subscriptions', examples: 'Adobe, Microsoft 365, Zoom' },
    { value: 'other', label: 'Other Digital Services', examples: 'Any foreign digital platform' }
  ];
  
  const calculateTax = () => {
    const monthly = parseFloat(formData.monthlyPayment) || 0;
    const annual = parseFloat(formData.annualPayment) || 0;
    
    const totalPayment = annual > 0 ? annual : monthly * 12;
    const withholdingTax = totalPayment * 0.15; // 15% DSWT
    const netPayment = totalPayment - withholdingTax;
    const monthlyWithholding = withholdingTax / 12;
    
    setResults({
      totalPayment,
      withholdingTax,
      netPayment,
      monthlyWithholding,
      effectiveRate: 15
    });
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#0F2F4E]">
            Digital Services Withholding Tax (DSWT)
          </h3>
          <p className="text-sm text-[#0F2F4E]/70 mt-1">
            NEW: 15% withholding tax on payments to foreign digital platforms (Effective January 2026)
          </p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
          NEW 2026
        </span>
      </div>
      
      {/* Information Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">What is DSWT?</p>
            <p>
              The Digital Services Withholding Tax is a 15% tax on payments made to foreign digital service providers. 
              This includes streaming platforms, cloud services, ride-hailing apps, and other digital subscriptions.
            </p>
          </div>
        </div>
      </div>
      
      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
            Service Type
          </label>
          <select
            value={formData.serviceType}
            onChange={(e) => handleInputChange('serviceType', e.target.value)}
            className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] focus:ring-opacity-50 transition-all duration-200 outline-none"
          >
            {digitalServices.map(service => (
              <option key={service.value} value={service.value}>
                {service.label} ({service.examples})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
            Service Name (Optional)
          </label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) => handleInputChange('serviceName', e.target.value)}
            placeholder="e.g., Netflix Premium, Starlink"
            className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] focus:ring-opacity-50 transition-all duration-200 outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
              Monthly Payment (USD)
            </label>
            <input
              type="number"
              value={formData.monthlyPayment}
              onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
              placeholder="0.00"
              className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] focus:ring-opacity-50 transition-all duration-200 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
              Annual Payment (USD)
            </label>
            <input
              type="number"
              value={formData.annualPayment}
              onChange={(e) => handleInputChange('annualPayment', e.target.value)}
              placeholder="0.00"
              className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] focus:ring-opacity-50 transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={calculateTax}
        className="w-full py-3 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
      >
        Calculate DSWT
      </button>
      
      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div className="p-4 bg-gradient-to-r from-[#0F2F4E]/5 to-[#1ED760]/5 rounded-lg border border-[#1ED760]/20">
            <h4 className="text-lg font-semibold text-[#0F2F4E] mb-4">Tax Calculation Results</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-[#EEEEEE]">
                <div className="text-sm text-[#0F2F4E]/70">Annual Payment</div>
                <div className="text-2xl font-bold text-[#0F2F4E]">
                  ${results.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                <div className="text-sm text-red-700">DSWT @ 15%</div>
                <div className="text-2xl font-bold text-red-700">
                  ${results.withholdingTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  ${results.monthlyWithholding.toFixed(2)}/month
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-br from-[#1ED760]/10 to-[#1ED760]/20 rounded-lg border border-[#1ED760]">
                <div className="text-sm text-[#0F2F4E]/70">Net Payment to Provider</div>
                <div className="text-2xl font-bold text-[#1ED760]">
                  ${results.netPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-[#EEEEEE]">
                <div className="text-sm text-[#0F2F4E]/70">Effective Tax Rate</div>
                <div className="text-2xl font-bold text-[#0F2F4E]">
                  {results.effectiveRate}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Compliance Information */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="text-sm font-semibold text-yellow-800 mb-2">📋 Compliance Requirements</h5>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• DSWT must be withheld at source when making payments to foreign digital platforms</li>
              <li>• Businesses must remit the withheld tax to ZIMRA by the 10th of the following month</li>
              <li>• Keep records of all digital service payments and withholding certificates</li>
              <li>• Non-compliance may result in penalties and interest charges</li>
              <li>• Consult with a tax professional for specific compliance guidance</li>
            </ul>
          </div>
          
          {/* Common Services Examples */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-800 mb-2">💡 Common Services Subject to DSWT</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-blue-700">
              <div>• Netflix</div>
              <div>• Spotify</div>
              <div>• Amazon Prime</div>
              <div>• Disney+</div>
              <div>• Apple Music</div>
              <div>• YouTube Premium</div>
              <div>• Starlink</div>
              <div>• Bolt</div>
              <div>• InDrive</div>
              <div>• AWS/Azure</div>
              <div>• Adobe Creative</div>
              <div>• Microsoft 365</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
