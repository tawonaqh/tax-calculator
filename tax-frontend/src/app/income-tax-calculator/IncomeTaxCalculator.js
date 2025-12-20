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

// Color constants based on design system
const COLORS_DESIGN = {
  primaryNavy: "#0F2F4E",
  accentGreen: "#1ED760",
  goldAccent: "#FFD700",
  neutralWhite: "#FFFFFF",
  secondaryGrey: "#EEEEEE"
};

function cleanAIText(text) {
    if (!text) return "";
    return text
      .replace(/\\\[|\\\]/g, "")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\times/g, "×")
      .replace(/\s+/g, " ")
      .trim();
}

function formatAIExplanation(text) {
  if (!text) return "";
  
  const sentences = text.split('. ').filter(sentence => sentence.trim().length > 10);
  
  return (
    <ul className="space-y-2">
      {sentences.map((sentence, index) => (
        <li key={index} className="flex items-start">
          <span className="text-[#1ED760] mr-2 mt-1">•</span>
          <span>{sentence.trim()}{sentence.trim().endsWith('.') ? '' : '.'}</span>
        </li>
      ))}
    </ul>
  );
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
              onChange={(e) => setTaxYear(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                         placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                         focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
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
            disabled={!companyName.trim()}
            className="flex-1 px-4 py-3 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90 transition disabled:opacity-50"
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
    doc.setFillColor(15, 47, 78); // Primary Navy
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(255, 255, 255); // White text
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
    doc.setTextColor(15, 47, 78); // Primary Navy
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

    // Detailed Profit & Loss Breakdown
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(15, 47, 78);
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
    doc.setTextColor(15, 47, 78);
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
    doc.setTextColor(15, 47, 78);
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
      
      if (index === capitalAllowances.length - 1) {
        doc.setFont('helvetica', 'bold');
      }
      
      doc.text(item.label, 20, yPosition);
      doc.text(item.value, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += lineHeight;
      
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
      doc.setTextColor(15, 47, 78);
      doc.text('TAX OPTIMIZATION RECOMMENDATIONS', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const aiText = cleanAIText(results.comprehensive.aiExplanation);
      const sentences = aiText.split('. ').filter(sentence => sentence.trim().length > 10);
      
      sentences.forEach((sentence, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        const bulletPoint = `• ${sentence.trim()}${sentence.trim().endsWith('.') ? '' : '.'}`;
        yPosition = addTextWithBreaks(bulletPoint, 25, yPosition, pageWidth - 45);
        yPosition += 2;
      });

      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      } else {
        yPosition += 10;
      }
      
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.setFont('helvetica', 'italic');
      const disclaimer = "AI guidance is for informational purposes only.";
      yPosition = addTextWithBreaks(disclaimer, 20, yPosition, pageWidth - 40);
      doc.setFont('helvetica', 'normal');
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text(`Confidential - ${options.companyName} Tax Computation`, 20, pageHeight - 10);
    }

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
      <div className="flex flex-col sm:flex-row gap-3 mt-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20">
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
    
    const allowances = calculateAllowances(assetType, updatedDetails[assetType]);
    if (onUpdate) {
      onUpdate(assetType, allowances.totalAllowance);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0F2F4E]">Detailed Capital Allowance Calculation</h3>
      
      {Object.entries(assetDetails).map(([assetType, details]) => {
        const allowances = calculateAllowances(assetType, details);
        
        return (
          <div key={assetType} className="bg-white p-4 rounded-lg border border-[#EEEEEE] shadow-sm">
            <h4 className="font-semibold text-[#0F2F4E] mb-3 capitalize">
              {assetType.replace(/([A-Z])/g, ' $1')}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#0F2F4E] mb-1">Total Cost Price ($)</label>
                <input
                  type="number"
                  value={details.totalCostPrice}
                  onChange={(e) => updateAssetDetail(assetType, 'totalCostPrice', e.target.value)}
                  className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                             placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                             focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#0F2F4E] mb-1">Date Purchased</label>
                <input
                  type="date"
                  value={details.datePurchased}
                  onChange={(e) => updateAssetDetail(assetType, 'datePurchased', e.target.value)}
                  className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                             placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                             focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#0F2F4E]/5 p-3 rounded border border-[#EEEEEE]">
                <div className="text-[#0F2F4E]/70">Special Initial</div>
                <div className="text-[#1ED760] font-medium">${allowances.specialInitialAllowance.toLocaleString()}</div>
              </div>
              
              <div className="bg-[#0F2F4E]/5 p-3 rounded border border-[#EEEEEE]">
                <div className="text-[#0F2F4E]/70">Accelerated W&T</div>
                <div className="text-[#1ED760] font-medium">${allowances.acceleratedWearTear.toLocaleString()}</div>
              </div>
              
              <div className="bg-[#0F2F4E]/5 p-3 rounded border border-[#EEEEEE]">
                <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                <div className="text-[#1ED760] font-medium">${allowances.wearTear.toLocaleString()}</div>
              </div>
              
              <div className="bg-[#0F2F4E]/5 p-3 rounded border border-[#FFD700]">
                <div className="text-[#0F2F4E]/70">Total Allowance</div>
                <div className="text-[#1ED760] font-semibold">${allowances.totalAllowance.toLocaleString()}</div>
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
    className="bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 
               text-white px-5 py-3 rounded-lg font-semibold 
               hover:from-[#1ED760]/90 hover:to-[#1ED760]/80 transition disabled:opacity-50
               shadow-lg shadow-[#1ED760]/25"
  >
    {children}
  </button>
);

const InputField = ({ label, value, onChange, type = "number", className = "", placeholder = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-[#0F2F4E]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg bg-white border border-[#EEEEEE] text-[#0F2F4E] 
                 placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                 focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
    />
  </div>
);

// Add this component near the top with other components
const AIDisclaimer = ({ className = "" }) => (
  <div className={`text-xs text-[#0F2F4E]/70 mt-2 ${className}`}>
    ⚠️ AI guidance is for informational purposes only. Consult a qualified tax professional for specific advice.
  </div>
);

/* ---------- NEW: Enhanced Tax Breakdown Visualization Component ---------- */
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
          <ResponsiveContainer width="100%" height={200}>
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
          <div className="text-xs text-[#0F2F4E]/70 mt-2 text-center">
            Lower percentages indicate better tax efficiency
          </div>
        </div>

        {/* Profit Margins */}
        <div className="bg-white p-4 rounded-xl border border-[#EEEEEE]">
          <h4 className="text-md font-semibold text-[#0F2F4E] mb-4 text-center">
            Profit Margin Analysis
          </h4>
          <ResponsiveContainer width="100%" height={200}>
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
          <ResponsiveContainer width="100%" height={300}>
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

        {/* Revenue & Tax Distribution */}
        <div className="bg-white p-4 rounded-xl border border-[#EEEEEE]">
          <h4 className="text-md font-semibold text-[#0F2F4E] mb-4 text-center">
            Revenue & Tax Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
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
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      {/* Tax Breakdown Pie Chart */}
      <div className="flex-1 min-h-[160px]">
        <div className="text-center text-sm text-[#0F2F4E] mb-2">Tax Breakdown</div>
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

      {/* Capital Allowance Bar Chart */}
      <div className="flex-1 min-h-[160px]">
        <div className="text-center text-sm text-[#0F2F4E] mb-2">Capital Allowances</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={capitalAllowanceData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
  );
};

const ComprehensiveSummaryPanel = ({ results }) => {
  if (!results.comprehensive) {
    return (
      <div className="text-[#0F2F4E]/40 text-sm">
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
          <div className="flex justify-between text-sm text-[#0F2F4E]">
            <span>{item.label}</span>
            <span className="text-[#1ED760] font-medium">
              {typeof item.value === 'number' ? `$${item.value.toLocaleString()}` : item.value}
            </span>
          </div>
          <div className="h-2 bg-[#EEEEEE] rounded">
            <div
              className="h-2 bg-[#1ED760] rounded"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

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
        />
        <button
          onClick={send}
          disabled={sending}
          className="px-3 text-sm py-3 bg-[#1ED760] text-white rounded-lg font-medium hover:bg-[#1ED760]/90 transition"
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

/* ---------- Excel Uploader Component ---------- */
const ExcelUploader = ({ onParse }) => {
  const fileRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file.name);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      
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
        className="block w-full text-sm text-[#0F2F4E] file:mr-3 file:py-2 file:px-4 file:rounded-lg 
                   file:border-0 file:text-sm file:font-semibold 
                   file:bg-[#1ED760] file:text-white hover:file:bg-[#1ED760]/90"
      />
      {uploadedFile && (
        <div className="mt-2 text-sm text-[#1ED760]">
          Uploaded: {uploadedFile}
        </div>
      )}
      <div className="mt-2 text-xs text-[#0F2F4E]/70">
        Upload QPD Income Tax Computation Excel template
      </div>
    </div>
  );
};

/* ---------- Main Page ---------- */
export default function TaxPlanningPage() {
  const [activeTab, setActiveTab] = useState("profit-loss");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [aiHistory, setAIHistory] = useState([]);
  
  // Comprehensive form state matching Excel structure exactly
  const [formState, setFormState] = useState({
    // Profit and Loss - Operating Income
    sales: "",
    otherTradingIncome: "",
    
    // Cost of Goods Sold
    costOfGoodsSold: "",
    
    // Operating Expenses - Updated to match Excel document
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
    parking: "",
    printingStationery: "",
    repairsMaintenance: "",
    telephoneExpense: "",
    travelExpense: "",
    flights: "",
    taxi: "",
    tollFee: "",
    rentExpense: "",
    cottageRent: "",
    warehouseRent: "",
    
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
    
    // Calculate Operating Profit - Sum all operating expenses
    let totalOperatingExpenses = 0;
    
    // Add all individual expense categories
    const expenseFields = [
      'advertisingMarketing', 'trainingEvent', 'automobileExpense', 
      'vehicleInsurance', 'managementMileage', 'staffMileage', 'fuelExpense',
      'vehicleMaintenance', 'bankCharges', 'imtt', 'salaries', 'consultantExpense',
      'accountingFees', 'equipmentRental', 'finesPenalties', 'itInternet',
      'janitorial', 'warehouse', 'cottage', 'mealsEntertainment', 'officeSupplies',
      'otherExpenses', 'parking', 'printingStationery', 'repairsMaintenance',
      'telephoneExpense', 'travelExpense', 'flights', 'taxi', 'tollFee',
      'rentExpense', 'cottageRent', 'warehouseRent'
    ];
    
    expenseFields.forEach(field => {
      totalOperatingExpenses += parseFloat(profitLoss?.[field] || 0);
    });
    
    const operatingProfit = grossProfit - totalOperatingExpenses;
    
    // Tax Computation
    let totalNonTaxableIncome = 0;
    const nonTaxableFields = ['dividendReceived', 'capitalReceipts', 'profitOnSale', 'interestFinancial'];
    nonTaxableFields.forEach(field => {
      totalNonTaxableIncome += parseFloat(taxComputation?.[field] || 0);
    });
    
    let totalNonDeductibleExpenses = 0;
    const nonDeductibleFields = ['depreciation', 'disallowableSubscriptions', 'finesPenaltiesTax', 'donations'];
    nonDeductibleFields.forEach(field => {
      totalNonDeductibleExpenses += parseFloat(taxComputation?.[field] || 0);
    });
    
    let taxableIncome = operatingProfit - totalNonTaxableIncome + totalNonDeductibleExpenses;
    
    // Apply capital allowances with enhanced calculation
    let totalCapitalAllowance = 0;
    let detailedCapitalAllowances = {};
    
    if (capitalAllowance) {
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
    
    taxableIncome = Math.max(0, taxableIncome);
    
    const taxDue = taxableIncome * 0.25;
    const aidsLevy = taxDue * 0.03;
    const totalTax = taxDue + aidsLevy;
    
    return {
      grossProfit,
      operatingProfit,
      taxableIncome,
      taxDue: Math.max(taxDue, 0),
      aidsLevy: Math.max(aidsLevy, 0),
      totalTax: Math.max(totalTax, 0),
      costOfGoodsSold,
      operatingExpenses: totalOperatingExpenses,
      nonDeductibleExpenses: totalNonDeductibleExpenses,
      capitalAllowances: Math.max(totalCapitalAllowance, 0),
      detailedCapitalAllowances: Object.keys(detailedCapitalAllowances).length > 0 ? detailedCapitalAllowances : null
    };
  };

  // Main calculation function
  const calculateComprehensiveTax = async () => {
    setLoading(true);
    try {
      const payload = {
        profitLoss: formState,
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
        data = await callApi("/calculate/comprehensive-corporate-tax", payload);
      } catch (apiError) {
        console.log("API call failed, using local calculation:", apiError);
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

  function handleExcelImport(data) {
    if (data.profitLoss && data.profitLoss.length > 0) {
      const firstRow = data.profitLoss[0];
      const updates = {};
      
      // Map Excel columns to form fields
      if (firstRow['Sales']) updates.sales = firstRow['Sales'];
      if (firstRow['Other Trading Income']) updates.otherTradingIncome = firstRow['Other Trading Income'];
      if (firstRow['Cost of Goods Sold']) updates.costOfGoodsSold = firstRow['Cost of Goods Sold'];
      
      setFormState(prev => ({ ...prev, ...updates }));
    }
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="text-center mb-8">
          <div className="bg-white rounded-2xl p-8 border border-[#FFD700] shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F2F4E] mt-4 mb-4">
              Comprehensive Tax Planning
            </h1>
            <p className="text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto">
              Professional tax computation with enhanced capital allowance calculations for Zimbabwe
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Calculator */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-xl">
              {/* Fixed Calculate Button - Always Visible */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 rounded-lg border border-[#1ED760]/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F2F4E]">Ready to Calculate?</h3>
                    <p className="text-sm text-[#0F2F4E]/70 mt-1">
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
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeTab === k
                        ? "bg-[#1ED760] text-white shadow-lg shadow-[#1ED760]/25"
                        : "text-[#0F2F4E] hover:bg-[#0F2F4E]/5 border border-[#EEEEEE]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Tab Instructions */}
              <div className="mb-6">
                {activeTab === "profit-loss" && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-[#0F2F4E]">
                      💡 <strong>Profit & Loss Data:</strong> Enter your business income and expenses. This forms the foundation for your tax calculation.
                    </p>
                  </div>
                )}
                {activeTab === "tax-computation" && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-[#0F2F4E]">
                      💡 <strong>Tax Adjustments:</strong> Add non-taxable income and non-deductible expenses. These adjust your accounting profit to arrive at taxable income.
                    </p>
                  </div>
                )}
                {activeTab === "capital-allowance" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-[#0F2F4E]">
                      💡 <strong>Capital Allowances:</strong> Enter asset values to claim tax deductions using enhanced calculation methods from the Excel template.
                    </p>
                  </div>
                )}
                {activeTab === "quick-calc" && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-[#0F2F4E]">
                      💡 <strong>Quick Calculation:</strong> Simplified version for quick estimates. Use when you don't need detailed breakdowns.
                    </p>
                  </div>
                )}
              </div>

              {/* Profit & Loss Form - Updated to match Excel document */}
              {activeTab === "profit-loss" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E]">Operating Income</h3>
                    <InputField
                      label="Sales"
                      value={formState.sales}
                      onChange={handleChange("sales")}
                      placeholder="Enter total sales revenue"
                    />
                    <InputField
                      label="Other Trading Income"
                      value={formState.otherTradingIncome}
                      onChange={handleChange("otherTradingIncome")}
                      placeholder="Other business income"
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E] mt-4">Cost of Goods Sold</h3>
                    <InputField
                      label="Cost of Goods Sold"
                      value={formState.costOfGoodsSold}
                      onChange={handleChange("costOfGoodsSold")}
                      placeholder="Direct production costs"
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E] mt-4">Operating Expenses</h3>
                    
                    <InputField
                      label="Advertising & Marketing"
                      value={formState.advertisingMarketing}
                      onChange={handleChange("advertisingMarketing")}
                      placeholder="Marketing expenses"
                    />
                    <InputField
                      label="Training Event"
                      value={formState.trainingEvent}
                      onChange={handleChange("trainingEvent")}
                      placeholder="Staff training costs"
                    />
                    
                    <InputField
                      label="Automobile Expense"
                      value={formState.automobileExpense}
                      onChange={handleChange("automobileExpense")}
                      placeholder="Vehicle expenses"
                    />
                    <InputField
                      label="Vehicle Insurance"
                      value={formState.vehicleInsurance}
                      onChange={handleChange("vehicleInsurance")}
                      placeholder="Insurance costs"
                    />
                    <InputField
                      label="Management Mileage"
                      value={formState.managementMileage}
                      onChange={handleChange("managementMileage")}
                      placeholder="Management travel"
                    />
                    <InputField
                      label="Staff Mileage"
                      value={formState.staffMileage}
                      onChange={handleChange("staffMileage")}
                      placeholder="Staff travel"
                    />
                    <InputField
                      label="Fuel Expense"
                      value={formState.fuelExpense}
                      onChange={handleChange("fuelExpense")}
                      placeholder="Fuel costs"
                    />
                    <InputField
                      label="Vehicle Maintenance"
                      value={formState.vehicleMaintenance}
                      onChange={handleChange("vehicleMaintenance")}
                      placeholder="Maintenance costs"
                    />
                    
                    <InputField
                      label="Bank Charges"
                      value={formState.bankCharges}
                      onChange={handleChange("bankCharges")}
                      placeholder="Bank fees and charges"
                    />
                    <InputField
                      label="IMTT"
                      value={formState.imtt}
                      onChange={handleChange("imtt")}
                      placeholder="Intermediated Money Transfer Tax"
                    />
                    <InputField
                      label="Salaries"
                      value={formState.salaries}
                      onChange={handleChange("salaries")}
                      placeholder="Employee salaries"
                    />
                    <InputField
                      label="Consultant Expense"
                      value={formState.consultantExpense}
                      onChange={handleChange("consultantExpense")}
                      placeholder="Consultant fees"
                    />
                    <InputField
                      label="Accounting Fees"
                      value={formState.accountingFees}
                      onChange={handleChange("accountingFees")}
                      placeholder="Accounting services"
                    />
                    
                    <InputField
                      label="Equipment Rental"
                      value={formState.equipmentRental}
                      onChange={handleChange("equipmentRental")}
                      placeholder="Equipment rental costs"
                    />
                    <InputField
                      label="Fines & Penalties"
                      value={formState.finesPenalties}
                      onChange={handleChange("finesPenalties")}
                      placeholder="Fines and penalties"
                    />
                    <InputField
                      label="IT & Internet Expenses"
                      value={formState.itInternet}
                      onChange={handleChange("itInternet")}
                      placeholder="Technology costs"
                    />
                    <InputField
                      label="Janitorial Expense"
                      value={formState.janitorial}
                      onChange={handleChange("janitorial")}
                      placeholder="Cleaning services"
                    />
                    <InputField
                      label="Warehouse"
                      value={formState.warehouse}
                      onChange={handleChange("warehouse")}
                      placeholder="Warehouse costs"
                    />
                    <InputField
                      label="Cottage"
                      value={formState.cottage}
                      onChange={handleChange("cottage")}
                      placeholder="Cottage expenses"
                    />
                    
                    <InputField
                      label="Meals & Entertainment"
                      value={formState.mealsEntertainment}
                      onChange={handleChange("mealsEntertainment")}
                      placeholder="Entertainment costs"
                    />
                    <InputField
                      label="Office Supplies"
                      value={formState.officeSupplies}
                      onChange={handleChange("officeSupplies")}
                      placeholder="Office supplies"
                    />
                    <InputField
                      label="Other Expenses"
                      value={formState.otherExpenses}
                      onChange={handleChange("otherExpenses")}
                      placeholder="Miscellaneous expenses"
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E] mt-4">Rent & Rates</h3>
                    <InputField
                      label="Rent Expense"
                      value={formState.rentExpense}
                      onChange={handleChange("rentExpense")}
                      placeholder="Office rent"
                    />
                    <InputField
                      label="Cottage Rent"
                      value={formState.cottageRent}
                      onChange={handleChange("cottageRent")}
                      placeholder="Cottage rental"
                    />
                    <InputField
                      label="Warehouse Rent"
                      value={formState.warehouseRent}
                      onChange={handleChange("warehouseRent")}
                      placeholder="Warehouse rental"
                    />
                  </div>
                </div>
              )}

              {/* Tax Computation Form */}
              {activeTab === "tax-computation" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E]">Non-Taxable Income</h3>
                    <InputField
                      label="Dividend Received"
                      value={formState.dividendReceived}
                      onChange={handleChange("dividendReceived")}
                      placeholder="Dividend income"
                    />
                    <InputField
                      label="Capital Receipts"
                      value={formState.capitalReceipts}
                      onChange={handleChange("capitalReceipts")}
                      placeholder="Capital receipts"
                    />
                    <InputField
                      label="Profit on Sale of Assets"
                      value={formState.profitOnSale}
                      onChange={handleChange("profitOnSale")}
                      placeholder="Asset sale profits"
                    />
                    <InputField
                      label="Interest from Financial Institution"
                      value={formState.interestFinancial}
                      onChange={handleChange("interestFinancial")}
                      placeholder="Bank interest income"
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E] mt-4">Non-Deductible Expenses</h3>
                    <InputField
                      label="Depreciation"
                      value={formState.depreciation}
                      onChange={handleChange("depreciation")}
                      placeholder="Accounting depreciation"
                    />
                    <InputField
                      label="Disallowable Subscriptions"
                      value={formState.disallowableSubscriptions}
                      onChange={handleChange("disallowableSubscriptions")}
                      placeholder="Non-deductible subscriptions"
                    />
                    <InputField
                      label="Disallowable Legal Expenses"
                      value={formState.disallowableLegal}
                      onChange={handleChange("disallowableLegal")}
                      placeholder="Non-deductible legal"
                    />
                    <InputField
                      label="Fines & Penalties"
                      value={formState.finesPenaltiesTax}
                      onChange={handleChange("finesPenaltiesTax")}
                      placeholder="Fines and penalties"
                    />
                    <InputField
                      label="Donations"
                      value={formState.donations}
                      onChange={handleChange("donations")}
                      placeholder="Charitable donations"
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-[#0F2F4E] mt-4">Other Tax Items</h3>
                    <InputField
                      label="Recoupment"
                      value={formState.recoupment}
                      onChange={handleChange("recoupment")}
                      placeholder="Tax recoupment"
                    />
                    <InputField
                      label="Income Received in Advance"
                      value={formState.incomeReceivedAdvance}
                      onChange={handleChange("incomeReceivedAdvance")}
                      placeholder="Deferred income"
                    />
                    <InputField
                      label="Doubtful Debts"
                      value={formState.doubtfulDebts}
                      onChange={handleChange("doubtfulDebts")}
                      placeholder="Bad debt provision"
                    />
                    <InputField
                      label="Dividends (Net)"
                      value={formState.dividendsNet}
                      onChange={handleChange("dividendsNet")}
                      placeholder="Net dividends"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Capital Allowance Form */}
              {activeTab === "capital-allowance" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 hidden">
                    <InputField
                      label="Motor Vehicles Cost"
                      value={formState.motorVehicles}
                      onChange={handleChange("motorVehicles")}
                      placeholder="Vehicle purchase costs"
                    />
                    <InputField
                      label="Moveable Assets Cost"
                      value={formState.moveableAssets}
                      onChange={handleChange("moveableAssets")}
                      placeholder="Equipment and machinery"
                    />
                    <InputField
                      label="Commercial Buildings Cost"
                      value={formState.commercialBuildings}
                      onChange={handleChange("commercialBuildings")}
                      placeholder="Commercial property costs"
                    />
                    <InputField
                      label="Industrial Buildings Cost"
                      value={formState.industrialBuildings}
                      onChange={handleChange("industrialBuildings")}
                      placeholder="Industrial property costs"
                    />
                    <InputField
                      label="Lease Improvements Cost"
                      value={formState.leaseImprovements}
                      onChange={handleChange("leaseImprovements")}
                      placeholder="Leasehold improvements"
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
                      placeholder="Total revenue"
                    />
                    <InputField
                      label="Total Expenses"
                      value={formState.costOfGoodsSold}
                      onChange={handleChange("costOfGoodsSold")}
                      placeholder="Business expenses"
                    />
                    <InputField
                      label="Non-Taxable Income"
                      value={formState.otherTradingIncome}
                      onChange={handleChange("otherTradingIncome")}
                      placeholder="Exempt income"
                    />
                    <InputField
                      label="Non-Deductible Expenses"
                      value={formState.imtt}
                      onChange={handleChange("imtt")}
                      placeholder="Non-deductible costs"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Results Display with Capital Allowance Details */}
              {results.comprehensive && (
                <div className="mt-8 p-6 bg-white rounded-xl border border-[#1ED760]/30 shadow-lg">
                  <h3 className="text-2xl font-bold text-[#0F2F4E] mb-6 text-center">
                    Tax Computation Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">Taxable Income</div>
                      <div className="text-[#1ED760] font-bold text-xl">
                        ${(results.comprehensive.taxableIncome || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">Tax @ 25%</div>
                      <div className="text-[#1ED760] font-bold text-xl">
                        ${(results.comprehensive.taxDue || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">AIDS Levy @ 3%</div>
                      <div className="text-[#FFD700] font-bold text-xl">
                        ${(results.comprehensive.aidsLevy || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#0F2F4E]/5 p-4 rounded-lg text-center border border-[#EEEEEE]">
                      <div className="text-[#0F2F4E]/70 text-sm mb-1">Total Tax</div>
                      <div className="text-[#0F2F4E] font-bold text-xl">
                        ${(results.comprehensive.totalTax || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Capital Allowance Breakdown */}
                  {results.comprehensive.detailedCapitalAllowances && (
                    <div className="mt-4 p-4 bg-[#0F2F4E]/5 rounded-lg border border-[#EEEEEE]">
                      <h4 className="text-md font-semibold text-[#0F2F4E] mb-3">Capital Allowance Breakdown</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        {Object.entries(results.comprehensive.detailedCapitalAllowances).map(([assetType, details]) => (
                          <div key={assetType} className="bg-white p-3 rounded border border-[#EEEEEE]">
                            <div className="font-medium text-[#0F2F4E] capitalize mb-2">
                              {assetType.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="text-[#0F2F4E] space-y-1">
                              <div>Cost: ${details.cost.toLocaleString()}</div>
                              <div>Allowance: ${details.totalAllowance.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#EEEEEE]">
                        <div className="flex justify-between font-semibold text-[#0F2F4E]">
                          <span>Total Capital Allowances:</span>
                          <span>${(results.comprehensive.capitalAllowances || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {results.comprehensive.aiExplanation && (
                    <div className="mt-6 p-4 bg-[#0F2F4E]/5 rounded-lg border border-[#EEEEEE]">
                      <h4 className="text-md font-semibold text-[#0F2F4E] mb-2">AI Tax Guidance</h4>
                      <div className="text-sm text-[#0F2F4E] leading-relaxed">
                        {formatAIExplanation(cleanAIText(results.comprehensive.aiExplanation))}
                      </div>
                      <AIDisclaimer className="mt-3" />
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Export Buttons */}
              {results.comprehensive && (
                <EnhancedExportButtons results={results} formState={formState} />
              )}
            </div>

            {/* NEW: Enhanced Tax Breakdown Visualization */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
                Tax Breakdown Visualization
              </h3>
              <div className="min-h-[600px]">
                <TaxBreakdownVisualization results={results} formState={formState} />
              </div>
            </div>

            {/* Excel Uploader */}
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
                Import QPD Excel Template
              </h3>
              <ExcelUploader onParse={(data) => handleExcelImport(data)} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-3">
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

            <div className="bg-white rounded-2xl p-6 border border-[#FFD700] shadow-lg">
              <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Capital Allowance Rates
              </h3>
              
              <div className="space-y-3">
                {/* Motor Vehicles */}
                <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 p-3 rounded-lg border border-[#1ED760]/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#0F2F4E] text-sm">Motor Vehicles</span>
                    <span className="text-xs bg-[#1ED760]/20 text-[#0F2F4E] px-2 py-1 rounded-full">Best Value</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Special</div>
                      <div className="text-[#1ED760] font-semibold">50%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Accelerated</div>
                      <div className="text-[#1ED760] font-semibold">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                      <div className="text-[#1ED760] font-semibold">20%</div>
                    </div>
                  </div>
                </div>

                {/* Moveable Assets */}
                <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 p-3 rounded-lg border border-[#1ED760]/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#0F2F4E] text-sm">Moveable Assets</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Special</div>
                      <div className="text-[#1ED760] font-semibold">50%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Accelerated</div>
                      <div className="text-[#1ED760] font-semibold">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                      <div className="text-[#1ED760] font-semibold">10%</div>
                    </div>
                  </div>
                </div>

                {/* Commercial Buildings */}
                <div className="bg-gradient-to-r from-[#EEEEEE] to-[#EEEEEE]/50 p-3 rounded-lg border border-[#EEEEEE]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#0F2F4E] text-sm">Commercial Buildings</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                      <div className="text-[#1ED760] font-semibold text-lg">2.5%</div>
                    </div>
                  </div>
                </div>

                {/* Industrial Buildings */}
                <div className="bg-gradient-to-r from-[#EEEEEE] to-[#EEEEEE]/50 p-3 rounded-lg border border-[#EEEEEE]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#0F2F4E] text-sm">Industrial Buildings</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                      <div className="text-[#1ED760] font-semibold text-lg">5%</div>
                    </div>
                  </div>
                </div>

                {/* Lease Improvements */}
                <div className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/5 p-3 rounded-lg border border-[#1ED760]/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#0F2F4E] text-sm">Lease Improvements</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Special</div>
                      <div className="text-[#1ED760] font-semibold">50%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Accelerated</div>
                      <div className="text-[#1ED760] font-semibold">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#0F2F4E]/70">Wear & Tear</div>
                      <div className="text-[#1ED760] font-semibold">5%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-[#EEEEEE]">
                <div className="flex items-center justify-between text-xs text-[#0F2F4E]/70">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1ED760]/30 rounded"></div>
                    <span>Multiple Allowances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#EEEEEE] rounded"></div>
                    <span>Single Allowance</span>
                  </div>
                </div>
              </div>
              {/* Disclaimer */}
              <div className="mt-4 pt-3 border-t border-[#EEEEEE]">
                <div className="text-xs text-[#0F2F4E]/50 text-center">
                  Rates based on current Zimbabwe tax legislation. Subject to change.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}