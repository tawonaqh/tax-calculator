import WithholdingTenders from './WithholdingTenders'

export async function generateMetadata() {
  return {
    title: 'Withholding Tax on Tenders Zimbabwe | TaxCul Calculator',
    description: 'Calculate withholding tax for tenders and contracts in Zimbabwe. TaxCul ensures accurate deductions in line with ZIMRA\'s latest tax rates.',
    keywords: 'withholding tax Zimbabwe, tender tax, government contracts, ZIMRA tender withholding, contract payments, procurement tax, government tenders, local authority contracts, SME tax rates, Zimbabwe tax calculator',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/withholding-tax-tenders',
    },
    openGraph: {
      title: 'Withholding Tax on Tenders Zimbabwe | TaxCul Calculator',
      description: 'Calculate withholding tax for tenders and contracts in Zimbabwe. TaxCul ensures accurate deductions in line with ZIMRA\'s latest tax rates.',
      url: 'https://taxcul.com/withholding-tax-tenders',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-withholding-tenders.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Withholding Tax Calculator for Tenders - Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Withholding Tax on Tenders Zimbabwe | TaxCul Calculator',
      description: 'Calculate withholding tax for tenders and contracts in Zimbabwe. TaxCul ensures accurate deductions in line with ZIMRA\'s latest tax rates.',
      images: ['/og-withholding-tenders.jpg'],
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

export default function WithholdingTendersPage() {
  return <WithholdingTenders />
}