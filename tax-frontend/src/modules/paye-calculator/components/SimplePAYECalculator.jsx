'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Import modular components
import PayrollHistory from './PayrollHistory';
import CompanyDataForm from './CompanyDataForm';
import PayrollPeriodManager from './PayrollPeriodManager';
import EmployeeInputForm from './EmployeeInputForm';
import PayslipGenerator from './PayslipGenerator';
import BatchProcessor from './BatchProcessor';
import SingleEmployeeResults from './SingleEmployeeResults';
import { PDFGenerator } from './PDFGenerator';

// Import sample data function (tutorial removed)
import { loadSampleDataForDemo } from '../constants/tutorialData';

/**
 * Simple PAYE Calculator - Modularized Version
 * Focuses on essential PAYE and NSSA calculations for SMEs
 * Supports both Gross Method and Net Method (grossing up)
 */

// Zimbabwe 2025/2026 PAYE Bands (Monthly USD)
const PAYE_BANDS = [
  { min: 0, max: 100, rate: 0.00, deduct: 0 },
  { min: 100.01, max: 300, rate: 0.20, deduct: 20 },
  { min: 300.01, max: 1000, rate: 0.25, deduct: 35 },
  { min: 1000.01, max: 2000, rate: 0.30, deduct: 85 },
  { min: 2000.01, max: 3000, rate: 0.35, deduct: 185 },
  { min: 3000.01, max: Infinity, rate: 0.40, deduct: 335 }
];

// NSSA Configuration - Updated to current Zimbabwe regulations
const NSSA_CONFIG = {
  employeeRate: 0.045, // 4.5% (employee contribution)
  employerRate: 0.045, // 4.5% (employer contribution)
  totalRate: 0.09, // 9% total (4.5% + 4.5%)
  monthlyCapUSD: 700, // $700 monthly maximum insurable earnings
  annualCapUSD: 8400 // $700 × 12 months
};

// Additional Zimbabwe Tax Configurations
const TAX_CONFIG = {
  aidsLevyRate: 0.03, // 3% AIDS Levy on PAYE
  zimdefRate: 0.01, // 1% ZIMDEF (employer contribution)
  bonusThreshold: 700, // $700 total tax-free bonus threshold
  maxAPWCRate: 0.0216 // 2.16% maximum APWC rate
};

const AIDS_LEVY_RATE = 0.03; // 3% - kept for backward compatibility

