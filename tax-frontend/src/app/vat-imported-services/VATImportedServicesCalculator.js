'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, Globe, Zap, CheckCircle } from 'lucide-react'

// Move InputField component OUTSIDE to prevent recreation
const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = 'number' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#0F2F4E]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-[#0F2F4E]/60" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white border border-[#EEEEEE] rounded-xl 
                   text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:outline-none focus:border-[#1ED760] 
                   focus:ring-2 focus:ring-[#1ED760]/50 transition-all duration-300 shadow-sm"
      />
    </div>
  </div>
)

const VATImportedServices = () => {
  const [formData, setFormData] = useState({
    value: '',
    isMarketValue: false
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    const value = field === 'isMarketValue' ? e.target.checked : e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCalculate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const payload = {
        value: parseFloat(formData.value) || 0,
        isMarketValue: formData.isMarketValue
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/vat/imported-services`,
        payload
      )
      
      setResults({
        vatDue: response.data.vat,
        originalValue: payload.value,
        isMarketValue: payload.isMarketValue,
        vatRate: 14.5 // Zimbabwe VAT rate
      })
    } catch (err) {
      setError('Failed to calculate VAT. Please check your inputs and try again.')
      console.error('Calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetCalculator = () => {
    setFormData({
      value: '',
      isMarketValue: false
    })
    setResults(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg">
            <div className="flex items-center justify-center gap-4 mt-4 mb-6">
              <div className="p-3 bg-[#1ED760]/10 rounded-2xl">
                <Globe className="w-8 h-8 text-[#1ED760]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                Imported Services VAT
              </h1>
            </div>
            <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
              Calculate Value Added Tax on imported services. Determine VAT liability for services acquired from outside Zimbabwe.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-[#FFD700] shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-[#1ED760]" />
                <h2 className="text-2xl font-bold text-[#0F2F4E]">
                  Imported Services Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Value Input */}
                <InputField
                  label="Service Value"
                  icon={DollarSign}
                  value={formData.value}
                  onChange={handleChange('value')}
                  placeholder="Enter value of imported services"
                />

                {/* Market Value Toggle */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-[#0F2F4E]/5 rounded-xl border border-[#EEEEEE] hover:bg-[#0F2F4E]/10 transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.isMarketValue}
                        onChange={handleChange('isMarketValue')}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                        formData.isMarketValue 
                          ? 'bg-[#1ED760] border-[#1ED760]' 
                          : 'bg-white border-[#0F2F4E]/30'
                      }`}>
                        {formData.isMarketValue && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-[#0F2F4E]">Use Market Value</div>
                      <div className="text-sm text-[#0F2F4E]/70 mt-1">
                        Check this if you need to calculate VAT based on market value instead of invoice value
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.value}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 
                               flex items-center justify-center gap-3 shadow-lg
                               ${loading || !formData.value
                                 ? 'bg-[#EEEEEE] text-[#0F2F4E]/40 cursor-not-allowed' 
                                 : 'bg-[#1ED760] text-white hover:bg-[#1ED760]/90 hover:shadow-[#1ED760]/25'
                               }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        Calculate VAT
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetCalculator}
                    className="px-6 py-4 bg-white text-[#0F2F4E] rounded-xl font-semibold 
                               hover:bg-[#0F2F4E]/5 transition-all duration-300 border border-[#EEEEEE]"
                  >
                    Reset
                  </button>
                </div>
              </form>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-[#0F2F4E]/5 border border-[#0F2F4E]/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results & Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Results Card */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl border border-[#1ED760]/30 p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-[#0F2F4E] mb-4 text-center">
                    VAT Calculation Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Service Value:</span>
                      <span className="text-[#0F2F4E] font-semibold">
                        ${(results.originalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">VAT Rate:</span>
                      <span className="text-[#1ED760] font-semibold">
                        {results.vatRate}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Market Value Basis:</span>
                      <span className={`font-semibold ${results.isMarketValue ? 'text-[#1ED760]' : 'text-[#0F2F4E]/70'}`}>
                        {results.isMarketValue ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#EEEEEE] pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-[#0F2F4E] font-semibold">VAT Due:</span>
                        <span className="text-[#1ED760] font-bold text-xl">
                          ${(results.vatDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Imported Services Info */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Imported Services Info
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Applicable Rate:</span>
                  <span className="text-[#1ED760] font-semibold">15.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Base:</span>
                  <span className="text-[#0F2F4E]/70">Service Value</span>
                </div>
                <div className="flex justify-between">
                  <span>Reverse Charge:</span>
                  <span className="text-[#0F2F4E]/70">Applicable</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Deadline:</span>
                  <span className="text-[#0F2F4E]/70">25th of each month</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Imported Services Tips
              </h3>
              <ul className="space-y-3 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>VAT applies to services received from non-resident suppliers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Use market value when invoice value doesn't reflect arm's length principle</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Self-assess and pay VAT through reverse charge mechanism</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Keep documentation for cross-border service transactions</span>
                </li>
              </ul>
            </div>

            {/* Legal Requirements */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Legal Requirements
              </h3>
              <ul className="space-y-2 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Register for VAT if annual turnover exceeds $60,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Maintain records of all imported service transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>File VAT returns monthly by the 25th</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Pay VAT due by the filing deadline</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VATImportedServices