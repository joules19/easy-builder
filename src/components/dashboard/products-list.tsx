import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Image as ImageIcon,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ProductWithImages } from '@/types/database'
import { ProductActions } from './product-actions'
import { NoProductsEmpty, ErrorState } from '@/components/ui/empty-states'

interface ProductsListProps {
  vendorId: string
  searchParams: { search?: string; category?: string; status?: string }
}

export async function ProductsList({ vendorId, searchParams }: ProductsListProps) {
  const supabase = createServerSupabaseClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(name)
    `)
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  // Apply filters
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }
  
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  const { data: products, error } = await query

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        description={`We encountered an error while loading your products: ${error.message}`}
      />
    )
  }

  if (!products || products.length === 0) {
    return <NoProductsEmpty />
  }

  return (
    <div className="space-y-4">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  const primaryImage = product.product_images?.find((img: any) => img.display_order === 0)
  const statusColors = {
    active: 'success',
    draft: 'warning',
    inactive: 'secondary',
    archived: 'secondary'
  } as const

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          {/* Product Image and Basic Info Row */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.categories?.name && (
                      <span className="text-blue-600">{product.categories.name} • </span>
                    )}
                    SKU: {product.sku || 'N/A'}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-2 sm:ml-4">
                  <Badge variant={statusColors[product.status as keyof typeof statusColors]}>
                    {product.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Price, Stats and Actions Row */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-2">
            {/* Price and Stats */}
            <div className="text-left sm:text-right">
              <div className="text-lg font-semibold text-gray-900">
                {product.price ? `$${product.price}` : 'No price'}
              </div>
              <div className="text-sm text-gray-500">
                {product.view_count} views • {product.product_images?.length || 0} images
              </div>
            </div>

            {/* Actions */}
            <div className="ml-4 sm:ml-0">
              <ProductActions 
                productId={product.id}
                productName={product.name}
                currentStatus={product.status}
              />
            </div>
          </div>
        </div>

        {/* Description on mobile */}
        {product.description && (
          <div className="mt-3 pt-3 border-t border-gray-100 sm:hidden">
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
          </div>
        )}

        {/* Additional Stats Row */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500 space-x-2">
            <span className="truncate">Created {new Date(product.created_at).toLocaleDateString()}</span>
            <span className="truncate">Updated {new Date(product.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}