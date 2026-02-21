# Authentication Testing Guide

## Quick Test Commands

### 1. Test Registration (Backend)
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

Expected Response:
```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxx",
  "message": "Registration successful"
}
```

### 2. Test Login (Backend)
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "2|xxxxxxxxxxxxxxxxxxxxx",
  "message": "Login successful"
}
```

### 3. Test Protected Endpoint (Without Token)
```bash
curl -X POST http://localhost:8000/api/calculate/simple-paye \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "calculationMethod": "gross",
    "grossSalary": 1000
  }'
```

Expected Response:
```json
{
  "message": "Unauthenticated."
}
```

### 4. Test Protected Endpoint (With Token)
```bash
# Replace YOUR_TOKEN with the token from login/register
curl -X POST http://localhost:8000/api/calculate/simple-paye \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "calculationMethod": "gross",
    "grossSalary": 1000
  }'
```

Expected Response: Calculation results

### 5. Test Logout
```bash
# Replace YOUR_TOKEN with the token from login/register
curl -X POST http://localhost:8000/logout \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected Response:
```json
{
  "message": "Logged out successfully"
}
```

## Frontend Testing Checklist

### Registration Flow
- [ ] Navigate to `/register`
- [ ] Fill in all fields
- [ ] Submit form
- [ ] Check for validation errors (if any)
- [ ] Verify redirect to Simple Payroll
- [ ] Check localStorage for `auth_token`
- [ ] Verify user name appears in header

### Login Flow
- [ ] Logout from header dropdown
- [ ] Navigate to `/login`
- [ ] Enter credentials
- [ ] Submit form
- [ ] Verify redirect to Simple Payroll
- [ ] Check localStorage for `auth_token`
- [ ] Verify user name appears in header

### Protected Route
- [ ] Logout from header
- [ ] Try to access `/simple-payroll` directly
- [ ] Verify redirect to `/login?redirect=/simple-payroll`
- [ ] Login
- [ ] Verify redirect back to `/simple-payroll`

### Logout Flow
- [ ] Click on user name in header
- [ ] Click "Logout"
- [ ] Verify redirect to home page
- [ ] Check localStorage - `auth_token` should be removed
- [ ] Try to access `/simple-payroll`
- [ ] Verify redirect to login

### Token Expiration
- [ ] Login successfully
- [ ] Manually delete token from backend database
- [ ] Try to access Simple Payroll
- [ ] Should redirect to login

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check `tax-api/config/cors.php` and ensure:
```php
'paths' => ['api/*', 'login', 'register', 'logout'],
'allowed_origins' => ['http://localhost:3000'],
```

### Issue: Token Not Being Sent
**Solution:** Check browser console and verify:
1. Token exists in localStorage
2. Axios interceptor is working
3. Request headers include Authorization

### Issue: 401 on Protected Route
**Solution:** 
1. Verify token is valid
2. Check backend logs
3. Ensure Sanctum is configured correctly

### Issue: Redirect Loop
**Solution:**
1. Clear localStorage
2. Check AuthContext logic
3. Verify ProtectedRoute component

## Database Check

### View Users
```bash
cd tax-api
php artisan tinker
```

Then in tinker:
```php
User::all();
```

### View Tokens
```php
DB::table('personal_access_tokens')->get();
```

### Delete All Tokens (for testing)
```php
DB::table('personal_access_tokens')->truncate();
```

## Success Criteria

✅ Users can register with valid data
✅ Users can login with correct credentials
✅ Invalid credentials show error message
✅ Protected routes redirect to login
✅ After login, users redirect back to intended page
✅ User name shows in header when logged in
✅ Logout removes token and redirects to home
✅ Expired/invalid tokens redirect to login
✅ Simple Payroll is only accessible when authenticated
