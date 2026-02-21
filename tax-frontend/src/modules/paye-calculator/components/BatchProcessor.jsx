'use client'

import React from 'react';
import { motion } from 'framer-motion';

const BatchProcessor = ({ 
  batchResults,
  calculateBatchPayroll,
  employees,
  generatePayrollReports,
  generateBatchPayslips,
  generateBatchReports,
  isGeneratingPayslips,
  payslipProgress,
  formatCurrency,
  currentMonth,
  currentYear
}) => {
  if (batchResults.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-2">Batch Payroll Processing</h3>
          <p className="text-gray-600 mb-4">Add employees and calculate payroll to see results here</p>
          {employees.length > 0 && (
            <button
              onClick={calculateBatchPayroll}
              className="px-6 py-3 bg-gradient-to-r from-[#0F2F4E] to-[#0F2F4E]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Calculate Payroll ({employees.length} employees)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Batch Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Total Employees</h4>
          <p className="text-2xl font-bold">{batchResults.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
          <h4 className="text-sm opacity-90">Total Gross</h4>
          <p className="text-xl font-bold">
            {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.grossSalary || 0), 0))}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Total Net</h4>
          <p className="text-xl font-bold">
            {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.netSalary || 0), 0))}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Total PAYE</h4>
          <p className="text-xl font-bold">
            {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.paye || 0), 0))}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Total ZIMDEF</h4>
          <p className="text-xl font-bold">
            {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.zimdef || 0), 0))}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Employer Cost</h4>
          <p className="text-xl font-bold">
            {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.totalCostToEmployer || 0), 0))}
          </p>
        </div>
      </div>

      {/* Batch Detailed Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#0F2F4E]">Payroll Breakdown</h3>
          <div className="flex gap-3">
            <button
              onClick={generateBatchReports}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Batch Reports (3)
            </button>
            
            <button
              onClick={generatePayrollReports}
              className="px-4 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v14a4 4 0 01-4 4z" />
              </svg>
              Summary Report
            </button>
            
            <button
              onClick={generateBatchPayslips}
              disabled={isGeneratingPayslips}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                isGeneratingPayslips 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0F2F4E] hover:bg-[#0F2F4E]/90'
              } text-white`}
            >
              {isGeneratingPayslips ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generating... {payslipProgress}%
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Individual Payslips ({batchResults.length})
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0F2F4E]/5">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Basic</th>
                <th className="p-3 text-left">Allowances</th>
                <th className="p-3 text-left">Gross</th>
                <th className="p-3 text-left">NSSA</th>
                <th className="p-3 text-left">PAYE</th>
                <th className="p-3 text-left">ZIMDEF</th>
                <th className="p-3 text-left">APWC</th>
                <th className="p-3 text-left">Net</th>
              </tr>
            </thead>
            <tbody>
              {batchResults.map((emp, index) => (
                <tr key={emp.id} className="border-t border-gray-200">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{emp.employeeName}</div>
                      <div className="text-xs text-gray-500">{emp.employeeNumber}</div>
                    </div>
                  </td>
                  <td className="p-3">{formatCurrency(emp.calculation.basicSalary || 0)}</td>
                  <td className="p-3">{formatCurrency(emp.calculation.totalAllowances || 0)}</td>
                  <td className="p-3">{formatCurrency(emp.calculation.grossSalary || 0)}</td>
                  <td className="p-3">{formatCurrency(emp.calculation.nssaEmployee || 0)}</td>
                  <td className="p-3">{formatCurrency(emp.calculation.paye || 0)}</td>
                  <td className="p-3">{formatCurrency(emp.calculation.zimdef || 0)}</td>
                  <td className="p-3">{formatCurrency(emp.calculation.apwc || 0)}</td>
                  <td className="p-3 font-medium text-[#1ED760]">{formatCurrency(emp.calculation.netSalary || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 relative overflow-hidden rounded-lg">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="relative p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-blue-800 mb-1">Batch Payroll Reports</h5>
                <p className="text-sm text-blue-700 leading-relaxed mb-2">
                  Generate comprehensive payroll reports with one click:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-blue-600">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong>Batch Reports (3):</strong> Payslip Summary, NSSA Form P4, and PAYE Report in one ZIP file
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong>Summary Report:</strong> Comprehensive payroll analysis with totals and breakdowns
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong>Individual Payslips:</strong> Separate PDF payslips for each employee in ZIP format
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BatchProcessor;