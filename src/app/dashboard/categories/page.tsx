import { getVendor } from '@/lib/auth/server'
import { CategoriesPageClient } from '@/components/dashboard/categories-page-client'

export const metadata = {
  title: 'Categories - Dashboard',
  description: 'Manage your product categories',
}

export default async function CategoriesPage() {
  const vendor = await getVendor()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-display-sm font-bold text-foreground">Categories</h1>
        <p className="text-body-lg text-muted-foreground">
          Organize your products into categories and drag to reorder them
        </p>
      </div>
      
      <CategoriesPageClient vendorId={vendor.id} />
    </div>
  )
}