# Testing Guide - Payroll Management System

## Prerequisites

### Backend Running
```bash
cd tax-api
php artisan serve
# Should be running on http://localhost:8000
```

### Frontend Running
```bash
cd tax-frontend
npm run dev
# Should be running on http://localhost:3000
```

### Database
- Migrations should be run: `php artisan migrate`
- Seeders optional: `php artisan db:seed`

## 🧪 Complete Testing Flow

### 1. Authentication Flow

#### Register New User
1. Navigate to http://localhost:3000/register
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Register"
4. Should redirect to dashboard

**Expected**: User created, logged in, redirected to /dashboard

#### Login
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Login"

**Expected**: Logged in, redirected to /dashboard

#### Forgot Password
1. Navigate to http://localhost:3000/forgot-password
2. Enter email: test@example.com
3. Click "Send Reset Link"
4. Check email for reset link (or check logs)

**Expected**: Email sent with reset token

#### Reset Password
1. Click reset link from email
2. Enter new password
3. Confirm password
4. Submit

**Expected**: Password updated, can login with new password

### 2. Dashboard Testing

#### View Dashboard
1. Login and navigate to http://localhost:3000/dashboard
2. Check for:
   - Stats cards (should show 0 for new user)
   - Quick action buttons
   - Recent calculations (empty state)

**Expected**: Dashboard loads with empty state

### 3. Company Management

#### Create Company
1. From dashboard, click "Add Company" or navigate to /company/profile
2. Fill in:
   - Company Name: Test Company Ltd
   - Address: 123 Test Street, Harare
   - Phone: +263 123 456 789
   - Email: info@testcompany.com
3. Upload logo (optional)
4. Click "Save Company"

**Expected**: Company created, success message shown

#### Edit Company
1. Navigate to /company/profile
2. Modify company details
3. Click "Update Company"

**Expected**: Company updated, success message shown

#### Upload Logo
1. Navigate to /company/profile
2. Click "Choose File"
3. Select an image
4. Click "Upload Logo"

**Expected**: Logo uploaded and displayed

### 4. Employee Management

#### Add Employee
1. Navigate to http://localhost:3000/employees
2. Click "+ Add Employee"
3. Fill in modal:
   - Employee Number: EMP001
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +263 771 234 567
   - Department: IT
   - Position: Developer
   - Basic Salary: 1500
   - Company: Select "Test Company Ltd"
   - Status: Active
   - Hire Date: 2024-01-01
4. Click "Add Employee"

**Expected**: Employee added, modal closes, employee appears in list

#### Search Employee
1. In search box, type "John"
2. List should filter

**Expected**: Only matching employees shown

#### Filter by Company
1. Select company from dropdown
2. List should filter

**Expected**: Only employees from that company shown

#### Filter by Status
1. Select "Active" or "Inactive"
2. List should filter

**Expected**: Only employees with that status shown

#### Edit Employee
1. Click "Edit" on an employee
2. Modify details
3. Click "Update Employee"

**Expected**: Employee updated, changes reflected in list

#### Delete Employee
1. Click "Delete" on an employee
2. Confirm deletion
3. Employee removed

**Expected**: Employee deleted, removed from list

### 5. Payroll Calculation with Save

#### Calculate and Save
1. Navigate to http://localhost:3000/simple-payroll
2. Check "Save this calculation to history"
3. Select employee from dropdown (should auto-fill data)
4. Select company from dropdown
5. Enter/verify:
   - Basic Salary: 1500
   - Allowances (optional)
6. Click "Calculate"
7. View results

**Expected**: 
- Calculation performed
- Results displayed
- Success message: "Calculation saved successfully!"
- Link to view history

#### Calculate Without Save
1. Uncheck "Save this calculation to history"
2. Enter salary: 2000
3. Click "Calculate"

**Expected**: 
- Calculation performed
- Results displayed
- No save message

#### Auto-fill from Employee
1. Check "Save this calculation to history"
2. Select an employee from dropdown
3. Form should auto-fill with:
   - Employee name
   - Employee number
   - Department
   - Position
   - Basic salary
   - Company (if employee has one)

**Expected**: Form auto-populated with employee data

### 6. Calculation History

#### View History
1. Navigate to http://localhost:3000/payroll/history
2. Should see saved calculations

**Expected**: List of calculations displayed

#### Filter by Month
1. Select a month from dropdown
2. List should filter

**Expected**: Only calculations from that month shown

#### Filter by Year
1. Select a year from dropdown
2. List should filter

**Expected**: Only calculations from that year shown

#### Filter by Employee
1. Select an employee from dropdown
2. List should filter

