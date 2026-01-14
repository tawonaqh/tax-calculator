'use client'

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LabelList,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { eliteTaxAPI } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const COLORS = ["#1ED760", "#FFD700", "#0F2F4E", "#84cc16", "#f97316", "#8b5cf6", "#ec4899"];

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to TaxCul Multi-Period Tax Planning',
    description: 'This tool helps you plan taxes for Zimbabwean businesses. Let\'s get started!',
    position: 'center',
    target: null,
    tab: null,
    order: 1
  },
  {
    id: 'multi-currency',
    title: 'Multi-Currency Planning',
    description: 'Plan across USD, ZWG, ZAR, and other currencies with exchange rate scenarios.',
    position: 'bottom',
    target: '.tutorial-currency-mixer',
    tab: 'scenarios',
    order: 2
  },
  {
    id: 'period-timeline',
    title: 'Multi-Period Planning',
    description: 'Plan taxes across multiple years. Switch between annual, quarterly, or monthly views.',
    position: 'bottom',
    target: '.tutorial-period-manager',
    tab: 'overview',
    order: 3
  },
  {
    id: 'scenarios',
    title: 'Scenario Planning',
    description: 'Create "what-if" scenarios: Growth plans, cost-cutting, or custom strategies.',
    position: 'right',
    target: '.tutorial-scenario',
    tab: 'scenarios',
    order: 4
  },
  {
    id: 'data-import',
    title: 'Import Your Data',
    description: 'Upload Excel/CSV files from Xero, QuickBooks, or other accounting software.',
    position: 'left',
    target: '.tutorial-data-import',
    tab: 'data-input',
    order: 5
  },
  {
    id: 'capital-allowances',
    title: 'Capital Allowances',
    description: 'Claim tax deductions for business assets like vehicles, equipment, and buildings.',
    position: 'top',
    target: '.tutorial-capital-allowance',
    tab: 'data-input',
    order: 6
  },
  {
    id: 'employee-costs',
    title: 'Employee Costs & PAYE',
    description: 'Calculate PAYE, NSSA, and other employment-related taxes.',
    position: 'bottom',
    target: '.tutorial-employee-cost',
    tab: 'data-input',
    order: 7
  },
  {
    id: 'currency-analysis',
    title: 'Currency Risk Analysis',
    description: 'Analyze exchange rate impact on taxes and profitability.',
    position: 'right',
    target: '.tutorial-currency-risk',
    tab: 'reports',
    order: 8
  },
  {
    id: 'ai-assistant',
    title: 'AI Tax Assistant',
    description: 'Get Zimbabwe-specific tax advice and optimization tips.',
    position: 'left',
    target: '.tutorial-ai-assistant',
    tab: null,
    order: 9
  },
  {
    id: 'export-reports',
    title: 'Export Reports',
    description: 'Generate professional PDF and Excel reports for your accountant.',
    position: 'right',
    target: '.tutorial-export',
    tab: 'reports',
    order: 10
  },
  {
    id: 'calculate',
    title: 'Run Analysis',
    description: 'Click this button to calculate tax projections across all periods and scenarios.',
    position: 'top',
    target: '.tutorial-calculate',
    tab: null,
    order: 11
  }
];

const getTutorialStatus = () => {
  if (typeof window === 'undefined') return { completed: false, step: 0 };
  const status = localStorage.getItem('taxcul-tutorial-status');
  return status ? JSON.parse(status) : { completed: false, step: 0 };
};

const saveTutorialStatus = (completed = false, step = 0) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('taxcul-tutorial-status', JSON.stringify({ completed, step }));
};

const ZIMBABWE_TAX_RULES = {
  corporateTaxRate: 0.25,
  aidsLevyRate: 0.03,
  
  // Updated 2025/2026 Tax Year
  taxYear: '2025/2026',
  lastUpdated: 'January 2026',
  
  capitalAllowanceRates: {
    motorVehicles: { special: 0.5, accelerated: 0.25, wearTear: 0.2 },
    moveableAssets: { special: 0.5, accelerated: 0.25, wearTear: 0.1 },
    commercialBuildings: { special: 0, accelerated: 0, wearTear: 0.025 },
    industrialBuildings: { special: 0, accelerated: 0, wearTear: 0.05 },
    leaseImprovements: { special: 0.5, accelerated: 0.25, wearTear: 0.05 },
    itEquipment: { special: 0.5, accelerated: 0.25, wearTear: 0.333 }
  },
  
  // Updated PAYE Bands for 2025/2026 (Monthly USD)
  payeBandsUSD: [
    { min: 0, max: 100, rate: 0.00, deduct: 0 },
    { min: 100.01, max: 300, rate: 0.20, deduct: 20 },
    { min: 300.01, max: 1000, rate: 0.25, deduct: 35 },
    { min: 1000.01, max: 2000, rate: 0.30, deduct: 85 },
    { min: 2000.01, max: 3000, rate: 0.35, deduct: 185 },
    { min: 3000.01, max: Infinity, rate: 0.40, deduct: 335 },
  ],
  
  // Updated PAYE Bands for 2025/2026 (Monthly ZiG)
  payeBandsZIG: [
    { min: 0, max: 2800, rate: 0.00, deduct: 0 },
    { min: 2800.01, max: 8400, rate: 0.20, deduct: 560 },
    { min: 8400.01, max: 28000, rate: 0.25, deduct: 980 },
    { min: 28000.01, max: 56000, rate: 0.30, deduct: 2380 },
    { min: 56000.01, max: 84000, rate: 0.35, deduct: 5180 },
    { min: 84000.01, max: Infinity, rate: 0.40, deduct: 9380 },
  ],
  
  // Legacy bands for backward compatibility (Annual)
  payeBands: [
    { min: 0, max: 1200, rate: 0.00, deduct: 0 },
    { min: 1200.01, max: 3600, rate: 0.20, deduct: 240 },
    { min: 3600.01, max: 12000, rate: 0.25, deduct: 420 },
    { min: 12000.01, max: 24000, rate: 0.30, deduct: 1020 },
    { min: 24000.01, max: 36000, rate: 0.35, deduct: 2220 },
    { min: 36000.01, max: Infinity, rate: 0.40, deduct: 4020 },
  ],
  
  vatRate: 0.15, // Updated to 15% (2025)
  
  withholdingTaxRates: {
    royalties: 0.15,
    fees: 0.15,
    interest: 0.10,
    tenders: 0.10,
    digitalServices: 0.15, // NEW: Digital Services Withholding Tax (2026)
  },
  
  // NEW: 2026 Digital Services Tax
  digitalServicesTax: {
    rate: 0.15,
    effectiveDate: 'January 2026',
    applicableTo: [
      'Netflix', 'Spotify', 'Amazon Prime', 'Disney+',
      'Apple Music', 'YouTube Premium', 'Starlink',
      'Bolt', 'InDrive', 'Uber', 'Other foreign digital platforms'
    ],
    description: 'Withholding tax on payments to foreign digital service providers'
  },
  
  baseCurrency: 'USD',
  
  currencies: {
    USD: {
      symbol: 'US$',
      code: 'USD',
      name: 'United States Dollar',
      isBaseCurrency: true,
      decimalPlaces: 2,
      exchangeRateToBase: 1.0,
      taxRate: 0.25,
      color: '#1ED760',
      requiresWithholdingTax: true,
      withholdingRate: 0.15,
      isReportingCurrency: true
    },
    ZWG: {
      symbol: 'Z$',
      code: 'ZWG',
      name: 'Zimbabwe Gold',
      isBaseCurrency: false,
      decimalPlaces: 2,
      exchangeRateToBase: 0.0025,
      taxRate: 0.25,
      color: '#FFD700',
      requiresExchangeGainsTax: true,
      exchangeGainsRate: 0.20,
      requiresInflationAdjustment: true,
      reportingThreshold: 10000000,
      isReportingCurrency: true
    },
    ZAR: {
      symbol: 'R',
      code: 'ZAR',
      name: 'South African Rand',
      isBaseCurrency: false,
      decimalPlaces: 2,
      exchangeRateToBase: 0.055,
      taxRate: 0.25,
      color: '#0F2F4E',
      requiresTransferPricing: true,
      isReportingCurrency: false
    },
    GBP: {
      symbol: '£',
      code: 'GBP',
      name: 'British Pound',
      isBaseCurrency: false,
      decimalPlaces: 2,
      exchangeRateToBase: 1.27,
      taxRate: 0.25,
      color: '#8b5cf6',
      requiresForeignTaxCredit: true,
      isReportingCurrency: false
    },
    EUR: {
      symbol: '€',
      code: 'EUR',
      name: 'Euro',
      isBaseCurrency: false,
      decimalPlaces: 2,
      exchangeRateToBase: 1.10,
      taxRate: 0.25,
      color: '#84cc16',
      isReportingCurrency: false
    }
  },
  
  currencyAdjustments: {
    ZWG: {
      inflationRate: 0.45,
      indexedAllowances: true,
      deductibleInLocalCurrency: true,
      nonDeductibleExchangeLosses: true
    },
    USD: {
      transferPricingRequired: true
    },
    ZAR: {
      requiresBilateralAgreement: true,
      withholdingOnDividends: 0.05
    }
  },
  
  exchangeRateScenarios: {
    stable: {
      description: 'Stable exchange rates',
      volatility: 0.05,
      probability: 0.3
    },
    moderate: {
      description: 'Moderate volatility',
      volatility: 0.15,
      probability: 0.5
    },
    high: {
      description: 'High volatility (ZWG devaluation)',
      volatility: 0.35,
      probability: 0.2
    }
  },
  
  complianceRules: {
    dualReporting: true,
    exchangeRateSource: 'Reserve Bank of Zimbabwe',
    recordKeepingYears: 5,
    transferPricingThreshold: 100000,
    thinCapitalizationRules: true
  }
};

const CurrencyUtils = {
  convert: (amount, fromCurrency, toCurrency, exchangeRates = ZIMBABWE_TAX_RULES.currencies) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.error(`Invalid currency: ${fromCurrency} or ${toCurrency}`);
      return amount;
    }
    
    const amountInBase = amount / exchangeRates[fromCurrency].exchangeRateToBase;
    return amountInBase * exchangeRates[toCurrency].exchangeRateToBase;
  },
  
  toBaseCurrency: (amount, fromCurrency) => {
    return CurrencyUtils.convert(amount, fromCurrency, ZIMBABWE_TAX_RULES.baseCurrency);
  },
  
  format: (amount, currencyCode = 'USD', options = {}) => {
    const currency = ZIMBABWE_TAX_RULES.currencies[currencyCode];
    if (!currency) {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    const formattedAmount = amount.toLocaleString(undefined, {
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    });
    
    if (options.showCode) {
      return `${currency.symbol}${formattedAmount} (${currencyCode})`;
    }
    
    return `${currency.symbol}${formattedAmount}`;
  },
  
  calculateExchangeGains: (openingBalance, closingBalance, exchangeRateOpening, exchangeRateClosing) => {
    const openingInBase = openingBalance / exchangeRateOpening;
    const closingInBase = closingBalance / exchangeRateClosing;
    return closingInBase - openingInBase;
  },
  
  getCurrencyColor: (currencyCode) => {
    return ZIMBABWE_TAX_RULES.currencies[currencyCode]?.color || '#6b7280';
  }
};

const createPeriods = (years = 3, periodType = 'annually', currencyConfig = {}) => {
  const periods = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = 0; year < years; year++) {
    const targetYear = currentYear + year;
    
    const exchangeRates = {};
    Object.keys(ZIMBABWE_TAX_RULES.currencies).forEach(currency => {
      if (currency !== ZIMBABWE_TAX_RULES.baseCurrency) {
        const baseRate = ZIMBABWE_TAX_RULES.currencies[currency].exchangeRateToBase;
        exchangeRates[currency] = {
          base: baseRate,
          stable: baseRate * (1 + (Math.random() * 0.1 - 0.05)),
          moderate: baseRate * (1 + (Math.random() * 0.3 - 0.15)),
          high: baseRate * (1 + (Math.random() * 0.7 - 0.35))
        };
      }
    });
    
    if (periodType === 'annually') {
      periods.push({
        id: `year-${targetYear}`,
        type: 'annually',
        year: targetYear,
        periodNumber: 1,
        label: `Year ${targetYear}`,
        actuals: {},
        budget: {},
        projections: {},
        taxResult: null,
        adjustments: {
          nonDeductible: 0,
          nonTaxable: 0,
          capitalAllowances: 0,
          exchangeGainsLosses: 0
        },
        currencyData: {
          baseCurrency: ZIMBABWE_TAX_RULES.baseCurrency,
          exchangeRates,
          currencyMix: currencyConfig.mix || {
            USD: 0.7,
            ZWG: 0.2,
            ZAR: 0.1
          },
          inflationAdjustment: currencyConfig.inflationAdjustment || 0
        }
      });
    } else if (periodType === 'quarterly') {
      for (let quarter = 1; quarter <= 4; quarter++) {
        periods.push({
          id: `year-${targetYear}-q${quarter}`,
          type: 'quarterly',
          year: targetYear,
          periodNumber: quarter,
          label: `Q${quarter} ${targetYear}`,
          actuals: {},
          budget: {},
          projections: {},
          taxResult: null,
          adjustments: {
            nonDeductible: 0,
            nonTaxable: 0,
            capitalAllowances: 0,
            exchangeGainsLosses: 0
          },
          currencyData: {
            baseCurrency: ZIMBABWE_TAX_RULES.baseCurrency,
            exchangeRates,
            currencyMix: currencyConfig.mix || {
              USD: 0.7,
              ZWG: 0.2,
              ZAR: 0.1
            },
            inflationAdjustment: (currencyConfig.inflationAdjustment || 0) * (quarter / 4)
          }
        });
      }
    } else if (periodType === 'monthly') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let month = 1; month <= 12; month++) {
        periods.push({
          id: `year-${targetYear}-m${month}`,
          type: 'monthly',
          year: targetYear,
          periodNumber: month,
          label: `${monthNames[month-1]} ${targetYear}`,
          actuals: {},
          budget: {},
          projections: {},
          taxResult: null,
          adjustments: {
            nonDeductible: 0,
            nonTaxable: 0,
            capitalAllowances: 0,
            exchangeGainsLosses: 0
          },
          currencyData: {
            baseCurrency: ZIMBABWE_TAX_RULES.baseCurrency,
            exchangeRates,
            currencyMix: currencyConfig.mix || {
              USD: 0.7,
              ZWG: 0.2,
              ZAR: 0.1
            },
            inflationAdjustment: (currencyConfig.inflationAdjustment || 0) * (month / 12)
          }
        });
      }
    }
  }
  
  return periods;
};

const createScenario = (name, type, baseData, currencyConfig = {}) => {
  const defaultCurrencyMix = {
    USD: 0.7,
    ZWG: 0.2,
    ZAR: 0.1,
    GBP: 0.0,
    EUR: 0.0
  };
  
  const drivers = {
    revenueGrowth: type === 'growth' ? 0.2 : type === 'recession' ? -0.1 : 0,
    marginChange: 0,
    expensePercentage: type === 'cost-cutting' ? -0.15 : type === 'inflation' ? 0.25 : 0,
    capexSchedule: [],
    staffCount: type === 'expansion' ? 0.2 : 0,
    salaryGrowth: type === 'inflation' ? 0.3 : 0.1,
    capitalAllowanceRate: 0.1,
    
    currencyMix: currencyConfig.mix || defaultCurrencyMix,
    exchangeRateScenario: currencyConfig.exchangeRateScenario || 'moderate',
    inflationRate: currencyConfig.inflationRate || 0.1,
    
    zwgDevaluationRisk: currencyConfig.zwgDevaluationRisk || 0.3,
    usdLiquidity: currencyConfig.usdLiquidity || 0.8,
    
    capitalAllowanceOptimization: type === 'tax-optimization' ? true : false,
    transferPricingAdjustment: 0,
    withholdingTaxMitigation: type === 'tax-optimization' ? true : false
  };
  
  if (type === 'zwg-heavy') {
    drivers.currencyMix = { USD: 0.3, ZWG: 0.6, ZAR: 0.1 };
    drivers.zwgDevaluationRisk = 0.5;
  } else if (type === 'usd-heavy') {
    drivers.currencyMix = { USD: 0.9, ZWG: 0.1, ZAR: 0.0 };
    drivers.zwgDevaluationRisk = 0.1;
  } else if (type === 'export-focused') {
    drivers.currencyMix = { USD: 0.8, ZWG: 0.1, ZAR: 0.05, GBP: 0.05 };
  }
  
  return {
    id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    description: '',
    drivers,
    periods: baseData?.periods ? [...baseData.periods] : [],
    currencyConfig: {
      ...currencyConfig,
      baseCurrency: ZIMBABWE_TAX_RULES.baseCurrency,
      reportingCurrencies: ['USD', 'ZWG'],
      exchangeRateVolatility: drivers.exchangeRateScenario
    },
    taxImplications: {
      exchangeGainsTaxable: true,
      foreignCurrencyBorrowingRules: true,
      transferPricingDocumentation: drivers.currencyMix.USD < 0.5
    },
    createdAt: new Date().toISOString(),
    isBase: type === 'base'
  };
};

