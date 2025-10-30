'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category, CategoryInsert } from '@/types/database'
import toast from 'react-hot-toast'

interface CategoryFormProps {
  vendorId: string
  category?: Category
  isEditing?: boolean
  onSuccess?: () => void
}

export function CategoryForm({ vendorId, category, isEditing = false, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const categoryData: CategoryInsert = {
        vendor_id: vendorId,
        name: formData.name,
        description: formData.description || null,
        is_active: formData.is_active,
        display_order: 0, // Will be updated to proper order
      }

      if (isEditing && category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          // @ts-ignore - Supabase TypeScript issue with update method
          .update(categoryData)
          .eq('id', category.id)

        if (error) throw error
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          // @ts-ignore - Supabase TypeScript issue with insert method
          .insert(categoryData)

        if (error) throw error
      }

      // Reset form if creating new category
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          is_active: true,
        })
      }

      toast.success(isEditing ? 'Category updated successfully!' : 'Category created successfully!')
      onSuccess?.()
      router.refresh()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Error saving category. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category-name" className="text-label-lg font-medium text-foreground">Category Name *</Label>
        <Input
          id="category-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Electronics, Clothing, Home & Garden"
          required
          maxLength={255}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-description" className="text-label-lg font-medium text-foreground">Description</Label>
        <Textarea
          id="category-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional description to help customers understand this category"
          rows={3}
          maxLength={500}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-label-sm text-muted-foreground">Help customers understand this category</p>
          <span className="text-label-sm text-muted-foreground">
            {formData.description.length}/500
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-status" className="text-label-lg font-medium text-foreground">Visibility Status</Label>
        <Select
          value={formData.is_active ? 'active' : 'inactive'}
          onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === 'active' }))}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active (Visible to customers)</SelectItem>
            <SelectItem value="inactive">Inactive (Hidden from customers)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-label-sm text-muted-foreground">Controls whether customers can see this category</p>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !formData.name.trim()}
        variant="gradient"
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            {isEditing ? 'Updating...' : 'Creating...'}
          </div>
        ) : (
          <>
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Category
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </>
            )}
          </>
        )}
      </Button>
      
      {/* Form tip */}
      <div className="bg-muted/30 rounded-lg p-3 text-center">
        <p className="text-label-sm text-muted-foreground">
          💡 Categories help organize your products and improve customer browsing experience
        </p>
      </div>
    </form>
  )
}