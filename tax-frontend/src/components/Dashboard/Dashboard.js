'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUsers, FaBuilding, FaCalculator, FaMoneyBillWave, FaPlus, FaHistory, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { payrollApi } from '@/lib/payrollApi';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await payrollApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1ED760] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-2">
              Welcome Back! 👋
            </h1>
            <p className="text-white/80 text-xl">
              Here's your payroll overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-[#1ED760] to-[#17b34f] p-4 rounded-xl shadow-lg">
                <FaUsers className="text-white text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Active</p>
                <p className="text-xs text-[#1ED760] font-semibold flex items-center gap-1 justify-end">
                  <FaArrowUp className="text-xs" />
                  100%
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Employees</p>
            <p className="text-4xl font-bold text-[#0F2F4E]">{stats?.total_employees || 0}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => router.push('/employees')}
                className="text-[#1ED760] hover:text-[#17b34f] text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                Manage Employees
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                <FaBuilding className="text-white text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Registered</p>
                <p className="text-xs text-blue-500 font-semibold">Active</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Companies</p>
            <p className="text-4xl font-bold text-[#0F2F4E]">{stats?.total_companies || 0}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => router.push('/company/profile')}
                className="text-blue-500 hover:text-blue-600 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                View Companies
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                <FaCalculator className="text-white text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">All Time</p>
                <p className="text-xs text-purple-500 font-semibold">{stats?.current_month_calculations || 0} this month</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Calculations</p>
            <p className="text-4xl font-bold text-[#0F2F4E]">{stats?.total_calculations || 0}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => router.push('/payroll/history')}
                className="text-purple-500 hover:text-purple-600 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                View History
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <FaMoneyBillWave className="text-white text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 font-medium">This Month</p>
                <p className="text-xs text-white font-semibold">{stats?.current_month_calculations || 0} calculations</p>
              </div>
            </div>
            <p className="text-sm text-white/90 font-semibold mb-1">Monthly Payroll</p>
            <p className="text-4xl font-bold text-white">
              {formatCurrency(stats?.current_month_payroll || 0)}
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <button
                onClick={() => router.push('/simple-payroll')}
                className="text-white hover:text-white/80 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                New Calculation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#1ED760] to-[#17b34f] p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#0F2F4E]">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/simple-payroll')}
              className="group relative overflow-hidden flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#1ED760] to-[#17b34f] text-white rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform z-10">
                <FaCalculator className="text-3xl" />
              </div>
              <div className="text-center z-10">
                <span className="font-bold text-lg block">New Calculation</span>
                <span className="text-sm text-white/80">Calculate payroll</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/employees')}
              className="group relative overflow-hidden flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform z-10">
                <FaPlus className="text-3xl" />
              </div>
              <div className="text-center z-10">
                <span className="font-bold text-lg block">Add Employee</span>
                <span className="text-sm text-white/80">Manage team</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/payroll/history')}
              className="group relative overflow-hidden flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform z-10">
                <FaHistory className="text-3xl" />
              </div>
              <div className="text-center z-10">
                <span className="font-bold text-lg block">View History</span>
                <span className="text-sm text-white/80">Past calculations</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/company/profile')}
              className="group relative overflow-hidden flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform z-10">
                <FaBuilding className="text-3xl" />
              </div>
              <div className="text-center z-10">
                <span className="font-bold text-lg block">Company Profile</span>
                <span className="text-sm text-white/80">Manage details</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Calculations - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#1ED760] to-[#17b34f] p-3 rounded-xl">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F2F4E]">Recent Activity</h2>
            </div>
            <button
              onClick={() => router.push('/payroll/history')}
              className="bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {stats?.recent_calculations && stats.recent_calculations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 rounded-tl-xl">Employee</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Period</th>
                    <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">Gross Salary</th>
                    <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">Net Salary</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 rounded-tr-xl">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_calculations.map((calc, index) => (
                    <motion.tr
                      key={calc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#1ED760]/5 hover:to-transparent transition-all"
                    >
                      <td className="py-5 px-6">
                        {calc.employee ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#1ED760] to-[#17b34f] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                              {calc.employee.first_name?.[0]}{calc.employee.last_name?.[0]}
                            </div>
                            <div>
                              <span className="font-semibold text-[#0F2F4E] block">
                                {calc.employee.first_name} {calc.employee.last_name}
                              </span>
                              <span className="text-xs text-gray-500">{calc.employee.employee_number}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No employee linked</span>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm border border-blue-200">
                          {calc.period_month} {calc.period_year}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="font-bold text-gray-900 text-lg">
                          {formatCurrency(calc.gross_salary)}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="font-bold text-[#1ED760] text-lg">
                          {formatCurrency(calc.net_salary)}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-600 text-sm">
                          {formatDate(calc.created_at)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaChartLine className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No calculations yet</h3>
              <p className="text-gray-500 mb-6 text-lg">Start by creating your first payroll calculation</p>
              <button
                onClick={() => router.push('/simple-payroll')}
                className="bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white px-10 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg transform hover:-translate-y-1"
              >
                Create Your First Calculation
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
