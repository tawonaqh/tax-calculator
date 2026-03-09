# TaxCul - Zimbabwe Payroll Management System

A comprehensive web application for calculating taxes and managing payroll in Zimbabwe, featuring **batch payroll processing** with professional report generation.

## 🎉 Complete Payroll Management System

TaxCul has evolved from a simple calculator to a **complete payroll management solution** with batch processing and professional reporting!

### What's New in Latest Version
- ✅ **Batch Payroll Processing** - Process up to 20 employees simultaneously
- ✅ **Professional Reports** - Generate 3 types of compliance reports
- ✅ **TaxCul Branding** - Navy blue theme with subtle logo watermarking
- ✅ **PDF Generation** - Individual payslips and batch reports
- ✅ **NSSA Form P4** - Official Monthly Payment Schedule
- ✅ **PAYE Report** - Tax summary for all employees
- ✅ **Payslip Summary** - Multi-page detailed breakdown
- ✅ **User Authentication** - Register, login, password reset with email
- ✅ **Smart Redirects** - Remember URL feature returns users to their destination after login
- ✅ **Company Management** - Store company info, upload logos
- ✅ **Employee Management** - Full CRUD with search and filters
- ✅ **Payroll Calculations** - Save and track all calculations
- ✅ **Historical Data** - View trends and past calculations
- ✅ **Professional Dashboard** - Real-time stats and analytics
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Quick Links
- 📚 [Complete System Overview](./info/PAYROLL_SYSTEM_COMPLETE.md)
- 📊 [Batch Reports Implementation](./info/BATCH_REPORTS_IMPLEMENTATION.md)
- 🔄 [Redirect After Login Feature](./info/REDIRECT_AFTER_LOGIN_FEATURE.md)
- 🧪 [Testing Guide](./info/TESTING_GUIDE.md)
- 🚀 [Deployment Checklist](./info/DEPLOYMENT_CHECKLIST.md)
- 📋 [Implementation Status](./info/IMPLEMENTATION_STATUS.md)
- 🔧 [Troubleshooting](./info/TROUBLESHOOTING_CHUNK_ERRORS.md)

## 🌟 Features

### Batch Payroll System (NEW!)
- **Batch Processing** - Calculate payroll for up to 20 employees at once
- **Three Professional Reports**:
  1. **Payslip Summary** (3 pages) - Detailed breakdown with earnings, deductions, and employer contributions
  2. **NSSA Form P4** (2 pages) - Official Monthly Payment Schedule for social security
  3. **PAYE Report** (1 page) - Tax summary for all employees
- **Individual Payslips** - Generate separate PDF payslips for each employee
- **ZIP Download** - All reports packaged together for easy distribution
- **TaxCul Branding** - Professional navy blue theme with logo watermarking
- **Company Branding** - Include company logo and details on all reports

### Payroll Management System
- **Dashboard** - Real-time statistics and recent calculations
- **Company Profiles** - Manage company information and branding
- **Employee Management** - Full CRUD operations with search/filter
- **Payroll Calculator** - Enhanced with save functionality
- **Calculation History** - Track and analyze payroll data
- **Auto-fill** - Populate forms from employee data
- **Professional Payslips** - Generate and download payslips

### Tax Calculators
- **PAYE Calculator** - Zimbabwe PAYE with NSSA calculations
- **Simple Payroll** - Comprehensive payroll system (single & batch)
- **Individual Income Tax** - Calculate personal income tax
- **Withholding Tax** - Interest, Tenders, Royalties, Fees
- **VAT Calculator** - Value Added Tax calculations
- **Corporate Tax** - Business tax calculations
- **Agriculture Tax** - Farming income tax
- **Insurance Tax** - Premium tax calculations
- **Financial Tax** - Banking levies
- **Healthcare Tax** - Medical services tax

### Key Features
- 🔐 **Secure Authentication** - JWT tokens with Sanctum
- 🔄 **Smart Redirects** - Remember URL feature for seamless navigation
- 💾 **Data Persistence** - All calculations saved to database
- 📊 **Analytics Dashboard** - Track payroll trends
- 🎨 **Modern UI** - Beautiful navy blue theme with TaxCul branding
- ⚡ **Real-time Calculations** - Instant results
- 📱 **Mobile Friendly** - Works on all devices
- 🔄 **Batch Processing** - Process up to 20 employees
- 📄 **PDF Generation** - Professional payslips and compliance reports
- 🏢 **Company Branding** - Include your logo on all documents
- 📋 **NSSA Compliance** - Official Form P4 generation
- 💼 **PAYE Reporting** - Tax summary reports
- 🎯 **One-Click Reports** - Generate all 3 reports in one ZIP file

## 🚀 Technology Stack

