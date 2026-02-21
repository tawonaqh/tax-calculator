<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaxCalculatorController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollCalculationController;

// Auth routes (API - no CSRF)
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

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

// Protected routes - require authentication
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/calculate/simple-paye', [TaxCalculatorController::class, 'calculateSimplePAYE']);
    
    // Company Management
    Route::apiResource('companies', CompanyController::class);
    Route::post('companies/{company}/logo', [CompanyController::class, 'uploadLogo']);
    
    // Employee Management
    Route::apiResource('employees', EmployeeController::class);
    Route::get('employees/{employee}/calculations', [EmployeeController::class, 'calculations']);
    
    // Payroll Calculations
    Route::apiResource('payroll', PayrollCalculationController::class)->except(['update']);
    Route::get('payroll-stats', [PayrollCalculationController::class, 'stats']);
    Route::get('payroll-history', [PayrollCalculationController::class, 'history']);
});

// feedback
Route::post('/feedback', [FeedbackController::class, 'store']);

// Serve storage files with CORS
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    return response()->file($filePath, [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, OPTIONS',
        'Access-Control-Allow-Headers' => '*',
    ]);
})->where('path', '.*');
