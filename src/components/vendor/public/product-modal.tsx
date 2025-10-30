'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Store,
  Heart,
  Share2,
  ZoomIn,
  ImageIcon
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductWithImages } from '@/types/database'

interface ProductModalProps {
  product: ProductWithImages | null
  isOpen: boolean
  onClose: () => void
  vendorName: string
}

export function ProductModal({ product, isOpen, onClose, vendorName }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  useEffect(() => {
    setCurrentImageIndex(0)
    setIsImageZoomed(false)
  }, [product])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !product) return null

  const images = product.product_images || []
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const previousImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} from ${vendorName}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in">
        <Card className="border-0 bg-background shadow-modern-xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] sm:min-h-[60vh]">
              {/* Image Section */}
              <div className="relative bg-gradient-to-br from-muted/20 to-muted/10">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur hover:bg-background/90 shadow-modern"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                {/* Image Display */}
                <div className="relative h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]">
                  {images.length > 0 ? (
                    <>
                      <Image
                        src={images[currentImageIndex].url}
                        alt={images[currentImageIndex].alt_text || `${product.name} image ${currentImageIndex + 1}`}
                        fill
                        className={`object-cover transition-transform duration-300 ${
                          isImageZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                        onClick={() => setIsImageZoomed(!isImageZoomed)}
                        quality={95}
                      />
                      
                      {/* Zoom Icon - Hidden on mobile */}
                      <div className="absolute bottom-4 right-4 hidden sm:block">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsImageZoomed(!isImageZoomed)}
                          className="bg-background/80 backdrop-blur hover:bg-background/90 shadow-modern"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={previousImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-background/80 backdrop-blur hover:bg-background/90 shadow-modern"
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-background/80 backdrop-blur hover:bg-background/90 shadow-modern"
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        {currentImageIndex + 1} of {images.length}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {hasMultipleImages && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex space-x-2 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-white shadow-modern'
                              : 'border-white/30 hover:border-white/60'
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details Section */}
              <div className="p-4 sm:p-6 lg:p-12 space-y-6 lg:space-y-8 overflow-y-auto">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h1 className="text-display-sm font-bold text-foreground leading-tight">
                        {product.name}
                      </h1>
                      {product.sku && (
                        <Badge variant="outline" className="font-mono text-xs">
                          SKU: {product.sku}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  {product.price && (
                    <div className="text-display-sm font-bold text-primary">
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-3">
                    <h2 className="text-heading-md font-semibold text-foreground">Description</h2>
                    <p className="text-body-lg text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Category */}
                {(product as any).categories && (
                  <div className="space-y-3">
                    <h2 className="text-heading-md font-semibold text-foreground">Category</h2>
                    <Badge variant="secondary" className="text-sm">
                      <Store className="h-4 w-4 mr-2" />
                      {(product as any).categories.name}
                    </Badge>
                  </div>
                )}

                {/* Product Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-xl">
                  <div className="text-center">
                    <div className="text-heading-lg font-bold text-foreground">
                      {product.view_count || 0}
                    </div>
                    <div className="text-label-sm text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-heading-lg font-bold text-foreground">
                      {images.length}
                    </div>
                    <div className="text-label-sm text-muted-foreground">
                      {images.length === 1 ? 'Photo' : 'Photos'}
                    </div>
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-body-sm text-muted-foreground">Sold by</p>
                      <p className="text-heading-sm font-semibold text-foreground">{vendorName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}