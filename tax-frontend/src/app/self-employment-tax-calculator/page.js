import IndividualIncomeTaxCalculator from './IndividualIncomeTaxCalculator'

export async function generateMetadata() {
  return {
    title: 'Self Employment Tax Calculator Zimbabwe | TaxCul',
    description: 'Calculate your self-employment tax in Zimbabwe with ease. TaxCul helps freelancers and entrepreneurs estimate their PAYE and other obligations with progressive tax brackets.',
    keywords: 'self employment tax Zimbabwe, freelance tax calculator, individual income tax, PAYE calculator, freelancer tax, entrepreneur tax, Zimbabwe income tax, personal tax calculator, small business tax',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/self-employment-tax-calculator',
    },
    openGraph: {
      title: 'Self Employment Tax Calculator Zimbabwe | TaxCul',
      description: 'Calculate your self-employment tax in Zimbabwe with ease. TaxCul helps freelancers and entrepreneurs estimate their PAYE and other obligations.',
      url: 'https://taxcul.com/self-employment-tax-calculator',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-self-employment-tax.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Self Employment Tax Calculator - Calculate Freelancer Taxes in Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Self Employment Tax Calculator Zimbabwe | TaxCul',
      description: 'Calculate your self-employment tax in Zimbabwe with ease. Estimate PAYE and tax obligations for freelancers and entrepreneurs.',
      images: ['/og-self-employment-tax.jpg'],
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

export default function SelfEmploymentTaxPage() {
  return <IndividualIncomeTaxCalculator />
}