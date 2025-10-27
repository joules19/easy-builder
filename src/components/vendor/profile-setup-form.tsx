'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Store, MapPin, Globe, Clock } from 'lucide-react'
import { generateSlug } from '@/lib/utils'

interface ProfileFormData {
  businessName: string
  description: string
  address: string
  website: string
  customSlug: string
}

interface ProfileSetupFormProps {
  userEmail: string
  userName?: string
}

export function ProfileSetupForm({ userEmail, userName }: ProfileSetupFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    businessName: userName || '',
    description: '',
    address: '',
    website: '',
    customSlug: '',
  })
  const [generatedSlug, setGeneratedSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  // Generate slug when business name changes
  const handleBusinessNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, businessName: value }))
    const slug = generateSlug(value)
    setGeneratedSlug(slug)
    if (!formData.customSlug) {
      setFormData(prev => ({ ...prev, customSlug: slug }))
    }
  }

  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      return 'Business name is required'
    }
    if (!formData.customSlug.trim()) {
      return 'URL slug is required'
    }
    if (formData.customSlug.length < 3) {
      return 'URL slug must be at least 3 characters'
    }
    // Basic URL slug validation
    if (!/^[a-z0-9-]+$/.test(formData.customSlug)) {
      return 'URL slug can only contain lowercase letters, numbers, and hyphens'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Authentication required')
        return
      }

      // Check if slug is available
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('slug', formData.customSlug)
        .single()

      if (existingVendor) {
        setError('This URL is already taken. Please choose a different one.')
        return
      }

      // Create vendor profile
      const { error: insertError } = await supabase
        .from('vendors')
        .insert({
          user_id: user.id,
          name: formData.businessName,
          description: formData.description || null,
          email: userEmail,
          phone: user.user_metadata?.phone || '',
          address: formData.address || null,
          website: formData.website || null,
          slug: formData.customSlug,
          status: 'active', // Auto-activate for now
        })

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          setError('This URL is already taken. Please choose a different one.')
        } else {
          setError(insertError.message)
        }
        return
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
      router.refresh()

    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Profile setup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Store className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Set up your business profile to start showcasing your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => handleBusinessNameChange(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Custom URL Slug */}
          <div className="space-y-2">
            <Label htmlFor="customSlug">Your Custom URL *</Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">easybuilder.com/vendors/</span>
              <Input
                id="customSlug"
                placeholder="your-business"
                value={formData.customSlug}
                onChange={(e) => updateFormData('customSlug', e.target.value.toLowerCase())}
                required
                disabled={loading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              This will be your unique URL. Use lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              placeholder="Tell customers about your business..."
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              disabled={loading}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              This will be shown on your public catalog page.
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Business Address</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Enter your business address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              disabled={loading}
              rows={2}
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span>Website (Optional)</span>
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://your-website.com"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/auth/login')}
              disabled={loading}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </div>
        </form>

        {/* Preview */}
        {formData.customSlug && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Preview:</h3>
            <p className="text-sm text-gray-600">
              Your catalog will be available at:{' '}
              <span className="font-mono text-blue-600">
                easybuilder.com/vendors/{formData.customSlug}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}