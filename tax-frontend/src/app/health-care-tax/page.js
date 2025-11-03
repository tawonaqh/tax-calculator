import HealthcareTaxCalculator from './HealthcareTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'Health Care Tax Zimbabwe | Accurate Tax Breakdown | TaxCul',
    description: 'Explore Health Care Tax in Zimbabwe and calculate your contribution accurately. TaxCul helps you stay compliant with updated ZIMRA health levies for medical services, pharmaceuticals, and healthcare facilities.',
    keywords: 'healthcare tax Zimbabwe, medical services tax, pharmaceutical tax, healthcare levy, medical equipment tax, ZIMRA health tax, hospital tax, healthcare compliance, medical VAT',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/health-care-tax',
    },
    openGraph: {
      title: 'Health Care Tax Zimbabwe | Accurate Tax Breakdown | TaxCul',
      description: 'Explore Health Care Tax in Zimbabwe and calculate your contribution accurately. TaxCul helps you stay compliant with updated ZIMRA health levies.',
      url: 'https://taxcul.com/health-care-tax',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-healthcare-tax.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Health Care Tax Calculator - Calculate Medical Services Taxes in Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Health Care Tax Zimbabwe | Accurate Tax Breakdown | TaxCul',
      description: 'Explore Health Care Tax in Zimbabwe and calculate your contribution accurately. Stay compliant with ZIMRA health levies.',
      images: ['/og-healthcare-tax.jpg'],
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

export default function HealthcareTaxPage() {
  return <HealthcareTaxCalculator />
}