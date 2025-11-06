'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Calculator, TrendingUp, Shield, ArrowRight, AlertCircle, DollarSign } from 'lucide-react'

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

const CorporateIncomeTax = () => {
  const [formData, setFormData] = useState({
    profits: '',
    deductions: '',
    nonDeductible: '',
    recoupments: ''
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleCalculate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const payload = {
        profits: parseFloat(formData.profits) || 0,
        deductions: parseFloat(formData.deductions) || 0,
        nonDeductible: parseFloat(formData.nonDeductible) || 0,
        recoupments: parseFloat(formData.recoupments) || 0
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/corporate-income-tax`,
        payload
      )
      
      setResults(response.data)
    } catch (err) {
      setError('Failed to calculate corporate income tax. Please check your inputs and try again.')
      console.error('Calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetCalculator = () => {
    setFormData({
      profits: '',
      deductions: '',
      nonDeductible: '',
      recoupments: ''
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
                <Building className="w-8 h-8 text-[#1ED760]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                Corporate Tax Calculator
              </h1>
            </div>
            <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
              Calculate your company's income tax liability with precision. 
              Updated with current Zimbabwean corporate tax rates and regulations.
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
                  Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Total Profits"
                    icon={TrendingUp}
                    value={formData.profits}
                    onChange={handleChange('profits')}
                    placeholder="Enter total profits"
                  />
                  <InputField
                    label="Allowable Deductions"
                    icon={DollarSign}
                    value={formData.deductions}
                    onChange={handleChange('deductions')}
                    placeholder="Business expenses"
                  />
                  <InputField
                    label="Non-Deductible Expenses"
                    icon={AlertCircle}
                    value={formData.nonDeductible}
                    onChange={handleChange('nonDeductible')}
                    placeholder="Fines, penalties, etc."
                  />
                  <InputField
                    label="Recoupments"
                    icon={Shield}
                    value={formData.recoupments}
                    onChange={handleChange('recoupments')}
                    placeholder="Allowance recoveries"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.profits}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 
                               flex items-center justify-center gap-3 shadow-lg
                               ${loading || !formData.profits
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
                        Calculate Tax
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
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
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
                    Tax Calculation Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Taxable Income:</span>
                      <span className="text-[#0F2F4E] font-semibold">
                        ${(results.taxableIncome || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Tax @ 25%:</span>
                      <span className="text-[#1ED760] font-bold">
                        ${(results.taxDue || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">AIDS Levy @ 3%:</span>
                      <span className="text-[#FFD700] font-semibold">
                        ${(results.aidsLevy || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#EEEEEE] pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-[#0F2F4E] font-semibold">Total Tax Due:</span>
                        <span className="text-[#1ED760] font-bold text-xl">
                          ${(results.totalTax || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tax Information */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Corporate Tax Info
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Standard Tax Rate:</span>
                  <span className="text-[#1ED760] font-semibold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>AIDS Levy:</span>
                  <span className="text-[#FFD700] font-semibold">3% of tax due</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Deadline:</span>
                  <span className="text-[#0F2F4E]/70">4 months after year-end</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Optimization Tips
              </h3>
              <ul className="space-y-2 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Claim all allowable business expenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Consider capital allowances on assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Keep detailed records for 7 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Consult with tax professionals for complex cases</span>
                </li>
              </ul>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Key Features
              </h3>
              <ul className="space-y-2 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Accurate Zimbabwe tax calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Real-time results with detailed breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Professional tax planning guidance</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CorporateIncomeTax