**Expected**: Only calculations for that employee shown

#### Filter by Company
1. Select a company from dropdown
2. List should filter

**Expected**: Only calculations for that company shown

#### View Calculation Details
1. Click "View" on a calculation
2. Modal should open with:
   - Employee information
   - Earnings breakdown
   - Deductions breakdown
   - Net salary
   - Employer contributions

**Expected**: Detailed modal with all calculation data

#### Delete Calculation
1. Click "Delete" on a calculation
2. Confirm deletion
3. Calculation removed

**Expected**: Calculation deleted, removed from list

### 7. Navigation Testing

#### User Dropdown Menu
1. Click on user name in header
2. Should see dropdown with:
   - Dashboard
   - Employees
   - Payroll History
   - Company Profile
   - Logout

**Expected**: All menu items visible and clickable

#### Navigate Between Pages
1. Click each menu item
2. Should navigate to correct page

**Expected**: Smooth navigation, no errors

#### Logout
1. Click "Logout" from user menu
2. Should be logged out and redirected

**Expected**: Logged out, redirected to home page

### 8. Batch Payroll Testing

#### Batch Mode
1. Navigate to /simple-payroll
2. Select "Batch Payroll" mode
3. Add multiple employees (up to 20)
4. Calculate batch
5. Generate reports

**Expected**: Batch processing works, reports generated

### 9. Dashboard Stats Update

#### Verify Stats Update
1. After adding employees and calculations
2. Navigate to /dashboard
3. Stats should reflect:
   - Number of employees
   - Number of companies
   - Total calculations
   - Monthly payroll total

**Expected**: Stats accurately reflect data

### 10. Responsive Design

#### Mobile Testing
1. Resize browser to mobile width (375px)
2. Test all pages
3. Check:
   - Navigation works
   - Forms are usable
   - Tables scroll horizontally
   - Buttons are accessible

**Expected**: All features work on mobile

#### Tablet Testing
1. Resize browser to tablet width (768px)
2. Test all pages

**Expected**: All features work on tablet

## 🐛 Common Issues to Check

### Backend Issues
- [ ] CORS errors → Check config/cors.php
- [ ] 401 Unauthorized → Check token in requests
- [ ] 404 Not Found → Check API routes
- [ ] 500 Server Error → Check Laravel logs

### Frontend Issues
- [ ] Blank page → Check browser console
- [ ] API errors → Check network tab
- [ ] Redirect loops → Check auth logic
- [ ] Missing data → Check API responses

## ✅ Success Criteria

### All Features Working
- [ ] User can register and login
- [ ] User can reset password
- [ ] Dashboard shows correct stats
- [ ] Company can be created/edited
- [ ] Logo can be uploaded
- [ ] Employees can be added/edited/deleted
- [ ] Search and filters work
- [ ] Calculations can be performed
- [ ] Calculations can be saved
- [ ] Auto-fill from employee works
- [ ] History shows saved calculations
- [ ] Filters work in history
- [ ] Details modal shows correct data
- [ ] Navigation works smoothly
- [ ] Logout works
- [ ] Responsive on all devices

### Data Integrity
- [ ] Saved calculations match input
- [ ] Employee data persists correctly
- [ ] Company data persists correctly
- [ ] Filters return correct results
- [ ] Stats are accurate

### User Experience
- [ ] Forms are intuitive
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Loading states show
- [ ] Empty states are helpful
- [ ] Navigation is logical

## 📊 Test Data Suggestions

### Companies
1. Test Company Ltd
2. ABC Corporation
3. XYZ Enterprises

### Employees
1. John Doe - Developer - $1500
2. Jane Smith - Manager - $2500
3. Bob Johnson - Accountant - $1800
4. Alice Williams - HR - $1600
5. Charlie Brown - Sales - $1400

### Calculations
- Mix of different months
- Mix of different employees
- Mix of different salary amounts
- Some with allowances, some without

## 🎯 Performance Testing

### Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Employee list loads < 2 seconds
- [ ] History loads < 2 seconds
- [ ] Calculations complete < 1 second

### Concurrent Users
- [ ] Multiple users can login simultaneously
- [ ] Each user sees only their data
- [ ] No data leakage between users

## 📝 Bug Report Template

If you find issues, document them:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[If applicable]

**Browser/Device**:
[Chrome, Firefox, Mobile, etc.]

**Console Errors**:
[Any errors in browser console]
```

---

## 🎊 Ready to Test!

Follow this guide systematically to ensure all features work correctly. Test both happy paths and edge cases.

**Happy Testing!** 🚀
