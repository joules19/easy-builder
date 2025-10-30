'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { 
  Edit, 
  Trash2, 
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface CategoryActionsProps {
  categoryId: string
  categoryName: string
  productCount: number
  onEdit: () => void
}

export function CategoryActions({ categoryId, categoryName, productCount, onEdit }: CategoryActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  const handleDelete = () => {
    if (isDeleting) return
    
    // Check if category has products
    if (productCount > 0) {
      toast.error(`Cannot delete "${categoryName}" because it contains ${productCount} product(s). Please move or delete the products first.`)
      return
    }
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        setIsDeleting(true)
        
        try {
          const supabase = createClient()
          
          const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId)

          if (error) throw error
          
          toast.success('Category deleted successfully')
          router.refresh()
        } catch (error) {
          console.error('Error deleting category:', error)
          toast.error('Error deleting category. Please try again.')
        } finally {
          setIsDeleting(false)
        }
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted/80"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit Category
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDelete}
            disabled={productCount > 0 || isDeleting}
            className={`cursor-pointer ${
              productCount > 0 || isDeleting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'text-destructive focus:text-destructive hover:bg-destructive/10'
            }`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {productCount > 0 
              ? `Cannot delete (${productCount} products)` 
              : 'Delete Category'
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete Category"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  )
}