# Performance & Caching Strategy

## Overview
Comprehensive performance optimization strategy for EasyBuilder, focusing on fast loading times, efficient caching, and scalable performance across all user experiences.

## Performance Targets

### Core Web Vitals Goals
```
Lighthouse Scores (Target):
├── Performance: 95+
├── Accessibility: 100
├── Best Practices: 100
└── SEO: 100

Core Web Vitals:
├── LCP (Largest Contentful Paint): < 2.5s
├── FID (First Input Delay): < 100ms
├── CLS (Cumulative Layout Shift): < 0.1
└── TTFB (Time to First Byte): < 600ms
```

### User Experience Targets
```
Loading Performance:
├── Vendor page load: < 1.5s
├── Dashboard load: < 2s
├── Image load: < 500ms
└── Search response: < 200ms

Interaction Performance:
├── Button click response: < 50ms
├── Form submission: < 1s
├── Page navigation: < 300ms
└── QR code generation: < 2s
```

## Caching Architecture

### Multi-Layer Caching Strategy
```
1. Browser Cache (Client-side)
├── Static assets: 1 year
├── Vendor pages: 5 minutes
├── API responses: 1 minute
└── Images: 1 month

2. CDN Cache (Vercel Edge)
├── Static files: 1 year
├── API routes: 1 minute
├── Vendor pages: 1 hour (ISR)
└── Images: 1 month

3. Database Cache (Redis)
├── Vendor catalogs: 10 minutes
├── Search results: 5 minutes
├── Analytics data: 30 minutes
└── Session data: 30 minutes

4. Application Cache (Memory)
├── Component state: Session
├── Route prefetching: 30 seconds
├── Image preloading: 5 minutes
└── API response cache: 1 minute
```

## Static Generation & ISR

### Incremental Static Regeneration
```typescript
// app/vendors/[slug]/page.tsx
import { Metadata } from 'next'
import { getVendorBySlug, getVendorProducts } from '@/lib/api/vendors'

interface VendorPageProps {
  params: { slug: string }
}

// Static generation for all active vendors
export async function generateStaticParams() {
  const vendors = await getActiveVendors()
  
  return vendors.map((vendor) => ({
    slug: vendor.slug,
  }))
}

// ISR: Regenerate every hour or on-demand
export const revalidate = 3600 // 1 hour

export default async function VendorPage({ params }: VendorPageProps) {
  const [vendor, products] = await Promise.all([
    getVendorBySlug(params.slug),
    getVendorProducts(params.slug)
  ])

  if (!vendor) {
    notFound()
  }

  return (
    <VendorPageContent 
      vendor={vendor} 
      products={products}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const vendor = await getVendorBySlug(params.slug)
  
  if (!vendor) {
    return {
      title: 'Vendor Not Found',
    }
  }

  return {
    title: `${vendor.name} - Product Catalog`,
    description: vendor.description,
    openGraph: {
      title: vendor.name,
      description: vendor.description,
      images: [vendor.logo_url],
      url: `/vendors/${vendor.slug}`,
    },
  }
}
```

### On-Demand Revalidation
```typescript
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { type, identifier } = await request.json()
  
  // Verify revalidation secret
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    switch (type) {
      case 'vendor':
        // Revalidate specific vendor page
        revalidatePath(`/vendors/${identifier}`)
        revalidateTag(`vendor-${identifier}`)
        break
        
      case 'product':
        // Revalidate vendor page when product changes
        const product = await getProduct(identifier)
        revalidatePath(`/vendors/${product.vendor.slug}`)
        break
        
      case 'all-vendors':
        // Revalidate all vendor pages
        revalidateTag('vendors')
        break
    }
    
    return Response.json({ revalidated: true })
  } catch (error) {
    return Response.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}
```

## Database Performance

