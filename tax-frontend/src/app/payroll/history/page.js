'use client'

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CalculationHistory from '@/components/Payroll/CalculationHistory';

export default function PayrollHistoryPage() {
  return (
    <ProtectedRoute>
      <CalculationHistory />
    </ProtectedRoute>
  );
}
