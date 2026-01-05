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
  CartesianGrid
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const COLORS = ["#1ED760", "#FFD700", "#0F2F4E", "#84cc16", "#f97316"];

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to TaxCul Multi-Period Tax Planning',
    description: 'This tool helps you plan taxes for Zimbabwean businesses. Let\'s get started!',
    position: 'center',
    target: null,
    tab: null, // No tab needed
    order: 1
  },
  {
    id: 'period-timeline',
    title: 'Multi-Period Planning',
    description: 'Plan taxes across multiple years. Switch between annual, quarterly, or monthly views.',
    position: 'bottom',
    target: '.tutorial-period-manager',
    tab: 'overview', // This component is in Overview tab
    order: 2
  },
  {
    id: 'scenarios',
    title: 'Scenario Planning',
    description: 'Create "what-if" scenarios: Growth plans, cost-cutting, or custom strategies.',
    position: 'right',
    target: '.tutorial-scenario',
    tab: 'scenarios', // This component is in Scenarios tab
    order: 3
  },
  {
    id: 'data-import',
    title: 'Import Your Data',
    description: 'Upload Excel/CSV files from Xero, QuickBooks, or other accounting software.',
    position: 'left',
    target: '.tutorial-data-import',
    tab: 'data-input', // This component is in Data Input tab
    order: 4
  },
  {
    id: 'capital-allowances',
    title: 'Capital Allowances',
    description: 'Claim tax deductions for business assets like vehicles, equipment, and buildings.',
    position: 'top',
    target: '.tutorial-capital-allowance',
    tab: 'data-input', // Also in Data Input tab
    order: 5
  },
  {
    id: 'employee-costs',
    title: 'Employee Costs & PAYE',
    description: 'Calculate PAYE, NSSA, and other employment-related taxes.',
    position: 'bottom',
    target: '.tutorial-employee-cost',
    tab: 'data-input', // Also in Data Input tab
    order: 6
  },
  {
    id: 'ai-assistant',
    title: 'AI Tax Assistant',
    description: 'Get Zimbabwe-specific tax advice and optimization tips.',
    position: 'left',
    target: '.tutorial-ai-assistant',
    tab: null, // Always visible in sidebar
    order: 7
  },
  {
    id: 'export-reports',
    title: 'Export Reports',
    description: 'Generate professional PDF and Excel reports for your accountant.',
    position: 'right',
    target: '.tutorial-export',
    tab: 'reports', // This component is in Reports tab
    order: 8
  },
  {
    id: 'calculate',
    title: 'Run Analysis',
    description: 'Click this button to calculate tax projections across all periods and scenarios.',
    position: 'top',
    target: '.tutorial-calculate',
    tab: null, // Always visible at bottom
    order: 9
  }
];

// Check if tutorial has been completed
const getTutorialStatus = () => {
  if (typeof window === 'undefined') return { completed: false, step: 0 };
  const status = localStorage.getItem('taxcul-tutorial-status');
  return status ? JSON.parse(status) : { completed: false, step: 0 };
};

const saveTutorialStatus = (completed = false, step = 0) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('taxcul-tutorial-status', JSON.stringify({ completed, step }));
};

// Zimbabwe Tax Constants from Phase 2 Document
const ZIMBABWE_TAX_RULES = {
  corporateTaxRate: 0.25,
  aidsLevyRate: 0.03,
  capitalAllowanceRates: {
    motorVehicles: { special: 0.5, accelerated: 0.25, wearTear: 0.2 },
    moveableAssets: { special: 0.5, accelerated: 0.25, wearTear: 0.1 },
    commercialBuildings: { special: 0, accelerated: 0, wearTear: 0.025 },
    industrialBuildings: { special: 0, accelerated: 0, wearTear: 0.05 },
    leaseImprovements: { special: 0.5, accelerated: 0.25, wearTear: 0.05 },
    itEquipment: { special: 0.5, accelerated: 0.25, wearTear: 0.333 }
  },
  payeBands: [
    { min: 0, max: 75000, rate: 0.00, deduct: 0 },
    { min: 75001, max: 150000, rate: 0.20, deduct: 15000 },
    { min: 150001, max: 300000, rate: 0.25, deduct: 22500 },
    { min: 300001, max: 600000, rate: 0.30, deduct: 37500 },
    { min: 600001, max: Infinity, rate: 0.40, deduct: 97500 },
  ],
  vatRate: 0.145,
  withholdingTaxRates: {
    royalties: 0.15,
    fees: 0.15,
    interest: 0.10,
    tenders: 0.10,
  }
};

// ============= PHASE 2 UTILITY FUNCTIONS =============

// 1. Multi-Period Data Structure
const createPeriods = (years = 3, periodType = 'annually') => {
  const periods = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = 0; year < years; year++) {
    const targetYear = currentYear + year;
    
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
          capitalAllowances: 0
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
            capitalAllowances: 0
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
            capitalAllowances: 0
          }
        });
      }
    }
  }
  
  return periods;
};

// 2. Scenario Creation
const createScenario = (name, type, baseData) => {
  const drivers = {
    revenueGrowth: type === 'growth' ? 0.2 : 0,
    marginChange: 0,
    expensePercentage: type === 'cost-cutting' ? -0.15 : 0,
    capexSchedule: [],
    staffCount: 0,
    salaryGrowth: 0,
    capitalAllowanceRate: 0.1
  };
  
  return {
    id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    description: '',
    drivers,
    periods: baseData?.periods ? [...baseData.periods] : [],
    createdAt: new Date().toISOString(),
    isBase: type === 'base'
  };
};

