'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calculator } from 'lucide-react'

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
  const [calculatorType, setCalculatorType] = useState('individual') // 'individual' or 'business'
  const [businessType, setBusinessType] = useState('private') // private, pvo, ngo, etc.
  const [periodType, setPeriodType] = useState('monthly') // monthly, quarterly, annually
  const [projectionYears, setProjectionYears] = useState(1)
  
  const [formState, setFormState] = useState({
    // Individual fields
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
    aidsLevy: '',
    
    // Business fields
    employeeCount: '',
    totalGrossPayroll: '',
    averageSalary: '',
    annualSalaryIncrease: '10',
    expectedBonuses: '15',
    employerContributions: '',
    nssaEmployerRate: '4.5',
    pensionEmployerRate: '5',
    benefitsPercentage: '20',
  })

  const [results, setResults] = useState(null)
  const [multiPeriodResults, setMultiPeriodResults] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('income')
  const [activeView, setActiveView] = useState('calculator') // 'calculator', 'projection', 'comparison'

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
      // Create payload based on calculator type
      let payload = {
        calculatorType,
        businessType: calculatorType === 'business' ? businessType : null,
        periodType,
        projectionYears: calculatorType === 'business' ? projectionYears : 1,
      }

      // Only include relevant fields based on calculator type
      if (calculatorType === 'individual') {
        // Individual fields
        const individualFields = [
          'currentSalary', 'currentBonus', 'irregularCommission', 'otherIrregularEarnings',
          'exemptions', 'housingBenefit', 'vehicleBenefit', 'educationBenefit',
          'nonTaxableEarnings', 'pensionContributions', 'nssaContributions',
          'totalDeductions', 'medicalContributions', 'medicalExpenses',
          'credits', 'aidsLevy'
        ];
        
        individualFields.forEach(field => {
          payload[field] = parseFloat(formState[field]) || 0;
        });
        
        // For individual, set business fields to 0
        payload.employeeCount = 0;
        payload.totalGrossPayroll = 0;
        payload.averageSalary = 0;
        payload.annualSalaryIncrease = 0;
        payload.expectedBonuses = 0;
        payload.employerContributions = 0;
        payload.nssaEmployerRate = 0;
        payload.pensionEmployerRate = 0;
        payload.benefitsPercentage = 0;
        
      } else {
        // Business fields
        const businessFields = [
          'employeeCount', 'totalGrossPayroll', 'averageSalary',
          'annualSalaryIncrease', 'expectedBonuses', 'employerContributions',
          'nssaEmployerRate', 'pensionEmployerRate', 'benefitsPercentage'
        ];
        
        businessFields.forEach(field => {
          payload[field] = parseFloat(formState[field]) || 0;
        });
        
        // For business, set individual fields to 0
        payload.currentSalary = 0;
        payload.currentBonus = 0;
        payload.irregularCommission = 0;
        payload.otherIrregularEarnings = 0;
        payload.exemptions = 0;
        payload.housingBenefit = 0;
        payload.vehicleBenefit = 0;
        payload.educationBenefit = 0;
        payload.nonTaxableEarnings = 0;
        payload.pensionContributions = 0;
        payload.nssaContributions = 0;
        payload.totalDeductions = 0;
        payload.medicalContributions = 0;
        payload.medicalExpenses = 0;
        payload.credits = 0;
        payload.aidsLevy = 0;
      }

      console.log('Sending payload:', payload); // Debug log
      
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate/paye`
      const response = await axios.post(endpoint, payload)
      
      console.log('Received response:', response.data) // Debug log
      
      // Handle business and individual responses differently
      if (calculatorType === 'business') {
        console.log('Business currentPeriod:', response.data.currentPeriod) // Debug
        setResults(response.data.currentPeriod) // Use currentPeriod for business
        setMultiPeriodResults(response.data.multiPeriod || null)
        setActiveView(projectionYears > 1 ? 'projection' : 'calculator')
      } else {
        // Individual calculation
        console.log('Individual results:', response.data) // Debug
        setResults(response.data)
        setMultiPeriodResults(null)
        setActiveView('calculator')
      }
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
      aidsLevy: '',
      employeeCount: '',
      totalGrossPayroll: '',
      averageSalary: '',
      annualSalaryIncrease: '10',
      expectedBonuses: '15',
      employerContributions: '',
      nssaEmployerRate: '4.5',
      pensionEmployerRate: '5',
      benefitsPercentage: '20',
    })
    setResults(null)
    setMultiPeriodResults(null)
    setError('')
    setActiveView('calculator')
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

  const ViewButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveView(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        activeView === id
          ? 'bg-[#0F2F4E] text-white'
          : 'bg-white text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E] mt-4 mb-4">
              {calculatorType === 'individual' ? 'Employee PAYE Calculator' : 'Business PAYE Planning Module'}
            </h1>
            <p className="text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto">
              {calculatorType === 'individual' 
                ? 'Comprehensive PAYE calculation for individuals in Zimbabwe'
                : 'Multi-period payroll tax planning for businesses in Zimbabwe'
              }
            </p>
          </div>
        </motion.div>

        {/* Calculator Type Selection */}
        <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                Calculator Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCalculatorType('individual')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    calculatorType === 'individual'
                      ? 'bg-[#1ED760] text-white shadow-lg'
                      : 'bg-gray-100 text-[#0F2F4E] hover:bg-gray-200'
                  }`}
                >
                  👤 Individual Employee
                </button>
                <button
                  type="button"
                  onClick={() => setCalculatorType('business')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    calculatorType === 'business'
                      ? 'bg-[#1ED760] text-white shadow-lg'
                      : 'bg-gray-100 text-[#0F2F4E] hover:bg-gray-200'
                  }`}
                >
                  🏢 Business/Employer
                </button>
              </div>
            </div>

            {calculatorType === 'business' && (
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                           focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none"
                >
                  <option value="private">Private Company</option>
                  <option value="pvo">PVO (Private Voluntary)</option>
                  <option value="ngo">NGO (Non-Governmental)</option>
                  <option value="public">Public Institution</option>
                  <option value="sole">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="trust">Trust</option>
                </select>
              </div>
            )}
          </div>

          {calculatorType === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                  Projection Period
                </label>
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                           focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                  Projection Years
                </label>
                <select
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(parseInt(e.target.value))}
                  className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                           focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none"
                >
                  {[1, 2, 3, 4, 5].map(year => (
                    <option key={year} value={year}>{year} Year{year > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                  View Results
                </label>
                <div className="flex space-x-2">
                  <ViewButton id="calculator" label="Current Period" />
                  {projectionYears > 1 && <ViewButton id="projection" label="Multi-Period" />}
                  <ViewButton id="comparison" label="Scenario Compare" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-xl">
              {/* Fixed Calculate Button */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F2F4E]">
                      {calculatorType === 'individual' 
                        ? 'Ready to Calculate Your PAYE?' 
                        : 'Ready to Calculate Business PAYE?'
                      }
                    </h3>
                    <p className="text-sm text-[#0F2F4E]/70 mt-1">
                      {calculatorType === 'individual'
                        ? 'Fill in your employment details across all sections'
                        : `Configure your payroll for ${projectionYears} year${projectionYears > 1 ? 's' : ''} projection`
                      }
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
                          💰 {calculatorType === 'individual' ? 'Calculate My PAYE' : 'Calculate Business PAYE'}
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
                    {calculatorType === 'individual' ? (
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
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Number of Employees"
                          value={formState.employeeCount}
                          onChange={handleChange('employeeCount')}
                          placeholder="Total employees"
                          required
                        />
                        <InputField
                          label="Total Gross Payroll"
                          value={formState.totalGrossPayroll}
                          onChange={handleChange('totalGrossPayroll')}
                          placeholder="Total payroll amount"
                          required
                        />
                        <InputField
                          label="Average Salary per Employee"
                          value={formState.averageSalary}
                          onChange={handleChange('averageSalary')}
                          placeholder="Average monthly salary"
                        />
                        <InputField
                          label="Annual Salary Increase (%)"
                          value={formState.annualSalaryIncrease}
                          onChange={handleChange('annualSalaryIncrease')}
                          placeholder="e.g., 10 for 10%"
                          type="text"
                        />
                        <InputField
                          label="Expected Bonuses (%)"
                          value={formState.expectedBonuses}
                          onChange={handleChange('expectedBonuses')}
                          placeholder="e.g., 15 for 15%"
                          type="text"
                        />
                        <InputField
                          label="Other Employer Contributions"
                          value={formState.employerContributions}
                          onChange={handleChange('employerContributions')}
                          placeholder="Additional contributions"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Benefits Section */}
                {activeSection === 'benefits' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {calculatorType === 'individual' ? (
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
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Benefits as % of Salary"
                          value={formState.benefitsPercentage}
                          onChange={handleChange('benefitsPercentage')}
                          placeholder="e.g., 20 for 20%"
                          type="text"
                        />
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2">Business Benefits Include:</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Housing allowances</li>
                            <li>• Company vehicles</li>
                            <li>• Education allowances</li>
                            <li>• Medical aid employer portion</li>
                            <li>• Other fringe benefits</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Deductions Section */}
                {activeSection === 'deductions' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {calculatorType === 'individual' ? (
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
                          label="Other Deductions"
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
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="NSSA Employer Rate (%)"
                          value={formState.nssaEmployerRate}
                          onChange={handleChange('nssaEmployerRate')}
                          placeholder="e.g., 4.5 for 4.5%"
                          type="text"
                        />
                        <InputField
                          label="Pension Employer Rate (%)"
                          value={formState.pensionEmployerRate}
                          onChange={handleChange('pensionEmployerRate')}
                          placeholder="e.g., 5 for 5%"
                          type="text"
                        />
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-800 mb-2">Employer Deductions Include:</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• NSSA employer contributions</li>
                            <li>• Pension fund employer contributions</li>
                            <li>• Medical aid employer contributions</li>
                            <li>• Other statutory deductions</li>
                          </ul>
                        </div>
                      </div>
                    )}
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

              {/* Current Period Results Display */}
              {results && activeView === 'calculator' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-white rounded-xl border border-[#1ED760]/30 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-[#0F2F4E] mb-6 text-center">
                    {calculatorType === 'individual' ? 'PAYE Calculation Results' : 'Business PAYE Summary'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {calculatorType === 'individual' ? (
                      <>
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
                          <div className="text-[#0F2F4E]/70 text-sm mb-1">Medical Credit</div>
                          <div className="text-[#FFD700] font-bold text-xl">
                            ${(results.medicalCredit || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                          <div className="text-[#0F2F4E]/70 text-sm mb-1">Total Tax</div>
                          <div className="text-[#0F2F4E] font-bold text-xl">
                            ${(results.totalTax || 0).toLocaleString()}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                          <div className="text-[#0F2F4E]/70 text-sm mb-1">Total PAYE</div>
                          <div className="text-[#1ED760] font-bold text-xl">
                            ${(results.totalTax || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                          <div className="text-[#0F2F4E]/70 text-sm mb-1">Total Statutory Cost</div>
                          <div className="text-[#1ED760] font-bold text-xl">
                            ${(results.totalStatutoryCost || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                          <div className="text-[#0F2F4E]/70 text-sm mb-1">Tax as % of Payroll</div>
                          <div className="text-[#FFD700] font-bold text-xl">
                            {((results.taxPercentage || 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                          <div className="text-[#0F2F4E]/70 text-sm mb-1">Employee Count</div>
                          <div className="text-[#0F2F4E] font-bold text-xl">
                            {(results.employeeCount || 0).toLocaleString()}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-[#0F2F4E]/5 p-4 rounded-lg border border-[#EEEEEE]">
                    <h4 className="text-lg font-semibold text-[#0F2F4E] mb-3">
                      {calculatorType === 'individual' ? 'Zimbabwe-Specific Breakdown' : 'Statutory Cost Breakdown'}
                    </h4>
                    {calculatorType === 'individual' ? (
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
                          <span>NSSA (Capped at $700):</span>
                          <span>${(results.nssaCapped || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#0F2F4E]">
                          <span>Medical Credit (50%):</span>
                          <span className="text-green-600">-${(results.medicalCredit || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#0F2F4E]">
                          <span>AIDS Levy (3%):</span>
                          <span>${(results.aidsLevy || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-[#EEEEEE] pt-2 mt-2">
                          <div className="flex justify-between text-[#1ED760] font-semibold">
                            <span>Net Tax Payable:</span>
                            <span>${(results.totalTax || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[#0F2F4E]">
                          <span>ZIMDEF (1%):</span>
                          <span>${(results.zimdef || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#0F2F4E]">
                          <span>SDF (0.5%):</span>
                          <span>${(results.sdf || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#0F2F4E]">
                          <span>NSSA Employer (Capped):</span>
                          <span>${(results.nssaContributions || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#0F2F4E]">
                          <span>AIDS Levy (3%):</span>
                          <span>${(results.aidsLevy || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-[#EEEEEE] pt-2 mt-2">
                          <div className="flex justify-between text-[#1ED760] font-semibold">
                            <span>Total Statutory Costs:</span>
                            <span>${(results.totalStatutoryCost || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Multi-Period Results Display */}
              {multiPeriodResults && activeView === 'projection' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-white rounded-xl border border-[#1ED760]/30 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-[#0F2F4E] mb-6 text-center">
                    {projectionYears}-Year PAYE Projection ({periodType})
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-[#0F2F4E]/5">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F2F4E]">Period</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F2F4E]">Employees</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F2F4E]">Total Payroll</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F2F4E]">PAYE Liability</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F2F4E]">Total Cost</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F2F4E]">Tax %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {multiPeriodResults.map((period, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm text-[#0F2F4E]">{period.period}</td>
                            <td className="px-4 py-3 text-sm text-[#0F2F4E]">{period.employeeCount}</td>
                            <td className="px-4 py-3 text-sm text-[#0F2F4E]">
                              ${period.totalPayroll.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#1ED760] font-medium">
                              ${period.payeLiability.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#0F2F4E] font-medium">
                              ${period.totalCost.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#FFD700] font-medium">
                              {(period.taxPercentage * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#0F2F4E]/10">
                        <tr>
                          <td className="px-4 py-3 text-sm font-semibold text-[#0F2F4E]">Total</td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#0F2F4E]">
                            {multiPeriodResults[multiPeriodResults.length - 1]?.employeeCount}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#0F2F4E]">
                            ${multiPeriodResults.reduce((sum, p) => sum + p.totalPayroll, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#1ED760]">
                            ${multiPeriodResults.reduce((sum, p) => sum + p.payeLiability, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#0F2F4E]">
                            ${multiPeriodResults.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#FFD700]">
                            {(
                              (multiPeriodResults.reduce((sum, p) => sum + p.payeLiability, 0) /
                               multiPeriodResults.reduce((sum, p) => sum + p.totalCost, 0)) * 100 || 0
                            ).toFixed(1)}%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Add this section - Simple Scenario Compare View */}
              {activeView === 'comparison' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-white rounded-xl border border-[#1ED760]/30 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-[#0F2F4E] mb-6 text-center">
                    Multi-Period Comparison
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Scenario Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Current Scenario Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-900">Total 2-Year PAYE:</span>
                          <span className="font-bold text-blue-800">
                            ${multiPeriodResults?.reduce((sum, p) => sum + p.payeLiability, 0).toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-900">Average Monthly PAYE:</span>
                          <span className="font-bold text-blue-800">
                            ${(multiPeriodResults?.reduce((sum, p) => sum + p.payeLiability, 0) / (multiPeriodResults?.length || 1)).toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-900">Year 1 Average Tax %:</span>
                          <span className="font-bold text-blue-800">
                            {((multiPeriodResults?.slice(0, 12).reduce((sum, p) => sum + p.taxPercentage, 0) / 12) * 100 || 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-900">Year 2 Average Tax %:</span>
                          <span className="font-bold text-blue-800">
                            {((multiPeriodResults?.slice(12).reduce((sum, p) => sum + p.taxPercentage, 0) / 12) * 100 || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Year Comparison */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-lg font-semibold text-green-800 mb-4">Year-over-Year Comparison</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-green-700">Year 1 (2025)</span>
                            <span className="font-bold text-green-800">
                              ${multiPeriodResults?.slice(0, 12).reduce((sum, p) => sum + p.payeLiability, 0).toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="w-full bg-green-100 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: '50%' }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-green-700">Year 2 (2026)</span>
                            <span className="font-bold text-green-800">
                              ${multiPeriodResults?.slice(12).reduce((sum, p) => sum + p.payeLiability, 0).toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="w-full bg-green-100 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: '60%' }}
                            ></div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-green-200">
                          <div className="flex justify-between text-green-800 font-semibold">
                            <span>Year 2 Increase:</span>
                            <span>
                              +{(
                                ((multiPeriodResults?.slice(12).reduce((sum, p) => sum + p.payeLiability, 0) || 0) / 
                                (multiPeriodResults?.slice(0, 12).reduce((sum, p) => sum + p.payeLiability, 0) || 1) - 1) * 100
                              ).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Combined Comparison */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Year Comparison Dashboard</h4>
                    
                    {multiPeriodResults && multiPeriodResults.length > 0 ? (
                      <div className="space-y-4">
                        {/* Side-by-Side Comparison Bar */}
                        <div className="flex items-end h-40">
                          {/* Year 1 */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="text-sm font-medium text-blue-700 mb-2">2025</div>
                            <div className="w-2/3 relative">
                              <div 
                                className="bg-gradient-to-t from-blue-700 to-blue-900 rounded-t w-full"
                                style={{ 
                                  height: '100px',
                                  position: 'relative'
                                }}
                              >
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-800 text-white px-2 py-1 rounded whitespace-nowrap">
                                  ${multiPeriodResults.slice(0, 12).reduce((sum, p) => sum + p.payeLiability, 0).toLocaleString()}
                                </div>
                              </div>
                              {/* Mini monthly indicators */}
                              <div className="flex justify-between mt-1">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="w-2 h-2 bg-blue-300 rounded"></div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Connecting Arrow */}
                          <div className="flex items-center justify-center w-16">
                            <div className="text-2xl text-purple-600">→</div>
                            <div className="text-xs text-purple-700 font-medium ml-2">
                              +{(
                                ((multiPeriodResults.slice(12, 24).reduce((sum, p) => sum + p.payeLiability, 0) || 0) / 
                                (multiPeriodResults.slice(0, 12).reduce((sum, p) => sum + p.payeLiability, 0) || 1) - 1) * 100
                              ).toFixed(1)}%
                            </div>
                          </div>
                          
                          {/* Year 2 */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="text-sm font-medium text-green-700 mb-2">2026</div>
                            <div className="w-2/3 relative">
                              <div 
                                className="bg-gradient-to-t from-green-400 to-green-700 rounded-t w-full"
                                style={{ 
                                  height: '120px',
                                  position: 'relative'
                                }}
                              >
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-800 text-white px-2 py-1 rounded whitespace-nowrap">
                                  ${multiPeriodResults.slice(12, 24).reduce((sum, p) => sum + p.payeLiability, 0).toLocaleString()}
                                </div>
                              </div>
                              {/* Mini monthly indicators */}
                              <div className="flex justify-between mt-1">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="w-2 h-2 bg-green-300 rounded"></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Monthly Comparison Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600 font-medium">2025 Highlights</div>
                            <div className="text-sm text-blue-700">
                              • Avg: ${(multiPeriodResults.slice(0, 12).reduce((sum, p) => sum + p.payeLiability, 0) / 12).toLocaleString()}/mo
                            </div>
                            <div className="text-sm text-blue-700">
                              • Tax: {((multiPeriodResults.slice(0, 12).reduce((sum, p) => sum + p.taxPercentage, 0) / 12) * 100).toFixed(1)}%
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600 font-medium">2026 Highlights</div>
                            <div className="text-sm text-green-700">
                              • Avg: ${(multiPeriodResults.slice(12, 24).reduce((sum, p) => sum + p.payeLiability, 0) / 12).toLocaleString()}/mo
                            </div>
                            <div className="text-sm text-green-700">
                              • Tax: {((multiPeriodResults.slice(12, 24).reduce((sum, p) => sum + p.taxPercentage, 0) / 12) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center text-gray-500">
                        No multi-period data available
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                {calculatorType === 'individual' ? 'PAYE Guide' : 'Business PAYE Guide'}
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]/80">
                {calculatorType === 'individual' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">•</span>
                      <span>Different rates apply for PVOs, NGOs, and private companies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">•</span>
                      <span>NSSA employer contribution is typically 4.5%</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">•</span>
                      <span>PAYE must be remitted monthly by the 10th</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">•</span>
                      <span>Benefits are taxable when provided to employees</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Simple PAYE Alternative */}
            <div className="bg-gradient-to-br from-[#1ED760]/5 to-[#1ED760]/10 rounded-2xl p-6 border border-[#1ED760]/30 shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
                Need Something Simpler?
              </h3>
              <p className="text-sm text-[#0F2F4E]/80 mb-4">
                For basic PAYE + NSSA calculations with payslip generation, try our simplified calculator designed for SMEs.
              </p>
              <Link 
                href="/simple-paye-calculator"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ED760] text-white rounded-lg 
                           hover:bg-[#1ED760]/90 transition-all duration-300 text-sm font-medium"
              >
                <Calculator className="w-4 h-4" />
                Simple PAYE Calculator
              </Link>
            </div>

            {/* Tax Tips */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                {calculatorType === 'individual' ? 'Tax Saving Tips' : 'Business Planning Tips'}
              </h3>
              <div className="space-y-3 text-sm text-[#0F2F4E]/80">
                {calculatorType === 'individual' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">💡</span>
                      <span>Use multi-year projections for budget planning</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">💡</span>
                      <span>Compare different business structure tax impacts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">💡</span>
                      <span>Factor in annual salary increases (typically 10-15%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#1ED760] mt-1">💡</span>
                      <span>Consider benefit structuring for tax efficiency</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Business Type Specific Info */}
            {calculatorType === 'business' && (
              <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
                <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                  {businessType.toUpperCase()} Specific Notes
                </h3>
                <div className="space-y-3 text-sm text-[#0F2F4E]/80">
                  {businessType === 'pvo' || businessType === 'ngo' ? (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>May qualify for tax exemptions on certain activities</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>PAYE rules still apply to employees</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Registration with relevant ministry required</span>
                      </div>
                    </>
                  ) : businessType === 'public' ? (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Follows public sector payroll rules</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>May have different benefit structures</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Standard Zimbabwe PAYE rates apply</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Must register with ZIMRA as an employer</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PAYETaxCalculator