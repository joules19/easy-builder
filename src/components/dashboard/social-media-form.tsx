'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface SocialMediaFormProps {
  vendorId: string
  currentSocial?: any
  currentContact?: any
}

export function SocialMediaForm({ vendorId, currentSocial, currentContact }: SocialMediaFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [socialMedia, setSocialMedia] = useState({
    facebook: currentSocial?.facebook || '',
    instagram: currentSocial?.instagram || '',
    twitter: currentSocial?.twitter || '',
    linkedin: currentSocial?.linkedin || '',
    youtube: currentSocial?.youtube || '',
    tiktok: currentSocial?.tiktok || '',
    ...currentSocial
  })
  const [contactPrefs, setContactPrefs] = useState({
    preferred_contact: currentContact?.preferred_contact || 'phone',
    whatsapp: currentContact?.whatsapp || '',
    show_email: currentContact?.show_email ?? true,
    show_phone: currentContact?.show_phone ?? true,
    show_address: currentContact?.show_address ?? true,
    ...currentContact
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Clean up social media URLs
      const cleanSocialMedia = Object.entries(socialMedia).reduce((acc, [key, value]) => {
        if (value && typeof value === 'string') {
          // Extract username/handle from full URLs
          let cleanValue = value.trim()
          if (cleanValue.includes('/')) {
            cleanValue = cleanValue.split('/').pop() || cleanValue
          }
          if (cleanValue.startsWith('@')) {
            cleanValue = cleanValue.substring(1)
          }
          acc[key] = cleanValue
        }
        return acc
      }, {} as any)

      const { error } = await supabase
        .from('vendors')
        // @ts-ignore - Supabase TypeScript issue with update method
        .update({
          social_media: cleanSocialMedia,
          contact_preferences: contactPrefs
        })
        .eq('id', vendorId)

      if (error) throw error

      toast.success('Social media and contact preferences updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Error updating preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourbusiness', icon: '📘' },
    { key: 'instagram', label: 'Instagram', placeholder: '@yourbusiness', icon: '📸' },
    { key: 'twitter', label: 'Twitter/X', placeholder: '@yourbusiness', icon: '🐦' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/company/yourbusiness', icon: '💼' },
    { key: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@yourbusiness', icon: '📺' },
    { key: 'tiktok', label: 'TikTok', placeholder: '@yourbusiness', icon: '🎵' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Social Media Links */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Social Media Profiles</Label>
          <p className="text-sm text-gray-600 mt-1">
            Add your social media links to help customers connect with you
          </p>
        </div>

        <div className="space-y-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.key} className="space-y-2">
              <Label htmlFor={platform.key} className="flex items-center">
                <span className="mr-2">{platform.icon}</span>
                {platform.label}
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id={platform.key}
                  value={socialMedia[platform.key] || ''}
                  onChange={(e) => setSocialMedia((prev: any) => ({ 
                    ...prev, 
                    [platform.key]: e.target.value 
                  }))}
                  placeholder={platform.placeholder}
                  className="flex-1"
                />
                {socialMedia[platform.key] && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = getFullUrl(platform.key, socialMedia[platform.key])
                      window.open(url, '_blank')
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Preferences */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Contact Preferences</Label>
          <p className="text-sm text-gray-600 mt-1">
            Control how customers can contact you and what information is displayed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferred_contact">Preferred Contact Method</Label>
            <Select
              value={contactPrefs.preferred_contact}
              onValueChange={(value) => setContactPrefs((prev: any) => ({ 
                ...prev, 
                preferred_contact: value 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={contactPrefs.whatsapp || ''}
              onChange={(e) => setContactPrefs((prev: any) => ({ 
                ...prev, 
                whatsapp: e.target.value 
              }))}
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
          </div>
        </div>

        {/* Visibility Settings */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Contact Information Visibility</Label>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactPrefs.show_phone}
                onChange={(e) => setContactPrefs((prev: any) => ({ 
                  ...prev, 
                  show_phone: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="text-sm">Show phone number on public page</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactPrefs.show_email}
                onChange={(e) => setContactPrefs((prev: any) => ({ 
                  ...prev, 
                  show_email: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="text-sm">Show email address on public page</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactPrefs.show_address}
                onChange={(e) => setContactPrefs((prev: any) => ({ 
                  ...prev, 
                  show_address: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="text-sm">Show business address on public page</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Contact Section Preview</Label>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Contact Us</h4>
          
          <div className="space-y-2 text-sm">
            {contactPrefs.show_phone && (
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>Phone (Click to call)</span>
              </div>
            )}
            
            {contactPrefs.show_email && (
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>Email (Click to send)</span>
              </div>
            )}
            
            {contactPrefs.whatsapp && (
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>WhatsApp (Click to message)</span>
              </div>
            )}
            
            {contactPrefs.show_address && (
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Visit us (Click for directions)</span>
              </div>
            )}
          </div>

          {Object.values(socialMedia).some(Boolean) && (
            <div className="mt-4 pt-3 border-t">
              <p className="text-sm font-medium mb-2">Follow us:</p>
              <div className="flex space-x-2">
                {socialPlatforms.map((platform) => 
                  socialMedia[platform.key] && (
                    <span key={platform.key} className="text-lg">
                      {platform.icon}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating Preferences...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Contact & Social Media
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

function getFullUrl(platform: string, handle: string): string {
  const baseUrls: Record<string, string> = {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    twitter: 'https://twitter.com/',
    linkedin: 'https://linkedin.com/company/',
    youtube: 'https://youtube.com/@',
    tiktok: 'https://tiktok.com/@',
  }
  
  const baseUrl = baseUrls[platform]
  if (!baseUrl) return handle
  
  const cleanHandle = handle.replace('@', '').replace(baseUrl, '')
  return baseUrl + cleanHandle
}