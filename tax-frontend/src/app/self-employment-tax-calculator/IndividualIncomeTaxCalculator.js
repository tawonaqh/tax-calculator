'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, User, Zap, BadgeDollarSign } from 'lucide-react'

// Move InputField component OUTSIDE to prevent recreation
const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = 'number', step = "any" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl 
                   text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 
                   focus:ring-2 focus:ring-lime-400/50 transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mt-4 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-2xl">
              <User className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-lime-400">
              Individual Income Tax
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate your personal income tax liability based on Zimbabwe's progressive tax brackets. Includes exemptions and deductions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-lime-400" />
                <h2 className="text-2xl font-bold text-lime-400">
                  Income Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Income Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-300">
                    Zimbabwe Income Tax Brackets
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {taxBrackets.map((bracket, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-700/30 rounded-xl border border-gray-600/30"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-lime-400 text-sm">
                              {bracket.range}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {bracket.description}
                            </div>
                          </div>
                          <div className="text-lime-400 font-bold text-sm">
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
                                 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                 : 'bg-lime-400 text-gray-900 hover:bg-lime-500 hover:shadow-lime-400/25'
                               }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
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
                    className="px-6 py-4 bg-gray-700/50 text-gray-300 rounded-xl font-semibold 
                               hover:bg-gray-600/50 transition-all duration-300"
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
                  className="mt-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
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
                  className="bg-gradient-to-br from-lime-400/10 to-green-400/5 rounded-3xl 
                             border border-lime-400/20 p-6"
                >
                  <h3 className="text-xl font-bold text-lime-400 mb-4 text-center">
                    Tax Calculation Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Gross Income:</span>
                      <span className="text-white font-semibold">
                        ${(results.grossIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Taxable Income:</span>
                      <span className="text-lime-400 font-semibold">
                        ${(results.taxableIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Effective Rate:</span>
                      <span className="text-lime-400 font-semibold">
                        {results.effectiveRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Income Tax:</span>
                      <span className="text-lime-400 font-bold">
                        ${(results.taxDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-300 font-semibold">Net Income:</span>
                        <span className="text-white font-bold text-xl">
                          ${(results.netIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tax Information */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                Income Tax Info
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Tax-free Threshold:</span>
                  <span className="text-lime-400 font-semibold">$100</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Rate:</span>
                  <span className="text-gray-400">40%</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Frequency:</span>
                  <span className="text-gray-400">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="text-gray-400">PAYE/Monthly Return</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                Tax Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>First $100 of monthly income is tax-free</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Common exemptions include allowances and benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Deductible expenses reduce taxable income</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>File monthly tax return by specified deadline</span>
                </li>
              </ul>
            </div>

            {/* Common Deductions */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <BadgeDollarSign className="w-4 h-4 text-lime-400" />
                <h3 className="text-lg font-bold text-lime-400">
                  Common Deductions
                </h3>
              </div>
              <div className="text-sm text-gray-300 space-y-2">
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