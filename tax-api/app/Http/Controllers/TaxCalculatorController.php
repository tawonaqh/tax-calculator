<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaxRate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaxCalculatorController extends Controller
{
    public function calculateVATImportedServices(Request $request) {
        $value = $request->input('value');
        $isMarketValue = $request->input('isMarketValue', false);
        $rate = $this->getTaxRate('VAT');
        $marketValue = $isMarketValue ? $value : max($value, $this->getMarketValue($value));
        $vat = $marketValue * $rate;

        return response()->json(['vat' => $vat]);
    }

    private function getMarketValue($value) {
        return $value;
    }

    public function calculateVATTaxableSupplies(Request $request) {
        $amount = $request->input('amount');
        $rate = $this->getTaxRate('VAT');
        $vat = $amount * $rate;

        return response()->json(['vat' => $vat]);
    }

    public function calculateWithholdingTaxRoyalties(Request $request) {
        $value = $request->input('value');
        $dtaRate = $this->getTaxRate('Withholding_Royalties');
        $taxDue = $value * $dtaRate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateWithholdingTaxFees(Request $request) {
        $value = $request->input('value');
        $dtaRate = $this->getTaxRate('Withholding_Fees');
        $taxDue = $value * $dtaRate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateWithholdingTaxInterest(Request $request) {
        $value = $request->input('value');
        $dtaRate = $this->getTaxRate('Withholding_Interest');
        $taxDue = $value * $dtaRate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateWithholdingTaxTenders(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Withholding_Tenders');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateCorporateIncomeTax(Request $request) {
        $profits = $request->input('profits');
        $deductions = $request->input('deductions', 0);
        $nonDeductible = $request->input('nonDeductible', 0);
        $recoupments = $request->input('recoupments', 0);

        $adjustedIncome = $profits - ($deductions - $nonDeductible) + $recoupments;
        $taxRate = $this->getTaxRate('Corporate_Income');
        $taxDue = $adjustedIncome * $taxRate;

        $aidsLevy = $taxDue * 0.03;
        $totalTax = $taxDue + $aidsLevy;

        return response()->json([
            'taxableIncome' => $adjustedIncome,
            'taxDue' => $taxDue,
            'aidsLevy' => $aidsLevy,
            'totalTax' => $totalTax
        ]);
    }

    public function calculateIndividualIncomeTax(Request $request) {
        $grossIncome = $request->input('income');
        $exemptIncome = $request->input('exemptIncome', 0);
        $deductions = $request->input('deductions', 0);

        $taxableIncome = max(0, $grossIncome - $exemptIncome - $deductions);

        $bands = DB::table('paye_bands')->orderBy('min_income')->get();
        $taxDue = 0;

        foreach ($bands as $band) {
            $bandMax = $band->max_income ?? INF;
            if ($taxableIncome >= $band->min_income && $taxableIncome <= $bandMax) {
                $taxDue = ($taxableIncome * $band->rate) - $band->deduct;
                break;
            }
        }

        $aidsLevy = $taxDue * 0.03;
        $totalTax = $taxDue + $aidsLevy;

        return response()->json([
            'taxableIncome' => $taxableIncome,
            'taxDue' => $taxDue,
            'aidsLevy' => $aidsLevy,
            'totalTax' => $totalTax
        ]);
    }

    private function getTaxRate($category) {
        $taxRate = TaxRate::where('category', $category)->first();
        return $taxRate ? $taxRate->rate : 0;
    }

    public function calculateCapitalAllowances(Request $request) {
        $qualifyingAssets = $request->input('qualifyingAssets');
        $allowanceRate = $request->input('allowanceRate', 0.10);
        $totalAllowances = 0;

        foreach ($qualifyingAssets as $assetValue) {
            $totalAllowances += $assetValue * $allowanceRate;
        }

        return response()->json(['totalAllowances' => $totalAllowances]);
    }

    public function calculateVATDeferment(Request $request) {
        $equipmentValue = $request->input('equipmentValue');
        $threshold = $request->input('threshold', 10000);
        return response()->json(['defermentDays' => ($equipmentValue >= $threshold) ? $this->getDefermentDays($equipmentValue) : 0]);
    }

    private function getDefermentDays($equipmentValue) {
        return 30;
    }

    public function calculateTaxRelief(Request $request) {
        $taxableIncome = $request->input('taxableIncome');
        $reliefs = $request->input('reliefs', []);
        return response()->json(['taxableIncomeWithRelief' => $taxableIncome - array_sum($reliefs)]);
    }

    public function calculateTaxCredits(Request $request) {
        $taxableIncome = $request->input('taxableIncome');
        $credits = $request->input('credits', []);
        return response()->json(['taxableIncomeWithCredits' => $taxableIncome - array_sum($credits)]);
    }

    public function calculateAgricultureTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Agriculture');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateInsuranceTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Insurance');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateFinancialTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Financial');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateHealthcareTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Healthcare');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculatePAYE(Request $request) {
        try {
            $calculatorType = $request->input('calculatorType', 'individual');
            $businessType = $request->input('businessType', 'private');
            $periodType = $request->input('periodType', 'monthly');
            $projectionYears = $request->input('projectionYears', 1);
            
            if ($calculatorType === 'individual') {
                return $this->calculateIndividualPAYE($request);
            } else {
                return $this->calculateBusinessPAYE($request);
            }
            
        } catch (\Exception $e) {
            Log::error('PAYE calculation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'PAYE calculation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function calculateIndividualPAYE(Request $request) {
        // Retrieve input values
        $currentSalary = floatval($request->input('currentSalary', 0));
        $currentBonus = floatval($request->input('currentBonus', 0));
        $irregularCommission = floatval($request->input('irregularCommission', 0));
        $otherIrregularEarnings = floatval($request->input('otherIrregularEarnings', 0));
        $exemptions = floatval($request->input('exemptions', 0));
        $housingBenefit = floatval($request->input('housingBenefit', 0));
        $vehicleBenefit = floatval($request->input('vehicleBenefit', 0));
        $educationBenefit = floatval($request->input('educationBenefit', 0));
        $nonTaxableEarnings = floatval($request->input('nonTaxableEarnings', 0));
        $pensionContributions = floatval($request->input('pensionContributions', 0));
        $nssaContributions = floatval($request->input('nssaContributions', 0));
        $totalDeductions = floatval($request->input('totalDeductions', 0));
        $medicalContributions = floatval($request->input('medicalContributions', 0));
        $medicalExpenses = floatval($request->input('medicalExpenses', 0));
        $credits = floatval($request->input('credits', 0));
        
        // Calculate total income
        $totalIncome = $currentSalary + $currentBonus + $irregularCommission + $otherIrregularEarnings;
        
        // Calculate taxable benefits
        $totalBenefits = $housingBenefit + $vehicleBenefit + $educationBenefit;
        
        // ZIMBABWE-SPECIFIC LOGIC FIXES:
        
        // 1. Apply Medical Aid as 50% credit off the tax (NOT deduction from income)
        $medicalCredit = 0;
        if ($medicalContributions > 0) {
            // Medical aid contributions give a 50% tax credit
            $medicalCredit = min($medicalContributions * 0.50, 0); // Will be subtracted from tax later
        }
        
        // 2. Cap NSSA at $700 (USD) or equivalent
        // Convert NSSA to USD if needed (assuming input is in ZiG)
        // For simplicity, we'll assume input is in USD or equivalent
        $nssaCapped = min($nssaContributions, 700);
        
        // Calculate total deductions (with capped NSSA)
        $totalDeductionsAmount = $pensionContributions + $nssaCapped + $totalDeductions + $medicalExpenses;
        
        // Calculate taxable income
        $taxableIncome = $totalIncome + $totalBenefits - $exemptions - $nonTaxableEarnings - $totalDeductionsAmount;
        
        // Ensure taxable income is not negative
        $taxableIncome = max(0, $taxableIncome);
        
        // Calculate PAYE based on Zimbabwe tax bands
        $payeDue = $this->calculatePAYEBasedOnBands($taxableIncome);
        
        // Apply tax credits (including medical aid credit)
        $totalCredits = $credits + abs($medicalCredit);
        $payeDue = max(0, $payeDue - $totalCredits);
        
        // Add AIDS Levy (3% of PAYE - Zimbabwe specific)
        $aidsLevy = $payeDue * 0.03;
        $totalTax = $payeDue + $aidsLevy;
        
        // Calculate net pay
        $netPay = $totalIncome + $totalBenefits - $totalTax - $pensionContributions - $nssaCapped - $totalDeductions;
        
        return response()->json([
            'totalIncome' => $totalIncome,
            'totalBenefits' => $totalBenefits,
            'taxableIncome' => $taxableIncome,
            'payeDue' => $payeDue,
            'medicalCredit' => abs($medicalCredit),
            'nssaCapped' => $nssaCapped,
            'aidsLevy' => $aidsLevy,
            'totalTax' => $totalTax,
            'totalDeductions' => $totalDeductionsAmount,
            'netPay' => $netPay,
            'calculatorType' => 'individual'
        ]);
    }

    private function calculateBusinessPAYE(Request $request) {
        $businessType = $request->input('businessType', 'private');
        $periodType = $request->input('periodType', 'monthly');
        $projectionYears = intval($request->input('projectionYears', 1));
        
        // Business inputs
        $employeeCount = floatval($request->input('employeeCount', 0));
        $totalGrossPayroll = floatval($request->input('totalGrossPayroll', 0));
        $averageSalary = floatval($request->input('averageSalary', 0));
        $annualSalaryIncrease = floatval($request->input('annualSalaryIncrease', 10)) / 100;
        $expectedBonuses = floatval($request->input('expectedBonuses', 15)) / 100;
        $employerContributions = floatval($request->input('employerContributions', 0));
        $nssaEmployerRate = floatval($request->input('nssaEmployerRate', 4.5)) / 100;
        $pensionEmployerRate = floatval($request->input('pensionEmployerRate', 5)) / 100;
        $benefitsPercentage = floatval($request->input('benefitsPercentage', 20)) / 100;
        $credits = floatval($request->input('credits', 0));

        // Calculate current period (Year 1, Period 1)
        $currentPeriod = $this->calculateBusinessPAYEPeriod(
            $employeeCount,
            $totalGrossPayroll,
            $averageSalary,
            $expectedBonuses,
            $employerContributions,
            $nssaEmployerRate,
            $pensionEmployerRate,
            $benefitsPercentage,
            $businessType,
            $periodType,
            $credits,
            1, // year
            1  // period
        );

        // Calculate multi-period projections if needed
        $multiPeriod = [];
        if ($projectionYears > 1 && $employeeCount > 0 && $totalGrossPayroll > 0) {
            $currentPayroll = $totalGrossPayroll;
            $currentEmployees = $employeeCount;
            $currentAvgSalary = $averageSalary;
            
            // Calculate total periods
            $periodsPerYear = $this->getPeriodsPerYear($periodType);
            $totalPeriods = $projectionYears * $periodsPerYear;
            
            for ($periodIndex = 1; $periodIndex <= $totalPeriods; $periodIndex++) {
                // Calculate which year and period this is
                $year = ceil($periodIndex / $periodsPerYear);
                $periodInYear = (($periodIndex - 1) % $periodsPerYear) + 1;
                
                // Apply salary increase compounded annually
                $yearMultiplier = pow(1 + $annualSalaryIncrease, $year - 1);
                
                // Calculate payroll for this period (distribute annual payroll evenly)
                $periodPayroll = ($totalGrossPayroll * $yearMultiplier) / $periodsPerYear;
                
                // Calculate period average salary
                $periodAvgSalary = $averageSalary * $yearMultiplier;
                
                // Calculate credits for this period (distribute evenly)
                $periodCredits = $credits / $periodsPerYear / $projectionYears;
                
                $periodResult = $this->calculateBusinessPAYEPeriod(
                    $currentEmployees,
                    $periodPayroll,
                    $periodAvgSalary,
                    $expectedBonuses,
                    $employerContributions * $yearMultiplier,
                    $nssaEmployerRate,
                    $pensionEmployerRate,
                    $benefitsPercentage,
                    $businessType,
                    $periodType,
                    $periodCredits,
                    $year,
                    $periodInYear
                );
                
                $multiPeriod[] = $periodResult;
            }
        }

        return response()->json([
            'currentPeriod' => $currentPeriod,
            'multiPeriod' => $multiPeriod,
            'calculatorType' => 'business',
            'businessType' => $businessType,
            'periodType' => $periodType,
            'projectionYears' => $projectionYears,
            'summary' => [
                'totalEmployees' => $employeeCount,
                'totalPayroll' => $totalGrossPayroll,
                'totalPAYELiability' => $currentPeriod['payeLiability'],
                'totalStaffCost' => $currentPeriod['totalCost'],
                'taxPercentage' => $currentPeriod['taxPercentage'],
                'zimdef' => $currentPeriod['zimdef'],
                'sdf' => $currentPeriod['sdf'],
                'totalStatutoryCost' => $currentPeriod['totalStatutoryCost']
            ]
        ]);
    }

    private function calculateBusinessPAYEPeriod(
        $employeeCount,
        $payrollAmount,
        $averageSalary,
        $bonusPercentage,
        $otherContributions,
        $nssaRate,
        $pensionRate,
        $benefitsRate,
        $businessType,
        $periodType,
        $credits = 0,
        $year = 1,
        $period = 1
    ) {
        // Calculate bonuses for the period
        $bonuses = $payrollAmount * $bonusPercentage;
        
        // ZIMBABWE-SPECIFIC BUSINESS LOGIC:
        
        // 1. Calculate employer contributions with NSSA cap per employee
        $periodsPerYear = $this->getPeriodsPerYear($periodType);
        $annualNssaPerEmployee = min($averageSalary * $nssaRate * $periodsPerYear, 700);
        $nssaContributions = ($annualNssaPerEmployee / $periodsPerYear) * $employeeCount;
        
        // Calculate pension contributions
        $pensionContributions = $payrollAmount * $pensionRate;
        
        // Calculate benefits
        $benefits = $payrollAmount * $benefitsRate;
        
        // 2. Add ZIMDEF (1%) and SDF (0.5%) as mandatory business costs
        $zimdef = $payrollAmount * 0.01; // 1% ZIMDEF
        $sdf = $payrollAmount * 0.005; // 0.5% Skills Development Fund
        
        // Calculate total taxable amount per employee
        $totalPayeLiability = 0;
        
        if ($employeeCount > 0 && $payrollAmount > 0) {
            // Calculate per employee taxable income
            $perEmployeeSalary = $payrollAmount / $employeeCount;
            $perEmployeeBenefits = $benefits / $employeeCount;
            
            // For each employee (simplified - in reality would loop through actual salaries)
            $perEmployeeTaxable = $perEmployeeSalary + $perEmployeeBenefits;
            
            // Calculate PAYE for this taxable amount
            $perEmployeePAYE = $this->calculatePAYEBasedOnBands($perEmployeeTaxable);
            
            // Total PAYE liability
            $totalPayeLiability = $perEmployeePAYE * $employeeCount;
        }
        
        // Apply credits
        $payeLiability = max(0, $totalPayeLiability - $credits);
        
        // Add AIDS Levy (3%)
        $aidsLevy = $payeLiability * 0.03;
        $totalPAYE = $payeLiability + $aidsLevy;
        
        // Calculate total cost to employer including all statutory costs
        $totalCost = $payrollAmount + $bonuses + $nssaContributions + $pensionContributions + 
                    $benefits + $otherContributions + $totalPAYE + $zimdef + $sdf;
        
        // Calculate tax as percentage of total cost
        $taxPercentage = $totalCost > 0 ? $totalPAYE / $totalCost : 0;
        
        // Calculate statutory costs percentage
        $statutoryCosts = $nssaContributions + $zimdef + $sdf;
        $totalStatutoryCost = $statutoryCosts + $totalPAYE;
        
        // Generate period name
        $periodName = $this->getPeriodName($periodType, $period, $year);

        return [
            'period' => $periodName,
            'employeeCount' => $employeeCount,
            'totalPayroll' => $payrollAmount,
            'averageSalary' => $averageSalary,
            'bonuses' => $bonuses,
            'nssaContributions' => $nssaContributions,
            'nssaCappedPerEmployee' => $annualNssaPerEmployee / $periodsPerYear,
            'pensionContributions' => $pensionContributions,
            'benefits' => $benefits,
            'otherContributions' => $otherContributions,
            'zimdef' => $zimdef,
            'sdf' => $sdf,
            'payeLiability' => $payeLiability,
            'aidsLevy' => $aidsLevy,
            'totalTax' => $totalPAYE,
            'totalCost' => $totalCost,
            'taxPercentage' => $taxPercentage,
            'statutoryCosts' => $statutoryCosts,
            'totalStatutoryCost' => $totalStatutoryCost,
            'businessType' => $businessType,
            'statutoryBreakdown' => [
                'nssa' => $nssaContributions,
                'zimdef' => $zimdef,
                'sdf' => $sdf,
                'paye' => $totalPAYE
            ]
        ];
    }

    private function calculatePAYEBasedOnBands($taxableIncome) {
        // Get Zimbabwe PAYE bands from database
        $bands = DB::table('paye_bands')
            ->where('min_income', '>=', 0)
            ->orderBy('min_income')
            ->get();
        
        // If no bands in database, use Zimbabwe 2025/2026 bands (Monthly USD)
        if ($bands->isEmpty()) {
            $bands = collect([
                (object) ['min_income' => 0, 'max_income' => 100, 'rate' => 0.00, 'deduct' => 0],
                (object) ['min_income' => 100.01, 'max_income' => 300, 'rate' => 0.20, 'deduct' => 20],
                (object) ['min_income' => 300.01, 'max_income' => 1000, 'rate' => 0.25, 'deduct' => 35],
                (object) ['min_income' => 1000.01, 'max_income' => 2000, 'rate' => 0.30, 'deduct' => 85],
                (object) ['min_income' => 2000.01, 'max_income' => 3000, 'rate' => 0.35, 'deduct' => 185],
                (object) ['min_income' => 3000.01, 'max_income' => null, 'rate' => 0.40, 'deduct' => 335]
            ]);
        }

        $taxDue = 0;
        $remainingIncome = $taxableIncome;

        foreach ($bands as $band) {
            if ($remainingIncome <= 0) break;
            
            $bandMin = $band->min_income;
            $bandMax = $band->max_income ?? PHP_INT_MAX;
            
            if ($remainingIncome > $bandMin) {
                $bandAmount = min($remainingIncome, $bandMax) - $bandMin;
                if ($bandAmount > 0) {
                    // Calculate tax for this band: (amount × rate) - deduct
                    $bandTax = ($bandAmount * $band->rate);
                    $taxDue += max(0, $bandTax - $band->deduct);
                    $remainingIncome -= $bandAmount;
                }
            }
        }

        return max(0, $taxDue);
    }

    private function applyBusinessTypeAdjustments($taxableIncome, $businessType) {
        // Apply different adjustments based on business type
        switch ($businessType) {
            case 'pvo':
            case 'ngo':
                // PVOs and NGOs may have tax exemptions
                return $taxableIncome * 0.5; // Example: 50% exemption
            case 'public':
                // Public institutions might have different rates
                return $taxableIncome * 0.8; // Example: 20% reduction
            default:
                // Private companies pay full tax
                return $taxableIncome;
        }
    }

    private function getPeriodsPerYear($periodType) {
        switch ($periodType) {
            case 'monthly': return 12;
            case 'quarterly': return 4;
            case 'annually': return 1;
            default: return 12;
        }
    }

    private function getPeriodName($periodType, $period, $year) {
        $currentYear = date('Y');
        $targetYear = $currentYear + $year - 1;
        
        switch ($periodType) {
            case 'monthly':
                $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return $monthNames[($period - 1) % 12] . ' ' . $targetYear;
                
            case 'quarterly':
                $quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
                return $quarters[($period - 1) % 4] . ' ' . $targetYear;
                
            case 'annually':
                return 'Year ' . $targetYear;
                
            default:
                return 'Period ' . $period . ' ' . $targetYear;
        }
    }

    public function calculateComprehensiveCorporateTax(Request $request) {
        try {
            $profitLoss = $request->input('profitLoss', []);
            $taxComputation = $request->input('taxComputation', []);
            $capitalAllowance = $request->input('capitalAllowance', []);

            Log::info('Received comprehensive tax calculation request:', [
                'profitLoss' => $profitLoss,
                'taxComputation' => $taxComputation,
                'capitalAllowance' => $capitalAllowance
            ]);

            // Calculate Gross Profit
            $sales = floatval($profitLoss['sales'] ?? 0);
            $otherTradingIncome = floatval($profitLoss['otherTradingIncome'] ?? 0);
            $costOfGoodsSold = floatval($profitLoss['costOfGoodsSold'] ?? 0);
            
            $grossProfit = ($sales + $otherTradingIncome) - $costOfGoodsSold;
            
            // Calculate Operating Profit
            $totalOperatingExpenses = 0;
            if (isset($profitLoss['operatingExpenses'])) {
                foreach ($profitLoss['operatingExpenses'] as $expense) {
                    $totalOperatingExpenses += floatval($expense ?? 0);
                }
            }

            $totalOperatingExpenses += floatval($profitLoss['advertisingMarketing'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['trainingEvent'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['bankCharges'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['imtt'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['salaries'] ?? 0);

            $operatingProfit = $grossProfit - $totalOperatingExpenses;
            
            // Tax Computation
            $totalNonTaxableIncome = 0;
            if (isset($taxComputation['nonTaxableIncome'])) {
                foreach ($taxComputation['nonTaxableIncome'] as $income) {
                    $totalNonTaxableIncome += floatval($income ?? 0);
                }
            }

            $totalNonDeductibleExpenses = 0;
            if (isset($taxComputation['nonDeductibleExpenses'])) {
                foreach ($taxComputation['nonDeductibleExpenses'] as $expense) {
                    $totalNonDeductibleExpenses += floatval($expense ?? 0);
                }
            }

            $taxableIncome = $operatingProfit;
            $taxableIncome -= $totalNonTaxableIncome;
            $taxableIncome += $totalNonDeductibleExpenses;
            
            $totalTaxIncome = 0;
            if (isset($taxComputation['taxIncome'])) {
                foreach ($taxComputation['taxIncome'] as $income) {
                    $totalTaxIncome += floatval($income ?? 0);
                }
            }
            $taxableIncome += $totalTaxIncome;
            
            $totalTaxExpenditure = 0;
            if (isset($taxComputation['taxExpenditure'])) {
                foreach ($taxComputation['taxExpenditure'] as $expense) {
                    $totalTaxExpenditure += floatval($expense ?? 0);
                }
            }
            $taxableIncome -= $totalTaxExpenditure;
            
            $totalCapitalAllowance = 0;
            if (isset($capitalAllowance)) {
                foreach ($capitalAllowance as $assetValue) {
                    $totalCapitalAllowance += floatval($assetValue ?? 0);
                }
            }
            $taxableIncome -= $totalCapitalAllowance;
            
            $taxableIncome = max(0, $taxableIncome);
            
            $taxRate = $this->getTaxRate('Corporate_Income') ?: 0.25;
            $taxDue = $taxableIncome * $taxRate;
            
            $aidsLevy = $taxDue * 0.03;
            $totalTax = $taxDue + $aidsLevy;

            return response()->json([
                'grossProfit' => round($grossProfit, 2),
                'operatingProfit' => round($operatingProfit, 2),
                'taxableIncome' => round($taxableIncome, 2),
                'taxDue' => round($taxDue, 2),
                'aidsLevy' => round($aidsLevy, 2),
                'totalTax' => round($totalTax, 2),
                'costOfGoodsSold' => round($costOfGoodsSold, 2),
                'operatingExpenses' => round($totalOperatingExpenses, 2),
                'nonDeductibleExpenses' => round($totalNonDeductibleExpenses, 2),
                'capitalAllowances' => round($totalCapitalAllowance, 2),
                'calculationDetails' => [
                    'sales' => $sales,
                    'otherTradingIncome' => $otherTradingIncome,
                    'nonTaxableIncome' => $totalNonTaxableIncome,
                    'taxIncome' => $totalTaxIncome,
                    'taxExpenditure' => $totalTaxExpenditure
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Comprehensive corporate tax calculation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Calculation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}