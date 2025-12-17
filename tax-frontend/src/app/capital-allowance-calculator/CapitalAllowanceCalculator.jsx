'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, Download, Share2, FileUp, Plus, 
  BarChart3, TrendingUp, Building, Package, 
  Settings, RefreshCw, ChevronRight, AlertCircle,
  DollarSign, Percent, Calendar, Tag, Trash2,
  Car, Factory, Cpu, Home, Sofa, Hammer,
  Info, Banknote, Clock, FileText, Zap,
  TrendingDown, ChevronDown, ChevronUp, Users,
  Shield, Globe, Target, Sparkles
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
          <Info className="w-4 h-4 text-[#0F2F4E]/40 cursor-help hover:text-[#0F2F4E]/60 transition-colors" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#0F2F4E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
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
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-2 py-3 bg-white border border-[#E5E7EB] rounded-xl 
                   text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:outline-none focus:border-[#1ED760] 
                   focus:ring-3 focus:ring-[#1ED760]/20 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
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
          <Info className="w-4 h-4 text-[#0F2F4E]/40 cursor-help hover:text-[#0F2F4E]/60 transition-colors" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#0F2F4E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
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
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl 
                   text-[#0F2F4E] focus:outline-none focus:border-[#1ED760] 
                   focus:ring-3 focus:ring-[#1ED760]/20 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-[#0F2F4E]/60" />
      </div>
    </div>
  </div>
)

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-lg hover:shadow-xl transition-all duration-300 ${hover ? 'hover:border-[#1ED760]/30' : ''} p-6 ${className}`}>
    {children}
  </div>
)

// StatCard Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = '#1ED760', 
  trend,
  trendDirection = 'up',
  description,
  size = 'md',
  loading = false
}) => {
  const sizeClasses = {
    sm: {
      card: 'p-3',
      iconWrapper: 'p-2',
      icon: 'w-4 h-4',
      value: 'text-lg font-bold',
      title: 'text-xs font-medium',
      description: 'text-xs',
      trend: 'text-xs',
      trendIcon: 'w-3 h-3',
    },
    md: {
      card: 'p-4',
      iconWrapper: 'p-3',
      icon: 'w-5 h-5',
      value: 'text-xl font-bold',
      title: 'text-sm font-medium',
      description: 'text-xs',
      trend: 'text-sm',
      trendIcon: 'w-4 h-4',
    },
    lg: {
      card: 'p-6',
      iconWrapper: 'p-4',
      icon: 'w-6 h-6',
      value: 'text-2xl font-bold',
      title: 'text-base font-medium',
      description: 'text-sm',
      trend: 'text-base',
      trendIcon: 'w-5 h-5',
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 ${classes.card}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${classes.title} text-[#0F2F4E]/60 mb-2`}>{title}</p>
          {loading ? (
            <div className="h-8 bg-[#EEEEEE] rounded animate-pulse mb-2"></div>
          ) : (
            <p className={`${classes.value} text-[#0F2F4E] mb-1`}>{value}</p>
          )}
          {description && (
            <p className={`${classes.description} text-[#0F2F4E]/40`}>{description}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-3 ${classes.trend} ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trendDirection === 'up' ? <TrendingUp className={classes.trendIcon} /> : <TrendingDown className={classes.trendIcon} />}
              <span>{trendDirection === 'up' ? '+' : ''}{trend}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div 
            className={`${classes.iconWrapper} rounded-lg flex-shrink-0`}
            style={{ 
              backgroundColor: `${color}15`,
              color: color
            }}
          >
            <Icon className={classes.icon} />
          </div>
        )}
      </div>
    </div>
  )
}

// Badge Component
const Badge = ({ children, variant = 'default', icon: Icon }) => {
  const variants = {
    default: 'bg-[#0F2F4E]/10 text-[#0F2F4E]',
    success: 'bg-[#1ED760]/10 text-[#1ED760]',
    warning: 'bg-[#FFD700]/10 text-[#FFD700]',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  )
}

