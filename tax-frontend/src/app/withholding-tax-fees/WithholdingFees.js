'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, CreditCard, Percent, Zap, Building } from 'lucide-react'

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

const WithholdingFees = () => {
  const [formData, setFormData] = useState({
    value: '',
    dtaRate: '15' // Default 15%
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const commonDTARates = [
    { value: '15', label: 'Standard Rate (15%)', description: 'Most professional fees' },
    { value: '10', label: 'Reduced Rate (10%)', description: 'Specific treaty countries' },
    { value: '5', label: 'Preferential Rate (5%)', description: 'Special agreements' }
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
        value: parseFloat(formData.value) || 0,
        dtaRate: parseFloat(formData.dtaRate) / 100 // Convert percentage to decimal
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/withholding/fees`,
        payload
      )
      
      setResults({
        taxDue: response.data.taxDue,
        feeAmount: payload.value,
        dtaRate: parseFloat(formData.dtaRate),
        taxRate: payload.dtaRate * 100,
        netAmount: payload.value - response.data.taxDue
      })
    } catch (err) {
      setError('Failed to calculate withholding tax. Please check your inputs and try again.')
      console.error('Calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetCalculator = () => {
    setFormData({
      value: '',
      dtaRate: '15'
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
                <CreditCard className="w-8 h-8 text-[#1ED760]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                Fees Withholding Tax
              </h1>
            </div>
            <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
              Calculate withholding tax on professional fees, consultancy fees, and other service payments to non-residents.
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
                  Fees Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Fee Amount Input */}
                <InputField
                  label="Fee Amount"
                  icon={DollarSign}
                  value={formData.value}
                  onChange={handleChange('value')}
                  placeholder="Enter fee amount"
                />

                {/* DTA Rate Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    DTA Withholding Rate
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {commonDTARates.map((rateOption) => (
                      <button
                        key={rateOption.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, dtaRate: rateOption.value }))}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 text-left border ${
                          formData.dtaRate === rateOption.value
                            ? 'bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25 border-[#1ED760]'
                            : 'bg-white text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border-[#EEEEEE]'
                        }`}
                      >
                        <div className="font-semibold mb-1">{rateOption.label}</div>
                        <div className="text-xs opacity-80">{rateOption.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Rate Input */}
                {!commonDTARates.find(r => r.value === formData.dtaRate) && (
                  <InputField
                    label="Custom DTA Rate (%)"
                    icon={Percent}
                    value={formData.dtaRate}
                    onChange={handleChange('dtaRate')}
                    placeholder="Enter custom DTA rate"
                    step="0.1"
                  />
                )}

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
                      <span className="text-[#0F2F4E]">Fee Amount:</span>
                      <span className="text-[#0F2F4E] font-semibold">
                        ${(results.feeAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">DTA Rate:</span>
                      <span className="text-[#1ED760] font-semibold">
                        {results.dtaRate}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Withholding Tax:</span>
                      <span className="text-[#1ED760] font-bold">
                        ${(results.taxDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#EEEEEE] pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-[#0F2F4E] font-semibold">Net Payment:</span>
                        <span className="text-[#0F2F4E] font-bold text-xl">
                          ${(results.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Withholding Tax Information */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Fees Withholding Tax
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Standard Rate:</span>
                  <span className="text-[#1ED760] font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable To:</span>
                  <span className="text-[#0F2F4E]/70">Professional fees</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Deadline:</span>
                  <span className="text-[#0F2F4E]/70">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Deadline:</span>
                  <span className="text-[#0F2F4E]/70">10th of following month</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Fees Tax Tips
              </h3>
              <ul className="space-y-3 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Applies to management, consultancy, and professional fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Check Double Taxation Agreement for reduced rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Withhold tax when paying non-resident service providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>File returns by the 10th of following month</span>
                </li>
              </ul>
            </div>

            {/* Applicable Fees Types */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-[#1ED760]" />
                <h3 className="text-lg font-bold text-[#0F2F4E]">
                  Applicable Fees
                </h3>
              </div>
              <div className="text-sm text-[#0F2F4E] space-y-3">
                <p className="text-[#0F2F4E]/80">Withholding tax applies to:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Management and consultancy fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Professional service fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Technical service fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Advisory and consulting fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Commission payments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Requirements */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Compliance Requirements
              </h3>
              <ul className="space-y-2 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Obtain Tax Clearance Certificate for non-residents</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Submit withholding tax return (Form ITF 263)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Pay tax due within 30 days of payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Maintain service agreements and invoices</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WithholdingFees