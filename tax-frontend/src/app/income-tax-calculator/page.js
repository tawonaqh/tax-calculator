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
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const COLORS = ["#84cc16", "#f97316", "#60a5fa", "#a78bfa", "#f472b6"];

function cleanAIText(text) {
    if (!text) return "";
    return text
      .replace(/\\\[|\\\]/g, "")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\times/g, "×")
      .replace(/\s+/g, " ")
      .trim();
}

/* ---------- Enhanced Export Components ---------- */
const ExportModal = ({ isOpen, onClose, onExport, type, results, formState }) => {
  const [companyName, setCompanyName] = useState("");
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);

  if (!isOpen) return null;

  const handleExport = () => {
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
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-lime-400/30">
        <h3 className="text-xl font-bold text-lime-400 mb-4">
          {type === 'pdf' ? '📄 Export PDF Report' : '📊 Export Excel Workbook'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 
                         focus:border-lime-400 focus:ring focus:ring-lime-400/40 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tax Year
            </label>
            <input
              type="number"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 
                         focus:border-lime-400 focus:ring focus:ring-lime-400/40 outline-none"
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
                  className="w-4 h-4 text-lime-400 bg-gray-700 border-gray-600 rounded focus:ring-lime-400"
                />
                <label htmlFor="includeCharts" className="text-sm text-gray-300">
                  Include charts and visualizations
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeAI"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                  className="w-4 h-4 text-lime-400 bg-gray-700 border-gray-600 rounded focus:ring-lime-400"
                />
                <label htmlFor="includeAI" className="text-sm text-gray-300">
                  Include AI tax optimization recommendations
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!companyName.trim()}
            className="flex-1 px-4 py-3 bg-lime-400 text-gray-900 rounded-lg font-medium hover:bg-lime-300 transition disabled:opacity-50"
          >
            Export {type === 'pdf' ? 'PDF' : 'Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Professional PDF Export (Manual Table Implementation) ---------- */
const exportComprehensivePDF = (results, formState, options) => {
  // Dynamically import jsPDF to avoid SSR issues
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const lineHeight = 7;
    const sectionSpacing = 15;

    // Helper function to add text with automatic page breaks
    const addTextWithBreaks = (text, x, y, maxWidth) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    // Header with Company Info
    doc.setFillColor(32, 32, 32);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(132, 204, 22); // Lime color
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX COMPUTATION REPORT', pageWidth / 2, 25, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Company: ${options.companyName}`, 20, 40);
    doc.text(`Tax Year: ${options.taxYear}`, pageWidth - 20, 40, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });

    yPosition = 70;

    // Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(132, 204, 22);
    doc.text('EXECUTIVE SUMMARY', 20, yPosition);
    yPosition += sectionSpacing;

    // Manual table implementation for Executive Summary
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
      
      // Add separator line
      if (index < summaryData.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 14;
      }
    });

    yPosition += sectionSpacing;

    // Detailed Profit & Loss Breakdown
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(132, 204, 22);
    doc.text('PROFIT & LOSS DETAILS', 20, yPosition);
    yPosition += 10;

    const profitLossData = [
      { label: "Sales Revenue", value: `$${(parseFloat(formState.sales) || 0).toLocaleString()}` },
      { label: "Other Trading Income", value: `$${(parseFloat(formState.otherTradingIncome) || 0).toLocaleString()}` },
      { label: "Total Revenue", value: `$${((parseFloat(formState.sales) || 0) + (parseFloat(formState.otherTradingIncome) || 0)).toLocaleString()}` },
      { label: "Cost of Goods Sold", value: `$${(parseFloat(formState.costOfGoodsSold) || 0).toLocaleString()}` },
      { label: "Gross Profit", value: `$${(results.comprehensive?.grossProfit || 0).toLocaleString()}` },
      { label: "Operating Expenses", value: `$${(results.comprehensive?.operatingExpenses || 0).toLocaleString()}` },
      { label: "Operating Profit", value: `$${(results.comprehensive?.operatingProfit || 0).toLocaleString()}` }
    ];

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    profitLossData.forEach((item, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(item.label, 20, yPosition);
      doc.text(item.value, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += lineHeight;
    });

    yPosition += sectionSpacing;

    // Tax Adjustments
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(132, 204, 22);
    doc.text('TAX ADJUSTMENTS', 20, yPosition);
    yPosition += 10;

    const taxAdjustments = [
      { label: "Non-Taxable Income", value: "" },
      { label: "  Dividends Received", value: `$${(parseFloat(formState.dividendReceived) || 0).toLocaleString()}` },
      { label: "  Capital Receipts", value: `$${(parseFloat(formState.capitalReceipts) || 0).toLocaleString()}` },
      { label: "  Profit on Asset Sales", value: `$${(parseFloat(formState.profitOnSale) || 0).toLocaleString()}` },
      { label: "  Interest Income", value: `$${(parseFloat(formState.interestFinancial) || 0).toLocaleString()}` },
      { label: "Non-Deductible Expenses", value: "" },
      { label: "  Depreciation", value: `$${(parseFloat(formState.depreciation) || 0).toLocaleString()}` },
      { label: "  Fines & Penalties", value: `$${(parseFloat(formState.finesPenaltiesTax) || 0).toLocaleString()}` },
      { label: "  Donations", value: `$${(parseFloat(formState.donations) || 0).toLocaleString()}` }
    ];

    doc.setFontSize(9);
    taxAdjustments.forEach((item) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(item.label, 20, yPosition);
      if (item.value) {
        doc.text(item.value, pageWidth - 30, yPosition, { align: 'right' });
      }
      yPosition += lineHeight;
    });

    yPosition += sectionSpacing;

    // Capital Allowances
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(132, 204, 22);
    doc.text('CAPITAL ALLOWANCES', 20, yPosition);
    yPosition += 10;

    const capitalAllowances = [
      { label: "Motor Vehicles", value: `$${(parseFloat(formState.motorVehicles) || 0).toLocaleString()}` },
      { label: "Moveable Assets", value: `$${(parseFloat(formState.moveableAssets) || 0).toLocaleString()}` },
      { label: "Commercial Buildings", value: `$${(parseFloat(formState.commercialBuildings) || 0).toLocaleString()}` },
      { label: "Industrial Buildings", value: `$${(parseFloat(formState.industrialBuildings) || 0).toLocaleString()}` },
      { label: "Lease Improvements", value: `$${(parseFloat(formState.leaseImprovements) || 0).toLocaleString()}` },
      { label: "Total Capital Allowances", value: `$${(results.comprehensive?.capitalAllowances || 0).toLocaleString()}` }
    ];

    doc.setFontSize(9);
    capitalAllowances.forEach((item, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Make total row bold
      if (index === capitalAllowances.length - 1) {
        doc.setFont('helvetica', 'bold');
      }
      
      doc.text(item.label, 20, yPosition);
      doc.text(item.value, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += lineHeight;
      
      // Reset font
      doc.setFont('helvetica', 'normal');
    });

    // Tax Optimization Recommendations
    if (options.includeAI && results.comprehensive?.aiExplanation) {
      if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = 20;
      } else {
        yPosition += sectionSpacing;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(132, 204, 22);
      doc.text('TAX OPTIMIZATION RECOMMENDATIONS', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const aiText = cleanAIText(results.comprehensive.aiExplanation);
      yPosition = addTextWithBreaks(aiText, 20, yPosition, pageWidth - 40);
    }

    // Footer on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text(`Confidential - ${options.companyName} Tax Computation`, 20, pageHeight - 10);
    }

    // Save the PDF
    doc.save(`tax-computation-${options.companyName.replace(/\s+/g, '-').toLowerCase()}-${options.taxYear}.pdf`);
  }).catch(error => {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  });
};

