/**
 * Shared Formatting Utilities
 * Currency, number, and date formatting functions
 */

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currency} 0.00`
  return `${currency} ${parseFloat(amount).toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`
}

export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined || isNaN(number)) return '0.00'
  return parseFloat(number).toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })
}

export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%'
  return `${parseFloat(value).toFixed(decimals)}%`
}

export const parseNumericInput = (value) => {
  const cleaned = value.toString().replace(/[^0-9.-]/g, '')
  return cleaned === '' ? '' : cleaned
}

export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  const d = new Date(date)
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } else if (format === 'long') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } else {
    return d.toLocaleDateString('en-US')
  }
}
