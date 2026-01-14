'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '../../shared/utils'

/**
 * Multi-Period PAYE Results Component
 * Displays multi-year PAYE projections for businesses
 */
export const MultiPeriodResults = ({ multiPeriodResults, projectionYears, periodType }) => {
  if (!multiPeriodResults || multiPeriodResults.length === 0) return null

  return (
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
                  {formatCurrency(period.totalPayroll)}
                </td>
                <td className="px-4 py-3 text-sm text-[#1ED760] font-medium">
                  {formatCurrency(period.payeLiability)}
                </td>
                <td className="px-4 py-3 text-sm text-[#0F2F4E] font-medium">
                  {formatCurrency(period.totalCost)}
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
                {formatCurrency(multiPeriodResults.reduce((sum, p) => sum + p.totalPayroll, 0))}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-[#1ED760]">
                {formatCurrency(multiPeriodResults.reduce((sum, p) => sum + p.payeLiability, 0))}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-[#0F2F4E]">
                {formatCurrency(multiPeriodResults.reduce((sum, p) => sum + p.totalCost, 0))}
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
  )
}
