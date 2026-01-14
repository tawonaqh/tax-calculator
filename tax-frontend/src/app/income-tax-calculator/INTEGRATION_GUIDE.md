# Integration Guide - New Components
## How to Add New Components to Income Tax Calculator

---

## Quick Start

### 1. Import the New Components

Add to the top of `IncomeTaxCalculator.js`:

```javascript
import { 
  SimplifiedModeToggle, 
  DigitalServicesTaxCalculator, 
  TaxYearBanner,
  FieldExplanation,
  TaxFieldExplanations,
  QuickHelpPanel
} from './components';
```

---

## Component Usage Examples

### 1. Tax Year Banner

**Where to add:** At the very top of the calculator, before any forms

```jsx
function IncomeTaxCalculator() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Tax Year Banner */}
      <TaxYearBanner />
      
      {/* Rest of your calculator */}
      <div className="bg-white rounded-2xl p-8">
        {/* ... */}
      </div>
    </div>
  );
}
```

---

### 2. Simplified Mode Toggle

**Where to add:** After the Tax Year Banner, before the main calculator tabs

```jsx
function IncomeTaxCalculator() {
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TaxYearBanner />
      
      {/* Add Simplified Mode Toggle */}
      <SimplifiedModeToggle 
        isSimplified={isSimplifiedMode}
        onToggle={() => setIsSimplifiedMode(!isSimplifiedMode)}
      />
      
      {/* Conditionally render based on mode */}
      {isSimplifiedMode ? (
        <SimplifiedCalculator />
      ) : (
        <AdvancedCalculator />
      )}
    </div>
  );
}
```

---

### 3. Digital Services Tax Calculator

**Option A: As a separate tab**

```jsx
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-input', label: 'Data Input' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'digital-tax', label: 'Digital Services Tax' }, // NEW TAB
  { id: 'reports', label: 'Reports' }
];

// In your tab content rendering:
{activeTab === 'digital-tax' && (
  <DigitalServicesTaxCalculator />
)}
```

**Option B: As a section in Data Input tab**

```jsx
{activeTab === 'data-input' && (
  <div className="space-y-6">
    {/* Existing input sections */}
    <ProfitLossSection />
    <TaxAdjustmentsSection />
    
    {/* Add Digital Services Tax section */}
    <div className="mt-8">
      <h3 className="text-xl font-bold text-[#0F2F4E] mb-4">
        Digital Services Payments
      </h3>
      <DigitalServicesTaxCalculator />
    </div>
  </div>
)}
```

---

### 4. Field Explanations

**Add to any input field:**

```jsx
<div>
  <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
    Capital Allowances
    <FieldExplanation 
      title="Capital Allowances" 
      position="right"
    >
      {TaxFieldExplanations.capitalAllowances.content}
    </FieldExplanation>
  </label>
  <input
    type="number"
    value={formData.capitalAllowances}
    onChange={(e) => handleChange('capitalAllowances', e.target.value)}
    className="w-full p-3 rounded-lg border border-[#EEEEEE]"
  />
</div>
```

**Multiple field examples:**

```jsx
// AIDS Levy explanation
<label>
  AIDS Levy
  <FieldExplanation title="AIDS Levy">
    {TaxFieldExplanations.aidsLevy.content}
  </FieldExplanation>
</label>

// NSSA Cap explanation
<label>
  NSSA Contributions
  <FieldExplanation title="NSSA Cap">
    {TaxFieldExplanations.nssaCap.content}
  </FieldExplanation>
</label>

// Medical Credit explanation
<label>
  Medical Aid Contributions
  <FieldExplanation title="Medical Aid Credit">
    {TaxFieldExplanations.medicalCredit.content}
  </FieldExplanation>
</label>

// Currency Mix explanation
<label>
  Currency Mix
  <FieldExplanation title="Currency Mix">
    {TaxFieldExplanations.currencyMix.content}
  </FieldExplanation>
</label>
```

---

### 5. Quick Help Panel

**Add a help button to your header:**

```jsx
function IncomeTaxCalculator() {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Help Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0F2F4E]">
          Multi-Period Tax Planning
        </h1>
        
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help Guide
        </button>
      </div>
      
      {/* Quick Help Panel */}
      <QuickHelpPanel 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
      
      {/* Rest of calculator */}
    </div>
  );
}
```

---

## Complete Integration Example

Here's a complete example showing all components integrated:

```jsx
'use client'

import React, { useState } from 'react';
import { 
  SimplifiedModeToggle, 
  DigitalServicesTaxCalculator, 
  TaxYearBanner,
  FieldExplanation,
  TaxFieldExplanations,
  QuickHelpPanel
} from './components';

export default function IncomeTaxCalculator() {
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* 1. Tax Year Banner */}
        <TaxYearBanner />
        
        {/* 2. Header with Help Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#0F2F4E]">
            Multi-Period Tax Planning
          </h1>
          
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1ED760] text-white rounded-lg hover:bg-[#1ED760]/90 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help Guide
          </button>
        </div>
        
        {/* 3. Simplified Mode Toggle */}
        <SimplifiedModeToggle 
          isSimplified={isSimplifiedMode}
          onToggle={() => setIsSimplifiedMode(!isSimplifiedMode)}
        />
        
        {/* 4. Main Calculator */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['overview', 'data-input', 'scenarios', 'digital-tax', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab
                    ? 'text-[#1ED760] border-b-2 border-[#1ED760]'
                    : 'text-gray-600 hover:text-[#0F2F4E]'
                }`}
              >
                {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          {activeTab === 'data-input' && (
            <div className="space-y-6">
              
              {/* Example input with explanation */}
              <div>
                <label className="block text-sm font-medium text-[#0F2F4E] mb-2">
                  Capital Allowances
                  <FieldExplanation title="Capital Allowances">
                    {TaxFieldExplanations.capitalAllowances.content}
                  </FieldExplanation>
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border border-[#EEEEEE]"
                  placeholder="Enter capital allowances"
                />
              </div>
              
              {/* More inputs... */}
              
            </div>
          )}
          
          {/* 5. Digital Services Tax Tab */}
          {activeTab === 'digital-tax' && (
            <DigitalServicesTaxCalculator />
          )}
          
          {/* Other tabs... */}
          
        </div>
        
        {/* 6. Quick Help Panel */}
        <QuickHelpPanel 
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
        />
        
      </div>
    </div>
  );
}
```

---

## Styling Notes

All components use the existing design system:

- **Primary Navy:** `#0F2F4E`
- **Accent Green:** `#1ED760`
- **Gold Accent:** `#FFD700`
- **Neutral White:** `#FFFFFF`
- **Secondary Grey:** `#EEEEEE`

Components are fully responsive and work on mobile, tablet, and desktop.

---

## Testing Checklist

After integration, test:

- [ ] Tax Year Banner displays correctly
- [ ] Simplified Mode Toggle switches between modes
- [ ] Digital Services Tax Calculator performs calculations
- [ ] Field Explanations show on hover/click
- [ ] Quick Help Panel opens and closes
- [ ] All components are responsive on mobile
- [ ] Colors match design system
- [ ] Animations are smooth

---

## Support

For questions or issues:
1. Check component source code in `./components/`
2. Review this integration guide
3. Test in development environment first
4. Verify tax calculations with ZIMRA guidelines

---

**Last Updated:** January 14, 2026
