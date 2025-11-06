'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, Sprout, Zap, Trees } from 'lucide-react'

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

const AgricultureTax = () => {
  const [formData, setFormData] = useState({
    value: ''
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
        value: parseFloat(formData.value) || 0
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/agriculture`,
        payload
      )
      
      setResults({
        taxDue: response.data.taxDue,
        agriculturalValue: payload.value,
        netAmount: payload.value - response.data.taxDue,
        taxRate: (response.data.taxDue / payload.value) * 100
      })
    } catch (err) {
      setError('Failed to calculate agriculture tax. Please check your inputs and try again.')
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
                <Sprout className="w-8 h-8 text-[#1ED760]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                Agriculture Tax
              </h1>
            </div>
            <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
              Calculate agriculture tax on farming income and production. Estimate your tax obligations for agricultural activities in Zimbabwe.
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
                  Agriculture Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Agricultural Value Input */}
                <InputField
                  label="Agricultural Value"
                  icon={DollarSign}
                  value={formData.value}
                  onChange={handleChange('value')}
                  placeholder="Enter agricultural income or production value"
                />

                {/* Agriculture Categories */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    Common Agricultural Activities
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#0F2F4E]/5 rounded-xl border border-[#EEEEEE]">
                      <div className="font-semibold text-[#1ED760] text-sm">Crop Farming</div>
                      <div className="text-xs text-[#0F2F4E]/70 mt-1">Maize, tobacco, cotton, etc.</div>
                    </div>
                    <div className="p-3 bg-[#0F2F4E]/5 rounded-xl border border-[#EEEEEE]">
                      <div className="font-semibold text-[#1ED760] text-sm">Livestock</div>
                      <div className="text-xs text-[#0F2F4E]/70 mt-1">Cattle, poultry, dairy, etc.</div>
                    </div>
                    <div className="p-3 bg-[#0F2F4E]/5 rounded-xl border border-[#EEEEEE]">
                      <div className="font-semibold text-[#1ED760] text-sm">Horticulture</div>
                      <div className="text-xs text-[#0F2F4E]/70 mt-1">Fruits, vegetables, flowers</div>
                    </div>
                    <div className="p-3 bg-[#0F2F4E]/5 rounded-xl border border-[#EEEEEE]">
                      <div className="font-semibold text-[#1ED760] text-sm">Forestry</div>
                      <div className="text-xs text-[#0F2F4E]/70 mt-1">Timber, wood products</div>
                    </div>
                  </div>
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
                      <span className="text-[#0F2F4E]">Agricultural Value:</span>
                      <span className="text-[#0F2F4E] font-semibold">
                        ${(results.agriculturalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Effective Tax Rate:</span>
                      <span className="text-[#1ED760] font-semibold">
                        {results.taxRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Agriculture Tax:</span>
                      <span className="text-[#1ED760] font-bold">
                        ${(results.taxDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#EEEEEE] pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-[#0F2F4E] font-semibold">Net Amount:</span>
                        <span className="text-[#0F2F4E] font-bold text-xl">
                          ${(results.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Agriculture Tax Information */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Agriculture Tax Info
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Tax Type:</span>
                  <span className="text-[#1ED760] font-semibold">Income-based</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Frequency:</span>
                  <span className="text-[#0F2F4E]/70">Annual</span>
                </div>
                <div className="flex justify-between">
                  <span>Threshold:</span>
                  <span className="text-[#0F2F4E]/70">Varies by activity</span>
                </div>
                <div className="flex justify-between">
                  <span>Deductions:</span>
                  <span className="text-[#0F2F4E]/70">Production costs</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Agriculture Tax Tips
              </h3>
              <ul className="space-y-3 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Keep detailed records of all farming expenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Deductible costs include seeds, fertilizers, and labor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>File annual tax returns for agricultural income</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Consult with agricultural tax specialists</span>
                </li>
              </ul>
            </div>

            {/* Eligible Deductions */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Trees className="w-4 h-4 text-[#1ED760]" />
                <h3 className="text-lg font-bold text-[#0F2F4E]">
                  Common Deductions
                </h3>
              </div>
              <div className="text-sm text-[#0F2F4E] space-y-3">
                <p className="text-[#0F2F4E]/80">Typical deductible expenses:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Seeds and planting materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Fertilizers and pesticides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Livestock feed and veterinary costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Farm labor wages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Equipment maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Irrigation and water costs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Incentives */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Agricultural Incentives
              </h3>
              <ul className="space-y-2 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Special rates for small-scale farmers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Accelerated depreciation on farm equipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Tax holidays for new agricultural ventures</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Export incentives for agricultural products</span>
                </li>
              </ul>
            </div>

            {/* Filing Requirements */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Filing Requirements
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Filing Deadline:</span>
                  <span className="text-[#0F2F4E]/70">4 months after year-end</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Deadline:</span>
                  <span className="text-[#0F2F4E]/70">With filing</span>
                </div>
                <div className="flex justify-between">
                  <span>Required Forms:</span>
                  <span className="text-[#0F2F4E]/70">ITF 12, ITF 16</span>
                </div>
                <div className="flex justify-between">
                  <span>Record Keeping:</span>
                  <span className="text-[#0F2F4E]/70">7 years</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AgricultureTax