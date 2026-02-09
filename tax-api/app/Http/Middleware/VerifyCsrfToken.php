<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'api/*', // exclude all API routes from CSRF
        'login',
        'register',
        'logout',
    ];
}
