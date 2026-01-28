// Tutorial steps removed to prevent grey overlay issues

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