// 3. Tax Engine Calculations
const calculateTaxProfit = (accountingProfit, adjustments, capitalAllowances, previousLosses = 0) => {
  // Start with accounting profit
  let taxableIncome = accountingProfit;
  
  // Add back non-deductible expenses
  taxableIncome += adjustments.nonDeductible || 0;
  
  // Deduct non-taxable income
  taxableIncome -= adjustments.nonTaxable || 0;
  
  // Apply prior year losses (can only offset up to current year profit)
  const lossesToUse = Math.min(previousLosses, Math.max(0, taxableIncome));
  taxableIncome = Math.max(0, taxableIncome - lossesToUse);
  
  // Apply capital allowances
  taxableIncome = Math.max(0, taxableIncome - capitalAllowances);
  
  // Calculate tax
  const taxDue = taxableIncome * ZIMBABWE_TAX_RULES.corporateTaxRate;
  const aidsLevy = taxDue * ZIMBABWE_TAX_RULES.aidsLevyRate;
  const totalTax = taxDue + aidsLevy;
  
  // Calculate losses to carry forward
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
    accountingProfit
  };
};

// ============= REACT COMPONENTS =============

function cleanAIText(text) {
    if (!text) return "";
    return text
      .replace(/\\\[|\\\]/g, "")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\times/g, "×")
      .replace(/\s+/g, " ")
      .trim();
}

