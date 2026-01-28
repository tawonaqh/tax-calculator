'use client'

import React from 'react';

const PayrollHistory = ({ 
  payrollHistory, 
  showHistoryView, 
  setShowHistoryView, 
  setPayrollHistory, 
  loadSampleDataForDemo,
  formatCurrency,
  getMonthName 
}) => {
  if (payrollHistory.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#0F2F4E]">Payroll History & Trends</h3>
          <p className="text-sm text-gray-600">Month-to-month payroll visualization</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistoryView(!showHistoryView)}
            className="px-4 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showHistoryView ? 'Hide History' : 'View History'}
          </button>
          <button
            onClick={() => setPayrollHistory([])}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Clear History
          </button>
          <button
            onClick={loadSampleDataForDemo}
            className="px-4 py-2 bg-[#FFD700] text-[#0F2F4E] rounded-lg hover:bg-[#FFD700]/90 transition text-sm font-medium"
          >
            Load Sample Data
          </button>
        </div>
      </div>

      {/* History Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Total Months</h4>
          <p className="text-2xl font-bold">{payrollHistory.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Avg Monthly Gross</h4>
          <p className="text-xl font-bold">
            {formatCurrency(payrollHistory.reduce((sum, month) => sum + (month.data?.totalGross || 0), 0) / payrollHistory.length)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
          <h4 className="text-sm opacity-90">Avg Monthly Net</h4>
          <p className="text-xl font-bold">
            {formatCurrency(payrollHistory.reduce((sum, month) => sum + (month.data?.totalNet || 0), 0) / payrollHistory.length)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#0F2F4E]/80 to-[#0F2F4E]/60 p-4 rounded-lg text-white">
          <h4 className="text-sm opacity-90">Avg Employees</h4>
          <p className="text-2xl font-bold">
            {Math.round(payrollHistory.reduce((sum, month) => sum + (month.data?.employees || 0), 0) / payrollHistory.length)}
          </p>
        </div>
      </div>

      {showHistoryView && (
        <div className="space-y-6">
          {/* Monthly Trend Chart (Simple Bar Chart) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-[#0F2F4E]/10">
            <h4 className="font-medium text-[#0F2F4E] mb-4">Monthly Payroll Trends</h4>
            <div className="space-y-3">
              {payrollHistory.map((monthData, index) => {
                const maxValue = Math.max(...payrollHistory.map(m => m.data?.totalGross || 0));
                const barWidth = ((monthData.data?.totalGross || 0) / maxValue) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-[#0F2F4E]">
                      {getMonthName(monthData.month)} {monthData.year}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-gradient-to-r from-[#1ED760] to-[#1ED760]/80 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(barWidth, 5)}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {formatCurrency(monthData.data?.totalGross || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-[#0F2F4E]/70">
                      {monthData.data?.employees || 0} emp
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0F2F4E]/5 border-b border-[#0F2F4E]/10">
                <tr>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Period</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Mode</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Employees</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Total Gross</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Total Net</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Total PAYE</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Employer Cost</th>
                  <th className="p-3 text-left font-medium text-[#0F2F4E]">Date Processed</th>
                </tr>
              </thead>
              <tbody>
                {payrollHistory.map((monthData, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-[#0F2F4E]/5 transition-colors">
                    <td className="p-3 font-medium text-[#0F2F4E]">
                      {getMonthName(monthData.month)} {monthData.year}
                    </td>
                    <td className="p-3 capitalize text-[#0F2F4E]/80">{monthData.payrollMode}</td>
                    <td className="p-3 text-[#0F2F4E]/80">{monthData.data?.employees || 0}</td>
                    <td className="p-3 font-medium text-[#0F2F4E]">{formatCurrency(monthData.data?.totalGross || 0)}</td>
                    <td className="p-3 font-medium text-[#1ED760]">{formatCurrency(monthData.data?.totalNet || 0)}</td>
                    <td className="p-3 font-medium text-[#FFD700]">{formatCurrency(monthData.data?.totalPAYE || 0)}</td>
                    <td className="p-3 font-medium text-[#0F2F4E]">{formatCurrency(monthData.data?.totalEmployerCost || 0)}</td>
                    <td className="p-3 text-[#0F2F4E]/60 text-xs">
                      {new Date(monthData.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trend Analysis */}
          <div className="bg-gradient-to-br from-[#0F2F4E]/5 to-[#0F2F4E]/10 p-4 rounded-lg border border-[#0F2F4E]/20">
            <h4 className="font-medium text-[#0F2F4E] mb-3">Trend Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-[#0F2F4E] mb-2">Growth Trends</h5>
                {payrollHistory.length >= 2 && (
                  <div className="space-y-1">
                    {(() => {
                      const latest = payrollHistory[payrollHistory.length - 1];
                      const previous = payrollHistory[payrollHistory.length - 2];
                      const grossChange = ((latest.data?.totalGross || 0) - (previous.data?.totalGross || 0)) / (previous.data?.totalGross || 1) * 100;
                      const empChange = (latest.data?.employees || 0) - (previous.data?.employees || 0);
                      
                      return (
                        <>
                          <p className={`flex items-center gap-1 ${grossChange >= 0 ? 'text-[#1ED760]' : 'text-red-600'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={grossChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                            </svg>
                            Gross: {grossChange >= 0 ? '+' : ''}{grossChange.toFixed(1)}%
                          </p>
                          <p className={`flex items-center gap-1 ${empChange >= 0 ? 'text-[#1ED760]' : 'text-red-600'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Employees: {empChange >= 0 ? '+' : ''}{empChange}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="font-medium text-[#0F2F4E] mb-2">Averages</h5>
                <div className="space-y-1 text-[#0F2F4E]/80">
                  <p>Avg Gross: {formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalGross || 0), 0) / payrollHistory.length)}</p>
                  <p>Avg PAYE: {formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalPAYE || 0), 0) / payrollHistory.length)}</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-[#0F2F4E] mb-2">Totals YTD</h5>
                <div className="space-y-1 text-[#0F2F4E]/80">
                  <p>Total Paid: <span className="font-medium text-[#1ED760]">{formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalNet || 0), 0))}</span></p>
                  <p>Total Tax: <span className="font-medium text-[#FFD700]">{formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalPAYE || 0), 0))}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollHistory;