import { AnalyticsChartSkeleton, DashboardStatsSkeleton } from '@/components/ui/skeletons'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page header skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-8">
        {/* Stats cards skeleton */}
        <DashboardStatsSkeleton />

        {/* Charts grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsChartSkeleton />
          <AnalyticsChartSkeleton />
        </div>

        {/* Additional charts */}
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsChartSkeleton />
        </div>
      </div>
    </div>
  )
}