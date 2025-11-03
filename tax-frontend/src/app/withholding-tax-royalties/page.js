import WithholdingRoyalties from './WithholdingRoyalties'

export async function generateMetadata() {
  return {
    title: 'Withholding Tax on Royalties Zimbabwe | TaxCul Calculator',
    description: 'Calculate withholding tax on royalties in Zimbabwe. TaxCul gives you instant results based on the latest ZIMRA withholding tax rates.',
    keywords: 'withholding tax Zimbabwe, royalties tax, ZIMRA withholding, royalty payments, double taxation agreement, DTA rates, non-resident tax, Zimbabwe tax calculator',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/withholding-tax-royalties',
    },
    openGraph: {
      title: 'Withholding Tax on Royalties Zimbabwe | TaxCul Calculator',
      description: 'Calculate withholding tax on royalties in Zimbabwe. TaxCul gives you instant results based on the latest ZIMRA withholding tax rates.',
      url: 'https://taxcul.com/withholding-tax-royalties',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-withholding-royalties.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul Withholding Tax Calculator for Royalties - Zimbabwe',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Withholding Tax on Royalties Zimbabwe | TaxCul Calculator',
      description: 'Calculate withholding tax on royalties in Zimbabwe. TaxCul gives you instant results based on the latest ZIMRA withholding tax rates.',
      images: ['/og-withholding-royalties.jpg'],
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

export default function WithholdingRoyaltiesPage() {
  return <WithholdingRoyalties />
}