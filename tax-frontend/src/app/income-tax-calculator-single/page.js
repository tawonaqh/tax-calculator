import IncomeTaxCalculator from './IncomeTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'Income Tax Calculator Zimbabwe | TaxCul App',
    description: 'Quickly calculate your income tax in Zimbabwe using TaxCul. Get accurate PAYE and tax deductions instantly — perfect for employees and employers.',
    keywords: 'income tax calculator Zimbabwe, PAYE calculator Zimbabwe, ZIMRA tax calculator, salary tax Zimbabwe, tax deductions, employee tax, employer tax, Zimbabwe revenue authority',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/income-tax-calculator',
    },
    openGraph: {
      title: 'Income Tax Calculator Zimbabwe | TaxCul App',
      description: 'Quickly calculate your income tax in Zimbabwe using TaxCul. Get accurate PAYE and tax deductions instantly — perfect for employees and employers.',
      url: 'https://taxcul.com/income-tax-calculator',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-income-tax.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Income Tax Calculator - Calculate Your Zimbabwe Income Tax',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Income Tax Calculator Zimbabwe | TaxCul App',
      description: 'Quickly calculate your income tax in Zimbabwe using TaxCul. Get accurate PAYE and tax deductions instantly.',
      images: ['/og-income-tax.jpg'],
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

export default function IncomeTaxCalculatorPage() {
  return <IncomeTaxCalculator />
}