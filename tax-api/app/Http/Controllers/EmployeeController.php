<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the user's employees.
     */
    public function index(Request $request)
    {
        $query = $request->user()->employees()->with('company');

        // Filter by company
        if ($request->has('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('employee_number', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $employees = $query->latest()->get();

        return response()->json($employees);
    }

    /**
     * Store a newly created employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'nullable|exists:companies,id',
            'employee_number' => 'nullable|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'id_number' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'base_salary' => 'nullable|numeric|min:0',
            'allowances' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['user_id'] = $request->user()->id;

        $employee = Employee::create($validated);

        return response()->json($employee->load('company'), 201);
    }

    /**
     * Display the specified employee.
     */
    public function show(Request $request, Employee $employee)
    {
        // Ensure user owns this employee
        if ($employee->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($employee->load('company'));
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, Employee $employee)
    {
        // Ensure user owns this employee
        if ($employee->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'company_id' => 'nullable|exists:companies,id',
            'employee_number' => 'nullable|string|max:255',
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'id_number' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'base_salary' => 'nullable|numeric|min:0',
            'allowances' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $employee->update($validated);

        return response()->json($employee->load('company'));
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Request $request, Employee $employee)
    {
        // Ensure user owns this employee
        if ($employee->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }

    /**
     * Get employee's payroll calculation history.
     */
    public function calculations(Request $request, Employee $employee)
    {
        // Ensure user owns this employee
        if ($employee->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $calculations = $employee->payrollCalculations()
            ->orderBy('period_year', 'desc')
            ->orderBy('period_month', 'desc')
            ->get();

        return response()->json($calculations);
    }
}
