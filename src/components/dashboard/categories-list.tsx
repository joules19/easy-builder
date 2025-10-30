'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GripVertical,
  Package,
  Folder
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CategoryActions } from './category-actions'
import { CategoryEditDialog } from './category-edit-dialog'
import { CategoryListSkeleton } from '@/components/ui/skeletons'
import { NoCategoriesEmpty, ErrorState } from '@/components/ui/empty-states'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import toast from 'react-hot-toast'

interface CategoriesListProps {
  vendorId: string
}

export function CategoriesList({ vendorId }: CategoriesListProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const loadCategories = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products(count)
        `)
        .eq('vendor_id', vendorId)
        .order('display_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [vendorId])

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingCategory(null)
    loadCategories() // Refresh the list
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setIsReordering(true)
      
      const oldIndex = categories.findIndex((cat) => cat.id === active.id)
      const newIndex = categories.findIndex((cat) => cat.id === over?.id)
      
      const newCategories = arrayMove(categories, oldIndex, newIndex)
      setCategories(newCategories)

      try {
        const supabase = createClient()
        
        // Update display_order for all affected categories
        const updates = newCategories.map((category, index) => ({
          id: category.id,
          display_order: index + 1
        }))

        for (const update of updates) {
          const { error } = await supabase
            .from('categories')
            // @ts-ignore - Supabase types are conflicting here
            .update({ display_order: update.display_order })
            .eq('id', update.id)
          
          if (error) throw error
        }

        toast.success('Categories reordered successfully')
      } catch (error: any) {
        console.error('Error reordering categories:', error)
        toast.error('Failed to reorder categories')
        // Revert the local state change
        loadCategories()
      } finally {
        setIsReordering(false)
      }
    }
  }

  if (loading) {
    return <CategoryListSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load categories"
        description={`We encountered an error while loading your categories: ${error}`}
        onRetry={loadCategories}
      />
    )
  }

  if (!categories || categories.length === 0) {
    return <NoCategoriesEmpty />
  }

  return (
    <>
      <div className="space-y-3">
        {isReordering && (
          <div className="bg-info/10 border border-info/20 rounded-lg p-3 text-center">
            <p className="text-body-sm text-info font-medium">Reordering categories...</p>
          </div>
        )}
        
        <div className={`space-y-3 transition-opacity duration-200 ${isReordering ? 'opacity-50' : ''}`}>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={categories.map(cat => cat.id)}
              strategy={verticalListSortingStrategy}
            >
              {categories.map((category: any) => (
                <SortableCategoryItem 
                  key={category.id} 
                  category={category} 
                  vendorId={vendorId}
                  onEdit={() => handleEditCategory(category)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      
      <CategoryEditDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        category={editingCategory}
        vendorId={vendorId}
      />
    </>
  )
}

function SortableCategoryItem({ category, vendorId, onEdit }: { category: any, vendorId: string, onEdit: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const productCount = category.products?.[0]?.count || 0

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group border-0 bg-card/80 backdrop-blur rounded-xl hover:shadow-modern-md transition-all duration-200 ${
        isDragging ? 'opacity-90 shadow-modern-lg z-50 scale-105 bg-card' : 'hover:bg-card'
      }`}
    >
      <div className="flex flex-col space-y-3 p-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        {/* Top row - Drag handle, icon, and main info */}
        <div className="flex items-center space-x-3 flex-1">
          {/* Drag Handle */}
          <div 
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Category Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3 flex-shrink-0">
              <Folder className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-heading-sm font-semibold text-foreground truncate">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm sm:text-body-sm text-muted-foreground truncate mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions - Mobile inline */}
          <div className="sm:hidden">
            <CategoryActions
              categoryId={category.id}
              categoryName={category.name}
              productCount={productCount}
              onEdit={onEdit}
            />
          </div>
        </div>

        {/* Bottom row - Stats and actions (desktop) */}
        <div className="flex items-center justify-between sm:flex-shrink-0 sm:space-x-4">
          {/* Stats */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 text-sm sm:text-body-sm text-muted-foreground bg-muted/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">{productCount}</span>
              <span className="hidden sm:inline">{productCount === 1 ? 'product' : 'products'}</span>
            </div>
            
            <Badge variant={category.is_active ? 'success' : 'secondary'} className="text-xs">
              {category.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Drag Handle - Mobile */}
          <div 
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none transition-colors opacity-60 sm:hidden"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Actions - Desktop */}
          <div className="hidden sm:block">
            <CategoryActions
              categoryId={category.id}
              categoryName={category.name}
              productCount={productCount}
              onEdit={onEdit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}