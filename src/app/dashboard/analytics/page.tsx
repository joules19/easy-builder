import { getVendor } from '@/lib/auth/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsOverview } from '@/components/dashboard/analytics-overview'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ContactAnalytics } from '@/components/dashboard/contact-analytics'

export const metadata = {
  title: 'Analytics - Dashboard',
  description: 'View your vendor catalog analytics and insights',
}

export default async function AnalyticsPage() {
  const vendor = await getVendor()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-display-sm font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-body-lg text-muted-foreground">
          Track your catalog performance, customer engagement, and business insights
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview Stats */}
        <AnalyticsOverview vendorId={vendor.id} />

        {/* Contact Analytics */}
        <ContactAnalytics vendorId={vendor.id} />

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsCharts vendorId={vendor.id} />
          <RecentActivity vendorId={vendor.id} />
        </div>
      </div>
    </div>
  )
}