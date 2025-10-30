import { getVendor } from '@/lib/auth/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { ProductForm } from '@/components/dashboard/product-form'

export const metadata = {
  title: 'Add Product - Dashboard',
  description: 'Add a new product to your catalog',
}

export default async function NewProductPage() {
  const vendor = await getVendor()

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-display-sm font-bold text-foreground">Add New Product</h1>
          <p className="text-body-lg text-muted-foreground">
            Create a new product for your catalog and start reaching more customers
          </p>
        </div>
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Progress Indicator */}
      <Card className="border-0 bg-gradient-to-r from-chart-1/5 to-chart-2/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-heading-md font-semibold text-foreground">Product Creation</h3>
              <p className="text-body-sm text-muted-foreground">
                Fill in the details below to add a new product to your catalog
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Form */}
      <ProductForm vendorId={vendor.id} />
    </div>
  )
}