/* ---------- Enhanced Excel Export ---------- */
const exportComprehensiveExcel = (results, formState, options) => {
  const wb = XLSX.utils.book_new();
  
  // 1. Executive Summary Sheet
  const summaryData = [
    ['TAX COMPUTATION EXECUTIVE SUMMARY', '', '', ''],
    ['', '', '', ''],
    ['Company:', options.companyName, 'Tax Year:', options.taxYear],
    ['Generated:', new Date().toLocaleDateString(), 'Period:', 'Annual'],
    ['', '', '', ''],
    ['FINANCIAL HIGHLIGHTS', '', 'AMOUNT ($)', ''],
    ['Gross Profit', '', results.comprehensive?.grossProfit || 0, ''],
    ['Operating Profit', '', results.comprehensive?.operatingProfit || 0, ''],
    ['Taxable Income', '', results.comprehensive?.taxableIncome || 0, ''],
    ['', '', '', ''],
    ['TAX CALCULATION', '', 'AMOUNT ($)', 'RATE'],
    ['Corporate Income Tax', '', results.comprehensive?.taxDue || 0, '25%'],
    ['AIDS Levy', '', results.comprehensive?.aidsLevy || 0, '3%'],
    ['Total Tax Liability', '', results.comprehensive?.totalTax || 0, ''],
    ['', '', '', ''],
    ['EFFECTIVE TAX RATES', '', 'VALUE', ''],
    ['Effective Tax Rate', '', `${((results.comprehensive?.totalTax / (results.comprehensive?.taxableIncome || 1)) * 100).toFixed(2)}%`, ''],
    ['Profit Margin', '', `${((results.comprehensive?.operatingProfit / (parseFloat(formState.sales) || 1)) * 100).toFixed(2)}%`, '']
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, "Executive Summary");

  // 2. Detailed Profit & Loss Sheet (QPD Format)
  const profitLossData = [
    ['PROFIT AND LOSS STATEMENT', '', '', ''],
    ['For the year ended', '31 December', options.taxYear, ''],
    ['', '', '', ''],
    ['REVENUE', 'NOTES', `$${options.taxYear}`, ''],
    ['Sales', '', parseFloat(formState.sales) || 0, ''],
    ['Other Trading Income', '', parseFloat(formState.otherTradingIncome) || 0, ''],
    ['TOTAL REVENUE', '', `=C6+C7`, ''],
    ['', '', '', ''],
    ['COST OF SALES', '', '', ''],
    ['Cost of Goods Sold', '', parseFloat(formState.costOfGoodsSold) || 0, ''],
    ['GROSS PROFIT', '', `=C8-C10`, ''],
    ['', '', '', ''],
    ['OPERATING EXPENSES', '', '', ''],
    ['Advertising & Marketing', '', parseFloat(formState.advertisingMarketing) || 0, ''],
    ['Training & Events', '', parseFloat(formState.trainingEvent) || 0, ''],
    ['Bank Charges', '', parseFloat(formState.bankCharges) || 0, ''],
    ['IMTT', '', parseFloat(formState.imtt) || 0, ''],
    ['Salaries & Wages', '', parseFloat(formState.salaries) || 0, ''],
    ['TOTAL OPERATING EXPENSES', '', `=SUM(C14:C18)`, ''],
    ['', '', '', ''],
    ['OPERATING PROFIT', '', `=C11-C19`, ''],
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(profitLossData);
  XLSX.utils.book_append_sheet(wb, ws2, "Profit & Loss");

  // 3. Tax Computation Sheet (ZIMRA Format)
  const taxComputationData = [
    ['INCOME TAX COMPUTATION', '', '', ''],
    ['In terms of Income Tax Act [Chapter 23:06]', '', '', ''],
    ['', '', '', ''],
    ['PROFIT BEFORE TAX', '', results.comprehensive?.operatingProfit || 0, 'A'],
    ['', '', '', ''],
    ['ADD: NON-DEDUCTIBLE EXPENSES', '', '', ''],
    ['Depreciation', '', parseFloat(formState.depreciation) || 0, ''],
    ['Fines & Penalties', '', parseFloat(formState.finesPenaltiesTax) || 0, ''],
    ['Donations', '', parseFloat(formState.donations) || 0, ''],
    ['Disallowable Subscriptions', '', parseFloat(formState.disallowableSubscriptions) || 0, ''],
    ['TOTAL ADDITIONS', '', `=SUM(C7:C10)`, 'B'],
    ['', '', '', ''],
    ['DEDUCT: NON-TAXABLE INCOME', '', '', ''],
    ['Dividends Received', '', parseFloat(formState.dividendReceived) || 0, ''],
    ['Capital Receipts', '', parseFloat(formState.capitalReceipts) || 0, ''],
    ['Profit on Sale of Assets', '', parseFloat(formState.profitOnSale) || 0, ''],
    ['Interest from Financial Inst.', '', parseFloat(formState.interestFinancial) || 0, ''],
    ['TOTAL DEDUCTIONS', '', `=SUM(C13:C16)`, 'C'],
    ['', '', '', ''],
    ['DEDUCT: CAPITAL ALLOWANCES', '', '', ''],
    ['Motor Vehicles', '', parseFloat(formState.motorVehicles) || 0, ''],
    ['Moveable Assets', '', parseFloat(formState.moveableAssets) || 0, ''],
    ['Commercial Buildings', '', parseFloat(formState.commercialBuildings) || 0, ''],
    ['Industrial Buildings', '', parseFloat(formState.industrialBuildings) || 0, ''],
    ['Lease Improvements', '', parseFloat(formState.leaseImprovements) || 0, ''],
    ['TOTAL CAPITAL ALLOWANCES', '', `=SUM(C19:C23)`, 'D'],
    ['', '', '', ''],
    ['ADJUSTED TAXABLE INCOME', '', `=C4+B11-C17-D24`, 'E'],
    ['Corporate Tax @ 25%', '', `=E25*0.25`, 'F'],
    ['AIDS Levy @ 3% of Tax', '', `=F26*0.03`, 'G'],
    ['TOTAL TAX LIABILITY', '', `=F26+G27`, 'H']
  ];

  const ws3 = XLSX.utils.aoa_to_sheet(taxComputationData);
  XLSX.utils.book_append_sheet(wb, ws3, "Tax Computation");

  // 4. Capital Allowances Schedule
  const capitalAllowanceData = [
    ['CAPITAL ALLOWANCES SCHEDULE', '', '', ''],
    ['Asset Class', 'Cost/Value', 'Allowance Rate', 'Allowance Amount'],
    ['Motor Vehicles', parseFloat(formState.motorVehicles) || 0, '25%', `=B3*0.25`],
    ['Moveable Assets', parseFloat(formState.moveableAssets) || 0, '25%', `=B4*0.25`],
    ['Commercial Buildings', parseFloat(formState.commercialBuildings) || 0, '5%', `=B5*0.05`],
    ['Industrial Buildings', parseFloat(formState.industrialBuildings) || 0, '10%', `=B6*0.1`],
    ['Lease Improvements', parseFloat(formState.leaseImprovements) || 0, '10%', `=B7*0.1`],
    ['TOTAL ALLOWANCES', '', '', `=SUM(D3:D7)`]
  ];

  const ws4 = XLSX.utils.aoa_to_sheet(capitalAllowanceData);
  XLSX.utils.book_append_sheet(wb, ws4, "Capital Allowances");

  // 5. Tax Planning Recommendations
  if (results.comprehensive?.aiExplanation) {
    const recommendationsData = [
      ['TAX OPTIMIZATION RECOMMENDATIONS', '', '', ''],
      ['Generated by AI Tax Assistant', '', '', ''],
      ['', '', '', ''],
      ...cleanAIText(results.comprehensive.aiExplanation).split('. ').map(rec => [rec.trim()])
    ];
    
    const ws5 = XLSX.utils.aoa_to_sheet(recommendationsData);
    XLSX.utils.book_append_sheet(wb, ws5, "Tax Optimization");
  }

  // Save the workbook
  XLSX.writeFile(wb, `tax-planning-${options.companyName.replace(/\s+/g, '-').toLowerCase()}-${options.taxYear}.xlsx`);
};

/* ---------- Enhanced Export Buttons Component ---------- */
const EnhancedExportButtons = ({ results, formState }) => {
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
      <div className="flex flex-col sm:flex-row gap-3 mt-6 p-4 bg-gradient-to-r from-lime-900/20 to-green-900/20 rounded-lg border border-lime-700/30">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-lime-300 mb-2">Professional Reports</h4>
          <p className="text-sm text-gray-300">
            Generate comprehensive PDF reports and Excel workbooks for tax filing and planning
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setExportModal({ open: true, type: 'pdf' })}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition flex items-center gap-2"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => setExportModal({ open: true, type: 'excel' })}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition flex items-center gap-2"
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

/* ---------- Enhanced Capital Allowance Calculator ---------- */
const CapitalAllowanceCalculator = ({ formState, onUpdate }) => {
  const [assetDetails, setAssetDetails] = useState({
    motorVehicles: {
      totalCostPrice: formState.motorVehicles || "",
      datePurchased: "",
      normalDepreciationRate: 0.2,
      specialInitialAllowance: 0.5,
      acceleratedWearTear: 0.25,
      wearTear: 0.2
    },
    moveableAssets: {
      totalCostPrice: formState.moveableAssets || "",
      datePurchased: "",
      normalDepreciationRate: 0.25,
      specialInitialAllowance: 0.5,
      acceleratedWearTear: 0.25,
      wearTear: 0.1
    },
    commercialBuildings: {
      totalCostPrice: formState.commercialBuildings || "",
      datePurchased: "",
      normalDepreciationRate: 0.1,
      specialInitialAllowance: 0,
      acceleratedWearTear: 0,
      wearTear: 0.025
    },
    industrialBuildings: {
      totalCostPrice: formState.industrialBuildings || "",
      datePurchased: "",
      normalDepreciationRate: 0.1,
      specialInitialAllowance: 0,
      acceleratedWearTear: 0,
      wearTear: 0.05
    },
    leaseImprovements: {
      totalCostPrice: formState.leaseImprovements || "",
      datePurchased: "",
      normalDepreciationRate: 0,
      specialInitialAllowance: 0.5,
      acceleratedWearTear: 0.25,
      wearTear: 0.05
    }
  });

  const calculateAllowances = (assetType, details) => {
    const cost = parseFloat(details.totalCostPrice) || 0;
    
    const specialInitialAllowance = cost * details.specialInitialAllowance;
    const acceleratedWearTear = cost * details.acceleratedWearTear;
    const wearTear = cost * details.wearTear;
    
    // Total allowance is the maximum of the three types
    const totalAllowance = Math.max(specialInitialAllowance, acceleratedWearTear, wearTear);
    
    return {
      specialInitialAllowance,
      acceleratedWearTear,
      wearTear,
      totalAllowance
    };
  };

  const updateAssetDetail = (assetType, field, value) => {
    const updatedDetails = {
      ...assetDetails,
      [assetType]: {
        ...assetDetails[assetType],
        [field]: value
      }
    };
    
    setAssetDetails(updatedDetails);
    
    // Update the main form state with calculated allowances
    const allowances = calculateAllowances(assetType, updatedDetails[assetType]);
    if (onUpdate) {
      onUpdate(assetType, allowances.totalAllowance);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-lime-400">Detailed Capital Allowance Calculation</h3>
      
      {Object.entries(assetDetails).map(([assetType, details]) => {
        const allowances = calculateAllowances(assetType, details);
        
        return (
          <div key={assetType} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h4 className="font-semibold text-lime-300 mb-3 capitalize">
              {assetType.replace(/([A-Z])/g, ' $1')}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Total Cost Price ($)</label>
                <input
                  type="number"
                  value={details.totalCostPrice}
                  onChange={(e) => updateAssetDetail(assetType, 'totalCostPrice', e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:border-lime-400 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date Purchased</label>
                <input
                  type="date"
                  value={details.datePurchased}
                  onChange={(e) => updateAssetDetail(assetType, 'datePurchased', e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:border-lime-400 outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Special Initial</div>
                <div className="text-lime-400 font-medium">${allowances.specialInitialAllowance.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Accelerated W&T</div>
                <div className="text-lime-400 font-medium">${allowances.acceleratedWearTear.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Wear & Tear</div>
                <div className="text-lime-400 font-medium">${allowances.wearTear.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded border border-lime-400">
                <div className="text-gray-400">Total Allowance</div>
                <div className="text-lime-400 font-semibold">${allowances.totalAllowance.toLocaleString()}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Shared UI Components ---------- */
const ActionButton = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-gradient-to-r from-lime-400 to-lime-500 
               text-gray-900 px-5 py-2 rounded-lg font-semibold 
               hover:from-lime-300 hover:to-lime-400 transition disabled:opacity-50"
  >
    {children}
  </button>
);

const InputField = ({ label, value, onChange, type = "number", className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 
                 focus:border-lime-400 focus:ring focus:ring-lime-400/40 outline-none"
    />
  </div>
);

/* ---------- Main Page ---------- */
export default function TaxPlanningPage() {
  const [activeTab, setActiveTab] = useState("profit-loss");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [aiHistory, setAIHistory] = useState([]);
  
  // Comprehensive form state matching Excel structure
  const [formState, setFormState] = useState({
    // Profit and Loss
    sales: "",
    otherTradingIncome: "",
    costOfGoodsSold: "",
    advertisingMarketing: "",
    trainingEvent: "",
    automobileExpense: "",
    vehicleInsurance: "",
    managementMileage: "",
    staffMileage: "",
    fuelExpense: "",
    vehicleMaintenance: "",
    bankCharges: "",
    imtt: "",
    salaries: "",
    consultantExpense: "",
    accountingFees: "",
    equipmentRental: "",
    finesPenalties: "",
    itInternet: "",
    janitorial: "",
    warehouse: "",
    cottage: "",
    mealsEntertainment: "",
    officeSupplies: "",
    otherExpenses: "",
    rentExpense: "",
    
    // Tax Computation
    dividendReceived: "",
    capitalReceipts: "",
    profitOnSale: "",
    interestFinancial: "",
    depreciation: "",
    disallowableSubscriptions: "",
    disallowableLegal: "",
    finesPenaltiesTax: "",
    donations: "",
    recoupment: "",
    incomeReceivedAdvance: "",
    doubtfulDebts: "",
    dividendsNet: "",
    
    // Capital Allowance
    motorVehicles: "",
    moveableAssets: "",
    commercialBuildings: "",
    industrialBuildings: "",
    leaseImprovements: "",
  });

  const handleChange = (k) => (e) =>
    setFormState((s) => ({ ...s, [k]: e.target.value }));

  const handleCapitalAllowanceUpdate = (assetType, allowance) => {
    setFormState(prev => ({
      ...prev,
      [assetType]: allowance.toString()
    }));
  };

  const callApi = async (endpoint, payload) => {
    const url = `${API_BASE}${endpoint}`;
    const res = await axios.post(url, payload);
    return res.data;
  };

  function buildContextMessage(type, inputs, result) {
    const fmt = (v) =>
      typeof v === "number"
        ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : v;

    if (type === "comprehensive") {
      return `Comprehensive Corporate Tax Calculation for Zimbabwe. 
      Inputs: Sales=${fmt(inputs.sales)}, COGS=${fmt(inputs.costOfGoodsSold)}, Expenses=${fmt(inputs.totalExpenses)}. 
      Result: Taxable Income=${fmt(result.taxableIncome)}, Tax=${fmt(result.taxDue)}, AIDS levy=${fmt(result.aidsLevy)}. 
      Please explain in the Zimbabwean context, under 160 words, and suggest tax optimization strategies.`;
    }
    return `Tax calculation summary for Zimbabwe: Inputs ${JSON.stringify(
      inputs
    )}, Result ${JSON.stringify(
      result
    )}. Provide guidance on deductions or optimization in Zimbabwean context, ≤160 words.`;
  }

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

  // Enhanced calculation with detailed capital allowances
  const calculateComprehensiveTaxLocal = (payload) => {
    const { profitLoss, taxComputation, capitalAllowance } = payload;
    
    // Calculate Gross Profit
    const sales = parseFloat(profitLoss?.sales) || 0;
    const otherTradingIncome = parseFloat(profitLoss?.otherTradingIncome) || 0;
    const costOfGoodsSold = parseFloat(profitLoss?.costOfGoodsSold) || 0;
    
    const grossProfit = (sales + otherTradingIncome) - costOfGoodsSold;
    
    // Calculate Operating Profit
    let totalOperatingExpenses = 0;
    if (profitLoss?.operatingExpenses) {
      totalOperatingExpenses = Object.values(profitLoss.operatingExpenses).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    
    // Add individual expenses
    totalOperatingExpenses += parseFloat(profitLoss?.advertisingMarketing) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.trainingEvent) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.bankCharges) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.imtt) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.salaries) || 0;
    
    const operatingProfit = grossProfit - totalOperatingExpenses;
    
    // Tax Computation
    let totalNonTaxableIncome = 0;
    if (taxComputation?.nonTaxableIncome) {
      totalNonTaxableIncome = Object.values(taxComputation.nonTaxableIncome).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    
    let totalNonDeductibleExpenses = 0;
    if (taxComputation?.nonDeductibleExpenses) {
      totalNonDeductibleExpenses = Object.values(taxComputation.nonDeductibleExpenses).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    
    let taxableIncome = operatingProfit - totalNonTaxableIncome + totalNonDeductibleExpenses;
    
    // Apply capital allowances with enhanced calculation
    let totalCapitalAllowance = 0;
    let detailedCapitalAllowances = {};
    
    if (capitalAllowance) {
      // Calculate detailed allowances for each asset type
      const assetRates = {
        motorVehicles: { special: 0.5, accelerated: 0.25, wearTear: 0.2 },
        moveableAssets: { special: 0.5, accelerated: 0.25, wearTear: 0.1 },
        commercialBuildings: { special: 0, accelerated: 0, wearTear: 0.025 },
        industrialBuildings: { special: 0, accelerated: 0, wearTear: 0.05 },
        leaseImprovements: { special: 0.5, accelerated: 0.25, wearTear: 0.05 }
      };
      
      Object.entries(capitalAllowance).forEach(([assetType, cost]) => {
        const rates = assetRates[assetType];
        const assetCost = parseFloat(cost) || 0;
        
        const specialAllowance = assetCost * rates.special;
        const acceleratedAllowance = assetCost * rates.accelerated;
        const wearTearAllowance = assetCost * rates.wearTear;
        
        // Use the maximum allowance for each asset
        const assetAllowance = Math.max(specialAllowance, acceleratedAllowance, wearTearAllowance);
        
        detailedCapitalAllowances[assetType] = {
          cost: assetCost,
          specialAllowance,
          acceleratedAllowance,
          wearTearAllowance,
          totalAllowance: assetAllowance
        };
        
        totalCapitalAllowance += assetAllowance;
      });
    }
    
    taxableIncome -= totalCapitalAllowance;
    
    // Ensure taxable income is not negative
    taxableIncome = Math.max(0, taxableIncome);
    
    // Calculate taxes
    const taxDue = taxableIncome * 0.25; // 25% corporate tax
    const aidsLevy = taxDue * 0.03; // 3% AIDS levy
    const totalTax = taxDue + aidsLevy;
    
    return {
      grossProfit,
      operatingProfit,
      taxableIncome,
      taxDue: Math.max(taxDue, 0), // Ensure non-negative
      aidsLevy: Math.max(aidsLevy, 0), // Ensure non-negative
      totalTax: Math.max(totalTax, 0), // Ensure non-negative
      costOfGoodsSold,
      operatingExpenses: totalOperatingExpenses,
      nonDeductibleExpenses: totalNonDeductibleExpenses,
      capitalAllowances: Math.max(totalCapitalAllowance, 0), // Ensure non-negative
      detailedCapitalAllowances: Object.keys(detailedCapitalAllowances).length > 0 ? detailedCapitalAllowances : null
    };
  };

  // Main calculation function
  const calculateComprehensiveTax = async () => {
    setLoading(true);
    try {
      const payload = {
        profitLoss: {
          sales: parseFloat(formState.sales) || 0,
          otherTradingIncome: parseFloat(formState.otherTradingIncome) || 0,
          costOfGoodsSold: parseFloat(formState.costOfGoodsSold) || 0,
          operatingExpenses: {
            advertisingMarketing: parseFloat(formState.advertisingMarketing) || 0,
            trainingEvent: parseFloat(formState.trainingEvent) || 0,
            bankCharges: parseFloat(formState.bankCharges) || 0,
            imtt: parseFloat(formState.imtt) || 0,
            salaries: parseFloat(formState.salaries) || 0,
          }
        },
        taxComputation: {
          nonTaxableIncome: {
            dividendReceived: parseFloat(formState.dividendReceived) || 0,
            capitalReceipts: parseFloat(formState.capitalReceipts) || 0,
            profitOnSale: parseFloat(formState.profitOnSale) || 0,
            interestFinancial: parseFloat(formState.interestFinancial) || 0,
          },
          nonDeductibleExpenses: {
            depreciation: parseFloat(formState.depreciation) || 0,
            disallowableSubscriptions: parseFloat(formState.disallowableSubscriptions) || 0,
            finesPenalties: parseFloat(formState.finesPenaltiesTax) || 0,
            donations: parseFloat(formState.donations) || 0,
          }
        },
        capitalAllowance: {
          motorVehicles: parseFloat(formState.motorVehicles) || 0,
          moveableAssets: parseFloat(formState.moveableAssets) || 0,
          commercialBuildings: parseFloat(formState.commercialBuildings) || 0,
          industrialBuildings: parseFloat(formState.industrialBuildings) || 0,
          leaseImprovements: parseFloat(formState.leaseImprovements) || 0,
        }
      };
      
      let data;
      try {
        // Try to call the API first
        data = await callApi("/calculate/comprehensive-corporate-tax", payload);
      } catch (apiError) {
        console.log("API call failed, using local calculation:", apiError);
        // If API fails, use local calculation
        data = calculateComprehensiveTaxLocal(payload);
      }
      
      setResults((r) => ({ ...r, comprehensive: data }));
      
      const summary = buildContextMessage("comprehensive", payload, data);
      const aiReply = await sendToAI(summary);
      pushAIHistory(summary, aiReply);
      
      setResults((r) => ({
        ...r,
        comprehensive: { ...data, aiExplanation: aiReply },
      }));
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-400 mt-4 mb-4">
            Comprehensive Tax Planning
          </h1>
          <p className="text-gray-300 mt-2">
            Professional tax computation with enhanced capital allowance calculations
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Calculator */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              {/* Fixed Calculate Button - Always Visible */}
              <div className="mb-6 p-4 bg-gradient-to-r from-lime-900/30 to-green-900/30 rounded-lg border border-lime-700/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-lime-300">Ready to Calculate?</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Fill in data across all tabs, then click Calculate to see your comprehensive tax results
                    </p>
                  </div>
                  <ActionButton 
                    onClick={calculateComprehensiveTax} 
                    disabled={loading}
                    className="whitespace-nowrap"
                  >
                    {loading ? "🔄 Calculating..." : "🚀 Calculate Comprehensive Tax"}
                  </ActionButton>
                </div>
              </div>

              <nav className="flex gap-2 mb-6 flex-wrap">
                {[
                  ["profit-loss", "Profit & Loss"],
                  ["tax-computation", "Tax Computation"],
                  ["capital-allowance", "Capital Allowance"],
                  ["quick-calc", "Quick Calc"],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setActiveTab(k)}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === k
                        ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/25"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Tab Instructions */}
              <div className="mb-6">
                {activeTab === "profit-loss" && (
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Profit & Loss Data:</strong> Enter your business income and expenses. This forms the foundation for your tax calculation.
                    </p>
                  </div>
                )}
                {activeTab === "tax-computation" && (
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
                    <p className="text-sm text-purple-300">
                      💡 <strong>Tax Adjustments:</strong> Add non-taxable income and non-deductible expenses. These adjust your accounting profit to arrive at taxable income.
                    </p>
                  </div>
                )}
                {activeTab === "capital-allowance" && (
                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
                    <p className="text-sm text-green-300">
                      💡 <strong>Capital Allowances:</strong> Enter asset values to claim tax deductions using enhanced calculation methods from the Excel template.
                    </p>
                  </div>
                )}
                {activeTab === "quick-calc" && (
                  <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700/30">
                    <p className="text-sm text-orange-300">
                      💡 <strong>Quick Calculation:</strong> Simplified version for quick estimates. Use when you don't need detailed breakdowns.
                    </p>
                  </div>
                )}
              </div>

              {/* Profit & Loss Form */}
              {activeTab === "profit-loss" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400">Operating Income</h3>
                    <InputField
                      label="Sales"
                      value={formState.sales}
                      onChange={handleChange("sales")}
                    />
                    <InputField
                      label="Other Trading Income"
                      value={formState.otherTradingIncome}
                      onChange={handleChange("otherTradingIncome")}
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400 mt-4">Cost of Goods Sold</h3>
                    <InputField
                      label="Cost of Goods Sold"
                      value={formState.costOfGoodsSold}
                      onChange={handleChange("costOfGoodsSold")}
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400 mt-4">Operating Expenses</h3>
                    <InputField
                      label="Advertising & Marketing"
                      value={formState.advertisingMarketing}
                      onChange={handleChange("advertisingMarketing")}
                    />
                    <InputField
                      label="Training Event"
                      value={formState.trainingEvent}
                      onChange={handleChange("trainingEvent")}
                    />
                    <InputField
                      label="Bank Charges"
                      value={formState.bankCharges}
                      onChange={handleChange("bankCharges")}
                    />
                    <InputField
                      label="IMTT"
                      value={formState.imtt}
                      onChange={handleChange("imtt")}
                    />
                    <InputField
                      label="Salaries"
                      value={formState.salaries}
                      onChange={handleChange("salaries")}
                    />
                  </div>
                </div>
              )}

              {/* Tax Computation Form */}
              {activeTab === "tax-computation" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400">Non-Taxable Income</h3>
                    <InputField
                      label="Dividend Received"
                      value={formState.dividendReceived}
                      onChange={handleChange("dividendReceived")}
                    />
                    <InputField
                      label="Capital Receipts"
                      value={formState.capitalReceipts}
                      onChange={handleChange("capitalReceipts")}
                    />
                    <InputField
                      label="Profit on Sale of Assets"
                      value={formState.profitOnSale}
                      onChange={handleChange("profitOnSale")}
                    />
                    <InputField
                      label="Interest from Financial Institution"
                      value={formState.interestFinancial}
                      onChange={handleChange("interestFinancial")}
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400 mt-4">Non-Deductible Expenses</h3>
                    <InputField
                      label="Depreciation"
                      value={formState.depreciation}
                      onChange={handleChange("depreciation")}
                    />
                    <InputField
                      label="Disallowable Subscriptions"
                      value={formState.disallowableSubscriptions}
                      onChange={handleChange("disallowableSubscriptions")}
                    />
                    <InputField
                      label="Fines & Penalties"
                      value={formState.finesPenaltiesTax}
                      onChange={handleChange("finesPenaltiesTax")}
                    />
                    <InputField
                      label="Donations"
                      value={formState.donations}
                      onChange={handleChange("donations")}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Capital Allowance Form */}
              {activeTab === "capital-allowance" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <InputField
                      label="Motor Vehicles Cost"
                      value={formState.motorVehicles}
                      onChange={handleChange("motorVehicles")}
                    />
                    <InputField
                      label="Moveable Assets Cost"
                      value={formState.moveableAssets}
                      onChange={handleChange("moveableAssets")}
                    />
                    <InputField
                      label="Commercial Buildings Cost"
                      value={formState.commercialBuildings}
                      onChange={handleChange("commercialBuildings")}
                    />
                    <InputField
                      label="Industrial Buildings Cost"
                      value={formState.industrialBuildings}
                      onChange={handleChange("industrialBuildings")}
                    />
                    <InputField
                      label="Lease Improvements Cost"
                      value={formState.leaseImprovements}
                      onChange={handleChange("leaseImprovements")}
                    />
                  </div>
                  
                  <CapitalAllowanceCalculator 
                    formState={formState} 
                    onUpdate={handleCapitalAllowanceUpdate}
                  />
                </div>
              )}

              {/* Quick Calculation */}
              {activeTab === "quick-calc" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Gross Profit"
                      value={formState.sales}
                      onChange={handleChange("sales")}
                    />
                    <InputField
                      label="Total Expenses"
                      value={formState.costOfGoodsSold}
                      onChange={handleChange("costOfGoodsSold")}
                    />
                    <InputField
                      label="Non-Taxable Income"
                      value={formState.otherTradingIncome}
                      onChange={handleChange("otherTradingIncome")}
                    />
                    <InputField
                      label="Non-Deductible Expenses"
                      value={formState.imtt}
                      onChange={handleChange("imtt")}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Results Display with Capital Allowance Details */}
              {results.comprehensive && (
                <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-lime-700/30">
                  <h3 className="text-xl font-semibold text-lime-400 mb-4 flex items-center gap-2">
                    <span>📊</span> Tax Computation Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">Taxable Income</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.taxableIncome || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">Tax @ 25%</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.taxDue || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">AIDS Levy @ 3%</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.aidsLevy || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">Total Tax</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.totalTax || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {/* Capital Allowance Breakdown */}
                  {results.comprehensive.detailedCapitalAllowances && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h4 className="text-md font-semibold text-lime-300 mb-3">Capital Allowance Breakdown</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        {Object.entries(results.comprehensive.detailedCapitalAllowances).map(([assetType, details]) => (
                          <div key={assetType} className="bg-gray-700 p-3 rounded">
                            <div className="font-medium text-lime-400 capitalize mb-2">
                              {assetType.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="text-gray-300 space-y-1">
                              <div>Cost: ${details.cost.toLocaleString()}</div>
                              <div>Allowance: ${details.totalAllowance.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex justify-between font-semibold text-lime-300">
                          <span>Total Capital Allowances:</span>
                          <span>${(results.comprehensive.capitalAllowances || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {results.comprehensive.aiExplanation && (
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h4 className="text-md font-semibold text-lime-300 mb-2">AI Tax Guidance</h4>
                      <div className="text-sm text-gray-200 leading-relaxed">
                        {cleanAIText(results.comprehensive.aiExplanation)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Export Buttons */}
              {results.comprehensive && (
                <EnhancedExportButtons results={results} formState={formState} />
              )}
            </div>

            {/* Visualization */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                Tax Breakdown Visualization
              </h3>
              <div className="h-80"> {/* Increased height from h-64 to h-80 */}
                <ComprehensiveChartPanel results={results} />
              </div>
            </div>

            {/* Excel Uploader */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                Import QPD Excel Template
              </h3>
              <ExcelUploader onParse={(data) => handleExcelImport(data)} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                Tax Summary
              </h3>
              <ComprehensiveSummaryPanel results={results} />
              <div className="mt-4 w-full max-w-full">
                <ChatAssistant
                  aiHistory={aiHistory}
                  setAIHistory={setAIHistory}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-lime-800/30">
              <h3 className="text-lg font-semibold text-lime-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Capital Allowance Rates
              </h3>
              
              <div className="space-y-3">
                {/* Motor Vehicles */}
                <div className="bg-gradient-to-r from-lime-900/20 to-green-900/10 p-3 rounded-lg border border-lime-700/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lime-300 text-sm">Motor Vehicles</span>
                    <span className="text-xs bg-lime-500/20 text-lime-300 px-2 py-1 rounded-full">Best Value</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">Special</div>
                      <div className="text-lime-400 font-semibold">50%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Accelerated</div>
                      <div className="text-lime-400 font-semibold">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Wear & Tear</div>
                      <div className="text-lime-400 font-semibold">20%</div>
                    </div>
                  </div>
                </div>

                {/* Moveable Assets */}
                <div className="bg-gradient-to-r from-lime-900/15 to-green-900/10 p-3 rounded-lg border border-lime-700/15">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lime-300 text-sm">Moveable Assets</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">Special</div>
                      <div className="text-lime-400 font-semibold">50%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Accelerated</div>
                      <div className="text-lime-400 font-semibold">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Wear & Tear</div>
                      <div className="text-lime-400 font-semibold">10%</div>
                    </div>
                  </div>
                </div>

                {/* Commercial Buildings */}
                <div className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 p-3 rounded-lg border border-gray-600/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-300 text-sm">Commercial Buildings</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="text-gray-400">Wear & Tear</div>
                      <div className="text-lime-400 font-semibold text-lg">2.5%</div>
                    </div>
                  </div>
                </div>

                {/* Industrial Buildings */}
                <div className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 p-3 rounded-lg border border-gray-600/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-300 text-sm">Industrial Buildings</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="text-gray-400">Wear & Tear</div>
                      <div className="text-lime-400 font-semibold text-lg">5%</div>
                    </div>
                  </div>
                </div>

                {/* Lease Improvements */}
                <div className="bg-gradient-to-r from-lime-900/15 to-green-900/10 p-3 rounded-lg border border-lime-700/15">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lime-300 text-sm">Lease Improvements</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">Special</div>
                      <div className="text-lime-400 font-semibold">50%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Accelerated</div>
                      <div className="text-lime-400 font-semibold">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Wear & Tear</div>
                      <div className="text-lime-400 font-semibold">5%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-lime-500/30 rounded"></div>
                    <span>Multiple Allowances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-600/30 rounded"></div>
                    <span>Single Allowance</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );

  function handleExcelImport(data) {
    // Map Excel data to form state
    if (data.profitLoss) {
      setFormState(prev => ({
        ...prev,
        sales: data.profitLoss.sales || "",
        otherTradingIncome: data.profitLoss.otherTradingIncome || "",
        costOfGoodsSold: data.profitLoss.costOfGoodsSold || "",
        // Map other fields...
      }));
    }
  }
}

function ComprehensiveChartPanel({ results }) {
  if (!results.comprehensive) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-900 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-lime-400 mb-3"
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
        <p className="text-xs text-gray-500">
          Fill in the forms and calculate to generate charts.
        </p>
      </div>
    );
  }

  const { comprehensive } = results;
  
  // Fix: Ensure we have proper data structure for tax breakdown
  const taxBreakdownData = [
    { 
      name: 'Income Tax', 
      value: Math.max(comprehensive.taxDue || 0, 0.01) // Ensure minimum value for display
    },
    { 
      name: 'AIDS Levy', 
      value: Math.max(comprehensive.aidsLevy || 0, 0.01) // Ensure minimum value for display
    },
  ];

  // Fix: Proper capital allowance data extraction
  const capitalAllowanceData = comprehensive.detailedCapitalAllowances ? 
    Object.entries(comprehensive.detailedCapitalAllowances).map(([assetType, details]) => ({
      name: assetType.replace(/([A-Z])/g, ' $1').trim().substring(0, 12), // Shorter names for display
      value: Math.max(details.totalAllowance || 0, 0.01) // Ensure minimum value
    })) : [
    { name: 'No Data', value: 0.01 }
  ];

  // Fix: Add proper label formatter for pie chart
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
        fill="white" 
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
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      {/* Tax Breakdown Pie Chart - FIXED */}
      <div className="flex-1 min-h-[160px]">
        <div className="text-center text-sm text-gray-400 mb-2">Tax Breakdown</div>
        <ResponsiveContainer width="100%" height={200}>
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
                  stroke="#1f2937"
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
                <span style={{ color: '#d1d5db', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Capital Allowance Bar Chart - FIXED */}
      <div className="flex-1 min-h-[160px]">
        <div className="text-center text-sm text-gray-400 mb-2">Capital Allowances</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={capitalAllowanceData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            animationDuration={800}
          >
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#9CA3AF" 
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
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#84cc16" 
              radius={[4, 4, 0, 0]}
              stroke="#65a30d"
              strokeWidth={1}
            >
              <LabelList 
                dataKey="value" 
                position="top" 
                fill="#e5e7eb"
                fontSize={11}
                formatter={(value) => `$${value > 1000 ? `${(value/1000).toFixed(0)}k` : value.toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ComprehensiveSummaryPanel({ results }) {
  if (!results.comprehensive) {
    return (
      <div className="text-gray-400 text-sm">
        Complete the tax computation form to see summary
      </div>
    );
  }

  const { comprehensive } = results;
  
  const items = [
    { label: "Gross Profit", value: comprehensive.grossProfit || 0 },
    { label: "Operating Profit", value: comprehensive.operatingProfit || 0 },
    { label: "Taxable Income", value: comprehensive.taxableIncome || 0 },
    { label: "Capital Allowances", value: comprehensive.capitalAllowances || 0 },
    { label: "Total Tax", value: comprehensive.totalTax || 0 },
  ];
  
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm text-gray-300">
            <span>{item.label}</span>
            <span className="text-lime-400 font-medium">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded">
            <div
              className="h-2 bg-lime-400 rounded"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatAssistant({ aiHistory, setAIHistory }) {
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
          className="flex-1 p-2 text-sm rounded-md bg-gray-700 text-white border border-gray-600 focus:border-lime-400 outline-none"
        />
        <button
          onClick={send}
          disabled={sending}
          className="px-3 text-sm py-2 bg-lime-400 text-gray-900 rounded-md font-medium hover:bg-lime-300 transition"
        >
          {sending ? "..." : "Ask"}
        </button>
      </div>

      <div className="mt-3 max-h-40 overflow-auto space-y-2">
        {aiHistory.map((h, i) => (
          <div key={i} className="p-2 bg-gray-900 rounded-md">
            <div className="text-sm text-gray-300">Q: {h.q}</div>
            <div className="text-sm text-lime-400 mt-1">A: {cleanAIText(h.a)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExcelUploader({ onParse }) {
  const fileRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file.name);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      
      // Parse different sheets like the QPD template
      const profitLossSheet = workbook.Sheets['Profit and Loss'];
      const taxComputationSheet = workbook.Sheets['Tax Computation'];
      const capitalAllowanceSheet = workbook.Sheets['Capital Allowance Schedule'];
      
      const parsedData = {
        profitLoss: profitLossSheet ? XLSX.utils.sheet_to_json(profitLossSheet, { defval: "" }) : [],
        taxComputation: taxComputationSheet ? XLSX.utils.sheet_to_json(taxComputationSheet, { defval: "" }) : [],
        capitalAllowance: capitalAllowanceSheet ? XLSX.utils.sheet_to_json(capitalAllowanceSheet, { defval: "" }) : [],
      };
      
      onParse?.(parsedData);
      
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      alert("Error parsing Excel file. Please check the format.");
    }
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-md 
                   file:border-0 file:text-sm file:font-semibold 
                   file:bg-lime-400 file:text-gray-900 hover:file:bg-lime-300"
      />
      {uploadedFile && (
        <div className="mt-2 text-sm text-lime-400">
          Uploaded: {uploadedFile}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-400">
        Upload QPD Income Tax Computation Excel template
      </div>
    </div>
  );
}