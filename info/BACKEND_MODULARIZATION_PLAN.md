# Backend Modularization Plan

## Current State

**File**: `app/Http/Controllers/TaxCalculatorController.php`
- **Size**: 600+ lines
- **Methods**: 20+ calculation methods
- **Issues**: 
  - Monolithic controller
  - Mixed concerns
  - Difficult to test
  - Hard to maintain

## Proposed Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── SimpleTaxController.php          # VAT, Withholding taxes
│       ├── CorporateTaxController.php       # Corporate income tax
│       ├── IndividualTaxController.php      # Individual income tax
│       ├── PAYEController.php               # PAYE calculations
│       └── CapitalAllowanceController.php   # Capital allowances
│
├── Services/
│   ├── TaxCalculation/
│   │   ├── SimpleTaxCalculator.php
│   │   ├── CorporateTaxCalculator.php
│   │   ├── IndividualTaxCalculator.php
│   │   └── CapitalAllowanceCalculator.php
│   │
│   └── PAYE/
│       ├── IndividualPAYEService.php
│       ├── BusinessPAYEService.php
│       ├── PAYEBandCalculator.php
│       └── PayrollProjector.php
│
├── Models/
│   ├── TaxRate.php                          # Existing
│   ├── PAYEBand.php                         # New
│   ├── CapitalAllowanceRule.php             # New
│   └── TaxScenario.php                      # New
│
└── Utilities/
    ├── TaxRateHelper.php
    ├── CurrencyConverter.php
    └── PeriodCalculator.php
```

## Migration Strategy

### Phase 1: Extract Services (Week 1-2)

**Create Service Classes**:

```php
// app/Services/PAYE/IndividualPAYEService.php
<?php

namespace App\Services\PAYE;

class IndividualPAYEService
{
    public function calculate(array $data): array
    {
        $taxableIncome = $this->calculateTaxableIncome($data);
        $payeDue = $this->calculatePAYE($taxableIncome);
        $medicalCredit = $this->calculateMedicalCredit($data);
        
        return [
            'taxableIncome' => $taxableIncome,
            'payeDue' => $payeDue,
            'medicalCredit' => $medicalCredit,
            'totalTax' => $payeDue - $medicalCredit
        ];
    }
    
    private function calculateTaxableIncome(array $data): float
    {
        // Extract taxable income calculation logic
    }
    
    private function calculatePAYE(float $taxableIncome): float
    {
        // Extract PAYE calculation logic
    }
    
    private function calculateMedicalCredit(array $data): float
    {
        // Extract medical credit logic
    }
}
```

**Update Controller**:

```php
// app/Http/Controllers/PAYEController.php
<?php

namespace App\Http\Controllers;

use App\Services\PAYE\IndividualPAYEService;
use App\Services\PAYE\BusinessPAYEService;
use Illuminate\Http\Request;

class PAYEController extends Controller
{
    public function __construct(
        private IndividualPAYEService $individualService,
        private BusinessPAYEService $businessService
    ) {}
    
    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'calculatorType' => 'required|in:individual,business',
            // ... other validation rules
        ]);
        
        if ($validated['calculatorType'] === 'individual') {
            $result = $this->individualService->calculate($validated);
        } else {
            $result = $this->businessService->calculate($validated);
        }
        
        return response()->json($result);
    }
}
```

### Phase 2: Create Separate Controllers (Week 3-4)

**Split by Functionality**:

1. **SimpleTaxController.php**
   - VAT calculations
   - Withholding tax calculations
   - Agriculture tax
   - Insurance tax
   - Financial tax
   - Healthcare tax

2. **CorporateTaxController.php**
   - Corporate income tax
   - Comprehensive corporate tax
   - AIDS levy

3. **IndividualTaxController.php**
   - Individual income tax
   - Personal tax calculations

4. **PAYEController.php**
   - Individual PAYE
   - Business PAYE
   - Multi-period projections

5. **CapitalAllowanceController.php**
   - Capital allowance calculations
   - Asset depreciation
   - Special initial allowances

### Phase 3: Extract Utilities (Week 5)

**Create Helper Classes**:

```php
// app/Utilities/TaxRateHelper.php
<?php

