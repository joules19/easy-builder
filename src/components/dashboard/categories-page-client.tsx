'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Folder, ArrowUpDown } from 'lucide-react'
import { CategoriesList } from './categories-list'
import { CategoryForm } from './category-form'

interface CategoriesPageClientProps {
  vendorId: string
}

export function CategoriesPageClient({ vendorId }: CategoriesPageClientProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCategoryAdded = () => {
    setRefreshKey(prev => prev + 1) // Force refresh of the list
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Categories List */}
      <div className="lg:col-span-2">
        <Card className="border-0 bg-card/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3">
                  <Folder className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-heading-lg font-semibold text-foreground">Your Categories</CardTitle>
                  <p className="text-body-sm text-muted-foreground">Drag and drop to reorder</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-label-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                  <ArrowUpDown className="h-3 w-3" />
                  <span>Drag to reorder</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CategoriesList vendorId={vendorId} key={refreshKey} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Add Form */}
      <div className="lg:col-span-1">
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-chart-1/5">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-heading-md font-semibold text-foreground">Quick Add Category</CardTitle>
                <p className="text-body-sm text-muted-foreground">Create a new category</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CategoryForm vendorId={vendorId} onSuccess={handleCategoryAdded} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}