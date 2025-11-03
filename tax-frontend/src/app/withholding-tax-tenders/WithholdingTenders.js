'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Receipt, DollarSign, ArrowRight, AlertCircle, Gavel, Percent, Zap, Building2 } from 'lucide-react'

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

const WithholdingTenders = () => {
  const [formData, setFormData] = useState({
    value: '',
    rate: '15' // Default tender withholding rate
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tenderRates = [
    { value: '15', label: 'Standard Rate (15%)', description: 'Most tender contracts' },
    { value: '10', label: 'Reduced Rate (10%)', description: 'Specific categories' },
    { value: '5', label: 'Preferential Rate (5%)', description: 'Small enterprises' },
    { value: '0', label: 'Exempt (0%)', description: 'Government entities' }
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
        // Rate is fetched dynamically from backend based on 'Withholding_Tenders'
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/withholding/tenders`,
        payload
      )
      
      setResults({
        taxDue: response.data.taxDue,
        tenderAmount: payload.value,
        appliedRate: (response.data.taxDue / payload.value) * 100,
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
      rate: '15'
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
              <Gavel className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-lime-400">
              Tender Withholding Tax
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate withholding tax on tender awards and government contracts. Applicable to payments made to contractors and suppliers.
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
                  Tender Tax Calculation
                </h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Tender Amount Input */}
                <InputField
                  label="Tender Amount"
                  icon={DollarSign}
                  value={formData.value}
                  onChange={handleChange('value')}
                  placeholder="Enter tender contract amount"
                />

                {/* Rate Information */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Applicable Withholding Rates
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tenderRates.map((rateOption) => (
                      <div
                        key={rateOption.value}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                          formData.rate === rateOption.value
                            ? 'bg-lime-400/20 border border-lime-400/30'
                            : 'bg-gray-700/30 border border-gray-600/30'
                        }`}
                      >
                        <div className="font-semibold mb-1 text-lime-400">{rateOption.label}</div>
                        <div className="text-xs text-gray-400">{rateOption.description}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    * The actual rate applied is dynamically determined by ZIMRA based on contractor category and contract type
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
                      <span className="text-gray-300">Tender Amount:</span>
                      <span className="text-white font-semibold">
                        ${(results.tenderAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Applied Rate:</span>
                      <span className="text-lime-400 font-semibold">
                        {results.appliedRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Withholding Tax:</span>
                      <span className="text-lime-400 font-bold">
                        ${(results.taxDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-300 font-semibold">Net Payment:</span>
                        <span className="text-white font-bold text-xl">
                          ${(results.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tender Tax Information */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                Tender Withholding Tax
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Standard Rate:</span>
                  <span className="text-lime-400 font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Reduced Rate:</span>
                  <span className="text-gray-400">5-10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Deadline:</span>
                  <span className="text-gray-400">14 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable To:</span>
                  <span className="text-gray-400">Government tenders</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-lime-400 mb-4">
                Tender Tax Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Applies to all government and local authority tenders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Reduced rates for small and medium enterprises</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Tax must be withheld by the contracting authority</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>File returns within 14 days of payment</span>
                </li>
              </ul>
            </div>

            {/* Applicable Tenders */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-lime-400" />
                <h3 className="text-lg font-bold text-lime-400">
                  Applicable Tenders
                </h3>
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Withholding tax applies to:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <span>• Government department contracts</span>
                  <span>• Local authority tenders</span>
                  <span>• State-owned enterprise contracts</span>
                  <span>• Parastatal procurement</span>
                  <span>• Municipal service contracts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WithholdingTenders