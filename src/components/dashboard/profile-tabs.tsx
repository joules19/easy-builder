'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VendorProfileForm } from '@/components/dashboard/vendor-profile-form'
import { ContactPreferencesForm } from '@/components/dashboard/contact-preferences-form'
import { 
  User, 
  Phone, 
  Eye, 
  Settings,
  ExternalLink,
  Mail,
  MapPin,
  Globe,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react'
import { Vendor } from '@/types/database'

interface ProfileTabsProps {
  vendor: Vendor
}

interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
}

interface ContactPreferences {
  whatsapp_number?: string
  preferred_contact_method?: string
  response_time?: string
}

export function ProfileTabs({ vendor }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    {
      id: 'profile',
      label: 'Basic Information',
      icon: User,
      description: 'Business details and contact info'
    },
    {
      id: 'contact',
      label: 'Contact & Hours',
      icon: Phone,
      description: 'Communication preferences and operating hours'
    },
    {
      id: 'preview',
      label: 'Profile Preview',
      icon: Eye,
      description: 'How your profile appears to customers'
    }
  ]

  const socialMedia = (vendor.social_media as SocialMedia) || {}
  const contactPreferences = (vendor.contact_preferences as ContactPreferences) || {}

  const formatOperatingHours = (hours: any) => {
    if (!hours) return 'Not set'
    
    const daysWithHours = Object.entries(hours).filter(([_, value]: [string, any]) => 
      value && typeof value === 'object' && !value.closed
    )
    
    if (daysWithHours.length === 0) return 'Closed'
    if (daysWithHours.length === 7) return 'Open 7 days'
    
    return `Open ${daysWithHours.length} days`
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <IconComponent className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`} />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs text-muted-foreground">{tab.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'profile' && (
          <Card className="border-0 bg-card/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-heading-md font-semibold text-foreground">Basic Information</CardTitle>
                  <p className="text-body-sm text-muted-foreground">Manage your business details and contact information</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <VendorProfileForm vendor={vendor} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'contact' && (
          <Card className="border-0 bg-card/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-heading-md font-semibold text-foreground">Contact & Hours</CardTitle>
                  <p className="text-body-sm text-muted-foreground">Set your communication preferences and operating hours</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ContactPreferencesForm vendor={vendor} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Profile Summary Card */}
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-heading-md font-semibold text-foreground">Profile Preview</CardTitle>
                      <p className="text-body-sm text-muted-foreground">How your business appears to customers</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`/vendors/${vendor.slug}`, '_blank')}
                    className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Page
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-background/60 backdrop-blur rounded-xl p-6 space-y-6">
                  {/* Business Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-heading-lg font-bold text-foreground">{vendor.name}</h3>
                      <Badge 
                        variant={vendor.status === 'active' ? 'default' : 'secondary'}
                        className={vendor.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}
                      >
                        {vendor.status === 'active' ? '✅ Active' : '⏳ Pending'}
                      </Badge>
                    </div>
                    {vendor.description && (
                      <p className="text-body-md text-muted-foreground leading-relaxed">{vendor.description}</p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.email && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-label-sm text-muted-foreground">Email</p>
                          <p className="text-body-sm font-medium text-foreground">{vendor.email}</p>
                        </div>
                      </div>
                    )}

                    {vendor.phone && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-label-sm text-muted-foreground">Phone</p>
                          <p className="text-body-sm font-medium text-foreground">{vendor.phone}</p>
                        </div>
                      </div>
                    )}

                    {contactPreferences.whatsapp_number && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-label-sm text-muted-foreground">WhatsApp</p>
                          <p className="text-body-sm font-medium text-foreground">{contactPreferences.whatsapp_number}</p>
                        </div>
                      </div>
                    )}

                    {vendor.address && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-label-sm text-muted-foreground">Address</p>
                          <p className="text-body-sm font-medium text-foreground">{vendor.address}</p>
                        </div>
                      </div>
                    )}

                    {vendor.website && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-label-sm text-muted-foreground">Website</p>
                          <p className="text-body-sm font-medium text-foreground">{vendor.website}</p>
                        </div>
                      </div>
                    )}

                    {vendor.operating_hours && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 text-info">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-label-sm text-muted-foreground">Operating Hours</p>
                          <p className="text-body-sm font-medium text-foreground">{formatOperatingHours(vendor.operating_hours)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {(socialMedia.facebook || socialMedia.instagram || socialMedia.twitter || socialMedia.linkedin) && (
                    <div className="space-y-3">
                      <h4 className="text-body-sm font-semibold text-foreground">Social Media</h4>
                      <div className="flex flex-wrap gap-3">
                        {socialMedia.facebook && (
                          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <Facebook className="h-4 w-4 text-blue-600" />
                            <span className="text-body-sm text-blue-700">Facebook</span>
                          </div>
                        )}
                        {socialMedia.instagram && (
                          <div className="flex items-center space-x-2 px-3 py-2 bg-pink-50 border border-pink-200 rounded-lg">
                            <Instagram className="h-4 w-4 text-pink-600" />
                            <span className="text-body-sm text-pink-700">Instagram</span>
                          </div>
                        )}
                        {socialMedia.twitter && (
                          <div className="flex items-center space-x-2 px-3 py-2 bg-sky-50 border border-sky-200 rounded-lg">
                            <Twitter className="h-4 w-4 text-sky-600" />
                            <span className="text-body-sm text-sky-700">Twitter</span>
                          </div>
                        )}
                        {socialMedia.linkedin && (
                          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <Linkedin className="h-4 w-4 text-blue-600" />
                            <span className="text-body-sm text-blue-700">LinkedIn</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Preferences */}
                  {(contactPreferences.preferred_contact_method || contactPreferences.response_time) && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <h4 className="text-body-sm font-semibold text-foreground">Contact Preferences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {contactPreferences.preferred_contact_method && (
                          <div className="flex items-center space-x-2">
                            <span className="text-label-sm text-muted-foreground">Preferred method:</span>
                            <Badge variant="outline" className="capitalize">
                              {contactPreferences.preferred_contact_method.replace('_', ' ')}
                            </Badge>
                          </div>
                        )}
                        {contactPreferences.response_time && (
                          <div className="flex items-center space-x-2">
                            <span className="text-label-sm text-muted-foreground">Response time:</span>
                            <Badge variant="outline" className="capitalize">
                              {contactPreferences.response_time.replace('_', ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-card/80 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-heading-md font-semibold text-foreground">Quick Actions</CardTitle>
                <p className="text-body-sm text-muted-foreground">Manage your public presence and reach more customers</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 border-chart-1/20 bg-chart-1/5 hover:bg-chart-1/10"
                    onClick={() => window.open(`/vendors/${vendor.slug}`, '_blank')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <ExternalLink className="h-5 w-5 text-chart-1" />
                      <span className="text-body-sm font-medium text-foreground">View Public Page</span>
                      <span className="text-label-sm text-muted-foreground">See how customers view your business</span>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 border-chart-2/20 bg-chart-2/5 hover:bg-chart-2/10"
                    onClick={() => setActiveTab('profile')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Settings className="h-5 w-5 text-chart-2" />
                      <span className="text-body-sm font-medium text-foreground">Edit Profile</span>
                      <span className="text-label-sm text-muted-foreground">Update business information</span>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 border-chart-3/20 bg-chart-3/5 hover:bg-chart-3/10"
                    onClick={() => setActiveTab('contact')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Phone className="h-5 w-5 text-chart-3" />
                      <span className="text-body-sm font-medium text-foreground">Contact Settings</span>
                      <span className="text-label-sm text-muted-foreground">Manage how customers reach you</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}