'use client'

import React, { useState, useEffect } from 'react';
import { payrollApi, employeeApi, companyApi } from '@/lib/payrollApi';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const CalculationHistory = () => {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCalculations();
    fetchEmployees();
    fetchCompanies();
  }, []);

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const response = await payrollApi.getAll({
        employee_id: filterEmployee,
        company_id: filterCompany,
        month: filterMonth,
        year: filterYear
      });
      setCalculations(response.data);
    } catch (err) {
      setError('Failed to load calculations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyApi.getAll();
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [filterEmployee, filterCompany, filterMonth, filterYear]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this calculation?')) return;

    try {
      await payrollApi.delete(id);
      setSuccess('Calculation deleted successfully');
      fetchCalculations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete calculation');
    }
  };

  const viewDetails = (calculation) => {
    setSelectedCalculation(calculation);
    setShowDetailsModal(true);
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(month) - 1] || '';
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-2">Payroll History</h1>
            <p className="text-white/80 text-xl">View and manage your payroll calculations</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-xl shadow-md flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-xl shadow-md flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#1ED760] to-[#17b34f] p-3 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0F2F4E]">Search & Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] transition-all"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] transition-all"
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>

            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <Link
              href="/simple-payroll"
              className="px-6 py-3 bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white rounded-lg hover:shadow-lg transition-all font-semibold text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Calculation
            </Link>
          </div>
        </div>

        {/* Calculations List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1ED760] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading calculations...</p>
            </div>
          ) : calculations.length === 0 ? (
            <div className="p-20 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No calculations found</h3>
              <p className="text-gray-500 mb-6 text-lg">Start by creating your first payroll calculation</p>
              <Link
                href="/simple-payroll"
                className="inline-block px-10 py-4 bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg transform hover:-translate-y-1"
              >
                Create Your First Calculation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0F2F4E] to-[#1a4d6d] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Period</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Gross Salary</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">PAYE</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">NSSA</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Net Salary</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calculations.map((calc) => (
                    <tr key={calc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {getMonthName(calc.month)} {calc.year}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {calc.employee ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#1ED760] to-[#17b34f] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {calc.employee.first_name?.[0]}{calc.employee.last_name?.[0]}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {calc.employee.first_name} {calc.employee.last_name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {calc.company?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                        ${formatCurrency(calc.gross_salary)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">
                        ${formatCurrency(calc.paye)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">
                        ${formatCurrency(calc.nssa_employee)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right text-[#1ED760]">
                        ${formatCurrency(calc.net_salary)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewDetails(calc)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(calc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedCalculation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#0F2F4E] to-[#1a4d6d] text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Calculation Details</h2>
                  <p className="text-gray-200 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {getMonthName(selectedCalculation.month)} {selectedCalculation.year}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-[#0F2F4E] mb-4 flex items-center gap-2 text-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Employee Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <span className="text-sm text-gray-600 font-medium">Name</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedCalculation.employee 
                        ? `${selectedCalculation.employee.first_name} ${selectedCalculation.employee.last_name}`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <span className="text-sm text-gray-600 font-medium">Company</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedCalculation.company?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-[#0F2F4E] mb-4 flex items-center gap-2 text-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Earnings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <span className="text-gray-700 font-medium">Basic Salary</span>
                    <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.basic_salary)}</span>
                  </div>
                  {selectedCalculation.allowances && parseFloat(selectedCalculation.allowances) > 0 && (
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-700 font-medium">Allowances</span>
                      <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.allowances)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-green-600 text-white rounded-lg p-4 mt-4">
                    <span className="font-bold text-lg">Gross Salary</span>
                    <span className="font-bold text-xl">${formatCurrency(selectedCalculation.gross_salary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-[#0F2F4E] mb-4 flex items-center gap-2 text-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  Deductions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <span className="text-gray-700 font-medium">PAYE</span>
                    <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.paye)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <span className="text-gray-700 font-medium">AIDS Levy</span>
                    <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.aids_levy)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <span className="text-gray-700 font-medium">NSSA (Employee)</span>
                    <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.nssa_employee)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-red-600 text-white rounded-lg p-4 mt-4">
                    <span className="font-bold text-lg">Total Deductions</span>
                    <span className="font-bold text-xl">
                      ${formatCurrency(
                        parseFloat(selectedCalculation.paye || 0) +
                        parseFloat(selectedCalculation.aids_levy || 0) +
                        parseFloat(selectedCalculation.nssa_employee || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-[#1ED760] to-[#17b34f] rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-1">Net Salary (Take Home)</p>
                    <p className="text-4xl font-bold">
                      ${formatCurrency(selectedCalculation.net_salary)}
                    </p>
                  </div>
                  <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Employer Contributions */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-[#0F2F4E] mb-4 flex items-center gap-2 text-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Employer Contributions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <span className="text-gray-700 font-medium">NSSA (Employer)</span>
                    <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.nssa_employer)}</span>
                  </div>
                  {selectedCalculation.other_employer_contributions && parseFloat(selectedCalculation.other_employer_contributions) > 0 && (
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-700 font-medium">Other Contributions</span>
                      <span className="font-semibold text-gray-900">${formatCurrency(selectedCalculation.other_employer_contributions)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-blue-600 text-white rounded-lg p-4 mt-4">
                    <span className="font-bold text-lg">Total Cost to Employer</span>
                    <span className="font-bold text-xl">${formatCurrency(selectedCalculation.total_cost_to_employer)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CalculationHistory;
