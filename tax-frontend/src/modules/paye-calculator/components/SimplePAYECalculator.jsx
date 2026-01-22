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
  monthlyCapUSD: 58.33, // $700 annual / 12 months
  annualCapUSD: 700
};

const AIDS_LEVY_RATE = 0.03; // 3%

const SimplePAYECalculator = () => {
  const [calculationMethod, setCalculationMethod] = useState('gross'); // 'gross' or 'net'
  const [formData, setFormData] = useState({
    grossSalary: '',
    netSalary: '',
    employeeName: '',
    employeeNumber: '',
    department: '',
    position: ''
  });
  
  const [results, setResults] = useState(null);
  const [showPayslip, setShowPayslip] = useState(false);

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

  // Calculate NSSA with proper capping (based on insurable earnings up to $700 annual / $58.33 monthly)
  const calculateNSSA = (grossSalary) => {
    // NSSA is calculated on insurable earnings up to the monthly cap of $58.33
    // This means the maximum salary subject to NSSA is $58.33 / 4.5% = $1,296.67
    const maxInsurableEarnings = NSSA_CONFIG.monthlyCapUSD / NSSA_CONFIG.employeeRate;
    const insurableEarnings = Math.min(grossSalary, maxInsurableEarnings);
    
    // Calculate NSSA contributions
    const employeeContribution = insurableEarnings * NSSA_CONFIG.employeeRate;
    const employerContribution = insurableEarnings * NSSA_CONFIG.employerRate;
    
    // Ensure contributions don't exceed the monthly cap
    return {
      employee: Math.min(employeeContribution, NSSA_CONFIG.monthlyCapUSD),
      employer: Math.min(employerContribution, NSSA_CONFIG.monthlyCapUSD),
      insurableEarnings: insurableEarnings
    };
  };

  // Gross Method: Start with gross salary, calculate net
  const calculateFromGross = (grossSalary) => {
    const nssa = calculateNSSA(grossSalary);
    const taxableGross = grossSalary - nssa.employee;
    const paye = calculatePAYE(taxableGross);
    const aidsLevy = paye * AIDS_LEVY_RATE;
    const totalTax = paye + aidsLevy;
    const netSalary = grossSalary - nssa.employee - totalTax;
    
    return {
      grossSalary,
      nssaEmployee: nssa.employee,
      nssaEmployer: nssa.employer,
      taxableGross,
      paye,
      aidsLevy,
      totalTax,
      netSalary,
      totalCostToEmployer: grossSalary + nssa.employer
    };
  };

  // Net Method: Start with desired net, gross up to find required gross
  const calculateFromNet = (targetNet) => {
    let grossSalary = targetNet;
    let iterations = 0;
    const maxIterations = 50;
    
    // Iterative approach to find gross salary that gives target net
    while (iterations < maxIterations) {
      const result = calculateFromGross(grossSalary);
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
    
    return calculateFromGross(grossSalary);
  };

  const handleCalculate = () => {
    const inputValue = calculationMethod === 'gross' 
      ? parseFloat(formData.grossSalary) 
      : parseFloat(formData.netSalary);
    
    if (!inputValue || inputValue <= 0) {
      alert('Please enter a valid salary amount');
      return;
    }

    const result = calculationMethod === 'gross' 
      ? calculateFromGross(inputValue)
      : calculateFromNet(inputValue);
    
    setResults(result);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      doc.text(`Taxable Income: ${formatCurrency(results.taxableGross)}`, 20, yPosition);
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
      doc.text(formatCurrency(results.nssaEmployee + results.totalTax), 160, yPosition + 20);
      
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
                  <span>{formatCurrency(results.grossSalary)}</span>
                </div>
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
                  <span>({formatCurrency(results.nssaEmployee + results.totalTax)})</span>
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
              <p className="font-medium">Taxable Income: {formatCurrency(results.taxableGross)}</p>
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0F2F4E] mb-2">
          Simple PAYE Calculator
        </h1>
        <p className="text-gray-600">
          Non-FDS Method | Monthly Basis | PAYE + NSSA + Payslip Generation
        </p>
      </div>

      {/* Method Selection */}
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

      {/* Input Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">
          {calculationMethod === 'gross' ? 'Gross Salary Input' : 'Net Salary Input'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Input */}
          <div>
            <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
              {calculationMethod === 'gross' ? 'Monthly Gross Salary (USD)' : 'Desired Monthly Net Salary (USD)'}
            </label>
            <input
              type="number"
              value={calculationMethod === 'gross' ? formData.grossSalary : formData.netSalary}
              onChange={(e) => handleInputChange(
                calculationMethod === 'gross' ? 'grossSalary' : 'netSalary', 
                e.target.value
              )}
              placeholder="0.00"
              className="w-full p-2 rounded-lg border border-gray-300 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760]/20 outline-none"
            />
          </div>
          
          {/* Employee Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
                Employee Name (Optional)
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                placeholder="John Doe"
                className="w-full p-2 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#0F2F4E] mb-1">
                  Employee #
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
        </div>
        
        <button
          onClick={handleCalculate}
          className="mt-6 w-full py-3 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
        >
          Calculate {calculationMethod === 'gross' ? 'Net Pay' : 'Required Gross'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Gross Salary</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.grossSalary)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFD700]/80 p-4 rounded-lg text-[#0F2F4E]">
              <h4 className="text-sm opacity-90">Total Deductions</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(results.nssaEmployee + results.totalTax)}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F2F4E] to-[#0F2F4E]/80 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Net Salary</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.netSalary)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-lg text-white">
              <h4 className="text-sm opacity-90">Employer Cost</h4>
              <p className="text-2xl font-bold">{formatCurrency(results.totalCostToEmployer)}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Detailed Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Employee Deductions</h4>
                <div className="space-y-2 text-sm">
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
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total Deductions:</span>
                    <span>{formatCurrency(results.nssaEmployee + results.totalTax)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Employer Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Employee Gross Salary:</span>
                    <span className="font-medium">{formatCurrency(results.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NSSA Employer (4.5%):</span>
                    <span className="font-medium">{formatCurrency(results.nssaEmployer)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total Employer Cost:</span>
                    <span>{formatCurrency(results.totalCostToEmployer)}</span>
                  </div>
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
          NSSA Contribution Rules (2025/2026)
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
              <p>• Annual Cap: <strong>USD 700</strong></p>
              <p>• Monthly Cap: <strong>USD 58.33</strong></p>
              <p>• Max Insurable Earnings: <strong>USD 1,296.22</strong>/month</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> NSSA contributions are calculated on insurable earnings up to the monthly cap. 
            For salaries above USD 1,296.22/month, NSSA is capped at USD 58.33 per month per person.
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

      {/* Advanced PAYE Calculator Link */}
      <div className="bg-gradient-to-br from-[#0F2F4E]/5 to-[#0F2F4E]/10 rounded-xl p-6 shadow-lg mt-6 border border-[#0F2F4E]/20">
        <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
          Need More Advanced Features?
        </h3>
        <p className="text-sm text-[#0F2F4E]/80 mb-4">
          For comprehensive PAYE calculations with benefits, multi-period projections, and business planning features, try our full PAYE calculator.
        </p>
        <Link 
          href="/paye-calculator"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F2F4E] text-white rounded-lg 
                     hover:bg-[#0F2F4E]/90 transition-all duration-300 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Advanced PAYE Calculator
        </Link>
      </div>
    </div>
  );
};

export default SimplePAYECalculator;