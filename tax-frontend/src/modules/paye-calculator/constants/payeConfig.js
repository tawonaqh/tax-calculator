/**
 * PAYE Calculator Configuration
 * Business types, period types, and other constants
 */

export const CALCULATOR_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business'
}

export const BUSINESS_TYPES = [
  { value: 'private', label: 'Private Company' },
  { value: 'pvo', label: 'PVO (Private Voluntary)' },
  { value: 'ngo', label: 'NGO (Non-Governmental)' },
  { value: 'public', label: 'Public Institution' },
  { value: 'sole', label: 'Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'trust', label: 'Trust' }
]

export const PERIOD_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' }
]

export const PROJECTION_YEARS = [1, 2, 3, 4, 5]

export const VIEW_TYPES = {
  CALCULATOR: 'calculator',
  PROJECTION: 'projection',
  COMPARISON: 'comparison'
}

export const FORM_SECTIONS = {
  INCOME: 'income',
  BENEFITS: 'benefits',
  DEDUCTIONS: 'deductions',
  CREDITS: 'credits'
}

export const INITIAL_FORM_STATE = {
  // Individual fields
  currentSalary: '',
  currentBonus: '',
  irregularCommission: '',
  otherIrregularEarnings: '',
  exemptions: '',
  housingBenefit: '',
  vehicleBenefit: '',
  educationBenefit: '',
  nonTaxableEarnings: '',
  pensionContributions: '',
  nssaContributions: '',
  totalDeductions: '',
  medicalContributions: '',
  medicalExpenses: '',
  credits: '',
  aidsLevy: '',
  
  // Business fields
  employeeCount: '',
  totalGrossPayroll: '',
  averageSalary: '',
  annualSalaryIncrease: '10',
  expectedBonuses: '15',
  employerContributions: '',
  nssaEmployerRate: '4.5',
  pensionEmployerRate: '5',
  benefitsPercentage: '20',
}
