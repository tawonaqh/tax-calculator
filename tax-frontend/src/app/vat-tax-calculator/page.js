import VATTaxCalculator from './VATTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'VAT Tax Calculator for Zimbabwe Businesses | TaxCul',
    description: 'Calculate Zimbabwe VAT tax quickly with TaxCul. Input your amount and get accurate inclusive or exclusive VAT values instantly. Perfect for businesses and tax professionals.',
    keywords: 'VAT calculator Zimbabwe, VAT tax calculator, Zimbabwe VAT rates, taxable supplies, VAT calculation, business tax Zimbabwe, VAT registration, tax compliance',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/vat-tax-calculator',
    },
    openGraph: {
      title: 'VAT Tax Calculator for Zimbabwe Businesses | TaxCul',
      description: 'Calculate Zimbabwe VAT tax quickly with TaxCul. Input your amount and get accurate inclusive or exclusive VAT values instantly.',
      url: 'https://taxcul.com/vat-tax-calculator',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-vat-calculator.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul VAT Calculator - Calculate Zimbabwe Value Added Tax',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'VAT Tax Calculator for Zimbabwe Businesses | TaxCul',
      description: 'Calculate Zimbabwe VAT tax quickly with TaxCul. Input your amount and get accurate VAT values instantly.',
      images: ['/og-vat-calculator.jpg'],
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

export default function VATTaxCalculatorPage() {
  return <VATTaxCalculator />
}