### Query Optimization
```typescript
// lib/api/vendors.ts - Optimized vendor queries
export async function getVendorWithProducts(slug: string) {
  const supabase = createServerClient()
  
  // Single query with joins instead of multiple queries
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      *,
      categories:categories(
        id,
        name,
        display_order,
        products:products(
          id,
          name,
          description,
          price,
          status,
          product_images(url, alt_text, display_order)
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .eq('categories.is_active', true)
    .eq('categories.products.status', 'active')
    .order('display_order', { foreignTable: 'categories' })
    .order('created_at', { foreignTable: 'categories.products', ascending: false })
    .single()

  if (error) throw error
  return data
}

// Cached version with Redis
export async function getCachedVendorData(slug: string) {
  const cacheKey = `vendor:${slug}`
  
  // Try cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // Fetch from database
  const data = await getVendorWithProducts(slug)
  
  // Cache for 10 minutes
  await redis.setex(cacheKey, 600, JSON.stringify(data))
  
  return data
}
```

### Connection Pooling
```typescript
// lib/supabase/pool.ts
import { createPool } from '@supabase/supabase-js'

export const supabasePool = createPool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 30000,
  idleTimeoutMillis: 600000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
})
```

## Image Optimization

### Cloudinary Integration
```typescript
// lib/cloudinary/config.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Generate optimized image URLs
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'avif'
  } = {}
) {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: 'fill',
        gravity: 'auto',
        quality: options.quality || 'auto',
        fetch_format: options.format || 'auto',
      }
    ]
  })
}
```

### Responsive Images Component
```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image'
import { getOptimizedImageUrl } from '@/lib/cloudinary/config'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  className
}: OptimizedImageProps) {
  // Generate responsive image URLs
  const srcSet = [
    { width: 320, descriptor: '320w' },
    { width: 640, descriptor: '640w' },
    { width: 960, descriptor: '960w' },
    { width: 1280, descriptor: '1280w' },
  ].map(({ width: w, descriptor }) => 
    `${getOptimizedImageUrl(src, { width: w, quality: 'auto' })} ${descriptor}`
  ).join(', ')

  return (
    <Image
      src={getOptimizedImageUrl(src, { width, height, quality: 'auto' })}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      // Enable placeholder blur
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
}
```

### Image Preloading Strategy
```typescript
// hooks/useImagePreloader.ts
import { useEffect } from 'react'

export function useImagePreloader(images: string[]) {
  useEffect(() => {
    // Preload critical images
    images.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
    
    // Cleanup function
    return () => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]')
      preloadLinks.forEach(link => link.remove())
    }
  }, [images])
}
```

## Code Splitting & Lazy Loading

### Component-Level Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

// Lazy load QR code generator (only when needed)
const QRCodeGenerator = dynamic(
  () => import('@/components/qr/QRCodeGenerator'),
  {
    loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />,
    ssr: false // Client-side only
  }
)

// Lazy load analytics dashboard
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics/AnalyticsDashboard'),
  {
    loading: () => <AnalyticsLoading />,
  }
)

// Usage with route-based splitting
export default function Dashboard() {
  const [showQRGenerator, setShowQRGenerator] = useState(false)
  
  return (
    <div>
      <DashboardHeader />
      
      {showQRGenerator && (
        <QRCodeGenerator />
      )}
      
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  )
}
```

### Route Prefetching
```typescript
// components/navigation/VendorLink.tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function VendorLink({ vendor }: { vendor: Vendor }) {
  const router = useRouter()
  
  const handleMouseEnter = () => {
    // Prefetch vendor page on hover
    router.prefetch(`/vendors/${vendor.slug}`)
  }
  
  return (
    <Link 
      href={`/vendors/${vendor.slug}`}
      onMouseEnter={handleMouseEnter}
      className="vendor-link"
    >
      {vendor.name}
    </Link>
  )
}
```

## Bundle Optimization

### Webpack Bundle Analysis
```typescript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  
  // Optimize imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  
  // Minimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce client bundle size
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
})
```

### Tree Shaking Optimization
```typescript
// lib/utils/index.ts - Export only what's needed
export { cn } from './cn'
export { formatPrice } from './format'
export { generateSlug } from './slug'

