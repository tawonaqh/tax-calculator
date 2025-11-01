'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, Percent, DollarSign, ArrowRight, AlertCircle, Building, Zap } from 'lucide-react'

// Move InputField component OUTSIDE to prevent recreation
const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = 'number' }) => (
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

const VATTaxableSupplies = () => {
  const [formData, setFormData] = useState({
    amount: '',
    rate: '14.5' // Zimbabwe VAT rate
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const vatRates = [
    { value: '14.5', label: 'Standard Rate (14.5%)', description: 'Most goods and services' },
    { value: '0', label: 'Zero Rate (0%)', description: 'Exports, basic food items' },
    { value: 'exempt', label: 'Exempt', description: 'Financial services, medical' }
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
        amount: parseFloat(formData.amount) || 0,
        rate: formData.rate === 'exempt' ? 0 : parseFloat(formData.rate) || 0
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/vat/taxable-supplies`,
        payload
      )
      
      setResults({
        vat: response.data.vat,
        netAmount: payload.amount - response.data.vat,
        grossAmount: payload.amount,
        rate: payload.rate,
        rateType: vatRates.find(r => r.value === formData.rate)?.label || 'Custom Rate'
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
      amount: '',
      rate: '14.5'
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
              <Receipt className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-lime-400">
              VAT Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate Value Added Tax on taxable supplies with current Zimbabwean VAT rates. 
            Perfect for businesses and tax professionals.
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
                  VAT Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Amount Input */}
                <InputField
                  label="Amount"
                  icon={DollarSign}
                  value={formData.amount}
                  onChange={handleChange('amount')}
                  placeholder="Enter taxable amount"
                />

                {/* VAT Rate Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    VAT Rate
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {vatRates.map((rateOption) => (
                      <button
                        key={rateOption.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rate: rateOption.value }))}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                          formData.rate === rateOption.value
                            ? 'bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/25'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold mb-1">{rateOption.label}</div>
                        <div className="text-xs opacity-80">{rateOption.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Rate Input */}
                {!vatRates.find(r => r.value === formData.rate) && (
                  <InputField
                    label="Custom VAT Rate (%)"
                    icon={Percent}
                    value={formData.rate}
                    onChange={handleChange('rate')}
                    placeholder="Enter custom VAT rate"
                  />
                )}

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.amount}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 
                               flex items-center justify-center gap-3 shadow-lg
                               ${loading || !formData.amount
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
                        Calculate VAT
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
                    VAT Calculation Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Gross Amount:</span>
                      <span className="text-white font-semibold">
                        ${(results.grossAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">VAT Rate:</span>
                      <span className="text-lime-400 font-semibold">
                        {results.rateType}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">VAT Amount:</span>
                      <span className="text-lime-400 font-bold">
                        ${(results.vat || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

            {/* VAT Information */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                VAT Information
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Standard Rate:</span>
                  <span className="text-lime-400 font-semibold">14.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Registration Threshold:</span>
                  <span className="text-gray-400">$60,000/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Frequency:</span>
                  <span className="text-gray-400">Monthly</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                VAT Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Register for VAT if turnover exceeds $60,000 annually</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Keep VAT invoices for all business purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>File VAT returns by the 25th of each month</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VATTaxableSupplies