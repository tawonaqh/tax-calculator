import InsuranceTax from './InsuranceTax'

export async function generateMetadata() {
  return {
    title: 'Insurance Tax Zimbabwe | TaxCul',
    description: 'Understand and easily calculate insurance tax in Zimbabwe. TaxCul helps professionals and insurers stay compliant with current tax laws.',
    keywords: 'insurance tax Zimbabwe, premium tax, insurance commission tax, ZIMRA insurance tax, insurance broker tax, policy tax, insurance company tax, Zimbabwe insurance compliance, tax calculator insurance',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/insurance-tax',
    },
    openGraph: {
      title: 'Insurance Tax Zimbabwe | TaxCul',
      description: 'Understand and easily calculate insurance tax in Zimbabwe. TaxCul helps professionals and insurers stay compliant with current tax laws.',
      url: 'https://taxcul.com/insurance-tax',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-insurance-tax.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Insurance Tax Calculator - Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Insurance Tax Zimbabwe | TaxCul',
      description: 'Understand and easily calculate insurance tax in Zimbabwe. TaxCul helps professionals and insurers stay compliant with current tax laws.',
      images: ['/og-insurance-tax.jpg'],
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

export default function InsuranceTaxPage() {
  return <InsuranceTax />
}