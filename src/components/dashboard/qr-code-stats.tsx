import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QRScan } from '@/types/database'
import { 
  TrendingUp, 
  Eye, 
  MapPin, 
  Clock,
  Smartphone,
  Monitor,
  Globe,
  Calendar
} from 'lucide-react'

interface QRCodeStatsProps {
  vendorId: string
}

export async function QRCodeStats({ vendorId }: QRCodeStatsProps) {
  const supabase = createServerSupabaseClient()

  // Get QR scan statistics
  const { data: totalScans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact' })
    .eq('vendor_id', vendorId)

  const { data: todayScans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact' })
    .eq('vendor_id', vendorId)
    .gte('scanned_at', new Date().toISOString().split('T')[0])

  const { data: thisWeekScans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact' })
    .eq('vendor_id', vendorId)
    .gte('scanned_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const { data: recentScans } = await supabase
    .from('qr_scans')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('scanned_at', { ascending: false })
    .limit(5) as { data: QRScan[] | null }

  // Get UTM source analytics
  const { data: utmSources } = await supabase
    .from('qr_scans')
    .select('utm_source')
    .eq('vendor_id', vendorId)
    .not('utm_source', 'is', null) as { data: Pick<QRScan, 'utm_source'>[] | null }

  const utmSourceCounts = utmSources?.reduce((acc: Record<string, number>, scan: Pick<QRScan, 'utm_source'>) => {
    const source = scan.utm_source || 'unknown'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {}) || {}

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Scan Analytics</CardTitle>
              <p className="text-body-sm text-muted-foreground">Track your QR code performance</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-xl p-6 border border-chart-2/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm text-muted-foreground mb-1">Total QR Code Scans</p>
                  <p className="text-display-xs font-bold text-foreground">
                    {totalScans?.length || 0}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-2/20 text-chart-2">
                  <Eye className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-heading-lg font-bold text-foreground">{todayScans?.length || 0}</p>
                <p className="text-label-sm text-muted-foreground font-medium">Today</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-heading-lg font-bold text-foreground">{thisWeekScans?.length || 0}</p>
                <p className="text-label-sm text-muted-foreground font-medium">This Week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UTM Sources */}
      {Object.keys(utmSourceCounts).length > 0 && (
        <Card className="border-0 bg-card/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-heading-md font-semibold text-foreground">Traffic Sources</CardTitle>
                <p className="text-body-sm text-muted-foreground">Where scans are coming from</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {Object.entries(utmSourceCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-body-sm text-foreground font-medium capitalize">
                    {source.replace('_', ' ')}
                  </span>
                  <Badge variant="outline" className="font-semibold">{count} scans</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Scans */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Recent Activity</CardTitle>
              <p className="text-body-sm text-muted-foreground">Latest QR code scans</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentScans && recentScans.length > 0 ? (
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <div>
                      <span className="text-body-sm font-medium text-foreground">
                        {new Date(scan.scanned_at).toLocaleDateString()}
                      </span>
                      {scan.utm_source && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {scan.utm_source}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-label-sm text-muted-foreground">
                    {new Date(scan.scanned_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">No scans yet</h3>
              <p className="text-body-sm text-muted-foreground">
                Share your QR code to start tracking customer engagement
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Tips */}
      <Card className="border-0 bg-gradient-to-br from-info/5 to-info/10">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">QR Code Best Practices</CardTitle>
              <p className="text-body-sm text-muted-foreground">Tips for maximum scan success</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {[
              { title: 'Size matters', desc: 'Minimum 2cm × 2cm for reliable scanning' },
              { title: 'High contrast', desc: 'Dark patterns on light backgrounds work best' },
              { title: 'Test thoroughly', desc: 'Always test before printing or sharing' },
              { title: 'Add context', desc: 'Include instructions like "Scan to view catalog"' },
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
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎯</div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Where to Use Your QR Code</CardTitle>
              <p className="text-body-sm text-muted-foreground">Great places to share your catalog</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "🏪", title: "Store Front", desc: "Window displays, door signs, counters" },
              { icon: "📋", title: "Business Cards", desc: "Quick access to your full catalog" },
              { icon: "📄", title: "Print Materials", desc: "Flyers, brochures, marketing materials" },
              { icon: "📱", title: "Social Media", desc: "Instagram stories, Facebook posts" },
              { icon: "🎪", title: "Events & Markets", desc: "Trade shows, farmers markets, pop-ups" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-background/50 rounded-xl hover:bg-background/80 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success text-2xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-label-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}