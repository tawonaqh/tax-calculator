'use client'

import { InputField } from '../../shared/components'

/**
 * Business PAYE Form Component
 * Handles form inputs for business/employer PAYE calculation
 */
export const BusinessPAYEForm = ({ formState, handleChange, activeSection }) => {
  return (
    <>
      {/* Income Section */}
      {activeSection === 'income' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Number of Employees"
            value={formState.employeeCount}
            onChange={handleChange('employeeCount')}
            placeholder="Total employees"
            type="number"
            required
          />
          <InputField
            label="Total Gross Payroll"
            value={formState.totalGrossPayroll}
            onChange={handleChange('totalGrossPayroll')}
            placeholder="Total payroll amount"
            type="number"
            required
          />
          <InputField
            label="Average Salary per Employee"
            value={formState.averageSalary}
            onChange={handleChange('averageSalary')}
            placeholder="Average monthly salary"
            type="number"
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
            type="number"
          />
        </div>
      )}

      {/* Benefits Section */}
      {activeSection === 'benefits' && (
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

      {/* Deductions Section */}
      {activeSection === 'deductions' && (
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

      {/* Credits Section */}
      {activeSection === 'credits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Tax Credits"
            value={formState.credits}
            onChange={handleChange('credits')}
            placeholder="Tax credit amount"
            type="number"
          />
          <InputField
            label="AIDS Levy"
            value={formState.aidsLevy}
            onChange={handleChange('aidsLevy')}
            placeholder="AIDS levy amount"
            type="number"
          />
        </div>
      )}
    </>
  )
}
