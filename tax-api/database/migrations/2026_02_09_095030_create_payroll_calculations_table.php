<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payroll_calculations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('calculation_type')->default('single'); // single, batch
            $table->string('period_month');
            $table->string('period_year');
            $table->decimal('gross_salary', 12, 2);
            $table->decimal('nssa_employee', 12, 2)->default(0);
            $table->decimal('nssa_employer', 12, 2)->default(0);
            $table->decimal('taxable_income', 12, 2)->default(0);
            $table->decimal('paye', 12, 2)->default(0);
            $table->decimal('aids_levy', 12, 2)->default(0);
            $table->decimal('total_deductions', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);
            $table->json('allowances')->nullable(); // Store allowances breakdown
            $table->json('calculation_details')->nullable(); // Store full calculation details
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index(['user_id', 'period_year', 'period_month']);
            $table->index(['employee_id', 'period_year', 'period_month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_calculations');
    }
};
