import FinancialTaxCalculator from './FinancialTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'Banking & Finance Taxes Zimbabwe | TaxCul Insights',
    description: 'Get clarity on taxes affecting Zimbabwe\'s banking and finance sector. Use TaxCul to calculate and manage your financial tax obligations easily for banking levies, transaction taxes, and capital gains.',
    keywords: 'banking tax Zimbabwe, finance taxes, banking levy, financial transaction tax, capital gains tax Zimbabwe, financial institution tax, ZIMRA banking tax, investment tax, corporate tax banking',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/banking-finance-taxes',
    },
    openGraph: {
      title: 'Banking & Finance Taxes Zimbabwe | TaxCul Insights',
      description: 'Get clarity on taxes affecting Zimbabwe\'s banking and finance sector. Use TaxCul to calculate and manage your financial tax obligations easily.',
      url: 'https://taxcul.com/banking-finance-taxes',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-banking-finance-taxes.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Banking & Finance Taxes Calculator - Calculate Financial Sector Taxes in Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Banking & Finance Taxes Zimbabwe | TaxCul Insights',
      description: 'Get clarity on taxes affecting Zimbabwe\'s banking and finance sector. Calculate and manage your financial tax obligations.',
      images: ['/og-banking-finance-taxes.jpg'],
      creator: '@taxcul',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function FinancialTaxPage() {
  return <FinancialTaxCalculator />
}