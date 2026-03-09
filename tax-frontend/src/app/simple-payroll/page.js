import SimplePayroll from '@/modules/paye-calculator/components/SimplePayroll';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Simple Payroll - Zimbabwe Tax Calculator',
  description: 'Simple Payroll calculator for Zimbabwe SMEs. Non-FDS method with NSSA calculations and payslip generation.',
  keywords: 'Zimbabwe PAYE calculator, salary calculator, payslip generator, NSSA calculator, tax calculator Zimbabwe'
};

export default function SimplePayrollPage() {
  return (
    <ProtectedRoute>
      <SimplePayroll />
    </ProtectedRoute>
  );
}