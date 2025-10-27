import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVendorBySlug, getVendorWithCategories, getActiveVendors } from '@/lib/api/vendors'
import { VendorPageContent } from '@/components/vendor/public/vendor-page-content'

interface VendorPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate static params for all active vendors
export async function generateStaticParams() {
  const vendors = await getActiveVendors(50) // Limit for build performance
  
  return vendors.map((vendor) => ({
    slug: vendor.slug,
  }))
}

// ISR: Revalidate every hour
export const revalidate = 3600

export default async function VendorPage({ params, searchParams }: VendorPageProps) {
  const vendor = await getVendorWithCategories(params.slug)

  if (!vendor) {
    notFound()
  }

  // Track UTM parameters for analytics
  const utmSource = searchParams.utm_source as string
  const utmMedium = searchParams.utm_medium as string
  const utmCampaign = searchParams.utm_campaign as string

  return (
    <VendorPageContent 
      vendor={vendor}
      utmTracking={{
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      }}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const vendor = await getVendorBySlug(params.slug)
  
  if (!vendor) {
    return {
      title: 'Vendor Not Found',
      description: 'The vendor you are looking for could not be found.',
    }
  }

  const title = `${vendor.name} - Product Catalog`
  const description = vendor.description || `Browse products from ${vendor.name}. Contact us directly for inquiries.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/vendors/${vendor.slug}`,
      images: vendor.logo_url ? [
        {
          url: vendor.logo_url,
          width: 1200,
          height: 630,
          alt: `${vendor.name} logo`,
        }
      ] : [],
      siteName: 'EasyBuilder',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: vendor.logo_url ? [vendor.logo_url] : [],
    },
    alternates: {
      canonical: `/vendors/${vendor.slug}`,
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
    other: {
      'business:contact_data:street_address': vendor.address || '',
      'business:contact_data:locality': '', // Could be extracted from address
      'business:contact_data:phone_number': vendor.phone,
      'business:contact_data:website': vendor.website || '',
    },
  }
}