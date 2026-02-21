'use client'

import { BatchReportGenerator } from './BatchReportGenerator';

// PDF Generation utilities for PAYE Calculator
export class PDFGenerator {
  constructor(companyData, formatCurrency) {
    this.companyData = companyData;
    this.formatCurrency = formatCurrency;
    this.batchReportGenerator = new BatchReportGenerator(companyData, formatCurrency);
  }

  // Generate batch payslips as ZIP file using beautiful HTML design
  async generateBatchPayslips(batchResults, setIsGeneratingPayslips, setPayslipProgress) {
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
        const { element: payslipElement, container: tempContainer } = this.generateEmployeePayslipHTML(emp, payPeriod);
        
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
        
        // Clean up temporary element - remove the container, not the child
        if (tempContainer && tempContainer.parentNode) {
          tempContainer.parentNode.removeChild(tempContainer);
        }
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
  }

  // Generate HTML payslip for individual employee (for batch processing)
  generateEmployeePayslipHTML(emp, payPeriod) {
    const payslipContent = `
      <div style="background: white; padding: 40px; width: 800px; margin: 0 auto; font-family: Arial, sans-serif; box-sizing: border-box; min-height: 600px; display: flex; flex-direction: column;">
        <!-- Header with Company Branding -->
        <div style="margin-bottom: 24px; border-bottom: 2px solid #0F2F4E; padding-bottom: 16px;">
          ${(this.companyData.companyName || this.companyData.companyLogo) ? `
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              ${this.companyData.companyLogo ? `
                <div style="width: 80px; height: 80px; flex-shrink: 0;">
                  <img src="${this.companyData.companyLogo}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
              ` : ''}
              <div style="flex: 1;">
                ${this.companyData.companyName ? `
                  <h3 style="font-size: 20px; font-weight: bold; color: #0F2F4E; margin: 0 0 8px 0;">${this.companyData.companyName}</h3>
                ` : ''}
                <div style="font-size: 14px; color: #333;">
                  ${this.companyData.companyAddress ? `<p style="margin: 0 0 4px 0; color: #333;">${this.companyData.companyAddress}</p>` : ''}
                  <div style="display: flex; gap: 16px;">
                    ${this.companyData.companyPhone ? `<span style="color: #333;">Tel: ${this.companyData.companyPhone}</span>` : ''}
                    ${this.companyData.companyEmail ? `<span style="color: #333;">Email: ${this.companyData.companyEmail}</span>` : ''}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Payslip Title -->
          <div style="text-align: center;">
            <h2 style="font-size: 32px; font-weight: bold; color: #0F2F4E; margin: 0;">PAYSLIP</h2>
            <p style="font-size: 16px; color: #333; margin: 4px 0 0 0;">Pay Period: ${payPeriod}</p>
          </div>
        </div>

        <!-- Employee Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          <div>
            <p style="margin: 0 0 8px 0; color: #000;"><strong>Employee Name:</strong> ${emp.employeeName || 'N/A'}</p>
            <p style="margin: 0 0 8px 0; color: #000;"><strong>Employee Number:</strong> ${emp.employeeNumber || 'N/A'}</p>
          </div>
          <div>
            <p style="margin: 0 0 8px 0; color: #000;"><strong>Department:</strong> ${emp.department || 'N/A'}</p>
            <p style="margin: 0 0 8px 0; color: #000;"><strong>Position:</strong> ${emp.position || 'N/A'}</p>
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
              <h4 style="font-weight: 600; color: #000; margin: 0 0 8px 0;">EARNINGS</h4>
              <div style="font-size: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #000;">
                  <span>Basic Salary:</span>
                  <span style="font-weight: 500;">${this.formatCurrency(emp.calculation.basicSalary)}</span>
                </div>
                
                ${emp.calculation.allowances.living > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Living Allow.:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.living)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.medical > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Medical Allow.:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.medical)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.transport > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Transport Allow.:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.transport)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.housing > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Housing Allow.:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.housing)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.commission > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Commission:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.commission)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.bonus > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Bonus:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.bonus)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.allowances.overtime > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #000;">
                    <span>Overtime:</span>
                    <span>${this.formatCurrency(emp.calculation.allowances.overtime)}</span>
                  </div>
                ` : ''}
                
                ${emp.calculation.totalAllowances > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; border-top: 1px solid #eee; padding-top: 4px; color: #000;">
                    <span>Total Allowances:</span>
                    <span>${this.formatCurrency(emp.calculation.totalAllowances)}</span>
                  </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #ddd; padding-top: 4px; margin-top: 8px; color: #000;">
                  <span>Gross Salary:</span>
                  <span>${this.formatCurrency(emp.calculation.grossSalary)}</span>
                </div>
              </div>
            </div>
            
            <!-- Deductions -->
            <div>
              <h4 style="font-weight: 600; color: #000; margin: 0 0 8px 0;">DEDUCTIONS</h4>
              <div style="font-size: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #000;">
                  <span>NSSA (4.5%):</span>
                  <span>(${this.formatCurrency(emp.calculation.nssaEmployee)})</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #000;">
                  <span>PAYE:</span>
                  <span>(${this.formatCurrency(emp.calculation.paye)})</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #000;">
                  <span>AIDS Levy (3%):</span>
                  <span>(${this.formatCurrency(emp.calculation.aidsLevy)})</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #ddd; padding-top: 4px; margin-top: 8px; color: #000;">
                  <span>Total Deductions:</span>
                  <span>(${this.formatCurrency((emp.calculation.nssaEmployee || 0) + (emp.calculation.totalTax || 0))})</span>
                </div>
              </div>
            </div>
            
            <!-- Net Pay -->
            <div>
              <h4 style="font-weight: 600; color: #000; margin: 0 0 8px 0;">NET PAY</h4>
              <div style="background: rgba(30, 215, 96, 0.1); padding: 12px; border-radius: 8px; border: 1px solid #1ED760;">
                <div style="text-align: center;">
                  <p style="font-size: 14px; color: #000; margin: 0 0 4px 0;">Net Salary</p>
                  <p style="font-size: 20px; font-weight: bold; color: #1ED760; margin: 0;">
                    ${this.formatCurrency(emp.calculation.netSalary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #333;">
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
    
    return {
      element: tempDiv.firstElementChild,
      container: tempDiv
    };
  }

  // Generate comprehensive payroll reports for batch processing
  generatePayrollReports(batchResults) {
    if (batchResults.length === 0) {
      alert('No payroll data available. Please calculate batch payroll first.');
      return;
    }

    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then((module) => {
        // Get the default export which is the autoTable function
        const autoTable = module.default;
        
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for better table fit
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
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
            totalNet: acc.totalNet + calc.netSalary,
            totalEmployerCost: acc.totalEmployerCost + calc.totalCostToEmployer
          };
        }, {
          totalBasicSalary: 0, totalAllowances: 0, totalGross: 0,
          totalNSSAEmployee: 0, totalNSSAEmployer: 0, totalPAYE: 0,
          totalAidsLevy: 0, totalNet: 0, totalEmployerCost: 0
        });

        // PAGE 1: HEADER & SUMMARY
        let yPosition = 20;
        
        // Header with company branding
        doc.setFillColor(15, 47, 78);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Company logo
        if (this.companyData.companyLogo) {
          try {
            doc.addImage(this.companyData.companyLogo, 'PNG', 15, 10, 25, 20);
          } catch (error) {
            console.log('Logo could not be added');
          }
        }
        
        // Company info
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        const companyX = this.companyData.companyLogo ? 45 : 20;
        if (this.companyData.companyName) {
          doc.text(this.companyData.companyName, companyX, 18);
        }
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        if (this.companyData.companyAddress) {
          doc.text(this.companyData.companyAddress, companyX, 25);
        }
        if (this.companyData.companyPhone || this.companyData.companyEmail) {
          const contact = [this.companyData.companyPhone, this.companyData.companyEmail].filter(Boolean).join(' | ');
          doc.text(contact, companyX, 31);
        }
        
        // Report title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYROLL REPORT', pageWidth - 20, 18, { align: 'right' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Period: ${payPeriod}`, pageWidth - 20, 26, { align: 'right' });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, 32, { align: 'right' });
        
        yPosition = 50;
        
        // Summary section
        doc.setTextColor(15, 47, 78);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYROLL SUMMARY', 20, yPosition);
        yPosition += 10;
        
        // Summary table
        autoTable(doc, {
          startY: yPosition,
          head: [['Description', 'Amount (USD)']],
          body: [
            ['Total Employees', batchResults.length.toString()],
            ['Total Basic Salary', this.formatCurrency(totals.totalBasicSalary)],
            ['Total Allowances', this.formatCurrency(totals.totalAllowances)],
            ['Total Gross Salary', this.formatCurrency(totals.totalGross)],
            ['Total NSSA (Employee)', this.formatCurrency(totals.totalNSSAEmployee)],
            ['Total PAYE', this.formatCurrency(totals.totalPAYE)],
            ['Total AIDS Levy', this.formatCurrency(totals.totalAidsLevy)],
            ['Total Net Salary', this.formatCurrency(totals.totalNet)],
            ['Total NSSA (Employer)', this.formatCurrency(totals.totalNSSAEmployer)],
            ['Total Employer Cost', this.formatCurrency(totals.totalEmployerCost)]
          ],
          theme: 'grid',
          headStyles: { fillColor: [15, 47, 78], textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 10, cellPadding: 3 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { halign: 'right', cellWidth: 50 }
          },
          margin: { left: 20, right: 20 }
        });
        
        // PAGE 2: DETAILED EMPLOYEE BREAKDOWN
        doc.addPage();
        yPosition = 20;
        
        doc.setTextColor(15, 47, 78);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EMPLOYEE PAYROLL DETAILS', 20, yPosition);
        yPosition += 10;
        
        // Prepare employee data for table
        const employeeData = batchResults.map(emp => {
          const calc = emp.calculation;
          return [
            emp.employeeName || 'N/A',
            emp.employeeNumber || 'N/A',
            this.formatCurrency(calc.basicSalary),
            this.formatCurrency(calc.totalAllowances || 0),
            this.formatCurrency(calc.grossSalary),
            this.formatCurrency(calc.nssaEmployee),
            this.formatCurrency(calc.paye),
            this.formatCurrency(calc.aidsLevy),
            this.formatCurrency(calc.netSalary)
          ];
        });
        
        // Add totals row
        employeeData.push([
          { content: 'TOTAL', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
          this.formatCurrency(totals.totalBasicSalary),
          this.formatCurrency(totals.totalAllowances),
          this.formatCurrency(totals.totalGross),
          this.formatCurrency(totals.totalNSSAEmployee),
          this.formatCurrency(totals.totalPAYE),
          this.formatCurrency(totals.totalAidsLevy),
          this.formatCurrency(totals.totalNet)
        ]);
        
        // Employee details table
        autoTable(doc, {
          startY: yPosition,
          head: [[
            'Employee Name',
            'Emp #',
            'Basic Salary',
            'Allowances',
            'Gross',
            'NSSA',
            'PAYE',
            'AIDS Levy',
            'Net Salary'
          ]],
          body: employeeData,
          theme: 'striped',
          headStyles: { 
            fillColor: [15, 47, 78], 
            textColor: 255, 
            fontStyle: 'bold',
            fontSize: 9
          },
          styles: { 
            fontSize: 8, 
            cellPadding: 2,
            overflow: 'linebreak'
          },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 25, halign: 'right' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 20, halign: 'right' },
            6: { cellWidth: 20, halign: 'right' },
            7: { cellWidth: 22, halign: 'right' },
            8: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }
          },
          margin: { left: 10, right: 10 },
          didParseCell: function(data) {
            // Make totals row bold
            if (data.row.index === employeeData.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 240, 240];
            }
          }
        });
        
        // PAGE 3: EMPLOYER CONTRIBUTIONS
        doc.addPage();
        yPosition = 20;
        
        doc.setTextColor(15, 47, 78);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EMPLOYER CONTRIBUTIONS', 20, yPosition);
        yPosition += 10;
        
        // Employer contributions data
        const employerData = batchResults.map(emp => {
          const calc = emp.calculation;
          return [
            emp.employeeName || 'N/A',
            emp.employeeNumber || 'N/A',
            this.formatCurrency(calc.grossSalary),
            this.formatCurrency(calc.nssaEmployer),
            this.formatCurrency(calc.zimdef || 0),
            this.formatCurrency(calc.apwc || 0),
            this.formatCurrency(calc.totalEmployerContributions || 0),
            this.formatCurrency(calc.totalCostToEmployer)
          ];
        });
        
        // Add totals
        const totalZimdef = batchResults.reduce((sum, emp) => sum + (emp.calculation.zimdef || 0), 0);
        const totalApwc = batchResults.reduce((sum, emp) => sum + (emp.calculation.apwc || 0), 0);
        const totalEmployerContrib = batchResults.reduce((sum, emp) => sum + (emp.calculation.totalEmployerContributions || 0), 0);
        
        employerData.push([
          { content: 'TOTAL', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
          this.formatCurrency(totals.totalGross),
          this.formatCurrency(totals.totalNSSAEmployer),
          this.formatCurrency(totalZimdef),
          this.formatCurrency(totalApwc),
          this.formatCurrency(totalEmployerContrib),
          this.formatCurrency(totals.totalEmployerCost)
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [[
            'Employee Name',
            'Emp #',
            'Gross Salary',
            'NSSA (4.5%)',
            'ZIMDEF (1%)',
            'APWC',
            'Total Contrib.',
            'Total Cost'
          ]],
          body: employerData,
          theme: 'striped',
          headStyles: { 
            fillColor: [15, 47, 78], 
            textColor: 255, 
            fontStyle: 'bold',
            fontSize: 9
          },
          styles: { 
            fontSize: 8, 
            cellPadding: 2 
          },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 28, halign: 'right' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 20, halign: 'right' },
            6: { cellWidth: 28, halign: 'right' },
            7: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
          },
          margin: { left: 10, right: 10 },
          didParseCell: function(data) {
            if (data.row.index === employerData.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 240, 240];
            }
          }
        });
        
        // Add footer to all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
          doc.text(
            'This report is computer generated and confidential',
            pageWidth / 2,
            pageHeight - 5,
            { align: 'center' }
          );
        }
        
        // Save the report
        doc.save(`Payroll-Report-${payPeriod.replace(' ', '-')}-${batchResults.length}-Employees.pdf`);
      });
    }).catch(error => {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    });
  }

  // Generate beautiful PDF from HTML preview
  async generatePayslipPDF(formData) {
    const element = document.getElementById('payslip-preview');
    if (!element) {
      alert('Payslip preview not found. Please show the payslip first.');
      return;
    }

    try {
      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

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

      const canvas = await html2canvas.default(element, options);
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
    } catch (error) {
      console.error('Error generating canvas:', error);
      throw error; // Let the caller handle fallback
    }
  }

  // Generate classic PDF payslip
  async generateOriginalPayslipPDF(results, formData) {
    if (!results) return;
    
    const { jsPDF } = await import('jspdf');
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
    if (this.companyData.companyLogo) {
      try {
        const tempImg = document.createElement('img');
        tempImg.src = this.companyData.companyLogo;
        
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
          
          doc.addImage(this.companyData.companyLogo, 'JPEG', 15, 15, logoWidth, logoHeight);
        } else {
          doc.addImage(this.companyData.companyLogo, 'JPEG', 15, 15, 35, 18);
        }
      } catch (error) {
        console.log('Logo could not be added to PDF');
      }
    }
    
    // Company Information - Modern Layout
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    
    const companyStartX = this.companyData.companyLogo ? 55 : 20;
    
    if (this.companyData.companyName) {
      doc.text(this.companyData.companyName, companyStartX, 25);
    }
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    let companyInfoY = this.companyData.companyName ? 32 : 25;
    if (this.companyData.companyAddress) {
      doc.text(this.companyData.companyAddress, companyStartX, companyInfoY);
      companyInfoY += 4;
    }
    if (this.companyData.companyPhone || this.companyData.companyEmail) {
      const contactInfo = [
        this.companyData.companyPhone ? `Tel: ${this.companyData.companyPhone}` : '',
        this.companyData.companyEmail ? `Email: ${this.companyData.companyEmail}` : ''
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
    doc.text(this.formatCurrency(results.basicSalary || results.grossSalary), col1X + col1Width - 2, earningsY, { align: 'right' });
    earningsY += 5;
    
    // Add allowances if they exist
    if (results.allowances) {
      if (results.allowances.living > 0) {
        doc.text('Living Allow.:', col1X + 2, earningsY);
        doc.text(this.formatCurrency(results.allowances.living), col1X + col1Width - 2, earningsY, { align: 'right' });
        earningsY += 4;
      }
      if (results.allowances.medical > 0) {
        doc.text('Medical Allow.:', col1X + 2, earningsY);
        doc.text(this.formatCurrency(results.allowances.medical), col1X + col1Width - 2, earningsY, { align: 'right' });
        earningsY += 4;
      }
      if (results.allowances.transport > 0) {
        doc.text('Transport Allow.:', col1X + 2, earningsY);
        doc.text(this.formatCurrency(results.allowances.transport), col1X + col1Width - 2, earningsY, { align: 'right' });
        earningsY += 4;
      }
      if (results.allowances.bonus > 0) {
        doc.text('Bonus:', col1X + 2, earningsY);
        doc.text(this.formatCurrency(results.allowances.bonus), col1X + col1Width - 2, earningsY, { align: 'right' });
        earningsY += 4;
      }
    }
    
    // Gross Total with line
    doc.setFont('helvetica', 'bold');
    doc.setDrawColor(30, 215, 96);
    doc.line(col1X + 2, earningsY + 2, col1X + col1Width - 2, earningsY + 2);
    earningsY += 6;
    doc.text('GROSS TOTAL:', col1X + 2, earningsY);
    doc.text(this.formatCurrency(results.grossSalary), col1X + col1Width - 2, earningsY, { align: 'right' });
    
    // Deductions Column Content
    let deductionsY = yPosition;
    doc.setFont('helvetica', 'normal');
    
    doc.text('NSSA (4.5%):', col2X + 2, deductionsY);
    doc.text(this.formatCurrency(results.nssaEmployee), col2X + col2Width - 2, deductionsY, { align: 'right' });
    deductionsY += 5;
    
    doc.text('PAYE Tax:', col2X + 2, deductionsY);
    doc.text(this.formatCurrency(results.paye), col2X + col2Width - 2, deductionsY, { align: 'right' });
    deductionsY += 5;
    
    doc.text('AIDS Levy (3%):', col2X + 2, deductionsY);
    doc.text(this.formatCurrency(results.aidsLevy), col2X + col2Width - 2, deductionsY, { align: 'right' });
    deductionsY += 5;
    
    if (results.bonusTax && results.bonusTax > 0) {
      doc.text('Bonus Tax:', col2X + 2, deductionsY);
      doc.text(this.formatCurrency(results.bonusTax), col2X + col2Width - 2, deductionsY, { align: 'right' });
      deductionsY += 5;
    }
    
    // Total Deductions with line
    doc.setFont('helvetica', 'bold');
    doc.setDrawColor(239, 68, 68);
    doc.line(col2X + 2, deductionsY + 2, col2X + col2Width - 2, deductionsY + 2);
    deductionsY += 6;
    doc.text('TOTAL DEDUCTIONS:', col2X + 2, deductionsY);
    doc.text(this.formatCurrency((results.nssaEmployee || 0) + (results.totalTax || 0)), col2X + col2Width - 2, deductionsY, { align: 'right' });
    
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
    doc.text(this.formatCurrency(results.netSalary), col3X + col3Width / 2, netPayBoxY + 25, { align: 'center' });
    
    yPosition = Math.max(earningsY, deductionsY, netPayBoxY + netPayBoxHeight) + 15;
    
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
  }
}