'use client'

import React from 'react';

const EmployeeInputForm = ({ 
  payrollMode,
  calculationMethod,
  setCalculationMethod,
  formData,
  handleInputChange,
  employees,
  addEmployeeToBatch,
  handleCalculate,
  removeEmployee,
  setEmployees,
  calculateTotalGross,
  formatCurrency,
  TAX_CONFIG,
  availableEmployees,
  onSelectEmployeeForBatch
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
        {payrollMode === 'batch' ? 'Add Employee to Batch' : 'Employee Information'}
      </h3>
      
      {/* Quick Select Employee for Batch Mode */}
      {payrollMode === 'batch' && availableEmployees && availableEmployees.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quick Select from Database (Optional)
          </label>
          <select
            onChange={(e) => {
              if (e.target.value && onSelectEmployeeForBatch) {
                onSelectEmployeeForBatch(e.target.value);
                e.target.value = ''; // Reset dropdown
              }
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] transition-all"
          >
            <option value="">-- Select Employee to Auto-Fill --</option>
            {availableEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} ({emp.employee_number}) - ${emp.base_salary}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Select an employee to auto-fill their details, then adjust salary/allowances if needed
          </p>
        </div>
      )}
      
      {/* Calculation Method (Single Employee Only) */}
      {payrollMode === 'single' && (
        <div className="mb-6">
          <h4 className="font-medium text-[#0F2F4E] mb-3">Calculation Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setCalculationMethod('gross')}
              className={`p-3 rounded-lg border-2 transition-all ${
                calculationMethod === 'gross'
                  ? 'border-[#1ED760] bg-[#1ED760]/10'
                  : 'border-gray-200 hover:border-[#1ED760]/50'
              }`}
            >
              <div className="text-left">
                <h5 className="font-medium text-[#0F2F4E]">Gross Method</h5>
                <p className="text-sm text-gray-600">Enter gross salary, calculate net pay</p>
              </div>
            </button>
            
            <button
              onClick={() => setCalculationMethod('net')}
              className={`p-3 rounded-lg border-2 transition-all ${
                calculationMethod === 'net'
                  ? 'border-[#1ED760] bg-[#1ED760]/10'
                  : 'border-gray-200 hover:border-[#1ED760]/50'
              }`}
            >
              <div className="text-left">
                <h5 className="font-medium text-[#0F2F4E]">Net Method (Grossing Up)</h5>
                <p className="text-sm text-gray-600">Enter desired net, calculate required gross</p>
              </div>
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <h4 className="font-medium text-[#0F2F4E] mb-3">Basic Information</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                Employee Name *
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                placeholder="Full Name"
                className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                  Employee Number
                </label>
                <input
                  type="text"
                  value={formData.employeeNumber}
                  onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                  placeholder="EMP001"
                  className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="HR, Finance, etc."
                  className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                Position/Job Title
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Manager, Accountant, etc."
                className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
              />
            </div>
            
            {/* Salary Input */}
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                {payrollMode === 'single' && calculationMethod === 'net' 
                  ? 'Desired Net Salary (USD) *' 
                  : 'Basic Salary (USD) *'
                }
              </label>
              <input
                type="number"
                value={payrollMode === 'single' && calculationMethod === 'net' 
                  ? formData.netSalary 
                  : formData.grossSalary
                }
                onChange={(e) => handleInputChange(
                  payrollMode === 'single' && calculationMethod === 'net' 
                    ? 'netSalary' 
                    : 'grossSalary', 
                  e.target.value
                )}
                placeholder="0.00"
                className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
              />
            </div>
          </div>
        </div>
        
        {/* Allowances & Benefits */}
        <div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-[#0F2F4E] mb-3">Allowances & Benefits</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Living Allowance
                </label>
                <input
                  type="number"
                  value={formData.livingAllowance}
                  onChange={(e) => handleInputChange('livingAllowance', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Medical Allowance
                </label>
                <input
                  type="number"
                  value={formData.medicalAllowance}
                  onChange={(e) => handleInputChange('medicalAllowance', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Transport Allowance
                </label>
                <input
                  type="number"
                  value={formData.transportAllowance}
                  onChange={(e) => handleInputChange('transportAllowance', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Housing Allowance
                </label>
                <input
                  type="number"
                  value={formData.housingAllowance}
                  onChange={(e) => handleInputChange('housingAllowance', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Commission
                </label>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(e) => handleInputChange('commission', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bonus (This Month)
                </label>
                <input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => handleInputChange('bonus', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Previous Bonus YTD
                </label>
                <input
                  type="number"
                  value={formData.cumulativeBonusYTD}
                  onChange={(e) => handleInputChange('cumulativeBonusYTD', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Bonus paid earlier this year</p>
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Overtime Pay
                </label>
                <input
                  type="number"
                  value={formData.overtime}
                  onChange={(e) => handleInputChange('overtime', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
            </div>
            
            <div className="mt-3 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50"></div>
              <div className="relative p-3 border border-amber-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-800 font-medium">
                    Bonus threshold: First $700 cumulative per year is tax-free. Amount above $700 YTD taxed at employee's top rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Employer Contributions Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <h4 className="font-medium text-[#0F2F4E] mb-3">Employer Contributions</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  APWC Rate (%) - Sector Specific
                </label>
                <input
                  type="number"
                  value={formData.apwcRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value <= TAX_CONFIG.maxAPWCRate * 100) {
                      handleInputChange('apwcRate', e.target.value);
                    }
                  }}
                  placeholder="1.0"
                  min="0"
                  max="2.16"
                  step="0.01"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Accidents Prevention & Workers Compensation (Max: 2.16%)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>NSSA Employer:</span>
                  <span>4.5% (capped)</span>
                </div>
                <div className="flex justify-between">
                  <span>ZIMDEF:</span>
                  <span>1.0% (fixed)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
              <div className="relative p-3 border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-xs text-blue-800 font-medium">
                    ZIMDEF (1%) and APWC are employer contributions calculated on gross wage bill.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        {payrollMode === 'batch' ? (
          <>
            <button
              onClick={addEmployeeToBatch}
              className="flex-1 py-3 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Add Employee to Batch ({employees.length}/20)
            </button>
          </>
        ) : (
          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Calculate {calculationMethod === 'gross' ? 'Net Pay' : 'Required Gross'}
          </button>
        )}
      </div>

      {/* Batch Employee List */}
      {payrollMode === 'batch' && employees.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-[#0F2F4E]">
              Employees in Batch ({employees.length}/20)
            </h4>
            <button
              onClick={() => setEmployees([])}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {employees.map((emp, index) => (
              <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-[#0F2F4E]">{emp.employeeName}</span>
                    <span className="text-sm text-gray-600">{emp.employeeNumber}</span>
                    <span className="text-sm text-gray-600">{emp.department}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Basic: {formatCurrency(emp.basicSalary)} | 
                    Total Gross: {formatCurrency(calculateTotalGross(emp.basicSalary, emp.allowances))}
                  </div>
                </div>
                <button
                  onClick={() => removeEmployee(emp.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeInputForm;