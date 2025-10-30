'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Image as ImageIcon,
  DollarSign,
  Package,
  Folder,
  Eye,
  Calendar,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ProductActions } from './product-actions'
import { BulkProductActions } from './bulk-product-actions'
import { ProductGridSkeleton } from '@/components/ui/skeletons'
import { NoProductsEmpty, ErrorState } from '@/components/ui/empty-states'

interface ProductsListClientProps {
  vendorId: string
  searchParams: { search?: string; category?: string; status?: string }
}

export function ProductsListClient({ vendorId, searchParams }: ProductsListClientProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
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
      
      if (searchParams.category && searchParams.category !== 'all') {
        query = query.eq('category_id', searchParams.category)
      }
      
      if (searchParams.status && searchParams.status !== 'all') {
        query = query.eq('status', searchParams.status)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    setSelectedProducts([]) // Clear selection when filters change
  }, [vendorId, JSON.stringify(searchParams)])

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const productNames = products.reduce((acc, product) => {
    acc[product.id] = product.name
    return acc
  }, {} as { [key: string]: string })

  if (loading) {
    return <ProductGridSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        description={`We encountered an error while loading your products: ${error}`}
        onRetry={loadProducts}
      />
    )
  }

  if (!products || products.length === 0) {
    return <NoProductsEmpty />
  }

  return (
    <div>
      <BulkProductActions
        selectedProducts={selectedProducts}
        onClearSelection={() => setSelectedProducts([])}
        productNames={productNames}
      />
      
      {/* Select All Checkbox */}
      {products.length > 0 && (
        <Card className="border-0 bg-muted/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="select-all" className="text-body-sm font-medium text-foreground cursor-pointer">
                  Select all products
                </label>
              </div>
              <div className="text-label-sm text-muted-foreground">
                {selectedProducts.length > 0 ? (
                  <span>{selectedProducts.length} of {products.length} selected</span>
                ) : (
                  <span>{products.length} products total</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {products.map((product: any) => (
          <ProductCard 
            key={product.id} 
            product={product}
            isSelected={selectedProducts.includes(product.id)}
            onSelect={(checked) => handleSelectProduct(product.id, checked)}
            onUpdate={loadProducts}
          />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, isSelected, onSelect, onUpdate }: { 
  product: any
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onUpdate: () => void
}) {
  const primaryImage = product.product_images?.find((img: any) => img.display_order === 0)
  const statusColors = {
    active: 'success',
    draft: 'warning',
    inactive: 'secondary',
    archived: 'secondary'
  } as const

  return (
    <Card className={cn(
      "group hover:shadow-modern-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur",
      isSelected && "ring-2 ring-primary bg-primary/5"
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
          {/* Top row - Checkbox, Image, and Basic Info */}
          <div className="flex items-start space-x-3 flex-1">
            {/* Selection Checkbox */}
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="h-4 w-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/20 cursor-pointer"
              />
            </div>

            {/* Product Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-muted/30 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                <Badge variant={statusColors[product.status as keyof typeof statusColors]} className="text-xs">
                  {product.status}
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
              <div>
                <h3 className="text-base sm:text-heading-md font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 mt-1">
                  {product.categories?.name && (
                    <div className="flex items-center space-x-1">
                      <Folder className="h-3 w-3 text-chart-2" />
                      <span className="text-body-sm text-chart-2 font-medium">{product.categories.name}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <span className="text-label-sm text-muted-foreground">{product.sku}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {product.description && (
                <p className="text-body-sm text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price - Mobile inline */}
            <div className="text-right sm:hidden">
              <div className="text-base font-bold text-foreground">
                {product.price ? (
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {product.price}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">No price</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row - Stats, Price and Actions (Desktop) */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-3 sm:flex-shrink-0">
            {/* Stats Row - Mobile */}
            <div className="flex items-center space-x-3 sm:hidden text-label-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{product.view_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ImageIcon className="h-3 w-3" />
                <span>{product.product_images?.length || 0}</span>
              </div>
            </div>

            {/* Price - Desktop */}
            <div className="text-right hidden sm:block">
              <div className="text-heading-md font-bold text-foreground">
                {product.price ? (
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {product.price}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-body-sm">No price</span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <ProductActions 
              productId={product.id}
              productName={product.name}
              currentStatus={product.status}
              onUpdate={onUpdate}
            />
          </div>
        </div>

        {/* Description on mobile */}
        {product.description && (
          <div className="mt-3 pt-3 border-t border-gray-100 sm:hidden">
            <p className="text-body-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Stats Row - Desktop */}
        <div className="hidden sm:block mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-label-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{product.view_count || 0} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <ImageIcon className="h-3 w-3" />
              <span>{product.product_images?.length || 0} images</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Created {new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductsListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border-0 bg-card/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-muted/50 rounded animate-pulse mt-1" />
              <div className="w-20 h-20 bg-muted/50 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-3">
                <div>
                  <div className="h-5 bg-muted/50 rounded animate-pulse mb-2 w-3/4" />
                  <div className="flex space-x-3">
                    <div className="h-3 bg-muted/50 rounded animate-pulse w-20" />
                    <div className="h-3 bg-muted/50 rounded animate-pulse w-16" />
                  </div>
                </div>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
                <div className="flex space-x-4">
                  <div className="h-3 bg-muted/50 rounded animate-pulse w-16" />
                  <div className="h-3 bg-muted/50 rounded animate-pulse w-16" />
                  <div className="h-3 bg-muted/50 rounded animate-pulse w-20" />
                </div>
              </div>
              <div className="text-right space-y-3">
                <div className="h-6 bg-muted/50 rounded animate-pulse w-16" />
                <div className="w-8 h-8 bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}