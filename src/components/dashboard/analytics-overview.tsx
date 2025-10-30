import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown,
  Eye, 
  QrCode, 
  Phone,
  Package,
  Users,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react'

interface AnalyticsOverviewProps {
  vendorId: string
}

export async function AnalyticsOverview({ vendorId }: AnalyticsOverviewProps) {
  const supabase = createServerSupabaseClient()

  // Get date ranges
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Fetch analytics data
  const [
    { data: totalProducts },
    { data: activeProducts },
    { data: totalScans },
    { data: weekScans },
    { data: totalViews },
    { data: weekViews },
    { data: totalContacts },
    { data: weekContacts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact' }).eq('vendor_id', vendorId),
    supabase.from('products').select('*', { count: 'exact' }).eq('vendor_id', vendorId).eq('status', 'active'),
    supabase.from('qr_scans').select('*', { count: 'exact' }).eq('vendor_id', vendorId),
    supabase.from('qr_scans').select('*', { count: 'exact' }).eq('vendor_id', vendorId).gte('scanned_at', weekAgo.toISOString()),
    supabase.from('page_views').select('*', { count: 'exact' }).eq('vendor_id', vendorId),
    supabase.from('page_views').select('*', { count: 'exact' }).eq('vendor_id', vendorId).gte('viewed_at', weekAgo.toISOString()),
    supabase.from('contact_interactions').select('*', { count: 'exact' }).eq('vendor_id', vendorId),
    supabase.from('contact_interactions').select('*', { count: 'exact' }).eq('vendor_id', vendorId).gte('created_at', weekAgo.toISOString()),
  ])

  // Calculate trends (mock for now - would need historical data)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts?.length || 0,
      subtitle: `${activeProducts?.length || 0} active`,
      icon: Package,
      color: 'blue',
      trend: null,
    },
    {
      title: 'QR Code Scans',
      value: totalScans?.length || 0,
      subtitle: `${weekScans?.length || 0} this week`,
      icon: QrCode,
      color: 'green',
      trend: weekScans?.length || 0,
    },
    {
      title: 'Page Views',
      value: totalViews?.length || 0,
      subtitle: `${weekViews?.length || 0} this week`,
      icon: Eye,
      color: 'purple',
      trend: weekViews?.length || 0,
    },
    {
      title: 'Contact Attempts',
      value: totalContacts?.length || 0,
      subtitle: `${weekContacts?.length || 0} this week`,
      icon: Phone,
      color: 'orange',
      trend: weekContacts?.length || 0,
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-chart-1/10 text-chart-1',
      green: 'bg-chart-2/10 text-chart-2', 
      purple: 'bg-chart-3/10 text-chart-3',
      orange: 'bg-chart-4/10 text-chart-4'
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-muted/10 text-muted-foreground'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        const hasPositiveTrend = stat.trend !== null && stat.trend > 0
        const colorClasses = getColorClasses(stat.color)
        
        return (
          <Card key={index} className={`border-0 bg-gradient-to-br from-${stat.color === 'blue' ? 'chart-1' : stat.color === 'green' ? 'chart-2' : stat.color === 'purple' ? 'chart-3' : 'chart-4'}/5 to-${stat.color === 'blue' ? 'chart-1' : stat.color === 'green' ? 'chart-2' : stat.color === 'purple' ? 'chart-3' : 'chart-4'}/10 hover:shadow-modern-lg transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
              <CardTitle className="text-label-md lg:text-label-lg font-medium text-foreground">{stat.title}</CardTitle>
              <div className={`flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl ${colorClasses}`}>
                <IconComponent className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 lg:space-y-3">
              <div className="text-heading-lg lg:text-display-xs font-bold text-foreground">{stat.value.toLocaleString()}</div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-label-sm lg:text-body-sm text-muted-foreground">{stat.subtitle}</p>
                {stat.trend !== null && (
                  <div className="flex items-center space-x-1">
                    {hasPositiveTrend ? (
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-destructive" />
                    )}
                    <span className={`text-label-sm font-medium ${
                      hasPositiveTrend ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.trend > 0 ? '+' : ''}{stat.trend}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}