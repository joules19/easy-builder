'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { 
  Trash2, 
  Eye,
  EyeOff,
  MoreHorizontal,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import toast from 'react-hot-toast'

interface BulkProductActionsProps {
  selectedProducts: string[]
  onClearSelection: () => void
  productNames: { [key: string]: string }
}

export function BulkProductActions({ selectedProducts, onClearSelection, productNames }: BulkProductActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedAction, setSelectedAction] = useState('')
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

  if (selectedProducts.length === 0) return null

  const handleBulkAction = () => {
    if (!selectedAction || isUpdating) return

    const actionText = selectedAction === 'delete' 
      ? 'delete'
      : selectedAction === 'active'
      ? 'activate'
      : selectedAction === 'inactive'
      ? 'deactivate'
      : `set as ${selectedAction}`

    const message = selectedAction === 'delete' 
      ? `Are you sure you want to delete ${selectedProducts.length} product(s)? This will also delete all associated images. This action cannot be undone.`
      : `Are you sure you want to ${actionText} ${selectedProducts.length} product(s)?`

    setConfirmDialog({
      isOpen: true,
      title: `${selectedAction === 'delete' ? 'Delete' : 'Update'} Products`,
      message,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        setIsUpdating(true)
        
        try {
      const supabase = createClient()

      if (selectedAction === 'delete') {
        // Get all images for selected products to delete from Cloudinary
        const { data: images } = await supabase
          .from('product_images')
          .select('id')
          .in('product_id', selectedProducts)

        // Delete images via API to ensure Cloudinary cleanup
        if (images && images.length > 0) {
          for (const image of images) {
            try {
              await fetch(`/api/upload/${(image as any).id}`, {
                method: 'DELETE',
              })
            } catch (error) {
              console.warn('Failed to delete image via API:', error)
            }
          }
        }

        // Delete any remaining images directly (fallback)
        await supabase
          .from('product_images')
          .delete()
          .in('product_id', selectedProducts)

        // Then delete products
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', selectedProducts)

        if (error) throw error
      } else {
        // Update product status - do this for each product individually to avoid type issues
        for (const productId of selectedProducts) {
          const { error } = await supabase
            .from('products')
            // @ts-ignore - Supabase types are conflicting here
            .update({ 
              status: selectedAction,
              updated_at: new Date().toISOString()
            })
            .eq('id', productId)

          if (error) throw error
        }
      }

          const successMessage = selectedAction === 'delete' 
            ? `Successfully deleted ${selectedProducts.length} product(s)`
            : `Successfully updated ${selectedProducts.length} product(s)`
          
          toast.success(successMessage)
          onClearSelection()
          router.refresh()
        } catch (error) {
          console.error('Error performing bulk action:', error)
          toast.error('Error performing bulk action. Please try again.')
        } finally {
          setIsUpdating(false)
          setSelectedAction('')
        }
      }
    })
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {selectedProducts.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={selectedAction}
                onValueChange={(value) => setSelectedAction(value)}
              >
                <SelectTrigger className="w-full min-w-[140px] sm:w-40">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Set as Active</SelectItem>
                  <SelectItem value="inactive">Set as Inactive</SelectItem>
                  <SelectItem value="draft">Set as Draft</SelectItem>
                  <SelectItem value="delete">Delete Products</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleBulkAction}
                disabled={!selectedAction || isUpdating}
                variant={selectedAction === 'delete' ? 'destructive' : 'default'}
                size="sm"
                className="whitespace-nowrap"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 hidden md:block">
            Selected: {selectedProducts.slice(0, 3).map(id => productNames[id]).join(', ')}
            {selectedProducts.length > 3 && ` and ${selectedProducts.length - 3} more`}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirm"
        type={selectedAction === 'delete' ? 'danger' : 'warning'}
        isLoading={isUpdating}
      />
    </>
  )
}