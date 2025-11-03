import PAYETaxCalculator from './PAYETaxCalculator'

export async function generateMetadata() {
  return {
    title: 'PAYE Calculator Zimbabwe | Instantly Calculate Your PAYE Tax',
    description: 'Use TaxCul\'s PAYE Calculator to easily work out your monthly or annual PAYE tax in Zimbabwe. Fast, accurate, and updated with the latest ZIMRA rates.',
    keywords: 'PAYE calculator Zimbabwe, ZIMRA tax calculator, income tax Zimbabwe, tax calculation, salary tax, monthly PAYE, annual PAYE, Zimbabwe revenue authority',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/paye-calculator',
    },
    openGraph: {
      title: 'PAYE Calculator Zimbabwe | Instantly Calculate Your PAYE Tax',
      description: 'Use TaxCul\'s PAYE Calculator to easily work out your monthly or annual PAYE tax in Zimbabwe. Fast, accurate, and updated with the latest ZIMRA rates.',
      url: 'https://taxcul.com/paye-calculator',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-paye.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul PAYE Calculator - Calculate Your Zimbabwe Income Tax',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PAYE Calculator Zimbabwe | Instantly Calculate Your PAYE Tax',
      description: 'Use TaxCul\'s PAYE Calculator to easily work out your monthly or annual PAYE tax in Zimbabwe.',
      images: ['/og-paye.jpg'],
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

export default function PayeCalculatorPage() {
  return <PAYETaxCalculator />
}