const calculateTaxProfit = (accountingProfit, adjustments, capitalAllowances, previousLosses = 0, currencyData = {}) => {
  let taxableIncome = accountingProfit;
  
  taxableIncome += adjustments.nonDeductible || 0;
  taxableIncome -= adjustments.nonTaxable || 0;
  
  const lossesToUse = Math.min(previousLosses, Math.max(0, taxableIncome));
  taxableIncome = Math.max(0, taxableIncome - lossesToUse);
  
  taxableIncome = Math.max(0, taxableIncome - capitalAllowances);
  
  if (adjustments.exchangeGainsLosses) {
    const exchangeGainsLosses = adjustments.exchangeGainsLosses;
    if (exchangeGainsLosses > 0) {
      taxableIncome += exchangeGainsLosses;
    } else {
      const exchangeLossDeductible = currencyData.currency === 'ZWG' ? 
        ZIMBABWE_TAX_RULES.currencyAdjustments.ZWG?.nonDeductibleExchangeLosses ? 0 : exchangeGainsLosses :
        exchangeGainsLosses;
      
      taxableIncome += exchangeLossDeductible;
    }
  }
  
  const taxDue = taxableIncome * ZIMBABWE_TAX_RULES.corporateTaxRate;
  const aidsLevy = taxDue * ZIMBABWE_TAX_RULES.aidsLevyRate;
  const totalTax = taxDue + aidsLevy;
  
  const newLossesCarriedForward = Math.max(0, previousLosses - lossesToUse);
  
  return {
    taxableIncome,
    taxDue,
    aidsLevy,
    totalTax,
    effectiveTaxRate: taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0,
    lossesUtilized: lossesToUse,
    lossesCarriedForward: newLossesCarriedForward,
    capitalAllowancesUsed: capitalAllowances,
    accountingProfit,
    currencyBreakdown: currencyData.breakdown || {},
    exchangeImpact: adjustments.exchangeGainsLosses || 0,
    inflationAdjustment: currencyData.inflationAdjustment || 0
  };
};

const CurrencyMixer = ({ scenario, onUpdate, disabled = false }) => {
  const [currencyMix, setCurrencyMix] = useState(scenario?.drivers?.currencyMix || {
    USD: 0.7,
    ZWG: 0.2,
    ZAR: 0.1,
    GBP: 0.0,
    EUR: 0.0
  });
  
  const [exchangeRateScenario, setExchangeRateScenario] = useState(
    scenario?.drivers?.exchangeRateScenario || 'moderate'
  );
  
  const totalPercentage = Object.values(currencyMix).reduce((sum, val) => sum + val, 0);
  
  useEffect(() => {
    if (scenario?.drivers?.currencyMix) {
      setCurrencyMix(scenario.drivers.currencyMix);
    }
    if (scenario?.drivers?.exchangeRateScenario) {
      setExchangeRateScenario(scenario.drivers.exchangeRateScenario);
    }
  }, [scenario]);
  
  const handleCurrencyChange = (currency, value) => {
    const numValue = parseFloat(value) / 100;
    if (isNaN(numValue)) return;
    
    const newMix = { ...currencyMix, [currency]: numValue };
    
    const currentTotal = Object.values(newMix).reduce((sum, val) => sum + val, 0);
    if (currentTotal > 1) {
      Object.keys(newMix).forEach(key => {
        newMix[key] = newMix[key] / currentTotal;
      });
    }
    
    setCurrencyMix(newMix);
    
    if (onUpdate) {
      onUpdate({
        ...scenario,
        drivers: {
          ...scenario.drivers,
          currencyMix: newMix
        }
      });
    }
  };
  
  const handleScenarioChange = (scenarioType) => {
    setExchangeRateScenario(scenarioType);
    
    if (onUpdate) {
      onUpdate({
        ...scenario,
        drivers: {
          ...scenario.drivers,
          exchangeRateScenario: scenarioType
        }
      });
    }
  };
  
  const applyPreset = (presetName) => {
    let newMix;
    
    switch(presetName) {
      case 'zwg-heavy':
        newMix = { USD: 0.3, ZWG: 0.6, ZAR: 0.1, GBP: 0.0, EUR: 0.0 };
        break;
      case 'usd-heavy':
        newMix = { USD: 0.9, ZWG: 0.1, ZAR: 0.0, GBP: 0.0, EUR: 0.0 };
        break;
      case 'export-focused':
        newMix = { USD: 0.8, ZWG: 0.1, ZAR: 0.05, GBP: 0.05, EUR: 0.0 };
        break;
      case 'regional-trader':
        newMix = { USD: 0.5, ZWG: 0.2, ZAR: 0.2, GBP: 0.05, EUR: 0.05 };
        break;
      default:
        newMix = { USD: 0.7, ZWG: 0.2, ZAR: 0.1, GBP: 0.0, EUR: 0.0 };
    }
    
    setCurrencyMix(newMix);
    
    if (onUpdate) {
      onUpdate({
        ...scenario,
        drivers: {
          ...scenario.drivers,
          currencyMix: newMix
        }
      });
    }
  };
  
  const exchangeRateInfo = ZIMBABWE_TAX_RULES.exchangeRateScenarios[exchangeRateScenario];
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-currency-mixer">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Currency Mix & Exchange Rate Scenarios</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#0F2F4E]">Currency Mix (%)</span>
          <span className="text-xs text-[#0F2F4E]/70">
            Total: {(totalPercentage * 100).toFixed(1)}%
          </span>
        </div>
        
        {Object.entries(currencyMix).map(([currency, percentage]) => (
          <div key={currency} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-[#0F2F4E]">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: CurrencyUtils.getCurrencyColor(currency) }}
                ></span>
                {ZIMBABWE_TAX_RULES.currencies[currency]?.name || currency}
              </span>
              <span className="text-sm font-medium" style={{ color: CurrencyUtils.getCurrencyColor(currency) }}>
                {(percentage * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage * 100}
              onChange={(e) => handleCurrencyChange(currency, e.target.value)}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${CurrencyUtils.getCurrencyColor(currency)} ${percentage * 100}%, #e5e7eb ${percentage * 100}%)`
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-[#0F2F4E] mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('zwg-heavy')}
            className="px-3 py-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-100"
            disabled={disabled}
          >
            ZWG Heavy (60%)
          </button>
          <button
            onClick={() => applyPreset('usd-heavy')}
            className="px-3 py-2 text-xs bg-green-50 border border-green-200 text-green-800 rounded-lg hover:bg-green-100"
            disabled={disabled}
          >
            USD Heavy (90%)
          </button>
          <button
            onClick={() => applyPreset('export-focused')}
            className="px-3 py-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 rounded-lg hover:bg-blue-100"
            disabled={disabled}
          >
            Export Focused
          </button>
          <button
            onClick={() => applyPreset('regional-trader')}
            className="px-3 py-2 text-xs bg-purple-50 border border-purple-200 text-purple-800 rounded-lg hover:bg-purple-100"
            disabled={disabled}
          >
            Regional Trader
          </button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-[#0F2F4E] mb-3">Exchange Rate Volatility Scenario</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(ZIMBABWE_TAX_RULES.exchangeRateScenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => handleScenarioChange(key)}
              disabled={disabled}
              className={`p-3 rounded-lg border text-left transition ${
                exchangeRateScenario === key
                  ? 'border-[#1ED760] bg-[#1ED760]/5'
                  : 'border-[#EEEEEE] hover:border-[#1ED760]'
              }`}
            >
              <div className="font-medium text-sm text-[#0F2F4E] mb-1">
                {scenario.description}
              </div>
              <div className="text-xs text-[#0F2F4E]/70">
                Volatility: ±{(scenario.volatility * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-[#1ED760] mt-1">
                Probability: {(scenario.probability * 100).toFixed(0)}%
              </div>
            </button>
          ))}
        </div>
        
        {exchangeRateInfo && (
          <div className="mt-4 p-3 bg-[#0F2F4E]/5 rounded-lg">
            <div className="text-sm text-[#0F2F4E] mb-1">
              {exchangeRateInfo.description} Impact:
            </div>
            <div className="text-xs text-[#0F2F4E]/70">
              • ZWG exchange rate may fluctuate by ±{(exchangeRateInfo.volatility * 100).toFixed(0)}%
              <br/>
              • Higher volatility increases exchange gains/losses tax impact
              <br/>
              • Consider hedging strategies for ZWG exposure above 30%
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-[#EEEEEE]">
        <h4 className="text-sm font-medium text-[#0F2F4E] mb-3">Currency Risk Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#0F2F4E]/70">ZWG Exposure:</span>
            <span className={`font-medium ${
              currencyMix.ZWG > 0.4 ? 'text-red-600' : 
              currencyMix.ZWG > 0.2 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {(currencyMix.ZWG * 100).toFixed(1)}%
              {currencyMix.ZWG > 0.4 && ' (High Risk)'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#0F2F4E]/70">USD Liquidity:</span>
            <span className={`font-medium ${
              currencyMix.USD > 0.7 ? 'text-green-600' : 
              currencyMix.USD > 0.4 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(currencyMix.USD * 100).toFixed(1)}%
              {currencyMix.USD < 0.4 && ' (Low Liquidity)'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#0F2F4E]/70">Exchange Rate Risk:</span>
            <span className={`font-medium ${
              exchangeRateScenario === 'high' ? 'text-red-600' : 
              exchangeRateScenario === 'moderate' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {exchangeRateScenario.charAt(0).toUpperCase() + exchangeRateScenario.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrencyImpactAnalysis = ({ scenarios, periods, activeScenario }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('ZWG');
  const [view, setView] = useState('tax');
  
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm text-center">
        <p className="text-[#0F2F4E]/60">No scenario data available</p>
      </div>
    );
  }
  
  const activeScenarioData = scenarios.find(s => s.id === activeScenario);
  if (!activeScenarioData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm text-center">
        <p className="text-[#0F2F4E]/60">Select a scenario to view currency impact</p>
      </div>
    );
  }
  
  const calculateCurrencyImpact = () => {
    const impactData = periods.map((period, index) => {
      const periodData = activeScenarioData.periods?.[index];
      const currencyMix = activeScenarioData.drivers?.currencyMix || {};
      
      let exchangeImpact = 0;
      let inflationImpact = 0;
      
      Object.entries(currencyMix).forEach(([currency, percentage]) => {
        if (currency !== 'USD' && percentage > 0) {
          const currencyConfig = ZIMBABWE_TAX_RULES.currencies[currency];
          const volatility = ZIMBABWE_TAX_RULES.exchangeRateScenarios[
            activeScenarioData.drivers?.exchangeRateScenario || 'moderate'
          ].volatility;
          
          const exchangeChange = (Math.random() * volatility * 2 - volatility);
          exchangeImpact += (periodData?.actuals?.revenue || 100000) * percentage * exchangeChange;
          
          if (currency === 'ZWG') {
            inflationImpact += (periodData?.actuals?.expenses || 50000) * percentage * 
              ZIMBABWE_TAX_RULES.currencyAdjustments.ZWG?.inflationRate || 0.3;
          }
        }
      });
      
      const taxResult = periodData?.taxResult || {};
      
      return {
        period: period.label,
        baseTax: taxResult.totalTax || 0,
        exchangeImpact: exchangeImpact * ZIMBABWE_TAX_RULES.corporateTaxRate,
        inflationImpact: inflationImpact * ZIMBABWE_TAX_RULES.corporateTaxRate,
        totalTax: (taxResult.totalTax || 0) + (exchangeImpact * ZIMBABWE_TAX_RULES.corporateTaxRate) + 
                 (inflationImpact * ZIMBABWE_TAX_RULES.corporateTaxRate),
        currencyMix: currencyMix[selectedCurrency] || 0,
        exchangeRate: ZIMBABWE_TAX_RULES.currencies[selectedCurrency]?.exchangeRateToBase || 1
      };
    });
    
    return impactData;
  };
  
  const impactData = calculateCurrencyImpact();
  
  const totalBaseTax = impactData.reduce((sum, d) => sum + d.baseTax, 0);
  const totalExchangeImpact = impactData.reduce((sum, d) => sum + d.exchangeImpact, 0);
  const totalInflationImpact = impactData.reduce((sum, d) => sum + d.inflationImpact, 0);
  const totalImpact = totalExchangeImpact + totalInflationImpact;
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-currency-risk">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0F2F4E]">Currency Impact Analysis</h3>
          <p className="text-sm text-[#0F2F4E]/70">
            Scenario: <span className="font-medium">{activeScenarioData.name}</span>
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-3 py-2 border border-[#EEEEEE] rounded-lg text-sm"
          >
            {Object.keys(ZIMBABWE_TAX_RULES.currencies)
              .filter(c => c !== ZIMBABWE_TAX_RULES.baseCurrency)
              .map(currency => (
                <option key={currency} value={currency}>
                  {ZIMBABWE_TAX_RULES.currencies[currency].name} ({currency})
                </option>
              ))}
          </select>
          
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-3 py-2 border border-[#EEEEEE] rounded-lg text-sm"
          >
            <option value="tax">Tax Impact</option>
            <option value="profit">Profit Impact</option>
            <option value="revenue">Revenue Impact</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 rounded-lg text-white">
          <div className="text-xs opacity-90">Base Tax</div>
          <div className="text-xl font-bold mt-1">
            {CurrencyUtils.format(totalBaseTax, 'USD')}
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 rounded-lg text-[#0F2F4E]">
          <div className="text-xs opacity-90">Exchange Impact</div>
          <div className="text-xl font-bold mt-1">
            {CurrencyUtils.format(totalExchangeImpact, 'USD')}
          </div>
          <div className="text-xs opacity-80 mt-1">
            {(totalExchangeImpact / totalBaseTax * 100).toFixed(1)}% of base
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 rounded-lg text-white">
          <div className="text-xs opacity-90">Inflation Impact</div>
          <div className="text-xl font-bold mt-1">
            {CurrencyUtils.format(totalInflationImpact, 'USD')}
          </div>
          <div className="text-xs opacity-80 mt-1">
            ZWG inflation adjustment
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-[#ef4444] to-[#ef4444]/80 rounded-lg text-white">
          <div className="text-xs opacity-90">Total Impact</div>
          <div className="text-xl font-bold mt-1">
            {CurrencyUtils.format(totalImpact, 'USD')}
          </div>
          <div className="text-xs opacity-80 mt-1">
            ±{(totalImpact / totalBaseTax * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={impactData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
            <XAxis dataKey="period" stroke="#0F2F4E" fontSize={12} />
            <YAxis 
              stroke="#0F2F4E" 
              fontSize={12}
              tickFormatter={(value) => CurrencyUtils.format(value, 'USD', { showCode: false })}
            />
            <Tooltip 
              formatter={(value) => [CurrencyUtils.format(value, 'USD'), 'Amount']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="baseTax" 
              name="Base Tax"
              stackId="1"
              stroke="#1ED760"
              fill="#1ED760"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="exchangeImpact" 
              name="Exchange Impact"
              stackId="1"
              stroke="#FFD700"
              fill="#FFD700"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="inflationImpact" 
              name="Inflation Impact"
              stackId="1"
              stroke="#0F2F4E"
              fill="#0F2F4E"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0F2F4E]/5">
            <tr>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">{selectedCurrency} Mix</th>
              <th className="p-3 text-left">Exchange Rate</th>
              <th className="p-3 text-left">Base Tax</th>
              <th className="p-3 text-left">Currency Impact</th>
              <th className="p-3 text-left">Total Tax</th>
            </tr>
          </thead>
          <tbody>
            {impactData.map((row, index) => (
              <tr key={index} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                <td className="p-3 font-medium">{row.period}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${row.currencyMix * 100}%`,
                          backgroundColor: CurrencyUtils.getCurrencyColor(selectedCurrency)
                        }}
                      ></div>
                    </div>
                    <span>{(row.currencyMix * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td className="p-3">
                  1 {selectedCurrency} = {row.exchangeRate.toFixed(4)} USD
                </td>
                <td className="p-3">
                  {CurrencyUtils.format(row.baseTax, 'USD')}
                </td>
                <td className="p-3" style={{ color: (row.exchangeImpact + row.inflationImpact) >= 0 ? '#ef4444' : '#10b981' }}>
                  {CurrencyUtils.format(row.exchangeImpact + row.inflationImpact, 'USD')}
                </td>
                <td className="p-3 font-medium">
                  {CurrencyUtils.format(row.totalTax, 'USD')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Currency Risk Recommendations</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• ZWG exposure {(impactData[0]?.currencyMix * 100).toFixed(1)}% - {impactData[0]?.currencyMix > 0.3 ? 'Consider hedging strategies' : 'Acceptable level'}</li>
          <li>• Exchange rate volatility: {activeScenarioData.drivers?.exchangeRateScenario || 'moderate'} scenario</li>
          <li>• Total currency tax impact: {CurrencyUtils.format(totalImpact, 'USD')} ({(totalImpact/totalBaseTax*100).toFixed(1)}% of base tax)</li>
          <li>• Consider diversifying currency mix if ZWG exposure exceeds 40%</li>
        </ul>
      </div>
    </div>
  );
};

const MultiCurrencyScenarioComparison = ({ scenarios }) => {
  if (scenarios.length < 2) {
    return (
      <div className="bg-white rounded-xl p-8 border border-[#EEEEEE] shadow-sm text-center">
        <p className="text-[#0F2F4E]/60">Create multiple scenarios to enable comparison</p>
      </div>
    );
  }
  
  const comparisonData = scenarios.map(scenario => {
    const totalTax = scenario.periods?.reduce((sum, period) => 
      sum + (period.taxResult?.totalTax || 0), 0) || 0;
    
    const totalProfit = scenario.periods?.reduce((sum, period) => 
      sum + (period.taxResult?.taxableIncome || 0), 0) || 0;
    
    const currencyMix = scenario.drivers?.currencyMix || {};
    const zwgExposure = currencyMix.ZWG || 0;
    const usdLiquidity = currencyMix.USD || 0;
    
    const exchangeRateScenario = scenario.drivers?.exchangeRateScenario || 'moderate';
    const volatility = ZIMBABWE_TAX_RULES.exchangeRateScenarios[exchangeRateScenario].volatility;
    const currencyImpact = totalTax * zwgExposure * volatility * 0.5;
    
    const totalTaxWithCurrency = totalTax + currencyImpact;
    
    return {
      name: scenario.name,
      type: scenario.type,
      totalTax,
      totalTaxWithCurrency,
      totalProfit,
      effectiveRate: totalProfit > 0 ? (totalTax / totalProfit) * 100 : 0,
      effectiveRateWithCurrency: totalProfit > 0 ? (totalTaxWithCurrency / totalProfit) * 100 : 0,
      currencyImpact,
      zwgExposure: zwgExposure * 100,
      usdLiquidity: usdLiquidity * 100,
      color: scenario.type === 'base' ? '#0F2F4E' : 
             scenario.type === 'growth' ? '#1ED760' : 
             scenario.type === 'zwg-heavy' ? '#FFD700' :
             scenario.type === 'usd-heavy' ? '#84cc16' : 
             scenario.type === 'cost-cutting' ? '#f97316' : 
             scenario.type === 'tax-optimization' ? '#8b5cf6' : '#ec4899'
    };
  });
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Multi-Currency Scenario Comparison</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {comparisonData.map((scenario, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition" style={{ borderColor: scenario.color }}>
            <div className="font-medium text-[#0F2F4E] mb-2">{scenario.name}</div>
            
            <div className="space-y-2">
              <div>
                <div className="text-sm text-[#0F2F4E]/70">Base Tax</div>
                <div className="text-lg font-bold" style={{ color: scenario.color }}>
                  {CurrencyUtils.format(scenario.totalTax, 'USD')}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-[#0F2F4E]/70">With Currency Impact</div>
                <div className="text-xl font-bold text-[#0F2F4E]">
                  {CurrencyUtils.format(scenario.totalTaxWithCurrency, 'USD')}
                </div>
                <div className={`text-xs ${scenario.currencyImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {scenario.currencyImpact >= 0 ? '+' : ''}{CurrencyUtils.format(scenario.currencyImpact, 'USD')}
                  ({scenario.totalTax > 0 ? ((scenario.currencyImpact/scenario.totalTax)*100).toFixed(1) : 0}%)
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>ZWG Exposure:</span>
                <span className={`font-medium ${
                  scenario.zwgExposure > 40 ? 'text-red-600' : 
                  scenario.zwgExposure > 20 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {scenario.zwgExposure.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>USD Liquidity:</span>
                <span className={`font-medium ${
                  scenario.usdLiquidity > 70 ? 'text-green-600' : 
                  scenario.usdLiquidity > 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {scenario.usdLiquidity.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Effective Rate:</span>
                <span className="font-medium">{scenario.effectiveRateWithCurrency.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <XAxis 
              dataKey="name" 
              stroke="#0F2F4E" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#0F2F4E" 
              fontSize={12}
              tickFormatter={(value) => CurrencyUtils.format(value, 'USD', { showCode: false })}
            />
            <Tooltip 
              formatter={(value, name) => [
                CurrencyUtils.format(value, 'USD'),
                name === 'totalTax' ? 'Base Tax' : 
                name === 'currencyImpact' ? 'Currency Impact' : 'Total Tax'
              ]}
              labelFormatter={(label) => `Scenario: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="totalTax" 
              name="Base Tax"
              radius={[4, 4, 0, 0]}
              fill="#1ED760"
            />
            <Bar 
              dataKey="currencyImpact" 
              name="Currency Impact"
              radius={[4, 4, 0, 0]}
              fill="#FFD700"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-medium text-[#0F2F4E] mb-4">Currency Exposure Comparison</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={comparisonData.map(d => ({
              scenario: d.name,
              ZWG: d.zwgExposure,
              USD: d.usdLiquidity,
              'Currency Impact': Math.abs(d.currencyImpact / (d.totalTax || 1) * 100)
            }))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="scenario" stroke="#0F2F4E" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#0F2F4E" />
              <Radar 
                name="ZWG Exposure (%)" 
                dataKey="ZWG" 
                stroke="#FFD700" 
                fill="#FFD700" 
                fillOpacity={0.3}
              />
              <Radar 
                name="USD Liquidity (%)" 
                dataKey="USD" 
                stroke="#1ED760" 
                fill="#1ED760" 
                fillOpacity={0.3}
              />
              <Radar 
                name="Currency Impact (%)" 
                dataKey="Currency Impact" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toFixed(1) + '%' : value,
                  name
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ExchangeRateSimulator = ({ baseScenario, onScenarioUpdate }) => {
  const [simulationData, setSimulationData] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState(['ZWG', 'ZAR', 'GBP']);
  const [timeHorizon, setTimeHorizon] = useState(12);
  const [volatility, setVolatility] = useState(0.15);
  
  useEffect(() => {
    runSimulation();
  }, [selectedCurrencies, timeHorizon, volatility]);
  
  const runSimulation = () => {
    const data = [];
    const baseRates = {};
    
    selectedCurrencies.forEach(currency => {
      baseRates[currency] = ZIMBABWE_TAX_RULES.currencies[currency]?.exchangeRateToBase || 1;
    });
    
    for (let month = 0; month < timeHorizon; month++) {
      const monthData = { month: `M${month + 1}` };
      
      selectedCurrencies.forEach(currency => {
        const randomWalk = baseRates[currency] * 
          (1 + (Math.random() * volatility * 2 - volatility)) * 
          (1 + (0.01 * month));
        
        monthData[currency] = randomWalk;
      });
      
      data.push(monthData);
    }
    
    setSimulationData(data);
  };
  
  const calculateImpact = () => {
    if (!baseScenario || !baseScenario.drivers?.currencyMix) return 0;
    
    let totalImpact = 0;
    const currencyMix = baseScenario.drivers.currencyMix;
    
    selectedCurrencies.forEach(currency => {
      if (currencyMix[currency] > 0) {
        const baseRate = ZIMBABWE_TAX_RULES.currencies[currency]?.exchangeRateToBase || 1;
        const simulatedRate = simulationData[simulationData.length - 1]?.[currency] || baseRate;
        const change = (simulatedRate - baseRate) / baseRate;
        
        totalImpact += change * currencyMix[currency];
      }
    });
    
    return totalImpact;
  };
  
  const impact = calculateImpact();
  const taxImpact = impact * 1000000 * ZIMBABWE_TAX_RULES.corporateTaxRate;
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0F2F4E]">Exchange Rate Simulator</h3>
          <p className="text-sm text-[#0F2F4E]/70">
            Simulate currency movements and tax impact
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            multiple
            value={selectedCurrencies}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedCurrencies(options);
            }}
            className="px-3 py-2 border border-[#EEEEEE] rounded-lg text-sm w-40"
            size={3}
          >
            {Object.keys(ZIMBABWE_TAX_RULES.currencies)
              .filter(c => c !== ZIMBABWE_TAX_RULES.baseCurrency)
              .map(currency => (
                <option key={currency} value={currency}>
                  {currency} - {ZIMBABWE_TAX_RULES.currencies[currency].name}
                </option>
              ))}
          </select>
          
          <button
            onClick={runSimulation}
            className="px-4 py-2 bg-[#1ED760] text-white rounded-lg text-sm hover:bg-[#1ED760]/90"
          >
            Run Simulation
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Time Horizon (Months)</label>
          <input
            type="range"
            min="3"
            max="36"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-[#0F2F4E]/70">{timeHorizon} months</div>
        </div>
        
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Volatility (±%)</label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={volatility * 100}
            onChange={(e) => setVolatility(parseInt(e.target.value) / 100)}
            className="w-full"
          />
          <div className="text-center text-sm text-[#0F2F4E]/70">±{(volatility * 100).toFixed(0)}%</div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-sm text-[#0F2F4E]">Estimated Tax Impact</div>
          <div className={`text-xl font-bold mt-1 ${taxImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {CurrencyUtils.format(taxImpact, 'USD')}
          </div>
          <div className="text-xs text-[#0F2F4E]/70">
            {impact >= 0 ? '+' : ''}{(impact * 100).toFixed(2)}% currency impact
          </div>
        </div>
      </div>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simulationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
            <XAxis dataKey="month" stroke="#0F2F4E" fontSize={12} />
            <YAxis 
              stroke="#0F2F4E" 
              fontSize={12}
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(4)}
            />
            <Tooltip 
              formatter={(value, name) => [
                value.toFixed(4),
                `1 ${name} = ${value.toFixed(4)} USD`
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            {selectedCurrencies.map((currency, index) => (
              <Line 
                key={currency}
                type="monotone" 
                dataKey={currency} 
                name={`${currency} to USD`}
                stroke={CurrencyUtils.getCurrencyColor(currency)}
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto max-h-48">
        <table className="w-full text-xs">
          <thead className="bg-[#0F2F4E]/5">
            <tr>
              <th className="p-2 text-left">Month</th>
              {selectedCurrencies.map(currency => (
                <th key={currency} className="p-2 text-left">
                  1 {currency} = ? USD
                </th>
              ))}
              <th className="p-2 text-left">% Change</th>
            </tr>
          </thead>
          <tbody>
            {simulationData.slice(0, 12).map((row, index) => {
              const prevRow = simulationData[index - 1];
              const changes = selectedCurrencies.map(currency => {
                if (!prevRow) return 0;
                return ((row[currency] - prevRow[currency]) / prevRow[currency] * 100).toFixed(2);
              });
              
              return (
                <tr key={index} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                  <td className="p-2 font-medium">{row.month}</td>
                  {selectedCurrencies.map(currency => (
                    <td key={currency} className="p-2">
                      {row[currency].toFixed(4)}
                    </td>
                  ))}
                  <td className="p-2">
                    {changes.map((change, i) => (
                      <div key={i} className={`text-xs ${parseFloat(change) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {change}%
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-[#0F2F4E] mb-2">Simulation Insights</h4>
        <ul className="text-xs text-[#0F2F4E]/70 space-y-1">
          <li>• ZWG volatility is typically higher than other currencies in Zimbabwe</li>
          <li>• Consider forward contracts for ZWG exposure above 30%</li>
          <li>• Monthly tax provisions should account for exchange rate movements</li>
          <li>• Monitor RBZ exchange rate policies for compliance</li>
        </ul>
      </div>
    </div>
  );
};

const MultiCurrencyComplianceDashboard = ({ scenarios, activeScenario }) => {
  const activeScenarioData = scenarios.find(s => s.id === activeScenario);
  
  if (!activeScenarioData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm text-center">
        <p className="text-[#0F2F4E]/60">Select a scenario to view compliance requirements</p>
      </div>
    );
  }
  
  const currencyMix = activeScenarioData.drivers?.currencyMix || {};
  const zwgExposure = currencyMix.ZWG || 0;
  const usdLiquidity = currencyMix.USD || 0;
  const hasForeignCurrency = Object.entries(currencyMix).some(([currency, percentage]) => 
    currency !== 'USD' && currency !== 'ZWG' && percentage > 0
  );
  
  const complianceRequirements = [
    {
      requirement: 'Dual Currency Reporting',
      description: 'Report in both USD and ZWG as per RBZ requirements',
      applies: ZIMBABWE_TAX_RULES.complianceRules.dualReporting,
      status: zwgExposure > 0 ? 'required' : 'not-required',
      action: 'Maintain separate USD and ZWG ledgers'
    },
    {
      requirement: 'Exchange Rate Documentation',
      description: 'Document source of exchange rates used',
      applies: true,
      status: 'required',
      action: 'Use RBZ published rates or bank statements'
    },
    {
      requirement: 'Transfer Pricing Documentation',
      description: 'Required for cross-border transactions',
      applies: hasForeignCurrency && usdLiquidity < 0.5,
      status: hasForeignCurrency && usdLiquidity < 0.5 ? 'required' : 'not-required',
      action: 'Prepare transfer pricing study'
    },
    {
      requirement: 'Thin Capitalization Rules',
      description: 'Debt-to-equity ratio compliance',
      applies: ZIMBABWE_TAX_RULES.complianceRules.thinCapitalizationRules,
      status: 'monitor',
      action: 'Maintain debt-to-equity below 3:1'
    },
    {
      requirement: 'Exchange Gains/Losses Accounting',
      description: 'Proper accounting of currency fluctuations',
      applies: zwgExposure > 0,
      status: zwgExposure > 0 ? 'required' : 'not-required',
      action: 'Monthly revaluation of ZWG balances'
    },
    {
      requirement: 'Withholding Tax Compliance',
      description: 'Withhold tax on foreign payments',
      applies: hasForeignCurrency,
      status: hasForeignCurrency ? 'required' : 'not-required',
      action: 'Register as withholding agent'
    }
  ];
  
  const requiredItems = complianceRequirements.filter(item => item.status === 'required').length;
  const totalItems = complianceRequirements.filter(item => item.applies).length;
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0F2F4E]">Multi-Currency Compliance Dashboard</h3>
          <p className="text-sm text-[#0F2F4E]/70">
            Scenario: <span className="font-medium">{activeScenarioData.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#1ED760]">{requiredItems}/{totalItems}</div>
            <div className="text-xs text-[#0F2F4E]/70">Requirements</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            requiredItems === totalItems ? 'bg-green-100 text-green-800' :
            requiredItems > totalItems * 0.7 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {requiredItems === totalItems ? 'Compliant' : 
             requiredItems > totalItems * 0.7 ? 'Partially Compliant' : 'Non-Compliant'}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-[#0F2F4E]/70 mb-2">
          <span>Compliance Progress</span>
          <span>{Math.round((requiredItems / totalItems) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#1ED760] to-[#0F2F4E]"
            style={{ width: `${(requiredItems / totalItems) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {complianceRequirements.filter(item => item.applies).map((item, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border ${
              item.status === 'required' ? 'border-red-200 bg-red-50' :
              item.status === 'monitor' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm text-[#0F2F4E] mb-1">
                  {item.requirement}
                </div>
                <div className="text-xs text-[#0F2F4E]/70 mb-2">
                  {item.description}
                </div>
                <div className="text-xs font-medium text-[#0F2F4E]">
                  Action: <span className="text-[#1ED760]">{item.action}</span>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                item.status === 'required' ? 'bg-red-100 text-red-800' :
                item.status === 'monitor' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.status === 'required' ? 'Required' :
                 item.status === 'monitor' ? 'Monitor' : 'Not Required'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-[#0F2F4E]/5 to-[#1ED760]/5 border border-[#0F2F4E]/20 rounded-lg">
        <h4 className="text-sm font-medium text-[#0F2F4E] mb-3">Currency-Specific Compliance Notes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium text-[#0F2F4E] mb-1">ZWG (Zimbabwe Gold)</div>
            <ul className="text-[#0F2F4E]/70 space-y-1">
              <li>• Monthly inflation adjustments may be required</li>
              <li>• Exchange losses may be non-deductible</li>
              <li>• Maintain RBZ exchange rate documentation</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-[#0F2F4E] mb-1">USD (US Dollar)</div>
            <ul className="text-[#0F2F4E]/70 space-y-1">
              <li>• Primary reporting currency for tax purposes</li>
              <li>• Withholding tax on foreign payments</li>
              <li>• Transfer pricing documentation for related parties</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const PeriodManager = ({ periods, activePeriod, onSelectPeriod, onAddPeriod, onPeriodTypeChange }) => {
  const [periodType, setPeriodType] = useState('annually');
  
  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
    onPeriodTypeChange(type);
  };
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-period-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#0F2F4E]">Period Timeline</h3>
        <div className="flex gap-2">
          <select 
            value={periodType}
            onChange={(e) => handlePeriodTypeChange(e.target.value)}
            className="text-sm p-2 border border-[#EEEEEE] rounded-lg"
          >
            <option value="annually">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button 
            onClick={onAddPeriod}
            className="px-3 py-2 bg-[#1ED760] text-white rounded-lg text-sm hover:bg-[#1ED760]/90"
          >
            + Add Year
          </button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto pb-2 gap-2">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => onSelectPeriod(period.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg border transition min-w-[120px] ${
              activePeriod === period.id
                ? 'bg-[#1ED760] text-white border-[#1ED760] shadow-lg'
                : 'bg-white text-[#0F2F4E] border-[#EEEEEE] hover:border-[#1ED760]'
            }`}
          >
            <div className="text-sm font-medium">{period.label}</div>
            <div className="text-xs opacity-70">
              {period.taxResult ? `Tax: ${CurrencyUtils.format(period.taxResult.totalTax || 0, 'USD')}` : 'No data'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ScenarioBuilder = ({ scenarios, activeScenario, onSelectScenario, onCreateScenario, onDeleteScenario }) => {
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioType, setNewScenarioType] = useState('growth');
  const [newCurrencyMix, setNewCurrencyMix] = useState({
    USD: 70,
    ZWG: 20,
    ZAR: 10
  });
  
  const handleCreate = () => {
    if (newScenarioName.trim()) {
      const mix = {
        USD: newCurrencyMix.USD / 100,
        ZWG: newCurrencyMix.ZWG / 100,
        ZAR: newCurrencyMix.ZAR / 100
      };
      
      onCreateScenario(newScenarioName, newScenarioType, { mix });
      setNewScenarioName('');
      setNewCurrencyMix({ USD: 70, ZWG: 20, ZAR: 10 });
    }
  };
  
  const getScenarioColor = (type) => {
    switch(type) {
      case 'base': return '#0F2F4E';
      case 'growth': return '#1ED760';
      case 'cost-cutting': return '#FFD700';
      case 'zwg-heavy': return '#FFD700';
      case 'usd-heavy': return '#84cc16';
      case 'export-focused': return '#8b5cf6';
      case 'tax-optimization': return '#f97316';
      default: return '#6b7280';
    }
  };
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-scenario">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Scenario Management</h3>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20">
        <h4 className="text-md font-medium text-[#0F2F4E] mb-3">Create New Scenario</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            placeholder="Scenario name"
            className="p-2 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
          />
          <select
            value={newScenarioType}
            onChange={(e) => setNewScenarioType(e.target.value)}
            className="p-2 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
          >
            <option value="base">Base Case</option>
            <option value="growth">Growth Plan</option>
            <option value="cost-cutting">Cost Cutting</option>
            <option value="zwg-heavy">ZWG Heavy</option>
            <option value="usd-heavy">USD Heavy</option>
            <option value="export-focused">Export Focused</option>
            <option value="tax-optimization">Tax Optimization</option>
          </select>
          
          <div className="grid grid-cols-3 gap-1">
            <input
              type="number"
              min="0"
              max="100"
              value={newCurrencyMix.USD}
              onChange={(e) => setNewCurrencyMix({...newCurrencyMix, USD: parseInt(e.target.value) || 0})}
              placeholder="USD %"
              className="p-2 border border-[#EEEEEE] rounded-lg text-sm text-center"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newCurrencyMix.ZWG}
              onChange={(e) => setNewCurrencyMix({...newCurrencyMix, ZWG: parseInt(e.target.value) || 0})}
              placeholder="ZWG %"
              className="p-2 border border-[#EEEEEE] rounded-lg text-sm text-center"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newCurrencyMix.ZAR}
              onChange={(e) => setNewCurrencyMix({...newCurrencyMix, ZAR: parseInt(e.target.value) || 0})}
              placeholder="ZAR %"
              className="p-2 border border-[#EEEEEE] rounded-lg text-sm text-center"
            />
          </div>
          
          <button
            onClick={handleCreate}
            className="p-2 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90"
          >
            Create Scenario
          </button>
        </div>
        <div className="mt-2 text-xs text-[#0F2F4E]/70">
          Currency Mix: USD {newCurrencyMix.USD}% | ZWG {newCurrencyMix.ZWG}% | ZAR {newCurrencyMix.ZAR}%
        </div>
      </div>
      
      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-3 rounded-lg border cursor-pointer transition relative group ${
              activeScenario === scenario.id
                ? 'border-[#1ED760] bg-[#1ED760]/5'
                : 'border-[#EEEEEE] hover:border-[#1ED760]'
            }`}
            onClick={() => onSelectScenario(scenario.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getScenarioColor(scenario.type) }}
                ></div>
                <div>
                  <div className="font-medium text-[#0F2F4E]">{scenario.name}</div>
                  <div className="text-sm text-[#0F2F4E]/70">
                    {scenario.type === 'base' ? 'Base Case' : 
                     scenario.type === 'growth' ? 'Growth Plan' : 
                     scenario.type === 'cost-cutting' ? 'Cost Cutting' :
                     scenario.type === 'zwg-heavy' ? 'ZWG Heavy' :
                     scenario.type === 'usd-heavy' ? 'USD Heavy' :
                     scenario.type === 'export-focused' ? 'Export Focused' :
                     scenario.type === 'tax-optimization' ? 'Tax Optimization' : 'Custom'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-[#1ED760]">
                  {scenario.periods?.length || 0} periods
                </div>
                {!scenario.isBase && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScenario(scenario.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {scenario.drivers?.currencyMix && (
              <div className="mt-2 flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#1ED760]"></div>
                  <span>USD: {(scenario.drivers.currencyMix.USD * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                  <span>ZWG: {(scenario.drivers.currencyMix.ZWG * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#0F2F4E]"></div>
                  <span>ZAR: {(scenario.drivers.currencyMix.ZAR * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TaxBalanceSheet = ({ periods, activeScenario, scenarios }) => {
  const scenario = scenarios.find(s => s.id === activeScenario);
  
  if (!scenario || !scenario.periods) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Tax Balance Sheet View</h3>
        <p className="text-[#0F2F4E]/60 text-center py-4">No scenario data available</p>
      </div>
    );
  }
  
  const data = periods.map((period, index) => {
    const periodData = scenario.periods[index];
    const taxResult = periodData?.taxResult;
    
    return {
      period: period.label,
      taxLiability: taxResult?.totalTax || 0,
      lossesCarriedForward: taxResult?.lossesCarriedForward || 0,
      capitalAllowancePool: periodData?.adjustments?.capitalAllowances || 0,
      exchangeImpact: periodData?.adjustments?.exchangeGainsLosses || 0,
      accountingProfit: taxResult?.accountingProfit || 0,
      taxableIncome: taxResult?.taxableIncome || 0
    };
  });
  
  const totals = data.reduce((acc, row) => ({
    taxLiability: acc.taxLiability + row.taxLiability,
    lossesCarriedForward: row.lossesCarriedForward,
    capitalAllowancePool: acc.capitalAllowancePool + row.capitalAllowancePool,
    exchangeImpact: acc.exchangeImpact + row.exchangeImpact,
    accountingProfit: acc.accountingProfit + row.accountingProfit,
    taxableIncome: acc.taxableIncome + row.taxableIncome
  }), { taxLiability: 0, lossesCarriedForward: 0, capitalAllowancePool: 0, exchangeImpact: 0, accountingProfit: 0, taxableIncome: 0 });
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#0F2F4E]">Tax Balance Sheet View</h3>
        <div className="text-sm text-[#0F2F4E]/70">
          Scenario: <span className="font-medium">{scenario.name}</span>
        </div>
      </div>
      
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="bg-[#0F2F4E]/5">
            <tr>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Accounting Profit</th>
              <th className="p-3 text-left">Taxable Income</th>
              <th className="p-3 text-left">Tax Liability</th>
              <th className="p-3 text-left">Exchange Impact</th>
              <th className="p-3 text-left">Losses CF</th>
              <th className="p-3 text-left">Allowance Pool</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                <td className="p-3 font-medium">{row.period}</td>
                <td className="p-3">{CurrencyUtils.format(row.accountingProfit, 'USD')}</td>
                <td className="p-3">
                  <span className="text-blue-600">{CurrencyUtils.format(row.taxableIncome, 'USD')}</span>
                </td>
                <td className="p-3">
                  <span className="text-red-600 font-medium">{CurrencyUtils.format(row.taxLiability, 'USD')}</span>
                </td>
                <td className="p-3">
                  <span className={`font-medium ${row.exchangeImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {CurrencyUtils.format(row.exchangeImpact, 'USD')}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-purple-600">{CurrencyUtils.format(row.lossesCarriedForward, 'USD')}</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">{CurrencyUtils.format(row.capitalAllowancePool, 'USD')}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#0F2F4E]/5 font-semibold">
            <tr>
              <td className="p-3">Total</td>
              <td className="p-3">{CurrencyUtils.format(totals.accountingProfit, 'USD')}</td>
              <td className="p-3">{CurrencyUtils.format(totals.taxableIncome, 'USD')}</td>
              <td className="p-3 text-red-600">{CurrencyUtils.format(totals.taxLiability, 'USD')}</td>
              <td className="p-3">{CurrencyUtils.format(totals.exchangeImpact, 'USD')}</td>
              <td className="p-3 text-purple-600">{CurrencyUtils.format(totals.lossesCarriedForward, 'USD')}</td>
              <td className="p-3 text-green-600">{CurrencyUtils.format(totals.capitalAllowancePool, 'USD')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#EEEEEE]">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-700">Total Tax</div>
          <div className="text-xl font-bold text-red-600">{CurrencyUtils.format(totals.taxLiability, 'USD')}</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">Total Profit</div>
          <div className="text-xl font-bold text-blue-600">{CurrencyUtils.format(totals.taxableIncome, 'USD')}</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-700">Exchange Impact</div>
          <div className="text-xl font-bold text-yellow-600">{CurrencyUtils.format(totals.exchangeImpact, 'USD')}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-700">Final Losses CF</div>
          <div className="text-xl font-bold text-green-600">{CurrencyUtils.format(totals.lossesCarriedForward, 'USD')}</div>
        </div>
      </div>
    </div>
  );
};

const EnhancedCapitalAllowanceModule = ({ periods, onUpdate, assets: externalAssets, onAssetsUpdate }) => {
  const [assets, setAssets] = useState(externalAssets || []);
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'motorVehicles',
    acquisitionDate: new Date().toISOString().split('T')[0],
    cost: '',
    currency: 'USD',
    periodId: periods[0]?.id || ''
  });
  
  useEffect(() => {
    if (externalAssets) {
      setAssets(externalAssets);
    }
  }, [externalAssets]);
  
  const addAsset = () => {
    if (!newAsset.name || !newAsset.cost) {
      alert('Please fill in asset name and cost');
      return;
    }
    
    const costValue = parseFloat(newAsset.cost);
    if (isNaN(costValue) || costValue <= 0) {
      alert('Please enter a valid cost amount');
      return;
    }
    
    let costInUSD = costValue;
    if (newAsset.currency !== 'USD') {
      costInUSD = CurrencyUtils.convert(costValue, newAsset.currency, 'USD');
    }
    
    const asset = {
      ...newAsset,
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      cost: costValue,
      costInUSD: costInUSD,
      writtenDownValue: costInUSD,
      allowances: [],
      acquisitionYear: new Date(newAsset.acquisitionDate).getFullYear()
    };
    
    const updatedAssets = [...assets, asset];
    setAssets(updatedAssets);
    calculateAllowancesForPeriods(updatedAssets);
    onAssetsUpdate?.(updatedAssets);
    
    setNewAsset({
      name: '',
      category: 'motorVehicles',
      acquisitionDate: new Date().toISOString().split('T')[0],
      cost: '',
      currency: 'USD',
      periodId: periods[0]?.id || ''
    });
  };
  
  const removeAsset = (assetId) => {
    const updatedAssets = assets.filter(asset => asset.id !== assetId);
    setAssets(updatedAssets);
    calculateAllowancesForPeriods(updatedAssets);
    onAssetsUpdate?.(updatedAssets);
  };
  
  const calculateAllowancesForPeriods = (assetList) => {
    const allowancesByPeriod = {};
    
    periods.forEach(period => {
      allowancesByPeriod[period.id] = 0;
    });
    
    assetList.forEach(asset => {
      const rates = ZIMBABWE_TAX_RULES.capitalAllowanceRates[asset.category];
      if (!rates) return;
      
      periods.forEach((period, periodIndex) => {
        // Fixed: Added proper parentheses
        const periodYear = period.year || new Date().getFullYear() + Math.floor(periodIndex / (period.type === 'monthly' ? 12 : period.type === 'quarterly' ? 4 : 1));
        
        if (asset.acquisitionYear <= periodYear) {
          if (asset.acquisitionYear === periodYear) {
            const allowance = asset.costInUSD * Math.max(rates.special, rates.accelerated);
            allowancesByPeriod[period.id] += allowance;
          } else {
            const allowance = asset.costInUSD * rates.wearTear;
            allowancesByPeriod[period.id] += allowance;
          }
        }
      });
    });
    
    onUpdate(allowancesByPeriod);
  };
  
  const getCategoryLabel = (category) => {
    return category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-[#EEEEEE] shadow-sm tutorial-capital-allowance">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Asset Register & Capital Allowances</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          <input
            type="text"
            placeholder="Asset Name"
            value={newAsset.name}
            onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
            className="p-3 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
          />
          <select
            value={newAsset.category}
            onChange={(e) => setNewAsset({...newAsset, category: e.target.value})}
            className="p-3 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
          >
            <option value="motorVehicles">Motor Vehicles</option>
            <option value="moveableAssets">Moveable Assets</option>
            <option value="commercialBuildings">Commercial Buildings</option>
            <option value="industrialBuildings">Industrial Buildings</option>
            <option value="leaseImprovements">Lease Improvements</option>
            <option value="itEquipment">IT Equipment</option>
          </select>
          <input
            type="date"
            value={newAsset.acquisitionDate}
            onChange={(e) => setNewAsset({...newAsset, acquisitionDate: e.target.value})}
            className="p-3 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
          />
          <select
            value={newAsset.currency}
            onChange={(e) => setNewAsset({...newAsset, currency: e.target.value})}
            className="p-3 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
          >
            <option value="USD">USD</option>
            <option value="ZWG">ZWG</option>
            <option value="ZAR">ZAR</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
          <input
            type="number"
            placeholder={`Cost (${newAsset.currency})`}
            value={newAsset.cost}
            onChange={(e) => setNewAsset({...newAsset, cost: e.target.value})}
            className="p-3 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760]"
            min="0"
            step="0.01"
          />
          <button
            onClick={addAsset}
            className="p-3 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90"
          >
            Add Asset
          </button>
        </div>
        
        {assets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0F2F4E]/5">
                <tr>
                  <th className="p-3 text-left">Asset</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Cost</th>
                  <th className="p-3 text-left">Currency</th>
                  <th className="p-3 text-left">Cost in USD</th>
                  <th className="p-3 text-left">First Year Allowance</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => {
                  const rates = ZIMBABWE_TAX_RULES.capitalAllowanceRates[asset.category];
                  const allowance = asset.costInUSD * Math.max(rates.special, rates.accelerated, rates.wearTear);
                  
                  return (
                    <tr key={asset.id} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                      <td className="p-3">{asset.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-[#1ED760]/10 rounded text-xs">
                          {getCategoryLabel(asset.category)}
                        </span>
                      </td>
                      <td className="p-3">
                        {CurrencyUtils.format(asset.cost, asset.currency)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {asset.currency}
                        </span>
                      </td>
                      <td className="p-3">
                        {CurrencyUtils.format(asset.costInUSD, 'USD')}
                      </td>
                      <td className="p-3 text-[#1ED760] font-medium">
                        {CurrencyUtils.format(allowance, 'USD')}
                      </td>
                      <td className="p-3">
                        <button 
                          onClick={() => removeAsset(asset.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-[#EEEEEE] rounded-lg">
            <div className="text-[#0F2F4E]/40 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm text-[#0F2F4E]/60">No assets added yet</p>
            <p className="text-xs text-[#0F2F4E]/40 mt-1">Add assets above to calculate capital allowances</p>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-[#EEEEEE]">
          <h4 className="text-md font-medium text-[#0F2F4E] mb-3">Period Allowance Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {periods.slice(0, 4).map(period => (
              <div key={period.id} className="p-3 bg-[#0F2F4E]/5 rounded-lg">
                <div className="text-xs text-[#0F2F4E]/70">{period.label}</div>
                <div className="text-sm font-medium text-[#1ED760]">
                  {CurrencyUtils.format(period.adjustments?.capitalAllowances || 0, 'USD')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeCostModule = ({ periods, onUpdate }) => {
  const [employeeData, setEmployeeData] = useState({
    count: 10,
    averageSalary: 50000,
    salaryCurrency: 'USD',
    annualIncrease: 0.1,
    benefitsPercentage: 0.2,
    bonusPercentage: 0.15,
    nssaRate: 0.045,
    pensionRate: 0.05
  });
  
  const calculatePAYE = (salary) => {
    const bands = ZIMBABWE_TAX_RULES.payeBands;
    let remainingIncome = salary;
    let totalTax = 0;
    
    for (const band of bands) {
      if (remainingIncome <= 0) break;
      
      const bandWidth = band.max === Infinity ? remainingIncome : band.max - band.min + 1;
      const taxableInBand = Math.min(remainingIncome, bandWidth);
      
      if (taxableInBand > 0 && taxableInBand > band.min) {
        const taxInBand = (taxableInBand * band.rate) - band.deduct;
        totalTax += Math.max(0, taxInBand);
        remainingIncome -= taxableInBand;
      }
    }
    
    return Math.max(0, totalTax);
  };
  
  const calculatePeriodCosts = () => {
    const periodCosts = periods.map((period, index) => {
      let salary = employeeData.averageSalary * Math.pow(1 + employeeData.annualIncrease, index);
      
      if (employeeData.salaryCurrency !== 'USD') {
        salary = CurrencyUtils.convert(salary, employeeData.salaryCurrency, 'USD');
      }
      
      const benefits = salary * employeeData.benefitsPercentage;
      const bonus = salary * employeeData.bonusPercentage;
      const totalCash = salary + benefits + bonus;
      
      const paye = calculatePAYE(totalCash) * employeeData.count;
      const aidsLevy = paye * 0.03;
      const nssa = salary * employeeData.nssaRate * employeeData.count;
      const pension = salary * employeeData.pensionRate * employeeData.count;
      
      const totalCost = (totalCash * employeeData.count) + nssa + pension + paye + aidsLevy;
      
      return {
        period: period.label,
        periodId: period.id,
        employeeCount: employeeData.count,
        averageSalary: salary,
        totalSalary: salary * employeeData.count,
        benefits: benefits * employeeData.count,
        bonus: bonus * employeeData.count,
        paye,
        aidsLevy,
        nssa,
        pension,
        totalCost
      };
    });
    
    return periodCosts;
  };
  
  const handleInputChange = (field, value) => {
    const updatedData = {
      ...employeeData,
      [field]: parseFloat(value) || 0
    };
    setEmployeeData(updatedData);
    
    setTimeout(() => {
      const costs = calculatePeriodCosts();
      onUpdate?.(costs);
    }, 0);
  };
  
  useEffect(() => {
    const costs = calculatePeriodCosts();
    onUpdate?.(costs);
  }, [periods]);
  
  const costs = calculatePeriodCosts();
  const totalEmployeeCost = costs.reduce((sum, period) => sum + period.totalCost, 0);
  const totalPAYE = costs.reduce((sum, period) => sum + period.paye + period.aidsLevy, 0);
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-employee-cost">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Employee Cost & PAYE Projections</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Employee Count</label>
          <input
            type="number"
            value={employeeData.count}
            onChange={(e) => handleInputChange('count', e.target.value)}
            className="w-full p-2 border border-[#EEEEEE] rounded-lg"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Avg Salary</label>
          <input
            type="number"
            value={employeeData.averageSalary}
            onChange={(e) => handleInputChange('averageSalary', e.target.value)}
            className="w-full p-2 border border-[#EEEEEE] rounded-lg"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Currency</label>
          <select
            value={employeeData.salaryCurrency}
            onChange={(e) => {
              setEmployeeData({...employeeData, salaryCurrency: e.target.value});
              const costs = calculatePeriodCosts();
              onUpdate?.(costs);
            }}
            className="w-full p-2 border border-[#EEEEEE] rounded-lg"
          >
            <option value="USD">USD</option>
            <option value="ZWG">ZWG</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Annual Increase (%)</label>
          <input
            type="number"
            step="0.01"
            value={employeeData.annualIncrease * 100}
            onChange={(e) => handleInputChange('annualIncrease', parseFloat(e.target.value) / 100)}
            className="w-full p-2 border border-[#EEEEEE] rounded-lg"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm text-[#0F2F4E] mb-2">Benefits (%)</label>
          <input
            type="number"
            step="0.01"
            value={employeeData.benefitsPercentage * 100}
            onChange={(e) => handleInputChange('benefitsPercentage', parseFloat(e.target.value) / 100)}
            className="w-full p-2 border border-[#EEEEEE] rounded-lg"
            min="0"
            max="100"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">Total Employee Cost</div>
          <div className="text-xl font-bold text-blue-600">{CurrencyUtils.format(totalEmployeeCost, 'USD')}</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-700">Total PAYE & Levy</div>
          <div className="text-xl font-bold text-red-600">{CurrencyUtils.format(totalPAYE, 'USD')}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-700">Avg Cost/Employee</div>
          <div className="text-xl font-bold text-green-600">
            {CurrencyUtils.format(totalEmployeeCost / (employeeData.count * Math.max(periods.length, 1)), 'USD')}
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-700">PAYE % of Cost</div>
          <div className="text-xl font-bold text-purple-600">
            {totalEmployeeCost > 0 ? ((totalPAYE / totalEmployeeCost) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0F2F4E]/5">
            <tr>
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Employees</th>
              <th className="p-2 text-left">Avg Salary</th>
              <th className="p-2 text-left">PAYE</th>
              <th className="p-2 text-left">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((period, index) => (
              <tr key={index} className="border-t border-[#EEEEEE]">
                <td className="p-2">{period.period}</td>
                <td className="p-2">{period.employeeCount}</td>
                <td className="p-2">{CurrencyUtils.format(period.averageSalary, 'USD')}</td>
                <td className="p-2 text-red-600">{CurrencyUtils.format((period.paye + period.aidsLevy) || 0, 'USD')}</td>
                <td className="p-2 font-medium">{CurrencyUtils.format(period.totalCost, 'USD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DataImportModule = ({ onDataImported }) => {
  const fileRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [mapping, setMapping] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }
    
    setUploadedFile(file.name);
    setIsLoading(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      
      if (data.length > 0) {
        setParsedData(data);
        setShowMapping(true);
        
        const columns = Object.keys(data[0]);
        const initialMapping = columns.map(col => ({
          importedColumn: col,
          internalCategory: '',
          taxTreatment: 'neutral',
          currency: 'USD'
        }));
        setMapping(initialMapping);
      }
      
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error parsing file. Please check the format.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMappingChange = (index, field, value) => {
    const newMapping = [...mapping];
    newMapping[index][field] = value;
    setMapping(newMapping);
  };
  
  const applyMapping = () => {
    if (!parsedData) return;
    
    const transformedData = parsedData.map(row => {
      const transformedRow = {};
      mapping.forEach(map => {
        if (map.internalCategory && row[map.importedColumn] !== undefined) {
          transformedRow[map.internalCategory] = {
            value: row[map.importedColumn],
            currency: map.currency,
            taxTreatment: map.taxTreatment
          };
        }
      });
      return transformedRow;
    });
    
    onDataImported?.(transformedData);
    setShowMapping(false);
    alert('Data imported successfully!');
  };
  
  const internalCategories = [
    'revenue',
    'costOfGoodsSold',
    'operatingExpenses',
    'salaries',
    'depreciation',
    'interestIncome',
    'dividendReceived',
    'capitalAllowances',
    'nonDeductibleExpenses'
  ];
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-data-import">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Import Accounting Data</h3>
      
      <div className="mb-4">
        <p className="text-sm text-[#0F2F4E]/70 mb-3">
          Upload CSV/Excel files from Xero, QuickBooks, Sage or other accounting systems
        </p>
        
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-[#0F2F4E] file:mr-3 file:py-2 file:px-4 file:rounded-lg 
                   file:border-0 file:text-sm file:font-semibold 
                   file:bg-[#1ED760] file:text-white hover:file:bg-[#1ED760]/90"
          disabled={isLoading}
        />
        
        {isLoading && (
          <div className="mt-2 text-sm text-[#1ED760]">
            Loading...
          </div>
        )}
        
        {uploadedFile && !isLoading && (
          <div className="mt-2 text-sm text-[#1ED760]">
            Uploaded: {uploadedFile}
          </div>
        )}
      </div>
      
      {showMapping && parsedData && (
        <div className="mt-6 border-t border-[#EEEEEE] pt-6">
          <h4 className="text-md font-medium text-[#0F2F4E] mb-4">Map Imported Columns</h4>
          
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0F2F4E]/5">
                <tr>
                  <th className="p-3 text-left">Imported Column</th>
                  <th className="p-3 text-left">Sample Value</th>
                  <th className="p-3 text-left">Internal Category</th>
                  <th className="p-3 text-left">Currency</th>
                  <th className="p-3 text-left">Tax Treatment</th>
                </tr>
              </thead>
              <tbody>
                {mapping.map((item, index) => (
                  <tr key={index} className="border-t border-[#EEEEEE]">
                    <td className="p-3 font-mono">{item.importedColumn}</td>
                    <td className="p-3 text-[#0F2F4E]/70">
                      {parsedData[0]?.[item.importedColumn]?.toString().substring(0, 30) || ''}
                    </td>
                    <td className="p-3">
                      <select
                        value={item.internalCategory}
                        onChange={(e) => handleMappingChange(index, 'internalCategory', e.target.value)}
                        className="w-full p-2 border border-[#EEEEEE] rounded"
                      >
                        <option value="">-- Select Category --</option>
                        {internalCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={item.currency}
                        onChange={(e) => handleMappingChange(index, 'currency', e.target.value)}
                        className="w-full p-2 border border-[#EEEEEE] rounded"
                      >
                        <option value="USD">USD</option>
                        <option value="ZWG">ZWG</option>
                        <option value="ZAR">ZAR</option>
                        <option value="GBP">GBP</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={item.taxTreatment}
                        onChange={(e) => handleMappingChange(index, 'taxTreatment', e.target.value)}
                        className="w-full p-2 border border-[#EEEEEE] rounded"
                      >
                        <option value="neutral">Neutral</option>
                        <option value="nonDeductible">Non-Deductible</option>
                        <option value="nonTaxable">Non-Taxable</option>
                        <option value="capitalAllowance">Capital Allowance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={applyMapping}
              className="px-4 py-2 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90"
            >
              Apply Mapping & Import
            </button>
            <button
              onClick={() => setShowMapping(false)}
              className="px-4 py-2 border border-[#EEEEEE] text-[#0F2F4E] rounded-lg hover:bg-[#0F2F4E]/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-[#0F2F4E]/50">
        Supported formats: CSV, Excel (.xlsx, .xls). Max file size: 10MB
      </div>
    </div>
  );
};

const ExportModal = ({ isOpen, onClose, onExport, type, results, formState }) => {
  const [companyName, setCompanyName] = useState("");
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);
  const [reportCurrency, setReportCurrency] = useState("USD");

  if (!isOpen) return null;

  const handleExport = () => {
    if (!companyName.trim()) {
      alert('Please enter a company name');
      return;
    }
    
    onExport({
      companyName,
      taxYear,
      includeCharts,
      includeAI,
      type,
      currency: reportCurrency
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#FFD700] shadow-xl">
        <h3 className="text-xl font-bold text-[#0F2F4E] mb-4">
          {type === 'pdf' ? '📄 Export PDF Report' : '📊 Export Excel Workbook'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                         placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                         focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                Tax Year
              </label>
              <input
                type="number"
                value={taxYear}
                onChange={(e) => setTaxYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                           placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
                min="2000"
                max="2100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                Report Currency
              </label>
              <select
                value={reportCurrency}
                onChange={(e) => setReportCurrency(e.target.value)}
                className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                         focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                         focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
              >
                <option value="USD">USD</option>
                <option value="ZWG">ZWG</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>
          </div>

          {type === 'pdf' && (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeCharts"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-4 h-4 text-[#1ED760] bg-white border-[#EEEEEE] rounded focus:ring-[#1ED760]"
                />
                <label htmlFor="includeCharts" className="text-sm text-[#0F2F4E]">
                  Include charts and visualizations
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeAI"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                  className="w-4 h-4 text-[#1ED760] bg-white border-[#EEEEEE] rounded focus:ring-[#1ED760]"
                />
                <label htmlFor="includeAI" className="text-sm text-[#0F2F4E]">
                  Include AI tax optimization recommendations
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#EEEEEE] text-[#0F2F4E] rounded-lg font-medium hover:bg-[#EEEEEE]/80 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-3 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90 transition"
          >
            Export {type === 'pdf' ? 'PDF' : 'Excel'} in {reportCurrency}
          </button>
        </div>
      </div>
    </div>
  );
};

const exportComprehensivePDF = (results, formState, options) => {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const lineHeight = 7;
    const sectionSpacing = 15;

    const addTextWithBreaks = (text, x, y, maxWidth) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    doc.setFillColor(15, 47, 78);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX COMPUTATION REPORT', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Company: ${options.companyName}`, 20, 40);
    doc.text(`Tax Year: ${options.taxYear}`, pageWidth - 20, 40, { align: 'right' });
    doc.text(`Currency: ${options.currency}`, pageWidth / 2, 40, { align: 'center' });

    yPosition = 70;

    doc.setFontSize(16);
    doc.setTextColor(15, 47, 78);
    doc.text('EXECUTIVE SUMMARY', 20, yPosition);
    yPosition += sectionSpacing;

    const summaryData = [
      { label: "Gross Profit", value: `${options.currency === 'USD' ? '$' : options.currency === 'ZWG' ? 'Z$' : 'R'}${(results.comprehensive?.grossProfit || 0).toLocaleString()}` },
      { label: "Operating Profit", value: `${options.currency === 'USD' ? '$' : options.currency === 'ZWG' ? 'Z$' : 'R'}${(results.comprehensive?.operatingProfit || 0).toLocaleString()}` },
      { label: "Taxable Income", value: `${options.currency === 'USD' ? '$' : options.currency === 'ZWG' ? 'Z$' : 'R'}${(results.comprehensive?.taxableIncome || 0).toLocaleString()}` },
      { label: "Corporate Tax (25%)", value: `${options.currency === 'USD' ? '$' : options.currency === 'ZWG' ? 'Z$' : 'R'}${(results.comprehensive?.taxDue || 0).toLocaleString()}` },
      { label: "AIDS Levy (3%)", value: `${options.currency === 'USD' ? '$' : options.currency === 'ZWG' ? 'Z$' : 'R'}${(results.comprehensive?.aidsLevy || 0).toLocaleString()}` },
      { label: "Total Tax Liability", value: `${options.currency === 'USD' ? '$' : options.currency === 'ZWG' ? 'Z$' : 'R'}${(results.comprehensive?.totalTax || 0).toLocaleString()}` }
    ];

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    summaryData.forEach((item, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(item.label, 20, yPosition);
      doc.text(item.value, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += lineHeight;
      
      if (index < summaryData.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 14;
      }
    });

    yPosition += sectionSpacing;

    doc.save(`tax-computation-${options.companyName.replace(/\s+/g, '-').toLowerCase()}-${options.taxYear}-${options.currency}.pdf`);
  }).catch(error => {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  });
};

const exportComprehensiveExcel = (results, formState, options) => {
  const wb = XLSX.utils.book_new();
  
  const summaryData = [
    ["Tax Planning Report", options.companyName, `Year: ${options.taxYear}`, `Currency: ${options.currency}`],
    ["Generated:", new Date().toLocaleDateString()],
    [],
    ["Metric", "Amount"],
    ["Gross Profit", results.comprehensive?.grossProfit || 0],
    ["Operating Profit", results.comprehensive?.operatingProfit || 0],
    ["Taxable Income", results.comprehensive?.taxableIncome || 0],
    ["Corporate Tax", results.comprehensive?.taxDue || 0],
    ["AIDS Levy", results.comprehensive?.aidsLevy || 0],
    ["Total Tax Liability", results.comprehensive?.totalTax || 0]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws, "Summary");
  
  XLSX.writeFile(wb, `tax-planning-${options.companyName.replace(/\s+/g, '-').toLowerCase()}-${options.taxYear}-${options.currency}.xlsx`);
};

const EnhancedExportButtons = ({ results, formState, scenarios, periods }) => {
  const [exportModal, setExportModal] = useState({ open: false, type: '' });

  const handleExport = (options) => {
    if (options.type === 'pdf') {
      exportComprehensivePDF(results, formState, options);
    } else {
      exportComprehensiveExcel(results, formState, options);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20 tutorial-export">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-[#0F2F4E] mb-2">Professional Reports</h4>
            <p className="text-sm text-[#0F2F4E]">
             Generate comprehensive PDF reports and Excel workbooks for tax filing and planning
            </p>
            <p className="text-xs text-[#0F2F4E]/70 mt-1">
              Includes multi-currency support and AI-powered tax optimization suggestions
            </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setExportModal({ open: true, type: 'pdf' })}
            className="px-6 py-3 bg-[#0F2F4E] text-white rounded-lg font-semibold hover:bg-[#0F2F4E]/90 transition flex items-center gap-2"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => setExportModal({ open: true, type: 'excel' })}
            className="px-6 py-3 bg-[#1ED760] text-white rounded-lg font-semibold hover:bg-[#1ED760]/90 transition flex items-center gap-2"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      <ExportModal
        isOpen={exportModal.open}
        onClose={() => setExportModal({ open: false, type: '' })}
        onExport={handleExport}
        type={exportModal.type}
        results={results}
        formState={formState}
      />
    </>
  );
};

const ActionButton = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 
               text-white px-5 py-3 rounded-lg font-semibold 
               hover:from-[#1ED760]/90 hover:to-[#1ED760]/80 transition disabled:opacity-50
               shadow-lg shadow-[#1ED760]/25"
  >
    {children}
  </button>
);

const AIDisclaimer = ({ className = "" }) => (
  <div className={`text-xs text-[#0F2F4E]/70 mt-2 ${className}`}>
    ⚠️ AI guidance is for informational purposes only. Consult a qualified tax professional for specific advice.
  </div>
);

const ChatAssistant = ({ aiHistory, setAIHistory }) => {
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Initialize elite session
    const initSession = async () => {
      try {
        const session = await eliteTaxAPI.startEliteSession({
          expertise_level: "expert_legal",
          practice_area: "tax_planning",
          preferred_detail: "comprehensive",
        });
        setSessionId(session.session_id);
      } catch (error) {
        console.error("Failed to start elite session:", error);
      }
    };
    initSession();
  }, []);

  const send = async () => {
    if (!query.trim()) return;
    setSending(true);
    try {
      const response = await eliteTaxAPI.askEliteQuestion(
        query,
        sessionId,
        "elite",
        "comprehensive"
      );
      const assistant = response.response ?? "(no response)";
      setAIHistory((h) => [{ q: query, a: assistant }, ...h].slice(0, 50));
      setQuery("");
    } catch (error) {
      console.error("Elite API error:", error);
      setAIHistory((h) => [
        { q: query, a: "(assistant error - please try again)" },
        ...h,
      ].slice(0, 50));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about tax optimization..."
          className="flex-1 p-1 text-sm rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                     placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                     focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          disabled={sending || !query.trim()}
          className="px-3 text-sm py-3 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90 transition disabled:opacity-50"
        >
          {sending ? "..." : "Ask"}
        </button>
      </div>

      <AIDisclaimer />

      <div className="mt-3 max-h-40 overflow-auto space-y-2">
        {aiHistory.map((h, i) => (
          <div key={i} className="p-3 bg-white rounded-lg border border-[#EEEEEE]">
            <div className="text-sm text-[#0F2F4E]">Q: {h.q}</div>
            <div className="text-sm text-[#1ED760] mt-1">A: {h.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaxBreakdownVisualization = ({ results, formState }) => {
  if (!results.comprehensive) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#0F2F4E]/40 bg-white rounded-xl border border-[#EEEEEE]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-[#1ED760] mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-sm">No comprehensive tax data yet.</p>
        <p className="text-xs text-[#0F2F4E]/50">
          Fill in the forms and calculate to generate tax breakdown metrics.
        </p>
      </div>
    );
  }

  const { comprehensive } = results;
  
  const salesRevenue = parseFloat(formState.sales) || 0;
  const otherTradingIncome = parseFloat(formState.otherTradingIncome) || 0;
  const totalRevenue = salesRevenue + otherTradingIncome;
  
  const costOfGoodsSold = parseFloat(formState.costOfGoodsSold) || 0;
  const operatingExpenses = comprehensive.operatingExpenses || 0;
  const totalBusinessCosts = costOfGoodsSold + operatingExpenses;
  
  const totalTax = comprehensive.totalTax || 0;
  const taxableIncome = comprehensive.taxableIncome || 0;
  
  const detailedExpenses = {
    'Cost of Goods': costOfGoodsSold,
    'Advertising & Marketing': parseFloat(formState.advertisingMarketing) || 0,
    'Automobile Expense': parseFloat(formState.automobileExpense) || 0,
    'Bank Charges': parseFloat(formState.bankCharges) || 0,
    'IMTT': parseFloat(formState.imtt) || 0,
    'Salaries': parseFloat(formState.salaries) || 0,
    'Equipment Rental': parseFloat(formState.equipmentRental) || 0,
    'IT & Internet': parseFloat(formState.itInternet) || 0,
    'Rent & Rates': (parseFloat(formState.rentExpense) || 0) + (parseFloat(formState.warehouse) || 0) + (parseFloat(formState.cottage) || 0),
    'Other Expenses': parseFloat(formState.otherExpenses) || 0
  };

  const taxAsFractionOfRevenue = totalRevenue > 0 ? (totalTax / totalRevenue) * 100 : 0;
  const taxAsFractionOfCosts = totalBusinessCosts > 0 ? (totalTax / totalBusinessCosts) * 100 : 0;
  const effectiveTaxRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
  
  const grossProfitMargin = totalRevenue > 0 ? ((comprehensive.grossProfit || 0) / totalRevenue) * 100 : 0;
  const operatingProfitMargin = totalRevenue > 0 ? ((comprehensive.operatingProfit || 0) / totalRevenue) * 100 : 0;
  const netProfitMargin = totalRevenue > 0 ? (((comprehensive.operatingProfit || 0) - totalTax) / totalRevenue) * 100 : 0;

  const taxEfficiencyData = [
    { 
      name: 'Tax/Revenue', 
      value: taxAsFractionOfRevenue,
      amount: totalTax,
      base: totalRevenue,
      color: '#1ED760'
    },
    { 
      name: 'Tax/Costs', 
      value: taxAsFractionOfCosts,
      amount: totalTax,
      base: totalBusinessCosts,
      color: '#FFD700'
    },
    { 
      name: 'Effective Rate', 
      value: effectiveTaxRate,
      amount: totalTax,
      base: taxableIncome,
      color: '#0F2F4E'
    },
  ];

  const profitMarginData = [
    { name: 'Gross', value: grossProfitMargin, color: '#10b981' },
    { name: 'Operating', value: operatingProfitMargin, color: '#3b82f6' },
    { name: 'Net', value: netProfitMargin, color: '#0F2F4E' },
  ];

  const expenseBreakdownData = Object.entries(detailedExpenses)
    .filter(([_, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

  const revenueBreakdownData = [
    { name: 'Sales Revenue', value: salesRevenue, color: '#1ED760' },
    { name: 'Other Income', value: otherTradingIncome, color: '#FFD700' },
    { name: 'Total Tax', value: totalTax, color: '#ef4444' },
    { name: 'Net Profit', value: Math.max((comprehensive.operatingProfit || 0) - totalTax, 0), color: '#0F2F4E' },
  ].filter(item => item.value > 0);

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    if (percent === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#0F2F4E" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-xl text-white">
          <div className="text-sm opacity-90">Tax/Revenue Ratio</div>
          <div className="text-2xl font-bold mt-1">{taxAsFractionOfRevenue.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            {CurrencyUtils.format(totalTax, 'USD')} / {CurrencyUtils.format(totalRevenue, 'USD')}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-xl text-[#0F2F4E]">
          <div className="text-sm opacity-90">Tax/Cost Ratio</div>
          <div className="text-2xl font-bold mt-1">{taxAsFractionOfCosts.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            {CurrencyUtils.format(totalTax, 'USD')} / {CurrencyUtils.format(totalBusinessCosts, 'USD')}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-xl text-white">
          <div className="text-sm opacity-90">Effective Tax Rate</div>
          <div className="text-2xl font-bold mt-1">{effectiveTaxRate.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            On {CurrencyUtils.format((taxableIncome || 0), 'USD')} income
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#84cc16] to-[#84cc16]/80 p-4 rounded-xl text-white">
          <div className="text-sm opacity-90">Net Profit Margin</div>
          <div className="text-2xl font-bold mt-1">{netProfitMargin.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            After-tax profitability
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border border-[#EEEEEE]">
          <h4 className="text-md font-semibold text-[#0F2F4E] mb-4 text-center">
            Tax Efficiency Metrics
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxEfficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#0F2F4E" fontSize={12} />
                <YAxis 
                  stroke="#0F2F4E" 
                  fontSize={12}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(2)}%`,
                    name === 'value' ? 'Percentage' : name
                  ]}
                  labelFormatter={(label) => `Metric: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {taxEfficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    fill="#0F2F4E"
                    fontSize={11}
                    formatter={(value) => `${value.toFixed(1)}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-[#0F2F4E]/70 mt-2 text-center">
            Lower percentages indicate better tax efficiency
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EEEEEE]">
          <h4 className="text-md font-semibold text-[#0F2F4E] mb-4 text-center">
            Profit Margin Analysis
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitMarginData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                <XAxis dataKey="name" stroke="#0F2F4E" fontSize={12} />
                <YAxis 
                  stroke="#0F2F4E" 
                  fontSize={12}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Margin']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0F2F4E"
                  strokeWidth={2}
                  dot={{ fill: '#0F2F4E', strokeWidth: 2, r: 4 }}
                >
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    fill="#0F2F4E"
                    fontSize={11}
                    formatter={(value) => `${value.toFixed(1)}%`}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-[#0F2F4E]/70 mt-2 text-center">
            Impact of taxes on profitability
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border border-[#EEEEEE]">
          <h4 className="text-md font-semibold text-[#0F2F4E] mb-4 text-center">
            Expense Breakdown
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {expenseBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    CurrencyUtils.format(value, 'USD'),
                    name
                  ]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: '#0F2F4E', fontSize: '12px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EEEEEE]">
          <h4 className="text-md font-semibold text-[#0F2F4E] mb-4 text-center">
            Revenue & Tax Distribution
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {revenueBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    CurrencyUtils.format(value, 'USD'),
                    name
                  ]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: '#0F2F4E', fontSize: '12px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 p-4 rounded-xl border border-[#1ED760]/20">
        <h4 className="text-md font-semibold text-[#0F2F4E] mb-3">Tax Efficiency Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                taxAsFractionOfRevenue < 10 ? 'bg-[#1ED760]' : 
                taxAsFractionOfRevenue < 20 ? 'bg-[#FFD700]' : 'bg-[#ef4444]'
              }`}></div>
              <span className="font-medium text-[#0F2F4E]">Revenue Tax Burden</span>
            </div>
            <p className="text-[#0F2F4E]/80 text-xs">
              {taxAsFractionOfRevenue < 10 
                ? "Excellent tax efficiency relative to revenue" 
                : taxAsFractionOfRevenue < 20 
                ? "Moderate tax burden on revenue"
                : "High tax burden relative to revenue"
              }
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                taxAsFractionOfCosts < 15 ? 'bg-[#1ED760]' : 
                taxAsFractionOfCosts < 25 ? 'bg-[#FFD700]' : 'bg-[#ef4444]'
              }`}></div>
              <span className="font-medium text-[#0F2F4E]">Cost Tax Burden</span>
            </div>
            <p className="text-[#0F2F4E]/80 text-xs">
              {taxAsFractionOfCosts < 15 
                ? "Favorable tax-to-cost ratio" 
                : taxAsFractionOfCosts < 25 
                ? "Average tax impact on costs"
                : "Tax represents significant portion of costs"
              }
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                effectiveTaxRate < 20 ? 'bg-[#1ED760]' : 
                effectiveTaxRate < 28 ? 'bg-[#FFD700]' : 'bg-[#ef4444]'
              }`}></div>
              <span className="font-medium text-[#0F2F4E]">Effective Tax Rate</span>
            </div>
            <p className="text-[#0F2F4E]/80 text-xs">
              {effectiveTaxRate < 20 
                ? "Below standard corporate rate (25%)" 
                : effectiveTaxRate < 28 
                ? "Near standard corporate rate"
                : "Above standard corporate rate - review deductions"
              }
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                netProfitMargin > 15 ? 'bg-[#1ED760]' : 
                netProfitMargin > 5 ? 'bg-[#FFD700]' : 'bg-[#ef4444]'
              }`}></div>
              <span className="font-medium text-[#0F2F4E]">Profitability Health</span>
            </div>
            <p className="text-[#0F2F4E]/80 text-xs">
              {netProfitMargin > 15 
                ? "Strong profitability after tax" 
                : netProfitMargin > 5 
                ? "Moderate profitability"
                : "Low profitability - review costs and tax strategy"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComprehensiveChartPanel = ({ results }) => {
  if (!results.comprehensive) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#0F2F4E]/40 bg-white rounded-xl border border-[#EEEEEE]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-[#1ED760] mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-sm">No comprehensive tax data yet.</p>
        <p className="text-xs text-[#0F2F4E]/50">
          Fill in the forms and calculate to generate charts.
        </p>
      </div>
    );
  }

  const { comprehensive } = results;
  
  const taxBreakdownData = [
    { 
      name: 'Income Tax', 
      value: Math.max(comprehensive.taxDue || 0, 0.01)
    },
    { 
      name: 'AIDS Levy', 
      value: Math.max(comprehensive.aidsLevy || 0, 0.01)
    },
  ];

  const capitalAllowanceData = comprehensive.detailedCapitalAllowances ? 
    Object.entries(comprehensive.detailedCapitalAllowances).map(([assetType, details]) => ({
      name: assetType.replace(/([A-Z])/g, ' $1').trim().substring(0, 12),
      value: Math.max(details.totalAllowance || 0, 0.01)
    })) : [
    { name: 'No Data', value: 0.01 }
  ];

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    if (percent === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#0F2F4E" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="text-center text-sm text-[#0F2F4E] mb-2">Tax Breakdown</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taxBreakdownData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                label={renderCustomizedLabel}
                labelLine={false}
                animationDuration={800}
              >
                {taxBreakdownData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  CurrencyUtils.format(value, 'USD'),
                  name
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: '#0F2F4E', fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-center text-sm text-[#0F2F4E] mb-2">Capital Allowances</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={capitalAllowanceData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              animationDuration={800}
            >
              <XAxis 
                dataKey="name" 
                stroke="#0F2F4E" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#0F2F4E" 
                fontSize={12}
                tickFormatter={(value) => CurrencyUtils.format(value, 'USD')}
              />
              <Tooltip 
                formatter={(value, name) => [
                  CurrencyUtils.format(value, 'USD'),
                  'Allowance'
                ]}
                labelFormatter={(label) => `Asset: ${label}`}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #EEEEEE',
                  borderRadius: '8px',
                  color: '#0F2F4E'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#1ED760" 
                radius={[4, 4, 0, 0]}
                stroke="#0F2F4E"
                strokeWidth={1}
              >
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  fill="#0F2F4E"
                  fontSize={11}
                  formatter={(value) => CurrencyUtils.format(value, 'USD', { showCode: false }).replace('$', '')}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const TutorialOverlay = ({ 
  isOpen, 
  currentStep, 
  onNext, 
  onPrev, 
  onClose, 
  onSkip,
  activeTab,
  onSwitchTab
}) => {
  const [targetElement, setTargetElement] = useState(null);
  const [highlightStyle, setHighlightStyle] = useState({});
  
  const step = currentStep < TUTORIAL_STEPS.length 
    ? TUTORIAL_STEPS[currentStep] 
    : null;
  
  useEffect(() => {
    if (!isOpen || !step) return;
    
    if (step.tab && step.tab !== activeTab) {
      onSwitchTab?.(step.tab);
      
      const timer = setTimeout(() => {
        findAndHighlightElement(step);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      findAndHighlightElement(step);
    }
  }, [isOpen, currentStep, activeTab]);

  const findAndHighlightElement = (step) => {
    if (!step || !step.target || typeof document === 'undefined') {
      setHighlightStyle({ display: 'none' });
      return;
    }
    
    const element = document.querySelector(step.target);
    setTargetElement(element);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      
      const style = window.getComputedStyle(element);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       rect.width > 0 && 
                       rect.height > 0;
      
      if (isVisible) {
        // Scroll element into view centered
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        
        // Wait for scroll to complete before setting highlight
        setTimeout(() => {
          const updatedRect = element.getBoundingClientRect();
          setHighlightStyle({
            top: `${updatedRect.top}px`,
            left: `${updatedRect.left}px`,
            width: `${updatedRect.width}px`,
            height: `${updatedRect.height}px`,
            display: 'block'
          });
        }, 300);
      } else {
        setHighlightStyle({ display: 'none' });
      }
    } else {
      setHighlightStyle({ display: 'none' });
    }
  };
  
  if (!isOpen || !step) {
    return null;
  }
  
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  
  const positionClass = 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" />
      
      {highlightStyle.display === 'block' && (
        <div 
          className="absolute border-2 border-[#1ED760] rounded-lg z-[101] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
          style={highlightStyle}
        >
          <div className="absolute inset-0 bg-[#1ED760]/10 animate-pulse" />
        </div>
      )}
      
      <div className={`absolute w-96 bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-[#1ED760]/80 z-[102] ${positionClass}`}>
        {step.tab && (
          <div className="mb-3 px-3 py-1 bg-[#1ED760]/10 text-[#1ED760] text-sm rounded-lg inline-block">
            {step.tab === 'overview' && '📊 Overview Tab'}
            {step.tab === 'scenarios' && '💱 Currency & Scenarios Tab'}
            {step.tab === 'data-input' && '📝 Data Input Tab'}
            {step.tab === 'tax-engine' && '⚙️ Tax Engine Tab'}
            {step.tab === 'reports' && '📄 Reports Tab'}
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-[#0F2F4E]/70 mb-1">
            <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[#EEEEEE] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#1ED760] to-[#1ED760]/80"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0F2F4E] mb-2">
            {step.title}
          </h3>
          <p className="text-[#0F2F4E]/80">{step.description}</p>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm text-[#0F2F4E]/70 hover:text-[#0F2F4E] hover:bg-[#EEEEEE] rounded-lg"
          >
            Skip Tutorial
          </button>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="px-4 py-2 text-sm text-[#0F2F4E] hover:bg-[#EEEEEE] rounded-lg"
              >
                ← Previous
              </button>
            )}
            
            {currentStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={onNext}
                className="px-4 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90"
              >
                Start Using TaxCul
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TaxPlanningPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [aiHistory, setAIHistory] = useState([]);
  
  const [formState, setFormState] = useState({
    sales: "1000000",
    otherTradingIncome: "50000",
    costOfGoodsSold: "400000",
    advertisingMarketing: "50000",
    trainingEvent: "10000",
    automobileExpense: "20000",
    vehicleInsurance: "5000",
    managementMileage: "3000",
    staffMileage: "2000",
    fuelExpense: "8000",
    vehicleMaintenance: "3000",
    bankCharges: "2000",
    imtt: "1000",
    salaries: "300000",
    consultantExpense: "20000",
    accountingFees: "15000",
    equipmentRental: "10000",
    finesPenalties: "0",
    itInternet: "12000",
    janitorial: "4000",
    warehouse: "20000",
    cottage: "0",
    mealsEntertainment: "8000",
    officeSupplies: "5000",
    otherExpenses: "15000",
    parking: "1000",
    printingStationery: "2000",
    repairsMaintenance: "8000",
    telephoneExpense: "4000",
    travelExpense: "10000",
    flights: "3000",
    taxi: "1000",
    tollFee: "500",
    rentExpense: "48000",
    cottageRent: "0",
    warehouseRent: "0",
    dividendReceived: "20000",
    capitalReceipts: "10000",
    profitOnSale: "15000",
    interestFinancial: "5000",
    depreciation: "50000",
    disallowableSubscriptions: "2000",
    disallowableLegal: "3000",
    finesPenaltiesTax: "0",
    donations: "5000",
    recoupment: "0",
    incomeReceivedAdvance: "0",
    doubtfulDebts: "3000",
    dividendsNet: "0",
    motorVehicles: "100000",
    moveableAssets: "50000",
    commercialBuildings: "0",
    industrialBuildings: "0",
    leaseImprovements: "20000",
  });

  const [periodType, setPeriodType] = useState('annually');
  const [periods, setPeriods] = useState(() => createPeriods(3, periodType));
  const [activePeriod, setActivePeriod] = useState(periods[0]?.id);
  
  const [scenarios, setScenarios] = useState([
    createScenario('Base Case', 'base', { periods: [...periods] }),
    createScenario('ZWG Heavy', 'zwg-heavy', { periods: [...periods] }, {
      mix: { USD: 0.3, ZWG: 0.6, ZAR: 0.1 },
      exchangeRateScenario: 'high'
    }),
    createScenario('USD Heavy', 'usd-heavy', { periods: [...periods] }, {
      mix: { USD: 0.9, ZWG: 0.1, ZAR: 0.0 },
      exchangeRateScenario: 'stable'
    })
  ]);
  
  const [activeScenario, setActiveScenario] = useState(scenarios[0]?.id);
  const [assets, setAssets] = useState([]);
  const [capitalAllowancesByPeriod, setCapitalAllowancesByPeriod] = useState({});
  const [employeeCosts, setEmployeeCosts] = useState([]);
  const [assessedLossesForward, setAssessedLossesForward] = useState(0);
  const [importedData, setImportedData] = useState(null);
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  useEffect(() => {
    const status = getTutorialStatus();
    if (!status.completed) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
        setTutorialStep(status.step);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (showTutorial) {
      if (TUTORIAL_STEPS[tutorialStep]?.target) {
        const element = document.querySelector(TUTORIAL_STEPS[tutorialStep].target);
      }
    }
  }, [showTutorial, tutorialStep]);
  
  const handleNextTutorial = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(prev => {
        const nextStep = prev + 1;
        saveTutorialStatus(false, nextStep);
        return nextStep;
      });
    } else {
      handleCompleteTutorial();
    }
  };
  
  const handlePrevTutorial = () => {
    if (tutorialStep > 0) {
      setTutorialStep(prev => {
        const prevStep = prev - 1;
        saveTutorialStatus(false, prevStep);
        return prevStep;
      });
    }
  };
  
  const handleSkipTutorial = () => {
    handleCompleteTutorial();
  };
  
  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    saveTutorialStatus(true, 0);
  };
  
  const handleRestartTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
    saveTutorialStatus(false, 0);
  };

  const handleChange = (k) => (e) =>
    setFormState((s) => ({ ...s, [k]: e.target.value }));

  const callApi = async (endpoint, payload) => {
    const url = `${API_BASE}${endpoint}`;
    const res = await axios.post(url, payload);
    return res.data;
  };

  async function sendToAI(message) {
    try {
      const response = await eliteTaxAPI.askEliteQuestion(
        message,
        null, // No session needed for one-off questions
        "elite",
        "comprehensive"
      );
      return response.response ?? "(no response)";
    } catch (err) {
      console.error("Elite API error in sendToAI:", err);
      return "(assistant error - please try again)";
    }
  }

  function pushAIHistory(question, answer) {
    setAIHistory((h) => [{ q: question, a: answer }, ...h].slice(0, 50));
  }
  
  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
    const newPeriods = createPeriods(3, type);
    setPeriods(newPeriods);
    
    const updatedScenarios = scenarios.map(scenario => ({
      ...scenario,
      periods: newPeriods.map((period, index) => ({
        ...period,
        taxResult: scenario.periods?.[index]?.taxResult || null,
        adjustments: scenario.periods?.[index]?.adjustments || period.adjustments
      }))
    }));
    setScenarios(updatedScenarios);
    
    if (newPeriods.length > 0 && !newPeriods.find(p => p.id === activePeriod)) {
      setActivePeriod(newPeriods[0].id);
    }
  };
  
  const handleAddPeriod = () => {
    const newYear = Math.max(...periods.map(p => p.year)) + 1;
    const newPeriods = createPeriods(1, periodType).map(p => ({
      ...p,
      year: newYear,
      label: p.label.replace(/\d+$/, newYear.toString())
    }));
    
    setPeriods([...periods, ...newPeriods]);
  };
  
  const handleCreateScenario = (name, type, currencyConfig = {}) => {
    const baseScenario = scenarios.find(s => s.type === 'base');
    const newScenario = createScenario(name, type, baseScenario || { periods: [...periods] }, currencyConfig);
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenario(newScenario.id);
  };
  
  const handleDeleteScenario = (scenarioId) => {
    if (scenarios.find(s => s.id === scenarioId)?.isBase) {
      alert('Cannot delete base scenario');
      return;
    }
    
    const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
    setScenarios(updatedScenarios);
    
    if (activeScenario === scenarioId && updatedScenarios.length > 0) {
      setActiveScenario(updatedScenarios[0].id);
    }
  };
  
  const handleScenarioUpdate = (updatedScenario) => {
    setScenarios(prev => prev.map(s => 
      s.id === updatedScenario.id ? updatedScenario : s
    ));
  };
  
  const calculateMultiPeriodTax = async () => {
    setLoading(true);
    
    try {
      const updatedScenarios = [...scenarios];
      const activeScenarioIndex = scenarios.findIndex(s => s.id === activeScenario);
      
      if (activeScenarioIndex === -1) return;
      
      const scenario = scenarios[activeScenarioIndex];
      const currencyMix = scenario.drivers?.currencyMix || {};
      const exchangeRateScenario = scenario.drivers?.exchangeRateScenario || 'moderate';
      
      let lossesToCarryForward = assessedLossesForward;
      
      const updatedPeriods = periods.map((period, index) => {
        const revenueMultiplier = Math.pow(1 + scenario.drivers.revenueGrowth, index);
        const expenseMultiplier = 1 + scenario.drivers.expensePercentage;
        
        const baseRevenue = parseFloat(formState.sales || 0) + parseFloat(formState.otherTradingIncome || 0);
        const baseCOGS = parseFloat(formState.costOfGoodsSold || 0);
        const baseExpenses = Object.entries(formState)
          .filter(([key, value]) => key !== 'sales' && key !== 'otherTradingIncome' && key !== 'costOfGoodsSold')
          .reduce((sum, [key, value]) => sum + (parseFloat(value) || 0), 0);
        
        let totalRevenue = 0;
        let totalExpenses = 0;
        let exchangeGainsLosses = 0;
        
        Object.entries(currencyMix).forEach(([currency, percentage]) => {
          if (percentage > 0) {
            const currencyConfig = ZIMBABWE_TAX_RULES.currencies[currency];
            const volatility = ZIMBABWE_TAX_RULES.exchangeRateScenarios[exchangeRateScenario].volatility;
            
            const currencyRevenue = baseRevenue * revenueMultiplier * percentage;
            totalRevenue += CurrencyUtils.convert(currencyRevenue, currency, 'USD');
            
            let currencyExpenses = baseExpenses * expenseMultiplier * percentage;
            if (currency === 'ZWG') {
              const inflationRate = ZIMBABWE_TAX_RULES.currencyAdjustments.ZWG?.inflationRate || 0;
              currencyExpenses *= (1 + inflationRate * (index + 1));
            }
            totalExpenses += CurrencyUtils.convert(currencyExpenses, currency, 'USD');
            
            if (currency !== 'USD') {
              const exchangeChange = (Math.random() * volatility * 2 - volatility);
              exchangeGainsLosses += currencyRevenue * exchangeChange;
            }
          }
        });
        
        const accountingProfit = totalRevenue - totalExpenses - baseCOGS;
        
        const nonDeductible = parseFloat(formState.depreciation || 0) + 
                            parseFloat(formState.donations || 0) + 
                            parseFloat(formState.finesPenaltiesTax || 0);
        const nonTaxable = parseFloat(formState.dividendReceived || 0) + 
                          parseFloat(formState.capitalReceipts || 0) + 
                          parseFloat(formState.profitOnSale || 0) + 
                          parseFloat(formState.interestFinancial || 0);
        
        const capitalAllowances = capitalAllowancesByPeriod[period.id] || 0;
        
        const taxResult = calculateTaxProfit(
          accountingProfit, 
          { 
            nonDeductible, 
            nonTaxable, 
            exchangeGainsLosses 
          }, 
          capitalAllowances, 
          lossesToCarryForward,
          {
            currency: 'multi',
            breakdown: currencyMix,
            inflationAdjustment: currencyMix.ZWG * ZIMBABWE_TAX_RULES.currencyAdjustments.ZWG?.inflationRate || 0
          }
        );
        
        lossesToCarryForward = taxResult.lossesCarriedForward;
        
        return {
          ...period,
          actuals: {
            revenue: totalRevenue,
            cogs: baseCOGS,
            expenses: totalExpenses,
            currencyBreakdown: currencyMix
          },
          taxResult,
          adjustments: {
            nonDeductible,
            nonTaxable,
            capitalAllowances,
            exchangeGainsLosses
          }
        };
      });
      
      setPeriods(updatedPeriods);
      
      updatedScenarios[activeScenarioIndex] = {
        ...updatedScenarios[activeScenarioIndex],
        periods: updatedPeriods
      };
      setScenarios(updatedScenarios);
      
      const currentPeriod = updatedPeriods.find(p => p.id === activePeriod);
      if (currentPeriod?.taxResult) {
        setResults({
          comprehensive: {
            ...currentPeriod.taxResult,
            grossProfit: currentPeriod.actuals.revenue - currentPeriod.actuals.cogs,
            operatingProfit: currentPeriod.taxResult.accountingProfit,
            taxableIncome: currentPeriod.taxResult.taxableIncome,
            taxDue: currentPeriod.taxResult.taxDue,
            aidsLevy: currentPeriod.taxResult.aidsLevy,
            totalTax: currentPeriod.taxResult.totalTax,
            operatingExpenses: currentPeriod.actuals.expenses,
            capitalAllowances: currentPeriod.adjustments.capitalAllowances
          }
        });
      }
      
      const totalTax = updatedPeriods.reduce((sum, period) => 
        sum + (period.taxResult?.totalTax || 0), 0);
      const totalProfit = updatedPeriods.reduce((sum, period) => 
        sum + (period.taxResult?.taxableIncome || 0), 0);
      
      const aiMessage = `Multi-currency tax analysis completed for ${scenario.name}. ` +
        `Currency mix: ${Object.entries(currencyMix)
          .filter(([_, p]) => p > 0)
          .map(([c, p]) => `${c}: ${(p*100).toFixed(1)}%`)
          .join(', ')}. ` +
        `Total tax liability: ${CurrencyUtils.format(totalTax, 'USD')}. ` +
        `Exchange rate scenario: ${exchangeRateScenario}. ` +
        `Provide Zimbabwe-specific multi-currency tax optimization advice.`;
      
      const aiReply = await sendToAI(aiMessage);
      pushAIHistory(aiMessage, aiReply);
      
    } catch (error) {
      console.error('Multi-currency calculation error:', error);
      alert('Error calculating tax: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDataImported = (data) => {
    setImportedData(data);
    
    if (data && data.length > 0) {
      const firstRow = data[0];
      const updates = {};
      
      if (firstRow.revenue?.value) updates.sales = firstRow.revenue.value;
      if (firstRow.costOfGoodsSold?.value) updates.costOfGoodsSold = firstRow.costOfGoodsSold.value;
      if (firstRow.salaries?.value) updates.salaries = firstRow.salaries.value;
      if (firstRow.depreciation?.value) updates.depreciation = firstRow.depreciation.value;
      
      setFormState(prev => ({ ...prev, ...updates }));
    }
  };
  
  const handleEmployeeCostsUpdate = (periodCosts) => {
    if (periodCosts && periodCosts.length > 0) {
      setEmployeeCosts(periodCosts);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="text-center mb-8 relative">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#FFD700] shadow-lg">
            <button
              onClick={handleRestartTutorial}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white text-[#1ED760] rounded-lg border border-[#1ED760]/30 hover:bg-[#1ED760]/10 hover:border-[#1ED760] transition-all shadow-md z-10"
              title="Show Tutorial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F2F4E] mt-4 mb-4">
              Multi-Currency Tax Planning
            </h1>
            <p className="text-lg md:text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto">
              Advanced tax planning for Zimbabwe's multi-currency environment
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-[#1ED760]/10 text-[#0F2F4E] text-sm rounded-full">
                Multi-Currency Support
              </span>
              <span className="px-3 py-1 bg-[#FFD700]/10 text-[#0F2F4E] text-sm rounded-full">
                USD/ZWG/ZAR Planning
              </span>
              <span className="px-3 py-1 bg-[#0F2F4E]/10 text-[#0F2F4E] text-sm rounded-full">
                Exchange Rate Scenarios
              </span>
              <span className="px-3 py-1 bg-purple-100 text-[#0F2F4E] text-sm rounded-full">
                Zimbabwe Tax Compliance
              </span>
            </div>
            
            {!showTutorial && (
              <div className="mt-4">
                <button
                  onClick={handleRestartTutorial}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/80 text-white rounded-lg font-medium hover:from-[#1ED760]/90 hover:to-[#1ED760]/70 transition text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  New User? Take a Quick Tour
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="mb-6 bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25"
                  : "text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]"
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab("scenarios")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "scenarios"
                  ? "bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25"
                  : "text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]"
              }`}
            >
              💱 Currency & Scenarios
            </button>
            <button
              onClick={() => setActiveTab("data-input")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "data-input"
                  ? "bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25"
                  : "text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]"
              }`}
            >
              📝 Data Input
            </button>
            <button
              onClick={() => setActiveTab("tax-engine")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "tax-engine"
                  ? "bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25"
                  : "text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]"
              }`}
            >
              ⚙️ Tax Engine
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "reports"
                  ? "bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25"
                  : "text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]"
              }`}
            >
              📄 Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PeriodManager
              periods={periods}
              activePeriod={activePeriod}
              onSelectPeriod={setActivePeriod}
              onAddPeriod={handleAddPeriod}
              onPeriodTypeChange={handlePeriodTypeChange}
            />
            
            {activeTab === "overview" && (
              <>
                <MultiCurrencyScenarioComparison scenarios={scenarios} />
                
                <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                    Multi-Currency Tax Projection
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={periods.map(p => ({
                        period: p.label,
                        tax: p.taxResult?.totalTax || 0,
                        exchangeImpact: p.adjustments?.exchangeGainsLosses || 0,
                        revenue: p.actuals?.revenue || 0
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                        <XAxis dataKey="period" stroke="#0F2F4E" fontSize={12} />
                        <YAxis 
                          stroke="#0F2F4E" 
                          fontSize={12}
                          tickFormatter={(value) => CurrencyUtils.format(value, 'USD')}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            CurrencyUtils.format(value, 'USD'),
                            name === 'tax' ? 'Tax Liability' : 
                            name === 'exchangeImpact' ? 'Exchange Impact' : 'Revenue'
                          ]}
                          labelFormatter={(label) => `Period: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#1ED760" 
                          strokeWidth={2}
                          name="Revenue"
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tax" 
                          stroke="#0F2F4E" 
                          strokeWidth={2}
                          name="Tax Liability"
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="exchangeImpact" 
                          stroke="#FFD700" 
                          strokeWidth={2}
                          name="Exchange Impact"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === "scenarios" && (
              <>
                <ScenarioBuilder
                  scenarios={scenarios}
                  activeScenario={activeScenario}
                  onSelectScenario={setActiveScenario}
                  onCreateScenario={handleCreateScenario}
                  onDeleteScenario={handleDeleteScenario}
                />
                
                <CurrencyMixer
                  scenario={scenarios.find(s => s.id === activeScenario)}
                  onUpdate={handleScenarioUpdate}
                />
                
                <ExchangeRateSimulator
                  baseScenario={scenarios.find(s => s.id === activeScenario)}
                  onScenarioUpdate={handleScenarioUpdate}
                />
              </>
            )}
            
            {activeTab === "data-input" && (
              <>
                <DataImportModule onDataImported={handleDataImported} />
                
                <EnhancedCapitalAllowanceModule
                  periods={periods}
                  onUpdate={setCapitalAllowancesByPeriod}
                  assets={assets}
                  onAssetsUpdate={setAssets}
                />
                
                <EmployeeCostModule
                  periods={periods}
                  onUpdate={handleEmployeeCostsUpdate}
                />
              </>
            )}
            
            {activeTab === "tax-engine" && (
              <>
                <TaxBalanceSheet 
                  periods={periods} 
                  activeScenario={activeScenario}
                  scenarios={scenarios} 
                />
                
                <CurrencyImpactAnalysis
                  scenarios={scenarios}
                  periods={periods}
                  activeScenario={activeScenario}
                />
                
                <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                    Tax Adjustments & Rules
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#0F2F4E] mb-2">
                        Assessed Losses Brought Forward ({CurrencyUtils.format(assessedLossesForward, 'USD')})
                      </label>
                      <input
                        type="number"
                        value={assessedLossesForward}
                        onChange={(e) => setAssessedLossesForward(parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-[#EEEEEE] rounded-lg focus:border-[#1ED760]"
                        placeholder="Enter prior year losses"
                        min="0"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-[#EEEEEE] rounded-lg">
                        <h4 className="text-md font-medium text-[#0F2F4E] mb-3">Non-Deductible Expenses</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Depreciation', value: parseFloat(formState.depreciation) || 0 },
                            { name: 'Fines & Penalties', value: parseFloat(formState.finesPenaltiesTax) || 0 },
                            { name: 'Donations', value: parseFloat(formState.donations) || 0 },
                            { name: 'Disallowable Subscriptions', value: parseFloat(formState.disallowableSubscriptions) || 0 }
                          ].map(item => (
                            <div key={item.name} className="flex justify-between items-center">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium text-red-600">
                                {CurrencyUtils.format(item.value, 'USD')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 border border-[#EEEEEE] rounded-lg">
                        <h4 className="text-md font-medium text-[#0F2F4E] mb-3">Non-Taxable Income</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Dividends Received', value: parseFloat(formState.dividendReceived) || 0 },
                            { name: 'Capital Receipts', value: parseFloat(formState.capitalReceipts) || 0 },
                            { name: 'Profit on Asset Sales', value: parseFloat(formState.profitOnSale) || 0 },
                            { name: 'Interest Income', value: parseFloat(formState.interestFinancial) || 0 }
                          ].map(item => (
                            <div key={item.name} className="flex justify-between items-center">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium text-green-600">
                                {CurrencyUtils.format(item.value, 'USD')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === "reports" && (
              <>
                <EnhancedExportButtons 
                  results={results} 
                  formState={formState}
                  scenarios={scenarios}
                  periods={periods}
                />
                
                <MultiCurrencyComplianceDashboard
                  scenarios={scenarios}
                  activeScenario={activeScenario}
                />
                
                <CurrencyImpactAnalysis
                  scenarios={scenarios}
                  periods={periods}
                  activeScenario={activeScenario}
                />
                
                <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                    Report Preview
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0F2F4E]/5">
                        <tr>
                          <th className="p-3 text-left">Period</th>
                          <th className="p-3 text-left">Revenue</th>
                          <th className="p-3 text-left">Expenses</th>
                          <th className="p-3 text-left">Profit</th>
                          <th className="p-3 text-left">Taxable Income</th>
                          <th className="p-3 text-left">Tax Due</th>
                          <th className="p-3 text-left">Effective Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {periods.map((period, index) => {
                          const revenue = period.actuals?.revenue || (parseFloat(formState.sales || 0) / periods.length);
                          const expenses = period.actuals?.expenses || (Object.values(formState).filter(v => typeof v === 'string' && !isNaN(v))
                            .reduce((sum, val) => sum + (parseFloat(val) || 0), 0) / periods.length) - revenue;
                          const profit = period.taxResult?.accountingProfit || (revenue - expenses);
                          const taxableIncome = period.taxResult?.taxableIncome || 0;
                          const taxDue = period.taxResult?.totalTax || 0;
                          const effectiveRate = period.taxResult?.effectiveTaxRate || 0;
                          
                          return (
                            <tr key={index} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                              <td className="p-3 font-medium">{period.label}</td>
                              <td className="p-3">{CurrencyUtils.format(revenue, 'USD')}</td>
                              <td className="p-3">{CurrencyUtils.format(expenses, 'USD')}</td>
                              <td className="p-3">{CurrencyUtils.format(profit, 'USD')}</td>
                              <td className="p-3">
                                <span className="text-blue-600">{CurrencyUtils.format(taxableIncome, 'USD')}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-red-600 font-medium">{CurrencyUtils.format(taxDue, 'USD')}</span>
                              </td>
                              <td className="p-3">
                                <span className="font-medium">{effectiveRate.toFixed(1)}%</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 p-6 rounded-xl border border-[#1ED760]/20 tutorial-calculate">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#0F2F4E]">Ready to Calculate?</h3>
                  <p className="text-sm text-[#0F2F4E]/70 mt-1">
                    Run multi-period tax projections with currency impacts
                  </p>
                </div>
                <button
                  onClick={calculateMultiPeriodTax}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? "🔄 Calculating..." : "🚀 Run Currency Analysis"}
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                Active Scenario
              </h3>
              {activeScenario && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#0F2F4E]/5 rounded-lg">
                    <div className="font-medium text-[#0F2F4E]">
                      {scenarios.find(s => s.id === activeScenario)?.name}
                    </div>
                    <div className="text-sm text-[#0F2F4E]/70 mt-1">
                      {scenarios.find(s => s.id === activeScenario)?.type === 'base' ? 'Base Case' : 
                       scenarios.find(s => s.id === activeScenario)?.type === 'growth' ? 'Growth Plan' : 
                       scenarios.find(s => s.id === activeScenario)?.type === 'cost-cutting' ? 'Cost Cutting' :
                       scenarios.find(s => s.id === activeScenario)?.type === 'zwg-heavy' ? 'ZWG Heavy' :
                       scenarios.find(s => s.id === activeScenario)?.type === 'usd-heavy' ? 'USD Heavy' :
                       scenarios.find(s => s.id === activeScenario)?.type === 'export-focused' ? 'Export Focused' :
                       scenarios.find(s => s.id === activeScenario)?.type === 'tax-optimization' ? 'Tax Optimization' : 'Custom'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#0F2F4E]">Currency Mix</h4>
                    {Object.entries(scenarios.find(s => s.id === activeScenario)?.drivers?.currencyMix || {})
                      .filter(([_, p]) => p > 0)
                      .map(([currency, percentage]) => (
                        <div key={currency} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: CurrencyUtils.getCurrencyColor(currency) }}
                            ></div>
                            <span className="text-sm">{currency}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {(percentage * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4 flex items-center gap-2">
                💱 Currency Rates
              </h3>
              
              <div className="space-y-3">
                {Object.entries(ZIMBABWE_TAX_RULES.currencies)
                  .filter(([code]) => code !== ZIMBABWE_TAX_RULES.baseCurrency)
                  .map(([code, currency]) => (
                    <div key={code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm text-[#0F2F4E]">
                          {currency.name} ({code})
                        </div>
                        <div className="text-xs text-[#0F2F4E]/70">
                          1 {code} = {currency.exchangeRateToBase.toFixed(4)} USD
                        </div>
                      </div>
                      <div className="text-sm font-medium" style={{ color: currency.color }}>
                        {currency.symbol}1 = ${currency.exchangeRateToBase.toFixed(4)}
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-4 text-xs text-[#0F2F4E]/50 text-center">
                Rates are for illustration. Use actual RBZ rates.
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm tutorial-ai-assistant">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
                AI Tax Assistant
              </h3>
              <ChatAssistant
                aiHistory={aiHistory}
                setAIHistory={setAIHistory}
              />
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Multi-Currency Tips</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm font-medium text-yellow-800 mb-1">ZWG Management</div>
                  <div className="text-xs text-yellow-700">
                    • Hedge ZWG exposure above 30%
                    <br/>
                    • Monthly revaluation required
                    <br/>
                    • Inflation adjustments needed
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">USD Strategy</div>
                  <div className="text-xs text-green-700">
                    • Primary reporting currency
                    <br/>
                    • Maintain USD liquidity &gt; 40%
                    <br/>
                    • Withholding tax compliance
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-1">Compliance</div>
                  <div className="text-xs text-blue-700">
                    • Dual reporting (USD & ZWG)
                    <br/>
                    • RBZ rate documentation
                    <br/>
                    • Transfer pricing rules
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
      
      <TutorialOverlay
        isOpen={showTutorial}
        currentStep={tutorialStep}
        onNext={handleNextTutorial}
        onPrev={handlePrevTutorial}
        onClose={handleCompleteTutorial}
        onSkip={handleSkipTutorial}
        activeTab={activeTab}
        onSwitchTab={setActiveTab}
      />
    </div>
  );
}