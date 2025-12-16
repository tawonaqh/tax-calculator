'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, Download, Share2, FileUp, Plus, 
  BarChart3, TrendingUp, Building, Package, 
  Settings, RefreshCw, ChevronRight, AlertCircle,
  DollarSign, Percent, Calendar, Tag, Trash2,
  Car, Factory, Cpu, Home, Sofa, Hammer,
  Info, Banknote, Clock, FileText
} from 'lucide-react'
import Papa from 'papaparse'

// Reusable InputField Component
const InputField = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  className = '',
  disabled = false,
  tooltip = ''
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-[#0F2F4E]">
        {label}
      </label>
      {tooltip && (
        <div className="group relative">
          <Info className="w-4 h-4 text-[#0F2F4E]/40 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#0F2F4E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#0F2F4E]"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-[#0F2F4E]/60" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-2 py-3 bg-white border border-[#EEEEEE] rounded-xl 
                   text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:outline-none focus:border-[#1ED760] 
                   focus:ring-2 focus:ring-[#1ED760]/50 transition-all duration-300 shadow-sm ${className}`}
      />
    </div>
  </div>
)

// SelectField Component
const SelectField = ({ label, value, onChange, options, icon: Icon, tooltip = '' }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-[#0F2F4E]">
        {label}
      </label>
      {tooltip && (
        <div className="group relative">
          <Info className="w-4 h-4 text-[#0F2F4E]/40 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#0F2F4E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#0F2F4E]"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-[#0F2F4E]/60" />
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-[#EEEEEE] rounded-xl 
                   text-[#0F2F4E] focus:outline-none focus:border-[#1ED760] 
                   focus:ring-2 focus:ring-[#1ED760]/50 transition-all duration-300 shadow-sm`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
)

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-[#FFD700] shadow-lg p-6 ${className}`}>
    {children}
  </div>
)

// StatCard Component - Fixed with proper icon display
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = '#1ED760', 
  trend, 
  description,
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: {
      card: 'p-3',
      iconWrapper: 'p-2 hidden',
      icon: 'w-2 h-2 hidden',
      value: 'text-sm',
      title: 'text-xs',
      description: 'text-xs',
      trend: 'text-xs',
      trendIcon: 'w-3 h-3',
    },
    md: {
      card: 'p-6',
      iconWrapper: 'p-3',
      icon: 'w-3 h-3',
      value: 'text-xl',
      title: 'text-sm',
      description: 'text-xs',
      trend: 'text-sm',
      trendIcon: 'w-4 h-4',
    },
    lg: {
      card: 'p-8',
      iconWrapper: 'p-4',
      icon: 'w-8 h-8',
      value: 'text-3xl',
      title: 'text-base',
      description: 'text-sm',
      trend: 'text-base',
      trendIcon: 'w-5 h-5',
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={`bg-white rounded-2xl border border-[#FFD700] shadow-sm hover:shadow-md transition-all duration-300 ${classes.card}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${classes.title} font-medium text-[#0F2F4E]/60 mb-1`}>{title}</p>
          <p className={`${classes.value} font-bold text-[#0F2F4E]`}>{value}</p>
          {description && (
            <p className={`${classes.description} text-[#0F2F4E]/40 mt-1`}>{description}</p>
          )}
        </div>
        {Icon && (
          <div 
            className={`${classes.iconWrapper} rounded-xl`}
            style={{ 
              backgroundColor: `${color}1A` // 1A = 10% opacity in hex
            }}
          >
            <Icon className={classes.icon} style={{ color }} />
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 ${classes.trend} ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp className={classes.trendIcon} />
          <span>{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
      )}
    </div>
  )
}

// Generate unique IDs
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

// ZIMBABWE TAX COMPLIANCE - UPDATED FOR 2024/2025 (Finance No. 2 Act, 2024)
// ===========================================================================

// Effective Corporate Tax Rate with AIDS Levy (25% base + 3% levy = 25.75%)
const ZIM_EFFECTIVE_TAX_RATE = 0.2575 // 25.75%

// Capital Allowance Rules for Zimbabwe (2024/2025)
const ZIM_CAPITAL_ALLOWANCE_RULES = {
  // Motor Vehicles - No SIA, 20% W&T
  MotorVehicles: { 
    wAndTRate: 0.20, 
    siaRate: 0.00,
    icon: Car,
    description: "Cars, trucks, commercial vehicles",
    color: "#3B82F6",
    minValue: 0,
    conditions: "No SIA for vehicles"
  },
  // Plant & Machinery - 25% W&T + 50% SIA (50% in Year 1, 25% over next 4 years)
  PlantMachinery: { 
    wAndTRate: 0.25, 
    siaRate: 0.50,
    icon: Factory,
    description: "Manufacturing & production equipment",
    color: "#10B981",
    minValue: 1000,
    siaExplanation: "50% SIA in Year 1, 25% over next 4 years"
  },
  // Computers & IT Equipment - 33.33% W&T + 50% SIA
  ITEquipment: { 
    wAndTRate: 0.3333, 
    siaRate: 0.50,
    icon: Cpu,
    description: "Computers, software, servers",
    color: "#8B5CF6",
    minValue: 0,
    conditions: "Software included with hardware"
  },
  // Industrial Buildings - 5% W&T + 50% SIA
  IndustrialBuildings: { 
    wAndTRate: 0.05, 
    siaRate: 0.50,
    icon: Factory,
    description: "Factories, warehouses for manufacturing",
    color: "#F59E0B",
    minValue: 10000
  },
  // Commercial Buildings - 2.5% W&T only (No SIA)
  CommercialBuildings: { 
    wAndTRate: 0.025, 
    siaRate: 0.00,
    icon: Building,
    description: "Office buildings, retail spaces",
    color: "#EF4444",
    minValue: 10000,
    conditions: "No SIA for commercial buildings"
  },
  // Furniture & Fittings - 10% W&T only (No SIA)
  FurnitureFittings: { 
    wAndTRate: 0.10, 
    siaRate: 0.00,
    icon: Sofa,
    description: "Office furniture, partitions, shelving",
    color: "#EC4899",
    minValue: 500
  },
  // Improvements & Other - 10% W&T only (No SIA)
  Improvements: { 
    wAndTRate: 0.10, 
    siaRate: 0.00,
    icon: Hammer,
    description: "Renovations, upgrades to existing assets",
    color: "#6B7280",
    minValue: 1000
  }
}

// Zimbabwe Tax Rates (2024/2025)
const ZIM_TAX_RATES = {
  standard: ZIM_EFFECTIVE_TAX_RATE, // 25.75% effective rate
  specialMiningLease: 0.1545, // 15% + 3% AIDS levy
  sezAfter5Years: 0.1545, // 15% + 3% AIDS levy
  manufacturingExport: 0.1545, // 15% + 3% AIDS levy for 51%+ exports
  smallScale: 0.1545, // 15% + 3% AIDS levy for turnover < $25,000
  agriculture: 0.103, // 10% + 3% AIDS levy
}

// Compliance Information
const ZIM_COMPLIANCE_INFO = {
  paymentCurrency: "Foreign currency based on receipts",
  revenueRemittance: "24 hours for financial intermediaries (from Jan 1, 2025)",
  lateFilingPenalty: "Proposed: US$30 per day (from Jan 1, 2025)",
  qpdDates: [
    "20 March (10%)",
    "20 June (25%)",
    "20 September (30%)",
    "15 December (35%)"
  ]
}

// Zimbabwe Asset Categories for UI
const ZIM_ASSET_CATEGORIES = [
  { value: 'MotorVehicles', label: 'Motor Vehicles (20% W&T)', icon: Car },
  { value: 'PlantMachinery', label: 'Plant & Machinery (25% W&T + 50% SIA)', icon: Factory },
  { value: 'ITEquipment', label: 'IT Equipment (33.33% W&T + 50% SIA)', icon: Cpu },
  { value: 'IndustrialBuildings', label: 'Industrial Buildings (5% W&T + 50% SIA)', icon: Building },
  { value: 'CommercialBuildings', label: 'Commercial Buildings (2.5% W&T)', icon: Building },
  { value: 'FurnitureFittings', label: 'Furniture & Fittings (10% W&T)', icon: Sofa },
  { value: 'Improvements', label: 'Improvements (10% W&T)', icon: Hammer }
]

// Initial sample scenarios
const INITIAL_SCENARIOS = [
  {
    id: 'scenario-1',
    scenario_name: 'Base Scenario',
    description: 'Current business plan',
    created_at: new Date().toISOString(),
    assets: [],
    businessType: 'standard'
  },
  {
    id: 'scenario-2',
    scenario_name: 'Growth Plan',
    description: '20% growth with new equipment',
    created_at: new Date().toISOString(),
    assets: [],
    businessType: 'standard'
  }
]

// Initial sample assets for base scenario
const INITIAL_ASSETS = []

const CapitalAllowanceEngine = () => {
  // For scenarios
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS)

  // For activeScenario
  const [activeScenario, setActiveScenario] = useState(INITIAL_SCENARIOS[0]?.id || null)

  // For assets
  const [assets, setAssets] = useState(INITIAL_ASSETS.map(asset => ({
    ...asset,
    current_rtv: asset.current_rtv || asset.acquisition_cost
  })))

  // State for new asset
  const [newAsset, setNewAsset] = useState({
    asset_name: '',
    asset_category: 'PlantMachinery',
    acquisition_date: new Date().toISOString().split('T')[0],
    acquisition_cost: '',
    allowance_method: 'SIA + W&T',
    is_pooled: false,
    pool_name: '',
    currency: 'USD'
  })

  // Business type for tax rate
  const [businessType, setBusinessType] = useState('standard')

  // State for file upload
  const [csvFile, setCsvFile] = useState(null)

  // Multi-period settings
  const [periodSettings, setPeriodSettings] = useState({
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 5,
    periodType: 'Annual',
  })

  // Accounting data (for tax P&L integration)
  const [accountingData, setAccountingData] = useState({})

  // Results
  const [results, setResults] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('assets')
  const [isCreatingScenario, setIsCreatingScenario] = useState(false)
  const [newScenarioName, setNewScenarioName] = useState('')

  // Current tax rate based on business type
  const currentTaxRate = ZIM_TAX_RATES[businessType] || ZIM_TAX_RATES.standard

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('taxcul-scenarios', JSON.stringify(scenarios))
  }, [scenarios])

  useEffect(() => {
    localStorage.setItem('taxcul-active-scenario', activeScenario)
  }, [activeScenario])

  useEffect(() => {
    localStorage.setItem('taxcul-assets', JSON.stringify(assets))
  }, [assets])

  // Get assets for active scenario
  const getActiveScenarioAssets = () => {
    return assets.filter(asset => asset.scenario_id === activeScenario)
  }

  // Load from localStorage only on the client side
  useEffect(() => {
    try {
      const savedScenarios = localStorage.getItem('taxcul-scenarios')
      const savedActiveScenario = localStorage.getItem('taxcul-active-scenario')
      const savedAssets = localStorage.getItem('taxcul-assets')
      
      if (savedScenarios) {
        setScenarios(JSON.parse(savedScenarios))
      }
      
      if (savedActiveScenario) {
        setActiveScenario(savedActiveScenario)
      }
      
      if (savedAssets) {
        const parsed = JSON.parse(savedAssets)
        setAssets(parsed.map(asset => ({
          ...asset,
          current_rtv: asset.current_rtv || asset.acquisition_cost
        })))
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  }, [])

  const createScenario = () => {
    if (!newScenarioName.trim()) {
      setError('Please enter a scenario name')
      return
    }

    const newScenario = {
      id: `scenario-${generateId()}`,
      scenario_name: newScenarioName,
      description: `${newScenarioName} scenario for tax planning`,
      created_at: new Date().toISOString(),
      assets: [],
      businessType: 'standard'
    }

    setScenarios([...scenarios, newScenario])
    setNewScenarioName('')
    setIsCreatingScenario(false)
    setActiveScenario(newScenario.id)
  }

  const addAsset = () => {
    if (!activeScenario) {
      setError('Please select or create a scenario first')
      return
    }

    if (!newAsset.asset_name.trim()) {
      setError('Please enter asset name')
      return
    }

    if (!newAsset.acquisition_cost || parseFloat(newAsset.acquisition_cost) <= 0) {
      setError('Please enter a valid acquisition cost')
      return
    }

    const rules = ZIM_CAPITAL_ALLOWANCE_RULES[newAsset.asset_category]
    const cost = parseFloat(newAsset.acquisition_cost)
    
    // Check minimum value thresholds
    if (rules.minValue && cost < rules.minValue) {
      setError(`Minimum value for ${rules.description} is $${rules.minValue.toLocaleString()}`)
      return
    }

    const asset = {
      id: `asset-${generateId()}`,
      ...newAsset,
      acquisition_cost: cost,
      current_rtv: cost,
      scenario_id: activeScenario,
      sia_claimed: false,
      remaining_sia_years: rules.siaRate > 0 ? 4 : 0
    }

    setAssets([...assets, asset])
    setNewAsset({
      asset_name: '',
      asset_category: 'PlantMachinery',
      acquisition_date: new Date().toISOString().split('T')[0],
      acquisition_cost: '',
      allowance_method: 'SIA + W&T',
      is_pooled: false,
      pool_name: '',
      currency: 'USD'
    })
    setError('')
  }

  const deleteAsset = (assetId) => {
    setAssets(assets.filter(asset => asset.id !== assetId))
  }

  const handleCSVUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setCsvFile(file)
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedAssets = results.data
          .filter(row => row['Asset Name'] && row['Category'] && row['Acquisition Date'] && row['Cost'])
          .map(row => {
            const category = Object.keys(ZIM_CAPITAL_ALLOWANCE_RULES).find(
              key => key.toLowerCase() === row['Category'].toLowerCase().replace(/[^a-z0-9]/g, '')
            ) || 'PlantMachinery'
            
            const rules = ZIM_CAPITAL_ALLOWANCE_RULES[category]
            
            return {
              id: `asset-${generateId()}`,
              asset_name: row['Asset Name'],
              asset_category: category,
              acquisition_date: row['Acquisition Date'],
              acquisition_cost: parseFloat(row['Cost']) || 0,
              allowance_method: rules.siaRate > 0 ? 'SIA + W&T' : 'W&T Only',
              is_pooled: false,
              pool_name: '',
              current_rtv: parseFloat(row['Cost']) || 0,
              scenario_id: activeScenario,
              currency: row['Currency'] || 'USD',
              sia_claimed: false,
              remaining_sia_years: rules.siaRate > 0 ? 4 : 0
            }
          })

        setAssets([...assets, ...importedAssets])
        setError('')
      },
      error: (error) => {
        setError(`CSV parsing error: ${error.message}`)
      }
    })
  }

  const calculateZimbabweCapitalAllowances = (assetsForScenario, year) => {
    let totalAllowance = 0
    let siaTotal = 0
    let wAndTTotal = 0
    const assetBreakdown = []

    assetsForScenario.forEach(asset => {
      const rules = ZIM_CAPITAL_ALLOWANCE_RULES[asset.asset_category]
      if (!rules) return

      const acquisitionYear = new Date(asset.acquisition_date).getFullYear()
      const yearsSinceAcquisition = year - acquisitionYear

      // Initialize asset tracking if not exists
      if (!asset.sia_claimed) asset.sia_claimed = false
      if (!asset.remaining_sia_years) asset.remaining_sia_years = rules.siaRate > 0 ? 4 : 0

      // Special Initial Allowance (SIA) - Year 1 only
      if (acquisitionYear === year && !asset.sia_claimed && rules.siaRate > 0) {
        const sia = asset.acquisition_cost * rules.siaRate
        siaTotal += sia
        asset.sia_claimed = true
        
        assetBreakdown.push({
          asset_name: asset.asset_name,
          category: asset.asset_category,
          allowance: sia,
          type: 'SIA',
          rate: rules.siaRate,
          description: 'Special Initial Allowance'
        })
      }

      // SIA Continuation (25% over next 4 years after Year 1)
      if (asset.sia_claimed && asset.remaining_sia_years > 0 && yearsSinceAcquisition >= 1) {
        const yearsClaimed = 4 - asset.remaining_sia_years
        if (yearsClaimed >= 1 && yearsClaimed <= 4) {
          const additionalSIA = asset.acquisition_cost * 0.25
          siaTotal += additionalSIA
          asset.remaining_sia_years--
          
          assetBreakdown.push({
            asset_name: asset.asset_name,
            category: asset.asset_category,
            allowance: additionalSIA,
            type: 'SIA Cont',
            rate: 0.25,
            description: `Year ${yearsClaimed + 1} of 4-year SIA`
          })
        }
      }

      // Wear & Tear Allowance (every year)
      if (yearsSinceAcquisition >= 0 && asset.current_rtv > 0) {
        const wAndT = Math.min(
          asset.current_rtv * rules.wAndTRate,
          asset.current_rtv // Can't depreciate below 0
        )
        wAndTTotal += wAndT
        
        // Update remaining tax value
        asset.current_rtv = Math.max(0, asset.current_rtv - wAndT)
        
        assetBreakdown.push({
          asset_name: asset.asset_name,
          category: asset.asset_category,
          allowance: wAndT,
          type: 'W&T',
          rate: rules.wAndTRate,
          remaining_rtv: asset.current_rtv
        })
      }
    })

    totalAllowance = siaTotal + wAndTTotal

    return { 
      totalAllowance, 
      siaTotal, 
      wAndTTotal,
      assetBreakdown
    }
  }

  const calculateTaxImpact = async () => {
    if (!activeScenario) {
      setError('Please select a scenario')
      return
    }

    setLoading(true)
    setError('')

    try {
      const periods = []
      for (let year = periodSettings.startYear; year <= periodSettings.endYear; year++) {
        periods.push(year)
      }

      const activeScenarioAssets = getActiveScenarioAssets()
      const allowances = {}
      let totalCapitalAllowances = 0
      let totalTaxSavings = 0
      let totalSIAAmount = 0
      let totalWTAmount = 0

      // Calculate for each period
      periods.forEach(year => {
        const { totalAllowance, siaTotal, wAndTTotal } = calculateZimbabweCapitalAllowances(activeScenarioAssets, year)
        allowances[year] = {
          capital_allowance: totalAllowance,
          sia_amount: siaTotal,
          wt_amount: wAndTTotal,
          tax_impact: totalAllowance * currentTaxRate,
        }
        totalCapitalAllowances += totalAllowance
        totalTaxSavings += totalAllowance * currentTaxRate
        totalSIAAmount += siaTotal
        totalWTAmount += wAndTTotal
      })

      // Get category summary
      const summaryByCategory = {}
      Object.keys(ZIM_CAPITAL_ALLOWANCE_RULES).forEach(category => {
        const categoryAssets = activeScenarioAssets.filter(a => a.asset_category === category)
        if (categoryAssets.length > 0) {
          let categoryAllowance = 0
          let categorySIA = 0
          let categoryWT = 0
          
          periods.forEach(year => {
            const { totalAllowance, siaTotal, wAndTTotal } = calculateZimbabweCapitalAllowances(categoryAssets, year)
            categoryAllowance += totalAllowance
            categorySIA += siaTotal
            categoryWT += wAndTTotal
          })
          
          summaryByCategory[category] = {
            total_allowance: categoryAllowance,
            sia_amount: categorySIA,
            wt_amount: categoryWT,
            asset_count: categoryAssets.length,
          }
        }
      })

      // Simulate tax P&L results with Zimbabwe tax rates
      const taxResults = {
        period_results: periods.reduce((acc, year) => {
          const revenue = 100000 + (year - periods[0]) * 20000 // Growing revenue
          const expenses = 60000 + (year - periods[0]) * 10000
          const accountingProfit = revenue - expenses
          const taxableIncome = Math.max(0, accountingProfit - allowances[year].capital_allowance)
          const taxPayable = taxableIncome * currentTaxRate
          
          acc[year] = {
            accounting_profit: accountingProfit,
            taxable_income: taxableIncome,
            tax_payable: taxPayable,
            effective_tax_rate: taxPayable / Math.max(1, accountingProfit),
            revenue: revenue,
            expenses: expenses
          }
          return acc
        }, {})
      }

      setResults({
        allowances: {
          periods: allowances,
          total_capital_allowances: totalCapitalAllowances,
          total_tax_savings: totalTaxSavings,
          total_sia: totalSIAAmount,
          total_wt: totalWTAmount,
          summary_by_category: summaryByCategory,
        },
        taxResults,
        taxRate: currentTaxRate,
        taxRateType: businessType
      })
      setActiveTab('results')
    } catch (err) {
      setError('Calculation failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const compareScenarios = (scenarioIds) => {
    try {
      const selectedScenarios = scenarios.filter(s => scenarioIds.includes(s.id))
      
      const comparisonData = {
        scenarios: selectedScenarios.map(scenario => {
          const scenarioAssets = assets.filter(a => a.scenario_id === scenario.id)
          const totalCost = scenarioAssets.reduce((sum, a) => sum + (a.acquisition_cost || 0), 0)
          
          // Calculate allowances using Zimbabwe rules
          let totalAllowance = 0
          let totalSIA = 0
          let totalWT = 0
          
          for (let year = periodSettings.startYear; year <= periodSettings.endYear; year++) {
            const { totalAllowance: yearlyAllowance, siaTotal, wAndTTotal } = 
              calculateZimbabweCapitalAllowances(scenarioAssets, year)
            totalAllowance += yearlyAllowance
            totalSIA += siaTotal
            totalWT += wAndTTotal
          }
          
          const taxSavings = totalAllowance * currentTaxRate
          const effectiveTaxRate = 0.25 // Simplified - would calculate based on actual profits

          return {
            id: scenario.id,
            scenario_name: scenario.scenario_name,
            total_assets: scenarioAssets.length,
            total_cost: totalCost,
            capital_allowances: totalAllowance,
            sia_amount: totalSIA,
            wt_amount: totalWT,
            tax_savings: taxSavings,
            effective_tax_rate: effectiveTaxRate,
            total_tax: (100000 * currentTaxRate) - taxSavings
          }
        }),
        differences: {
          tax_difference: 0,
          allowance_difference: 0,
          rate_difference: 0,
        }
      }

      setComparisonResults(comparisonData)
      setActiveTab('compare')
    } catch (err) {
      setError('Comparison failed: ' + err.message)
    }
  }

  const exportToCSV = () => {
    const activeScenarioAssets = getActiveScenarioAssets()
    const csvContent = [
      ['Asset Name', 'Category', 'Acquisition Date', 'Cost (USD)', 'Allowance Method', 'Currency'],
      ...activeScenarioAssets.map(asset => [
        asset.asset_name,
        asset.asset_category,
        asset.acquisition_date,
        asset.acquisition_cost,
        asset.allowance_method,
        asset.currency || 'USD'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zim-capital-assets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const activeScenarioAssets = getActiveScenarioAssets()
  const totalAssetCost = activeScenarioAssets.reduce((sum, asset) => sum + (asset.acquisition_cost || 0), 0)
  const totalAllowances = results?.allowances?.total_capital_allowances || 0
  const totalTaxSavings = results?.allowances?.total_tax_savings || 0
  const totalSIA = results?.allowances?.total_sia || 0
  const totalWT = results?.allowances?.total_wt || 0

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12">
      <div className="max-w-8xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#1ED760]/10 rounded-2xl">
                  <Calculator className="w-12 h-12 text-[#1ED760]" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E]">
                    Capital Allowance Engine
                  </h1>
                  <p className="text-xl text-[#0F2F4E]/80 mt-2">
                    Zimbabwe Tax Planning with Scenario Analysis
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="px-3 py-1 bg-[#1ED760]/10 text-[#1ED760] rounded-full">
                      Effective Tax Rate: {(currentTaxRate * 100).toFixed(2)}%
                    </span>
                    <span className="px-3 py-1 bg-[#0F2F4E]/10 text-[#0F2F4E] rounded-full">
                      Finance (No. 2) Act, 2024
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportToCSV}
                  className="px-6 py-3 bg-[#0F2F4E] text-white rounded-xl font-semibold 
                           hover:bg-[#0F2F4E]/90 transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => compareScenarios(scenarios.slice(0, 2).map(s => s.id))}
                  className="px-6 py-3 bg-[#1ED760] text-white rounded-xl font-semibold 
                           hover:bg-[#1ED760]/90 transition-all duration-300 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compare Scenarios
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            {/* Scenario & Period Control */}
            <Card className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SelectField
                  label="Active Scenario"
                  value={activeScenario || ''}
                  onChange={(e) => setActiveScenario(e.target.value)}
                  options={[
                    { value: '', label: 'Select Scenario' },
                    ...scenarios.map(scenario => ({
                      value: scenario.id,
                      label: scenario.scenario_name
                    }))
                  ]}
                  icon={Settings}
                />

                <div className="">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    Business Type (Tax Rate)
                  </label>
                  <SelectField
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    options={[
                      { value: 'standard', label: `Standard Corporate (${(ZIM_TAX_RATES.standard * 100).toFixed(2)}%)` },
                      { value: 'specialMiningLease', label: `Special Mining Lease (${(ZIM_TAX_RATES.specialMiningLease * 100).toFixed(2)}%)` },
                      { value: 'sezAfter5Years', label: `SEZ (After 5 years) (${(ZIM_TAX_RATES.sezAfter5Years * 100).toFixed(2)}%)` },
                      { value: 'manufacturingExport', label: `Manufacturing Export (${(ZIM_TAX_RATES.manufacturingExport * 100).toFixed(2)}%)` },
                      { value: 'agriculture', label: `Agriculture (${(ZIM_TAX_RATES.agriculture * 100).toFixed(2)}%)` }
                    ]}
                  />
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    Period Range
                  </label>
                  <div className="flex gap-2">
                    <InputField
                      type="number"
                      value={periodSettings.startYear}
                      onChange={(e) => setPeriodSettings(prev => ({...prev, startYear: parseInt(e.target.value)}))}
                      placeholder="Start Year"
                      icon={Calendar}
                      className="flex-1"
                    />
                    <InputField
                      type="number"
                      value={periodSettings.endYear}
                      onChange={(e) => setPeriodSettings(prev => ({...prev, endYear: parseInt(e.target.value)}))}
                      placeholder="End Year"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-end gap-3 mt-4">
                <motion.button
                  onClick={calculateTaxImpact}
                  disabled={loading || !activeScenario}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 
                             flex items-center justify-center gap-3 shadow-lg
                             ${loading || !activeScenario
                               ? 'bg-[#EEEEEE] text-[#0F2F4E]/40 cursor-not-allowed' 
                               : 'bg-[#1ED760] text-white hover:bg-[#1ED760]/90 hover:shadow-[#1ED760]/25'
                             }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      Run ZIM Tax Analysis
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </Card>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#EEEEEE] mb-6 overflow-x-auto">
              {[
                { id: 'assets', label: 'Asset Register', icon: Package },
                { id: 'results', label: 'Results', icon: BarChart3 },
                { id: 'compare', label: 'Compare', icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium text-lg whitespace-nowrap
                             ${activeTab === tab.id 
                               ? 'text-[#1ED760] border-b-2 border-[#1ED760]' 
                               : 'text-[#0F2F4E]/60 hover:text-[#0F2F4E]'
                             } transition-colors duration-300`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'assets' && (
                  <AssetRegisterTab 
                    assets={activeScenarioAssets}
                    newAsset={newAsset}
                    setNewAsset={setNewAsset}
                    addAsset={addAsset}
                    deleteAsset={deleteAsset}
                    activeScenario={activeScenario}
                    handleCSVUpload={handleCSVUpload}
                    csvFile={csvFile}
                    isCreatingScenario={isCreatingScenario}
                    setIsCreatingScenario={setIsCreatingScenario}
                    newScenarioName={newScenarioName}
                    setNewScenarioName={setNewScenarioName}
                    createScenario={createScenario}
                  />
                )}

                {activeTab === 'results' && results && (
                  <ResultsTab 
                    results={results}
                    periodSettings={periodSettings}
                    totalAssetCost={totalAssetCost}
                    businessType={businessType}
                  />
                )}

                {activeTab === 'compare' && comparisonResults && (
                  <ComparisonTab 
                    comparisonResults={comparisonResults} 
                    scenarios={scenarios}
                    compareScenarios={compareScenarios}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">Scenario Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Total Assets"
                  value={activeScenarioAssets.length}
                  icon={Package}
                  color="#3B82F6"
                  description="Capital assets"
                  size="sm"
                />
                <StatCard
                  title="Total Cost"
                  value={`$${totalAssetCost.toLocaleString()}`}
                  icon={DollarSign}
                  color="#10B981"
                  size="sm"
                />
                {results && (
                  <>
                    <StatCard
                      title="Total Allowances"
                      value={`$${totalAllowances.toLocaleString()}`}
                      icon={Percent}
                      color="#1ED760"
                      size="sm"
                    />
                    <StatCard
                      title="Tax Savings"
                      value={`$${totalTaxSavings.toLocaleString()}`}
                      icon={Banknote}
                      color="#1ED760"
                      size="sm"
                    />
                  </>
                )}
              </div>
              {results && (
                <div className="mt-4 pt-4 border-t border-[#EEEEEE]">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[#0F2F4E]/60">SIA Total:</div>
                    <div className="text-right font-medium">${totalSIA.toLocaleString()}</div>
                    <div className="text-[#0F2F4E]/60">W&T Total:</div>
                    <div className="text-right font-medium">${totalWT.toLocaleString()}</div>
                    <div className="text-[#0F2F4E]/60">Tax Rate:</div>
                    <div className="text-right font-medium text-[#1ED760]">
                      {(results.taxRate * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Category Breakdown */}
            <Card>
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">Assets by Category</h3>
              <div className="space-y-4">
                {Object.keys(ZIM_CAPITAL_ALLOWANCE_RULES).map(category => {
                  const rules = ZIM_CAPITAL_ALLOWANCE_RULES[category]
                  const categoryAssets = activeScenarioAssets.filter(a => a.asset_category === category)
                  if (categoryAssets.length === 0) return null
                  
                  const cost = categoryAssets.reduce((sum, a) => sum + (a.acquisition_cost || 0), 0)
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: rules.color }}
                        />
                        <div>
                          <span className="text-sm text-[#0F2F4E]">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#0F2F4E]/60">
                              {rules.wAndTRate * 100}% W&T
                            </span>
                            {rules.siaRate > 0 && (
                              <span className="text-xs text-[#1ED760]">
                                + {rules.siaRate * 100}% SIA
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#0F2F4E]">{categoryAssets.length}</div>
                        <div className="text-xs text-[#0F2F4E]/60">
                          ${cost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* ZIM Tax Compliance Info */}
            <Card>
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4">ZIM Tax Compliance</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#0F2F4E]/10 rounded-lg">
                    <Clock className="w-4 h-4 text-[#0F2F4E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F2F4E]">Revenue Remittance</p>
                    <p className="text-xs text-[#0F2F4E]/60">{ZIM_COMPLIANCE_INFO.revenueRemittance}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F2F4E]">Late Filing Penalty</p>
                    <p className="text-xs text-[#0F2F4E]/60">{ZIM_COMPLIANCE_INFO.lateFilingPenalty}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F2F4E]">QPD Dates 2025</p>
                    <ul className="text-xs text-[#0F2F4E]/60 space-y-1 mt-1">
                      {ZIM_COMPLIANCE_INFO.qpdDates.map((date, index) => (
                        <li key={index}>{date}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-[#0F2F4E]/5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#0F2F4E]/60 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#0F2F4E] font-medium">Disclaimer</p>
                  <p className="text-xs text-[#0F2F4E]/60 mt-1">
                    This tool provides estimates based on Zimbabwe tax regulations (Finance No. 2 Act, 2024). 
                    Consult a tax professional for official filings. Rates subject to change.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Asset Register Tab
const AssetRegisterTab = ({ 
  assets, 
  newAsset, 
  setNewAsset, 
  addAsset, 
  deleteAsset,
  activeScenario,
  handleCSVUpload,
  csvFile,
  isCreatingScenario,
  setIsCreatingScenario,
  newScenarioName,
  setNewScenarioName,
  createScenario
}) => (
  <Card>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0F2F4E]">Asset Register</h2>
        <p className="text-sm text-[#0F2F4E]/60 mt-1">
          Add capital assets for Zimbabwe tax planning
        </p>
      </div>
      <div className="flex gap-3">
        <label className="px-4 py-2 border border-[#1ED760] text-[#1ED760] rounded-xl 
                         hover:bg-[#1ED760]/10 transition-all duration-300 cursor-pointer
                         flex items-center gap-2">
          <FileUp className="w-4 h-4" />
          Import CSV
          <input 
            type="file" 
            accept=".csv"
            onChange={handleCSVUpload} 
            className="hidden" 
          />
        </label>
      </div>
    </div>

    {/* Scenario Creation */}
    {!activeScenario && (
      <Card className="mb-6 bg-[#0F2F4E]/5">
        <div className="text-center py-6">
          <Building className="w-12 h-12 text-[#0F2F4E]/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-2">No Active Scenario</h3>
          <p className="text-[#0F2F4E]/60 mb-4">Create a scenario to start adding assets</p>
          {isCreatingScenario ? (
            <div className="space-y-4 max-w-md mx-auto">
              <InputField
                label="Scenario Name"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="e.g., 2024 Tax Planning"
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={createScenario}
                  className="flex-1 py-3 bg-[#1ED760] text-white rounded-xl font-semibold 
                           hover:bg-[#1ED760]/90 transition-all duration-300"
                >
                  Create Scenario
                </motion.button>
                <button
                  onClick={() => setIsCreatingScenario(false)}
                  className="px-6 py-3 bg-white text-[#0F2F4E] rounded-xl font-semibold 
                           hover:bg-[#0F2F4E]/5 transition-all duration-300 border border-[#EEEEEE]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreatingScenario(true)}
              className="px-6 py-3 bg-[#1ED760] text-white rounded-xl font-semibold 
                       hover:bg-[#1ED760]/90 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create New Scenario
            </motion.button>
          )}
        </div>
      </Card>
    )}

    {/* Add Asset Form */}
    {activeScenario && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <InputField
            label="Asset Name"
            value={newAsset.asset_name}
            onChange={(e) => setNewAsset(prev => ({...prev, asset_name: e.target.value}))}
            placeholder="Asset name"
            icon={Tag}
          />
          <SelectField
            label="Category"
            value={newAsset.asset_category}
            onChange={(e) => {
              const category = e.target.value
              setNewAsset(prev => ({...prev, asset_category: category}))
            }}
            options={ZIM_ASSET_CATEGORIES}
            icon={Package}
          />
          <InputField
            label="Acquisition Date"
            type="date"
            value={newAsset.acquisition_date}
            onChange={(e) => setNewAsset(prev => ({...prev, acquisition_date: e.target.value}))}
            icon={Calendar}
            tooltip="Date of purchase/commissioning"
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <InputField
                label="Cost (USD)"
                value={newAsset.acquisition_cost}
                onChange={(e) => setNewAsset(prev => ({...prev, acquisition_cost: e.target.value}))}
                placeholder="0.00"
                type="number"
                icon={DollarSign}
                className="flex-1"
                tooltip="Enter cost in USD (ZWL equivalent will be calculated)"
              />
            </div>
          </div>
          <div className="flex items-end">
            <motion.button
              onClick={addAsset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#1ED760] text-white rounded-xl hover:bg-[#1ED760]/90 
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Asset
            </motion.button>
          </div>
        </div>

        {/* Asset Table */}
        {assets.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#EEEEEE]">
            <table className="min-w-full divide-y divide-[#EEEEEE]">
              <thead className="bg-[#0F2F4E]/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                    Cost (USD)
                  </th>
                  <th className="px6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                    Allowances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] bg-white">
                {assets.map(asset => {
                  const rules = ZIM_CAPITAL_ALLOWANCE_RULES[asset.asset_category]
                  const Icon = rules?.icon || Package
                  const color = rules?.color || '#1ED760'
                  
                  return (
                    <motion.tr 
                      key={asset.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#1ED760]/5 transition-colors duration-300"
                    >
                      <td className="px-6 py-4">
                        <div className="text-[#0F2F4E] font-medium">{asset.asset_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-1.5 rounded-lg"
                            style={{ backgroundColor: `${color}1A` }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div>
                            <span className={`px-1 py-1 rounded-full text-xs font-medium ${
                              asset.asset_category === 'MotorVehicles' ? 'bg-blue-100 text-blue-800' :
                              asset.asset_category === 'PlantMachinery' ? 'bg-green-100 text-green-800' :
                              asset.asset_category === 'ITEquipment' ? 'bg-purple-100 text-purple-800' :
                              asset.asset_category === 'IndustrialBuildings' ? 'bg-yellow-100 text-yellow-800' :
                              asset.asset_category === 'CommercialBuildings' ? 'bg-red-100 text-red-800' :
                              asset.asset_category === 'FurnitureFittings' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {asset.asset_category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <div className="text-xs text-[#0F2F4E]/60 mt-1">
                              {rules?.wAndTRate * 100}% W&T
                              {rules?.siaRate > 0 && ` + ${rules.siaRate * 100}% SIA`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#0F2F4E]">
                        {new Date(asset.acquisition_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#0F2F4E] font-bold">
                          ${asset.acquisition_cost?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#1ED760]/10 text-[#1ED760] rounded-full text-xs font-medium">
                          {asset.allowance_method}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-[#0F2F4E]/40 mx-auto mb-4" />
            <p className="text-[#0F2F4E]/60">No assets added yet. Add assets to start tax planning.</p>
          </div>
        )}
      </>
    )}
  </Card>
)

const ResultsTab = ({ results, periodSettings, totalAssetCost, businessType }) => {
  const years = Object.keys(results.allowances?.periods || {})
  const taxTypeLabels = {
    standard: 'Standard Corporate',
    specialMiningLease: 'Special Mining Lease',
    sezAfter5Years: 'SEZ (After 5 years)',
    manufacturingExport: 'Manufacturing Export',
    agriculture: 'Agriculture'
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Asset Cost"
          value={`$${totalAssetCost.toLocaleString()}`}
          icon={DollarSign}
          color="#0F2F4E"
          size="md"
        />
        <StatCard
          title="Total Allowances"
          value={`$${results.allowances?.total_capital_allowances?.toLocaleString()}`}
          icon={Percent}
          color="#1ED760"
          size="md"
        />
        <StatCard
          title="Tax Savings"
          value={`$${results.allowances?.total_tax_savings?.toLocaleString()}`}
          icon={Banknote}
          color="#1ED760"
          size="md"
        />
        <StatCard
          title="Effective Tax Rate"
          value={`${(results.taxRate * 100).toFixed(2)}%`}
          icon={TrendingUp}
          color="#0F2F4E"
          description={taxTypeLabels[results.taxRateType] || 'Standard'}
          size="md"
        />
      </div>

      {/* SIA vs W&T Breakdown */}
      <Card>
        <h3 className="text-xl font-bold text-[#0F2F4E] mb-6">Allowance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-[#0F2F4E]/60 mb-1">Special Initial Allowance (SIA)</div>
              <div className="text-3xl font-bold text-[#1ED760]">
                ${results.allowances?.total_sia?.toLocaleString()}
              </div>
              <div className="text-xs text-[#0F2F4E]/60 mt-2">
                50% in Year 1, 25% over next 4 years
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-[#0F2F4E]/60 mb-1">Wear & Tear (W&T)</div>
              <div className="text-3xl font-bold text-[#3B82F6]">
                ${results.allowances?.total_wt?.toLocaleString()}
              </div>
              <div className="text-xs text-[#0F2F4E]/60 mt-2">
                Annual depreciation based on category
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-[#0F2F4E]/60 mb-1">Total Tax Impact</div>
              <div className="text-3xl font-bold text-[#10B981]">
                ${results.allowances?.total_tax_savings?.toLocaleString()}
              </div>
              <div className="text-xs text-[#0F2F4E]/60 mt-2">
                Based on {taxTypeLabels[businessType]} rate
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Year-by-Year Breakdown */}
      <Card>
        <h3 className="text-xl font-bold text-[#0F2F4E] mb-6">Multi-Period Analysis ({periodSettings.startYear} - {periodSettings.endYear})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#EEEEEE]">
            <thead className="bg-[#0F2F4E]/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  SIA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  W&T
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  Total Allowance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  Taxable Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  Tax Payable
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  Effective Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {years.map(year => {
                const period = results.allowances.periods[year]
                const taxPeriod = results.taxResults?.period_results?.[year]
                const effectiveRate = taxPeriod?.effective_tax_rate || 0
                
                return (
                  <tr key={year} className="hover:bg-[#1ED760]/5">
                    <td className="px-6 py-4 font-medium text-[#0F2F4E]">{year}</td>
                    <td className="px-6 py-4">
                      <div className="text-[#1ED760] font-bold">
                        ${period.sia_amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#3B82F6]">
                      ${period.wt_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#0F2F4E] font-bold">
                        ${period.capital_allowance?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#0F2F4E]">
                      ${taxPeriod?.taxable_income?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#0F2F4E] font-bold">
                        ${taxPeriod?.tax_payable?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#0F2F4E]/10 text-[#0F2F4E] rounded-full text-xs font-medium">
                        {(effectiveRate * 100).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <h3 className="text-xl font-bold text-[#0F2F4E] mb-6">Allowances by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(results.allowances?.summary_by_category || {}).map(([category, data]) => {
            const rules = ZIM_CAPITAL_ALLOWANCE_RULES[category]
            const Icon = rules?.icon || Package
            const color = rules?.color || '#1ED760'
            
            return (
              <div key={category} className="p-4 border border-[#EEEEEE] rounded-xl hover:border-[#1ED760]/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${color}1A` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F2F4E]">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-[#0F2F4E]/60">
                      {data.asset_count} assets
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#0F2F4E]/60">SIA:</span>
                    <span className="text-sm font-medium text-[#1ED760]">
                      ${data.sia_amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#0F2F4E]/60">W&T:</span>
                    <span className="text-sm font-medium text-[#3B82F6]">
                      ${data.wt_amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#EEEEEE]">
                    <span className="text-sm font-medium text-[#0F2F4E]">Total:</span>
                    <span className="text-lg font-bold text-[#0F2F4E]">
                      ${data.total_allowance?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

const ComparisonTab = ({ comparisonResults, scenarios, compareScenarios }) => (
  <Card>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-[#0F2F4E]">Scenario Comparison</h3>
      <SelectField
        label=""
        value=""
        onChange={(e) => {
          if (e.target.value) {
            compareScenarios([e.target.value, comparisonResults.scenarios[0]?.id])
          }
        }}
        options={[
          { value: '', label: 'Add Scenario to Compare' },
          ...scenarios.map(scenario => ({
            value: scenario.id,
            label: scenario.scenario_name
          }))
        ]}
        icon={Settings}
        className="w-64"
      />
    </div>
    
    <div className="overflow-x-auto rounded-xl border border-[#EEEEEE]">
      <table className="min-w-full divide-y divide-[#EEEEEE]">
        <thead className="bg-[#0F2F4E]/5">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
              Metric
            </th>
            {comparisonResults.scenarios.map(scenario => (
              <th key={scenario.id} className="px-6 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                {scenario.scenario_name}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-semibold text-[#1ED760] uppercase tracking-wider">
              Difference
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEEEEE] bg-white">
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">Total Assets</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                {scenario.total_assets}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="font-bold text-[#1ED760]">
                {comparisonResults.scenarios.length > 1 
                  ? Math.abs(comparisonResults.scenarios[1].total_assets - comparisonResults.scenarios[0].total_assets)
                  : 0}
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">Total Cost</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                ${scenario.total_cost?.toLocaleString()}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="font-bold text-[#1ED760]">
                ${comparisonResults.scenarios.length > 1 
                  ? Math.abs(comparisonResults.scenarios[1].total_cost - comparisonResults.scenarios[0].total_cost).toLocaleString()
                  : 0}
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">SIA Amount</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                ${scenario.sia_amount?.toLocaleString()}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="font-bold text-[#1ED760]">
                ${comparisonResults.scenarios.length > 1 
                  ? Math.abs(comparisonResults.scenarios[1].sia_amount - comparisonResults.scenarios[0].sia_amount).toLocaleString()
                  : 0}
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">W&T Amount</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                ${scenario.wt_amount?.toLocaleString()}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="font-bold text-[#1ED760]">
                ${comparisonResults.scenarios.length > 1 
                  ? Math.abs(comparisonResults.scenarios[1].wt_amount - comparisonResults.scenarios[0].wt_amount).toLocaleString()
                  : 0}
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">Total Allowances</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                ${scenario.capital_allowances?.toLocaleString()}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="font-bold text-[#1ED760]">
                ${comparisonResults.scenarios.length > 1 
                  ? Math.abs(comparisonResults.scenarios[1].capital_allowances - comparisonResults.scenarios[0].capital_allowances).toLocaleString()
                  : 0}
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">Tax Savings</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                ${scenario.tax_savings?.toLocaleString()}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="font-bold text-[#1ED760]">
                ${comparisonResults.scenarios.length > 1 
                  ? Math.abs(comparisonResults.scenarios[1].tax_savings - comparisonResults.scenarios[0].tax_savings).toLocaleString()
                  : 0}
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1ED760]/5">
            <td className="px-6 py-4 font-medium text-[#0F2F4E]">Effective Tax Rate</td>
            {comparisonResults.scenarios.map(scenario => (
              <td key={scenario.id} className="px-6 py-4">
                {(scenario.effective_tax_rate * 100).toFixed(2)}%
              </td>
            ))}
            <td className="px-6 py-4">
              <span className="px-3 py-1 bg-[#1ED760]/10 text-[#1ED760] rounded-full text-xs font-medium">
                {comparisonResults.scenarios.length > 1 
                  ? Math.abs((comparisonResults.scenarios[1].effective_tax_rate - comparisonResults.scenarios[0].effective_tax_rate) * 100).toFixed(2)
                  : 0}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
)

export default CapitalAllowanceEngine