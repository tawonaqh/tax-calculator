'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '../../shared/utils'

/**
 * PAYE Results Display Component
 * Shows calculation results for both individual and business PAYE
 */
export const PAYEResults = ({ results, calculatorType, formState }) => {
  if (!results) return null

  return (
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
            <StatBox label="Taxable Income" value={results.taxableIncome} color="#1ED760" />
            <StatBox label="PAYE Due" value={results.payeDue} color="#1ED760" />
            <StatBox label="Medical Credit" value={results.medicalCredit} color="#FFD700" />
            <StatBox label="Total Tax" value={results.totalTax} color="#0F2F4E" />
          </>
        ) : (
          <>
            <StatBox label="Total PAYE" value={results.totalTax} color="#1ED760" />
            <StatBox label="Total Statutory Cost" value={results.totalStatutoryCost} color="#1ED760" />
            <StatBox 
              label="Tax as % of Payroll" 
              value={`${((results.taxPercentage || 0) * 100).toFixed(1)}%`} 
              color="#FFD700" 
              isPercentage 
            />
            <StatBox label="Employee Count" value={results.employeeCount} color="#0F2F4E" isCount />
          </>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-[#0F2F4E]/5 p-4 rounded-lg border border-[#EEEEEE]">
        <h4 className="text-lg font-semibold text-[#0F2F4E] mb-3">
          {calculatorType === 'individual' ? 'Zimbabwe-Specific Breakdown' : 'Statutory Cost Breakdown'}
        </h4>
        {calculatorType === 'individual' ? (
          <IndividualBreakdown results={results} formState={formState} />
        ) : (
          <BusinessBreakdown results={results} />
        )}
      </div>
    </motion.div>
  )
}

const StatBox = ({ label, value, color, isPercentage = false, isCount = false }) => (
  <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
    <div className="text-[#0F2F4E]/70 text-sm mb-1">{label}</div>
    <div className="font-bold text-xl" style={{ color }}>
      {isPercentage || isCount ? value : formatCurrency(value || 0)}
    </div>
  </div>
)

const IndividualBreakdown = ({ results, formState }) => (
  <div className="space-y-2 text-sm">
    <BreakdownRow 
      label="Gross Income" 
      value={(parseFloat(formState.currentSalary) || 0) + (parseFloat(formState.currentBonus) || 0)} 
    />
    <BreakdownRow 
      label="Total Benefits" 
      value={(parseFloat(formState.housingBenefit) || 0) + (parseFloat(formState.vehicleBenefit) || 0) + (parseFloat(formState.educationBenefit) || 0)} 
    />
    <BreakdownRow label="NSSA (Capped at $700)" value={results.nssaCapped || 0} />
    <BreakdownRow label="Medical Credit (50%)" value={results.medicalCredit || 0} isCredit />
    <BreakdownRow label="AIDS Levy (3%)" value={results.aidsLevy || 0} />
    <div className="border-t border-[#EEEEEE] pt-2 mt-2">
      <div className="flex justify-between text-[#1ED760] font-semibold">
        <span>Net Tax Payable:</span>
        <span>{formatCurrency(results.totalTax || 0)}</span>
      </div>
    </div>
  </div>
)

const BusinessBreakdown = ({ results }) => (
  <div className="space-y-2 text-sm">
    <BreakdownRow label="ZIMDEF (1%)" value={results.zimdef || 0} />
    <BreakdownRow label="SDF (0.5%)" value={results.sdf || 0} />
    <BreakdownRow label="NSSA Employer (Capped)" value={results.nssaContributions || 0} />
    <BreakdownRow label="AIDS Levy (3%)" value={results.aidsLevy || 0} />
    <div className="border-t border-[#EEEEEE] pt-2 mt-2">
      <div className="flex justify-between text-[#1ED760] font-semibold">
        <span>Total Statutory Costs:</span>
        <span>{formatCurrency(results.totalStatutoryCost || 0)}</span>
      </div>
    </div>
  </div>
)

const BreakdownRow = ({ label, value, isCredit = false }) => (
  <div className="flex justify-between text-[#0F2F4E]">
    <span>{label}:</span>
    <span className={isCredit ? 'text-green-600' : ''}>
      {isCredit && '-'}{formatCurrency(value)}
    </span>
  </div>
)
