'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBuilding, FaSave, FaUpload, FaArrowLeft } from 'react-icons/fa';
import { companyApi } from '@/lib/payrollApi';

export default function CompanyProfile() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    tax_number: '',
    address: '',
    city: '',
    country: 'Zimbabwe',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyApi.getAll();
      const companiesData = response.data;
      setCompanies(companiesData);
      if (companiesData.length > 0) {
        const company = companiesData[0];
        setSelectedCompany(company);
        setFormData({
          name: company.name || '',
          registration_number: company.registration_number || '',
          tax_number: company.tax_number || '',
          address: company.address || '',
          city: company.city || '',
          country: company.country || 'Zimbabwe',
          phone: company.phone || '',
          email: company.email || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (selectedCompany) {
        await companyApi.update(selectedCompany.id, formData);
        setMessage({ type: 'success', text: 'Company updated successfully!' });
      } else {
        const response = await companyApi.create(formData);
        setSelectedCompany(response.data);
        setMessage({ type: 'success', text: 'Company created successfully!' });
      }
      fetchCompanies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save company. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedCompany) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      await companyApi.uploadLogo(selectedCompany.id, formData);
      setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
      fetchCompanies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload logo.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1ED760] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-5xl font-bold text-white mb-2">Company Profile</h1>
            <p className="text-white/80 text-xl">Manage your company information and branding</p>
          </div>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border-l-4 flex items-center gap-3 shadow-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-500' 
                : 'bg-red-50 text-red-800 border-red-500'
            }`}
          >
            {message.type === 'success' ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {message.text}
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Logo Section */}
          {selectedCompany && (
            <div className="bg-gradient-to-r from-[#0F2F4E] to-[#1a4d6d] p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Company Logo
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                  {selectedCompany.logo_path ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${selectedCompany.logo_path}`} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <FaBuilding 
                    className="text-gray-300 text-5xl" 
                    style={{ display: selectedCompany.logo_path ? 'none' : 'block' }}
                  />
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F2F4E] rounded-xl hover:shadow-lg transition-all font-semibold">
                    <FaUpload />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-200 mt-3">PNG, JPG or SVG (max 2MB)</p>
                </div>
              </div>
            </div>
          )}

          {/* Company Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2F4E] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                    placeholder="Acme Corporation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                    placeholder="REG123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax Number
                  </label>
                  <input
                    type="text"
                    name="tax_number"
                    value={formData.tax_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                    placeholder="TAX123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                    placeholder="Harare"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2F4E] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                    placeholder="+263 77 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                    placeholder="info@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2F4E] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address
              </h3>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all"
                placeholder="123 Main Street, Building A, Floor 5"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
              >
                <FaSave />
                <span>{saving ? 'Saving...' : selectedCompany ? 'Update Company' : 'Create Company'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
