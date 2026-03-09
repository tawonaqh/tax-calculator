'use client'

/**
 * Batch Report Generator for Payroll System
 * Generates three types of reports:
 * 1. Payslip Summary (multi-page with all employees)
 * 2. NSSA Form P4 (Monthly Payment Schedule)
 * 3. PAYE Report (Tax summary)
 */

export class BatchReportGenerator {
  constructor(companyData, formatCurrency) {
    this.companyData = companyData;
    this.formatCurrency = formatCurrency;
  }

  /**
   * Load TaxCul logo as base64 for PDF embedding
   */
  async loadTaxCulLogo() {
    try {
      // Try to load the icon as base64 with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/icon-192x192.png', { 
        signal: controller.signal,
        cache: 'force-cache' // Use browser cache
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logo');
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to load TaxCul logo:', error);
      // Return null to continue without logo rather than failing completely
      return null;
    }
  }

  /**
   * Generate all three batch reports as separate PDFs in a ZIP file
   */
  async generateAllBatchReports(batchResults, periodMonth, periodYear) {
    if (batchResults.length === 0) {
      alert('No payroll data available. Please calculate batch payroll first.');
      return;
    }

    try {
      // Load TaxCul logo first
      const taxculLogoBase64 = await this.loadTaxCulLogo();
      
      const [{ jsPDF }, JSZip, autoTableModule] = await Promise.all([
        import('jspdf'),
        import('jszip'),
        import('jspdf-autotable')
      ]);

      const autoTable = autoTableModule.default;
      const zip = new JSZip.default();
      const payPeriod = `${periodMonth}/${periodYear}`;

      // Generate each report with the logo
      const payslipSummaryPDF = await this.generatePayslipSummary(batchResults, payPeriod, jsPDF, autoTable, taxculLogoBase64);
      const nssaFormPDF = await this.generateNSSAFormP4(batchResults, payPeriod, jsPDF, autoTable, taxculLogoBase64);
      const payeReportPDF = await this.generatePAYEReport(batchResults, payPeriod, jsPDF, autoTable, taxculLogoBase64);

      // Add PDFs to ZIP
      zip.file(`Payslip-Summary-${payPeriod.replace('/', '-')}.pdf`, payslipSummaryPDF);
      zip.file(`NSSA-Form-P4-${payPeriod.replace('/', '-')}.pdf`, nssaFormPDF);
      zip.file(`PAYE-Report-${payPeriod.replace('/', '-')}.pdf`, payeReportPDF);

      // Download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Batch-Payroll-Reports-${payPeriod.replace('/', '-')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating batch reports:', error);
      alert('Error generating batch reports. Please try again.');
    }
  }

  /**
   * Generate Payslip Summary Report (3 pages)
   * Shows all employees with earnings, deductions, and employer contributions
   */
  async generatePayslipSummary(batchResults, payPeriod, jsPDF, autoTable, taxculLogoBase64) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Calculate totals
    const totals = this.calculateTotals(batchResults);
    
    // Helper function to add header to each page
    const addHeader = (pageNum) => {
      // TaxCul logo (top right) - SMALL and subtle
      if (taxculLogoBase64) {
        try {
          doc.addImage(taxculLogoBase64, 'PNG', pageWidth - 20, 10, 10, 10);
        } catch (error) {
          console.log('TaxCul logo could not be added:', error);
        }
      }
      
      // Company logo (if available, place on left)
      if (this.companyData.companyLogo) {
        try {
          doc.addImage(this.companyData.companyLogo, 'PNG', 20, 10, 20, 20);
        } catch (error) {
          console.log('Company logo could not be added');
        }
      }
      
      // Title
      doc.setTextColor(15, 47, 78); // Navy blue #0F2F4E
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYSLIP SUMMARY', pageWidth / 2, 20, { align: 'center' });
      
      // Company name
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(this.companyData.companyName || 'Company Name', pageWidth / 2, 28, { align: 'center' });
      
      // Date and time info
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`DATE: ${dateStr}`, 20, 40);
      doc.text(`TIME: ${timeStr}`, 20, 45);
      doc.text(`START PERIOD: ${payPeriod}`, 20, 50);
      doc.text(`END PERIOD: ${payPeriod}`, 20, 55);
      
      // Currency indicator (moved to avoid logo overlap)
      doc.text(`Currency: US$`, 20, 60);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Generated by TAXCUL', 20, pageHeight - 10);
      doc.text(`Printed by: ${this.companyData.companyName || 'Company Name'}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text(`Page ${pageNum} of 3`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      
      // Navy blue border around the page
      doc.setDrawColor(15, 47, 78); // Navy blue
      doc.setLineWidth(1);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    };
    
    // PAGE 1 & 2: Employee Details
    let currentPage = 1;
    let yPosition = 68; // Adjusted for currency line
    const employeesPerPage = 6;
    
    addHeader(currentPage);
    
    // Table headers
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS', 20, yPosition);
    doc.text('AMOUNT', 55, yPosition, { align: 'right' });
    doc.text('UNITS', 75, yPosition, { align: 'right' });
    doc.text('DEDUCTIONS', 90, yPosition);
    doc.text('AMOUNT', 135, yPosition, { align: 'right' });
    doc.text('UNITS', 155, yPosition, { align: 'right' });
    doc.text('EMPLOYER', 165, yPosition);
    doc.text('CONTRIBUTIONS', 165, yPosition + 4);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    
    batchResults.forEach((emp, index) => {
      // Check if we need a new page
      if (index > 0 && index % employeesPerPage === 0) {
        doc.addPage();
        currentPage++;
        addHeader(currentPage);
        yPosition = 68; // Adjusted for currency line
        
        // Repeat headers
        doc.setFont('helvetica', 'bold');
        doc.text('EARNINGS', 20, yPosition);
        doc.text('AMOUNT', 55, yPosition, { align: 'right' });
        doc.text('UNITS', 75, yPosition, { align: 'right' });
        doc.text('DEDUCTIONS', 90, yPosition);
        doc.text('AMOUNT', 135, yPosition, { align: 'right' });
        doc.text('UNITS', 155, yPosition, { align: 'right' });
        doc.text('EMPLOYER', 165, yPosition);
        doc.text('CONTRIBUTIONS', 165, yPosition + 4);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
      }
      
      const calc = emp.calculation;
      const startY = yPosition;
      
      // Employee header
      doc.setFont('helvetica', 'bold');
      doc.text(`CODE: ${emp.employeeNumber || 'N/A'}`, 20, yPosition);
      yPosition += 4;
      doc.text('Basic', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      
      // Employee name and details
      doc.text(`NAME: ${emp.employeeName || 'N/A'}`, 55, startY);
      doc.text((emp.position || 'N/A').toUpperCase(), 90, startY);
      yPosition += 4;
      
      // Earnings column - right aligned amounts
      doc.text(this.formatCurrency(calc.basicSalary), 55, yPosition, { align: 'right' });
      doc.text('1.00', 75, yPosition, { align: 'right' });
      yPosition += 4;
      
      // Deductions column (aligned with earnings)
      let deductY = startY + 8;
      doc.text('APWCS', 90, deductY);
      doc.text('0.00', 135, deductY, { align: 'right' });
      doc.text((emp.department || 'Department 1'), 165, deductY);
      deductY += 4;
      
      doc.text('Zimdef', 90, deductY);
      doc.text('0.00', 135, deductY, { align: 'right' });
      doc.text(this.formatCurrency(calc.zimdef || 0), 190, deductY, { align: 'right' });
      deductY += 4;
      
      doc.text('SDF LEVY', 90, deductY);
      doc.text('0.00', 135, deductY, { align: 'right' });
      doc.text(this.formatCurrency(0), 190, deductY, { align: 'right' });
      deductY += 4;
      
      doc.text('NSSA', 90, deductY);
      doc.text(`-${this.formatCurrency(calc.nssaEmployee)}`, 135, deductY, { align: 'right' });
      doc.text(this.formatCurrency(calc.nssaEmployer), 190, deductY, { align: 'right' });
      deductY += 4;
      
      doc.text('PAYE Calculated', 90, deductY);
      doc.text(`-${this.formatCurrency(calc.paye)}`, 135, deductY, { align: 'right' });
      doc.text('0.00', 190, deductY, { align: 'right' });
      deductY += 4;
      
      doc.text('Tax Levy', 90, deductY);
      doc.text(`-${this.formatCurrency(calc.aidsLevy)}`, 135, deductY, { align: 'right' });
      doc.text('0.00', 190, deductY, { align: 'right' });
      deductY += 4;
      
      doc.text('Net Paid', 90, deductY);
      doc.text(this.formatCurrency(calc.netSalary), 135, deductY, { align: 'right' });
      doc.text('0.00', 190, deductY, { align: 'right' });
      
      // Totals line
      yPosition = Math.max(yPosition, deductY) + 4;
      doc.setFont('helvetica', 'bold');
      doc.text(this.formatCurrency(calc.basicSalary), 55, yPosition, { align: 'right' });
      doc.text(this.formatCurrency(calc.basicSalary), 135, yPosition, { align: 'right' });
      const employerTotal = (calc.nssaEmployer || 0) + (calc.zimdef || 0);
      doc.text(this.formatCurrency(employerTotal), 190, yPosition, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      yPosition += 8;
    });
    
    // PAGE 3: Grand Totals
    doc.addPage();
    addHeader(3);
    yPosition = 65;
    
    // Headers
    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS', 20, yPosition);
    doc.text('AMOUNT', 55, yPosition, { align: 'right' });
    doc.text('UNITS', 75, yPosition, { align: 'right' });
    doc.text('DEDUCTIONS', 90, yPosition);
    doc.text('AMOUNT', 135, yPosition, { align: 'right' });
    doc.text('UNITS', 155, yPosition, { align: 'right' });
    doc.text('EMPLOYER', 165, yPosition);
    doc.text('CONTRIBUTIONS', 165, yPosition + 4);
    yPosition += 12;
    
    // Grand totals section
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTALS', 90, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Basic', 20, yPosition);
    doc.text(this.formatCurrency(totals.totalBasicSalary), 55, yPosition, { align: 'right' });
    doc.text(batchResults.length.toFixed(2), 75, yPosition, { align: 'right' });
    
    doc.text('Leave Days Taken', 90, yPosition);
    doc.text('0.00', 135, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('APWCS', 90, yPosition);
    doc.text(this.formatCurrency(totals.totalAPWCS), 135, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('Zimdef', 90, yPosition);
    doc.text(this.formatCurrency(totals.totalZimdef), 135, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('SDF LEVY', 90, yPosition);
    doc.text(this.formatCurrency(0), 135, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('NSSA', 90, yPosition);
    doc.text(`-${this.formatCurrency(totals.totalNSSAEmployee)}`, 135, yPosition, { align: 'right' });
    doc.text(this.formatCurrency(totals.totalNSSAEmployer), 190, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('PAYE Calculated', 90, yPosition);
    doc.text(`-${this.formatCurrency(totals.totalPAYE)}`, 135, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('Tax Levy', 90, yPosition);
    doc.text(`-${this.formatCurrency(totals.totalAidsLevy)}`, 135, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.text('Net Paid', 90, yPosition);
    doc.text(this.formatCurrency(totals.totalNet), 135, yPosition, { align: 'right' });
    yPosition += 8;
    
    // Final totals
    doc.setFont('helvetica', 'bold');
    doc.text(this.formatCurrency(totals.totalBasicSalary), 55, yPosition, { align: 'right' });
    doc.text(this.formatCurrency(totals.totalBasicSalary), 135, yPosition, { align: 'right' });
    const totalEmployerContrib = totals.totalNSSAEmployer + totals.totalZimdef;
    doc.text(this.formatCurrency(totalEmployerContrib), 190, yPosition, { align: 'right' });
    
    yPosition += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(`TOTAL EMPLOYEES: ${batchResults.length}`, 90, yPosition);
    yPosition += 10;
    doc.text('END OF REPORT...', 90, yPosition);
    
    // Signature lines
    yPosition = pageHeight - 40;
    doc.text('Checked By: ___________________', 50, yPosition);
    doc.text('Authorised By: ___________________', 120, yPosition);
    yPosition += 10;
    doc.text('Date: ___________________', 50, yPosition);
    doc.text('Date: ___________________', 120, yPosition);
    
    return doc.output('blob');
  }

  /**
   * Generate NSSA Form P4 (Monthly Payment Schedule)
   */
  async generateNSSAFormP4(batchResults, payPeriod, jsPDF, autoTable, taxculLogoBase64) {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let yPosition = 20;
    
    // TaxCul logo (bottom left corner) - SMALL and subtle
    if (taxculLogoBase64) {
      try {
        doc.addImage(taxculLogoBase64, 'PNG', 10, pageHeight - 18, 10, 10);
      } catch (error) {
        console.log('TaxCul logo could not be added:', error);
      }
    }
    
    // Header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('FORM P4', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.text('Monthly Payment Schedule of Employees', 20, yPosition);
    
    // NSSA Logo (center)
    // Note: You would need to add the NSSA logo image
    doc.setFontSize(12);
    doc.text('NSSA', pageWidth / 2, 25, { align: 'center' });
    
    // Right side info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('National Social Security Authority', pageWidth - 20, 20, { align: 'right' });
    doc.text('Selous Ave/Sam Nujoma', pageWidth - 20, 25, { align: 'right' });
    doc.text('P.O Box CY 1387', pageWidth - 20, 30, { align: 'right' });
    doc.text('Causeway', pageWidth - 20, 35, { align: 'right' });
    doc.text('Harare', pageWidth - 20, 40, { align: 'right' });
    doc.text('Tel: 706523-5', pageWidth - 20, 45, { align: 'right' });
    
    yPosition = 55;
    
    // Employer details - Fixed positioning to prevent overlap
    doc.setFont('helvetica', 'bold');
    doc.text('Employer SSR No.', 20, yPosition);
    doc.text('_______________', 60, yPosition);
    doc.text('Payment Month and Year', pageWidth - 100, yPosition);
    doc.text(`${payPeriod}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Employer E.C`, 20, yPosition);
    doc.text('_______________', 60, yPosition);
    doc.text('I.C', 100, yPosition);
    doc.text('_______________', 115, yPosition);
    doc.text('Sector', pageWidth - 100, yPosition);
    doc.text('_______________', pageWidth - 70, yPosition);
    yPosition += 6;
    
    doc.text(`Employer's Name`, 20, yPosition);
    doc.text(this.companyData.companyName || '_______________', 70, yPosition);
    yPosition += 6;
    
    doc.text('Email Address', 20, yPosition);
    doc.text(this.companyData.companyEmail || '_______________', 70, yPosition);
    yPosition += 6;
    
    doc.text(`Employer's Physical Address`, 20, yPosition);
    doc.text(this.companyData.companyAddress || '_______________', 70, yPosition);
    yPosition += 6;
    
    doc.text('Contact Telephone No', 20, yPosition);
    doc.text(this.companyData.companyPhone || '_______________', 70, yPosition);
    yPosition += 10;
    
    doc.setFontSize(8);
    doc.text('Reason for Cessation - Insert C if Casual Employee, R for Retirement, D for Death, O for any other reason for cessation', 20, yPosition);
    yPosition += 5;
    doc.text('Nature of Employment - Insert A if Arduous Employment and N for Normal Employment', 20, yPosition);
    yPosition += 5;
    doc.text('* Sector e.g misting, agricultural, commercial, tourism, transport, manufacturing', 20, yPosition);
    yPosition += 10;
    
    // Employee table
    const tableData = batchResults.map((emp, index) => {
      const calc = emp.calculation;
      return [
        (index + 1).toString().padStart(3, '0'),
        emp.employeeNumber || 'N/A',
        emp.nationalId || 'N/A',
        '2026/01',
        emp.dateOfBirth || 'N/A',
        (emp.employeeName || 'N/A').split(' ')[0] || '',
        (emp.employeeName || 'N/A').split(' ').slice(1).join(' ') || '',
        emp.commencementDate || '01.09.2015',
        '',
        '',
        '',
        '',
        this.formatCurrency(calc.grossSalary),
        this.formatCurrency(calc.nssaEmployer),
        this.formatCurrency(calc.basicSalary)
      ];
    });
    
    // Add totals row
    const totals = this.calculateTotals(batchResults);
    tableData.push([
      { content: 'TOTALS', colSpan: 12, styles: { fontStyle: 'bold', halign: 'right' } },
      this.formatCurrency(totals.totalGross),
      this.formatCurrency(totals.totalNSSAEmployer),
      this.formatCurrency(totals.totalBasicSalary)
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [[
        'Employee\nStaff No',
        'SSN',
        'National\nID No',
        'Period',
        'Date of\nBirth',
        'Surname',
        'Firstname',
        'Commencement\nDate',
        'Cessation\nDate',
        'Reason for\nCessation',
        'Nature of\nEmployment',
        'POBS\nInsurable\nEarnings',
        'Total POBS (8%)\nContribution\nthis Month',
        'Basic Salary\n(APWCS) Ext\nAllowances'
      ]],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.1, lineColor: 0 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 18 },
        4: { cellWidth: 18 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 22 },
        8: { cellWidth: 18 },
        9: { cellWidth: 15 },
        10: { cellWidth: 15 },
        11: { cellWidth: 20, halign: 'right' },
        12: { cellWidth: 20, halign: 'right' },
        13: { cellWidth: 20, halign: 'right' }
      },
      margin: { left: 10, right: 10 }
    });
    
    // Navy blue border around page 1
    doc.setDrawColor(15, 47, 78); // Navy blue
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    
    // Page 2: Summary and signature
    doc.addPage();
    yPosition = 20;
    
    // Summary box
    const summaryY = yPosition;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    autoTable(doc, {
      startY: summaryY,
      body: [
        ['TOTAL NO OF EMPLOYEES - APWCS', batchResults.length.toString()],
        ['TOTAL NO OF EMPLOYEES - POBS', batchResults.length.toString()],
        ['TOTAL APWCS INSURANCE EARNINGS', this.formatCurrency(totals.totalBasicSalary)],
        ['TOTAL POBS INSURANCE EARNINGS', this.formatCurrency(totals.totalGross)]
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 100, fontStyle: 'bold' },
        1: { cellWidth: 50, halign: 'right' }
      },
      margin: { left: pageWidth - 160, right: 20 }
    });
    
    // Signature section
    yPosition = pageHeight - 60;
    doc.text('Employer', 20, yPosition);
    doc.text('Designation:', 80, yPosition);
    doc.text('Date:', 160, yPosition);
    doc.text('Official Stamp:', 220, yPosition);
    doc.text('Representative:', 20, yPosition + 6);
    
    doc.rect(215, yPosition - 10, 60, 40);
    
    yPosition += 20;
    doc.setFontSize(8);
    doc.text('NOTE: Use the National I.D. to identify employees pending the issue of Social Security Numbers.', 20, yPosition);
    yPosition += 5;
    doc.text('The information given in this form may be used for the purposes of other Schemes administered by NSSA.', 20, yPosition);
    
    // TaxCul branding at bottom
    yPosition += 10;
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by TaxCul - Payroll Management System', 20, yPosition);
    
    // Navy blue border around page 2
    doc.setDrawColor(15, 47, 78); // Navy blue
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    
    return doc.output('blob');
  }

  /**
   * Generate PAYE Report
   */
  async generatePAYEReport(batchResults, payPeriod, jsPDF, autoTable, taxculLogoBase64) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    let yPosition = 20;
    
    // TaxCul logo (top right) - SMALL and subtle
    if (taxculLogoBase64) {
      try {
        doc.addImage(taxculLogoBase64, 'PNG', pageWidth - 20, 10, 10, 10);
      } catch (error) {
        console.log('TaxCul logo could not be added:', error);
      }
    }
    
    // Company logo (top left, if available)
    if (this.companyData.companyLogo) {
      try {
        doc.addImage(this.companyData.companyLogo, 'PNG', 20, 10, 20, 20);
      } catch (error) {
        console.log('Company logo could not be added');
      }
    }
    
    // Title
    doc.setTextColor(15, 47, 78); // Navy blue #0F2F4E
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYE REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    // Company name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(this.companyData.companyName || 'Company Name', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Date and period info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`DATE: ${dateStr}`, 20, yPosition);
    doc.text(`US$`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text(`TIME: ${timeStr}`, 20, yPosition);
    yPosition += 5;
    doc.text(`START PERIOD: ${payPeriod}`, 20, yPosition);
    yPosition += 5;
    doc.text(`END PERIOD: ${payPeriod}`, 20, yPosition);
    yPosition += 15;
    
    // Table
    const tableData = batchResults.map((emp, index) => {
      const calc = emp.calculation;
      return [
        (index + 1).toString().padStart(3, '0'),
        emp.employeeName || 'N/A',
        'P A Y E',
        this.formatCurrency(calc.paye),
        this.formatCurrency(calc.aidsLevy),
        '0.00',
        this.formatCurrency(calc.paye + calc.aidsLevy)
      ];
    });
    
    // Calculate totals
    const totals = this.calculateTotals(batchResults);
    const totalDeductions = totals.totalPAYE + totals.totalAidsLevy;
    
    tableData.push([
      { content: '', colSpan: 3, styles: { fontStyle: 'bold' } },
      this.formatCurrency(totals.totalPAYE),
      this.formatCurrency(totals.totalAidsLevy),
      '0.00',
      this.formatCurrency(totalDeductions)
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [[
        'CODE',
        'NAME',
        'TAXATION METHOD',
        'PAYE\nAMOUNT',
        'TAX LEVY\nAMOUNT',
        'TAX\nADJUSTMENT',
        'TOTAL\nDEDUCTION'
      ]],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 22, halign: 'right' },
        4: { cellWidth: 22, halign: 'right' },
        5: { cellWidth: 22, halign: 'right' },
        6: { cellWidth: 24, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      tableWidth: 'auto',
      didParseCell: function(data) {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
    
    // Summary
    doc.setFont('helvetica', 'normal');
    doc.text(`TOTAL EMPLOYEES: ${batchResults.length} of ${batchResults.length}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    doc.text('END OF REPORT...', pageWidth / 2, yPosition, { align: 'center' });
    
    // Signature lines
    yPosition = pageHeight - 40;
    doc.text('Checked By: ___________________', 50, yPosition);
    doc.text('Authorised By: ___________________', 120, yPosition);
    yPosition += 10;
    doc.text('Date: ___________________', 50, yPosition);
    doc.text('Date: ___________________', 120, yPosition);
    
    // Footer
    doc.setFontSize(8);
    doc.text('Generated by TAXCUL', 20, pageHeight - 10);
    doc.text(`Printed by: ${this.companyData.companyName || 'Company Name'}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - 20, pageHeight - 10, { align: 'right' });
    
    // Navy blue border around the page
    doc.setDrawColor(15, 47, 78); // Navy blue
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    
    return doc.output('blob');
  }

  /**
   * Helper: Calculate totals from batch results
   */
  calculateTotals(batchResults) {
    return batchResults.reduce((acc, emp) => {
      const calc = emp.calculation;
      return {
        totalBasicSalary: acc.totalBasicSalary + (calc.basicSalary || 0),
        totalAllowances: acc.totalAllowances + (calc.totalAllowances || 0),
        totalGross: acc.totalGross + (calc.grossSalary || 0),
        totalNSSAEmployee: acc.totalNSSAEmployee + (calc.nssaEmployee || 0),
        totalNSSAEmployer: acc.totalNSSAEmployer + (calc.nssaEmployer || 0),
        totalPAYE: acc.totalPAYE + (calc.paye || 0),
        totalAidsLevy: acc.totalAidsLevy + (calc.aidsLevy || 0),
        totalNet: acc.totalNet + (calc.netSalary || 0),
        totalZimdef: acc.totalZimdef + (calc.zimdef || 0),
        totalAPWCS: acc.totalAPWCS + (calc.apwc || 0),
        totalEmployerCost: acc.totalEmployerCost + (calc.totalCostToEmployer || 0)
      };
    }, {
      totalBasicSalary: 0,
      totalAllowances: 0,
      totalGross: 0,
      totalNSSAEmployee: 0,
      totalNSSAEmployer: 0,
      totalPAYE: 0,
      totalAidsLevy: 0,
      totalNet: 0,
      totalZimdef: 0,
      totalAPWCS: 0,
      totalEmployerCost: 0
    });
  }
}
