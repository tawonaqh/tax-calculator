'use client'

import React from 'react';

const PayrollPeriodManager = ({ 
  currentMonth, 
  currentYear, 
  payrollMode, 
  employees, 
  batchResults, 
  results, 
  rollForwardToNextMonth,
  getMonthName 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0F2F4E]">Payroll Period</h3>
          <p className="text-sm text-gray-600">Current processing month</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#0F2F4E]">
            {getMonthName(currentMonth)} {currentYear}
          </div>
          <div className="text-sm text-gray-500">
            Pay Period: Month {currentMonth}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-[#0F2F4E] mb-3">Current Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Processing Month:</span>
              <span className="font-medium">{getMonthName(currentMonth)} {currentYear}</span>
            </div>
            <div className="flex justify-between">
              <span>Payroll Mode:</span>
              <span className="font-medium capitalize">{payrollMode}</span>
            </div>
            {payrollMode === 'batch' && (
              <div className="flex justify-between">
                <span>Employees Added:</span>
                <span className="font-medium">{employees.length}/20</span>
              </div>
            )}
            {payrollMode === 'batch' && batchResults.length > 0 && (
              <div className="flex justify-between">
                <span>Payroll Calculated:</span>
                <span className="font-medium text-green-600">✓ Yes</span>
              </div>
            )}
            {payrollMode === 'single' && results && (
              <div className="flex justify-between">
                <span>Calculation Done:</span>
                <span className="font-medium text-green-600">✓ Yes</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Roll Forward Action */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-[#0F2F4E] mb-3">Roll Forward to Next Month</h4>
          <p className="text-sm text-gray-600 mb-4">
            Move to the next payroll period. This will:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 mb-4">
            <li>• Update YTD bonus amounts</li>
            <li>• Clear current month salary data</li>
            <li>• Preserve employee information</li>
            <li>• Reset YTD if rolling to new year</li>
            <li>• Save current payroll to history</li>
          </ul>
          
          <button
            onClick={rollForwardToNextMonth}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Roll Forward to {getMonthName(currentMonth === 12 ? 1 : currentMonth + 1)} {currentMonth === 12 ? currentYear + 1 : currentYear}
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Payroll Continuity:</strong> Use "Roll Forward" after completing each month's payroll to maintain accurate YTD bonus tracking and seamless month-to-month processing.
        </p>
      </div>
    </div>
  );
};

export default PayrollPeriodManager;