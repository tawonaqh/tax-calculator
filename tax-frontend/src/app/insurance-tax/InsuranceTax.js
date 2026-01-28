'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, Shield, Zap, FileText } from 'lucide-react'

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

const InsuranceTax = () => {
  const [formData, setFormData] = useState({
    value: ''
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const insuranceTypes = [
    { type: 'Premium Tax', rate: '5%', description: 'On insurance premiums' },
    { type: 'Commission Tax', rate: '15%', description: 'On broker commissions' },
    { type: 'Corporate Tax', rate: '24.72%', description: 'On insurance company profits' }
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/insurance`,
        payload
      )
      
      setResults({
        taxDue: response.data.taxDue,
        insuranceValue: payload.value,
        netAmount: payload.value - response.data.taxDue,
        taxRate: (response.data.taxDue / payload.value) * 100
      })
    } catch (err) {
      setError('Failed to calculate insurance tax. Please check your inputs and try again.')
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
                <Shield className="w-8 h-8 text-[#1ED760]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                Insurance Tax
              </h1>
            </div>
            <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
              Calculate insurance premium tax and other insurance-related taxes. Estimate tax obligations for insurance companies, brokers, and policyholders in Zimbabwe.
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
                  Insurance Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Insurance Value Input */}
                <InputField
                  label="Insurance Premium/Value"
                  icon={DollarSign}
                  value={formData.value}
                  onChange={handleChange('value')}
                  placeholder="Enter insurance premium or related value"
                />

                {/* Insurance Tax Types */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    Insurance Tax Types
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {insuranceTypes.map((insurance, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#0F2F4E]/5 rounded-xl border border-[#EEEEEE]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-[#1ED760] text-sm">
                              {insurance.type}
                            </div>
                            <div className="text-xs text-[#0F2F4E]/70 mt-1">
                              {insurance.description}
                            </div>
                          </div>
                          <div className="text-[#1ED760] font-bold text-sm">
                            {insurance.rate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#0F2F4E]/60 mt-2">
                    * The actual rate applied is determined by the specific insurance transaction type
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
                    Tax Calculation Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Insurance Value:</span>
                      <span className="text-[#0F2F4E] font-semibold">
                        ${(results.insuranceValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Applied Rate:</span>
                      <span className="text-[#1ED760] font-semibold">
                        {results.taxRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F2F4E]">Insurance Tax:</span>
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

            {/* Insurance Tax Information */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Insurance Tax Info
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between">
                  <span>Premium Tax Rate:</span>
                  <span className="text-[#1ED760] font-semibold">5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission Tax:</span>
                  <span className="text-[#0F2F4E]/70">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Frequency:</span>
                  <span className="text-[#0F2F4E]/70">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Deadline:</span>
                  <span className="text-[#0F2F4E]/70">25th each month</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Insurance Tax Tips
              </h3>
              <ul className="space-y-3 text-sm text-[#0F2F4E]">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Premium tax applies to most insurance policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Commission tax withheld from broker payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>File monthly insurance tax returns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#1ED760] mt-0.5 flex-shrink-0" />
                  <span>Maintain detailed policy and commission records</span>
                </li>
              </ul>
            </div>

            {/* Insurance Categories */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#1ED760]" />
                <h3 className="text-lg font-bold text-[#0F2F4E]">
                  Insurance Types
                </h3>
              </div>
              <div className="text-sm text-[#0F2F4E] space-y-3">
                <p className="text-[#0F2F4E]/80">Tax applies to various insurance types:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Life insurance policies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Motor vehicle insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Property insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Health insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Travel insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full flex-shrink-0"></div>
                    <span>Business insurance</span>
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
                  <span>Register with Insurance and Pensions Commission (IPEC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Submit monthly premium tax returns</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Withhold commission tax from broker payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1ED760] rounded-full mt-1.5 flex-shrink-0" />
                  <span>Maintain policy records for 7 years</span>
                </li>
              </ul>
            </div>

            {/* Tax Rates Breakdown */}
            <div className="bg-white rounded-2xl border border-[#FFD700] p-6 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">
                Tax Rates Breakdown
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]">
                <div className="flex justify-between items-center">
                  <span>Insurance Premiums:</span>
                  <span className="text-[#1ED760] font-semibold">5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Broker Commissions:</span>
                  <span className="text-[#1ED760] font-semibold">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Corporate Profits:</span>
                  <span className="text-[#1ED760] font-semibold">24.72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reinsurance Premiums:</span>
                  <span className="text-[#0F2F4E]/70">2.5%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default InsuranceTax