// Toggle Switch Component
const Toggle = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-[#0F2F4E]">{label}</span>
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1ED760] focus:ring-offset-2 ${
        enabled ? 'bg-[#1ED760]' : 'bg-[#E5E7EB]'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

// Generate unique IDs
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

// ZIMBABWE TAX COMPLIANCE - UPDATED FOR 2024/2025 (Finance No. 2 Act, 2024)
// ===========================================================================

// Effective Corporate Tax Rate with AIDS Levy (25% base + 3% levy = 25.75%)
const ZIM_EFFECTIVE_TAX_RATE = 0.2575 // 25.75%

// Capital Allowance Rules for Zimbabwe (2024/2025)
const ZIM_CAPITAL_ALLOWANCE_RULES = {
  MotorVehicles: { 
    wAndTRate: 0.20, 
    siaRate: 0.00,
    icon: Car,
    description: "Cars, trucks, commercial vehicles",
    color: "#3B82F6",
    minValue: 0,
    conditions: "No SIA for vehicles"
  },
  PlantMachinery: { 
    wAndTRate: 0.25, 
    siaRate: 0.50,
    icon: Factory,
    description: "Manufacturing & production equipment",
    color: "#10B981",
    minValue: 1000,
    siaExplanation: "50% SIA in Year 1, 25% over next 4 years"
  },
  ITEquipment: { 
    wAndTRate: 0.3333, 
    siaRate: 0.50,
    icon: Cpu,
    description: "Computers, software, servers",
    color: "#8B5CF6",
    minValue: 0,
    conditions: "Software included with hardware"
  },
  IndustrialBuildings: { 
    wAndTRate: 0.05, 
    siaRate: 0.50,
    icon: Building,
    description: "Factories, warehouses for manufacturing",
    color: "#F59E0B",
    minValue: 10000
  },
  CommercialBuildings: { 
    wAndTRate: 0.025, 
    siaRate: 0.00,
    icon: Building,
    description: "Office buildings, retail spaces",
    color: "#EF4444",
    minValue: 10000,
    conditions: "No SIA for commercial buildings"
  },
  FurnitureFittings: { 
    wAndTRate: 0.10, 
    siaRate: 0.00,
    icon: Sofa,
    description: "Office furniture, partitions, shelving",
    color: "#EC4899",
    minValue: 500
  },
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
  standard: ZIM_EFFECTIVE_TAX_RATE,
  specialMiningLease: 0.1545,
  sezAfter5Years: 0.1545,
  manufacturingExport: 0.1545,
  smallScale: 0.1545,
  agriculture: 0.103,
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
    businessType: 'standard',
    color: '#3B82F6'
  },
  {
    id: 'scenario-2',
    scenario_name: 'Growth Plan',
    description: '20% growth with new equipment',
    created_at: new Date().toISOString(),
    assets: [],
    businessType: 'standard',
    color: '#10B981'
  }
]

