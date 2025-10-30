import { Suspense } from 'react'
import { getVendor } from '@/lib/auth/server'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Package
} from 'lucide-react'
import Link from 'next/link'
import { ProductsListClient } from '@/components/dashboard/products-list-client'
import { ProductsFilter } from '@/components/dashboard/products-filter'

export const metadata = {
  title: 'Products - Dashboard',
  description: 'Manage your product catalog',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; status?: string }
}) {
  const vendor = await getVendor()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-display-sm font-bold text-foreground">Products</h1>
          <p className="text-body-lg text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard/categories">
              <Package className="h-4 w-4 mr-2" />
              Manage Categories
            </Link>
          </Button>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <ProductsFilter vendorId={vendor.id} />

      {/* Products List */}
      <ProductsListClient 
        vendorId={vendor.id}
        searchParams={searchParams}
      />
    </div>
  )
}

