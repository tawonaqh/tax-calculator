import Dashboard from '@/components/Dashboard/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Dashboard - Zimbabwe Tax Calculator',
  description: 'Manage your payroll, employees, and company information.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
