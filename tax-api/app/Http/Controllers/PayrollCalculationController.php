<?php

namespace App\Http\Controllers;

use App\Models\PayrollCalculation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollCalculationController extends Controller
{
    /**
     * Display a listing of the user's payroll calculations.
     */
    public function index(Request $request)
    {
        $query = $request->user()->payrollCalculations()->with(['employee', 'company']);

        // Filter by employee
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by company
        if ($request->has('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        // Filter by period
        if ($request->has('period_year')) {
            $query->where('period_year', $request->period_year);
        }

        if ($request->has('period_month')) {
            $query->where('period_month', $request->period_month);
        }

        // Filter by calculation type
        if ($request->has('calculation_type')) {
            $query->where('calculation_type', $request->calculation_type);
        }

        $calculations = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($calculations);
    }

    /**
     * Store a newly created payroll calculation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'nullable|exists:employees,id',
            'company_id' => 'nullable|exists:companies,id',
            'calculation_type' => 'required|in:single,batch',
            'period_month' => 'required|string',
            'period_year' => 'required|string',
            'gross_salary' => 'required|numeric|min:0',
            'nssa_employee' => 'required|numeric|min:0',
            'nssa_employer' => 'required|numeric|min:0',
            'taxable_income' => 'required|numeric|min:0',
            'paye' => 'required|numeric|min:0',
            'aids_levy' => 'required|numeric|min:0',
            'total_deductions' => 'required|numeric|min:0',
            'net_salary' => 'required|numeric|min:0',
            'allowances' => 'nullable|array',
            'calculation_details' => 'nullable|array',
        ]);

        $validated['user_id'] = $request->user()->id;

        $calculation = PayrollCalculation::create($validated);

        return response()->json($calculation->load(['employee', 'company']), 201);
    }

    /**
     * Display the specified payroll calculation.
     */
    public function show(Request $request, PayrollCalculation $payrollCalculation)
    {
        // Ensure user owns this calculation
        if ($payrollCalculation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($payrollCalculation->load(['employee', 'company']));
    }

    /**
     * Remove the specified payroll calculation.
     */
    public function destroy(Request $request, PayrollCalculation $payrollCalculation)
    {
        // Ensure user owns this calculation
        if ($payrollCalculation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $payrollCalculation->delete();

        return response()->json(['message' => 'Calculation deleted successfully']);
    }

    /**
     * Get payroll statistics.
     */
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total_calculations' => PayrollCalculation::where('user_id', $userId)->count(),
            'total_employees' => $request->user()->employees()->where('is_active', true)->count(),
            'total_companies' => $request->user()->companies()->count(),
            'current_month_payroll' => PayrollCalculation::where('user_id', $userId)
                ->where('period_year', date('Y'))
                ->where('period_month', date('F'))
                ->sum('gross_salary'),
            'current_month_calculations' => PayrollCalculation::where('user_id', $userId)
                ->where('period_year', date('Y'))
                ->where('period_month', date('F'))
                ->count(),
            'recent_calculations' => PayrollCalculation::where('user_id', $userId)
                ->with(['employee', 'company'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Get payroll history grouped by period.
     */
    public function history(Request $request)
    {
        $history = PayrollCalculation::where('user_id', $request->user()->id)
            ->select(
                'period_year',
                'period_month',
                DB::raw('COUNT(*) as calculation_count'),
                DB::raw('SUM(gross_salary) as total_gross'),
                DB::raw('SUM(net_salary) as total_net'),
                DB::raw('SUM(paye) as total_paye'),
                DB::raw('SUM(nssa_employee) as total_nssa')
            )
            ->groupBy('period_year', 'period_month')
            ->orderBy('period_year', 'desc')
            ->orderBy('period_month', 'desc')
            ->get();

        return response()->json($history);
    }
}
