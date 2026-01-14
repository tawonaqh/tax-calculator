# Developer Quick Start Guide - Modularized Tax Calculator

## Overview

This guide helps developers quickly understand and work with the newly modularized tax calculator codebase.

## Project Structure

```
tax-calculator/
├── tax-frontend/                    # Next.js Frontend
│   └── src/
│       ├── modules/                 # ✨ NEW: Modular components
│       │   ├── shared/             # Reusable components
│       │   ├── paye-calculator/    # PAYE module
│       │   ├── capital-allowance/  # Capital allowance module
│       │   ├── income-tax-single/  # Single period tax module
│       │   └── income-tax-multi/   # Multi-period tax module
│       └── app/                    # Next.js pages (thin wrappers)
│
└── tax-api/                        # Laravel Backend
    └── app/
        ├── Http/Controllers/       # Thin controllers
        ├── Services/               # ✨ NEW: Business logic
        ├── Models/                 # Data models
        └── Utilities/              # ✨ NEW: Helper functions
```

## Quick Reference

### Import Shared Components

```javascript
// ✅ DO THIS
import { InputField, SelectField, Card, Button } from '@/modules/shared/components'
import { formatCurrency, formatNumber } from '@/modules/shared/utils'
import { TAX_RATES, PAYE_BANDS } from '@/modules/shared/constants/taxRates'

// ❌ DON'T DO THIS
import InputField from '@/components/InputField' // Old location
```

### Import Module-Specific Components

```javascript
// PAYE Calculator
import { 
  IndividualPAYEForm, 
  BusinessPAYEForm, 
  PAYEResults 
} from '@/modules/paye-calculator/components'

import { calculatePAYE } from '@/modules/paye-calculator/services/payeService'

// Capital Allowance
import { 
  AssetForm, 
  AssetList, 
  AllowanceResults 
} from '@/modules/capital-allowance/components'
```

## Common Tasks

### 1. Adding a New Form Field

**Step 1**: Use the shared `InputField` component

```javascript
import { InputField } from '@/modules/shared/components'

<InputField
  label="Salary Amount"
  value={formState.salary}
  onChange={handleChange('salary')}
  placeholder="Enter salary"
  type="number"
  required
  tooltip="Enter your gross monthly salary"
/>
```

**Step 2**: Add validation (optional)

```javascript
import { validateRequired, validatePositive } from '@/modules/shared/utils'

const errors = validateForm(formState, {
  salary: [validateRequired, validatePositive]
})
```

### 2. Creating a New Calculator Module

**Step 1**: Create folder structure

```bash
mkdir -p tax-frontend/src/modules/my-calculator/{components,services,constants,utils}
```

**Step 2**: Create components

```javascript
// components/MyCalculatorForm.jsx
'use client'

import { InputField, Button } from '@/modules/shared/components'

export const MyCalculatorForm = ({ formState, handleChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InputField
        label="Input 1"
        value={formState.input1}
        onChange={handleChange('input1')}
      />
      {/* More fields */}
    </div>
  )
}
```

**Step 3**: Create service

```javascript
// services/myCalculatorService.js
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

export const calculateMyTax = async (data) => {
  try {
    const response = await axios.post(`${API_BASE}/calculate/my-tax`, data)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**Step 4**: Create constants

```javascript
// constants/myCalculatorConfig.js
export const MY_TAX_RATES = {
  STANDARD: 0.25,
  REDUCED: 0.15
}

export const INITIAL_FORM_STATE = {
  input1: '',
  input2: ''
}
```

**Step 5**: Create main page component

```javascript
// app/my-calculator/page.jsx
'use client'

import { useState } from 'react'
import { MyCalculatorForm } from '@/modules/my-calculator/components'
import { calculateMyTax } from '@/modules/my-calculator/services/myCalculatorService'
import { Button } from '@/modules/shared/components'

export default function MyCalculatorPage() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE)
  const [results, setResults] = useState(null)

  const handleCalculate = async () => {
    const result = await calculateMyTax(formState)
    if (result.success) {
      setResults(result.data)
    }
  }

  return (
    <div>
      <MyCalculatorForm formState={formState} handleChange={handleChange} />
      <Button onClick={handleCalculate}>Calculate</Button>
      {results && <MyCalculatorResults results={results} />}
    </div>
  )
}
```

### 3. Formatting Currency

```javascript
import { formatCurrency, formatNumber, formatPercentage } from '@/modules/shared/utils'

// Format currency
formatCurrency(1234.56, 'USD')  // "USD 1,234.56"

// Format number
formatNumber(1234.5678, 2)      // "1,234.57"

// Format percentage
formatPercentage(0.25, 2)       // "25.00%"
```

### 4. Using Tax Rates

```javascript
import { TAX_RATES, PAYE_BANDS, CAPITAL_ALLOWANCE_RATES } from '@/modules/shared/constants/taxRates'

// Corporate tax rate
const corporateTax = income * TAX_RATES.CORPORATE_TAX

// PAYE calculation
const payeBand = PAYE_BANDS.find(band => 
  income >= band.min && income <= band.max
)
const paye = (income * payeBand.rate) - payeBand.deduct

// Capital allowance
const allowance = cost * CAPITAL_ALLOWANCE_RATES.PLANT_MACHINERY.wearTear
```

### 5. Creating Backend Service

```php
// app/Services/MyTax/MyTaxCalculator.php
<?php

