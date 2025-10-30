import { getVendor } from '@/lib/auth/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { ProductForm } from '@/components/dashboard/product-form'
import { notFound } from 'next/navigation'
import type { ProductWithImages } from '@/types/database'

export const metadata = {
  title: 'Edit Product - Dashboard',
  description: 'Edit product information',
}

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const vendor = await getVendor()
  const supabase = createServerSupabaseClient()

  // Fetch the product with images
  const { data: productData, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(name)
    `)
    .eq('id', params.id)
    .eq('vendor_id', vendor.id) // Ensure vendor can only edit their own products
    .single()

  if (error || !productData) {
    notFound()
  }

  const product = productData as any

  return (
    <div className="p-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update "{product.name}" information</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm 
            vendorId={vendor.id} 
            product={product}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}