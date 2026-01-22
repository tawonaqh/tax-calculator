/**
 * Zimbabwe Tax Rates and Constants
 * Centralized tax rate configuration
 */

export const TAX_RATES = {
  CORPORATE_TAX: 0.25,
  AIDS_LEVY: 0.03,
  VAT: 0.15,
  ZIMDEF: 0.01,
  SDF: 0.005,
  NSSA_EMPLOYEE: 0.045, // Updated to 4.5%
  NSSA_EMPLOYER: 0.045, // Updated to 4.5%
  NSSA_CAP_USD: 700,
  MEDICAL_AID_CREDIT: 0.50
}

export const PAYE_BANDS = [
  { min: 0, max: 12000, rate: 0, deduct: 0 },
  { min: 12001, max: 36000, rate: 0.20, deduct: 2400 },
  { min: 36001, max: 60000, rate: 0.25, deduct: 4200 },
  { min: 60001, max: 120000, rate: 0.30, deduct: 7200 },
  { min: 120001, max: Infinity, rate: 0.40, deduct: 19200 }
]

export const CAPITAL_ALLOWANCE_RATES = {
  MOTOR_VEHICLES: { wearTear: 0.20, sia: 0 },
  PLANT_MACHINERY: { wearTear: 0.25, sia: 0.50 },
  IT_EQUIPMENT: { wearTear: 0.3333, sia: 0.50 },
  INDUSTRIAL_BUILDINGS: { wearTear: 0.05, sia: 0.50 },
  COMMERCIAL_BUILDINGS: { wearTear: 0.025, sia: 0 },
  FURNITURE_FITTINGS: { wearTear: 0.10, sia: 0 },
  IMPROVEMENTS: { wearTear: 0.10, sia: 0 }
}

export const BUSINESS_TYPES = {
  PRIVATE: { name: 'Private Company', taxRate: 0.25 },
  PVO: { name: 'Private Voluntary Organization', taxRate: 0.15 },
  NGO: { name: 'Non-Governmental Organization', taxRate: 0.15 },
  MINING: { name: 'Mining Company', taxRate: 0.25 },
  AGRICULTURE: { name: 'Agricultural Company', taxRate: 0.25 }
}

export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  ZWG: { symbol: 'ZWG', name: 'Zimbabwe Gold', code: 'ZWG' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' }
}
