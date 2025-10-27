'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { VendorWithCategories } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Search, 
  QrCode,
  Facebook,
  Instagram,
  Twitter,
  Clock,
  Store
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface VendorPageContentProps {
  vendor: VendorWithCategories
  utmTracking?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }
}

export function VendorPageContent({ vendor, utmTracking }: VendorPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState(
    vendor.categories.flatMap(cat => cat.products)
  )

  // Track page view and QR scan
  useEffect(() => {
    // Track page view
    // This would typically send to analytics service
    console.log('Page view tracked', { vendor: vendor.id, utm: utmTracking })

    // Track QR scan if UTM parameters indicate QR source
    if (utmTracking?.utm_source === 'qr') {
      console.log('QR scan tracked', { vendor: vendor.id })
      // trackQRScan(vendor.id, utmTracking)
    }
  }, [vendor.id, utmTracking])

  // Filter products based on search and category
  useEffect(() => {
    let products = vendor.categories.flatMap(cat => cat.products)

    // Filter by category
    if (selectedCategory) {
      const category = vendor.categories.find(cat => cat.id === selectedCategory)
      products = category ? category.products : []
    }

    // Filter by search query
    if (searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(products)
  }, [searchQuery, selectedCategory, vendor.categories])

  const handleContactClick = (type: string, value: string) => {
    // Track contact interaction
    console.log('Contact tracked', { vendor: vendor.id, type, value })
    
    switch (type) {
      case 'phone':
        window.open(`tel:${value}`)
        break
      case 'email':
        window.open(`mailto:${value}?subject=Inquiry about ${vendor.name}`)
        break
      case 'location':
        const encodedAddress = encodeURIComponent(value)
        window.open(`https://maps.google.com/maps?q=${encodedAddress}`)
        break
      case 'website':
        window.open(value, '_blank')
        break
    }
  }

  const socialLinks = vendor.social_media as Record<string, string> || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Logo */}
            {vendor.logo_url ? (
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={vendor.logo_url}
                  alt={`${vendor.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-blue-100 flex items-center justify-center">
                <Store className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
              </div>
            )}

            {/* Business Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {vendor.name}
              </h1>
              {vendor.description && (
                <p className="text-gray-600 mb-4">{vendor.description}</p>
              )}
              
              {/* Quick Contact */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => handleContactClick('phone', vendor.phone)}
                  className="flex items-center space-x-1"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleContactClick('email', vendor.email)}
                  className="flex items-center space-x-1"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Button>
                {vendor.address && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContactClick('location', vendor.address!)}
                    className="flex items-center space-x-1"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        !selectedCategory 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Products ({vendor.categories.reduce((sum, cat) => sum + cat.products.length, 0)})
                    </button>
                    {vendor.categories.map(category => (
                      <button
                        key={category.id}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name} ({category.products.length})
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="break-all">{vendor.email}</span>
                    </div>
                    {vendor.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="leading-relaxed">{vendor.address}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a 
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {vendor.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social Media */}
                  {Object.keys(socialLinks).length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Follow Us</h4>
                      <div className="flex space-x-2">
                        {socialLinks.facebook && (
                          <a
                            href={`https://facebook.com/${socialLinks.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                        {socialLinks.instagram && (
                          <a
                            href={`https://instagram.com/${socialLinks.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {socialLinks.twitter && (
                          <a
                            href={`https://twitter.com/${socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100">
                      {product.product_images?.[0]?.url ? (
                        <Image
                          src={product.product_images[0].url}
                          alt={product.product_images[0].alt_text || product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      {product.price && (
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </p>
                      )}
                      {product.sku && (
                        <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `No products match "${searchQuery}"`
                    : selectedCategory
                    ? 'No products in this category'
                    : 'This vendor hasn\'t added any products yet'
                  }
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => handleContactClick('phone', vendor.phone)}
          className="rounded-full shadow-lg"
        >
          <Phone className="h-5 w-5 mr-2" />
          Contact Us
        </Button>
      </div>
    </div>
  )
}