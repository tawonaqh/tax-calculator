'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeManagement from '@/components/Employees/EmployeeManagement';

export default function EmployeesPage() {
  return (
    <ProtectedRoute>
      <EmployeeManagement />
    </ProtectedRoute>
  );
}
