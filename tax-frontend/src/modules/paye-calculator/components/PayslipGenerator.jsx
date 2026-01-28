'use client'

import React from 'react';

const PayslipGenerator = ({ 
  results,
  formData,
  companyData,
  showPayslip,
  setShowPayslip,
  generatePayslipPDF,
  generateOriginalPayslipPDF,
  formatCurrency
}) => {
  if (!results) return null;

  const generatePayslip = () => {
    const currentDate = new Date();
    const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-300 w-full max-w-4xl mx-auto print:max-w-full print:border-0 print:rounded-none print:shadow-none print:p-6" id="payslip-preview" style={{minWidth: '800px', margin: '0 auto'}}>
        {/* Header with Company Branding */}
        <div className="mb-6 border-b-2 border-[#0F2F4E] pb-4 print:border-b print:pb-4">
          {/* Company Information */}
          {(companyData.companyName || companyData.companyLogo) && (
            <div className="flex items-center gap-4 mb-4 print:mb-4">
              {companyData.companyLogo && (
                <div className="w-16 h-16 flex-shrink-0 print:w-20 print:h-20">
                  <img 
                    src={companyData.companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain print:object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                {companyData.companyName && (
                  <h3 className="text-lg font-bold text-[#0F2F4E] print:text-xl print:font-bold">{companyData.companyName}</h3>
                )}
                <div className="text-sm text-gray-600 print:text-sm print:text-gray-800">
                  {companyData.companyAddress && <p className="print:mb-1">{companyData.companyAddress}</p>}
                  <div className="flex gap-4 print:flex print:gap-4">
                    {companyData.companyPhone && <span>Tel: {companyData.companyPhone}</span>}
                    {companyData.companyEmail && <span>Email: {companyData.companyEmail}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Payslip Title */}
          <div className="text-center print:text-center">
            <h2 className="text-2xl font-bold text-[#0F2F4E] print:text-3xl print:font-bold">PAYSLIP</h2>
            <p className="text-sm text-gray-600 print:text-base print:text-gray-800">Pay Period: {payPeriod}</p>
          </div>
        </div>
        
        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 print:grid-cols-2 print:gap-6 print:mb-6">
          <div className="print:text-sm">
            <p className="print:mb-2"><strong>Employee Name:</strong> {formData.employeeName || 'N/A'}</p>
            <p className="print:mb-2"><strong>Employee Number:</strong> {formData.employeeNumber || 'N/A'}</p>
          </div>
          <div className="print:text-sm">
            <p className="print:mb-2"><strong>Department:</strong> {formData.department || 'N/A'}</p>
            <p className="print:mb-2"><strong>Position:</strong> {formData.position || 'N/A'}</p>
          </div>
        </div>
        
        {/* Salary Breakdown */}
        <div className="mb-8 print:mb-8">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3 border-b border-gray-200 pb-1 print:text-xl print:font-semibold print:mb-4 print:border-b print:border-gray-400 print:pb-2">
            EARNINGS & DEDUCTIONS
          </h3>
          
          <div className="grid grid-cols-3 gap-4 print:grid-cols-3 print:gap-6">
            {/* Earnings */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">EARNINGS</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span>{formatCurrency(results.basicSalary)}</span>
                </div>
                
                {results.allowances && results.allowances.living > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Living Allow.:</span>
                    <span>{formatCurrency(results.allowances.living)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.medical > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Medical Allow.:</span>
                    <span>{formatCurrency(results.allowances.medical)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.transport > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Transport Allow.:</span>
                    <span>{formatCurrency(results.allowances.transport)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.housing > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Housing Allow.:</span>
                    <span>{formatCurrency(results.allowances.housing)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.commission > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Commission:</span>
                    <span>{formatCurrency(results.allowances.commission)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.bonus > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Bonus:</span>
                    <span>{formatCurrency(results.allowances.bonus)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.overtime > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Overtime:</span>
                    <span>{formatCurrency(results.allowances.overtime)}</span>
                  </div>
                )}
                
                {results.totalAllowances && results.totalAllowances > 0 && (
                  <div className="flex justify-between text-xs border-t pt-1">
                    <span>Total Allowances:</span>
                    <span>{formatCurrency(results.totalAllowances)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Gross Salary:</span>
                  <span>{formatCurrency(results.grossSalary)}</span>
                </div>
              </div>
            </div>
            
            {/* Deductions */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">DEDUCTIONS</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>NSSA (4.5%):</span>
                  <span>({formatCurrency(results.nssaEmployee)})</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYE:</span>
                  <span>({formatCurrency(results.paye)})</span>
                </div>
                <div className="flex justify-between">
                  <span>AIDS Levy (3%):</span>
                  <span>({formatCurrency(results.aidsLevy)})</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total Deductions:</span>
                  <span>({formatCurrency((results.nssaEmployee || 0) + (results.totalTax || 0))})</span>
                </div>
              </div>
            </div>
            
            {/* Net Pay */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">NET PAY</h4>
              <div className="bg-[#1ED760]/10 p-3 rounded border border-[#1ED760]">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-lg font-bold text-[#1ED760]">
                    {formatCurrency(results.netSalary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tax Calculation Details */}
        <div className="mb-6 bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700 mb-2">TAX CALCULATION (Non-FDS Method)</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>Gross Salary: {formatCurrency(results.grossSalary)}</p>
              <p>Less: NSSA: ({formatCurrency(results.nssaEmployee)})</p>
              <p className="font-medium">Taxable Income: {formatCurrency(results.taxableGrossForPAYE || results.taxableGross || 0)}</p>
            </div>
            <div>
              <p>PAYE: {formatCurrency(results.paye)}</p>
              <p>AIDS Levy (3%): {formatCurrency(results.aidsLevy)}</p>
              <p className="font-medium">Total Tax: {formatCurrency(results.totalTax)}</p>
            </div>
          </div>
        </div>
        
        {/* Employer Costs */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">EMPLOYER COSTS</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>Employee Salary: {formatCurrency(results.grossSalary)}</p>
              <p>Employer NSSA (4.5%): {formatCurrency(results.nssaEmployer)}</p>
            </div>
            <div>
              <p className="font-bold text-[#0F2F4E]">
                Total Cost to Employer: {formatCurrency(results.totalCostToEmployer)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t text-xs text-gray-500">
          <p>This payslip is computer generated and does not require a signature.</p>
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#0F2F4E]">Generate Payslip</h3>
        <button
          onClick={() => setShowPayslip(!showPayslip)}
          className="px-4 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 transition"
        >
          {showPayslip ? 'Hide Payslip' : 'Show Payslip'}
        </button>
      </div>
      
      {showPayslip && (
        <div className="mt-6">
          <div className="flex justify-center">
            {generatePayslip()}
          </div>
          
          <div className="flex justify-center items-center gap-3 mt-6 print:hidden">
            <button
              onClick={generatePayslipPDF}
              className="px-6 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Beautiful PDF
            </button>
            
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            
            <button
              onClick={generateOriginalPayslipPDF}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Classic PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipGenerator;