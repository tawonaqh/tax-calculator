<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollCalculation extends Model
{
    protected $fillable = [
        'user_id',
        'employee_id',
        'company_id',
        'calculation_type',
        'period_month',
        'period_year',
        'gross_salary',
        'nssa_employee',
        'nssa_employer',
        'taxable_income',
        'paye',
        'aids_levy',
        'total_deductions',
        'net_salary',
        'allowances',
        'calculation_details',
    ];

    protected $casts = [
        'allowances' => 'array',
        'calculation_details' => 'array',
        'gross_salary' => 'decimal:2',
        'nssa_employee' => 'decimal:2',
        'nssa_employer' => 'decimal:2',
        'taxable_income' => 'decimal:2',
        'paye' => 'decimal:2',
        'aids_levy' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
