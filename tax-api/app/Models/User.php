<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $url = env('FRONTEND_URL') . '/reset-password?token=' . $token . '&email=' . urlencode($this->email);
        
        Mail::to($this->email)->send(new ResetPasswordMail($url));
    }

    /**
     * Get the user's companies.
     */
    public function companies()
    {
        return $this->hasMany(\App\Models\Company::class);
    }

    /**
     * Get the user's employees.
     */
    public function employees()
    {
        return $this->hasMany(\App\Models\Employee::class);
    }

    /**
     * Get the user's payroll calculations.
     */
    public function payrollCalculations()
    {
        return $this->hasMany(\App\Models\PayrollCalculation::class);
    }
}
