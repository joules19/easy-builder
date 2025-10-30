'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { VendorWithCategories, ProductWithImages } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Store,
  MessageCircle,
  Eye,
  Heart,
  Share2
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { formatPhoneForCall, generateWhatsAppLink } from '@/lib/utils/phone'
import { ProductModal } from './product-modal'

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
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openProductModal = (product: ProductWithImages) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeProductModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

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

  const handleContactClick = async (type: string, value: string) => {
    // Track contact interaction in database
    try {
      await fetch('/api/contact-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: vendor.id,
          interaction_type: type,
          interaction_value: value,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      })
    } catch (error) {
      console.error('Failed to track contact interaction:', error)
    }
    
    switch (type) {
      case 'phone':
        // Use enhanced phone formatting
        const formattedPhone = formatPhoneForCall(value)
        window.open(`tel:${formattedPhone}`)
        break
      case 'email':
        window.open(`mailto:${value}?subject=Inquiry about ${vendor.name}`)
        break
      case 'whatsapp':
        // Use enhanced WhatsApp link generation
        const message = `Hi ${vendor.name}, I found you through your catalog and would like to know more about your products.`
        const whatsappLink = generateWhatsAppLink(value, message)
        window.open(whatsappLink, '_blank')
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
  
  // Safely parse contact preferences
  const parseContactPreferences = (prefs: any): Record<string, any> => {
    if (!prefs) return {}
    if (typeof prefs === 'string') {
      try {
        return JSON.parse(prefs)
      } catch {
        return {}
      }
    }
    if (typeof prefs === 'object') {
      return prefs
    }
    return {}
  }
  
  const contactPreferences = parseContactPreferences(vendor.contact_preferences)
  
  // Helper function to format time for display
  const formatTimeForDisplay = (time: string): string => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  
  // Temporary debug display - remove after testing
  const hasWhatsApp = contactPreferences.whatsapp_number && contactPreferences.whatsapp_number.trim() !== ''
  
  // Safely parse operating hours
  const parseOperatingHours = (hours: any): Record<string, string> => {
    if (!hours) return {}
    
    if (typeof hours === 'string') {
      try {
        const parsed = JSON.parse(hours)
        return parseOperatingHours(parsed) // Recursive call to handle parsed object
      } catch {
        return {}
      }
    }
    
    if (typeof hours === 'object') {
      const parsed: Record<string, string> = {}
      for (const [day, time] of Object.entries(hours)) {
        if (typeof time === 'string' && time.trim() !== '') {
          parsed[day] = time
        } else if (typeof time === 'object' && time && 'open' in time && 'close' in time && 'closed' in time) {
          // Handle new time object format { open: "09:00", close: "17:00", closed: false }
          const timeObj = time as { open: string, close: string, closed: boolean }
          if (timeObj.closed) {
            parsed[day] = 'Closed'
          } else {
            // Convert 24-hour format to 12-hour format for display
            const openTime = formatTimeForDisplay(timeObj.open)
            const closeTime = formatTimeForDisplay(timeObj.close)
            parsed[day] = `${openTime} - ${closeTime}`
          }
        } else if (typeof time === 'object') {
          // Handle malformed objects
          console.warn(`Skipping malformed operating hours for ${day}:`, time)
        }
      }
      return parsed
    }
    
    return {}
  }
  
  const operatingHours = parseOperatingHours(vendor.operating_hours)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">

      {/* Mobile Header - Compact */}
      <header className="lg:hidden relative bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            {vendor.logo_url ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-background/50 backdrop-blur border border-border/50 shadow-modern-lg flex-shrink-0">
                <Image
                  src={vendor.logo_url}
                  alt={`${vendor.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-chart-1/10 flex items-center justify-center shadow-modern-lg border border-border/50 flex-shrink-0">
                <Store className="h-6 w-6 text-primary" />
              </div>
            )}

            {/* Business Info - Compact */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">
                {vendor.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  size="sm"
                  onClick={() => handleContactClick('phone', vendor.phone)}
                  className="bg-primary hover:bg-primary/90 h-8 px-3"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Call</span>
                </Button>
                {contactPreferences.whatsapp_number && (
                  <Button
                    size="sm"
                    onClick={() => handleContactClick('whatsapp', contactPreferences.whatsapp_number)}
                    className="bg-green-600 hover:bg-green-700 h-8 px-3"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">WhatsApp</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - Full */}
      <header className="hidden lg:block relative bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Logo */}
            {vendor.logo_url ? (
              <div className="relative w-20 h-20 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-background/50 backdrop-blur border border-border/50 shadow-modern-lg">
                <Image
                  src={vendor.logo_url}
                  alt={`${vendor.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-primary/10 to-chart-1/10 flex items-center justify-center shadow-modern-lg border border-border/50">
                <Store className="h-10 w-10 lg:h-14 lg:w-14 text-primary" />
              </div>
            )}

            {/* Business Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-display-md lg:text-display-lg font-bold text-foreground mb-3">
                  {vendor.name}
                </h1>
                {vendor.description && (
                  <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">{vendor.description}</p>
                )}
              </div>
              
              {/* Quick Contact */}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => handleContactClick('phone', vendor.phone)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-modern-md"
                  aria-label={`Call ${vendor.name} at ${vendor.phone}`}
                >
                  <Phone className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="text-body-md font-medium">Call Now</span>
                </Button>
                {contactPreferences.whatsapp_number && (
                  <Button
                    size="lg"
                    onClick={() => handleContactClick('whatsapp', contactPreferences.whatsapp_number)}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-modern-md"
                    aria-label={`Send WhatsApp message to ${vendor.name}`}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span className="text-body-md font-medium">WhatsApp</span>
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleContactClick('email', vendor.email)}
                  className="border-border/50 bg-background/80 hover:bg-background shadow-modern-md"
                  aria-label={`Send email to ${vendor.name} at ${vendor.email}`}
                >
                  <Mail className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="text-body-md font-medium">Email</span>
                </Button>
                {vendor.address && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleContactClick('location', vendor.address!)}
                    className="border-border/50 bg-background/80 hover:bg-background shadow-modern-md"
                    aria-label={`View ${vendor.name} location on map: ${vendor.address}`}
                  >
                    <MapPin className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span className="text-body-md font-medium">Location</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* Mobile Quick Filters */}
        <div className="lg:hidden mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 h-11"
            />
          </div>

          {/* Categories - Horizontal Scroll */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All ({vendor.categories.reduce((sum, cat) => sum + cat.products.length, 0)})
            </button>
            {vendor.categories.map(category => (
              <button
                key={category.id}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-chart-1 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.products.length})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-6">
              {/* Search */}
              <Card className="border-0 bg-card/80 backdrop-blur shadow-modern-lg">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="text-heading-sm font-semibold text-foreground flex items-center">
                      <Search className="h-5 w-5 mr-2 text-primary" />
                      Search Products
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="product-search"
                        placeholder="Find what you're looking for..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background h-12"
                        aria-label={`Search products in ${vendor.name} catalog`}
                        role="searchbox"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-0 bg-card/80 backdrop-blur shadow-modern-lg">
                <CardContent className="p-6">
                  <h3 className="text-heading-sm font-semibold text-foreground mb-4 flex items-center">
                    <Store className="h-5 w-5 mr-2 text-chart-1" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      className={`w-full text-left px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-200 ${
                        !selectedCategory 
                          ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20' 
                          : 'hover:bg-muted/50 text-foreground'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      <div className="flex items-center justify-between">
                        <span>All Products</span>
                        <span className="text-muted-foreground text-label-sm font-medium">({vendor.categories.reduce((sum, cat) => sum + cat.products.length, 0)})</span>
                      </div>
                    </button>
                    {vendor.categories.map(category => (
                      <button
                        key={category.id}
                        className={`w-full text-left px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-chart-1/10 to-chart-1/5 text-chart-1 border border-chart-1/20'
                            : 'hover:bg-muted/50 text-foreground'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-muted-foreground text-label-sm font-medium">({category.products.length})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-0 bg-card/80 backdrop-blur shadow-modern-lg">
                <CardContent className="p-6">
                  <h3 className="text-heading-sm font-semibold text-foreground mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-chart-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="text-body-sm font-medium text-foreground">{vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-body-sm font-medium text-foreground break-all">{vendor.email}</span>
                    </div>
                    {vendor.address && (
                      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4 mt-0.5">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-body-sm font-medium text-foreground leading-relaxed">{vendor.address}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Globe className="h-4 w-4" />
                        </div>
                        <a 
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-body-sm font-medium text-primary hover:underline break-all"
                        >
                          {vendor.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Operating Hours */}
                  {Object.keys(operatingHours).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <h4 className="text-label-md font-semibold text-foreground mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Operating Hours
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                            <span className="capitalize text-body-sm font-medium text-foreground">{day}</span>
                            <span className="text-body-sm text-muted-foreground font-medium">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Contact (if available) */}
                  {contactPreferences.whatsapp_number && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <h4 className="text-label-md font-semibold text-foreground mb-3">Quick Message</h4>
                      <Button
                        onClick={() => handleContactClick('whatsapp', contactPreferences.whatsapp_number)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-modern-md h-12"
                      >
                        <MessageCircle className="h-5 w-5 mr-3" />
                        <span className="text-body-md font-medium">Message on WhatsApp</span>
                      </Button>
                    </div>
                  )}

                  {/* Social Media */}
                  {Object.keys(socialLinks).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <h4 className="text-label-md font-semibold text-foreground mb-3">Follow Us</h4>
                      <div className="flex space-x-3">
                        {socialLinks.facebook && (
                          <a
                            href={`https://facebook.com/${socialLinks.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-modern-md hover:shadow-modern-lg"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                        {socialLinks.instagram && (
                          <a
                            href={`https://instagram.com/${socialLinks.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all duration-200 shadow-modern-md hover:shadow-modern-lg"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {socialLinks.twitter && (
                          <a
                            href={`https://twitter.com/${socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-modern-md hover:shadow-modern-lg"
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

          {/* Main Content - Full width on mobile */}
          <div className="col-span-1 lg:col-span-3">
            {/* Mobile Vendor Info - Collapsible */}
            <div className="lg:hidden mb-6">
              <Card className="border-0 bg-card/80 backdrop-blur shadow-modern-lg">
                <CardContent className="p-4">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Store className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">About {vendor.name}</h3>
                          <p className="text-xs text-muted-foreground">Tap to view details</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {vendor.description && (
                          <span className="text-xs text-muted-foreground">•</span>
                        )}
                        <div className="transform transition-transform group-open:rotate-180">
                          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                      {vendor.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{vendor.description}</p>
                      )}
                      
                      {/* Contact Details */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                            <Phone className="h-3 w-3" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{vendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                            <Mail className="h-3 w-3" />
                          </div>
                          <span className="text-sm font-medium text-foreground break-all">{vendor.email}</span>
                        </div>
                        {vendor.address && (
                          <div className="flex items-start space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4 mt-0.5">
                              <MapPin className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-foreground leading-relaxed">{vendor.address}</span>
                          </div>
                        )}
                        {vendor.website && (
                          <div className="flex items-center space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Globe className="h-3 w-3" />
                            </div>
                            <a 
                              href={vendor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary hover:underline break-all"
                            >
                              {vendor.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Operating Hours */}
                      {Object.keys(operatingHours).length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                            <Clock className="h-3 w-3 mr-2" />
                            Hours
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(operatingHours).slice(0, 3).map(([day, hours]) => (
                              <div key={day} className="flex justify-between items-center text-xs">
                                <span className="capitalize font-medium text-foreground">{day}</span>
                                <span className="text-muted-foreground">{hours}</span>
                              </div>
                            ))}
                            {Object.keys(operatingHours).length > 3 && (
                              <p className="text-xs text-muted-foreground">+ {Object.keys(operatingHours).length - 3} more days</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Social Media */}
                      {Object.keys(socialLinks).length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <h4 className="text-sm font-semibold text-foreground mb-2">Follow Us</h4>
                          <div className="flex space-x-2">
                            {socialLinks.facebook && (
                              <a
                                href={`https://facebook.com/${socialLinks.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Facebook className="h-3 w-3" />
                              </a>
                            )}
                            {socialLinks.instagram && (
                              <a
                                href={`https://instagram.com/${socialLinks.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                              >
                                <Instagram className="h-3 w-3" />
                              </a>
                            )}
                            {socialLinks.twitter && (
                              <a
                                href={`https://twitter.com/${socialLinks.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                              >
                                <Twitter className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <section aria-label="Product catalog">
                <h2 className="sr-only">Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" role="grid">
                  {filteredProducts.map(product => (
                    <article 
                      key={product.id} 
                      className="group border-0 bg-card/80 backdrop-blur shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 overflow-hidden cursor-pointer hover-lift" 
                      role="gridcell"
                      onClick={() => openProductModal(product)}
                    >
                      {/* Product Image */}
                      <div className="relative h-64 bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
                        {product.product_images?.[0]?.url ? (
                          <Image
                            src={product.product_images[0].url}
                            alt={product.product_images[0].alt_text || `${product.name} product image`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            quality={85}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" role="img" aria-label="No product image available">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
                              <Store className="h-8 w-8" aria-hidden="true" />
                            </div>
                          </div>
                        )}
                        
                        {/* Image Count Badge */}
                        {product.product_images && product.product_images.length > 1 && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur">
                              +{product.product_images.length - 1} more
                            </Badge>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between text-white">
                              <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-medium">View Details</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Add to favorites functionality
                                  }}
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Share functionality
                                  }}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-heading-md font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-body-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="space-y-1">
                            {product.price && (
                              <p className="text-heading-lg font-bold text-primary" aria-label={`Price: ${formatPrice(product.price)}`}>
                                {formatPrice(product.price)}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              <span className="text-xs">{product.view_count || 0} views</span>
                            </div>
                          </div>
                          {product.sku && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {product.sku}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <Card className="border-0 bg-card/80 backdrop-blur shadow-modern-lg">
                <CardContent className="p-12">
                  <div className="text-center space-y-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground mx-auto">
                      <Store className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-heading-md font-semibold text-foreground mb-2">No products found</h3>
                      <p className="text-body-md text-muted-foreground">
                        {searchQuery 
                          ? `No products match "${searchQuery}"`
                          : selectedCategory
                          ? 'No products in this category'
                          : 'This vendor hasn\'t added any products yet'
                        }
                      </p>
                    </div>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                        className="mt-6 border-border/50 bg-background/50 hover:bg-background"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating Contact Buttons */}
      <aside className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col space-y-3 sm:space-y-4" aria-label="Quick contact options">
        {contactPreferences.whatsapp_number && (
          <Button
            size="lg"
            onClick={() => handleContactClick('whatsapp', contactPreferences.whatsapp_number)}
            className="rounded-2xl shadow-modern-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-0 h-12 sm:h-14 px-4 sm:px-6 backdrop-blur touch-target"
            aria-label={`Contact ${vendor.name} via WhatsApp`}
          >
            <MessageCircle className="h-5 w-5 mr-3" aria-hidden="true" />
            <span className="text-body-md font-medium">WhatsApp</span>
          </Button>
        )}
        <Button
          size="lg"
          onClick={() => handleContactClick('phone', vendor.phone)}
          className="rounded-2xl shadow-modern-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 h-12 sm:h-14 px-4 sm:px-6 backdrop-blur touch-target"
          aria-label={`Call ${vendor.name} at ${vendor.phone}`}
        >
          <Phone className="h-5 w-5 mr-3" aria-hidden="true" />
          <span className="text-body-md font-medium">Call Now</span>
        </Button>
      </aside>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        vendorName={vendor.name}
      />
    </div>
  )
}