### Backend
- **Framework**: Laravel 11
- **Database**: MySQL/SQLite
- **Authentication**: Laravel Sanctum (JWT)
- **API**: RESTful with 18+ endpoints

### Frontend
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **State**: React Context API
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Generation**: jsPDF, jspdf-autotable, html2canvas
- **File Handling**: JSZip for batch downloads

## 🛠 Installation & Setup

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL/SQLite
- npm or yarn

### Backend Setup (Laravel)

1. **Navigate to backend directory**
   ```bash
   cd tax-api
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database** (edit `.env`)
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tax_calculator
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Start server**
   ```bash
   php artisan serve
   ```
   Backend runs on: http://localhost:8000

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd tax-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

## 📁 Project Structure

```
Zimbabwe Tax Calculator
├── tax-api/                          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Auth/                # Authentication
│   │   │   ├── CompanyController.php
│   │   │   ├── EmployeeController.php
│   │   │   └── PayrollCalculationController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Company.php
│   │   │   ├── Employee.php
│   │   │   └── PayrollCalculation.php
│   │   └── Mail/                    # Email templates
│   ├── database/
│   │   ├── migrations/              # Database schema
│   │   └── seeders/                 # Sample data
│   └── routes/
│       └── api.php                  # API routes
│
└── tax-frontend/                     # Next.js Frontend
    ├── src/
    │   ├── app/                      # Pages
    │   │   ├── dashboard/           # Dashboard page
    │   │   ├── company/profile/     # Company management
    │   │   ├── employees/           # Employee management
    │   │   ├── payroll/history/     # Calculation history
    │   │   ├── simple-payroll/      # Payroll calculator
    │   │   ├── login/               # Authentication
    │   │   └── register/
    │   ├── components/               # React components
    │   │   ├── Dashboard/
    │   │   ├── Company/
    │   │   ├── Employees/
    │   │   ├── Payroll/
    │   │   └── Auth/
    │   ├── contexts/
    │   │   └── AuthContext.js       # Authentication state
    │   ├── lib/
    │   │   ├── authApi.js           # Auth API client
    │   │   └── payrollApi.js        # Payroll API client
    │   └── modules/                  # Modular calculators
    │       ├── shared/              # Reusable components
    │       └── paye-calculator/     # PAYE module
    └── public/                       # Static assets
