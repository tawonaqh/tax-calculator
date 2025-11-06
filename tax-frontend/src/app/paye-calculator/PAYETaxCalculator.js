'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

// Move InputField component OUTSIDE to prevent recreation
const InputField = ({ label, value, onChange, placeholder, type = "number", required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#0F2F4E]">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                 placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                 focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
    />
  </div>
)

const PAYETaxCalculator = () => {
  const [formState, setFormState] = useState({
    currentSalary: '',
    currentBonus: '',
    irregularCommission: '',
    otherIrregularEarnings: '',
    exemptions: '',
    housingBenefit: '',
    vehicleBenefit: '',
    educationBenefit: '',
    nonTaxableEarnings: '',
    pensionContributions: '',
    nssaContributions: '',
    totalDeductions: '',
    medicalContributions: '',
    medicalExpenses: '',
    credits: '',
    aidsLevy: ''
  })

  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('income')

  const handleChange = (field) => (e) => {
    setFormState(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleCalculate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const payload = Object.fromEntries(
        Object.entries(formState).map(([key, value]) => [key, parseFloat(value) || 0])
      )

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/paye`,
        payload
      )
      setResults(response.data)
    } catch (err) {
      setError('Failed to calculate PAYE tax. Please check your inputs and try again.')
      console.error('PAYE Calculation Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormState({
      currentSalary: '',
      currentBonus: '',
      irregularCommission: '',
      otherIrregularEarnings: '',
      exemptions: '',
      housingBenefit: '',
      vehicleBenefit: '',
      educationBenefit: '',
      nonTaxableEarnings: '',
      pensionContributions: '',
      nssaContributions: '',
      totalDeductions: '',
      medicalContributions: '',
      medicalExpenses: '',
      credits: '',
      aidsLevy: ''
    })
    setResults(null)
    setError('')
  }

  const SectionButton = ({ id, label, icon }) => (
    <motion.button
      type="button"
      onClick={() => setActiveSection(id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeSection === id
          ? 'bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25'
          : 'bg-white text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </motion.button>
  )

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E] mt-4 mb-4">
              PAYE Tax Calculator
            </h1>
            <p className="text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto">
              Comprehensive PAYE calculation for Zimbabwe - Calculate your tax liability with detailed breakdowns
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-xl">
              {/* Fixed Calculate Button */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F2F4E]">Ready to Calculate?</h3>
                    <p className="text-sm text-[#0F2F4E]/70 mt-1">
                      Fill in your employment details across all sections, then calculate your PAYE
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleCalculate}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                      className="px-6 py-3 bg-[#1ED760] text-white font-semibold rounded-lg 
                               hover:bg-[#1ED760]/90 transition disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          💰 Calculate PAYE
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white text-[#0F2F4E] font-semibold rounded-lg 
                               hover:bg-[#0F2F4E]/5 transition border border-[#EEEEEE] shadow-sm"
                    >
                      🔄 Reset
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <SectionButton id="income" label="Income" icon="💰" />
                <SectionButton id="benefits" label="Benefits" icon="🏠" />
                <SectionButton id="deductions" label="Deductions" icon="📊" />
                <SectionButton id="credits" label="Credits" icon="🎫" />
              </div>

              {/* Forms */}
              <form onSubmit={handleCalculate}>
                {/* Income Section */}
                {activeSection === 'income' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Current Salary, Wages, Fees"
                        value={formState.currentSalary}
                        onChange={handleChange('currentSalary')}
                        placeholder="Enter gross salary"
                        required
                      />
                      <InputField
                        label="Current Bonus"
                        value={formState.currentBonus}
                        onChange={handleChange('currentBonus')}
                        placeholder="Bonus amount"
                      />
                      <InputField
                        label="Irregular Commission"
                        value={formState.irregularCommission}
                        onChange={handleChange('irregularCommission')}
                        placeholder="Commission earnings"
                      />
                      <InputField
                        label="Other Irregular Earnings"
                        value={formState.otherIrregularEarnings}
                        onChange={handleChange('otherIrregularEarnings')}
                        placeholder="Other irregular income"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Benefits Section */}
                {activeSection === 'benefits' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Exemptions"
                        value={formState.exemptions}
                        onChange={handleChange('exemptions')}
                        placeholder="Tax exemptions"
                      />
                      <InputField
                        label="Housing Benefit"
                        value={formState.housingBenefit}
                        onChange={handleChange('housingBenefit')}
                        placeholder="Housing allowance"
                      />
                      <InputField
                        label="Vehicle Benefit"
                        value={formState.vehicleBenefit}
                        onChange={handleChange('vehicleBenefit')}
                        placeholder="Company vehicle value"
                      />
                      <InputField
                        label="Education Benefit"
                        value={formState.educationBenefit}
                        onChange={handleChange('educationBenefit')}
                        placeholder="Education allowance"
                      />
                      <InputField
                        label="Non-Taxable Earnings"
                        value={formState.nonTaxableEarnings}
                        onChange={handleChange('nonTaxableEarnings')}
                        placeholder="Non-taxable income"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Deductions Section */}
                {activeSection === 'deductions' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Pension Contributions"
                        value={formState.pensionContributions}
                        onChange={handleChange('pensionContributions')}
                        placeholder="Pension fund contributions"
                      />
                      <InputField
                        label="NSSA Contributions"
                        value={formState.nssaContributions}
                        onChange={handleChange('nssaContributions')}
                        placeholder="NSSA contributions"
                      />
                      <InputField
                        label="Total Deductions"
                        value={formState.totalDeductions}
                        onChange={handleChange('totalDeductions')}
                        placeholder="Other deductions"
                      />
                      <InputField
                        label="Medical Contributions"
                        value={formState.medicalContributions}
                        onChange={handleChange('medicalContributions')}
                        placeholder="Medical aid contributions"
                      />
                      <InputField
                        label="Medical Expenses"
                        value={formState.medicalExpenses}
                        onChange={handleChange('medicalExpenses')}
                        placeholder="Out-of-pocket medical"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Credits Section */}
                {activeSection === 'credits' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Tax Credits"
                        value={formState.credits}
                        onChange={handleChange('credits')}
                        placeholder="Tax credit amount"
                      />
                      <InputField
                        label="AIDS Levy"
                        value={formState.aidsLevy}
                        onChange={handleChange('aidsLevy')}
                        placeholder="AIDS levy amount"
                      />
                    </div>
                  </motion.div>
                )}
              </form>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-700 text-center">{error}</p>
                </motion.div>
              )}

              {/* Results Display */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-white rounded-xl border border-[#1ED760]/30 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-[#0F2F4E] mb-6 text-center">
                    PAYE Calculation Results
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">Taxable Income</div>
                      <div className="text-[#1ED760] font-bold text-xl">
                        ${(results.taxableIncome || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">PAYE Due</div>
                      <div className="text-[#1ED760] font-bold text-xl">
                        ${(results.payeDue || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">AIDS Levy</div>
                      <div className="text-[#FFD700] font-bold text-xl">
                        ${(results.aidsLevy || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">Total Tax</div>
                      <div className="text-[#0F2F4E] font-bold text-xl">
                        ${(results.totalTax || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-[#0F2F4E]/5 p-4 rounded-lg border border-[#EEEEEE]">
                    <h4 className="text-lg font-semibold text-[#0F2F4E] mb-3">Calculation Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-[#0F2F4E]">
                        <span>Gross Income:</span>
                        <span>${((parseFloat(formState.currentSalary) || 0) + (parseFloat(formState.currentBonus) || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[#0F2F4E]">
                        <span>Total Benefits:</span>
                        <span>${((parseFloat(formState.housingBenefit) || 0) + (parseFloat(formState.vehicleBenefit) || 0) + (parseFloat(formState.educationBenefit) || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[#0F2F4E]">
                        <span>Total Deductions:</span>
                        <span>${((parseFloat(formState.pensionContributions) || 0) + (parseFloat(formState.nssaContributions) || 0) + (parseFloat(formState.medicalContributions) || 0)).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-[#EEEEEE] pt-2 mt-2">
                        <div className="flex justify-between text-[#1ED760] font-semibold">
                          <span>Net Taxable Income:</span>
                          <span>${(results.taxableIncome || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">PAYE Guide</h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]/80">
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">•</span>
                  <span>Salary includes basic pay, allowances, and bonuses</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">•</span>
                  <span>Benefits like housing and vehicles are taxable</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">•</span>
                  <span>Pension and NSSA contributions are deductible</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">•</span>
                  <span>AIDS Levy is 3% of tax due</span>
                </div>
              </div>
            </div>

            {/* Tax Tips */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Tax Saving Tips</h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]/80">
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">💡</span>
                  <span>Maximize pension contributions for tax deductions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">💡</span>
                  <span>Keep records of all medical expenses</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">💡</span>
                  <span>Claim all eligible tax credits</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1ED760] mt-1">💡</span>
                  <span>Understand your benefit valuations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PAYETaxCalculator