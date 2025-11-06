'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, User, Zap, BadgeDollarSign } from 'lucide-react'

// Move InputField component OUTSIDE to prevent recreation
const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = 'number', step = "any" }) => (
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
        step={step}
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

const IndividualIncomeTax = () => {
  const [formData, setFormData] = useState({
    income: '',
    exemptIncome: '',
    deductions: ''
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const taxBrackets = [
    { range: 'First $100', rate: '0%', description: 'Tax-free threshold' },
    { range: '$100 - $300', rate: '20%', description: 'First bracket' },
    { range: '$300 - $1,000', rate: '25%', description: 'Second bracket' },
    { range: '$2,000 - $3,000', rate: '30%', description: 'Third bracket' },
    { range: 'Above $3,000', rate: '40%', description: 'Top bracket' }
  ]

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
        income: parseFloat(formData.income) || 0,
        exemptIncome: parseFloat(formData.exemptIncome) || 0,
        deductions: parseFloat(formData.deductions) || 0,
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/individual-income-tax`,
        payload
      )
      
      const taxableIncome = payload.income - payload.exemptIncome - payload.deductions
      
      setResults({
        taxDue: response.data.taxDue,
        grossIncome: payload.income,
        exemptIncome: payload.exemptIncome,
        deductions: payload.deductions,
        taxableIncome: taxableIncome > 0 ? taxableIncome : 0,
        effectiveRate: (response.data.taxDue / (taxableIncome > 0 ? taxableIncome : payload.income)) * 100,
        netIncome: (payload.income - payload.exemptIncome) - response.data.taxDue
      })
    } catch (err) {
      setError('Failed to calculate income tax. Please check your inputs and try again.')
      console.error('Calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetCalculator = () => {
    setFormData({
      income: '',
      exemptIncome: '',
      deductions: ''
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
                <User className="w-8 h-8 text-[#1ED760]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                Individual Income Tax
              </h1>
            </div>
            <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
              Calculate your personal income tax liability based on Zimbabwe's progressive tax brackets. Includes exemptions and deductions.
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
                  Income Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Income Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Gross Income"
                    icon={DollarSign}
                    value={formData.income}
                    onChange={handleChange('income')}
                    placeholder="Enter gross income"
                  />
                  <InputField
                    label="Exempt Income"
                    icon={BadgeDollarSign}
                    value={formData.exemptIncome}
                    onChange={handleChange('exemptIncome')}
                    placeholder="Enter exempt income"
                  />
                </div>

                <InputField
                  label="Deductions"
                  icon={Receipt}
                  value={formData.deductions}
                  onChange={handleChange('deductions')}
                  placeholder="Enter deductions"
                />

                {/* Tax Brackets */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    Zimbabwe Income Tax Brackets
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {taxBrackets.map((bracket, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#EEEEEE] rounded-xl border border-[#EEEEEE]"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-[#1ED760] text-sm">
                              {bracket.range}
                            </div>
                            <div className="text-xs text-[#0F2F4E]/60 mt-1">
                              {bracket.description}
                            </div>
                          </div>
                          <div className="text-[#1ED760] font-bold text-sm">
                            {bracket.rate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.income}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 
                               flex items-center justify-center gap-3 shadow-lg
                               ${loading || !formData.income
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
                      <span className="text-[#0F2F4E]">Gross Income:</span>
                      <span className="text-[#0F2F4E] font-semibold">
                        ${(results.grossIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Taxable Income:</span>
                      <span className="text-[#1ED760] font-semibold">
                        ${(results.taxableIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Effective Rate:</span>
                      <span className="text-[#1ED760] font-semibold">
                        {results.effectiveRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Income Tax:</span>
                      <span className="text-[#1ED760] font-bold">
                        ${(results.taxDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#EEEEEE] pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-[#0F2F4E] font-semibold">Net Income:</span>
                        <span className="text-[#0F2F4E] font-bold text-xl">
                          ${(results.netIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                Income Tax Info
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Tax-free Threshold:</span>
                  <span className="text-[#1ED760] font-semibold">$100</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Rate:</span>
                  <span className="text-[#0F2F4E]/70">40%</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Frequency:</span>
                  <span className="text-[#0F2F4E]/70">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="text-[#0F2F4E]/70">PAYE/Monthly Return</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Tax Tips
              </h3>
              <ul className="space-y-2 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>First $100 of monthly income is tax-free</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Common exemptions include allowances and benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Deductible expenses reduce taxable income</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>File monthly tax return by specified deadline</span>
                </li>
              </ul>
            </div>

            {/* Common Deductions */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <BadgeDollarSign className="w-4 h-4 text-[#1ED760]" />
                <h3 className="text-lg font-bold text-[#0F2F4E]">
                  Common Deductions
                </h3>
              </div>
              <div className="text-sm text-[#0F2F4E] space-y-2">
                <p>Typical deductible expenses:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <span>• Medical expenses</span>
                  <span>• Retirement contributions</span>
                  <span>• Education expenses</span>
                  <span>• Charitable donations</span>
                  <span>• Work-related expenses</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default IndividualIncomeTax