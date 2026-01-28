export const tutorialSteps = [
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

export const samplePayrollData = [
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

export const loadSampleDataForDemo = () => {
  return samplePayrollData;
};