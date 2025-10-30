'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProductsFilterProps {
  vendorId: string
}

interface Category {
  id: string
  name: string
}

export function ProductsFilter({ vendorId }: ProductsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('categories')
          .select('id, name')
          .eq('vendor_id', vendorId)
          .order('name')
        
        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [vendorId])

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (search.trim()) {
      params.set('search', search.trim())
    }
    
    if (category !== 'all') {
      params.set('category', category)
    }
    
    if (status !== 'all') {
      params.set('status', status)
    }

    router.push(`/dashboard/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setStatus('all')
    router.push('/dashboard/products')
  }

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || status !== 'all'

  return (
    <Card className="border-0 bg-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-heading-md">Filter & Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-label-lg font-medium text-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters()
                  }
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-label-lg font-medium text-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-label-lg font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-label-lg font-medium text-foreground">Actions</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-11"
                onClick={applyFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="h-11 px-3"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}