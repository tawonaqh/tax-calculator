import AgricultureTaxCalculator from './AgricultureTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'Agriculture Tax Zimbabwe | Tax Rates & Calculations | TaxCul',
    description: 'Understand and calculate agriculture-related taxes in Zimbabwe. Use TaxCul to simplify your farming business tax obligations for crop farming, livestock, horticulture, and forestry.',
    keywords: 'agriculture tax Zimbabwe, farming tax, crop tax, livestock tax, horticulture tax, forestry tax, agricultural income tax, farming business Zimbabwe, ZIMRA agriculture tax',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/agriculture-tax',
    },
    openGraph: {
      title: 'Agriculture Tax Zimbabwe | Tax Rates & Calculations | TaxCul',
      description: 'Understand and calculate agriculture-related taxes in Zimbabwe. Use TaxCul to simplify your farming business tax obligations today.',
      url: 'https://taxcul.com/agriculture-tax',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-agriculture-tax.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Agriculture Tax Calculator - Calculate Farming Taxes in Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Agriculture Tax Zimbabwe | Tax Rates & Calculations | TaxCul',
      description: 'Understand and calculate agriculture-related taxes in Zimbabwe. Simplify your farming business tax obligations.',
      images: ['/og-agriculture-tax.jpg'],
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

export default function AgricultureTaxPage() {
  return <AgricultureTaxCalculator />
}