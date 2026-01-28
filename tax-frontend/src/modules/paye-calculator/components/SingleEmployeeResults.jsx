'use client'

import React from 'react';
import { motion } from 'framer-motion';

const SingleEmployeeResults = ({ results, formatCurrency }) => {
  if (!results) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Basic Salary</h4>
          <p className="text-2xl font-bold">{formatCurrency(results.basicSalary)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
          <h4 className="text-sm opacity-90">Total Allowances</h4>
          <p className="text-2xl font-bold">{formatCurrency(results.totalAllowances)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Gross Salary</h4>
          <p className="text-2xl font-bold">{formatCurrency(results.grossSalary)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Net Salary</h4>
          <p className="text-2xl font-bold">{formatCurrency(results.netSalary)}</p>
        </div>
      </div>

      {/* Enhanced Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Earnings Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Basic Salary:</span>
              <span className="font-medium">{formatCurrency(results.basicSalary)}</span>
            </div>
            
            {results.allowances.living > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Living Allowance:</span>
                <span>{formatCurrency(results.allowances.living)}</span>
              </div>
            )}
            
            {results.allowances.medical > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Medical Allowance:</span>
                <span>{formatCurrency(results.allowances.medical)}</span>
              </div>
            )}
            
            {results.allowances.transport > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transport Allowance:</span>
                <span>{formatCurrency(results.allowances.transport)}</span>
              </div>
            )}
            
            {results.allowances.housing > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Housing Allowance:</span>
                <span>{formatCurrency(results.allowances.housing)}</span>
              </div>
            )}
            
            {results.allowances.commission > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commission:</span>
                <span>{formatCurrency(results.allowances.commission)}</span>
              </div>
            )}
            
            {results.allowances.bonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bonus:</span>
                <span>{formatCurrency(results.allowances.bonus)}</span>
              </div>
            )}
            
            {results.allowances.overtime > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overtime:</span>
                <span>{formatCurrency(results.allowances.overtime)}</span>
              </div>
            )}
            
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total Gross Salary:</span>
              <span>{formatCurrency(results.grossSalary)}</span>
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Employee Deductions</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>NSSA Employee (4.5%):</span>
              <span className="font-medium">{formatCurrency(results.nssaEmployee)}</span>
            </div>
            <div className="flex justify-between">
              <span>PAYE (Non-FDS):</span>
              <span className="font-medium">{formatCurrency(results.paye)}</span>
            </div>
            <div className="flex justify-between">
              <span>AIDS Levy (3%):</span>
              <span className="font-medium">{formatCurrency(results.aidsLevy)}</span>
            </div>
            {results.bonusTax && results.bonusTax > 0 && (
              <div className="flex justify-between">
                <span>Bonus Tax (Top Rate):</span>
                <span className="font-medium">{formatCurrency(results.bonusTax)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total Deductions:</span>
              <span>{formatCurrency(results.totalTax || 0)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-[#1ED760]">
              <span>Net Salary:</span>
              <span>{formatCurrency(results.netSalary || 0)}</span>
            </div>
            
            {results.bonusCalc && results.bonusCalc.taxFreeBonus && results.bonusCalc.taxFreeBonus > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                <h5 className="text-sm font-medium text-green-800 mb-1">Bonus Breakdown</h5>
                <div className="text-xs text-green-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Tax-free portion:</span>
                    <span>{formatCurrency(results.bonusCalc.taxFreeBonus)}</span>
                  </div>
                  {results.bonusCalc.taxableBonus && results.bonusCalc.taxableBonus > 0 && (
                    <div className="flex justify-between">
                      <span>Taxable portion:</span>
                      <span>{formatCurrency(results.bonusCalc.taxableBonus)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employer Contributions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Employer Contributions</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Employee Gross Salary:</span>
              <span className="font-medium">{formatCurrency(results.grossSalary || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>NSSA Employer (4.5%):</span>
              <span className="font-medium">{formatCurrency(results.nssaEmployer || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>ZIMDEF (1%):</span>
              <span className="font-medium">{formatCurrency(results.zimdef || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>APWC ({results.apwcRate || 0}%):</span>
              <span className="font-medium">{formatCurrency(results.apwc || 0)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total Employer Contributions:</span>
              <span>{formatCurrency(results.totalEmployerContributions || 0)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-[#0F2F4E]">
              <span>Total Employer Cost:</span>
              <span>{formatCurrency(results.totalCostToEmployer || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleEmployeeResults;