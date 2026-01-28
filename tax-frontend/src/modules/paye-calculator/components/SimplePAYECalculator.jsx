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
  const [payrollHistory, setPayrollHistory] = useState([
    // Sample data for demonstration
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
  ]);
  const [showHistoryView, setShowHistoryView] = useState(false);

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

  // Generate batch payslips as ZIP file
  const generateBatchPayslips = async () => {
    if (batchResults.length === 0) {
      alert('No payroll data available. Please calculate batch payroll first.');
      return;
    }

    setIsGeneratingPayslips(true);
    setPayslipProgress(0);

    try {
      // Import required libraries
      const [{ jsPDF }, JSZip] = await Promise.all([
        import('jspdf'),
        import('jszip')
      ]);

      const zip = new JSZip.default();
      const currentDate = new Date();
      const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Generate individual payslips for each employee
      for (let i = 0; i < batchResults.length; i++) {
        const emp = batchResults[i];
        setPayslipProgress(Math.round((i / batchResults.length) * 100));
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 20;

        // Header
        doc.setFillColor(15, 47, 78);
        doc.rect(0, 0, pageWidth, 50, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYSLIP', pageWidth / 2, 25, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Pay Period: ${payPeriod}`, pageWidth / 2, 40, { align: 'center' });
        
        yPosition = 60;
        
        // Employee Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EMPLOYEE DETAILS', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Employee Name: ${emp.employeeName || 'N/A'}`, 20, yPosition);
        doc.text(`Department: ${emp.department || 'N/A'}`, pageWidth / 2 + 10, yPosition);
        yPosition += 6;
        
        doc.text(`Employee Number: ${emp.employeeNumber || 'N/A'}`, 20, yPosition);
        doc.text(`Position: ${emp.position || 'N/A'}`, pageWidth / 2 + 10, yPosition);
        yPosition += 15;
        
        // Earnings & Deductions
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EARNINGS & DEDUCTIONS', 20, yPosition);
        yPosition += 10;
        
        // Earnings column
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('EARNINGS', 20, yPosition);
        doc.text('DEDUCTIONS', pageWidth / 2 - 20, yPosition);
        doc.text('NET PAY', pageWidth - 60, yPosition);
        yPosition += 8;
        
        const contentStartY = yPosition;
        
        // Earnings breakdown
        doc.setFont('helvetica', 'normal');
        doc.text(`Basic Salary: ${formatCurrency(emp.calculation.basicSalary)}`, 20, yPosition);
        
        // Show allowances if they exist
        if (emp.calculation.allowances.living > 0) {
          yPosition += 5;
          doc.text(`Living Allow.: ${formatCurrency(emp.calculation.allowances.living)}`, 20, yPosition);
        }
        if (emp.calculation.allowances.medical > 0) {
          yPosition += 5;
          doc.text(`Medical Allow.: ${formatCurrency(emp.calculation.allowances.medical)}`, 20, yPosition);
        }
        if (emp.calculation.allowances.transport > 0) {
          yPosition += 5;
          doc.text(`Transport Allow.: ${formatCurrency(emp.calculation.allowances.transport)}`, 20, yPosition);
        }
        if (emp.calculation.allowances.housing > 0) {
          yPosition += 5;
          doc.text(`Housing Allow.: ${formatCurrency(emp.calculation.allowances.housing)}`, 20, yPosition);
        }
        if (emp.calculation.allowances.commission > 0) {
          yPosition += 5;
          doc.text(`Commission: ${formatCurrency(emp.calculation.allowances.commission)}`, 20, yPosition);
        }
        if (emp.calculation.allowances.bonus > 0) {
          yPosition += 5;
          doc.text(`Bonus: ${formatCurrency(emp.calculation.allowances.bonus)}`, 20, yPosition);
        }
        if (emp.calculation.allowances.overtime > 0) {
          yPosition += 5;
          doc.text(`Overtime: ${formatCurrency(emp.calculation.allowances.overtime)}`, 20, yPosition);
        }
        
        yPosition += 8;
        doc.setFont('helvetica', 'bold');
        doc.text(`Gross Salary: ${formatCurrency(emp.calculation.grossSalary)}`, 20, yPosition);
        
        // Reset position for deductions
        yPosition = contentStartY;
        
        // Deductions column
        doc.setFont('helvetica', 'normal');
        doc.text(`NSSA (4.5%): ${formatCurrency(emp.calculation.nssaEmployee)}`, pageWidth / 2 - 20, yPosition);
        yPosition += 6;
        doc.text(`PAYE: ${formatCurrency(emp.calculation.paye)}`, pageWidth / 2 - 20, yPosition);
        yPosition += 6;
        doc.text(`AIDS Levy: ${formatCurrency(emp.calculation.aidsLevy)}`, pageWidth / 2 - 20, yPosition);
        yPosition += 6;
        
        // Net Pay box
        doc.setFillColor(255, 255, 255);
        doc.rect(pageWidth - 80, contentStartY - 2, 70, 20, 'F');
        doc.setDrawColor(30, 215, 96);
        doc.setLineWidth(1);
        doc.rect(pageWidth - 80, contentStartY - 2, 70, 20);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('NET SALARY', pageWidth - 60, contentStartY + 6, { align: 'center' });
        doc.setFontSize(14);
        doc.text(formatCurrency(emp.calculation.netSalary), pageWidth - 60, contentStartY + 12, { align: 'center' });
        
        yPosition += 10;
        
        // Tax Calculation Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX CALCULATION (Non-FDS Method)', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Gross Salary: ${formatCurrency(emp.calculation.grossSalary)}`, 20, yPosition);
        doc.text(`PAYE: ${formatCurrency(emp.calculation.paye)}`, pageWidth / 2, yPosition);
        yPosition += 5;
        doc.text(`Less: NSSA: ${formatCurrency(emp.calculation.nssaEmployee)}`, 20, yPosition);
        doc.text(`AIDS Levy (3%): ${formatCurrency(emp.calculation.aidsLevy)}`, pageWidth / 2, yPosition);
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(`Taxable Income: ${formatCurrency(emp.calculation.taxableGross)}`, 20, yPosition);
        doc.text(`Total Tax: ${formatCurrency(emp.calculation.totalTax)}`, pageWidth / 2, yPosition);
        yPosition += 15;
        
        // Employer Costs
        doc.setFontSize(12);
        doc.text('EMPLOYER COSTS', 20, yPosition);
        yPosition += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Employee Salary: ${formatCurrency(emp.calculation.grossSalary)}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Employer NSSA (4.5%): ${formatCurrency(emp.calculation.nssaEmployer)}`, 20, yPosition);
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Cost to Employer: ${formatCurrency(emp.calculation.totalCostToEmployer)}`, 20, yPosition);
        yPosition += 15;
        
        // Summary Section
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPosition, pageWidth - 40, 35, 'F');
        doc.setDrawColor(30, 215, 96);
        doc.setLineWidth(2);
        doc.rect(20, yPosition, pageWidth - 40, 35);
        
        doc.setFillColor(30, 215, 96);
        doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYSLIP SUMMARY', pageWidth / 2, yPosition + 8, { align: 'center' });
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Gross Salary:', 25, yPosition + 20);
        doc.text(formatCurrency(emp.calculation.grossSalary), 70, yPosition + 20);
        doc.text('Total Deductions:', 110, yPosition + 20);
        doc.text(formatCurrency(emp.calculation.nssaEmployee + emp.calculation.totalTax), 160, yPosition + 20);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 215, 96);
        doc.text('Net Salary:', 25, yPosition + 30);
        doc.text(formatCurrency(emp.calculation.netSalary), 70, yPosition + 30);
        doc.setTextColor(15, 47, 78);
        doc.text('Employer Cost:', 110, yPosition + 30);
        doc.text(formatCurrency(emp.calculation.totalCostToEmployer), 160, yPosition + 30);
        
        yPosition += 45;
        
        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text('This payslip is computer generated and does not require a signature.', pageWidth / 2, yPosition, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition + 5, { align: 'center' });
        
        // Add PDF to ZIP
        const pdfBlob = doc.output('blob');
        const fileName = `payslip-${emp.employeeName.replace(/[^a-zA-Z0-9]/g, '_')}-${emp.employeeNumber || 'NoID'}.pdf`;
        zip.file(fileName, pdfBlob);
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
  const generatePayrollReports = () => {
    if (batchResults.length === 0) {
      alert('No payroll data available. Please calculate batch payroll first.');
      return;
    }

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;
      
      const currentDate = new Date();
      const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Calculate totals
      const totals = batchResults.reduce((acc, emp) => {
        const calc = emp.calculation;
        return {
          totalBasicSalary: acc.totalBasicSalary + calc.basicSalary,
          totalAllowances: acc.totalAllowances + calc.totalAllowances,
          totalGross: acc.totalGross + calc.grossSalary,
          totalNSSAEmployee: acc.totalNSSAEmployee + calc.nssaEmployee,
          totalNSSAEmployer: acc.totalNSSAEmployer + calc.nssaEmployer,
          totalPAYE: acc.totalPAYE + calc.paye,
          totalAidsLevy: acc.totalAidsLevy + calc.aidsLevy,
          totalNet: acc.totalNet + calc.netSalary,
          totalEmployerCost: acc.totalEmployerCost + calc.totalCostToEmployer
        };
      }, {
        totalBasicSalary: 0, totalAllowances: 0, totalGross: 0,
        totalNSSAEmployee: 0, totalNSSAEmployer: 0, totalPAYE: 0,
        totalAidsLevy: 0, totalNet: 0, totalEmployerCost: 0
      });

      // Header
      doc.setFillColor(15, 47, 78);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYROLL SUMMARY REPORT', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pay Period: ${payPeriod}`, pageWidth / 2, 35, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' });
      
      yPosition = 60;
      
      // Summary Statistics
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYROLL SUMMARY', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Summary table
      const summaryData = [
        ['Total Employees:', batchResults.length.toString()],
        ['Total Basic Salaries:', formatCurrency(totals.totalBasicSalary)],
        ['Total Allowances:', formatCurrency(totals.totalAllowances)],
        ['Total Gross Salaries:', formatCurrency(totals.totalGross)],
        ['Total NSSA (Employee):', formatCurrency(totals.totalNSSAEmployee)],
        ['Total NSSA (Employer):', formatCurrency(totals.totalNSSAEmployer)],
        ['Total PAYE:', formatCurrency(totals.totalPAYE)],
        ['Total AIDS Levy:', formatCurrency(totals.totalAidsLevy)],
        ['Total Net Salaries:', formatCurrency(totals.totalNet)],
        ['Total Employer Cost:', formatCurrency(totals.totalEmployerCost)]
      ];

      summaryData.forEach(([label, value]) => {
        doc.text(label, 20, yPosition);
        doc.text(value, 120, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Individual Employee Details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('INDIVIDUAL EMPLOYEE BREAKDOWN', 20, yPosition);
      yPosition += 15;

      // Table headers
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      const headers = ['Name', 'Basic', 'Allow.', 'Gross', 'NSSA', 'PAYE', 'Net'];
      const colWidths = [35, 25, 20, 25, 20, 20, 25];
      let xPos = 20;

      headers.forEach((header, i) => {
        doc.text(header, xPos, yPosition);
        xPos += colWidths[i];
      });
      yPosition += 8;

      // Employee rows
      doc.setFont('helvetica', 'normal');
      batchResults.forEach((emp) => {
        const calc = emp.calculation;
        xPos = 20;
        
        const rowData = [
          emp.employeeName.substring(0, 15),
          formatCurrency(calc.basicSalary).substring(0, 10),
          formatCurrency(calc.totalAllowances).substring(0, 8),
          formatCurrency(calc.grossSalary).substring(0, 10),
          formatCurrency(calc.nssaEmployee).substring(0, 8),
          formatCurrency(calc.paye).substring(0, 8),
          formatCurrency(calc.netSalary).substring(0, 10)
        ];

        rowData.forEach((data, i) => {
          doc.text(data, xPos, yPosition);
          xPos += colWidths[i];
        });
        yPosition += 6;

        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });

      // Save the report
      doc.save(`payroll-report-${payPeriod.replace(' ', '-')}.pdf`);
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
    
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;
      
      const currentDate = new Date();
      const payPeriod = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Header
      doc.setFillColor(15, 47, 78); // Primary Navy
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYSLIP', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pay Period: ${payPeriod}`, pageWidth / 2, 40, { align: 'center' });
      
      yPosition = 60;
      
      // Employee Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EMPLOYEE DETAILS', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Employee Name: ${formData.employeeName || 'N/A'}`, 20, yPosition);
      doc.text(`Department: ${formData.department || 'N/A'}`, pageWidth / 2 + 10, yPosition);
      yPosition += 6;
      
      doc.text(`Employee Number: ${formData.employeeNumber || 'N/A'}`, 20, yPosition);
      doc.text(`Position: ${formData.position || 'N/A'}`, pageWidth / 2 + 10, yPosition);
      yPosition += 15;
      
      // Earnings & Deductions Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EARNINGS & DEDUCTIONS', 20, yPosition);
      yPosition += 10;
      
      // Table headers
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('EARNINGS', 20, yPosition);
      doc.text('DEDUCTIONS', pageWidth / 2 - 20, yPosition);
      doc.text('NET PAY', pageWidth - 60, yPosition);
      yPosition += 8;
      
      // Store starting position for Net Pay box alignment
      const contentStartY = yPosition;
      
      // Table content
      doc.setFont('helvetica', 'normal');
      
      // Earnings column
      doc.text(`Basic Salary: ${formatCurrency(results.grossSalary)}`, 20, yPosition);
      
      // Deductions column
      doc.text(`NSSA (4.5%): ${formatCurrency(results.nssaEmployee)}`, pageWidth / 2 - 20, yPosition);
      yPosition += 6;
      
      doc.text(`Gross Salary: ${formatCurrency(results.grossSalary)}`, 20, yPosition);
      doc.text(`PAYE: ${formatCurrency(results.paye)}`, pageWidth / 2 - 20, yPosition);
      yPosition += 6;
      
      doc.text(`AIDS Levy: ${formatCurrency(results.aidsLevy)}`, pageWidth / 2 - 20, yPosition);
      yPosition += 6;
      
      // Net Pay (highlighted) - aligned with content start
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(pageWidth - 80, contentStartY - 2, 70, 20, 'F');
      
      // Green border for emphasis
      doc.setDrawColor(30, 215, 96);
      doc.setLineWidth(1);
      doc.rect(pageWidth - 80, contentStartY - 2, 70, 20);
      
      doc.setTextColor(0, 0, 0); // Black text for better readability
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('NET SALARY', pageWidth - 60, contentStartY + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.text(formatCurrency(results.netSalary), pageWidth - 60, contentStartY + 12, { align: 'center' });
      
      yPosition += 5;
      
      // Tax Calculation Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TAX CALCULATION (Non-FDS Method)', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      // Left column
      doc.text(`Gross Salary: ${formatCurrency(results.grossSalary)}`, 20, yPosition);
      doc.text(`PAYE: ${formatCurrency(results.paye)}`, pageWidth / 2, yPosition);
      yPosition += 5;
      
      doc.text(`Less: NSSA: ${formatCurrency(results.nssaEmployee)}`, 20, yPosition);
      doc.text(`AIDS Levy (3%): ${formatCurrency(results.aidsLevy)}`, pageWidth / 2, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Taxable Income: ${formatCurrency(results.taxableGrossForPAYE || results.taxableGross || 0)}`, 20, yPosition);
      doc.text(`Total Tax: ${formatCurrency(results.totalTax)}`, pageWidth / 2, yPosition);
      yPosition += 15;
      
      // Employer Costs
      doc.setFontSize(12);
      doc.text('EMPLOYER COSTS', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Employee Salary: ${formatCurrency(results.grossSalary)}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Employer NSSA (4.5%): ${formatCurrency(results.nssaEmployer)}`, 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Cost to Employer: ${formatCurrency(results.totalCostToEmployer)}`, 20, yPosition);
      yPosition += 15;
      
      // Enhanced Summary Section
      doc.setFillColor(245, 245, 245); // Light gray background
      doc.rect(20, yPosition, pageWidth - 40, 35, 'F');
      
      // Border with rounded corners effect
      doc.setDrawColor(30, 215, 96);
      doc.setLineWidth(2);
      doc.rect(20, yPosition, pageWidth - 40, 35);
      
      // Header with green background
      doc.setFillColor(30, 215, 96);
      doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYSLIP SUMMARY', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      // Summary content with better formatting
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Row 1
      doc.text('Gross Salary:', 25, yPosition + 20);
      doc.text(formatCurrency(results.grossSalary), 70, yPosition + 20);
      
      doc.text('Total Deductions:', 110, yPosition + 20);
      doc.text(formatCurrency((results.nssaEmployee || 0) + (results.totalTax || 0)), 160, yPosition + 20);
      
      // Row 2 - Net Pay (highlighted)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 215, 96);
      doc.text('Net Salary:', 25, yPosition + 30);
      doc.text(formatCurrency(results.netSalary), 70, yPosition + 30);
      
      // Employer cost
      doc.setTextColor(15, 47, 78); // Navy color
      doc.text('Employer Cost:', 110, yPosition + 30);
      doc.text(formatCurrency(results.totalCostToEmployer), 160, yPosition + 30);
      
      yPosition += 45;
      
      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(128, 128, 128);
      doc.text('This payslip is computer generated and does not require a signature.', pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition + 5, { align: 'center' });
      
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
      <div className="bg-white p-8 rounded-lg border border-gray-300 max-w-2xl mx-auto" id="payslip-preview">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-[#0F2F4E] pb-4">
          <h2 className="text-2xl font-bold text-[#0F2F4E]">PAYSLIP</h2>
          <p className="text-sm text-gray-600">Pay Period: {payPeriod}</p>
        </div>
        
        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Employee Name:</strong> {formData.employeeName || 'N/A'}</p>
            <p><strong>Employee Number:</strong> {formData.employeeNumber || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Department:</strong> {formData.department || 'N/A'}</p>
            <p><strong>Position:</strong> {formData.position || 'N/A'}</p>
          </div>
        </div>
        
        {/* Salary Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3 border-b border-gray-200 pb-1">
            EARNINGS & DEDUCTIONS
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
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
        <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg">
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
                onClick={() => setPayrollHistory([
                  {
                    month: 10, year: 2024, payrollMode: 'batch', timestamp: '2024-10-31T10:00:00.000Z',
                    data: { employees: 5, totalGross: 12500, totalNet: 9875, totalPAYE: 1850, totalNSSA: 775, totalEmployerCost: 13650 }
                  },
                  {
                    month: 11, year: 2024, payrollMode: 'batch', timestamp: '2024-11-30T10:00:00.000Z',
                    data: { employees: 6, totalGross: 15000, totalNet: 11850, totalPAYE: 2220, totalNSSA: 930, totalEmployerCost: 16380 }
                  },
                  {
                    month: 12, year: 2024, payrollMode: 'batch', timestamp: '2024-12-31T10:00:00.000Z',
                    data: { employees: 7, totalGross: 17500, totalNet: 13825, totalPAYE: 2590, totalNSSA: 1085, totalEmployerCost: 19110 }
                  }
                ])}
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
                {generatePayslip()}
                
                <div className="text-center mt-4 space-x-3">
                  <button
                    onClick={generatePayslipPDF}
                    className="px-6 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Payslip
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
    </div>
  );
};

export default SimplePAYECalculator;