// 1. Multi-Period Manager Component
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
              {period.taxResult ? `Tax: $${(period.taxResult.totalTax || 0).toLocaleString()}` : 'No data'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 2. Scenario Builder Component
const ScenarioBuilder = ({ scenarios, activeScenario, onSelectScenario, onCreateScenario, onDeleteScenario }) => {
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioType, setNewScenarioType] = useState('growth');
  
  const handleCreate = () => {
    if (newScenarioName.trim()) {
      onCreateScenario(newScenarioName, newScenarioType);
      setNewScenarioName('');
    }
  };
  
  const getScenarioColor = (type) => {
    switch(type) {
      case 'base': return '#0F2F4E';
      case 'growth': return '#1ED760';
      case 'cost-cutting': return '#FFD700';
      case 'strategy-a': return '#8b5cf6';
      case 'strategy-b': return '#f97316';
      default: return '#6b7280';
    }
  };
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-scenario">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Scenario Management</h3>
      
      {/* Create New Scenario */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20">
        <h4 className="text-md font-medium text-[#0F2F4E] mb-3">Create New Scenario</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            <option value="growth">Growth Plan (+20%)</option>
            <option value="cost-cutting">Cost Cutting (-15%)</option>
            <option value="strategy-a">Strategy A</option>
            <option value="strategy-b">Strategy B</option>
          </select>
          <button
            onClick={handleCreate}
            className="p-2 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90"
          >
            Create Scenario
          </button>
        </div>
      </div>
      
      {/* Scenario List */}
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
                     scenario.type === 'strategy-a' ? 'Strategy A' : 'Strategy B'}
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
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Scenario Comparison Dashboard
const ScenarioComparison = ({ scenarios, periods }) => {
  if (scenarios.length < 2) {
    return (
      <div className="bg-white rounded-xl p-8 border border-[#EEEEEE] shadow-sm text-center">
        <svg className="w-12 h-12 mx-auto text-[#0F2F4E]/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-[#0F2F4E]/60">Create multiple scenarios to enable comparison</p>
      </div>
    );
  }
  
  // Calculate comparison data
  const comparisonData = scenarios.map(scenario => {
    const totalTax = scenario.periods?.reduce((sum, period) => 
      sum + (period.taxResult?.totalTax || 0), 0) || 0;
    const totalProfit = scenario.periods?.reduce((sum, period) => 
      sum + (period.taxResult?.taxableIncome || 0), 0) || 0;
    const totalRevenue = scenario.periods?.reduce((sum, period) => 
      sum + (period.actuals?.revenue || 0), 0) || 0;
    
    return {
      name: scenario.name,
      type: scenario.type,
      totalTax,
      totalProfit,
      totalRevenue,
      effectiveRate: totalProfit > 0 ? (totalTax / totalProfit) * 100 : 0,
      color: scenario.type === 'base' ? '#0F2F4E' : 
             scenario.type === 'growth' ? '#1ED760' : 
             scenario.type === 'cost-cutting' ? '#FFD700' : 
             scenario.type === 'strategy-a' ? '#8b5cf6' : '#f97316'
    };
  });
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Scenario Comparison</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {comparisonData.map((scenario, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition" style={{ borderColor: scenario.color }}>
            <div className="font-medium text-[#0F2F4E] mb-2">{scenario.name}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: scenario.color }}>
              ${scenario.totalTax?.toLocaleString()}
            </div>
            <div className="text-sm text-[#0F2F4E]/70">
              Total Tax Liability
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div>Revenue: <span className="font-medium">${scenario.totalRevenue.toLocaleString()}</span></div>
              <div>Profit: <span className="font-medium">${scenario.totalProfit.toLocaleString()}</span></div>
              <div>Effective Rate: <span className="font-medium">{scenario.effectiveRate.toFixed(1)}%</span></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Comparison Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData}>
            <XAxis dataKey="name" stroke="#0F2F4E" fontSize={12} />
            <YAxis stroke="#0F2F4E" fontSize={12} />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
              labelFormatter={(label) => `Scenario: ${label}`}
            />
            <Bar 
              dataKey="totalTax" 
              name="Total Tax"
              radius={[4, 4, 0, 0]}
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 4. Enhanced Capital Allowance Module with Multi-Period Support
const EnhancedCapitalAllowanceModule = ({ periods, onUpdate, assets: externalAssets, onAssetsUpdate }) => {
  const [assets, setAssets] = useState(externalAssets || []);
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'motorVehicles',
    acquisitionDate: new Date().toISOString().split('T')[0],
    cost: '',
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
    
    const asset = {
      ...newAsset,
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      cost: costValue,
      writtenDownValue: costValue,
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
    
    // Initialize allowances for all periods
    periods.forEach(period => {
      allowancesByPeriod[period.id] = 0;
    });
    
    assetList.forEach(asset => {
      const rates = ZIMBABWE_TAX_RULES.capitalAllowanceRates[asset.category];
      if (!rates) return;
      
      // Determine which periods this asset qualifies for allowances
      periods.forEach((period, periodIndex) => {
        const periodYear = period.year || new Date().getFullYear() + Math.floor(periodIndex / (period.type === 'monthly' ? 12 : period.type === 'quarterly' ? 4 : 1));
        
        // Asset must be acquired before or during this period
        if (asset.acquisitionYear <= periodYear) {
          // For first year, use special or accelerated rate
          if (asset.acquisitionYear === periodYear) {
            const allowance = asset.cost * Math.max(rates.special, rates.accelerated);
            allowancesByPeriod[period.id] += allowance;
          } else {
            // For subsequent years, use wear and tear rate on written down value
            // Simplified calculation - would track written down value properly in real implementation
            const allowance = asset.cost * rates.wearTear;
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
        
        {/* Add New Asset */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
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
          <input
            type="number"
            placeholder="Cost ($)"
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
        
        {/* Asset List */}
        {assets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0F2F4E]/5">
                <tr>
                  <th className="p-3 text-left">Asset</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Cost</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">First Year Allowance</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => {
                  const rates = ZIMBABWE_TAX_RULES.capitalAllowanceRates[asset.category];
                  const allowance = asset.cost * Math.max(rates.special, rates.accelerated, rates.wearTear);
                  
                  return (
                    <tr key={asset.id} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                      <td className="p-3">{asset.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-[#1ED760]/10 rounded text-xs">
                          {getCategoryLabel(asset.category)}
                        </span>
                      </td>
                      <td className="p-3">${asset.cost.toLocaleString()}</td>
                      <td className="p-3">{asset.acquisitionDate}</td>
                      <td className="p-3 text-[#1ED760] font-medium">
                        ${allowance.toLocaleString()}
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
        
        {/* Period Allowance Summary */}
        <div className="mt-6 pt-6 border-t border-[#EEEEEE]">
          <h4 className="text-md font-medium text-[#0F2F4E] mb-3">Period Allowance Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {periods.slice(0, 4).map(period => (
              <div key={period.id} className="p-3 bg-[#0F2F4E]/5 rounded-lg">
                <div className="text-xs text-[#0F2F4E]/70">{period.label}</div>
                <div className="text-sm font-medium text-[#1ED760]">
                  ${(period.adjustments?.capitalAllowances || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Tax Balance Sheet View
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
      payeLiability: 0,
      accountingProfit: taxResult?.accountingProfit || 0,
      taxableIncome: taxResult?.taxableIncome || 0
    };
  });
  
  // Calculate totals
  const totals = data.reduce((acc, row) => ({
    taxLiability: acc.taxLiability + row.taxLiability,
    lossesCarriedForward: row.lossesCarriedForward,
    capitalAllowancePool: acc.capitalAllowancePool + row.capitalAllowancePool,
    accountingProfit: acc.accountingProfit + row.accountingProfit,
    taxableIncome: acc.taxableIncome + row.taxableIncome
  }), { taxLiability: 0, lossesCarriedForward: 0, capitalAllowancePool: 0, accountingProfit: 0, taxableIncome: 0 });
  
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
              <th className="p-3 text-left">Losses CF</th>
              <th className="p-3 text-left">Allowance Pool</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-[#EEEEEE] hover:bg-[#0F2F4E]/2">
                <td className="p-3 font-medium">{row.period}</td>
                <td className="p-3">${row.accountingProfit.toLocaleString()}</td>
                <td className="p-3">
                  <span className="text-blue-600">${row.taxableIncome.toLocaleString()}</span>
                </td>
                <td className="p-3">
                  <span className="text-red-600 font-medium">${row.taxLiability.toLocaleString()}</span>
                </td>
                <td className="p-3">
                  <span className="text-purple-600">${row.lossesCarriedForward.toLocaleString()}</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">${row.capitalAllowancePool.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#0F2F4E]/5 font-semibold">
            <tr>
              <td className="p-3">Total</td>
              <td className="p-3">${totals.accountingProfit.toLocaleString()}</td>
              <td className="p-3">${totals.taxableIncome.toLocaleString()}</td>
              <td className="p-3 text-red-600">${totals.taxLiability.toLocaleString()}</td>
              <td className="p-3 text-purple-600">${totals.lossesCarriedForward.toLocaleString()}</td>
              <td className="p-3 text-green-600">${totals.capitalAllowancePool.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#EEEEEE]">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-700">Total Tax</div>
          <div className="text-xl font-bold text-red-600">${totals.taxLiability.toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">Total Profit</div>
          <div className="text-xl font-bold text-blue-600">${totals.taxableIncome.toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-700">Allowances</div>
          <div className="text-xl font-bold text-green-600">${totals.capitalAllowancePool.toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-700">Final Losses CF</div>
          <div className="text-xl font-bold text-purple-600">${totals.lossesCarriedForward.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// 6. Employee Cost & PAYE Module (FIXED VERSION)
const EmployeeCostModule = ({ periods, onUpdate }) => {
  const [employeeData, setEmployeeData] = useState({
    count: 10,
    averageSalary: 50000,
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
  
  // Calculate costs without calling onUpdate
  const calculatePeriodCosts = () => {
    const periodCosts = periods.map((period, index) => {
      const salary = employeeData.averageSalary * Math.pow(1 + employeeData.annualIncrease, index);
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
    
    // Calculate and update parent AFTER state is set
    setTimeout(() => {
      const costs = calculatePeriodCosts();
      onUpdate?.(costs);
    }, 0);
  };
  
  // Initialize with useEffect instead of calling in render
  useEffect(() => {
    const costs = calculatePeriodCosts();
    onUpdate?.(costs);
  }, [periods]); // Only run when periods change initially
  
  const costs = calculatePeriodCosts(); // This is OK now - just for display
  const totalEmployeeCost = costs.reduce((sum, period) => sum + period.totalCost, 0);
  const totalPAYE = costs.reduce((sum, period) => sum + period.paye + period.aidsLevy, 0);
  
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm tutorial-employee-cost">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Employee Cost & PAYE Projections</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          <label className="block text-sm text-[#0F2F4E] mb-2">Avg Salary ($)</label>
          <input
            type="number"
            value={employeeData.averageSalary}
            onChange={(e) => handleInputChange('averageSalary', e.target.value)}
            className="w-full p-2 border border-[#EEEEEE] rounded-lg"
            min="0"
          />
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
      
      {/* Cost Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">Total Employee Cost</div>
          <div className="text-xl font-bold text-blue-600">${totalEmployeeCost.toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-700">Total PAYE & Levy</div>
          <div className="text-xl font-bold text-red-600">${totalPAYE.toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-700">Avg Cost/Employee</div>
          <div className="text-xl font-bold text-green-600">${(totalEmployeeCost / (employeeData.count * periods.length)).toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-700">PAYE % of Cost</div>
          <div className="text-xl font-bold text-purple-600">
            {totalEmployeeCost > 0 ? ((totalPAYE / totalEmployeeCost) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
      
      {/* Period Breakdown */}
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
                <td className="p-2">${period.averageSalary.toLocaleString()}</td>
                <td className="p-2 text-red-600">${((period.paye + period.aidsLevy) || 0).toLocaleString()}</td>
                <td className="p-2 font-medium">${period.totalCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 7. Import Layer Component (CSV/Excel)
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
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      
      if (data.length > 0) {
        setParsedData(data);
        setShowMapping(true);
        
        // Auto-detect columns and create initial mapping
        const columns = Object.keys(data[0]);
        const initialMapping = columns.map(col => ({
          importedColumn: col,
          internalCategory: '',
          taxTreatment: 'neutral'
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
    
    // Transform data based on mapping
    const transformedData = parsedData.map(row => {
      const transformedRow = {};
      mapping.forEach(map => {
        if (map.internalCategory && row[map.importedColumn] !== undefined) {
          transformedRow[map.internalCategory] = row[map.importedColumn];
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
      
      {/* Mapping Interface */}
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

/* ---------- Enhanced Export Components ---------- */
const ExportModal = ({ isOpen, onClose, onExport, type, results, formState }) => {
  const [companyName, setCompanyName] = useState("");
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);

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
      type
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
            Export {type === 'pdf' ? 'PDF' : 'Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Professional PDF Export ---------- */
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

    // Header with Company Info
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
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });

    yPosition = 70;

    // Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(15, 47, 78);
    doc.text('EXECUTIVE SUMMARY', 20, yPosition);
    yPosition += sectionSpacing;

    const summaryData = [
      { label: "Gross Profit", value: `$${(results.comprehensive?.grossProfit || 0).toLocaleString()}` },
      { label: "Operating Profit", value: `$${(results.comprehensive?.operatingProfit || 0).toLocaleString()}` },
      { label: "Taxable Income", value: `$${(results.comprehensive?.taxableIncome || 0).toLocaleString()}` },
      { label: "Corporate Tax (25%)", value: `$${(results.comprehensive?.taxDue || 0).toLocaleString()}` },
      { label: "AIDS Levy (3%)", value: `$${(results.comprehensive?.aidsLevy || 0).toLocaleString()}` },
      { label: "Total Tax Liability", value: `$${(results.comprehensive?.totalTax || 0).toLocaleString()}` }
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

    doc.save(`tax-computation-${options.companyName.replace(/\s+/g, '-').toLowerCase()}-${options.taxYear}.pdf`);
  }).catch(error => {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  });
};

/* ---------- Enhanced Excel Export ---------- */
const exportComprehensiveExcel = (results, formState, options) => {
  const wb = XLSX.utils.book_new();
  
  // Create summary sheet
  const summaryData = [
    ["Tax Planning Report", options.companyName, `Year: ${options.taxYear}`],
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
  
  XLSX.writeFile(wb, `tax-planning-${options.companyName.replace(/\s+/g, '-').toLowerCase()}-${options.taxYear}.xlsx`);
};

/* ---------- Enhanced Export Buttons Component ---------- */
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
              Includes AI-powered tax optimization suggestions (for guidance purposes)
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

/* ---------- Shared UI Components ---------- */
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

/* ---------- Chat Assistant Component ---------- */
const ChatAssistant = ({ aiHistory, setAIHistory }) => {
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!query.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(`${API_BASE}/chatbot`, { query });
      const assistant = res.data.response ?? "(no response)";
      setAIHistory((h) => [{ q: query, a: assistant }, ...h].slice(0, 50));
      setQuery("");
    } catch {
      setAIHistory((h) => [
        { q: query, a: "(assistant error)" },
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
            <div className="text-sm text-[#1ED760] mt-1">A: {cleanAIText(h.a)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Enhanced Tax Breakdown Visualization Component ---------- */
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
  
  // Calculate key metrics from form data
  const salesRevenue = parseFloat(formState.sales) || 0;
  const otherTradingIncome = parseFloat(formState.otherTradingIncome) || 0;
  const totalRevenue = salesRevenue + otherTradingIncome;
  
  const costOfGoodsSold = parseFloat(formState.costOfGoodsSold) || 0;
  const operatingExpenses = comprehensive.operatingExpenses || 0;
  const totalBusinessCosts = costOfGoodsSold + operatingExpenses;
  
  const totalTax = comprehensive.totalTax || 0;
  const taxableIncome = comprehensive.taxableIncome || 0;
  
  // Calculate detailed expense breakdown from form data
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

  // Calculate tax efficiency metrics
  const taxAsFractionOfRevenue = totalRevenue > 0 ? (totalTax / totalRevenue) * 100 : 0;
  const taxAsFractionOfCosts = totalBusinessCosts > 0 ? (totalTax / totalBusinessCosts) * 100 : 0;
  const effectiveTaxRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
  
  // Calculate profit margins
  const grossProfitMargin = totalRevenue > 0 ? ((comprehensive.grossProfit || 0) / totalRevenue) * 100 : 0;
  const operatingProfitMargin = totalRevenue > 0 ? ((comprehensive.operatingProfit || 0) / totalRevenue) * 100 : 0;
  const netProfitMargin = totalRevenue > 0 ? (((comprehensive.operatingProfit || 0) - totalTax) / totalRevenue) * 100 : 0;

  // Data for charts
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
      {/* Key Tax Efficiency Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-xl text-white">
          <div className="text-sm opacity-90">Tax/Revenue Ratio</div>
          <div className="text-2xl font-bold mt-1">{taxAsFractionOfRevenue.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            ${totalTax.toLocaleString()} / ${totalRevenue.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-xl text-[#0F2F4E]">
          <div className="text-sm opacity-90">Tax/Cost Ratio</div>
          <div className="text-2xl font-bold mt-1">{taxAsFractionOfCosts.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            ${totalTax.toLocaleString()} / ${totalBusinessCosts.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-xl text-white">
          <div className="text-sm opacity-90">Effective Tax Rate</div>
          <div className="text-2xl font-bold mt-1">{effectiveTaxRate.toFixed(2)}%</div>
          <div className="text-xs opacity-80 mt-1">
            On ${(taxableIncome || 0).toLocaleString()} income
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
        {/* Tax Efficiency Comparison */}
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

        {/* Profit Margins */}
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
        {/* Expense Breakdown */}
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
                    `$${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}`,
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

        {/* Revenue & Tax Distribution */}
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
                    `$${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}`,
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

      {/* Tax Optimization Insights */}
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

/* ---------- Chart Components ---------- */
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
      {/* Tax Breakdown Pie Chart */}
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
                  `$${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}`,
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

      {/* Capital Allowance Bar Chart */}
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
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `$${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}`,
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
                  formatter={(value) => `$${value > 1000 ? `${(value/1000).toFixed(0)}k` : value.toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Tutorial Overlay Component with Tab Switching
const TutorialOverlay = ({ 
  isOpen, 
  currentStep, 
  onNext, 
  onPrev, 
  onClose, 
  onSkip,
  activeTab, // Receive current active tab
  onSwitchTab // Function to switch tabs
}) => {
  const [targetElement, setTargetElement] = useState(null);
  const [highlightStyle, setHighlightStyle] = useState({});
  
  // Get current step safely
  const step = currentStep < TUTORIAL_STEPS.length 
    ? TUTORIAL_STEPS[currentStep] 
    : null;
  
  // Auto-switch to the required tab for this tutorial step
  useEffect(() => {
    if (!isOpen || !step) return;
    
    // If step requires a specific tab and we're not on it, switch
    if (step.tab && step.tab !== activeTab) {
      onSwitchTab?.(step.tab);
      
      // Wait a bit for tab to switch and component to render
      const timer = setTimeout(() => {
        findAndHighlightElement(step);
      }, 300); // Short delay for tab switch animation
      
      return () => clearTimeout(timer);
    } else {
      // Already on correct tab, highlight immediately
      findAndHighlightElement(step);
    }
  }, [isOpen, currentStep, activeTab]); // Add activeTab as dependency

  const findAndHighlightElement = (step) => {
    if (!step || !step.target || typeof document === 'undefined') {
      setHighlightStyle({ display: 'none' });
      return;
    }
    
    const element = document.querySelector(step.target);
    setTargetElement(element);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      
      // Check if element is actually visible (not display: none)
      const style = window.getComputedStyle(element);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       rect.width > 0 && 
                       rect.height > 0;
      
      if (isVisible) {
        setHighlightStyle({
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          display: 'block'
        });
      } else {
        // Element exists but not visible
        setHighlightStyle({ display: 'none' });
        console.warn(`Tutorial target ${step.target} is not visible`);
      }
    } else {
      // Element not found at all
      setHighlightStyle({ display: 'none' });
      console.warn(`Tutorial target ${step.target} not found`);
    }
  };
  
  // Early return AFTER hooks
  if (!isOpen || !step) {
    return null;
  }
  
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  
  // Simple positioning - always center for now to avoid coordinate issues
  const positionClass = 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Highlight Overlay - only if element is visible */}
      {highlightStyle.display === 'block' && (
        <div 
          className="absolute border-2 border-[#1ED760] rounded-lg z-[101] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
          style={highlightStyle}
        >
          <div className="absolute inset-0 bg-[#1ED760]/10 animate-pulse" />
        </div>
      )}
      
      {/* Tutorial Card */}
      <div className={`absolute w-96 bg-white rounded-2xl p-6 shadow-2xl border-2 border-[#1ED760] z-[102] ${positionClass}`}>
        {/* Show current tab info */}
        {step.tab && (
          <div className="mb-3 px-3 py-1 bg-[#1ED760]/10 text-[#1ED760] text-sm rounded-lg inline-block">
            {step.tab === 'overview' && '📊 Overview Tab'}
            {step.tab === 'scenarios' && '📈 Scenarios Tab'}
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

/* ---------- MAIN TAX PLANNING PAGE COMPONENT ---------- */
export default function TaxPlanningPage() {
  // ============= EXISTING STATE =============
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [aiHistory, setAIHistory] = useState([]);
  
  // Comprehensive form state matching Excel structure exactly
  const [formState, setFormState] = useState({
    // Profit and Loss - Operating Income
    sales: "1000000",
    otherTradingIncome: "50000",
    
    // Cost of Goods Sold
    costOfGoodsSold: "400000",
    
    // Operating Expenses - Updated to match Excel document
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
    
    // Tax Computation
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
    
    // Capital Allowance
    motorVehicles: "100000",
    moveableAssets: "50000",
    commercialBuildings: "0",
    industrialBuildings: "0",
    leaseImprovements: "20000",
  });

  // ============= PHASE 2 NEW STATE =============
  const [periodType, setPeriodType] = useState('annually');
  const [periods, setPeriods] = useState(() => createPeriods(3, periodType));
  const [activePeriod, setActivePeriod] = useState(periods[0]?.id);
  const [scenarios, setScenarios] = useState([
    createScenario('Base Case', 'base', { periods: [...periods] })
  ]);
  const [activeScenario, setActiveScenario] = useState(scenarios[0]?.id);
  const [assets, setAssets] = useState([]);
  const [capitalAllowancesByPeriod, setCapitalAllowancesByPeriod] = useState({});
  const [employeeCosts, setEmployeeCosts] = useState([]);
  const [assessedLossesForward, setAssessedLossesForward] = useState(0);
  const [importedData, setImportedData] = useState(null);
  // ==============================================

  // tutorial states
  // Add tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Initialize tutorial on first load
  useEffect(() => {
    const status = getTutorialStatus();
    if (!status.completed) {
      // Show tutorial after a short delay for better UX
      const timer = setTimeout(() => {
        setShowTutorial(true);
        setTutorialStep(status.step);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // In your TaxPlanningPage component, add:
  useEffect(() => {
    if (showTutorial) {
      console.log('Current tutorial step:', TUTORIAL_STEPS[tutorialStep]);
      console.log('Looking for element:', TUTORIAL_STEPS[tutorialStep]?.target);
      
      if (TUTORIAL_STEPS[tutorialStep]?.target) {
        const element = document.querySelector(TUTORIAL_STEPS[tutorialStep].target);
        console.log('Found element:', element);
      }
    }
  }, [showTutorial, tutorialStep]);
  
  // Tutorial control functions
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
      const res = await axios.post(`${API_BASE}/chatbot`, { query: message });
      return res.data?.response ?? "(no response)";
    } catch (err) {
      return "(assistant error)";
    }
  }

  function pushAIHistory(question, answer) {
    setAIHistory((h) => [{ q: question, a: answer }, ...h].slice(0, 50));
  }

  // ============= PHASE 2 FUNCTIONS =============
  
  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
    const newPeriods = createPeriods(3, type);
    setPeriods(newPeriods);
    
    // Update all scenarios with new periods
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
  
  const handleCreateScenario = (name, type) => {
    const baseScenario = scenarios.find(s => s.type === 'base');
    const newScenario = createScenario(name, type, baseScenario || { periods: [...periods] });
    
    // Apply scenario drivers
    if (type === 'growth') {
      newScenario.drivers.revenueGrowth = 0.2;
    } else if (type === 'cost-cutting') {
      newScenario.drivers.expensePercentage = -0.15;
    }
    
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
  
  const calculateMultiPeriodTax = async () => {
    setLoading(true);
    
    try {
      const updatedScenarios = [...scenarios];
      const activeScenarioIndex = scenarios.findIndex(s => s.id === activeScenario);
      
      if (activeScenarioIndex === -1) return;
      
      // Get base accounting data from form
      const baseRevenue = parseFloat(formState.sales || 0) + parseFloat(formState.otherTradingIncome || 0);
      const baseCOGS = parseFloat(formState.costOfGoodsSold || 0);
      const baseExpenses = Object.entries(formState)
        .filter(([key, value]) => key !== 'sales' && key !== 'otherTradingIncome' && key !== 'costOfGoodsSold')
        .reduce((sum, [key, value]) => sum + (parseFloat(value) || 0), 0);
      
      const scenario = scenarios[activeScenarioIndex];
      let lossesToCarryForward = assessedLossesForward;
      
      // Calculate for each period
      const updatedPeriods = periods.map((period, index) => {
        // Apply scenario drivers
        const revenueMultiplier = Math.pow(1 + scenario.drivers.revenueGrowth, index);
        const expenseMultiplier = 1 + scenario.drivers.expensePercentage;
        
        const periodRevenue = baseRevenue * revenueMultiplier;
        const periodCOGS = baseCOGS * revenueMultiplier;
        const periodExpenses = baseExpenses * expenseMultiplier;
        
        const accountingProfit = periodRevenue - periodCOGS - periodExpenses;
        
        // Get adjustments for this period
        const nonDeductible = parseFloat(formState.depreciation || 0) + 
                            parseFloat(formState.donations || 0) + 
                            parseFloat(formState.finesPenaltiesTax || 0);
        const nonTaxable = parseFloat(formState.dividendReceived || 0) + 
                          parseFloat(formState.capitalReceipts || 0) + 
                          parseFloat(formState.profitOnSale || 0) + 
                          parseFloat(formState.interestFinancial || 0);
        
        const capitalAllowances = capitalAllowancesByPeriod[period.id] || 0;
        
        // Calculate tax for this period
        const taxResult = calculateTaxProfit(
          accountingProfit, 
          { nonDeductible, nonTaxable }, 
          capitalAllowances, 
          lossesToCarryForward
        );
        
        lossesToCarryForward = taxResult.lossesCarriedForward;
        
        // Update period with results
        return {
          ...period,
          actuals: {
            revenue: periodRevenue,
            cogs: periodCOGS,
            expenses: periodExpenses
          },
          taxResult,
          adjustments: {
            nonDeductible,
            nonTaxable,
            capitalAllowances
          }
        };
      });
      
      // Update periods
      setPeriods(updatedPeriods);
      
      // Update active scenario
      updatedScenarios[activeScenarioIndex] = {
        ...updatedScenarios[activeScenarioIndex],
        periods: updatedPeriods
      };
      setScenarios(updatedScenarios);
      
      // Update current view results
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
      
      // AI Analysis
      const totalTax = updatedPeriods.reduce((sum, period) => 
        sum + (period.taxResult?.totalTax || 0), 0);
      const totalProfit = updatedPeriods.reduce((sum, period) => 
        sum + (period.taxResult?.taxableIncome || 0), 0);
      
      const aiMessage = `Multi-period tax analysis completed for ${scenario.name}. ` +
        `Total tax liability across ${periods.length} periods: $${totalTax.toLocaleString()}. ` +
        `Effective tax rate: ${totalProfit > 0 ? ((totalTax / totalProfit) * 100).toFixed(1) : 0}%. ` +
        `Losses carried forward: $${lossesToCarryForward.toLocaleString()}. ` +
        `Provide Zimbabwe-specific tax optimization advice for this scenario.`;
      
      const aiReply = await sendToAI(aiMessage);
      pushAIHistory(aiMessage, aiReply);
      
    } catch (error) {
      console.error('Multi-period calculation error:', error);
      alert('Error calculating tax: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDataImported = (data) => {
    setImportedData(data);
    console.log('Imported data:', data);
    
    // Auto-populate form fields if possible
    if (data && data.length > 0) {
      const firstRow = data[0];
      const updates = {};
      
      // Map imported fields to form state
      if (firstRow.revenue) updates.sales = firstRow.revenue;
      if (firstRow.costOfGoodsSold) updates.costOfGoodsSold = firstRow.costOfGoodsSold;
      if (firstRow.salaries) updates.salaries = firstRow.salaries;
      if (firstRow.depreciation) updates.depreciation = firstRow.depreciation;
      
      setFormState(prev => ({ ...prev, ...updates }));
    }
  };
  
  const handleEmployeeCostsUpdate = (periodCosts) => {
    if (periodCosts && periodCosts.length > 0) {
      setEmployeeCosts(periodCosts);
    }
  };

  // ============= RENDER =============

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#FFD700] shadow-lg">
            {/* Help Button - Now outside the main div but still in header */}
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
              Multi-Period Tax Planning
            </h1>
            <p className="text-lg md:text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto">
              Professional tax planning and analysis platform for Zimbabwe
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-[#1ED760]/10 text-[#0F2F4E] text-sm rounded-full">
                Multi-Period Projections
              </span>
              <span className="px-3 py-1 bg-[#FFD700]/10 text-[#0F2F4E] text-sm rounded-full">
                Scenario Planning
              </span>
              <span className="px-3 py-1 bg-[#0F2F4E]/10 text-[#0F2F4E] text-sm rounded-full">
                Capital Allowance Module
              </span>
              <span className="px-3 py-1 bg-purple-100 text-[#0F2F4E] text-sm rounded-full">
                Zimbabwe Tax Rules
              </span>
            </div>
            
            {/* Optional: Add a "New User?" prompt */}
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

        {/* Main Navigation */}
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
              📈 Scenarios
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
            {/* Period Manager */}
            <PeriodManager
              periods={periods}
              activePeriod={activePeriod}
              onSelectPeriod={setActivePeriod}
              onAddPeriod={handleAddPeriod}
              onPeriodTypeChange={handlePeriodTypeChange}
            />
            
            {/* Main Content Area */}
            {activeTab === "overview" && (
              <>
                <ScenarioComparison 
                  scenarios={scenarios} 
                  periods={periods} 
                />
                
                {/* Multi-Period Tax Chart */}
                <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                    Multi-Period Tax Projection
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={periods.map(p => ({
                        period: p.label,
                        tax: p.taxResult?.totalTax || 0,
                        profit: p.taxResult?.taxableIncome || 0,
                        revenue: p.actuals?.revenue || 0
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                        <XAxis 
                          dataKey="period" 
                          stroke="#0F2F4E" 
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#0F2F4E" 
                          fontSize={12}
                          tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            `$${value.toLocaleString()}`,
                            name === 'tax' ? 'Tax Liability' : 
                            name === 'profit' ? 'Taxable Income' : 'Revenue'
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
                          dataKey="profit" 
                          stroke="#0F2F4E" 
                          strokeWidth={2}
                          name="Taxable Income"
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tax" 
                          stroke="#FFD700" 
                          strokeWidth={2}
                          name="Tax Liability"
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
              </>
            )}
            
            {activeTab === "data-input" && (
              <>
                {/* Data Import Module */}
                <DataImportModule onDataImported={handleDataImported} />
                
                {/* Enhanced Capital Allowance Module */}
                <EnhancedCapitalAllowanceModule
                  periods={periods}
                  onUpdate={setCapitalAllowancesByPeriod}
                  assets={assets}
                  onAssetsUpdate={setAssets}
                />
                
                {/* Employee Cost Module */}
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
                
                {/* Tax Adjustments Manager */}
                <div className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                    Tax Adjustments & Rules
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#0F2F4E] mb-2">
                        Assessed Losses Brought Forward ($)
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
                                ${item.value.toLocaleString()}
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
                                ${item.value.toLocaleString()}
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
                
                {/* Multi-Period Report Preview */}
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
                              <td className="p-3">${revenue.toLocaleString()}</td>
                              <td className="p-3">${expenses.toLocaleString()}</td>
                              <td className="p-3">${profit.toLocaleString()}</td>
                              <td className="p-3">
                                <span className="text-blue-600">${taxableIncome.toLocaleString()}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-red-600 font-medium">${taxDue.toLocaleString()}</span>
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
            
            {/* Calculate Button */}
            <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 p-6 rounded-xl border border-[#1ED760]/20 tutorial-calculate">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#0F2F4E]">Ready to Calculate?</h3>
                  <p className="text-sm text-[#0F2F4E]/70 mt-1">
                    Run multi-period tax projections across all scenarios
                  </p>
                </div>
                <ActionButton 
                  onClick={calculateMultiPeriodTax} 
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  {loading ? "🔄 Calculating..." : "🚀 Run Multi-Period Analysis"}
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Scenario Summary */}
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
                       scenarios.find(s => s.id === activeScenario)?.type === 'cost-cutting' ? 'Cost Cutting' : 'Custom'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-[#1ED760]/5 rounded">
                      <div className="text-[#0F2F4E]/70">Periods</div>
                      <div className="font-medium text-[#1ED760] text-lg">{periods.length}</div>
                    </div>
                    <div className="text-center p-3 bg-[#FFD700]/5 rounded">
                      <div className="text-[#0F2F4E]/70">Scenarios</div>
                      <div className="font-medium text-[#FFD700] text-lg">{scenarios.length}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[#EEEEEE]">
                    <div className="text-sm text-[#0F2F4E]/70 mb-2">Drivers Applied:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Revenue Growth:</span>
                        <span className="font-medium">{(scenarios.find(s => s.id === activeScenario)?.drivers.revenueGrowth * 100 || 0).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expense Change:</span>
                        <span className="font-medium">{(scenarios.find(s => s.id === activeScenario)?.drivers.expensePercentage * 100 || 0).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Period Summary */}
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
                Active Period Summary
              </h3>
              {activePeriod && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#0F2F4E]/5 rounded-lg">
                    <div className="font-medium text-[#0F2F4E] text-center">
                      {periods.find(p => p.id === activePeriod)?.label}
                    </div>
                  </div>
                  
                  {periods.find(p => p.id === activePeriod)?.taxResult && (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#0F2F4E]/70">Taxable Income:</span>
                          <span className="text-[#1ED760] font-medium">
                            ${(periods.find(p => p.id === activePeriod)?.taxResult?.taxableIncome || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#0F2F4E]/70">Tax Liability:</span>
                          <span className="text-red-600 font-medium">
                            ${(periods.find(p => p.id === activePeriod)?.taxResult?.totalTax || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#0F2F4E]/70">Effective Rate:</span>
                          <span className="font-medium">
                            {(periods.find(p => p.id === activePeriod)?.taxResult?.effectiveTaxRate || 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#0F2F4E]/70">Losses CF:</span>
                          <span className="text-purple-600 font-medium">
                            ${(periods.find(p => p.id === activePeriod)?.taxResult?.lossesCarriedForward || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Chat Assistant */}
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
                AI Tax Assistant
              </h3>
              <div className="tutorial-ai-assistant">
                <ChatAssistant
                  aiHistory={aiHistory}
                  setAIHistory={setAIHistory}
                />
              </div>
            </div>
            
            {/* Capital Allowance Rates */}
            <div className="bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Capital Allowance Rates
              </h3>
              
              <div className="space-y-3">
                {Object.entries(ZIMBABWE_TAX_RULES.capitalAllowanceRates).map(([category, rates]) => (
                  <div key={category} className={`p-3 rounded-lg border ${
                    rates.special > 0 
                      ? 'bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 border-[#1ED760]/20' 
                      : 'bg-[#EEEEEE]/50 border-[#EEEEEE]'
                  }`}>
                    <div className="font-medium text-[#0F2F4E] text-sm mb-2">
                      {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      {rates.special > 0 && (
                        <div className="text-center">
                          <div className="text-[#0F2F4E]/70">Special</div>
                          <div className="text-[#1ED760] font-semibold">{(rates.special * 100).toFixed(0)}%</div>
                        </div>
                      )}
                      {rates.accelerated > 0 && (
                        <div className="text-center">
                          <div className="text-[#0F2F4E]/70">Accelerated</div>
                          <div className="text-[#1ED760] font-semibold">{(rates.accelerated * 100).toFixed(0)}%</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                        <div className="text-[#1ED760] font-semibold">{(rates.wearTear * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#EEEEEE] text-center">
                <div className="text-xs text-[#0F2F4E]/50">
                  Zimbabwe Revenue Authority approved rates
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
      {/* Tutorial Overlay */}
      {/* // In TaxPlanningPage component, pass activeTab and onSwitchTab: */}
      <TutorialOverlay
        isOpen={showTutorial}
        currentStep={tutorialStep}
        onNext={handleNextTutorial}
        onPrev={handlePrevTutorial}
        onClose={handleCompleteTutorial}
        onSkip={handleSkipTutorial}
        activeTab={activeTab} // Pass current tab
        onSwitchTab={setActiveTab} // Pass tab switcher function
      />
    </div>
  );
}