```

## 🎯 User Journey

### Batch Payroll Processing (NEW!)
1. **Navigate to Simple Payroll** → Access batch payroll feature
2. **Switch to Batch Mode** → Toggle from single to batch processing
3. **Add Employees** → Add up to 20 employees with salary details
4. **Calculate Batch** → Process all employees at once
5. **Generate Reports** → Click "Batch Reports (3)" button
6. **Download ZIP** → Get all three reports in one file:
   - Payslip Summary (3 pages)
   - NSSA Form P4 (2 pages)
   - PAYE Report (1 page)
7. **Individual Payslips** → Optionally download separate payslips for each employee

### New Users
1. **Register** → Create account with email
2. **Add Company** → (Optional) Set up company profile with logo
3. **Add Employees** → (Optional) Add employee records
4. **Calculate Payroll** → Use Simple Payroll calculator (single or batch)
5. **Generate Reports** → Download professional PDF reports
6. **Save & Track** → Save calculations and view history

### Returning Users
1. **Login** → Access dashboard
2. **View Stats** → See payroll overview
3. **Quick Actions** → Navigate to features
4. **Calculate** → Run new payroll
5. **Review History** → Track past calculations

## 📋 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/companies/{id}` - Get company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company
- `POST /api/companies/{id}/logo` - Upload logo

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/{id}` - Get employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Payroll
- `GET /api/payroll` - List calculations
- `POST /api/payroll` - Create calculation
- `GET /api/payroll/{id}` - Get calculation
- `DELETE /api/payroll/{id}` - Delete calculation
- `GET /api/payroll-stats` - Get statistics
- `GET /api/payroll-history` - Get history

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Navy Blue (#0F2F4E) + Green (#1ED760) + Gold (#FFD700)
- **TaxCul Branding**: Subtle logo watermarking on all reports
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding and margins
- **Icons**: Lucide React for consistency
- **Borders**: Professional navy blue borders on reports

### Report Features
- **Multi-page PDFs**: Professional layout with headers and footers
- **Company Branding**: Include company logo and details
- **TaxCul Identity**: Subtle logo for system identification
- **Navy Blue Theme**: Consistent color scheme across all reports
- **Signature Lines**: Authorization fields on reports
- **Page Numbering**: Clear page indicators
- **Currency Display**: USD formatting throughout

### Interactive Elements
- **Hover Effects**: Smooth transitions
- **Loading States**: Animated spinners
- **Error Handling**: User-friendly messages
- **Form Validation**: Real-time validation
- **Modal Dialogs**: For forms and details
- **Success Messages**: Clear feedback

## 🔐 Security Features

- JWT authentication with Laravel Sanctum
- Protected API routes
- Row-level security (users only see their data)
- CSRF protection
- Password hashing (bcrypt)
- Email verification (optional)
- Rate limiting
- Secure session management

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

### Quick Test Flow
1. Register a new user
2. Login to dashboard
3. Add a company
4. Add an employee
5. Calculate payroll
6. Save calculation
7. View history

## 🚀 Deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed deployment instructions.

### Quick Deploy

#### Backend
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

#### Frontend
```bash
npm install --production
npm run build
npm start
```

### Recommended Platforms
- **Backend**: VPS (Ubuntu/Nginx), Shared Hosting (cPanel)
- **Frontend**: Vercel, Netlify, VPS

## 📚 Documentation

### Payroll Management System
- [Complete System Overview](./info/PAYROLL_SYSTEM_COMPLETE.md)
- [Batch Reports Implementation](./info/BATCH_REPORTS_IMPLEMENTATION.md)
- [Implementation Status](./info/IMPLEMENTATION_STATUS.md)
- [Frontend Progress](./info/FRONTEND_PROGRESS.md)
- [Backend API Documentation](./info/BACKEND_API_COMPLETE.md)
- [Testing Guide](./info/TESTING_GUIDE.md)
- [Deployment Checklist](./info/DEPLOYMENT_CHECKLIST.md)
- [Troubleshooting Guide](./info/TROUBLESHOOTING_CHUNK_ERRORS.md)
- [Quick Summary](./info/QUICK_IMPLEMENTATION_SUMMARY.md)

### Tax Information
- [Zimbabwe Tax Rates 2025/2026](./info/ZIMBABWE_TAX_RATES_2025_2026.md)

### Modularization (In Progress)
- [Modularization Index](./info/MODULARIZATION_INDEX.md)
- [Developer Quick Start](./info/DEVELOPER_QUICK_START.md)
- [Progress Tracker](./info/MODULARIZATION_PROGRESS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing patterns
- Write clean, documented code
- Test thoroughly
- Ensure responsive design
- Verify API integration

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support:
1. Check existing documentation
2. Review testing guide
3. Open an issue with details

## 🔮 Roadmap

### Completed ✅
- [x] User authentication system
- [x] Company management with logo upload
- [x] Employee management
- [x] Payroll calculation persistence
- [x] Historical tracking
- [x] Professional dashboard
- [x] Responsive design
- [x] Batch payroll processing (up to 20 employees)
- [x] Three professional compliance reports
- [x] Individual payslip generation
- [x] NSSA Form P4 generation
- [x] PAYE Report generation
- [x] TaxCul branding and identity
- [x] Navy blue theme implementation
- [x] PDF generation with company branding
- [x] ZIP file packaging for batch downloads

### Future Enhancements
- [ ] Email payslips to employees
- [ ] Multi-currency support
- [ ] Advanced reporting and analytics
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Bulk import employees (CSV/Excel)
- [ ] Payroll templates
- [ ] Tax filing integration
- [ ] Payroll scheduling and automation
- [ ] Employee self-service portal
- [ ] Leave management integration
- [ ] Overtime calculation automation

## 📊 Statistics

- **Backend Endpoints**: 18+
- **Frontend Pages**: 10+
- **Components**: 25+
- **Database Tables**: 6
- **Features**: 25+
- **Lines of Code**: 15,000+
- **PDF Report Types**: 3
- **Batch Processing Capacity**: 20 employees
- **Supported Tax Calculators**: 10+

## 🎊 What Makes This Special

1. **Complete System**: Not just a calculator - full payroll management with batch processing
2. **Zimbabwe-Specific**: Accurate PAYE, NSSA, and tax calculations for 2025/2026
3. **Batch Processing**: Process up to 20 employees simultaneously
4. **Professional Reports**: Three compliance-ready reports (Payslip Summary, NSSA Form P4, PAYE Report)
5. **Data Persistence**: All calculations saved and trackable
6. **Professional UI**: Clean, modern navy blue theme with TaxCul branding
7. **Company Branding**: Include your company logo on all reports
8. **One-Click Downloads**: All reports packaged in ZIP files
9. **Scalable**: Built with best practices for future growth
10. **Secure**: JWT authentication, row-level security
11. **Responsive**: Works on desktop, tablet, and mobile
12. **Well-Documented**: Comprehensive documentation and troubleshooting guides

---

**Built with ❤️ for Zimbabwe businesses by TaxCul**

*A complete payroll management solution that goes beyond simple calculations to provide comprehensive business tools with professional reporting.*

**Version 3.0** - Batch Payroll Processing & Professional Reports 🚀
