'use client'

import React from 'react';

const TutorialModal = ({ 
  showTutorial, 
  tutorialStep, 
  tutorialSteps, 
  nextTutorialStep, 
  prevTutorialStep, 
  closeTutorial 
}) => {
  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Tutorial Header */}
        <div className="bg-gradient-to-r from-[#0F2F4E] to-[#1ED760] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {tutorialSteps[tutorialStep].title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">
                  Step {tutorialStep + 1} of {tutorialSteps.length}
                </span>
                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index <= tutorialStep ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={closeTutorial}
              className="text-white/80 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-lg">
              {tutorialSteps[tutorialStep].content}
            </p>
          </div>

          {/* Tutorial-specific content based on step */}
          {tutorialStep === 1 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-[#0F2F4E] mb-2">Payroll Modes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border-l-4 border-[#1ED760]">
                  <strong>Single Employee</strong>
                  <p className="text-gray-600">Individual calculations with detailed breakdown</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-[#0F2F4E]">
                  <strong>Batch Payroll</strong>
                  <p className="text-gray-600">Process up to 20 employees with reports</p>
                </div>
              </div>
            </div>
          )}

          {tutorialStep === 4 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-[#0F2F4E] mb-2">Supported Allowances:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Living Allowance</div>
                <div>• Medical Allowance</div>
                <div>• Transport Allowance</div>
                <div>• Housing Allowance</div>
                <div>• Commission</div>
                <div>• Bonus (with $700 YTD threshold)</div>
                <div>• Overtime</div>
                <div>• APWC (sector-specific)</div>
              </div>
            </div>
          )}

          {tutorialStep === 5 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-[#0F2F4E] mb-2">Zimbabwe Tax Compliance:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>NSSA Cap:</span>
                  <span className="font-medium">$31.50/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Tax-Free:</span>
                  <span className="font-medium">$700/year</span>
                </div>
                <div className="flex justify-between">
                  <span>ZIMDEF:</span>
                  <span className="font-medium">1% (employer)</span>
                </div>
                <div className="flex justify-between">
                  <span>APWC:</span>
                  <span className="font-medium">0-2.16% (sector-based)</span>
                </div>
              </div>
            </div>
          )}

          {tutorialStep === 6 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-[#0F2F4E] mb-2">Available Reports:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded">
                  <strong className="text-[#1ED760]">Beautiful PDF</strong>
                  <p className="text-gray-600">HTML-to-PDF conversion with modern design</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-[#0F2F4E]">Classic PDF</strong>
                  <p className="text-gray-600">Traditional PDF with professional layout</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-[#FFD700]">Batch ZIP</strong>
                  <p className="text-gray-600">Individual payslips in ZIP format</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-red-500">Summary Reports</strong>
                  <p className="text-gray-600">Comprehensive payroll analytics</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tutorial Navigation */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between items-center">
          <button
            onClick={prevTutorialStep}
            disabled={tutorialStep === 0}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              tutorialStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#0F2F4E] text-white hover:bg-[#0F2F4E]/90'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={closeTutorial}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Skip Tutorial
            </button>
            <button
              onClick={nextTutorialStep}
              className="px-6 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition flex items-center gap-2"
            >
              {tutorialStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;