// Instead of: export * from './all-utils'

// Use specific imports
import { format } from 'date-fns/format'
import { parseISO } from 'date-fns/parseISO'

// Instead of: import { format, parseISO } from 'date-fns'
```

## Runtime Performance

### React Performance Optimizations
```typescript
// components/vendor/ProductGrid.tsx
import { memo, useMemo, useCallback } from 'react'

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export const ProductGrid = memo(function ProductGrid({ 
  products, 
  onProductClick 
}: ProductGridProps) {
  // Memoize expensive calculations
  const sortedProducts = useMemo(() => 
    products.sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [products]
  )
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleProductClick = useCallback((product: Product) => {
    onProductClick(product)
  }, [onProductClick])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={handleProductClick}
        />
      ))}
    </div>
  )
})

// Virtualized list for large product catalogs
import { FixedSizeGrid as Grid } from 'react-window'

export function VirtualizedProductGrid({ products }: { products: Product[] }) {
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * 3 + columnIndex
    const product = products[index]
    
    if (!product) return null
    
    return (
      <div style={style}>
        <ProductCard product={product} />
      </div>
    )
  }
  
  return (
    <Grid
      columnCount={3}
      columnWidth={300}
      height={600}
      rowCount={Math.ceil(products.length / 3)}
      rowHeight={400}
      width={900}
    >
      {Cell}
    </Grid>
  )
}
```

### Intersection Observer for Lazy Loading
```typescript
// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      if (entry.isIntersecting) {
        setHasIntersected(true)
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [])
  
  return { ref, isIntersecting, hasIntersected }
}

// Usage for lazy loading images
export function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, hasIntersected } = useIntersectionObserver()
  
  return (
    <div ref={ref} className="w-full h-64 bg-gray-200 rounded">
      {hasIntersected && (
        <OptimizedImage src={src} alt={alt} width={300} height={256} />
      )}
    </div>
  )
}
```

## Performance Monitoring

### Web Vitals Tracking
```typescript
// lib/analytics/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface PerformanceMetric {
  name: string
  value: number
  id: string
  delta: number
}

export function trackWebVitals() {
  function sendToAnalytics(metric: PerformanceMetric) {
    // Send to PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('web_vital', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
        metric_delta: metric.delta,
        page_url: window.location.href,
      })
    }
    
    // Send to Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', 'web-vital', {
        name: metric.name,
        value: metric.value,
      })
    }
  }
  
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}

// Performance budget alerts
export function checkPerformanceBudget(metric: PerformanceMetric) {
  const budgets = {
    LCP: 2500, // 2.5 seconds
    FID: 100,  // 100 milliseconds
    CLS: 0.1,  // 0.1 score
    FCP: 1800, // 1.8 seconds
    TTFB: 600, // 600 milliseconds
  }
  
  const budget = budgets[metric.name as keyof typeof budgets]
  if (budget && metric.value > budget) {
    console.warn(`Performance budget exceeded for ${metric.name}: ${metric.value} > ${budget}`)
    
    // Send alert to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/performance/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          budget,
          url: window.location.href,
        }),
      })
    }
  }
}
```

### Performance Dashboard
```typescript
// components/admin/PerformanceDashboard.tsx
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Fetch performance metrics from API
    const fetchMetrics = async () => {
      const response = await fetch('/api/performance/metrics')
      const data = await response.json()
      setMetrics(data)
      setLoading(false)
    }
    
    fetchMetrics()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  if (loading) return <PerformanceLoading />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map(metric => (
        <MetricCard
          key={metric.name}
          name={metric.name}
          value={metric.value}
          target={getTargetValue(metric.name)}
          trend={metric.trend}
        />
      ))}
    </div>
  )
}
```

This comprehensive performance strategy ensures EasyBuilder delivers fast, smooth user experiences while maintaining scalability and monitoring performance in real-time.