namespace App\Services\MyTax;

class MyTaxCalculator
{
    public function calculate(array $data): array
    {
        $taxableAmount = $this->calculateTaxableAmount($data);
        $taxDue = $taxableAmount * 0.25;
        
        return [
            'taxableAmount' => $taxableAmount,
            'taxDue' => $taxDue,
            'totalTax' => $taxDue
        ];
    }
    
    private function calculateTaxableAmount(array $data): float
    {
        return $data['income'] - $data['deductions'];
    }
}
```

```php
// app/Http/Controllers/MyTaxController.php
<?php

namespace App\Http\Controllers;

use App\Services\MyTax\MyTaxCalculator;
use Illuminate\Http\Request;

class MyTaxController extends Controller
{
    public function __construct(
        private MyTaxCalculator $calculator
    ) {}
    
    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'income' => 'required|numeric|min:0',
            'deductions' => 'required|numeric|min:0'
        ]);
        
        $result = $this->calculator->calculate($validated);
        
        return response()->json($result);
    }
}
```

## Best Practices

### ✅ DO

1. **Use shared components** instead of creating new ones
2. **Keep files small** (< 200 lines)
3. **Separate concerns** (UI, logic, API calls)
4. **Write tests** for new functionality
5. **Document your code** with JSDoc comments
6. **Use TypeScript** for type safety (if available)
7. **Follow naming conventions**:
   - Components: PascalCase (`MyComponent.jsx`)
   - Services: camelCase (`myService.js`)
   - Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)

### ❌ DON'T

1. **Don't create inline components** in large files
2. **Don't mix UI and business logic**
3. **Don't duplicate code** - extract to shared utilities
4. **Don't skip validation**
5. **Don't hardcode values** - use constants
6. **Don't forget error handling**
7. **Don't commit without testing**

## Code Style

### Component Structure

```javascript
'use client'

// 1. Imports
import { useState } from 'react'
import { InputField, Button } from '@/modules/shared/components'
import { formatCurrency } from '@/modules/shared/utils'

// 2. Component
export const MyComponent = ({ prop1, prop2 }) => {
  // 3. State
  const [state, setState] = useState(null)
  
  // 4. Handlers
  const handleClick = () => {
    // Logic here
  }
  
  // 5. Render
  return (
    <div>
      {/* JSX here */}
    </div>
  )
}

// 6. PropTypes or TypeScript types (optional)
```

### Service Structure

```javascript
// 1. Imports
import axios from 'axios'

// 2. Constants
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

// 3. Main functions
export const myServiceFunction = async (data) => {
  try {
    const response = await axios.post(`${API_BASE}/endpoint`, data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: error.message }
  }
}

// 4. Helper functions
const helperFunction = (data) => {
  // Helper logic
}
```

## Testing

### Component Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('My Component')).toBeInTheDocument()
  })
  
  it('handles user input', () => {
    render(<MyComponent />)
    const input = screen.getByPlaceholderText('Enter value')
    fireEvent.change(input, { target: { value: '100' } })
    expect(input.value).toBe('100')
  })
})
```

### Service Tests

```javascript
import { calculateMyTax } from './myCalculatorService'

describe('myCalculatorService', () => {
  it('calculates tax correctly', async () => {
    const result = await calculateMyTax({ income: 100000 })
    expect(result.success).toBe(true)
    expect(result.data.taxDue).toBeGreaterThan(0)
  })
})
```

## Debugging Tips

### Frontend

```javascript
// Add console logs
console.log('Form state:', formState)
console.log('API response:', response.data)

// Use React DevTools
// Install: https://react.dev/learn/react-developer-tools

// Check network requests
// Open browser DevTools → Network tab
```

### Backend

```php
// Add logging
\Log::info('Calculation input:', $data);
\Log::info('Calculation result:', $result);

// Use Laravel Telescope
// Install: composer require laravel/telescope

// Check logs
// tail -f storage/logs/laravel.log
```

## Common Issues

### Issue 1: Module not found

```
Error: Cannot find module '@/modules/shared/components'
```

**Solution**: Check your import path and ensure the file exists

```javascript
// ✅ Correct
import { InputField } from '@/modules/shared/components'

// ❌ Wrong
import { InputField } from '@/modules/shared/component' // Missing 's'
```

### Issue 2: API call fails

```
Error: Network Error
```

**Solution**: Check your `.env` file

```bash
# tax-frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
```

### Issue 3: Component not rendering

**Solution**: Check for errors in browser console and ensure proper imports

## Resources

- [Modularization Summary](./MODULARIZATION_SUMMARY.md)
- [Architecture Comparison](./ARCHITECTURE_COMPARISON.md)
- [Backend Modularization Plan](./tax-api/BACKEND_MODULARIZATION_PLAN.md)
- [Module README](./tax-frontend/src/modules/README.md)

## Getting Help

1. Check the documentation files above
2. Review existing module implementations
3. Ask the development team
4. Create an issue in the project repository

## Next Steps

1. ✅ Familiarize yourself with the new structure
2. ✅ Review the shared components
3. ✅ Try creating a simple calculator module
4. ✅ Write tests for your code
5. ✅ Submit a pull request

Happy coding! 🚀
