import VATImportedServicesCalculator from './VATImportedServicesCalculator'

export async function generateMetadata() {
  return {
    title: 'VAT on Imported Services Calculator | Zimbabwe | TaxCul',
    description: 'Easily calculate VAT on imported services in Zimbabwe. TaxCul helps you determine payable VAT amounts in line with ZIMRA regulations for services acquired from outside Zimbabwe.',
    keywords: 'VAT imported services Zimbabwe, imported services tax, reverse charge VAT, ZIMRA imported services, foreign services VAT, VAT calculator Zimbabwe, tax compliance, cross-border services',
    authors: [{ name: 'TaxCul' }],
    creator: 'TaxCul',
    publisher: 'TaxCul',
    metadataBase: new URL('https://taxcul.com'),
    alternates: {
      canonical: '/vat-imported-services',
    },
    openGraph: {
      title: 'VAT on Imported Services Calculator | Zimbabwe | TaxCul',
      description: 'Easily calculate VAT on imported services in Zimbabwe. TaxCul helps you determine payable VAT amounts in line with ZIMRA regulations.',
      url: 'https://taxcul.com/vat-imported-services',
      siteName: 'TaxCul',
      images: [
        {
          url: '/og-imported-services.jpg',
          width: 1200,
          height: 630,
          alt: 'TaxCul VAT Imported Services Calculator - Calculate VAT on Foreign Services',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'VAT on Imported Services Calculator | Zimbabwe | TaxCul',
      description: 'Easily calculate VAT on imported services in Zimbabwe. Determine payable VAT amounts in line with ZIMRA regulations.',
      images: ['/og-imported-services.jpg'],
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

export default function VATImportedServicesPage() {
  return <VATImportedServicesCalculator />
}