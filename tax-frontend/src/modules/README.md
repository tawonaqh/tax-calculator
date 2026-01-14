# Tax Calculator Modules

This directory contains modularized versions of the tax calculator components, breaking down large monolithic files into smaller, maintainable modules.

## Structure

```
modules/
├── shared/                    # Shared components and utilities
│   ├── components/           # Reusable UI components
│   │   ├── InputField.jsx
│   │   ├── SelectField.jsx
│   │   ├── Card.jsx
│   │   ├── StatCard.jsx
│   │   └── Button.jsx
│   ├── utils/                # Utility functions
│   │   ├── formatters.js    # Currency, number formatting
│   │   └── validators.js    # Form validation
│   └── constants/            # Shared constants
│       └── taxRates.js      # Zimbabwe tax rates
│
├── paye-calculator/          # PAYE Calculator Module
│   ├── components/           # PAYE-specific components
│   │   ├── IndividualPAYEForm.jsx
│   │   ├── BusinessPAYEForm.jsx
│   │   ├── PAYEResults.jsx
│   │   └── MultiPeriodResults.jsx
│   ├── services/             # API services
│   │   └── payeService.js
│   ├── constants/            # PAYE configuration
│   │   └── payeConfig.js
│   └── utils/                # PAYE utilities
│
├── capital-allowance/        # Capital Allowance Module
│   ├── components/
│   ├── services/
│   ├── constants/
│   └── utils/
│
├── income-tax-single/        # Single Period Income Tax Module
│   ├── components/
│   ├── services/
│   ├── constants/
│   └── utils/
│
└── income-tax-multi/         # Multi-Period Income Tax Module
    ├── components/
    ├── services/
    ├── constants/
    └── utils/
```

## Benefits of Modularization

### 1. **Improved Maintainability**
- Smaller, focused files are easier to understand and modify
- Clear separation of concerns
- Easier to locate and fix bugs

### 2. **Better Reusability**
- Shared components can be used across multiple calculators
- Consistent UI/UX across the application
- Reduced code duplication

### 3. **Enhanced Testability**
- Individual components can be tested in isolation
- Easier to write unit tests
- Better test coverage

### 4. **Improved Performance**
- Lazy loading of modules
- Smaller bundle sizes
- Faster initial page load

### 5. **Better Developer Experience**
- Easier onboarding for new developers
- Clear module boundaries
- Reduced merge conflicts

## Usage

### Importing Shared Components

```javascript
import { InputField, SelectField, Card, StatCard, Button } from '@/modules/shared/components'
import { formatCurrency, formatNumber } from '@/modules/shared/utils'
import { TAX_RATES, PAYE_BANDS } from '@/modules/shared/constants/taxRates'
```

### Importing PAYE Components

```javascript
import { IndividualPAYEForm, BusinessPAYEForm, PAYEResults } from '@/modules/paye-calculator/components'
import { calculatePAYE, preparePayload } from '@/modules/paye-calculator/services/payeService'
import { CALCULATOR_TYPES, BUSINESS_TYPES } from '@/modules/paye-calculator/constants/payeConfig'
```

## Migration Guide

### Before (Monolithic)
```javascript
// 1,235 lines in a single file
const PAYETaxCalculator = () => {
  // All logic, components, and state in one place
  const InputField = ({ ... }) => { ... }
  const handleCalculate = () => { ... }
  const renderResults = () => { ... }
  // ... 1,200+ more lines
}
```

### After (Modularized)
```javascript
// Main component: ~200 lines
import { IndividualPAYEForm, BusinessPAYEForm, PAYEResults } from '@/modules/paye-calculator/components'
import { calculatePAYE } from '@/modules/paye-calculator/services/payeService'

const PAYETaxCalculator = () => {
  // Only orchestration logic
  const handleCalculate = async () => {
    const result = await calculatePAYE(payload)
    setResults(result.data)
  }
  
  return (
    <>
      {calculatorType === 'individual' ? <IndividualPAYEForm /> : <BusinessPAYEForm />}
      <PAYEResults results={results} />
    </>
  )
}
```

## Module Status

| Module | Original Size | Status | Priority |
|--------|--------------|--------|----------|
| PAYE Calculator | 1,235 lines | ✅ Modularized | High |
| Capital Allowance | 1,837 lines | 🔄 In Progress | High |
| Single Period Income Tax | 2,515 lines | 📋 Planned | Medium |
| Multi-Period Income Tax | 4,713 lines | 📋 Planned | Medium |

## Next Steps

1. ✅ Create shared component library
2. ✅ Modularize PAYE calculator
3. 🔄 Modularize Capital Allowance calculator
4. 📋 Modularize Single Period Income Tax calculator
5. 📋 Modularize Multi-Period Income Tax calculator
6. 📋 Create comprehensive tests
7. 📋 Update documentation

## Contributing

When adding new modules:

1. Follow the established folder structure
2. Keep components small and focused (< 200 lines)
3. Extract reusable logic to utilities
4. Use shared components when possible
5. Document your code with JSDoc comments
6. Write tests for new functionality

## Questions?

Contact the development team or refer to the main project documentation.
