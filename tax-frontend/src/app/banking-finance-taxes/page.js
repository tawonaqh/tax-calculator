'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, TrendingUp, Zap, PieChart } from 'lucide-react'

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

const FinancialTax = () => {
  const [formData, setFormData] = useState({
    value: ''
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const financialTaxTypes = [
    { type: 'Banking Levy', rate: '0.05%', description: 'On total assets' },
    { type: 'Transaction Tax', rate: 'Varies', description: 'On financial transactions' },
    { type: 'Corporate Tax', rate: '24.72%', description: 'On financial institution profits' },
    { type: 'Capital Gains', rate: '20%', description: 'On investment profits' }
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
        value: parseFloat(formData.value) || 0
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/financial`,
        payload
      )
      
      setResults({
        taxDue: response.data.taxDue,
        financialValue: payload.value,
        netAmount: payload.value - response.data.taxDue,
        taxRate: (response.data.taxDue / payload.value) * 100
      })
    } catch (err) {
      setError('Failed to calculate financial tax. Please check your inputs and try again.')
      console.error('Calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetCalculator = () => {
    setFormData({
      value: ''
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
              <TrendingUp className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-lime-400">
              Financial Tax
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate financial sector taxes including banking levies, transaction taxes, and capital gains. Estimate tax obligations for financial institutions and transactions in Zimbabwe.
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
                  Financial Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Financial Value Input */}
                <InputField
                  label="Financial Transaction/Asset Value"
                  icon={DollarSign}
                  value={formData.value}
                  onChange={handleChange('value')}
                  placeholder="Enter financial transaction or asset value"
                />

                {/* Financial Tax Types */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Financial Tax Types
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {financialTaxTypes.map((taxType, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-700/30 rounded-xl border border-gray-600/30"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lime-400 text-sm">
                              {taxType.type}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {taxType.description}
                            </div>
                          </div>
                          <div className="text-lime-400 font-bold text-sm">
                            {taxType.rate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    * The actual rate applied depends on the specific financial transaction type
                  </p>
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
                      <span className="text-gray-300">Financial Value:</span>
                      <span className="text-white font-semibold">
                        ${(results.financialValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Applied Rate:</span>
                      <span className="text-lime-400 font-semibold">
                        {results.taxRate.toFixed(2)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Financial Tax:</span>
                      <span className="text-lime-400 font-bold">
                        ${(results.taxDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-300 font-semibold">Net Amount:</span>
                        <span className="text-white font-bold text-xl">
                          ${(results.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Financial Tax Information */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                Financial Tax Info
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Banking Levy:</span>
                  <span className="text-lime-400 font-semibold">0.05%</span>
                </div>
                <div className="flex justify-between">
                  <span>Corporate Tax:</span>
                  <span className="text-gray-400">24.72%</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Gains:</span>
                  <span className="text-gray-400">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Frequency:</span>
                  <span className="text-gray-400">Monthly/Quarterly</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                Financial Tax Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Banking levy applies to total banking assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Transaction taxes vary by transaction type and size</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Capital gains tax applies to investment profits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Maintain detailed financial transaction records</span>
                </li>
              </ul>
            </div>

            {/* Financial Institutions */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4 text-lime-400" />
                <h3 className="text-lg font-bold text-lime-400">
                  Applicable Institutions
                </h3>
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Financial taxes apply to:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <span>• Commercial banks</span>
                  <span>• Investment banks</span>
                  <span>• Microfinance institutions</span>
                  <span>• Insurance companies</span>
                  <span>• Pension funds</span>
                  <span>• Securities firms</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FinancialTax