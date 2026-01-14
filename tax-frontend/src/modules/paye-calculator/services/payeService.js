/**
 * PAYE Calculation Service
 * Handles API calls for PAYE calculations
 */
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export const calculatePAYE = async (payload) => {
  try {
    const endpoint = `${API_BASE}/calculate/paye`
    const response = await axios.post(endpoint, payload)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('PAYE Calculation Error:', error)
    return { 
      success: false, 
      error: 'Failed to calculate PAYE tax. Please check your inputs and try again.' 
    }
  }
}

export const preparePayload = (formState, calculatorType, businessType, periodType, projectionYears) => {
  const payload = {
    calculatorType,
    businessType: calculatorType === 'business' ? businessType : null,
    periodType,
    projectionYears: calculatorType === 'business' ? projectionYears : 1,
  }

  if (calculatorType === 'individual') {
    const individualFields = [
      'currentSalary', 'currentBonus', 'irregularCommission', 'otherIrregularEarnings',
      'exemptions', 'housingBenefit', 'vehicleBenefit', 'educationBenefit',
      'nonTaxableEarnings', 'pensionContributions', 'nssaContributions',
      'totalDeductions', 'medicalContributions', 'medicalExpenses',
      'credits', 'aidsLevy'
    ]
    
    individualFields.forEach(field => {
      payload[field] = parseFloat(formState[field]) || 0
    })
    
    // Set business fields to 0
    payload.employeeCount = 0
    payload.totalGrossPayroll = 0
    payload.averageSalary = 0
    payload.annualSalaryIncrease = 0
    payload.expectedBonuses = 0
    payload.employerContributions = 0
    payload.nssaEmployerRate = 0
    payload.pensionEmployerRate = 0
    payload.benefitsPercentage = 0
    
  } else {
    const businessFields = [
      'employeeCount', 'totalGrossPayroll', 'averageSalary',
      'annualSalaryIncrease', 'expectedBonuses', 'employerContributions',
      'nssaEmployerRate', 'pensionEmployerRate', 'benefitsPercentage'
    ]
    
    businessFields.forEach(field => {
      payload[field] = parseFloat(formState[field]) || 0
    })
    
    // Set individual fields to 0
    payload.currentSalary = 0
    payload.currentBonus = 0
    payload.irregularCommission = 0
    payload.otherIrregularEarnings = 0
    payload.exemptions = 0
    payload.housingBenefit = 0
    payload.vehicleBenefit = 0
    payload.educationBenefit = 0
    payload.nonTaxableEarnings = 0
    payload.pensionContributions = 0
    payload.nssaContributions = 0
    payload.totalDeductions = 0
    payload.medicalContributions = 0
    payload.medicalExpenses = 0
    payload.credits = 0
    payload.aidsLevy = 0
  }

  return payload
}
