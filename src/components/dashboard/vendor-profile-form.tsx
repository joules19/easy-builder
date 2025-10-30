'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, Upload, X, ExternalLink, Phone, MapPin, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Vendor } from '@/types/database'
import toast from 'react-hot-toast'

interface VendorProfileFormProps {
  vendor: Vendor
}

export function VendorProfileForm({ vendor }: VendorProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: vendor.name,
    description: vendor.description || '',
    email: vendor.email,
    phone: vendor.phone,
    address: vendor.address || '',
    website: vendor.website || '',
    slug: vendor.slug,
    status: vendor.status,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('vendors')
        // @ts-ignore - Supabase TypeScript issue with update method
        .update({
          name: formData.name,
          description: formData.description || null,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || null,
          website: formData.website || null,
          slug: formData.slug,
        })
        .eq('id', vendor.id)

      if (error) throw error

      toast.success('Profile updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSlugChange = (name: string) => {
    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Business Name */}
      <div className="space-y-3">
        <Label htmlFor="name" className="text-label-md font-semibold text-foreground">Business Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }))
            handleSlugChange(e.target.value)
          }}
          placeholder="Your business name"
          required
          maxLength={255}
          className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
        />
      </div>

      {/* URL Slug */}
      <div className="space-y-3">
        <Label htmlFor="slug" className="text-label-md font-semibold text-foreground">URL Slug *</Label>
        <div className="flex items-center space-x-3">
          <span className="text-body-sm text-muted-foreground font-mono bg-muted/30 px-3 py-2 rounded-lg">/vendors/</span>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="your-business-name"
            required
            maxLength={100}
            pattern="^[a-z0-9-]+$"
            className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background font-mono"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(`/vendors/${formData.slug}`, '_blank')}
            disabled={!formData.slug}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-label-sm text-muted-foreground">
          Only lowercase letters, numbers, and hyphens allowed
        </p>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-label-md font-semibold text-foreground">Business Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Tell customers about your business..."
          rows={4}
          maxLength={1000}
          className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-label-sm text-muted-foreground">Describe what makes your business special</p>
          <span className="text-label-sm text-muted-foreground font-mono">
            {formData.description.length}/1000
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
            <Phone className="h-4 w-4" />
          </div>
          <h3 className="text-heading-sm font-semibold text-foreground">Contact Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-label-md font-semibold text-foreground">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contact@business.com"
              required
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-label-md font-semibold text-foreground">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
              required
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="text-heading-sm font-semibold text-foreground">Location & Website</h3>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="address" className="text-label-md font-semibold text-foreground">Business Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="123 Main St, City, State 12345"
            rows={2}
            maxLength={500}
            className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background resize-none"
          />
          <p className="text-label-sm text-muted-foreground">Full street address helps customers find you</p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="website" className="text-label-md font-semibold text-foreground">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://www.yourwebsite.com"
            className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
          />
          <p className="text-label-sm text-muted-foreground">Link to your existing website or social media</p>
        </div>
      </div>

      {/* Account Status */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 text-info">
            <Settings className="h-4 w-4" />
          </div>
          <h3 className="text-heading-sm font-semibold text-foreground">Account Status</h3>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md font-semibold text-foreground">Current Status</span>
            <Badge 
              className={vendor.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}
            >
              {vendor.status === 'active' ? '✅ Active' : '⏳ Pending Approval'}
            </Badge>
          </div>
          {vendor.status === 'pending' ? (
            <div className="space-y-2">
              <p className="text-body-sm text-muted-foreground">
                Your account is pending approval. You can still manage your catalog, 
                but it won't be publicly visible until approved.
              </p>
              <p className="text-label-sm text-muted-foreground">
                We'll notify you via email once your account is approved.
              </p>
            </div>
          ) : (
            <p className="text-body-sm text-muted-foreground">
              Your business is live and visible to customers. Keep your information updated!
            </p>
          )}
        </div>
      </div>

      {/* Logo Upload Placeholder */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
            <Upload className="h-4 w-4" />
          </div>
          <h3 className="text-heading-sm font-semibold text-foreground">Business Logo</h3>
        </div>
        
        <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center bg-muted/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mx-auto mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <h4 className="text-body-sm font-semibold text-foreground mb-2">Upload your business logo</h4>
          <p className="text-label-sm text-muted-foreground mb-4">
            Recommended: 400x400px, PNG or JPG, max 2MB
          </p>
          <Button variant="outline" size="sm" disabled className="bg-background/50">
            <Upload className="h-4 w-4 mr-2" />
            Upload Logo (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-border/50">
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim()}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              <span className="text-body-md">Updating Profile...</span>
            </div>
          ) : (
            <>
              <Save className="h-5 w-5 mr-3" />
              <span className="text-body-md">Update Profile</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}