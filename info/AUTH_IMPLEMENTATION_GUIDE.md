# Authentication & Authorization Implementation Guide

## Overview
Authentication and authorization have been successfully implemented for the Zimbabwe Tax Calculator application. The Simple Payroll feature is now protected and requires users to log in.

## What Was Implemented

### Backend (Laravel API)

1. **Updated Auth Controllers**
   - `AuthenticatedSessionController.php` - Returns JWT tokens on login
   - `RegisteredUserController.php` - Returns JWT tokens on registration
   - Both controllers now return JSON responses with user data and tokens

2. **Protected Routes**
   - `/api/calculate/simple-paye` - Now requires authentication
   - Uses Laravel Sanctum for API token authentication

3. **API Routes** (`tax-api/routes/api.php`)
   ```php
   Route::middleware(['auth:sanctum'])->group(function () {
       Route::post('/calculate/simple-paye', [TaxCalculatorController::class, 'calculateSimplePAYE']);
   });
   ```

### Frontend (Next.js)

1. **Authentication Context** (`tax-frontend/src/contexts/AuthContext.js`)
   - Manages user authentication state
   - Provides login, register, logout functions
   - Stores JWT tokens in localStorage
   - Auto-checks authentication on app load

2. **Auth Components**
   - `LoginForm.js` - Beautiful login form with validation
   - `RegisterForm.js` - Registration form with password confirmation
   - `ProtectedRoute.js` - HOC to protect routes requiring authentication

3. **Auth Pages**
   - `/login` - Login page
   - `/register` - Registration page

4. **Protected Routes**
   - `/simple-payroll` - Now requires authentication

5. **Updated Header**
   - Shows Login button for unauthenticated users
   - Shows user dropdown with logout for authenticated users
   - User can access Simple Payroll from dropdown

6. **API Service** (`tax-frontend/src/lib/authApi.js`)
   - Axios instance with automatic token injection
   - Handles 401 errors and redirects to login
   - Ready for future authenticated API calls

## How It Works

### User Flow

1. **Unauthenticated User**
   - Visits `/simple-payroll`
   - Gets redirected to `/login?redirect=/simple-payroll`
   - Logs in or registers
   - Gets redirected back to `/simple-payroll`

2. **Authenticated User**
   - Token stored in localStorage
   - Token automatically added to API requests
   - Can access Simple Payroll
   - Can logout from header dropdown

### Authentication Flow

```
User → Login Form → Backend API → JWT Token → localStorage → Protected Route
```

### Token Management

- Tokens stored in `localStorage` as `auth_token`
- Automatically included in API requests via axios interceptor
- Removed on logout or 401 errors
- Checked on app initialization

## Environment Variables

Make sure these are set in `tax-frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
```

For production:
```env
NEXT_PUBLIC_BACKEND_URL=https://taxculapi.com/api
```

## Testing the Implementation

### 1. Start the Backend
```bash
cd tax-api
php artisan serve
```

### 2. Start the Frontend
```bash
cd tax-frontend
npm run dev
```

### 3. Test Registration
1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"
4. Should redirect to Simple Payroll

### 4. Test Login
1. Logout from header dropdown
2. Try to access `/simple-payroll`
3. Should redirect to login
4. Login with credentials
5. Should redirect back to Simple Payroll

### 5. Test Protected API
The Simple Payroll page is now protected. Only authenticated users can access it.

## Security Features

✅ JWT token-based authentication
✅ Password hashing (Laravel default)
✅ CSRF protection (Laravel Sanctum)
✅ Automatic token expiration handling
✅ Secure password validation
✅ Email uniqueness validation
✅ Protected routes on frontend and backend

## Future Enhancements

### Recommended Additions

1. **Email Verification**
   - Already set up in Laravel
   - Just need to enable in frontend

2. **Password Reset**
   - Backend routes already exist
   - Need to create frontend pages

3. **Remember Me**
   - Add checkbox to login form
   - Extend token expiration

4. **Role-Based Access Control**
   - Add roles to users table
   - Protect different calculators based on roles

5. **Social Login**
   - Google OAuth
   - Microsoft OAuth

6. **Two-Factor Authentication**
   - SMS or Email OTP
   - Authenticator app support

## Extending Protection to Other Routes

To protect additional routes, wrap them with `ProtectedRoute`:

```jsx
// In any page.js file
'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import YourComponent from '@/components/YourComponent';

export default function YourPage() {
  return (
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

And add the backend route to the protected group in `tax-api/routes/api.php`:

```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/calculate/simple-paye', [TaxCalculatorController::class, 'calculateSimplePAYE']);
    Route::post('/your-new-endpoint', [YourController::class, 'yourMethod']);
});
```

## Troubleshooting

### Token Not Being Sent
- Check browser console for errors
- Verify token exists in localStorage
- Check axios interceptor is working

### 401 Errors
- Token might be expired
- User might not be authenticated
- Check backend logs

### CORS Issues
- Verify CORS settings in `tax-api/config/cors.php`
- Make sure frontend URL is allowed

### Redirect Loop
- Clear localStorage
- Check ProtectedRoute logic
- Verify AuthContext is working

## Files Modified/Created

### Backend
- ✅ `tax-api/app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- ✅ `tax-api/app/Http/Controllers/Auth/RegisteredUserController.php`
- ✅ `tax-api/routes/api.php`

### Frontend
- ✅ `tax-frontend/src/contexts/AuthContext.js` (new)
- ✅ `tax-frontend/src/components/LoginForm.js` (new)
- ✅ `tax-frontend/src/components/RegisterForm.js` (new)
- ✅ `tax-frontend/src/components/ProtectedRoute.js` (new)
- ✅ `tax-frontend/src/app/login/page.js` (new)
- ✅ `tax-frontend/src/app/register/page.js` (new)
- ✅ `tax-frontend/src/lib/authApi.js` (new)
- ✅ `tax-frontend/src/app/layout.js` (modified)
- ✅ `tax-frontend/src/components/Header.js` (modified)
- ✅ `tax-frontend/src/app/simple-payroll/page.js` (modified)

## Summary

The authentication system is now fully functional and protecting the Simple Payroll feature. Users must register or login to access it. The system uses JWT tokens for API authentication and provides a smooth user experience with automatic redirects and token management.
