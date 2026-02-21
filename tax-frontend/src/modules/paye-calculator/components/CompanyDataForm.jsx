'use client'

import React, { useState } from 'react';

const CompanyDataForm = ({ companyData, setCompanyData }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-[#0F2F4E] mb-4">Company Information (Optional)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={companyData.companyName}
            onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
            placeholder="Your Company Name"
            className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
            Company Email
          </label>
          <input
            type="email"
            value={companyData.companyEmail}
            onChange={(e) => setCompanyData(prev => ({ ...prev, companyEmail: e.target.value }))}
            placeholder="company@example.com"
            className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
            Company Address
          </label>
          <input
            type="text"
            value={companyData.companyAddress}
            onChange={(e) => setCompanyData(prev => ({ ...prev, companyAddress: e.target.value }))}
            placeholder="Company Address"
            className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
            Company Phone
          </label>
          <input
            type="text"
            value={companyData.companyPhone}
            onChange={(e) => setCompanyData(prev => ({ ...prev, companyPhone: e.target.value }))}
            placeholder="+263 xxx xxx xxx"
            className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none"
          />
        </div>
        
        {/* Company Logo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#0F2F4E] mb-1">
            Company Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCompanyData(prev => ({ 
                        ...prev, 
                        companyLogo: event.target.result,
                        logoFileName: file.name
                      }));
                      setImageError(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-3 rounded border border-gray-300 focus:border-[#1ED760] outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1ED760] file:text-white hover:file:bg-[#1ED760]/90"
              />
            </div>
            
            {companyData.companyLogo && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {!imageError ? (
                    <img 
                      src={companyData.companyLogo} 
                      alt="Company Logo Preview" 
                      className="max-w-full max-h-full object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={() => {
                    setCompanyData(prev => ({ ...prev, companyLogo: null, logoFileName: null }));
                    setImageError(false);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {imageError && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Logo image could not be loaded. Please upload a new logo or check backend storage configuration.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Upload your company logo (PNG, JPG, GIF). Recommended size: 200x100px or similar aspect ratio.
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Company Branding:</strong> This information will appear on all payslips and reports generated by the system.
        </p>
      </div>
    </div>
  );
};

export default CompanyDataForm;