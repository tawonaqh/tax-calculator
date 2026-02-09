<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'company_id',
        'employee_number',
        'first_name',
        'last_name',
        'email',
        'phone',
        'id_number',
        'position',
        'department',
        'hire_date',
        'base_salary',
        'allowances',
        'is_active',
    ];

    protected $casts = [
        'allowances' => 'array',
        'base_salary' => 'decimal:2',
        'hire_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function payrollCalculations(): HasMany
    {
        return $this->hasMany(PayrollCalculation::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
