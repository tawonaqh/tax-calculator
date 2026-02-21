<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    /**
     * Display a listing of the user's companies.
     */
    public function index(Request $request)
    {
        $companies = $request->user()->companies()->latest()->get();
        return response()->json($companies);
    }

    /**
     * Store a newly created company.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        $company = $request->user()->companies()->create($validated);

        return response()->json($company, 201);
    }

    /**
     * Display the specified company.
     */
    public function show(Request $request, Company $company)
    {
        // Ensure user owns this company
        if ($company->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($company);
    }

    /**
     * Update the specified company.
     */
    public function update(Request $request, Company $company)
    {
        // Ensure user owns this company
        if ($company->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        $company->update($validated);

        return response()->json($company);
    }

    /**
     * Remove the specified company.
     */
    public function destroy(Request $request, Company $company)
    {
        // Ensure user owns this company
        if ($company->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete logo if exists
        if ($company->logo_path) {
            Storage::delete($company->logo_path);
        }

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }

    /**
     * Upload company logo.
     */
    public function uploadLogo(Request $request, Company $company)
    {
        // Ensure user owns this company
        if ($company->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        // Delete old logo if exists
        if ($company->logo_path) {
            Storage::delete($company->logo_path);
        }

        // Store new logo
        $path = $request->file('logo')->store('company-logos', 'public');
        $company->update(['logo_path' => $path]);

        return response()->json([
            'message' => 'Logo uploaded successfully',
            'logo_url' => Storage::url($path),
            'company' => $company
        ]);
    }
}