namespace App\Utilities;

use App\Models\TaxRate;

class TaxRateHelper
{
    public static function getRate(string $type): float
    {
        return TaxRate::where('type', $type)->value('rate') ?? 0;
    }
    
    public static function getPAYEBands(): array
    {
        return DB::table('paye_bands')
            ->orderBy('min_income')
            ->get()
            ->toArray();
    }
}
```

```php
// app/Utilities/CurrencyConverter.php
<?php

namespace App\Utilities;

class CurrencyConverter
{
    public static function convert(
        float $amount, 
        string $from, 
        string $to, 
        float $rate
    ): float {
        if ($from === $to) return $amount;
        return $amount * $rate;
    }
    
    public static function getExchangeRate(string $from, string $to): float
    {
        // Fetch from database or external API
    }
}
```

### Phase 4: Create Models (Week 6)

**New Models**:

```php
// app/Models/PAYEBand.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PAYEBand extends Model
{
    protected $fillable = [
        'min_income',
        'max_income',
        'rate',
        'deduct'
    ];
    
    public static function calculateTax(float $income): float
    {
        $band = self::where('min_income', '<=', $income)
            ->where(function($query) use ($income) {
                $query->where('max_income', '>=', $income)
                      ->orWhereNull('max_income');
            })
            ->first();
            
        if (!$band) return 0;
        
        return ($income * $band->rate) - $band->deduct;
    }
}
```

## Benefits

### 1. **Separation of Concerns**
- Controllers handle HTTP requests/responses
- Services contain business logic
- Models handle data access
- Utilities provide helper functions

### 2. **Testability**
- Services can be unit tested independently
- Controllers can be integration tested
- Easier to mock dependencies

### 3. **Maintainability**
- Smaller, focused classes
- Easier to locate and fix bugs
- Clear responsibility boundaries

### 4. **Reusability**
- Services can be reused across controllers
- Utilities can be used throughout the application
- Models encapsulate data logic

### 5. **Scalability**
- Easy to add new tax types
- Simple to extend functionality
- Better code organization

## Testing Strategy

### Unit Tests

```php
// tests/Unit/Services/PAYE/IndividualPAYEServiceTest.php
<?php

namespace Tests\Unit\Services\PAYE;

use Tests\TestCase;
use App\Services\PAYE\IndividualPAYEService;

class IndividualPAYEServiceTest extends TestCase
{
    public function test_calculates_paye_correctly()
    {
        $service = new IndividualPAYEService();
        
        $result = $service->calculate([
            'currentSalary' => 50000,
            'currentBonus' => 5000,
            // ... other fields
        ]);
        
        $this->assertArrayHasKey('taxableIncome', $result);
        $this->assertArrayHasKey('payeDue', $result);
        $this->assertArrayHasKey('totalTax', $result);
    }
}
```

### Integration Tests

```php
// tests/Feature/Controllers/PAYEControllerTest.php
<?php

namespace Tests\Feature\Controllers;

use Tests\TestCase;

class PAYEControllerTest extends TestCase
{
    public function test_individual_paye_calculation()
    {
        $response = $this->postJson('/api/calculate/paye', [
            'calculatorType' => 'individual',
            'currentSalary' => 50000,
            // ... other fields
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'taxableIncome',
                     'payeDue',
                     'totalTax'
                 ]);
    }
}
```

## Migration Checklist

- [ ] Create service classes
- [ ] Extract business logic from controllers
- [ ] Create separate controllers
- [ ] Update routes
- [ ] Create utility classes
- [ ] Create new models
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update API documentation
- [ ] Deploy and monitor

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1 | Week 1-2 | Extract services |
| Phase 2 | Week 3-4 | Create separate controllers |
| Phase 3 | Week 5 | Extract utilities |
| Phase 4 | Week 6 | Create models |
| Testing | Week 7-8 | Write comprehensive tests |
| **Total** | **8 weeks** | Complete backend refactoring |

## Next Steps

1. Review and approve this plan
2. Create feature branch for refactoring
3. Start with Phase 1 (Extract Services)
4. Test thoroughly after each phase
5. Deploy incrementally

## Questions?

Contact the backend development team for clarification or assistance.