const SimplePAYECalculator = () => {
  const [calculationMethod, setCalculationMethod] = useState('gross'); // 'gross' or 'net'
  const [payrollMode, setPayrollMode] = useState('single'); // 'single' or 'batch'
  const [formData, setFormData] = useState({
    grossSalary: '',
    netSalary: '',
    employeeName: '',
    employeeNumber: '',
    department: '',
    position: '',
    // Allowances
    livingAllowance: '',
    medicalAllowance: '',
    transportAllowance: '',
    housingAllowance: '',
    commission: '',
    bonus: '',
    overtime: '',
    // Employer rates
    apwcRate: '1.0', // Default APWC rate (1.0%)
    // Bonus tracking
    cumulativeBonusYTD: '' // Year-to-date bonus for proper $700 threshold calculation
  });
  
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(0);
  const [results, setResults] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [showPayslip, setShowPayslip] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [isGeneratingPayslips, setIsGeneratingPayslips] = useState(false);
  const [payslipProgress, setPayslipProgress] = useState(0);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyLogo: null
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [showHistoryView, setShowHistoryView] = useState(false);
  // Tutorial functionality removed to prevent grey overlay issues

  // Tutorial functionality removed to prevent grey overlay issues

  // Load sample data function
  const loadSampleData = () => {
    const sampleData = loadSampleDataForDemo();
    setPayrollHistory(sampleData);
  };

  // Roll forward to next month functionality
  const rollForwardToNextMonth = () => {
    if (payrollMode === 'batch' && batchResults.length === 0) {
      alert('No payroll data to roll forward. Please calculate payroll first.');
      return;
    }

    // Save current month's payroll data to history before rolling forward
    const currentPayrollData = {
      month: currentMonth,
      year: currentYear,
      payrollMode,
      timestamp: new Date().toISOString(),
      data: payrollMode === 'batch' ? {
        employees: batchResults.length,
        totalGross: batchResults.reduce((sum, emp) => sum + (emp.calculation.grossSalary || 0), 0),
        totalNet: batchResults.reduce((sum, emp) => sum + (emp.calculation.netSalary || 0), 0),
        totalPAYE: batchResults.reduce((sum, emp) => sum + (emp.calculation.paye || 0), 0),
        totalNSSA: batchResults.reduce((sum, emp) => sum + (emp.calculation.nssaEmployee || 0), 0),
        totalEmployerCost: batchResults.reduce((sum, emp) => sum + (emp.calculation.totalCostToEmployer || 0), 0),
        employeeDetails: batchResults.map(emp => ({
          name: emp.employeeName,
          grossSalary: emp.calculation.grossSalary,
          netSalary: emp.calculation.netSalary,
          paye: emp.calculation.paye,
          nssa: emp.calculation.nssaEmployee
        }))
      } : results ? {
        employees: 1,
        totalGross: results.grossSalary || 0,
        totalNet: results.netSalary || 0,
        totalPAYE: results.paye || 0,
        totalNSSA: results.nssaEmployee || 0,
        totalEmployerCost: results.totalCostToEmployer || 0,
        employeeDetails: [{
          name: formData.employeeName || 'Single Employee',
          grossSalary: results.grossSalary,
          netSalary: results.netSalary,
          paye: results.paye,
          nssa: results.nssaEmployee
        }]
      } : null
    };

    // Only add to history if there's actual payroll data
    if (currentPayrollData.data) {
      setPayrollHistory(prev => [...prev, currentPayrollData]);
    }

    // Update month/year
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear = currentYear + 1;
      
      // Reset YTD bonuses for new year
      if (payrollMode === 'batch') {
        const updatedEmployees = employees.map(emp => ({
          ...emp,
          cumulativeBonusYTD: 0 // Reset for new year
        }));
        setEmployees(updatedEmployees);
      }
      setFormData(prev => ({ ...prev, cumulativeBonusYTD: '' }));
    } else {
      // Update YTD bonuses for continuing year
      if (payrollMode === 'batch' && batchResults.length > 0) {
        const updatedEmployees = employees.map(emp => {
          const empResult = batchResults.find(result => result.id === emp.id);
          return {
            ...emp,
            cumulativeBonusYTD: empResult ? empResult.calculation.newCumulativeBonusYTD : emp.cumulativeBonusYTD
          };
        });
        setEmployees(updatedEmployees);
      }
      
      // Update single employee YTD if results exist
      if (payrollMode === 'single' && results && results.newCumulativeBonusYTD) {
        setFormData(prev => ({ 
          ...prev, 
          cumulativeBonusYTD: results.newCumulativeBonusYTD.toString()
        }));
      }
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Clear current month's salary data but keep employee details and YTD
    if (payrollMode === 'single') {
      setFormData(prev => ({
        ...prev,
        grossSalary: '',
        netSalary: '',
        livingAllowance: '',
        medicalAllowance: '',
        transportAllowance: '',
        housingAllowance: '',
        commission: '',
        bonus: '',
        overtime: ''
      }));
      setResults(null);
    } else {
      // Clear batch results but keep employee list with updated YTD
      setBatchResults([]);
    }
    
    alert(`Rolled forward to ${getMonthName(newMonth)} ${newYear}. ${newYear > currentYear ? 'YTD bonuses reset for new year.' : 'YTD bonuses updated.'}`);
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  // Calculate PAYE using Non-FDS method (monthly basis)
  // Uses the deduction method: Tax = (Taxable Income × Rate) - Deduction
  const calculatePAYE = (taxableIncome) => {
    if (taxableIncome <= 0) return 0;
    
    // Find the applicable tax band
    for (const band of PAYE_BANDS) {
      if (taxableIncome >= band.min && (band.max === Infinity || taxableIncome <= band.max)) {
        const paye = (taxableIncome * band.rate) - band.deduct;
        return Math.max(0, paye);
      }
    }
    
    return 0;
  };

  // Calculate NSSA with proper capping (based on insurable earnings up to $700 monthly)
  const calculateNSSA = (grossSalary) => {
    // NSSA is calculated on insurable earnings up to the monthly cap of $700
    const insurableEarnings = Math.min(grossSalary, NSSA_CONFIG.monthlyCapUSD);
    
    // Calculate NSSA contributions (4.5% each for employee and employer)
    // Maximum contribution is $31.50 per month (4.5% of $700)
    const employeeContribution = Math.min(insurableEarnings * NSSA_CONFIG.employeeRate, 31.50);
    const employerContribution = Math.min(insurableEarnings * NSSA_CONFIG.employerRate, 31.50);
    
    return {
      employee: employeeContribution,
      employer: employerContribution,
      insurableEarnings: insurableEarnings
    };
  };

  // Calculate taxable bonus (first $700 cumulative in year is tax-free)
  const calculateTaxableBonus = (currentBonus, cumulativeBonusYTD = 0, employeeTopTaxRate = 0.40) => {
    const currentBonusAmount = parseFloat(currentBonus) || 0;
    const previousBonusYTD = parseFloat(cumulativeBonusYTD) || 0;
    const totalBonusYTD = previousBonusYTD + currentBonusAmount;
    
    // If total YTD bonus is still under $700, entire current bonus is tax-free
    if (totalBonusYTD <= TAX_CONFIG.bonusThreshold) {
      return {
        taxFreeBonus: currentBonusAmount,
        taxableBonus: 0,
        bonusTax: 0,
        newCumulativeYTD: totalBonusYTD
      };
    }
    
    // If previous YTD already exceeded $700, entire current bonus is taxable
    if (previousBonusYTD >= TAX_CONFIG.bonusThreshold) {
      const bonusTax = currentBonusAmount * employeeTopTaxRate;
      return {
        taxFreeBonus: 0,
        taxableBonus: currentBonusAmount,
        bonusTax: bonusTax,
        newCumulativeYTD: totalBonusYTD
      };
    }
    
    // Partial taxation: some portion is tax-free, remainder is taxable
    const remainingTaxFreeAmount = TAX_CONFIG.bonusThreshold - previousBonusYTD;
    const taxFreePortionThisMonth = Math.min(currentBonusAmount, remainingTaxFreeAmount);
    const taxablePortionThisMonth = currentBonusAmount - taxFreePortionThisMonth;
    const bonusTax = taxablePortionThisMonth * employeeTopTaxRate;
    
    return {
      taxFreeBonus: taxFreePortionThisMonth,
      taxableBonus: taxablePortionThisMonth,
      bonusTax: bonusTax,
      newCumulativeYTD: totalBonusYTD
    };
  };

  // Calculate total gross including allowances
  const calculateTotalGross = (basicSalary, allowances = {}) => {
    const {
      livingAllowance = 0,
      medicalAllowance = 0,
      transportAllowance = 0,
      housingAllowance = 0,
      commission = 0,
      bonus = 0,
      overtime = 0
    } = allowances;

    return parseFloat(basicSalary) + 
           parseFloat(livingAllowance || 0) + 
           parseFloat(medicalAllowance || 0) + 
           parseFloat(transportAllowance || 0) + 
           parseFloat(housingAllowance || 0) + 
           parseFloat(commission || 0) + 
           parseFloat(bonus || 0) + 
           parseFloat(overtime || 0);
  };

  // Enhanced gross method calculation with allowances breakdown
  const calculateFromGross = (basicSalary, allowances = {}, apwcRate = 1.0, cumulativeBonusYTD = 0) => {
    const totalGross = calculateTotalGross(basicSalary, allowances);
    
    // Calculate bonus tax with cumulative YTD tracking
    const bonusAmount = parseFloat(allowances.bonus || 0);
    const bonusCalc = calculateTaxableBonus(bonusAmount, cumulativeBonusYTD);
    
    // NSSA calculations
    const nssa = calculateNSSA(totalGross);
    
    // PAYE calculation on taxable income (excluding tax-free bonus portion)
    const taxableGrossForPAYE = totalGross - nssa.employee - bonusCalc.taxFreeBonus;
    const paye = calculatePAYE(taxableGrossForPAYE);
    
    // AIDS Levy (3% of PAYE)
    const aidsLevy = paye * TAX_CONFIG.aidsLevyRate;
    
    // Total employee tax (PAYE + AIDS Levy + Bonus Tax)
    const totalTax = paye + aidsLevy + bonusCalc.bonusTax;
    
    // Net salary calculation
    const netSalary = totalGross - nssa.employee - totalTax;
    
    // Employer contributions
    const zimdef = totalGross * TAX_CONFIG.zimdefRate; // 1% ZIMDEF
    const apwc = totalGross * (parseFloat(apwcRate) / 100); // APWC based on rate
    
    // Total employer cost
    const totalEmployerContributions = nssa.employer + zimdef + apwc;
    const totalCostToEmployer = totalGross + totalEmployerContributions;
    
    return {
      basicSalary: parseFloat(basicSalary),
      allowances: {
        living: parseFloat(allowances.livingAllowance || 0),
        medical: parseFloat(allowances.medicalAllowance || 0),
        transport: parseFloat(allowances.transportAllowance || 0),
        housing: parseFloat(allowances.housingAllowance || 0),
        commission: parseFloat(allowances.commission || 0),
        bonus: parseFloat(allowances.bonus || 0),
        overtime: parseFloat(allowances.overtime || 0)
      },
      totalAllowances: totalGross - parseFloat(basicSalary),
      grossSalary: totalGross,
      
      // Employee deductions
      nssaEmployee: nssa.employee,
      paye,
      aidsLevy,
      bonusCalc,
      totalTax,
      netSalary,
      
      // Employer contributions
      nssaEmployer: nssa.employer,
      zimdef,
      apwc,
      apwcRate: parseFloat(apwcRate),
      totalEmployerContributions,
      totalCostToEmployer,
      
      // Tax calculation details
      taxableGrossForPAYE,
      taxFreeBonus: bonusCalc.taxFreeBonus,
      taxableBonus: bonusCalc.taxableBonus,
      bonusTax: bonusCalc.bonusTax,
      newCumulativeBonusYTD: bonusCalc.newCumulativeYTD
    };
  };

  // Net Method: Start with desired net, gross up to find required gross
  const calculateFromNet = (targetNet, apwcRate = 1.0) => {
    let grossSalary = targetNet;
    let iterations = 0;
    const maxIterations = 50;
    
    // Iterative approach to find gross salary that gives target net
    while (iterations < maxIterations) {
      const result = calculateFromGross(grossSalary, {}, apwcRate);
      const netDifference = result.netSalary - targetNet;
      
      if (Math.abs(netDifference) < 0.01) {
        return result; // Close enough
      }
      
      // Adjust gross salary based on difference
      if (netDifference > 0) {
        grossSalary -= Math.abs(netDifference) * 0.5;
      } else {
        grossSalary += Math.abs(netDifference) * 1.5;
      }
      
      iterations++;
    }
    
    return calculateFromGross(grossSalary, {}, apwcRate);
  };

  // Add employee to batch processing
  const addEmployeeToBatch = () => {
    if (employees.length >= 20) {
      alert('Maximum 20 employees allowed in batch processing');
      return;
    }

    const basicSalary = parseFloat(formData.grossSalary);
    if (!basicSalary || basicSalary <= 0) {
      alert('Please enter a valid basic salary');
      return;
    }

    if (!formData.employeeName.trim()) {
      alert('Please enter employee name');
      return;
    }

    const allowances = {
      livingAllowance: formData.livingAllowance,
      medicalAllowance: formData.medicalAllowance,
      transportAllowance: formData.transportAllowance,
      housingAllowance: formData.housingAllowance,
      commission: formData.commission,
      bonus: formData.bonus,
      overtime: formData.overtime
    };

    const employeeData = {
      id: Date.now(),
      ...formData,
      basicSalary,
      allowances,
      apwcRate: parseFloat(formData.apwcRate),
      cumulativeBonusYTD: parseFloat(formData.cumulativeBonusYTD || 0),
      calculation: calculateFromGross(basicSalary, allowances, parseFloat(formData.apwcRate), parseFloat(formData.cumulativeBonusYTD || 0))
    };

    setEmployees(prev => [...prev, employeeData]);
    
    // Reset form for next employee (keep APWC rate)
    setFormData(prev => ({
      grossSalary: '',
      netSalary: '',
      employeeName: '',
      employeeNumber: '',
      department: '',
      position: '',
      livingAllowance: '',
      medicalAllowance: '',
      transportAllowance: '',
      housingAllowance: '',
      commission: '',
      bonus: '',
      overtime: '',
      apwcRate: prev.apwcRate, // Keep the same APWC rate for consistency
      cumulativeBonusYTD: '' // Reset for next employee
    }));
  };

  // Remove employee from batch
  const removeEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // Calculate batch payroll
  const calculateBatchPayroll = () => {
    if (employees.length === 0) {
      alert('Please add employees to the batch first');
      return;
    }

    const batchCalcs = employees.map(emp => ({
      ...emp,
      calculation: calculateFromGross(emp.basicSalary, emp.allowances, emp.apwcRate || 1.0, emp.cumulativeBonusYTD || 0)
    }));

    setBatchResults(batchCalcs);
  };

  const handleCalculate = () => {
    if (payrollMode === 'batch') {
      calculateBatchPayroll();
      return;
    }

    const inputValue = calculationMethod === 'gross' 
      ? parseFloat(formData.grossSalary) 
      : parseFloat(formData.netSalary);
    
    if (!inputValue || inputValue <= 0) {
      alert('Please enter a valid salary amount');
      return;
    }

    const allowances = {
      livingAllowance: formData.livingAllowance,
      medicalAllowance: formData.medicalAllowance,
      transportAllowance: formData.transportAllowance,
      housingAllowance: formData.housingAllowance,
      commission: formData.commission,
      bonus: formData.bonus,
      overtime: formData.overtime
    };

    const result = calculationMethod === 'gross' 
      ? calculateFromGross(inputValue, allowances, parseFloat(formData.apwcRate), parseFloat(formData.cumulativeBonusYTD || 0))
      : calculateFromNet(inputValue, parseFloat(formData.apwcRate));
    
    setResults(result);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    // Handle undefined, null, or non-numeric values
    const numAmount = parseFloat(amount) || 0;
    return `${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Initialize PDF Generator after formatCurrency is defined
  const pdfGenerator = new PDFGenerator(companyData, formatCurrency);

  // PDF Generation functions
  const generateBatchPayslips = () => {
    pdfGenerator.generateBatchPayslips(batchResults, setIsGeneratingPayslips, setPayslipProgress);
  };

  const generatePayrollReports = () => {
    pdfGenerator.generatePayrollReports(batchResults);
  };

  const generatePayslipPDF = async () => {
    try {
      await pdfGenerator.generatePayslipPDF(formData);
    } catch (error) {
      // Fallback to original PDF generation
      generateOriginalPayslipPDF();
    }
  };

  const generateOriginalPayslipPDF = () => {
    pdfGenerator.generateOriginalPayslipPDF(results, formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg relative">
          {/* Tutorial functionality removed */}
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E] mt-4 mb-4">
            Enhanced PAYE Calculator
          </h1>
          <p className="text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto mb-2">
            Comprehensive payroll system with allowances, batch processing, and detailed reports
          </p>
          <p className="text-[#0F2F4E]/60 max-w-2xl mx-auto">
            ✅ Realistic PAYE Computations | ✅ Allowances & Benefits | ✅ Batch Payroll (20 employees) | ✅ NSSA, PAYE & Summary Reports
          </p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Payroll Mode</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setPayrollMode('single')}
            className={`p-4 rounded-lg border-2 transition-all ${
              payrollMode === 'single'
                ? 'border-[#1ED760] bg-[#1ED760]/10'
                : 'border-gray-200 hover:border-[#1ED760]/50'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-[#0F2F4E]">Single Employee</h4>
              <p className="text-sm text-gray-600">
                Calculate for one employee with detailed breakdown
              </p>
            </div>
          </button>
          
          <button
            onClick={() => setPayrollMode('batch')}
            className={`p-4 rounded-lg border-2 transition-all ${
              payrollMode === 'batch'
                ? 'border-[#1ED760] bg-[#1ED760]/10'
                : 'border-gray-200 hover:border-[#1ED760]/50'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-[#0F2F4E]">Batch Payroll (Up to 20)</h4>
              <p className="text-sm text-gray-600">
                Process multiple employees with summary reports
              </p>
            </div>
          </button>
        </div>

        {payrollMode === 'batch' && (
          <div className="relative overflow-hidden rounded-xl">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
            
            {/* Content */}
            <div className="relative bg-white/90 backdrop-blur-sm border-2 border-indigo-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-indigo-800 mb-1">Batch Payroll Mode Active</h4>
                  <p className="text-sm text-indigo-700">
                    Add employees one by one, then calculate the entire payroll. Generate comprehensive NSSA, PAYE, and payroll summary reports.
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-indigo-600 font-medium">Up to 20 employees</div>
                  <div className="text-xs text-indigo-500">Professional reports included</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Company Data Section */}
      <CompanyDataForm 
        companyData={companyData}
        setCompanyData={setCompanyData}
      />

      {/* Payroll Period & Roll Forward Section */}
      <PayrollPeriodManager 
        currentMonth={currentMonth}
        currentYear={currentYear}
        payrollMode={payrollMode}
        employees={employees}
        batchResults={batchResults}
        results={results}
        rollForwardToNextMonth={rollForwardToNextMonth}
        getMonthName={getMonthName}
      />

      {/* Employee Input Form */}
      <EmployeeInputForm 
        payrollMode={payrollMode}
        calculationMethod={calculationMethod}
        setCalculationMethod={setCalculationMethod}
        formData={formData}
        handleInputChange={handleInputChange}
        employees={employees}
        addEmployeeToBatch={addEmployeeToBatch}
        handleCalculate={handleCalculate}
        removeEmployee={removeEmployee}
        setEmployees={setEmployees}
        calculateTotalGross={calculateTotalGross}
        formatCurrency={formatCurrency}
        TAX_CONFIG={TAX_CONFIG}
      />

      {/* Batch Results */}
      {payrollMode === 'batch' && (
        <BatchProcessor 
          batchResults={batchResults}
          calculateBatchPayroll={calculateBatchPayroll}
          employees={employees}
          generatePayrollReports={generatePayrollReports}
          generateBatchPayslips={generateBatchPayslips}
          isGeneratingPayslips={isGeneratingPayslips}
          payslipProgress={payslipProgress}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Single Employee Results */}
      {payrollMode === 'single' && results && (
        <>
          <SingleEmployeeResults 
            results={results}
            formatCurrency={formatCurrency}
          />

          {/* Payslip Generation */}
          <PayslipGenerator 
            results={results}
            formData={formData}
            companyData={companyData}
            showPayslip={showPayslip}
            setShowPayslip={setShowPayslip}
            generatePayslipPDF={generatePayslipPDF}
            generateOriginalPayslipPDF={generateOriginalPayslipPDF}
            formatCurrency={formatCurrency}
          />
        </>
      )}

      {/* Payroll History */}
      <PayrollHistory 
        payrollHistory={payrollHistory}
        showHistoryView={showHistoryView}
        setShowHistoryView={setShowHistoryView}
        setPayrollHistory={setPayrollHistory}
        loadSampleDataForDemo={loadSampleData}
        formatCurrency={formatCurrency}
        getMonthName={getMonthName}
      />

      {/* NSSA Information */}
      <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
          Zimbabwe Tax Rules & Contributions (2025/2026)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-[#0F2F4E] mb-2">Contribution Rates</h4>
            <div className="space-y-1 text-sm">
              <p>• Employee: <strong>4.5%</strong> of insurable earnings</p>
              <p>• Employer: <strong>4.5%</strong> of insurable earnings</p>
              <p>• Total: <strong>9%</strong> of insurable earnings</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-[#0F2F4E] mb-2">Contribution Limits</h4>
            <div className="space-y-1 text-sm">
              <p>• Max Insurable Earnings: <strong>USD 700</strong>/month</p>
              <p>• Max Employee Contribution: <strong>USD 31.50</strong>/month (4.5% of $700)</p>
              <p>• Max Employer Contribution: <strong>USD 31.50</strong>/month (4.5% of $700)</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> NSSA contributions are calculated on insurable earnings up to USD 700 per month. 
            For salaries above USD 700, NSSA is capped at USD 31.50 per month per person (employee and employer each).
          </p>
        </div>
      </div>

      {/* Tax Bands Reference */}
      <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
          PAYE Tax Bands 2025/2026 (Monthly USD) - Non-FDS Method
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0F2F4E]/5">
              <tr>
                <th className="p-3 text-left">Income Range (USD)</th>
                <th className="p-3 text-left">Tax Rate</th>
                <th className="p-3 text-left">Deduction</th>
                <th className="p-3 text-left">Net Equivalent</th>
              </tr>
            </thead>
            <tbody>
              {PAYE_BANDS.map((band, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-3">
                    ${band.min.toLocaleString()} - {band.max === Infinity ? '∞' : `${band.max.toLocaleString()}`}
                  </td>
                  <td className="p-3">{(band.rate * 100).toFixed(0)}%</td>
                  <td className="p-3">${band.deduct.toLocaleString()}</td>
                  <td className="p-3 text-gray-600">
                    {band.max !== Infinity ? 
                      `${((band.max * band.rate) - band.deduct).toFixed(2)}` : 
                      'Variable'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Non-FDS Method:</strong> Tax calculated monthly using the above bands directly. 
            No averaging or annual reconciliation. Suitable for employees joining mid-year or SMEs with high attrition.
          </p>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-gradient-to-br from-[#0F2F4E]/5 to-[#0F2F4E]/10 rounded-xl p-6 shadow-lg mt-6 border border-[#0F2F4E]/20">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
          🚀 Enhanced Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-2">✅ Realistic PAYE Computations</h4>
            <p className="text-sm text-gray-600">
              Accurate Non-FDS method with proper NSSA capping at $31.50
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-2">💰 Comprehensive Allowances</h4>
            <p className="text-sm text-gray-600">
              Living, Medical, Transport, Housing, Commission, Bonus & Overtime
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-2">👥 Batch Payroll Processing</h4>
            <p className="text-sm text-gray-600">
              Process up to 20 employees with comprehensive summary reports
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-2">📊 NSSA & PAYE Reports</h4>
            <p className="text-sm text-gray-600">
              Detailed PDF reports with employee breakdown and totals
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-2">📄 Enhanced Payslips</h4>
            <p className="text-sm text-gray-600">
              Professional payslips with allowances breakdown + Batch ZIP download
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-2">⚡ Real-time Calculations</h4>
            <p className="text-sm text-gray-600">
              Instant calculations with detailed breakdowns and employer costs
            </p>
          </div>
        </div>
        
        <div className="mt-6 rounded-xl relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-10 rounded-xl"></div>
          
          {/* Main content */}
          <div className="relative bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-6 shadow-lg">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Perfect for SMEs
                </h4>
                <p className="text-sm text-gray-600">Complete payroll solution for Zimbabwe businesses</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-emerald-700">This enhanced calculator provides all the functionality needed</span> for realistic payroll processing in Zimbabwe, 
                including proper tax calculations, allowances management, comprehensive reporting, and batch payslip downloads (ZIP format).
              </p>
              
              {/* Key benefits */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Realistic PAYE & NSSA calculations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Batch processing (20 employees)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-700">Professional reports & payslips</span>
                </div>
              </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Ready to use • No setup required</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span>Zimbabwe Tax Compliant</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial functionality removed to prevent grey overlay issues */}
    </div>
  );
};

export default SimplePAYECalculator;