const CapitalAllowanceEngine = () => {
  // For scenarios
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS)

  // For activeScenario
  const [activeScenario, setActiveScenario] = useState(INITIAL_SCENARIOS[0]?.id || null)

  // For assets
  const [assets, setAssets] = useState([])

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

  // Results
  const [results, setResults] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('assets')
  const [isCreatingScenario, setIsCreatingScenario] = useState(false)
  const [newScenarioName, setNewScenarioName] = useState('')
  const [expandedYears, setExpandedYears] = useState({})

  // Current tax rate based on business type
  const currentTaxRate = ZIM_TAX_RATES[businessType] || ZIM_TAX_RATES.standard

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('taxcul-scenarios', JSON.stringify(scenarios))
    localStorage.setItem('taxcul-active-scenario', activeScenario)
    localStorage.setItem('taxcul-assets', JSON.stringify(assets))
  }, [scenarios, activeScenario, assets])

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

    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899']
    const newScenario = {
      id: `scenario-${generateId()}`,
      scenario_name: newScenarioName,
      description: `${newScenarioName} scenario for tax planning`,
      created_at: new Date().toISOString(),
      assets: [],
      businessType: 'standard',
      color: colors[scenarios.length % colors.length]
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

      if (!asset.sia_claimed) asset.sia_claimed = false
      if (!asset.remaining_sia_years) asset.remaining_sia_years = rules.siaRate > 0 ? 4 : 0

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

      if (yearsSinceAcquisition >= 0 && asset.current_rtv > 0) {
        const wAndT = Math.min(
          asset.current_rtv * rules.wAndTRate,
          asset.current_rtv
        )
        wAndTTotal += wAndT
        
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

      const activeScenarioAssets = assets.filter(asset => asset.scenario_id === activeScenario)
      const allowances = {}
      let totalCapitalAllowances = 0
      let totalTaxSavings = 0
      let totalSIAAmount = 0
      let totalWTAmount = 0

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

      const taxResults = {
        period_results: periods.reduce((acc, year) => {
          const revenue = 100000 + (year - periods[0]) * 20000
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
          const effectiveTaxRate = 0.25

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
    const activeScenarioAssets = assets.filter(asset => asset.scenario_id === activeScenario)
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

  const activeScenarioAssets = assets.filter(asset => asset.scenario_id === activeScenario)
  const totalAssetCost = activeScenarioAssets.reduce((sum, asset) => sum + (asset.acquisition_cost || 0), 0)
  const totalAllowances = results?.allowances?.total_capital_allowances || 0
  const totalTaxSavings = results?.allowances?.total_tax_savings || 0
  const totalSIA = results?.allowances?.total_sia || 0
  const totalWT = results?.allowances?.total_wt || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEEE] to-[#E5E7EB] py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="p-8 bg-gradient-to-r from-[#0F2F4E] to-[#1a3a5f] border-none">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      Capital Allowance Engine
                    </h1>
                    <p className="text-lg text-white/80 mt-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Zimbabwe Tax Planning with Scenario Analysis
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge variant="success" icon={Zap}>
                    Effective Tax Rate: {(currentTaxRate * 100).toFixed(2)}%
                  </Badge>
                  <Badge variant="info" icon={Globe}>
                    Finance (No. 2) Act, 2024
                  </Badge>
                  <Badge variant="warning" icon={Target}>
                    {activeScenarioAssets.length} Assets
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportToCSV}
                  className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold 
                           hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => compareScenarios(scenarios.slice(0, 2).map(s => s.id))}
                  className="px-5 py-2.5 bg-[#1ED760] text-white rounded-xl font-semibold 
                           hover:bg-[#1ED760]/90 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  Compare
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Panel */}
            <Card hover={true}>
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

                <SelectField
                  label="Business Type"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  options={[
                    { value: 'standard', label: `Standard Corporate (${(ZIM_TAX_RATES.standard * 100).toFixed(2)}%)` },
                    { value: 'specialMiningLease', label: `Special Mining Lease (${(ZIM_TAX_RATES.specialMiningLease * 100).toFixed(2)}%)` },
                    { value: 'sezAfter5Years', label: `SEZ (After 5 years) (${(ZIM_TAX_RATES.sezAfter5Years * 100).toFixed(2)}%)` },
                    { value: 'manufacturingExport', label: `Manufacturing Export (${(ZIM_TAX_RATES.manufacturingExport * 100).toFixed(2)}%)` },
                    { value: 'agriculture', label: `Agriculture (${(ZIM_TAX_RATES.agriculture * 100).toFixed(2)}%)` }
                  ]}
                  icon={Building}
                />

                <div className="space-y-2">
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
              
              <div className="flex items-center gap-3 mt-6">
                <motion.button
                  onClick={calculateTaxImpact}
                  disabled={loading || !activeScenario}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 
                             flex items-center justify-center gap-3 shadow-lg relative overflow-hidden
                             ${loading || !activeScenario
                               ? 'bg-[#E5E7EB] text-[#0F2F4E]/40 cursor-not-allowed' 
                               : 'bg-gradient-to-r from-[#1ED760] to-[#10B981] text-white hover:shadow-xl hover:shadow-[#1ED760]/25'
                             }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Run ZIM Tax Analysis
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="p-3 border border-[#E5E7EB] rounded-xl hover:bg-[#0F2F4E]/5 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-[#0F2F4E]/60" />
                </button>
              </div>
            </Card>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-[#E5E7EB]">
              {[
                { id: 'assets', label: 'Asset Register', icon: Package },
                { id: 'results', label: 'Results', icon: BarChart3 },
                { id: 'compare', label: 'Compare', icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap rounded-lg transition-all duration-300
                             ${activeTab === tab.id 
                               ? 'bg-white text-[#1ED760] shadow-md' 
                               : 'text-[#0F2F4E]/60 hover:text-[#0F2F4E] hover:bg-white/50'
                             }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
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
                    expandedYears={expandedYears}
                    setExpandedYears={setExpandedYears}
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
            <Card hover={true}>
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Scenario Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
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
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
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
            <Card hover={true}>
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Assets by Category
              </h3>
              <div className="space-y-3">
                {Object.keys(ZIM_CAPITAL_ALLOWANCE_RULES).map(category => {
                  const rules = ZIM_CAPITAL_ALLOWANCE_RULES[category]
                  const categoryAssets = activeScenarioAssets.filter(a => a.asset_category === category)
                  if (categoryAssets.length === 0) return null
                  
                  const cost = categoryAssets.reduce((sum, a) => sum + (a.acquisition_cost || 0), 0)
                  const percentage = (cost / totalAssetCost) * 100
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: rules.color }}
                          />
                          <span className="text-sm text-[#0F2F4E] font-medium">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#0F2F4E]">{categoryAssets.length}</div>
                          <div className="text-xs text-[#0F2F4E]/60">
                            ${cost.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: rules.color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* ZIM Tax Compliance Info */}
            <Card hover={true}>
              <h3 className="text-lg font-bold text-[#0F2F4E] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ZIM Compliance
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#0F2F4E]">Revenue Remittance</p>
                      <p className="text-xs text-[#0F2F4E]/60 mt-0.5">{ZIM_COMPLIANCE_INFO.revenueRemittance}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#0F2F4E]">Late Filing Penalty</p>
                      <p className="text-xs text-[#0F2F4E]/60 mt-0.5">{ZIM_COMPLIANCE_INFO.lateFilingPenalty}</p>
                    </div>
                  </div>
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
  isCreatingScenario,
  setIsCreatingScenario,
  newScenarioName,
  setNewScenarioName,
  createScenario
}) => (
  <Card hover={true}>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F2F4E]">Asset Register</h2>
        <p className="text-sm text-[#0F2F4E]/60 mt-1">
          Add capital assets for Zimbabwe tax planning
        </p>
      </div>
      <div className="flex gap-2">
        <label className="px-4 py-2 border border-[#1ED760] text-[#1ED760] rounded-lg 
                         hover:bg-[#1ED760]/10 transition-all duration-300 cursor-pointer
                         flex items-center gap-2 text-sm font-medium">
          <FileUp className="w-4 h-4" />
          Import CSV
          <input 
            type="file" 
            accept=".csv"
            onChange={handleCSVUpload} 
            className="hidden" 
          />
        </label>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreatingScenario(true)}
          className="px-4 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 
                   transition-all duration-300 flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </motion.button>
      </div>
    </div>

    {/* Scenario Creation */}
    {!activeScenario && (
      <Card className="mb-6 bg-gradient-to-br from-[#0F2F4E]/5 to-[#0F2F4E]/10 border-dashed">
        <div className="text-center py-8">
          <Building className="w-12 h-12 text-[#0F2F4E]/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-2">No Active Scenario</h3>
          <p className="text-[#0F2F4E]/60 mb-6 max-w-md mx-auto">
            Create a scenario to start adding assets and analyze tax implications
          </p>
          {isCreatingScenario ? (
            <div className="space-y-4 max-w-md mx-auto">
              <InputField
                label="Scenario Name"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="e.g., 2024 Tax Planning"
                icon={Tag}
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={createScenario}
                  className="flex-1 py-2.5 bg-[#1ED760] text-white rounded-lg font-medium 
                           hover:bg-[#1ED760]/90 transition-all duration-300"
                >
                  Create Scenario
                </motion.button>
                <button
                  onClick={() => setIsCreatingScenario(false)}
                  className="px-6 py-2.5 bg-white text-[#0F2F4E] rounded-lg font-medium 
                           hover:bg-[#0F2F4E]/5 transition-all duration-300 border border-[#E5E7EB]"
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
              className="px-6 py-3 bg-gradient-to-r from-[#1ED760] to-[#10B981] text-white rounded-lg font-medium 
                       hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              Create New Scenario
            </motion.button>
          )}
        </div>
      </Card>
    )}

    {/* Add Asset Form */}
    {activeScenario && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <InputField
            label="Asset Name"
            value={newAsset.asset_name}
            onChange={(e) => setNewAsset(prev => ({...prev, asset_name: e.target.value}))}
            placeholder="e.g., Delivery Van"
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
          />
          <InputField
            label="Cost (USD)"
            value={newAsset.acquisition_cost}
            onChange={(e) => setNewAsset(prev => ({...prev, acquisition_cost: e.target.value}))}
            placeholder="0.00"
            type="number"
            icon={DollarSign}
          />
          <div className="flex items-end">
            <motion.button
              onClick={addAsset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-[#1ED760] to-[#10B981] text-white rounded-lg hover:shadow-lg 
                       transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </motion.button>
          </div>
        </div>

        {/* Asset Table */}
        {assets.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB]">
                <thead className="bg-[#0F2F4E]/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                      Allowances
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] bg-white">
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
                        <td className="px-4 py-3">
                          <div className="text-[#0F2F4E] font-medium">{asset.asset_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="p-1.5 rounded-lg"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#0F2F4E]">
                          {new Date(asset.acquisition_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[#0F2F4E] font-bold">
                            ${asset.acquisition_cost?.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 bg-[#1ED760]/10 text-[#1ED760] rounded-full text-xs font-medium w-fit">
                              {asset.allowance_method}
                            </span>
                            <span className="text-xs text-[#0F2F4E]/60">
                              {rules.wAndTRate * 100}% W&T
                              {rules.siaRate > 0 && ` + ${rules.siaRate * 100}% SIA`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteAsset(asset.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete asset"
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
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-[#0F2F4E]/40 mx-auto mb-4" />
            <p className="text-[#0F2F4E]/60 mb-2">No assets added yet</p>
            <p className="text-sm text-[#0F2F4E]/40">Add assets to start tax planning</p>
          </div>
        )}
      </>
    )}
  </Card>
)

const ResultsTab = ({ results, periodSettings, totalAssetCost, businessType, expandedYears, setExpandedYears }) => {
  const years = Object.keys(results.allowances?.periods || {}).sort((a, b) => a - b)
  const taxTypeLabels = {
    standard: 'Standard Corporate',
    specialMiningLease: 'Special Mining Lease',
    sezAfter5Years: 'SEZ (After 5 years)',
    manufacturingExport: 'Manufacturing Export',
    agriculture: 'Agriculture'
  }

  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
      <Card hover={true}>
        <h3 className="text-lg font-bold text-[#0F2F4E] mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Allowance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-green-700 mb-1 font-medium">Special Initial Allowance</div>
              <div className="text-2xl font-bold text-green-600">
                ${results.allowances?.total_sia?.toLocaleString()}
              </div>
              <div className="text-xs text-green-600/60 mt-2">
                50% in Year 1, 25% over next 4 years
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-blue-700 mb-1 font-medium">Wear & Tear</div>
              <div className="text-2xl font-bold text-blue-600">
                ${results.allowances?.total_wt?.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600/60 mt-2">
                Annual depreciation based on category
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-emerald-700 mb-1 font-medium">Total Tax Impact</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${results.allowances?.total_tax_savings?.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600/60 mt-2">
                Based on {taxTypeLabels[businessType]} rate
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Year-by-Year Breakdown */}
      <Card hover={true}>
        <h3 className="text-lg font-bold text-[#0F2F4E] mb-6">Multi-Period Analysis ({periodSettings.startYear} - {periodSettings.endYear})</h3>
        <div className="space-y-3">
          {years.map(year => {
            const period = results.allowances.periods[year]
            const taxPeriod = results.taxResults?.period_results?.[year]
            const effectiveRate = taxPeriod?.effective_tax_rate || 0
            const isExpanded = expandedYears[year]
            
            return (
              <div key={year} className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full px-4 py-3 bg-white hover:bg-[#0F2F4E]/5 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#0F2F4E]">{year}</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="success">SIA: ${period.sia_amount?.toLocaleString()}</Badge>
                      <Badge variant="info">W&T: ${period.wt_amount?.toLocaleString()}</Badge>
                      <Badge variant="default">Total: ${period.capital_allowance?.toLocaleString()}</Badge>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#0F2F4E]/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#0F2F4E]/60" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-[#0F2F4E]/5 border-t border-[#E5E7EB]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-[#0F2F4E]/60 mb-1">Taxable Income</div>
                            <div className="font-medium text-[#0F2F4E]">
                              ${taxPeriod?.taxable_income?.toLocaleString() || '0'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#0F2F4E]/60 mb-1">Tax Payable</div>
                            <div className="font-medium text-[#0F2F4E]">
                              ${taxPeriod?.tax_payable?.toLocaleString() || '0'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#0F2F4E]/60 mb-1">Effective Tax Rate</div>
                            <Badge variant={effectiveRate < 0.2 ? 'success' : 'default'}>
                              {(effectiveRate * 100).toFixed(2)}%
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-[#0F2F4E]/60 mb-1">Tax Savings</div>
                            <div className="font-medium text-[#1ED760]">
                              ${period.tax_impact?.toLocaleString() || '0'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card hover={true}>
        <h3 className="text-lg font-bold text-[#0F2F4E] mb-6">Allowances by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(results.allowances?.summary_by_category || {}).map(([category, data]) => {
            const rules = ZIM_CAPITAL_ALLOWANCE_RULES[category]
            const Icon = rules?.icon || Package
            const color = rules?.color || '#1ED760'
            
            return (
              <div key={category} className="p-3 border border-[#E5E7EB] rounded-lg hover:border-[#1ED760]/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F2F4E]">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-[#0F2F4E]/60">
                      {data.asset_count} asset{data.asset_count !== 1 ? 's' : ''}
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
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#0F2F4E]">Total:</span>
                      <span className="text-base font-bold text-[#0F2F4E]">
                        ${data.total_allowance?.toLocaleString()}
                      </span>
                    </div>
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
  <Card hover={true}>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h3 className="text-xl font-bold text-[#0F2F4E]">Scenario Comparison</h3>
        <p className="text-sm text-[#0F2F4E]/60 mt-1">
          Compare different tax planning scenarios
        </p>
      </div>
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
        icon={Users}
        className="w-64"
      />
    </div>
    
    <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E7EB]">
          <thead className="bg-[#0F2F4E]/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                Metric
              </th>
              {comparisonResults.scenarios.map(scenario => (
                <th key={scenario.id} className="px-4 py-3 text-left text-xs font-semibold text-[#0F2F4E] uppercase tracking-wider">
                  {scenario.scenario_name}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#1ED760] uppercase tracking-wider">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] bg-white">
            <tr className="hover:bg-[#1ED760]/5">
              <td className="px-4 py-3 font-medium text-[#0F2F4E]">Total Assets</td>
              {comparisonResults.scenarios.map(scenario => (
                <td key={scenario.id} className="px-4 py-3">
                  {scenario.total_assets}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="font-bold text-[#1ED760]">
                  {comparisonResults.scenarios.length > 1 
                    ? Math.abs(comparisonResults.scenarios[1].total_assets - comparisonResults.scenarios[0].total_assets)
                    : 0}
                </div>
              </td>
            </tr>
            <tr className="hover:bg-[#1ED760]/5">
              <td className="px-4 py-3 font-medium text-[#0F2F4E]">Total Cost</td>
              {comparisonResults.scenarios.map(scenario => (
                <td key={scenario.id} className="px-4 py-3">
                  ${scenario.total_cost?.toLocaleString()}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="font-bold text-[#1ED760]">
                  ${comparisonResults.scenarios.length > 1 
                    ? Math.abs(comparisonResults.scenarios[1].total_cost - comparisonResults.scenarios[0].total_cost).toLocaleString()
                    : 0}
                </div>
              </td>
            </tr>
            <tr className="hover:bg-[#1ED760]/5">
              <td className="px-4 py-3 font-medium text-[#0F2F4E]">SIA Amount</td>
              {comparisonResults.scenarios.map(scenario => (
                <td key={scenario.id} className="px-4 py-3">
                  ${scenario.sia_amount?.toLocaleString()}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="font-bold text-[#1ED760]">
                  ${comparisonResults.scenarios.length > 1 
                    ? Math.abs(comparisonResults.scenarios[1].sia_amount - comparisonResults.scenarios[0].sia_amount).toLocaleString()
                    : 0}
                </div>
              </td>
            </tr>
            <tr className="hover:bg-[#1ED760]/5">
              <td className="px-4 py-3 font-medium text-[#0F2F4E]">W&T Amount</td>
              {comparisonResults.scenarios.map(scenario => (
                <td key={scenario.id} className="px-4 py-3">
                  ${scenario.wt_amount?.toLocaleString()}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="font-bold text-[#1ED760]">
                  ${comparisonResults.scenarios.length > 1 
                    ? Math.abs(comparisonResults.scenarios[1].wt_amount - comparisonResults.scenarios[0].wt_amount).toLocaleString()
                    : 0}
                </div>
              </td>
            </tr>
            <tr className="hover:bg-[#1ED760]/5">
              <td className="px-4 py-3 font-medium text-[#0F2F4E]">Tax Savings</td>
              {comparisonResults.scenarios.map(scenario => (
                <td key={scenario.id} className="px-4 py-3">
                  ${scenario.tax_savings?.toLocaleString()}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="font-bold text-[#1ED760]">
                  ${comparisonResults.scenarios.length > 1 
                    ? Math.abs(comparisonResults.scenarios[1].tax_savings - comparisonResults.scenarios[0].tax_savings).toLocaleString()
                    : 0}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Card>
)

export default CapitalAllowanceEngine