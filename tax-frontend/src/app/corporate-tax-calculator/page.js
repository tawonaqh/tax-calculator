import CorporateTaxCalculator from './CorporateTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'Corporate Tax Calculator Zimbabwe | Company Tax Made Easy',
    description: 'Use TaxCul\'s Corporate Tax Calculator to estimate company tax in Zimbabwe. Simple, accurate, and built for local business compliance with current tax rates and regulations.',
    keywords: 'corporate tax calculator Zimbabwe, company tax, business tax calculator, Zimbabwe corporate tax, CIT calculator, business compliance, tax due calculator, corporate income tax, ZIMRA corporate tax',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/corporate-tax-calculator',
    },
    openGraph: {
      title: 'Corporate Tax Calculator Zimbabwe | Company Tax Made Easy',
      description: 'Use TaxCul\'s Corporate Tax Calculator to estimate company tax in Zimbabwe. Simple, accurate, and built for local business compliance.',
      url: 'https://taxcul.com/corporate-tax-calculator',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-corporate-tax.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Corporate Tax Calculator - Calculate Company Taxes in Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Corporate Tax Calculator Zimbabwe | Company Tax Made Easy',
      description: 'Use TaxCul\'s Corporate Tax Calculator to estimate company tax in Zimbabwe. Simple, accurate business tax calculations.',
      images: ['/og-corporate-tax.jpg'],
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

export default function CorporateTaxPage() {
  return <CorporateTaxCalculator />
}