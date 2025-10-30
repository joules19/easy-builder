'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Phone, Mail, Clock, Save, Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Vendor } from '@/types/database'
import toast from 'react-hot-toast'
import { isValidPhoneNumber, formatPhoneForDisplay } from '@/lib/utils/phone'

interface ContactPreferencesFormProps {
  vendor: Vendor
}

interface OperatingHours {
  [key: string]: {
    open: string
    close: string
    closed: boolean
  }
}

interface ContactPreferences {
  whatsapp_number?: string
  preferred_contact_method?: string
  response_time?: string
}

interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
}

export function ContactPreferencesForm({ vendor }: ContactPreferencesFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Safely parse existing data
  const parseOperatingHours = (hours: any): OperatingHours => {
    const defaults = {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    }

    if (!hours) return defaults

    const parsed: OperatingHours = {}
    for (const [day, value] of Object.entries(hours)) {
      if (typeof value === 'object' && value !== null && 'open' in value) {
        // Already in the correct format
        parsed[day as keyof OperatingHours] = value as { open: string, close: string, closed: boolean }
      } else if (typeof value === 'string') {
        // Convert string format to object format
        if (value.toLowerCase() === 'closed') {
          parsed[day as keyof OperatingHours] = { open: '09:00', close: '17:00', closed: true }
        } else {
          // Try to parse time range like "9:00 AM - 5:00 PM"
          const timeMatch = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
          if (timeMatch) {
            const [, openHour, openMin, openAmPm, closeHour, closeMin, closeAmPm] = timeMatch
            const open = convertTo24Hour(openHour, openMin, openAmPm)
            const close = convertTo24Hour(closeHour, closeMin, closeAmPm)
            parsed[day as keyof OperatingHours] = { open, close, closed: false }
          } else {
            parsed[day as keyof OperatingHours] = (defaults as any)[day as keyof OperatingHours]
          }
        }
      } else {
        parsed[day as keyof OperatingHours] = (defaults as any)[day as keyof OperatingHours]
      }
    }

    // Fill in any missing days with defaults
    for (const [day, defaultValue] of Object.entries(defaults)) {
      if (!parsed[day as keyof OperatingHours]) {
        parsed[day as keyof OperatingHours] = defaultValue
      }
    }

    return parsed
  }

  const convertTo24Hour = (hour: string, minute: string, ampm?: string): string => {
    let h = parseInt(hour)
    if (ampm && ampm.toLowerCase() === 'pm' && h !== 12) {
      h += 12
    } else if (ampm && ampm.toLowerCase() === 'am' && h === 12) {
      h = 0
    }
    return `${h.toString().padStart(2, '0')}:${minute}`
  }

  // Generate time options for dropdown
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        const ampm = hour < 12 ? 'AM' : 'PM'
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
        times.push({ value: time24, label: time12 })
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const operatingHours = parseOperatingHours(vendor.operating_hours)
  const contactPreferences = (vendor.contact_preferences as ContactPreferences) || {}
  const socialMedia = (vendor.social_media as SocialMedia) || {}

  const [hours, setHours] = useState<OperatingHours>(operatingHours)

  const [preferences, setPreferences] = useState<ContactPreferences>({
    whatsapp_number: contactPreferences.whatsapp_number || '',
    preferred_contact_method: contactPreferences.preferred_contact_method || 'phone',
    response_time: contactPreferences.response_time || 'within_24_hours',
  })

  const [whatsappError, setWhatsappError] = useState('')

  const [social, setSocial] = useState<SocialMedia>({
    facebook: socialMedia.facebook || '',
    instagram: socialMedia.instagram || '',
    twitter: socialMedia.twitter || '',
    linkedin: socialMedia.linkedin || '',
  })

  const handleWhatsAppChange = (value: string) => {
    setPreferences(prev => ({ ...prev, whatsapp_number: value }))
    
    if (value && !isValidPhoneNumber(value)) {
      setWhatsappError('Please enter a valid phone number with country code')
    } else {
      setWhatsappError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate WhatsApp number if provided
    if (preferences.whatsapp_number && !isValidPhoneNumber(preferences.whatsapp_number)) {
      toast.error('Please enter a valid WhatsApp number')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      
      const { error } = await supabase
        .from('vendors')
        // @ts-ignore - Supabase TypeScript issue with update method
        .update({
          operating_hours: hours,
          contact_preferences: preferences,
          social_media: social,
        })
        .eq('id', vendor.id)

      if (error) throw error


      toast.success('Contact preferences updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error updating contact preferences:', error)
      toast.error('Error updating preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Preferences */}
      <Card className="border-0 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Contact Preferences</CardTitle>
              <p className="text-body-sm text-muted-foreground">Set how customers can reach you</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="whatsapp" className="text-label-md font-semibold text-foreground">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={preferences.whatsapp_number}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                placeholder="+1 555 123 4567"
                className={`bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background ${
                  whatsappError ? 'border-destructive focus:border-destructive' : ''
                }`}
              />
              {whatsappError && (
                <p className="text-label-sm text-destructive">{whatsappError}</p>
              )}
              <p className="text-label-sm text-muted-foreground">
                Include country code for international customers (e.g., +1 for US/Canada)
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="preferred-method" className="text-label-md font-semibold text-foreground">Preferred Contact Method</Label>
              <Select
                value={preferences.preferred_contact_method}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_contact_method: value }))}
              >
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="any">Any Method</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="response-time" className="text-label-md font-semibold text-foreground">Expected Response Time</Label>
            <Select
              value={preferences.response_time}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, response_time: value }))}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="within_1_hour">Within 1 hour</SelectItem>
                <SelectItem value="within_4_hours">Within 4 hours</SelectItem>
                <SelectItem value="within_24_hours">Within 24 hours</SelectItem>
                <SelectItem value="within_48_hours">Within 48 hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-label-sm text-muted-foreground">
              Set realistic expectations for how quickly you'll respond
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="border-0 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Operating Hours</CardTitle>
              <p className="text-body-sm text-muted-foreground">When customers can reach you</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {days.map((day) => (
            <div key={day} className="flex items-center space-x-4 p-4 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/40 transition-all duration-200">
              <div className="w-28">
                <Label className="capitalize font-semibold text-foreground text-body-sm">{day}</Label>
              </div>

              <div className="flex items-center space-x-4 flex-1">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hours[day]?.closed}
                    onChange={(e) => setHours(prev => ({
                      ...prev,
                      [day]: { ...prev[day], closed: !e.target.checked }
                    }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="text-body-sm font-medium text-foreground">Open</span>
                </label>
                
                {!hours[day]?.closed ? (
                  <div className="flex items-center space-x-3">
                    <Select
                      value={hours[day]?.open || '09:00'}
                      onValueChange={(value) => setHours(prev => ({
                        ...prev,
                        [day]: { ...prev[day], open: value }
                      }))}
                    >
                      <SelectTrigger className="w-36 bg-background/80 border-border/50">
                        <SelectValue placeholder="Open time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-body-sm text-muted-foreground font-medium px-2">to</span>
                    <Select
                      value={hours[day]?.close || '17:00'}
                      onValueChange={(value) => setHours(prev => ({
                        ...prev,
                        [day]: { ...prev[day], close: value }
                      }))}
                    >
                      <SelectTrigger className="w-36 bg-background/80 border-border/50">
                        <SelectValue placeholder="Close time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <span className="text-body-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg font-medium border border-border/30">Closed</span>
                )}
              </div>
            </div>
          ))}
          
          {/* Quick Time Presets */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <Label className="text-label-md font-semibold text-foreground mb-4 block">Quick Presets</Label>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const businessHours = { open: '09:00', close: '17:00', closed: false }
                  const newHours = { ...hours }
                  days.forEach(day => {
                    if (day === 'sunday') {
                      newHours[day] = { ...businessHours, closed: true }
                    } else {
                      newHours[day] = { ...businessHours }
                    }
                  })
                  setHours(newHours)
                }}
                className="bg-background/50 hover:bg-background border-border/50"
              >
                Business Hours (9-5)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const retailHours = { open: '10:00', close: '20:00', closed: false }
                  const newHours = { ...hours }
                  days.forEach(day => {
                    newHours[day] = { ...retailHours }
                  })
                  setHours(newHours)
                }}
                className="bg-background/50 hover:bg-background border-border/50"
              >
                Retail Hours (10-8)
              </Button>
            </div>
          </div>

          <p className="text-label-sm text-muted-foreground mt-4 bg-muted/20 p-3 rounded-lg">
            💡 Check the box to mark your business as open, then select opening and closing times. This helps customers know when to contact you.
          </p>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="border-0 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Social Media Links</CardTitle>
              <p className="text-body-sm text-muted-foreground">Connect your social profiles</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="facebook" className="text-label-md font-semibold text-foreground flex items-center">
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-body-sm text-muted-foreground font-mono bg-muted/30 px-3 py-2 rounded-lg border border-border/50">facebook.com/</span>
                <Input
                  id="facebook"
                  value={social.facebook}
                  onChange={(e) => setSocial(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="your-page-name"
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="instagram" className="text-label-md font-semibold text-foreground flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                Instagram
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-body-sm text-muted-foreground font-mono bg-muted/30 px-3 py-2 rounded-lg border border-border/50">instagram.com/</span>
                <Input
                  id="instagram"
                  value={social.instagram}
                  onChange={(e) => setSocial(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="your-username"
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="twitter" className="text-label-md font-semibold text-foreground flex items-center">
                <Twitter className="h-4 w-4 mr-2 text-sky-600" />
                Twitter
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-body-sm text-muted-foreground font-mono bg-muted/30 px-3 py-2 rounded-lg border border-border/50">twitter.com/</span>
                <Input
                  id="twitter"
                  value={social.twitter}
                  onChange={(e) => setSocial(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="your-handle"
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="linkedin" className="text-label-md font-semibold text-foreground flex items-center">
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-body-sm text-muted-foreground font-mono bg-muted/30 px-3 py-2 rounded-lg border border-border/50">linkedin.com/company/</span>
                <Input
                  id="linkedin"
                  value={social.linkedin}
                  onChange={(e) => setSocial(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="your-company"
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background"
                />
              </div>
            </div>
          </div>
          
          <p className="text-label-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
            💡 Social media links help customers connect with you and build trust in your business
          </p>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-6 border-t border-border/50">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-chart-2 to-chart-2/80 hover:from-chart-2/90 hover:to-chart-2/70 text-white font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              <span className="text-body-md">Updating Preferences...</span>
            </div>
          ) : (
            <>
              <Save className="h-5 w-5 mr-3" />
              <span className="text-body-md">Save Contact Preferences</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}