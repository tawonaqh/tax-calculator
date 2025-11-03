import WithholdingFees from './WithholdingFees'

export async function generateMetadata() {
  return {
    title: 'Withholding Tax on Fees Zimbabwe | Quick Calculator | TaxCul',
    description: 'Find out how much withholding tax applies to service fees in Zimbabwe. TaxCul\'s calculator makes it simple and compliant with ZIMRA guidelines.',
    keywords: 'withholding tax Zimbabwe, service fees tax, professional fees, consultancy fees, ZIMRA withholding, management fees, technical fees, non-resident tax, Zimbabwe tax calculator, fee payments tax',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/withholding-tax-fees',
    },
    openGraph: {
      title: 'Withholding Tax on Fees Zimbabwe | Quick Calculator | TaxCul',
      description: 'Find out how much withholding tax applies to service fees in Zimbabwe. TaxCul\'s calculator makes it simple and compliant with ZIMRA guidelines.',
      url: 'https://taxcul.com/withholding-tax-fees',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-withholding-fees.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Withholding Tax Calculator for Fees - Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Withholding Tax on Fees Zimbabwe | Quick Calculator | TaxCul',
      description: 'Find out how much withholding tax applies to service fees in Zimbabwe. TaxCul\'s calculator makes it simple and compliant with ZIMRA guidelines.',
      images: ['/og-withholding-fees.jpg'],
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

export default function WithholdingFeesPage() {
  return <WithholdingFees />
}