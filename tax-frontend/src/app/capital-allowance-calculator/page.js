import CapitalAllowanceCalculator from './CapitalAllowanceCalculator'

export async function generateMetadata() {
  return {
    title: 'Capital Allowance Calculator Zimbabwe | Tax Depreciation Tracker',
    description: 'Calculate and track your business\'s Capital Allowances (Wear & Tear, Special Initial Allowance - SIA) in Zimbabwe over multiple periods with TaxCul.',
    keywords: 'Capital Allowance Calculator Zimbabwe, ZIMRA tax depreciation, Wear and Tear, Special Initial Allowance, SIA, W&T, asset register, tax planning',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/capital-allowance-calculator',
    },
    openGraph: {
      title: 'Capital Allowance Calculator Zimbabwe | Tax Depreciation Tracker',
      description: 'Calculate and track your business\'s Capital Allowances (Wear & Tear, SIA) in Zimbabwe.',
      url: 'https://taxcul.com/capital-allowance-calculator',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-ca.jpg', // Placeholder image
          width: 1200,
          height: 630,
          alt: 'TaxCul Capital Allowance Calculator - Track Zimbabwe Tax Depreciation',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    // ... Twitter and Robots metadata follow the PAYE structure
  }
}

export default function CapitalAllowanceCalculatorPage() {
  return <CapitalAllowanceCalculator />
}