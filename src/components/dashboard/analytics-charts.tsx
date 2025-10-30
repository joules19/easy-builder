import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Eye,
  QrCode,
  Calendar
} from 'lucide-react'
import type { QRScan, Product } from '@/types/database'

interface AnalyticsChartsProps {
  vendorId: string
}

export async function AnalyticsCharts({ vendorId }: AnalyticsChartsProps) {
  const supabase = createServerSupabaseClient()

  // Get QR scan data for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const { data: recentScans } = await supabase
    .from('qr_scans')
    .select('scanned_at, utm_source')
    .eq('vendor_id', vendorId)
    .gte('scanned_at', sevenDaysAgo.toISOString())
    .order('scanned_at', { ascending: true })

  // Get product view data
  const { data: productViews } = await supabase
    .from('products')
    .select('name, view_count')
    .eq('vendor_id', vendorId)
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .limit(5)

  // Process data for charts
  const dailyScans = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
    const dayScans = recentScans?.filter((scan: any) => 
      new Date(scan.scanned_at).toDateString() === date.toDateString()
    ).length || 0
    
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short' }),
      scans: dayScans
    }
  })

  // UTM source breakdown
  const utmSources = recentScans?.reduce((acc: Record<string, number>, scan: any) => {
    const source = scan.utm_source || 'Direct'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {}) || {}

  const maxScans = Math.max(...dailyScans.map(d => d.scans), 1)

  return (
    <div className="space-y-6">
      {/* QR Scans Chart */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">QR Code Scans</CardTitle>
              <p className="text-body-sm text-muted-foreground">Daily scan activity over the last week</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {dailyScans.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-body-sm font-medium text-foreground">{day.date}</div>
                <div className="flex-1 bg-muted/30 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-chart-1 to-chart-1/80 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${maxScans > 0 ? (day.scans / maxScans) * 100 : 0}%` }}
                  />
                </div>
                <div className="w-8 text-body-sm font-semibold text-foreground text-right">{day.scans}</div>
              </div>
            ))}
          </div>
          
          {dailyScans.every(d => d.scans === 0) && (
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-1/10 text-chart-1 mx-auto mb-4">
                <QrCode className="h-8 w-8" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">No QR scans yet</h3>
              <p className="text-body-sm text-muted-foreground">Share your QR code to start tracking customer engagement</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      {Object.keys(utmSources).length > 0 && (
        <Card className="border-0 bg-card/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-heading-md font-semibold text-foreground">Traffic Sources</CardTitle>
                <p className="text-body-sm text-muted-foreground">Where your visitors are coming from</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {Object.entries(utmSources)
                .sort(([,a], [,b]) => b - a)
                .map(([source, count], index) => {
                  const percentage = Math.round((count / Object.values(utmSources).reduce((a, b) => a + b, 0)) * 100)
                  const chartColors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-primary']
                  
                  return (
                    <div key={source} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${chartColors[index % chartColors.length]}`} />
                        <span className="text-body-sm font-semibold text-foreground capitalize">
                          {source.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-body-sm text-muted-foreground font-medium">{percentage}%</span>
                        <Badge variant="outline" className="font-semibold">{count} visits</Badge>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Products */}
      {productViews && productViews.length > 0 && (
        <Card className="border-0 bg-card/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-heading-md font-semibold text-foreground">Top Products</CardTitle>
                <p className="text-body-sm text-muted-foreground">Most viewed products in your catalog</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {productViews.map((product: any, index) => {
                const maxViews = Math.max(...productViews.map((p: any) => p.view_count), 1)
                const percentage = (product.view_count / maxViews) * 100
                
                return (
                  <div key={index} className="space-y-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-semibold text-foreground truncate flex-1 mr-2">
                        #{index + 1} {product.name}
                      </span>
                      <Badge variant="outline" className="font-semibold">
                        {product.view_count} views
                      </Badge>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-chart-3 to-chart-3/80 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {(!productViews || productViews.length === 0) && (
        <Card className="border-0 bg-card/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-heading-md font-semibold text-foreground">Top Products</CardTitle>
                <p className="text-body-sm text-muted-foreground">Most viewed products in your catalog</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-3/10 text-chart-3 mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">No product views yet</h3>
              <p className="text-body-sm text-muted-foreground">Share your catalog to start tracking product popularity</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}