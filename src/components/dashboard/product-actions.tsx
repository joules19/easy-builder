'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ProductActionsProps {
  productId: string
  productName: string
  currentStatus: string
  onUpdate?: () => void
}

export function ProductActions({ productId, productName, currentStatus, onUpdate }: ProductActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
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

  const handleStatusToggle = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const supabase = createClient()
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      
      const { error } = await supabase
        .from('products')
        // @ts-ignore - Supabase TypeScript issue with update method
        .update({ status: newStatus })
        .eq('id', productId)

      if (error) throw error
      
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      onUpdate?.()
      router.refresh()
    } catch (error) {
      console.error('Error updating product status:', error)
      toast.error('Error updating product status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    if (isDeleting) return
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${productName}"? This will also delete all associated images. This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        setIsDeleting(true)
        
        try {
      const supabase = createClient()
      
      // Get all images for this product to delete from Cloudinary
      const { data: images } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', productId)

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
        .eq('product_id', productId)
      
      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

          if (error) throw error
          
          toast.success('Product deleted successfully')
          onUpdate?.()
          router.refresh()
        } catch (error) {
          console.error('Error deleting product:', error)
          toast.error('Error deleting product. Please try again.')
        } finally {
          setIsDeleting(false)
        }
      }
    })
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/products/${productId}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          title={currentStatus === 'active' ? 'Hide product' : 'Show product'}
          onClick={handleStatusToggle}
          disabled={isUpdating}
        >
          {currentStatus === 'active' ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  )
}