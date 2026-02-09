# Zimbabwe Tax Calculator - Complete Payroll Management System

A comprehensive web application for calculating various types of taxes in Zimbabwe, now featuring a **complete payroll management system** with employee tracking, company profiles, and historical data analysis.

## 🎉 NEW: Complete Payroll Management System

This system has evolved from a simple calculator to a **complete payroll management solution**!

### What's New
- ✅ **User Authentication** - Register, login, password reset with email
- ✅ **Company Management** - Store company info, upload logos
- ✅ **Employee Management** - Full CRUD with search and filters
- ✅ **Payroll Calculations** - Save and track all calculations
- ✅ **Historical Data** - View trends and past calculations
- ✅ **Professional Dashboard** - Real-time stats and analytics
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Quick Links
- 📚 [Complete System Overview](./PAYROLL_SYSTEM_COMPLETE.md)
- 🧪 [Testing Guide](./TESTING_GUIDE.md)
- 🚀 [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 📊 [Implementation Status](./IMPLEMENTATION_STATUS.md)

## 🌟 Features

### Payroll Management System (NEW!)
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
- 💾 **Data Persistence** - All calculations saved to database
- 📊 **Analytics Dashboard** - Track payroll trends
- 🎨 **Modern UI** - Beautiful, responsive design
- ⚡ **Real-time Calculations** - Instant results
- 📱 **Mobile Friendly** - Works on all devices
- 🔄 **Batch Processing** - Process up to 20 employees
- 📄 **PDF Generation** - Professional payslips and reports

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

### New Users
1. **Register** → Create account with email
2. **Add Company** → (Optional) Set up company profile
3. **Add Employees** → (Optional) Add employee records
4. **Calculate Payroll** → Use Simple Payroll calculator
5. **Save & Track** → Save calculations and view history

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
- **Color Scheme**: Navy Blue (#0F2F4E) + Green (#1ED760)
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding and margins
- **Icons**: Lucide React for consistency

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
- [Complete System Overview](./PAYROLL_SYSTEM_COMPLETE.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [Frontend Progress](./FRONTEND_PROGRESS.md)
- [Backend API Documentation](./BACKEND_API_COMPLETE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Quick Summary](./QUICK_IMPLEMENTATION_SUMMARY.md)

### Modularization (In Progress)
- [Modularization Index](./MODULARIZATION_INDEX.md)
- [Developer Quick Start](./DEVELOPER_QUICK_START.md)
- [Progress Tracker](./MODULARIZATION_PROGRESS.md)

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
- [x] Company management
- [x] Employee management
- [x] Payroll calculation persistence
- [x] Historical tracking
- [x] Professional dashboard
- [x] Responsive design

### Future Enhancements
- [ ] Export to Excel/PDF
- [ ] Email payslips to employees
- [ ] Multi-currency support
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Bulk import employees
- [ ] Payroll templates
- [ ] Tax filing integration

## 📊 Statistics

- **Backend Endpoints**: 18+
- **Frontend Pages**: 10+
- **Components**: 20+
- **Database Tables**: 6
- **Features**: 20+
- **Lines of Code**: 10,000+

## 🎊 What Makes This Special

1. **Complete System**: Not just a calculator - full payroll management
2. **Zimbabwe-Specific**: Accurate PAYE, NSSA, and tax calculations
3. **Data Persistence**: All calculations saved and trackable
4. **Professional UI**: Clean, modern, user-friendly interface
5. **Scalable**: Built with best practices for future growth
6. **Secure**: JWT authentication, row-level security
7. **Responsive**: Works on desktop, tablet, and mobile
8. **Well-Documented**: Comprehensive documentation

---

**Built with ❤️ for Zimbabwe businesses**

*A complete payroll management solution that goes beyond simple calculations to provide comprehensive business tools.*

**Version 2.0** - Complete Payroll Management System 🚀
