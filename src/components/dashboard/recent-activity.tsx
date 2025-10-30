import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QRScan, ContactInteraction, PageView } from '@/types/database'
import { 
  Activity,
  QrCode,
  Eye,
  Phone,
  Clock,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react'

interface RecentActivityProps {
  vendorId: string
}

export async function RecentActivity({ vendorId }: RecentActivityProps) {
  const supabase = createServerSupabaseClient()

  // Get recent activities from different sources
  const [
    scansResult,
    contactsResult,
    viewsResult
  ] = await Promise.all([
    supabase
      .from('qr_scans')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('scanned_at', { ascending: false })
      .limit(5),
    supabase
      .from('contact_interactions')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('page_views')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('viewed_at', { ascending: false })
      .limit(5)
  ])

  const recentScans = scansResult.data as QRScan[] | null
  const recentContacts = contactsResult.data as ContactInteraction[] | null  
  const recentViews = viewsResult.data as PageView[] | null

  // Combine and sort all activities
  const allActivities = [
    ...(recentScans?.map(scan => ({
      type: 'qr_scan',
      timestamp: scan.scanned_at,
      data: scan,
      icon: QrCode,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
    })) || []),
    ...(recentContacts?.map(contact => ({
      type: 'contact',
      timestamp: contact.created_at,
      data: contact,
      icon: Phone,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
    })) || []),
    ...(recentViews?.map(view => ({
      type: 'page_view',
      timestamp: view.viewed_at,
      data: view,
      icon: Eye,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    })) || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'qr_scan':
        const scanData = activity.data as QRScan
        return {
          title: 'QR Code Scanned',
          description: scanData.utm_source 
            ? `From ${scanData.utm_source.replace('_', ' ')}` 
            : 'Direct scan',
          time: new Date(activity.timestamp).toLocaleString()
        }
      case 'contact':
        const contactData = activity.data as ContactInteraction
        return {
          title: 'Contact Interaction',
          description: `${contactData.interaction_type.charAt(0).toUpperCase() + contactData.interaction_type.slice(1)} contact attempted`,
          time: new Date(activity.timestamp).toLocaleString()
        }
      case 'page_view':
        const viewData = activity.data as PageView
        return {
          title: 'Page Viewed',
          description: viewData.page_path || 'Vendor page',
          time: new Date(activity.timestamp).toLocaleString()
        }
      default:
        return {
          title: 'Unknown Activity',
          description: '',
          time: new Date(activity.timestamp).toLocaleString()
        }
    }
  }

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return Monitor
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
    return isMobile ? Smartphone : Monitor
  }

  return (
    <div className="space-y-6">
      {/* Recent Activity Feed */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Recent Activity</CardTitle>
              <p className="text-body-sm text-muted-foreground">Latest interactions with your catalog</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {allActivities.length > 0 ? (
            <div className="space-y-4">
              {allActivities.map((activity, index) => {
                const IconComponent = activity.icon
                const details = getActivityDescription(activity)
                const DeviceIcon = getDeviceIcon((activity.data as any).user_agent)
                
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className={`p-3 rounded-xl ${activity.bg}`}>
                      <IconComponent className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-body-sm font-semibold text-foreground">
                          {details.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-label-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-body-sm text-muted-foreground mb-2">
                        {details.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-label-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        
                        {activity.type === 'qr_scan' && (activity.data as QRScan).utm_campaign && (
                          <Badge variant="outline" className="text-xs">
                            {(activity.data as QRScan).utm_campaign}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-4/10 text-chart-4 mx-auto mb-4">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">No activity yet</h3>
              <p className="text-body-sm text-muted-foreground">
                Activity will appear here as visitors interact with your catalog
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📊</div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Activity Summary</CardTitle>
              <p className="text-body-sm text-muted-foreground">Recent engagement breakdown</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border border-chart-2/20 rounded-xl p-4 text-center">
              <QrCode className="h-8 w-8 text-chart-2 mx-auto mb-2" />
              <p className="text-heading-lg font-bold text-foreground">
                {recentScans?.length || 0}
              </p>
              <p className="text-label-sm text-chart-2 font-medium">QR Scans</p>
            </div>
            
            <div className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 border border-chart-1/20 rounded-xl p-4 text-center">
              <Phone className="h-8 w-8 text-chart-1 mx-auto mb-2" />
              <p className="text-heading-lg font-bold text-foreground">
                {recentContacts?.length || 0}
              </p>
              <p className="text-label-sm text-chart-1 font-medium">Contacts</p>
            </div>
            
            <div className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border border-chart-3/20 rounded-xl p-4 text-center">
              <Eye className="h-8 w-8 text-chart-3 mx-auto mb-2" />
              <p className="text-heading-lg font-bold text-foreground">
                {recentViews?.length || 0}
              </p>
              <p className="text-label-sm text-chart-3 font-medium">Page Views</p>
            </div>
          </div>
          
          <div className="mt-6 bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-label-sm text-muted-foreground">
              📅 Last 5 interactions shown • Activity updates in real-time
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="border-0 bg-gradient-to-br from-info/5 to-info/10">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Performance Tips</CardTitle>
              <p className="text-body-sm text-muted-foreground">
                {allActivities.length === 0 ? 'Get started with engagement' : 'Maximize your reach'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {allActivities.length === 0 ? (
              <>
                {[
                  { title: 'Share your QR code', desc: 'Print on business cards, flyers, or store displays' },
                  { title: 'Add more products', desc: 'A fuller catalog attracts more customer engagement' },
                  { title: 'Use social media', desc: 'Share your vendor page link on social platforms' },
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-body-sm font-medium text-foreground">
                        {tip.title}
                      </p>
                      <p className="text-label-sm text-muted-foreground">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { title: 'Great engagement!', desc: 'Keep adding products to maintain customer interest' },
                  { title: 'Track sources', desc: 'Use UTM parameters to see which marketing works best' },
                  { title: 'Update regularly', desc: 'Fresh content keeps customers coming back for more' },
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-body-sm font-medium text-foreground">
                        {tip.title}
                      </p>
                      <p className="text-label-sm text-muted-foreground">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}