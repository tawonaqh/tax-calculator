'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Simple PAYE Calculator - Non-FDS Method
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Tutorial steps data
  const tutorialSteps = [
    {
      title: "Welcome to Enhanced PAYE Calculator",
      content: "This comprehensive payroll system helps you calculate PAYE, NSSA, and generate professional payslips for Zimbabwe businesses. Let's walk through the key features!",
      highlight: "header"
    },
    {
      title: "Choose Your Payroll Mode",
      content: "Select 'Single Employee' for individual calculations or 'Batch Payroll' to process up to 20 employees at once with comprehensive reports.",
      highlight: "mode-selection"
    },
    {
      title: "Company Information (Optional)",
      content: "Add your company details and logo to appear on all payslips and reports. This gives your documents a professional branded appearance.",
      highlight: "company-data"
    },
    {
      title: "Payroll Period Management",
      content: "Track your current processing month and use 'Roll Forward' to move to the next month while preserving YTD bonus tracking.",
      highlight: "payroll-period"
    },
    {
      title: "Employee Input & Allowances",
      content: "Enter employee details and comprehensive allowances including living, medical, transport, housing, commission, bonus, and overtime.",
      highlight: "employee-input"
    },
    {
      title: "Advanced Tax Features",
      content: "The system handles Zimbabwe's complex tax rules including NSSA capping at $31.50, bonus tax thresholds ($700 YTD), ZIMDEF, and APWC calculations.",
      highlight: "tax-features"
    },
    {
      title: "Professional Payslips & Reports",
      content: "Generate beautiful HTML payslips, classic PDFs, batch ZIP downloads, and comprehensive payroll summary reports with just one click.",
      highlight: "reports"
    },
    {
      title: "Month-to-Month Tracking",
      content: "View payroll history, trend analysis, and growth indicators to track your business's payroll evolution over time.",
      highlight: "history"
    }
  ];

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const loadSampleDataForDemo = () => {
    const sampleData = [
      {
        month: 10,
        year: 2024,
        payrollMode: 'batch',
        timestamp: '2024-10-31T10:00:00.000Z',
        data: {
          employees: 5,
          totalGross: 12500,
          totalNet: 9875,
          totalPAYE: 1850,
          totalNSSA: 775,
          totalEmployerCost: 13650,
          employeeDetails: [
            { name: 'John Doe', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'Jane Smith', grossSalary: 2000, netSalary: 1580, paye: 270, nssa: 150 },
            { name: 'Mike Johnson', grossSalary: 3000, netSalary: 2370, paye: 470, nssa: 160 },
            { name: 'Sarah Wilson', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'David Brown', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 }
          ]
        }
      },
      {
        month: 11,
        year: 2024,
        payrollMode: 'batch',
        timestamp: '2024-11-30T10:00:00.000Z',
        data: {
          employees: 6,
          totalGross: 15000,
          totalNet: 11850,
          totalPAYE: 2220,
          totalNSSA: 930,
          totalEmployerCost: 16380,
          employeeDetails: [
            { name: 'John Doe', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'Jane Smith', grossSalary: 2000, netSalary: 1580, paye: 270, nssa: 150 },
            { name: 'Mike Johnson', grossSalary: 3000, netSalary: 2370, paye: 470, nssa: 160 },
            { name: 'Sarah Wilson', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'David Brown', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'Lisa Garcia', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 }
          ]
        }
      },
      {
        month: 12,
        year: 2024,
        payrollMode: 'batch',
        timestamp: '2024-12-31T10:00:00.000Z',
        data: {
          employees: 7,
          totalGross: 17500,
          totalNet: 13825,
          totalPAYE: 2590,
          totalNSSA: 1085,
          totalEmployerCost: 19110,
          employeeDetails: [
            { name: 'John Doe', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'Jane Smith', grossSalary: 2000, netSalary: 1580, paye: 270, nssa: 150 },
            { name: 'Mike Johnson', grossSalary: 3000, netSalary: 2370, paye: 470, nssa: 160 },
            { name: 'Sarah Wilson', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'David Brown', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'Lisa Garcia', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 },
            { name: 'Tom Anderson', grossSalary: 2500, netSalary: 1975, paye: 370, nssa: 155 }
          ]
        }
      }
    ];
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

  // Generate batch payslips as ZIP file using beautiful HTML design
  const generateBatchPayslips = async () => {
    if (batchResults.length === 0) {
      alert('No payroll data available. Please calculate batch payroll first.');
      return;
    }

    setIsGeneratingPayslips(true);
    setPayslipProgress(0);

    try {
      // Import required libraries
      const [html2canvas, { jsPDF }, JSZip] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
        import('jszip')
      ]);

      const zip = new JSZip.default();
      const currentDate = new Date();
      const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Generate individual payslips for each employee using HTML design
      for (let i = 0; i < batchResults.length; i++) {
        const emp = batchResults[i];
        setPayslipProgress(Math.round((i / batchResults.length) * 100));
        
        // Create HTML payslip for this employee
        const payslipElement = generateEmployeePayslipHTML(emp, payPeriod);
        
        // Convert HTML to canvas then to PDF with improved centering
        const canvas = await html2canvas.default(payslipElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: Math.max(payslipElement.scrollWidth, 800), // Ensure minimum width
          height: payslipElement.scrollHeight + 60, // Add extra height for margins
          x: 0,
          y: 0,
          windowWidth: Math.max(payslipElement.scrollWidth, 800),
          windowHeight: payslipElement.scrollHeight + 60
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate dimensions to fit A4 with proper centering
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Use more conservative margins for better centering
        const marginX = 20; // 20mm margin on each side
        const marginY = 20; // 20mm margin top and bottom
        
        const availableWidth = pdfWidth - (marginX * 2);
        const availableHeight = pdfHeight - (marginY * 2);
        
        // Calculate scaled dimensions maintaining aspect ratio
        let imgWidth = availableWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // If height exceeds available space, scale by height instead
        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }
        
        // Center the image perfectly on the page
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;
        
        // Add image to PDF with perfect centering
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        
        // Generate PDF blob
        const pdfBlob = pdf.output('blob');
        
        // Add PDF to ZIP
        const fileName = `payslip-${emp.employeeName.replace(/[^a-zA-Z0-9]/g, '_')}-${emp.employeeNumber || 'NoID'}.pdf`;
        zip.file(fileName, pdfBlob);
        
        // Clean up temporary element
        document.body.removeChild(payslipElement);
      }

      // Generate and download ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `batch-payslips-${payPeriod.replace(' ', '-')}-${batchResults.length}-employees.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating batch payslips:', error);
      alert('Error generating batch payslips. Please try again.');
    } finally {
      setIsGeneratingPayslips(false);
      setPayslipProgress(0);
    }
  };

  // Generate HTML payslip for individual employee (for batch processing)
  const generateEmployeePayslipHTML = (emp, payPeriod) => {
    const payslipContent = `
      <div style="background: white; padding: 40px; width: 800px; margin: 0 auto; font-family: Arial, sans-serif; box-sizing: border-box; min-height: 600px; display: flex; flex-direction: column;">
        <!-- Header with Company Branding -->
        <div style="margin-bottom: 24px; border-bottom: 2px solid #0F2F4E; padding-bottom: 16px;">
          ${(companyData.companyName || companyData.companyLogo) ? `
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              ${companyData.companyLogo ? `
                <div style="width: 80px; height: 80px; flex-shrink: 0;">
                  <img src="${companyData.companyLogo}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
              ` : ''}
              <div style="flex: 1;">
                ${companyData.companyName ? `
                  <h3 style="font-size: 20px; font-weight: bold; color: #0F2F4E; margin: 0 0 8px 0;">${companyData.companyName}</h3>
                ` : ''}
                <div style="font-size: 14px; color: #666;">
                  ${companyData.companyAddress ? `<p style="margin: 0 0 4px 0;">${companyData.companyAddress}</p>` : ''}
                  <div style="display: flex; gap: 16px;">
                    ${companyData.companyPhone ? `<span>Tel: ${companyData.companyPhone}</span>` : ''}
                    ${companyData.companyEmail ? `<span>Email: ${companyData.companyEmail}</span>` : ''}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Payslip Title -->
          <div style="text-align: center;">
            <h2 style="font-size: 32px; font-weight: bold; color: #0F2F4E; margin: 0;">PAYSLIP</h2>
            <p style="font-size: 16px; color: #666; margin: 4px 0 0 0;">Pay Period: ${payPeriod}</p>
          </div>
        </div>

        <!-- Employee Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          <div>
            <p style="margin: 0 0 8px 0;"><strong>Employee Name:</strong> ${emp.employeeName || 'N/A'}</p>
            <p style="margin: 0 0 8px 0;"><strong>Employee Number:</strong> ${emp.employeeNumber || 'N/A'}</p>
          </div>
          <div>
            <p style="margin: 0 0 8px 0;"><strong>Department:</strong> ${emp.department || 'N/A'}</p>
            <p style="margin: 0 0 8px 0;"><strong>Position:</strong> ${emp.position || 'N/A'}</p>
          </div>
        </div>

        <!-- Salary Breakdown -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: 600; color: #0F2F4E; margin: 0 0 12px 0; border-bottom: 1px solid #ddd; padding-bottom: 4px;">
            EARNINGS & DEDUCTIONS
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;">
            <!-- Earnings -->
            <div>
              <h4 style="font-weight: 600; color: #666; margin: 0 0 8px 0;">EARNINGS</h4>
              <div style="font-size: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>Basic Salary:</span>
                  <span style="font-weight: 500;">${formatCurrency(emp.calculation.basicSalary)}</span>
                </div>
                
                ${emp.calculation.allowances.living > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Living Allow.:</span>
                    <span>${formatCurrency(emp.calculation.allowances.living)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.medical > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Medical Allow.:</span>
                    <span>${formatCurrency(emp.calculation.allowances.medical)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.transport > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Transport Allow.:</span>
                    <span>${formatCurrency(emp.calculation.allowances.transport)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.housing > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Housing Allow.:</span>
                    <span>${formatCurrency(emp.calculation.allowances.housing)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.commission > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Commission:</span>
                    <span>${formatCurrency(emp.calculation.allowances.commission)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.bonus > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Bonus:</span>
                    <span>${formatCurrency(emp.calculation.allowances.bonus)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.overtime > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #666;">
                    <span>Overtime:</span>
                    <span>${formatCurrency(emp.calculation.allowances.overtime)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.totalAllowances > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; border-top: 1px solid #eee; padding-top: 4px;">
                    <span>Total Allowances:</span>
                    <span>${formatCurrency(emp.calculation.totalAllowances)}</span>
                  </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #ddd; padding-top: 4px; margin-top: 8px;">
                  <span>Gross Salary:</span>
                  <span>${formatCurrency(emp.calculation.grossSalary)}</span>
                </div>
              </div>
            </div>
            
            <!-- Deductions -->
            <div>
              <h4 style="font-weight: 600; color: #666; margin: 0 0 8px 0;">DEDUCTIONS</h4>
              <div style="font-size: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>NSSA (4.5%):</span>
                  <span>(${formatCurrency(emp.calculation.nssaEmployee)})</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>PAYE:</span>
                  <span>(${formatCurrency(emp.calculation.paye)})</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>AIDS Levy (3%):</span>
                  <span>(${formatCurrency(emp.calculation.aidsLevy)})</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #ddd; padding-top: 4px; margin-top: 8px;">
                  <span>Total Deductions:</span>
                  <span>(${formatCurrency((emp.calculation.nssaEmployee || 0) + (emp.calculation.totalTax || 0))})</span>
                </div>
              </div>
            </div>
            
            <!-- Net Pay -->
            <div>
              <h4 style="font-weight: 600; color: #666; margin: 0 0 8px 0;">NET PAY</h4>
              <div style="background: rgba(30, 215, 96, 0.1); padding: 12px; border-radius: 8px; border: 1px solid #1ED760;">
                <div style="text-align: center;">
                  <p style="font-size: 14px; color: #666; margin: 0 0 4px 0;">Net Salary</p>
                  <p style="font-size: 20px; font-weight: bold; color: #1ED760; margin: 0;">
                    ${formatCurrency(emp.calculation.netSalary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p style="margin: 0 0 4px 0;">This payslip is computer generated and does not require a signature.</p>
          <p style="margin: 0;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = payslipContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);
    
    return tempDiv.firstElementChild;
  };
  const generatePayrollReports = () => {
    if (batchResults.length === 0) {
      alert('No payroll data available. Please calculate batch payroll first.');
      return;
    }

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 25;
      
      const currentDate = new Date();
      const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Calculate comprehensive totals
      const totals = batchResults.reduce((acc, emp) => {
        const calc = emp.calculation;
        return {
          totalBasicSalary: acc.totalBasicSalary + calc.basicSalary,
          totalAllowances: acc.totalAllowances + (calc.totalAllowances || 0),
          totalGross: acc.totalGross + calc.grossSalary,
          totalNSSAEmployee: acc.totalNSSAEmployee + calc.nssaEmployee,
          totalNSSAEmployer: acc.totalNSSAEmployer + calc.nssaEmployer,
          totalPAYE: acc.totalPAYE + calc.paye,
          totalAidsLevy: acc.totalAidsLevy + calc.aidsLevy,
          totalBonusTax: acc.totalBonusTax + (calc.bonusTax || 0),
          totalNet: acc.totalNet + calc.netSalary,
          totalEmployerCost: acc.totalEmployerCost + calc.totalCostToEmployer,
          totalZimdef: acc.totalZimdef + (calc.zimdef || 0),
          totalApwc: acc.totalApwc + (calc.apwc || 0)
        };
      }, {
        totalBasicSalary: 0, totalAllowances: 0, totalGross: 0,
        totalNSSAEmployee: 0, totalNSSAEmployer: 0, totalPAYE: 0,
        totalAidsLevy: 0, totalBonusTax: 0, totalNet: 0, totalEmployerCost: 0,
        totalZimdef: 0, totalApwc: 0
      });

      // Modern Header Design
      doc.setFillColor(15, 47, 78); // Primary Navy
      doc.rect(0, 0, pageWidth, 65, 'F');
      
      // Add accent line
      doc.setFillColor(30, 215, 96); // Success Green
      doc.rect(0, 60, pageWidth, 5, 'F');
      
      // Company Logo with proper aspect ratio
      if (companyData.companyLogo) {
        try {
          const tempImg = document.createElement('img');
          tempImg.src = companyData.companyLogo;
          
          if (tempImg.complete || tempImg.naturalWidth > 0) {
            const maxWidth = 35;
            const maxHeight = 18;
            
            const imgWidth = tempImg.naturalWidth || tempImg.width || 200;
            const imgHeight = tempImg.naturalHeight || tempImg.height || 100;
            const aspectRatio = imgWidth / imgHeight;
            
            let logoWidth, logoHeight;
            
            if (aspectRatio > maxWidth / maxHeight) {
              logoWidth = maxWidth;
              logoHeight = maxWidth / aspectRatio;
            } else {
              logoHeight = maxHeight;
              logoWidth = maxHeight * aspectRatio;
            }
            
            doc.addImage(companyData.companyLogo, 'JPEG', 15, 12, logoWidth, logoHeight);
          } else {
            doc.addImage(companyData.companyLogo, 'JPEG', 15, 12, 35, 18);
          }
        } catch (error) {
          console.log('Logo could not be added to PDF');
        }
      }
      
      // Company Information - Modern Layout
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      
      const companyStartX = companyData.companyLogo ? 55 : 20;
      
      if (companyData.companyName) {
        doc.text(companyData.companyName, companyStartX, 20);
      }
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      let companyInfoY = companyData.companyName ? 27 : 20;
      if (companyData.companyAddress) {
        doc.text(companyData.companyAddress, companyStartX, companyInfoY);
        companyInfoY += 4;
      }
      if (companyData.companyPhone || companyData.companyEmail) {
        const contactInfo = [
          companyData.companyPhone ? `Tel: ${companyData.companyPhone}` : '',
          companyData.companyEmail ? `Email: ${companyData.companyEmail}` : ''
        ].filter(Boolean).join(' | ');
        doc.text(contactInfo, companyStartX, companyInfoY);
      }
      
      // Report Title - Modern Design
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYROLL SUMMARY REPORT', pageWidth - 20, 25, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pay Period: ${payPeriod}`, pageWidth - 20, 35, { align: 'right' });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, 43, { align: 'right' });
      doc.text(`${batchResults.length} Employees`, pageWidth - 20, 51, { align: 'right' });
      
      yPosition = 80;
      
      // Executive Summary Cards
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE SUMMARY', 20, yPosition);
      yPosition += 12;
      
      // Summary Cards Layout (2x2 grid)
      const cardWidth = (pageWidth - 50) / 2;
      const cardHeight = 25;
      const cardSpacing = 5;
      
      // Card 1: Total Gross
      doc.setFillColor(240, 253, 244); // Light green
      doc.rect(20, yPosition, cardWidth, cardHeight, 'F');
      doc.setDrawColor(30, 215, 96);
      doc.setLineWidth(1);
      doc.rect(20, yPosition, cardWidth, cardHeight);
      
      doc.setTextColor(30, 215, 96);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL GROSS PAYROLL', 25, yPosition + 8);
      doc.setFontSize(14);
      doc.text(formatCurrency(totals.totalGross), 25, yPosition + 18);
      
      // Card 2: Total Net
      doc.setFillColor(239, 246, 255); // Light blue
      doc.rect(25 + cardWidth, yPosition, cardWidth, cardHeight, 'F');
      doc.setDrawColor(15, 47, 78);
      doc.rect(25 + cardWidth, yPosition, cardWidth, cardHeight);
      
      doc.setTextColor(15, 47, 78);
      doc.text('TOTAL NET PAYROLL', 30 + cardWidth, yPosition + 8);
      doc.text(formatCurrency(totals.totalNet), 30 + cardWidth, yPosition + 18);
      
      yPosition += cardHeight + cardSpacing;
      
      // Card 3: Total Tax
      doc.setFillColor(254, 242, 242); // Light red
      doc.rect(20, yPosition, cardWidth, cardHeight, 'F');
      doc.setDrawColor(239, 68, 68);
      doc.rect(20, yPosition, cardWidth, cardHeight);
      
      doc.setTextColor(239, 68, 68);
      doc.text('TOTAL TAX COLLECTED', 25, yPosition + 8);
      doc.text(formatCurrency(totals.totalPAYE + totals.totalAidsLevy + totals.totalBonusTax), 25, yPosition + 18);
      
      // Card 4: Employer Cost
      doc.setFillColor(255, 251, 235); // Light yellow
      doc.rect(25 + cardWidth, yPosition, cardWidth, cardHeight, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.rect(25 + cardWidth, yPosition, cardWidth, cardHeight);
      
      doc.setTextColor(245, 158, 11);
      doc.text('TOTAL EMPLOYER COST', 30 + cardWidth, yPosition + 8);
      doc.text(formatCurrency(totals.totalEmployerCost), 30 + cardWidth, yPosition + 18);
      
      yPosition += cardHeight + 15;
      
      // Detailed Breakdown Table
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DETAILED BREAKDOWN', 20, yPosition);
      yPosition += 10;
      
      // Create a professional table
      const tableData = [
        ['Description', 'Amount', 'Percentage'],
        ['Basic Salaries', formatCurrency(totals.totalBasicSalary), `${((totals.totalBasicSalary / totals.totalGross) * 100).toFixed(1)}%`],
        ['Total Allowances', formatCurrency(totals.totalAllowances), `${((totals.totalAllowances / totals.totalGross) * 100).toFixed(1)}%`],
        ['NSSA (Employee)', formatCurrency(totals.totalNSSAEmployee), `${((totals.totalNSSAEmployee / totals.totalGross) * 100).toFixed(1)}%`],
        ['PAYE Tax', formatCurrency(totals.totalPAYE), `${((totals.totalPAYE / totals.totalGross) * 100).toFixed(1)}%`],
        ['AIDS Levy', formatCurrency(totals.totalAidsLevy), `${((totals.totalAidsLevy / totals.totalGross) * 100).toFixed(1)}%`],
        ['Bonus Tax', formatCurrency(totals.totalBonusTax), `${((totals.totalBonusTax / totals.totalGross) * 100).toFixed(1)}%`]
      ];
      
      const colWidths = [80, 50, 30];
      let tableY = yPosition;
      
      // Table header
      doc.setFillColor(15, 47, 78);
      doc.rect(20, tableY, colWidths[0] + colWidths[1] + colWidths[2], 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      
      let xPos = 25;
      tableData[0].forEach((header, i) => {
        doc.text(header, xPos, tableY + 7);
        xPos += colWidths[i];
      });
      
      tableY += 10;
      
      // Table rows
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      for (let i = 1; i < tableData.length; i++) {
        // Alternate row colors
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(20, tableY, colWidths[0] + colWidths[1] + colWidths[2], 8, 'F');
        }
        
        xPos = 25;
        tableData[i].forEach((cell, j) => {
          doc.text(cell, xPos, tableY + 6);
          xPos += colWidths[j];
        });
        
        tableY += 8;
      }
      
      yPosition = tableY + 15;
      
      // Employee List Section
      if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = 25;
      }
      
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EMPLOYEE SUMMARY', 20, yPosition);
      yPosition += 12;
      
      // Employee table headers
      const empHeaders = ['Employee', 'Basic', 'Gross', 'NSSA', 'PAYE', 'Net'];
      const empColWidths = [45, 25, 25, 20, 20, 25];
      
      doc.setFillColor(15, 47, 78);
      doc.rect(20, yPosition, empColWidths.reduce((a, b) => a + b, 0), 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      
      xPos = 22;
      empHeaders.forEach((header, i) => {
        doc.text(header, xPos, yPosition + 6);
        xPos += empColWidths[i];
      });
      
      yPosition += 8;
      
      // Employee rows
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      batchResults.forEach((emp, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 25;
        }
        
        const calc = emp.calculation;
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(20, yPosition, empColWidths.reduce((a, b) => a + b, 0), 6, 'F');
        }
        
        xPos = 22;
        const empData = [
          emp.employeeName.substring(0, 20),
          formatCurrency(calc.basicSalary).substring(0, 12),
          formatCurrency(calc.grossSalary).substring(0, 12),
          formatCurrency(calc.nssaEmployee).substring(0, 10),
          formatCurrency(calc.paye).substring(0, 10),
          formatCurrency(calc.netSalary).substring(0, 12)
        ];
        
        empData.forEach((data, i) => {
          doc.text(data, xPos, yPosition + 4);
          xPos += empColWidths[i];
        });
        
        yPosition += 6;
      });
      
      // Footer
      yPosition = pageHeight - 20;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      doc.text('This report is computer generated and contains confidential payroll information.', pageWidth / 2, yPosition + 8, { align: 'center' });
      doc.text(`Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition + 13, { align: 'center' });
      
      // Save the report
      doc.save(`payroll-report-${payPeriod.replace(' ', '-')}-${batchResults.length}-employees.pdf`);
    }).catch(error => {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    });
  };

  const formatCurrency = (amount) => {
    // Handle undefined, null, or non-numeric values
    const numAmount = parseFloat(amount) || 0;
    return `$${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const generatePayslipPDF = () => {
    if (!results) return;
    
    // Use html2canvas + jsPDF for more reliable HTML-to-PDF conversion
    const element = document.getElementById('payslip-preview');
    if (!element) {
      alert('Payslip preview not found. Please show the payslip first.');
      return;
    }

    Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]).then(([html2canvas, { jsPDF }]) => {
      // Configure html2canvas options with better centering
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: Math.max(element.scrollWidth, 800), // Ensure minimum width
        height: element.scrollHeight + 60, // Add extra height for margins
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        windowWidth: Math.max(element.scrollWidth, 800),
        windowHeight: element.scrollHeight + 60
      };

      html2canvas.default(element, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate dimensions to fit A4 with proper centering
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Use more conservative margins for better centering
        const marginX = 20; // 20mm margin on each side
        const marginY = 20; // 20mm margin top and bottom
        
        const availableWidth = pdfWidth - (marginX * 2);
        const availableHeight = pdfHeight - (marginY * 2);
        
        // Calculate scaled dimensions maintaining aspect ratio
        let imgWidth = availableWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // If height exceeds available space, scale by height instead
        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }
        
        // Center the image perfectly on the page
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;
        
        // Add image to PDF with perfect centering
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        
        // Save the PDF
        const fileName = `payslip-${formData.employeeName || 'employee'}-${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).replace(' ', '-')}.pdf`;
        pdf.save(fileName);
      }).catch(error => {
        console.error('Error generating canvas:', error);
        // Fallback to original PDF generation
        generateOriginalPayslipPDF();
      });
    }).catch(error => {
      console.error('Error loading libraries:', error);
      // Fallback to original PDF generation
      generateOriginalPayslipPDF();
    });
  };

  // Keep the original PDF generation as fallback
  const generateOriginalPayslipPDF = () => {
    if (!results) return;
    
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 25;
      
      const currentDate = new Date();
      const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Modern Header Design with Gradient Effect
      doc.setFillColor(15, 47, 78); // Primary Navy
      doc.rect(0, 0, pageWidth, 70, 'F');
      
      // Add subtle accent line
      doc.setFillColor(30, 215, 96); // Success Green
      doc.rect(0, 65, pageWidth, 5, 'F');
      
      // Company Logo (if available) - with better positioning
      if (companyData.companyLogo) {
        try {
          const tempImg = document.createElement('img');
          tempImg.src = companyData.companyLogo;
          
          if (tempImg.complete || tempImg.naturalWidth > 0) {
            const maxWidth = 35;
            const maxHeight = 20;
            
            const imgWidth = tempImg.naturalWidth || tempImg.width || 200;
            const imgHeight = tempImg.naturalHeight || tempImg.height || 100;
            const aspectRatio = imgWidth / imgHeight;
            
            let logoWidth, logoHeight;
            
            if (aspectRatio > maxWidth / maxHeight) {
              logoWidth = maxWidth;
              logoHeight = maxWidth / aspectRatio;
            } else {
              logoHeight = maxHeight;
              logoWidth = maxHeight * aspectRatio;
            }
            
            doc.addImage(companyData.companyLogo, 'JPEG', 15, 15, logoWidth, logoHeight);
          } else {
            doc.addImage(companyData.companyLogo, 'JPEG', 15, 15, 35, 18);
          }
        } catch (error) {
          console.log('Logo could not be added to PDF');
        }
      }
      
      // Company Information - Modern Layout
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      
      const companyStartX = companyData.companyLogo ? 55 : 20;
      
      if (companyData.companyName) {
        doc.text(companyData.companyName, companyStartX, 25);
      }
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      let companyInfoY = companyData.companyName ? 32 : 25;
      if (companyData.companyAddress) {
        doc.text(companyData.companyAddress, companyStartX, companyInfoY);
        companyInfoY += 4;
      }
      if (companyData.companyPhone || companyData.companyEmail) {
        const contactInfo = [
          companyData.companyPhone ? `Tel: ${companyData.companyPhone}` : '',
          companyData.companyEmail ? `Email: ${companyData.companyEmail}` : ''
        ].filter(Boolean).join(' | ');
        doc.text(contactInfo, companyStartX, companyInfoY);
      }
      
      // PAYSLIP Title - Modern Design
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYSLIP', pageWidth - 20, 30, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pay Period: ${payPeriod}`, pageWidth - 20, 40, { align: 'right' });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, 48, { align: 'right' });
      
      yPosition = 85;
      
      // Employee Details Section - Card Style
      doc.setFillColor(248, 250, 252); // Light blue-gray background
      doc.rect(15, yPosition, pageWidth - 30, 25, 'F');
      
      doc.setDrawColor(226, 232, 240); // Light border
      doc.setLineWidth(0.5);
      doc.rect(15, yPosition, pageWidth - 30, 25);
      
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EMPLOYEE INFORMATION', 20, yPosition + 8);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      // Employee details in two columns
      doc.text(`Name: ${formData.employeeName || 'N/A'}`, 20, yPosition + 16);
      doc.text(`Employee ID: ${formData.employeeNumber || 'N/A'}`, 20, yPosition + 21);
      
      doc.text(`Department: ${formData.department || 'N/A'}`, pageWidth / 2 + 5, yPosition + 16);
      doc.text(`Position: ${formData.position || 'N/A'}`, pageWidth / 2 + 5, yPosition + 21);
      
      yPosition += 35;
      
      // Main Content Area - Fixed Column Layout with Clear Boundaries
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EARNINGS & DEDUCTIONS BREAKDOWN', 20, yPosition);
      yPosition += 12;
      
      // Use fixed column positions to prevent overlap
      const col1X = 20;      // Earnings column start
      const col1Width = 55;  // Earnings column width
      const col2X = 80;      // Deductions column start  
      const col2Width = 55;  // Deductions column width
      const col3X = 140;     // Net Pay column start
      const col3Width = 50;  // Net Pay column width
      const headerHeight = 12;
      
      // Column Headers with Background
      // Earnings Header
      doc.setFillColor(30, 215, 96); // Success Green
      doc.rect(col1X, yPosition, col1Width, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('EARNINGS', col1X + col1Width / 2, yPosition + 8, { align: 'center' });
      
      // Deductions Header
      doc.setFillColor(239, 68, 68); // Red
      doc.rect(col2X, yPosition, col2Width, headerHeight, 'F');
      doc.text('DEDUCTIONS', col2X + col2Width / 2, yPosition + 8, { align: 'center' });
      
      // Net Pay Header
      doc.setFillColor(15, 47, 78); // Navy
      doc.rect(col3X, yPosition, col3Width, headerHeight, 'F');
      doc.text('NET PAY', col3X + col3Width / 2, yPosition + 8, { align: 'center' });
      
      yPosition += headerHeight + 5;
      
      // Content Areas with strict boundaries
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      // Earnings Column Content
      let earningsY = yPosition;
      doc.text('Basic Salary:', col1X + 2, earningsY);
      doc.text(formatCurrency(results.basicSalary || results.grossSalary), col1X + col1Width - 2, earningsY, { align: 'right' });
      earningsY += 5;
      
      // Add allowances if they exist
      if (results.allowances) {
        if (results.allowances.living > 0) {
          doc.text('Living Allow.:', col1X + 2, earningsY);
          doc.text(formatCurrency(results.allowances.living), col1X + col1Width - 2, earningsY, { align: 'right' });
          earningsY += 4;
        }
        if (results.allowances.medical > 0) {
          doc.text('Medical Allow.:', col1X + 2, earningsY);
          doc.text(formatCurrency(results.allowances.medical), col1X + col1Width - 2, earningsY, { align: 'right' });
          earningsY += 4;
        }
        if (results.allowances.transport > 0) {
          doc.text('Transport Allow.:', col1X + 2, earningsY);
          doc.text(formatCurrency(results.allowances.transport), col1X + col1Width - 2, earningsY, { align: 'right' });
          earningsY += 4;
        }
        if (results.allowances.bonus > 0) {
          doc.text('Bonus:', col1X + 2, earningsY);
          doc.text(formatCurrency(results.allowances.bonus), col1X + col1Width - 2, earningsY, { align: 'right' });
          earningsY += 4;
        }
      }
      
      // Gross Total with line
      doc.setFont('helvetica', 'bold');
      doc.setDrawColor(30, 215, 96);
      doc.line(col1X + 2, earningsY + 2, col1X + col1Width - 2, earningsY + 2);
      earningsY += 6;
      doc.text('GROSS TOTAL:', col1X + 2, earningsY);
      doc.text(formatCurrency(results.grossSalary), col1X + col1Width - 2, earningsY, { align: 'right' });
      
      // Deductions Column Content
      let deductionsY = yPosition;
      doc.setFont('helvetica', 'normal');
      
      doc.text('NSSA (4.5%):', col2X + 2, deductionsY);
      doc.text(formatCurrency(results.nssaEmployee), col2X + col2Width - 2, deductionsY, { align: 'right' });
      deductionsY += 5;
      
      doc.text('PAYE Tax:', col2X + 2, deductionsY);
      doc.text(formatCurrency(results.paye), col2X + col2Width - 2, deductionsY, { align: 'right' });
      deductionsY += 5;
      
      doc.text('AIDS Levy (3%):', col2X + 2, deductionsY);
      doc.text(formatCurrency(results.aidsLevy), col2X + col2Width - 2, deductionsY, { align: 'right' });
      deductionsY += 5;
      
      if (results.bonusTax && results.bonusTax > 0) {
        doc.text('Bonus Tax:', col2X + 2, deductionsY);
        doc.text(formatCurrency(results.bonusTax), col2X + col2Width - 2, deductionsY, { align: 'right' });
        deductionsY += 5;
      }
      
      // Total Deductions with line
      doc.setFont('helvetica', 'bold');
      doc.setDrawColor(239, 68, 68);
      doc.line(col2X + 2, deductionsY + 2, col2X + col2Width - 2, deductionsY + 2);
      deductionsY += 6;
      doc.text('TOTAL DEDUCTIONS:', col2X + 2, deductionsY);
      doc.text(formatCurrency((results.nssaEmployee || 0) + (results.totalTax || 0)), col2X + col2Width - 2, deductionsY, { align: 'right' });
      
      // Net Pay Column - Highlighted Box
      const netPayBoxY = yPosition;
      const netPayBoxHeight = 35;
      
      doc.setFillColor(240, 253, 244); // Light green background
      doc.rect(col3X, netPayBoxY, col3Width, netPayBoxHeight, 'F');
      
      doc.setDrawColor(30, 215, 96);
      doc.setLineWidth(2);
      doc.rect(col3X, netPayBoxY, col3Width, netPayBoxHeight);
      
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('NET SALARY', col3X + col3Width / 2, netPayBoxY + 12, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(30, 215, 96);
      doc.text(formatCurrency(results.netSalary), col3X + col3Width / 2, netPayBoxY + 25, { align: 'center' });
      
      yPosition = Math.max(earningsY, deductionsY, netPayBoxY + netPayBoxHeight) + 15;
      
      // Tax Calculation Summary - Modern Card Design
      doc.setFillColor(248, 250, 252);
      doc.rect(20, yPosition, pageWidth - 40, 30, 'F');
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.rect(20, yPosition, pageWidth - 40, 30);
      
      doc.setTextColor(15, 47, 78);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('TAX CALCULATION SUMMARY (Non-FDS Method)', 25, yPosition + 8);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      // Tax calculation details in two columns
      doc.text(`Taxable Income: ${formatCurrency(results.taxableGrossForPAYE || results.taxableGross || 0)}`, 25, yPosition + 16);
      doc.text(`Total Tax Paid: ${formatCurrency(results.totalTax)}`, 25, yPosition + 22);
      
      doc.text(`Employer NSSA: ${formatCurrency(results.nssaEmployer)}`, pageWidth / 2 + 5, yPosition + 16);
      doc.text(`Total Employer Cost: ${formatCurrency(results.totalCostToEmployer)}`, pageWidth / 2 + 5, yPosition + 22);
      
      yPosition += 40;
      
      // Footer with Professional Styling
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      doc.text('This payslip is computer generated and does not require a signature.', pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition + 5, { align: 'center' });
      
      // Save PDF
      const fileName = `payslip-${formData.employeeName || 'employee'}-${payPeriod.replace(' ', '-')}.pdf`;
      doc.save(fileName);
    }).catch(error => {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    });
  };

  const generatePayslip = () => {
    if (!results) return;
    
    const currentDate = new Date();
    const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-300 w-full max-w-4xl mx-auto print:max-w-full print:border-0 print:rounded-none print:shadow-none print:p-6" id="payslip-preview" style={{minWidth: '800px', margin: '0 auto'}}>
        {/* Header with Company Branding */}
        <div className="mb-6 border-b-2 border-[#0F2F4E] pb-4 print:border-b print:pb-4">
          {/* Company Information */}
          {(companyData.companyName || companyData.companyLogo) && (
            <div className="flex items-center gap-4 mb-4 print:mb-4">
              {companyData.companyLogo && (
                <div className="w-16 h-16 flex-shrink-0 print:w-20 print:h-20">
                  <img 
                    src={companyData.companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain print:object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                {companyData.companyName && (
                  <h3 className="text-lg font-bold text-[#0F2F4E] print:text-xl print:font-bold">{companyData.companyName}</h3>
                )}
                <div className="text-sm text-gray-600 print:text-sm print:text-gray-800">
                  {companyData.companyAddress && <p className="print:mb-1">{companyData.companyAddress}</p>}
                  <div className="flex gap-4 print:flex print:gap-4">
                    {companyData.companyPhone && <span>Tel: {companyData.companyPhone}</span>}
                    {companyData.companyEmail && <span>Email: {companyData.companyEmail}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Payslip Title */}
          <div className="text-center print:text-center">
            <h2 className="text-2xl font-bold text-[#0F2F4E] print:text-3xl print:font-bold">PAYSLIP</h2>
            <p className="text-sm text-gray-600 print:text-base print:text-gray-800">Pay Period: {payPeriod}</p>
          </div>
        </div>
        
        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 print:grid-cols-2 print:gap-6 print:mb-6">
          <div className="print:text-sm">
            <p className="print:mb-2"><strong>Employee Name:</strong> {formData.employeeName || 'N/A'}</p>
            <p className="print:mb-2"><strong>Employee Number:</strong> {formData.employeeNumber || 'N/A'}</p>
          </div>
          <div className="print:text-sm">
            <p className="print:mb-2"><strong>Department:</strong> {formData.department || 'N/A'}</p>
            <p className="print:mb-2"><strong>Position:</strong> {formData.position || 'N/A'}</p>
          </div>
        </div>
        
        {/* Salary Breakdown */}
        <div className="mb-8 print:mb-8">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3 border-b border-gray-200 pb-1 print:text-xl print:font-semibold print:mb-4 print:border-b print:border-gray-400 print:pb-2">
            EARNINGS & DEDUCTIONS
          </h3>
          
          <div className="grid grid-cols-3 gap-4 print:grid-cols-3 print:gap-6">
            {/* Earnings */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">EARNINGS</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span>{formatCurrency(results.basicSalary)}</span>
                </div>
                
                {results.allowances && results.allowances.living > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Living Allow.:</span>
                    <span>{formatCurrency(results.allowances.living)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.medical > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Medical Allow.:</span>
                    <span>{formatCurrency(results.allowances.medical)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.transport > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Transport Allow.:</span>
                    <span>{formatCurrency(results.allowances.transport)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.housing > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Housing Allow.:</span>
                    <span>{formatCurrency(results.allowances.housing)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.commission > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Commission:</span>
                    <span>{formatCurrency(results.allowances.commission)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.bonus > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Bonus:</span>
                    <span>{formatCurrency(results.allowances.bonus)}</span>
                  </div>
                )}
                
                {results.allowances && results.allowances.overtime > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Overtime:</span>
                    <span>{formatCurrency(results.allowances.overtime)}</span>
                  </div>
                )}
                
                {results.totalAllowances && results.totalAllowances > 0 && (
                  <div className="flex justify-between text-xs border-t pt-1">
                    <span>Total Allowances:</span>
                    <span>{formatCurrency(results.totalAllowances)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Gross Salary:</span>
                  <span>{formatCurrency(results.grossSalary)}</span>
                </div>
              </div>
            </div>
            
            {/* Deductions */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">DEDUCTIONS</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>NSSA (4.5%):</span>
                  <span>({formatCurrency(results.nssaEmployee)})</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYE:</span>
                  <span>({formatCurrency(results.paye)})</span>
                </div>
                <div className="flex justify-between">
                  <span>AIDS Levy (3%):</span>
                  <span>({formatCurrency(results.aidsLevy)})</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total Deductions:</span>
                  <span>({formatCurrency((results.nssaEmployee || 0) + (results.totalTax || 0))})</span>
                </div>
              </div>
            </div>
            
            {/* Net Pay */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">NET PAY</h4>
              <div className="bg-[#1ED760]/10 p-3 rounded border border-[#1ED760]">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-lg font-bold text-[#1ED760]">
                    {formatCurrency(results.netSalary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tax Calculation Details */}
        <div className="mb-6 bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700 mb-2">TAX CALCULATION (Non-FDS Method)</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>Gross Salary: {formatCurrency(results.grossSalary)}</p>
              <p>Less: NSSA: ({formatCurrency(results.nssaEmployee)})</p>
              <p className="font-medium">Taxable Income: {formatCurrency(results.taxableGrossForPAYE || results.taxableGross || 0)}</p>
            </div>
            <div>
              <p>PAYE: {formatCurrency(results.paye)}</p>
              <p>AIDS Levy (3%): {formatCurrency(results.aidsLevy)}</p>
              <p className="font-medium">Total Tax: {formatCurrency(results.totalTax)}</p>
            </div>
          </div>
        </div>
        
        {/* Employer Costs */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">EMPLOYER COSTS</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>Employee Salary: {formatCurrency(results.grossSalary)}</p>
              <p>Employer NSSA (4.5%): {formatCurrency(results.nssaEmployer)}</p>
            </div>
            <div>
              <p className="font-bold text-[#0F2F4E]">
                Total Cost to Employer: {formatCurrency(results.totalCostToEmployer)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t text-xs text-gray-500">
          <p>This payslip is computer generated and does not require a signature.</p>
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg relative">
          {/* Tutorial Button */}
          <button
            onClick={startTutorial}
            className="absolute top-6 right-6 px-4 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tutorial
          </button>
          
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
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Company Information (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyData.companyName}
              onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Your Company Name"
              className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
              Company Email
            </label>
            <input
              type="email"
              value={companyData.companyEmail}
              onChange={(e) => setCompanyData(prev => ({ ...prev, companyEmail: e.target.value }))}
              placeholder="company@example.com"
              className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
              Company Address
            </label>
            <input
              type="text"
              value={companyData.companyAddress}
              onChange={(e) => setCompanyData(prev => ({ ...prev, companyAddress: e.target.value }))}
              placeholder="Company Address"
              className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
              Company Phone
            </label>
            <input
              type="text"
              value={companyData.companyPhone}
              onChange={(e) => setCompanyData(prev => ({ ...prev, companyPhone: e.target.value }))}
              placeholder="+263 xxx xxx xxx"
              className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
            />
          </div>
          
          {/* Company Logo Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setCompanyData(prev => ({ 
                          ...prev, 
                          companyLogo: event.target.result,
                          logoFileName: file.name
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1ED760] file:text-white hover:file:bg-[#1ED760]/90"
                />
              </div>
              
              {companyData.companyLogo && (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img 
                      src={companyData.companyLogo} 
                      alt="Company Logo Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setCompanyData(prev => ({ ...prev, companyLogo: null, logoFileName: null }))}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload your company logo (PNG, JPG, GIF). Recommended size: 200x100px or similar aspect ratio.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Company Branding:</strong> This information will appear on all payslips and reports generated by the system.
          </p>
        </div>
      </div>

      {/* Payroll Period & Roll Forward Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#0F2F4E]">Payroll Period</h3>
            <p className="text-sm text-gray-600">Current processing month</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#0F2F4E]">
              {getMonthName(currentMonth)} {currentYear}
            </div>
            <div className="text-sm text-gray-500">
              Pay Period: Month {currentMonth}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#0F2F4E] mb-3">Current Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Processing Month:</span>
                <span className="font-medium">{getMonthName(currentMonth)} {currentYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Payroll Mode:</span>
                <span className="font-medium capitalize">{payrollMode}</span>
              </div>
              {payrollMode === 'batch' && (
                <div className="flex justify-between">
                  <span>Employees Added:</span>
                  <span className="font-medium">{employees.length}/20</span>
                </div>
              )}
              {payrollMode === 'batch' && batchResults.length > 0 && (
                <div className="flex justify-between">
                  <span>Payroll Calculated:</span>
                  <span className="font-medium text-green-600">✓ Yes</span>
                </div>
              )}
              {payrollMode === 'single' && results && (
                <div className="flex justify-between">
                  <span>Calculation Done:</span>
                  <span className="font-medium text-green-600">✓ Yes</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Roll Forward Action */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-[#0F2F4E] mb-3">Roll Forward to Next Month</h4>
            <p className="text-sm text-gray-600 mb-4">
              Move to the next payroll period. This will:
            </p>
            <ul className="text-xs text-gray-600 space-y-1 mb-4">
              <li>• Update YTD bonus amounts</li>
              <li>• Clear current month salary data</li>
              <li>• Preserve employee information</li>
              <li>• Reset YTD if rolling to new year</li>
              <li>• Save current payroll to history</li>
            </ul>
            
            <button
              onClick={rollForwardToNextMonth}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Roll Forward to {getMonthName(currentMonth === 12 ? 1 : currentMonth + 1)} {currentMonth === 12 ? currentYear + 1 : currentYear}
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Payroll Continuity:</strong> Use "Roll Forward" after completing each month's payroll to maintain accurate YTD bonus tracking and seamless month-to-month processing.
          </p>
        </div>
      </div>

      {/* Month-to-Month Payroll History Visualization */}
      {payrollHistory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#0F2F4E]">Payroll History & Trends</h3>
              <p className="text-sm text-gray-600">Month-to-month payroll visualization</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHistoryView(!showHistoryView)}
                className="px-4 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showHistoryView ? 'Hide History' : 'View History'}
              </button>
              <button
                onClick={() => setPayrollHistory([])}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                Clear History
              </button>
              <button
                onClick={loadSampleDataForDemo}
                className="px-4 py-2 bg-[#FFD700] text-[#0F2F4E] rounded-lg hover:bg-[#FFD700]/90 transition text-sm font-medium"
              >
                Load Sample Data
              </button>
            </div>
          </div>

          {/* History Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Total Months</h4>
              <p className="text-2xl font-bold">{payrollHistory.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Avg Monthly Gross</h4>
              <p className="text-xl font-bold">
                {formatCurrency(payrollHistory.reduce((sum, month) => sum + (month.data?.totalGross || 0), 0) / payrollHistory.length)}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
              <h4 className="text-sm opacity-90">Avg Monthly Net</h4>
              <p className="text-xl font-bold">
                {formatCurrency(payrollHistory.reduce((sum, month) => sum + (month.data?.totalNet || 0), 0) / payrollHistory.length)}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F2F4E]/80 to-[#0F2F4E]/60 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Avg Employees</h4>
              <p className="text-2xl font-bold">
                {Math.round(payrollHistory.reduce((sum, month) => sum + (month.data?.employees || 0), 0) / payrollHistory.length)}
              </p>
            </div>
          </div>

          {showHistoryView && (
            <div className="space-y-6">
              {/* Monthly Trend Chart (Simple Bar Chart) */}
              <div className="bg-gray-50 p-4 rounded-lg border border-[#0F2F4E]/10">
                <h4 className="font-medium text-[#0F2F4E] mb-4">Monthly Payroll Trends</h4>
                <div className="space-y-3">
                  {payrollHistory.map((monthData, index) => {
                    const maxValue = Math.max(...payrollHistory.map(m => m.data?.totalGross || 0));
                    const barWidth = ((monthData.data?.totalGross || 0) / maxValue) * 100;
                    
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-[#0F2F4E]">
                          {getMonthName(monthData.month)} {monthData.year}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div 
                            className="bg-gradient-to-r from-[#1ED760] to-[#1ED760]/80 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(barWidth, 5)}%` }}
                          >
                            <span className="text-white text-xs font-medium">
                              {formatCurrency(monthData.data?.totalGross || 0)}
                            </span>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-[#0F2F4E]/70">
                          {monthData.data?.employees || 0} emp
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0F2F4E]/5 border-b border-[#0F2F4E]/10">
                    <tr>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Period</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Mode</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Employees</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Total Gross</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Total Net</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Total PAYE</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Employer Cost</th>
                      <th className="p-3 text-left font-medium text-[#0F2F4E]">Date Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollHistory.map((monthData, index) => (
                      <tr key={index} className="border-t border-gray-200 hover:bg-[#0F2F4E]/5 transition-colors">
                        <td className="p-3 font-medium text-[#0F2F4E]">
                          {getMonthName(monthData.month)} {monthData.year}
                        </td>
                        <td className="p-3 capitalize text-[#0F2F4E]/80">{monthData.payrollMode}</td>
                        <td className="p-3 text-[#0F2F4E]/80">{monthData.data?.employees || 0}</td>
                        <td className="p-3 font-medium text-[#0F2F4E]">{formatCurrency(monthData.data?.totalGross || 0)}</td>
                        <td className="p-3 font-medium text-[#1ED760]">{formatCurrency(monthData.data?.totalNet || 0)}</td>
                        <td className="p-3 font-medium text-[#FFD700]">{formatCurrency(monthData.data?.totalPAYE || 0)}</td>
                        <td className="p-3 font-medium text-[#0F2F4E]">{formatCurrency(monthData.data?.totalEmployerCost || 0)}</td>
                        <td className="p-3 text-[#0F2F4E]/60 text-xs">
                          {new Date(monthData.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Trend Analysis */}
              <div className="bg-gradient-to-br from-[#0F2F4E]/5 to-[#0F2F4E]/10 p-4 rounded-lg border border-[#0F2F4E]/20">
                <h4 className="font-medium text-[#0F2F4E] mb-3">Trend Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-[#0F2F4E] mb-2">Growth Trends</h5>
                    {payrollHistory.length >= 2 && (
                      <div className="space-y-1">
                        {(() => {
                          const latest = payrollHistory[payrollHistory.length - 1];
                          const previous = payrollHistory[payrollHistory.length - 2];
                          const grossChange = ((latest.data?.totalGross || 0) - (previous.data?.totalGross || 0)) / (previous.data?.totalGross || 1) * 100;
                          const empChange = (latest.data?.employees || 0) - (previous.data?.employees || 0);
                          
                          return (
                            <>
                              <p className={`flex items-center gap-1 ${grossChange >= 0 ? 'text-[#1ED760]' : 'text-red-600'}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={grossChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                                </svg>
                                Gross: {grossChange >= 0 ? '+' : ''}{grossChange.toFixed(1)}%
                              </p>
                              <p className={`flex items-center gap-1 ${empChange >= 0 ? 'text-[#1ED760]' : 'text-red-600'}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Employees: {empChange >= 0 ? '+' : ''}{empChange}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-[#0F2F4E] mb-2">Averages</h5>
                    <div className="space-y-1 text-[#0F2F4E]/80">
                      <p>Avg Gross: {formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalGross || 0), 0) / payrollHistory.length)}</p>
                      <p>Avg PAYE: {formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalPAYE || 0), 0) / payrollHistory.length)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-[#0F2F4E] mb-2">Totals YTD</h5>
                    <div className="space-y-1 text-[#0F2F4E]/80">
                      <p>Total Paid: <span className="font-medium text-[#1ED760]">{formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalNet || 0), 0))}</span></p>
                      <p>Total Tax: <span className="font-medium text-[#FFD700]">{formatCurrency(payrollHistory.reduce((sum, m) => sum + (m.data?.totalPAYE || 0), 0))}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Method Selection - Only show for single mode */}
      {payrollMode === 'single' && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Calculation Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setCalculationMethod('gross')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationMethod === 'gross'
                  ? 'border-[#1ED760] bg-[#1ED760]/10'
                  : 'border-gray-200 hover:border-[#1ED760]/50'
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold text-[#0F2F4E]">Gross Method</h4>
                <p className="text-sm text-gray-600">
                  Start with gross salary, calculate net pay
                </p>
              </div>
            </button>
            
            <button
              onClick={() => setCalculationMethod('net')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationMethod === 'net'
                  ? 'border-[#1ED760] bg-[#1ED760]/10'
                  : 'border-gray-200 hover:border-[#1ED760]/50'
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold text-[#0F2F4E]">Net Method (Grossing Up)</h4>
                <p className="text-sm text-gray-600">
                  Start with desired net, find required gross
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Input Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
          {payrollMode === 'batch' ? 'Add Employee to Batch' : 
           (calculationMethod === 'gross' ? 'Gross Salary Input' : 'Net Salary Input')}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Salary and Employee Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                {payrollMode === 'batch' || calculationMethod === 'gross' ? 
                 'Monthly Basic Salary (USD)' : 'Desired Monthly Net Salary (USD)'}
              </label>
              <input
                type="number"
                value={payrollMode === 'batch' || calculationMethod === 'gross' ? formData.grossSalary : formData.netSalary}
                onChange={(e) => handleInputChange(
                  payrollMode === 'batch' || calculationMethod === 'gross' ? 'grossSalary' : 'netSalary', 
                  e.target.value
                )}
                placeholder="0.00"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760]/20 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                Employee Name {payrollMode === 'batch' ? '(Required)' : '(Optional)'}
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#0F2F4E] mb-1">
                  Employee Number
                </label>
                <input
                  type="text"
                  value={formData.employeeNumber}
                  onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                  placeholder="EMP001"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#0F2F4E] mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Finance"
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#0F2F4E] mb-1">
                Position/Job Title
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Accountant"
                className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
              />
            </div>
          </div>
          
          {/* Allowances Section */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-[#0F2F4E] mb-3">Allowances & Benefits (USD)</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Living Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.livingAllowance}
                    onChange={(e) => handleInputChange('livingAllowance', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Medical Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.medicalAllowance}
                    onChange={(e) => handleInputChange('medicalAllowance', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Transport Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.transportAllowance}
                    onChange={(e) => handleInputChange('transportAllowance', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Housing Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.housingAllowance}
                    onChange={(e) => handleInputChange('housingAllowance', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Commission
                  </label>
                  <input
                    type="number"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bonus (This Month)
                  </label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => handleInputChange('bonus', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Previous Bonus YTD
                  </label>
                  <input
                    type="number"
                    value={formData.cumulativeBonusYTD}
                    onChange={(e) => handleInputChange('cumulativeBonusYTD', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Bonus paid earlier this year</p>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Overtime Pay
                  </label>
                  <input
                    type="number"
                    value={formData.overtime}
                    onChange={(e) => handleInputChange('overtime', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-3 relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50"></div>
                <div className="relative p-3 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-amber-800 font-medium">
                      Bonus threshold: First $700 cumulative per year is tax-free. Amount above $700 YTD taxed at employee's top rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Employer Contributions Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-[#0F2F4E] mb-3">Employer Contributions</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    APWC Rate (%) - Sector Specific
                  </label>
                  <input
                    type="number"
                    value={formData.apwcRate}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value <= TAX_CONFIG.maxAPWCRate * 100) {
                        handleInputChange('apwcRate', e.target.value);
                      }
                    }}
                    placeholder="1.0"
                    min="0"
                    max="2.16"
                    step="0.01"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none text-sm"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Accidents Prevention & Workers Compensation (Max: 2.16%)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>NSSA Employer:</span>
                    <span>4.5% (capped)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ZIMDEF:</span>
                    <span>1.0% (fixed)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
                <div className="relative p-3 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-xs text-blue-800 font-medium">
                      ZIMDEF (1%) and APWC are employer contributions calculated on gross wage bill.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {payrollMode === 'batch' ? (
            <>
              <button
                onClick={addEmployeeToBatch}
                className="flex-1 py-3 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Add Employee to Batch ({employees.length}/20)
              </button>
              
              {employees.length > 0 && (
                <button
                  onClick={calculateBatchPayroll}
                  className="px-6 py-3 bg-gradient-to-r from-[#0F2F4E] to-[#0F2F4E]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Calculate Payroll
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleCalculate}
              className="w-full py-3 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Calculate {calculationMethod === 'gross' ? 'Net Pay' : 'Required Gross'}
            </button>
          )}
        </div>
      </div>

      {/* Batch Employee List */}
      {payrollMode === 'batch' && employees.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#0F2F4E]">
              Employees in Batch ({employees.length}/20)
            </h3>
            <button
              onClick={() => setEmployees([])}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {employees.map((emp, index) => (
              <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-[#0F2F4E]">{emp.employeeName}</span>
                    <span className="text-sm text-gray-600">{emp.employeeNumber}</span>
                    <span className="text-sm text-gray-600">{emp.department}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Basic: {formatCurrency(emp.basicSalary)} | 
                    Total Gross: {formatCurrency(calculateTotalGross(emp.basicSalary, emp.allowances))}
                  </div>
                </div>
                <button
                  onClick={() => removeEmployee(emp.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Batch Results */}
      {payrollMode === 'batch' && batchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Batch Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Total Employees</h4>
              <p className="text-2xl font-bold">{batchResults.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
              <h4 className="text-sm opacity-90">Total Gross</h4>
              <p className="text-xl font-bold">
                {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.grossSalary || 0), 0))}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Total Net</h4>
              <p className="text-xl font-bold">
                {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.netSalary || 0), 0))}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Total PAYE</h4>
              <p className="text-xl font-bold">
                {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.paye || 0), 0))}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Total ZIMDEF</h4>
              <p className="text-xl font-bold">
                {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.zimdef || 0), 0))}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Employer Cost</h4>
              <p className="text-xl font-bold">
                {formatCurrency(batchResults.reduce((sum, emp) => sum + (emp.calculation.totalCostToEmployer || 0), 0))}
              </p>
            </div>
          </div>

          {/* Batch Detailed Table */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0F2F4E]">Payroll Breakdown</h3>
              <div className="flex gap-3">
                <button
                  onClick={generatePayrollReports}
                  className="px-4 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v14a4 4 0 01-4 4z" />
                  </svg>
                  Download Report
                </button>
                
                <button
                  onClick={generateBatchPayslips}
                  disabled={isGeneratingPayslips}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    isGeneratingPayslips 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#0F2F4E] hover:bg-[#0F2F4E]/90'
                  } text-white`}
                >
                  {isGeneratingPayslips ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating... {payslipProgress}%
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download All Payslips ({batchResults.length})
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0F2F4E]/5">
                  <tr>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-left">Basic</th>
                    <th className="p-3 text-left">Allowances</th>
                    <th className="p-3 text-left">Gross</th>
                    <th className="p-3 text-left">NSSA</th>
                    <th className="p-3 text-left">PAYE</th>
                    <th className="p-3 text-left">ZIMDEF</th>
                    <th className="p-3 text-left">APWC</th>
                    <th className="p-3 text-left">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.map((emp, index) => (
                    <tr key={emp.id} className="border-t border-gray-200">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{emp.employeeName}</div>
                          <div className="text-xs text-gray-500">{emp.employeeNumber}</div>
                        </div>
                      </td>
                      <td className="p-3">{formatCurrency(emp.calculation.basicSalary || 0)}</td>
                      <td className="p-3">{formatCurrency(emp.calculation.totalAllowances || 0)}</td>
                      <td className="p-3">{formatCurrency(emp.calculation.grossSalary || 0)}</td>
                      <td className="p-3">{formatCurrency(emp.calculation.nssaEmployee || 0)}</td>
                      <td className="p-3">{formatCurrency(emp.calculation.paye || 0)}</td>
                      <td className="p-3">{formatCurrency(emp.calculation.zimdef || 0)}</td>
                      <td className="p-3">{formatCurrency(emp.calculation.apwc || 0)}</td>
                      <td className="p-3 font-medium text-[#1ED760]">{formatCurrency(emp.calculation.netSalary || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 relative overflow-hidden rounded-lg">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-800 mb-1">Batch Payslips Download</h5>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Click "Download All Payslips" to generate individual PDF payslips for all employees 
                      and download them as a single ZIP file. Each payslip includes detailed earnings, allowances, and deductions breakdown.
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-blue-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Individual PDFs
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ZIP Format
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Progress Tracking
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Single Employee Results */}
      {payrollMode === 'single' && results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Basic Salary</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.basicSalary)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
              <h4 className="text-sm opacity-90">Total Allowances</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.totalAllowances)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Gross Salary</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.grossSalary)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Net Salary</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.netSalary)}</p>
            </div>
          </div>

          {/* Enhanced Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Earnings Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span className="font-medium">{formatCurrency(results.basicSalary)}</span>
                </div>
                
                {results.allowances.living > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Living Allowance:</span>
                    <span>{formatCurrency(results.allowances.living)}</span>
                  </div>
                )}
                
                {results.allowances.medical > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Medical Allowance:</span>
                    <span>{formatCurrency(results.allowances.medical)}</span>
                  </div>
                )}
                
                {results.allowances.transport > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transport Allowance:</span>
                    <span>{formatCurrency(results.allowances.transport)}</span>
                  </div>
                )}
                
                {results.allowances.housing > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Housing Allowance:</span>
                    <span>{formatCurrency(results.allowances.housing)}</span>
                  </div>
                )}
                
                {results.allowances.commission > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commission:</span>
                    <span>{formatCurrency(results.allowances.commission)}</span>
                  </div>
                )}
                
                {results.allowances.bonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bonus:</span>
                    <span>{formatCurrency(results.allowances.bonus)}</span>
                  </div>
                )}
                
                {results.allowances.overtime > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overtime:</span>
                    <span>{formatCurrency(results.allowances.overtime)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total Gross Salary:</span>
                  <span>{formatCurrency(results.grossSalary)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Employee Deductions</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>NSSA Employee (4.5%):</span>
                  <span className="font-medium">{formatCurrency(results.nssaEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYE (Non-FDS):</span>
                  <span className="font-medium">{formatCurrency(results.paye)}</span>
                </div>
                <div className="flex justify-between">
                  <span>AIDS Levy (3%):</span>
                  <span className="font-medium">{formatCurrency(results.aidsLevy)}</span>
                </div>
                {results.bonusTax && results.bonusTax > 0 && (
                  <div className="flex justify-between">
                    <span>Bonus Tax (Top Rate):</span>
                    <span className="font-medium">{formatCurrency(results.bonusTax)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total Deductions:</span>
                  <span>{formatCurrency(results.totalTax || 0)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-[#1ED760]">
                  <span>Net Salary:</span>
                  <span>{formatCurrency(results.netSalary || 0)}</span>
                </div>
                
                {results.bonusCalc && results.bonusCalc.taxFreeBonus && results.bonusCalc.taxFreeBonus > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                    <h5 className="text-sm font-medium text-green-800 mb-1">Bonus Breakdown</h5>
                    <div className="text-xs text-green-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Tax-free portion:</span>
                        <span>{formatCurrency(results.bonusCalc.taxFreeBonus)}</span>
                      </div>
                      {results.bonusCalc.taxableBonus && results.bonusCalc.taxableBonus > 0 && (
                        <div className="flex justify-between">
                          <span>Taxable portion:</span>
                          <span>{formatCurrency(results.bonusCalc.taxableBonus)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Employer Contributions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Employer Contributions</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Employee Gross Salary:</span>
                  <span className="font-medium">{formatCurrency(results.grossSalary || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>NSSA Employer (4.5%):</span>
                  <span className="font-medium">{formatCurrency(results.nssaEmployer || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ZIMDEF (1%):</span>
                  <span className="font-medium">{formatCurrency(results.zimdef || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>APWC ({results.apwcRate || 0}%):</span>
                  <span className="font-medium">{formatCurrency(results.apwc || 0)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total Employer Contributions:</span>
                  <span>{formatCurrency(results.totalEmployerContributions || 0)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-[#0F2F4E]">
                  <span>Total Employer Cost:</span>
                  <span>{formatCurrency(results.totalCostToEmployer || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payslip Generation */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0F2F4E]">Generate Payslip</h3>
              <button
                onClick={() => setShowPayslip(!showPayslip)}
                className="px-4 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 transition"
              >
                {showPayslip ? 'Hide Payslip' : 'Show Payslip'}
              </button>
            </div>
            
            {showPayslip && (
              <div className="mt-6">
                <div className="flex justify-center">
                  {generatePayslip()}
                </div>
                
                <div className="flex justify-center items-center gap-3 mt-6 print:hidden">
                  <button
                    onClick={generatePayslipPDF}
                    className="px-6 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-[#0F2F4E] text-white rounded-lg hover:bg-[#0F2F4E]/90 transition flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  
                  <button
                    onClick={generateOriginalPayslipPDF}
                    className="px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Classic PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

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
                    ${band.min.toLocaleString()} - {band.max === Infinity ? '∞' : `$${band.max.toLocaleString()}`}
                  </td>
                  <td className="p-3">{(band.rate * 100).toFixed(0)}%</td>
                  <td className="p-3">${band.deduct.toLocaleString()}</td>
                  <td className="p-3 text-gray-600">
                    {band.max !== Infinity ? 
                      `$${((band.max * band.rate) - band.deduct).toFixed(2)}` : 
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

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Tutorial Header */}
            <div className="bg-gradient-to-r from-[#0F2F4E] to-[#1ED760] p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {tutorialSteps[tutorialStep].title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">
                      Step {tutorialStep + 1} of {tutorialSteps.length}
                    </span>
                    <div className="flex gap-1">
                      {tutorialSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index <= tutorialStep ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeTutorial}
                  className="text-white/80 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tutorial Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tutorialSteps[tutorialStep].content}
                </p>
              </div>

              {/* Tutorial-specific content based on step */}
              {tutorialStep === 1 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-[#0F2F4E] mb-2">Payroll Modes:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded border-l-4 border-[#1ED760]">
                      <strong>Single Employee</strong>
                      <p className="text-gray-600">Individual calculations with detailed breakdown</p>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-[#0F2F4E]">
                      <strong>Batch Payroll</strong>
                      <p className="text-gray-600">Process up to 20 employees with reports</p>
                    </div>
                  </div>
                </div>
              )}

              {tutorialStep === 4 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-[#0F2F4E] mb-2">Supported Allowances:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Living Allowance</div>
                    <div>• Medical Allowance</div>
                    <div>• Transport Allowance</div>
                    <div>• Housing Allowance</div>
                    <div>• Commission</div>
                    <div>• Bonus (with $700 YTD threshold)</div>
                    <div>• Overtime</div>
                    <div>• APWC (sector-specific)</div>
                  </div>
                </div>
              )}

              {tutorialStep === 5 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-[#0F2F4E] mb-2">Zimbabwe Tax Compliance:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>NSSA Cap:</span>
                      <span className="font-medium">$31.50/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus Tax-Free:</span>
                      <span className="font-medium">$700/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ZIMDEF:</span>
                      <span className="font-medium">1% (employer)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APWC:</span>
                      <span className="font-medium">0-2.16% (sector-based)</span>
                    </div>
                  </div>
                </div>
              )}

              {tutorialStep === 6 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-[#0F2F4E] mb-2">Available Reports:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded">
                      <strong className="text-[#1ED760]">Beautiful PDF</strong>
                      <p className="text-gray-600">HTML-to-PDF conversion with modern design</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <strong className="text-[#0F2F4E]">Classic PDF</strong>
                      <p className="text-gray-600">Traditional PDF with professional layout</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <strong className="text-[#FFD700]">Batch ZIP</strong>
                      <p className="text-gray-600">Individual payslips in ZIP format</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <strong className="text-red-500">Summary Reports</strong>
                      <p className="text-gray-600">Comprehensive payroll analytics</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tutorial Navigation */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between items-center">
              <button
                onClick={prevTutorialStep}
                disabled={tutorialStep === 0}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  tutorialStep === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0F2F4E] text-white hover:bg-[#0F2F4E]/90'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex gap-2">
                <button
                  onClick={closeTutorial}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={nextTutorialStep}
                  className="px-6 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2"
                >
                  {tutorialStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePAYECalculator;