'use client'

import { InputField } from '../../shared/components'

/**
 * Individual PAYE Form Component
 * Handles form inputs for individual employee PAYE calculation
 */
export const IndividualPAYEForm = ({ formState, handleChange, activeSection }) => {
  return (
    <>
      {/* Income Section */}
      {activeSection === 'income' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Current Salary, Wages, Fees"
            value={formState.currentSalary}
            onChange={handleChange('currentSalary')}
            placeholder="Enter gross salary"
            type="number"
            required
          />
          <InputField
            label="Current Bonus"
            value={formState.currentBonus}
            onChange={handleChange('currentBonus')}
            placeholder="Bonus amount"
            type="number"
          />
          <InputField
            label="Irregular Commission"
            value={formState.irregularCommission}
            onChange={handleChange('irregularCommission')}
            placeholder="Commission earnings"
            type="number"
          />
          <InputField
            label="Other Irregular Earnings"
            value={formState.otherIrregularEarnings}
            onChange={handleChange('otherIrregularEarnings')}
            placeholder="Other irregular income"
            type="number"
          />
        </div>
      )}

      {/* Benefits Section */}
      {activeSection === 'benefits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Exemptions"
            value={formState.exemptions}
            onChange={handleChange('exemptions')}
            placeholder="Tax exemptions"
            type="number"
          />
          <InputField
            label="Housing Benefit"
            value={formState.housingBenefit}
            onChange={handleChange('housingBenefit')}
            placeholder="Housing allowance"
            type="number"
          />
          <InputField
            label="Vehicle Benefit"
            value={formState.vehicleBenefit}
            onChange={handleChange('vehicleBenefit')}
            placeholder="Company vehicle value"
            type="number"
          />
          <InputField
            label="Education Benefit"
            value={formState.educationBenefit}
            onChange={handleChange('educationBenefit')}
            placeholder="Education allowance"
            type="number"
          />
          <InputField
            label="Non-Taxable Earnings"
            value={formState.nonTaxableEarnings}
            onChange={handleChange('nonTaxableEarnings')}
            placeholder="Non-taxable income"
            type="number"
          />
        </div>
      )}

      {/* Deductions Section */}
      {activeSection === 'deductions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Pension Contributions"
            value={formState.pensionContributions}
            onChange={handleChange('pensionContributions')}
            placeholder="Pension fund contributions"
            type="number"
          />
          <InputField
            label="NSSA Contributions"
            value={formState.nssaContributions}
            onChange={handleChange('nssaContributions')}
            placeholder="NSSA contributions"
            type="number"
          />
          <InputField
            label="Other Deductions"
            value={formState.totalDeductions}
            onChange={handleChange('totalDeductions')}
            placeholder="Other deductions"
            type="number"
          />
          <InputField
            label="Medical Contributions"
            value={formState.medicalContributions}
            onChange={handleChange('medicalContributions')}
            placeholder="Medical aid contributions"
            type="number"
          />
          <InputField
            label="Medical Expenses"
            value={formState.medicalExpenses}
            onChange={handleChange('medicalExpenses')}
            placeholder="Out-of-pocket medical"
            type="number"
          />
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
