'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { 
  Save, 
  X, 
  Plus,
  Upload,
  Image as ImageIcon,
  Trash2,
  GripVertical,
  Tag,
  DollarSign
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product, ProductInsert } from '@/types/database'
import toast from 'react-hot-toast'

interface ProductFormProps {
  vendorId: string
  product?: any // Changed to any to include product_images relation
  isEditing?: boolean
}

export function ProductForm({ vendorId, product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<any[]>([])
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
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    sku: product?.sku || '',
    status: product?.status || 'draft',
    category_id: product?.category_id || 'none',
  })
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<any[]>(product?.product_images || [])

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('vendor_id', vendorId)
          .eq('is_active', true)
          .order('name')

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [vendorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const productData: ProductInsert = {
        vendor_id: vendorId,
        name: formData.name,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        sku: formData.sku || null,
        status: formData.status as any,
        category_id: formData.category_id && formData.category_id !== 'none' ? formData.category_id : null,
      }

      let productId: string

      if (isEditing && product) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          // @ts-ignore - Supabase TypeScript issue with update method
          .update(productData)
          .eq('id', product.id)
          .select()
          .single()

        if (error) throw error
        productId = (data as any).id
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          // @ts-ignore - Supabase TypeScript issue with insert method
          .insert(productData)
          .select()
          .single()

        if (error) throw error
        productId = (data as any).id
      }

      // Image deletions are handled immediately when user clicks delete

      // Handle image uploads if any
      if (images.length > 0) {
        await uploadImages(productId)
      }

      toast.success(isEditing ? 'Product updated successfully!' : 'Product created successfully!')
      router.push('/dashboard/products')
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error saving product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadImages = async (productId: string) => {
    setIsUploadingImages(true)
    
    try {
      // Upload images to Cloudinary via API
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`
        
        setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }))
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('productId', productId)
        formData.append('displayOrder', (existingImages.length + i).toString())

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to upload image')
        }

        const result = await response.json()
        setUploadProgress(prev => ({ ...prev, [fileKey]: 100 }))
        console.log('Image uploaded successfully:', result)
      }
    } finally {
      setIsUploadingImages(false)
      setUploadProgress({})
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages([...images, ...files])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      {/* Form Steps Navigation */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            1
          </div>
          <span className="text-body-sm font-medium text-foreground">Basic Info</span>
        </div>
        <div className="h-px bg-border flex-1 max-w-16"></div>
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            2
          </div>
          <span className="text-body-sm font-medium text-foreground">Images</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-heading-lg font-semibold text-foreground">Basic Information</h3>
              <p className="text-body-sm text-muted-foreground">Essential details about your product</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-label-lg font-medium text-foreground">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter a descriptive product name"
                required
                maxLength={255}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-label-lg font-medium text-foreground">SKU (Stock Keeping Unit)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="e.g. PROD-001"
                maxLength={100}
                className="h-11"
              />
              <p className="text-label-sm text-muted-foreground">Optional unique identifier for inventory tracking</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-label-lg font-medium text-foreground">Product Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a detailed description of your product, including features, benefits, and specifications..."
              rows={5}
              maxLength={1000}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-label-sm text-muted-foreground">Help customers understand what makes your product special</p>
              <span className="text-label-sm text-muted-foreground">
                {formData.description.length}/1000
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-label-lg font-medium text-foreground">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="pl-10 h-11"
                />
              </div>
              <p className="text-label-sm text-muted-foreground">Leave empty if price varies or on request</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-label-lg font-medium text-foreground">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-label-sm text-muted-foreground">Helps organize your catalog</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-label-lg font-medium text-foreground">Visibility Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  <SelectItem value="active">Active (Visible)</SelectItem>
                  <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-label-sm text-muted-foreground">Controls public visibility</p>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-heading-lg font-semibold text-foreground">Product Images</h3>
              <p className="text-body-sm text-muted-foreground">Upload high-quality images to showcase your product</p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="text-label-sm">
                {images.length + existingImages.length}/10
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Existing Images */}
            {existingImages.map((image, index) => {
              const isDeleting = deletingImages.has(image.id)
              
              return (
                <div key={`existing-${index}`} className="relative group">
                  <div className="aspect-square bg-muted/20 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors">
                    <img
                      src={image.url}
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                    />
                    {isDeleting && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                          <div className="text-label-sm">Deleting...</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    disabled={isDeleting}
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Delete Image',
                        message: 'Are you sure you want to delete this image? This action cannot be undone.',
                        onConfirm: async () => {
                          setConfirmDialog(prev => ({ ...prev, isOpen: false }))
                          
                          // Delete from server if it has an ID
                          if (image.id) {
                            setDeletingImages(prev => new Set(prev).add(image.id))
                            
                            try {
                              const response = await fetch(`/api/upload/${image.id}`, {
                                method: 'DELETE',
                              })
                              
                              if (!response.ok) {
                                const errorData = await response.json()
                                throw new Error(errorData.error || 'Failed to delete image')
                              }

                              // Remove from UI on successful deletion
                              setExistingImages(existingImages.filter((_, i) => i !== index))
                              toast.success('Image deleted successfully')
                            } catch (error) {
                              console.error('Error deleting image:', error)
                              toast.error(`Failed to delete image: ${(error as any)?.message || 'Unknown error'}`)
                            } finally {
                              setDeletingImages(prev => {
                                const newSet = new Set(prev)
                                newSet.delete(image.id)
                                return newSet
                              })
                            }
                          }
                        }
                      })
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground">Primary</Badge>
                  )}
                </div>
              )
            })}

            {/* New Images */}
            {images.map((file, index) => {
              const fileKey = `${file.name}-${file.size}-${file.lastModified}`
              const progress = uploadProgress[fileKey]
              const isUploading = isUploadingImages && progress !== undefined
              
              return (
                <div key={`new-${index}`} className="relative group">
                  <div className="aspect-square bg-muted/20 rounded-xl overflow-hidden border-2 border-dashed border-chart-2/30">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                          <div className="text-label-sm">
                            {progress === 100 ? 'Complete!' : 'Uploading...'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    onClick={() => removeImage(index)}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && existingImages.length === 0 && (
                    <Badge className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground">Primary</Badge>
                  )}
                </div>
              )
            })}

            {/* Upload Button */}
            {images.length + existingImages.length < 10 && (
              <label className="aspect-square border-2 border-dashed border-border hover:border-primary/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-primary/5 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-body-sm font-medium text-foreground mb-1">Upload Images</span>
                <span className="text-label-sm text-muted-foreground">JPG, PNG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-info/20 text-info mt-0.5">
                <ImageIcon className="h-3 w-3" />
              </div>
              <div className="space-y-1">
                <p className="text-body-sm font-medium text-foreground">Image Guidelines</p>
                <ul className="text-label-sm text-muted-foreground space-y-0.5">
                  <li>• Upload up to 10 high-quality images</li>
                  <li>• First image becomes the primary thumbnail</li>
                  <li>• Recommended size: 1200x1200 pixels</li>
                  <li>• Supported formats: JPG, PNG (max 10MB each)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              disabled={isLoading}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-1 sm:order-2">
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                  disabled={isLoading}
                >
                  Save as Draft
                </Button>
              )}
              
              <Button 
                type="submit" 
                size="lg"
                variant="gradient"
                disabled={isLoading || isUploadingImages || !formData.name.trim()}
                className="min-w-[140px]"
              >
                {isLoading || isUploadingImages ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {isUploadingImages ? 'Uploading...' : isEditing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress indicator */}
          {(isLoading || isUploadingImages) && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-label-sm text-muted-foreground">
                <span>
                  {isUploadingImages ? 'Uploading images...' : isEditing ? 'Updating product...' : 'Creating product...'}
                </span>
                <span>Please wait</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full transition-all duration-300 animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}
        </div>

        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Delete"
          type="danger"
        />
      </form>
    </div>
  )
}