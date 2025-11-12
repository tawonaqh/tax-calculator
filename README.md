# Zimbabwe Tax Calculator

A comprehensive web application for calculating various types of taxes in Zimbabwe. Built with Next.js, React, and modern web technologies.

## 🌟 Features

### Tax Calculators
- **Individual Income Tax** - Calculate personal income tax with progressive brackets
- **Withholding Tax (Interest)** - Calculate tax on interest payments to non-residents
- **Withholding Tax (Tenders)** - Calculate tax on government tender contracts
- **Agriculture Tax** - Calculate tax on farming income and production
- **Insurance Tax** - Calculate premium tax and insurance-related taxes
- **Financial Tax** - Calculate banking levies and financial sector taxes
- **Healthcare Tax** - Calculate taxes on medical services and products

### Key Features
- 🎨 **Modern UI** - Beautiful gradient backgrounds with lime accent colors
- ⚡ **Real-time Calculations** - Instant tax calculations with loading states
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎯 **User-Friendly** - Intuitive forms with clear input guidance
- 🔄 **Interactive Results** - Animated results with detailed breakdowns
- 📊 **Tax Information** - Comprehensive tax rate information and tips

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: Node.js/Express (configured via environment variables)

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zimbabwe-tax-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── individual-income-tax/
│   ├── withholding-interest/
│   ├── withholding-tenders/
│   ├── agriculture-tax/
│   ├── insurance-tax/
│   ├── financial-tax/
│   └── healthcare-tax/
├── components/
│   └── (reusable components)
└── lib/
    └── (utility functions)
```

## 🎯 Component Architecture

### Consistent Design Pattern
All tax calculator components follow the same optimized pattern:

```jsx
// InputField component defined OUTSIDE main component for performance
const InputField = ({ label, icon: Icon, value, onChange, placeholder }) => (
  // Consistent styling and behavior
)

const TaxCalculator = () => {
  // State management
  const [formData, setFormData] = useState({...})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // API integration
  const handleCalculate = async (e) => {
    // Standardized API call pattern
  }

  return (
    // Consistent layout structure
  )
}
```

### Performance Optimizations
- ✅ **InputField components** defined outside to prevent recreation
- ✅ **Efficient re-renders** with proper state management
- ✅ **Smooth animations** with Framer Motion
- ✅ **Optimized API calls** with error handling

## 🔧 API Integration

### Backend Requirements
The application expects a backend API with the following endpoints:

```
POST /calculate/individual-income-tax
POST /calculate/withholding/interest
POST /calculate/withholding/tenders
POST /calculate/agriculture
POST /calculate/insurance
POST /calculate/financial
POST /calculate/healthcare
```

### Request Payload
```json
{
  "value": 1000,
  "income": 5000,
  "exemptIncome": 500,
  "deductions": 200
}
```

### Response Format
```json
{
  "taxDue": 750,
  "success": true
}
```

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Light theme with green and navy accents
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding and margins
- **Icons**: Lucide React for consistent iconography

### Interactive Elements
- **Hover Effects**: Smooth transitions on buttons and cards
- **Loading States**: Animated spinners during calculations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Desktop** (1024px+): 3-column layout with sidebar
- **Tablet** (768px - 1023px): Adapted grid layouts
- **Mobile** (< 768px): Single column stack layout

## 🔄 State Management

### Local State Pattern
Each calculator manages its own state independently:
- Form data inputs
- Calculation results
- Loading states
- Error messages

### State Structure
```javascript
{
  formData: {
    value: '',
    income: '',
    exemptIncome: '',
    deductions: ''
  },
  results: {
    taxDue: 0,
    taxableIncome: 0,
    effectiveRate: 0,
    netAmount: 0
  },
  loading: false,
  error: ''
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_BACKEND_URL=https://your-production-api.com/api
```

### Supported Platforms
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing component patterns
- Maintain consistent styling with Tailwind CSS
- Ensure all calculators follow the same architecture
- Test responsive design on multiple devices
- Verify API integration works correctly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Provide steps to reproduce any bugs

## 🔮 Future Enhancements

- [ ] Additional tax calculators
- [ ] Tax saving suggestions
- [ ] Historical tax rate data
- [ ] Export calculation results
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] User accounts for saving calculations

---

Built with ❤️ for Zimbabwe taxpayers and financial professionals.