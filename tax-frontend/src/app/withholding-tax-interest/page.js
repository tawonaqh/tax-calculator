import WithholdingInterest from './WithholdingInterest'

export async function generateMetadata() {
  return {
    title: 'Withholding Tax on Interest Zimbabwe | TaxCul',
    description: 'Easily calculate withholding tax on interest earned in Zimbabwe. TaxCul provides instant results and compliance guidance for businesses and individuals.',
    keywords: 'withholding tax Zimbabwe, interest tax, interest withholding, ZIMRA interest tax, non-resident interest, government securities, treasury bills, bond interest, Double Taxation Agreement, DTA rates, Zimbabwe tax calculator',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/withholding-tax-interest',
    },
    openGraph: {
      title: 'Withholding Tax on Interest Zimbabwe | TaxCul',
      description: 'Easily calculate withholding tax on interest earned in Zimbabwe. TaxCul provides instant results and compliance guidance for businesses and individuals.',
      url: 'https://taxcul.com/withholding-tax-interest',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-withholding-interest.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Withholding Tax Calculator for Interest - Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Withholding Tax on Interest Zimbabwe | TaxCul',
      description: 'Easily calculate withholding tax on interest earned in Zimbabwe. TaxCul provides instant results and compliance guidance for businesses and individuals.',
      images: ['/og-withholding-interest.jpg'],
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

export default function WithholdingInterestPage() {
  return <WithholdingInterest />
}