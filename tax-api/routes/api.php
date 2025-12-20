<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaxCalculatorController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\FeedbackController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// tax calculator routes
Route::post('/calculate/vat/imported-services', [TaxCalculatorController::class, 'calculateVATImportedServices']);
Route::post('/calculate/vat/taxable-supplies', [TaxCalculatorController::class, 'calculateVATTaxableSupplies']);
Route::post('/calculate/withholding/royalties', [TaxCalculatorController::class, 'calculateWithholdingTaxRoyalties']);
Route::post('/calculate/withholding/fees', [TaxCalculatorController::class, 'calculateWithholdingTaxFees']);
Route::post('/calculate/withholding/interest', [TaxCalculatorController::class, 'calculateWithholdingTaxInterest']);
Route::post('/calculate/withholding/tenders', [TaxCalculatorController::class, 'calculateWithholdingTaxTenders']);
Route::post('/calculate/corporate-income-tax', [TaxCalculatorController::class, 'calculateCorporateIncomeTax']);
Route::post('/calculate/individual-income-tax', [TaxCalculatorController::class, 'calculateIndividualIncomeTax']);
Route::post('/calculate/capital-allowances', [TaxCalculatorController::class, 'calculateCapitalAllowances']);
Route::post('/calculate/capital-allowances/multi-period', [TaxCalculatorController::class, 'calculateMultiPeriodCapitalAllowances']);
Route::post('/calculate/vat-deferment', [TaxCalculatorController::class, 'calculateVATDeferment']);
Route::post('/calculate/tax-relief', [TaxCalculatorController::class, 'calculateTaxRelief']);
Route::post('/calculate/tax-credits', [TaxCalculatorController::class, 'calculateTaxCredits']);
Route::post('/calculate/agriculture', [TaxCalculatorController::class, 'calculateAgricultureTax']);
Route::post('/calculate/insurance', [TaxCalculatorController::class, 'calculateInsuranceTax']);
Route::post('/calculate/financial', [TaxCalculatorController::class, 'calculateFinancialTax']);
Route::post('/calculate/healthcare', [TaxCalculatorController::class, 'calculateHealthcareTax']);
Route::post('/calculate/comprehensive-corporate-tax', [TaxCalculatorController::class, 'calculateComprehensiveCorporateTax']);

//chatbot
Route::post('/chatbot', [ChatbotController::class, 'chat']);

//paye
Route::post('/calculate/paye', [TaxCalculatorController::class, 'calculatePAYE']);

// feedback
Route::post('/feedback', [FeedbackController::class, 'store']);
