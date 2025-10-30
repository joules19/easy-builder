import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function QRCodeLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Code Generator */}
        <div className="lg:col-span-2 space-y-8">
          {/* QR Code Preview Card */}
          <Card className="border-0 bg-card/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* QR Code Display */}
                <div className="flex flex-col items-center space-y-6">
                  <Skeleton className="w-80 h-80 rounded-2xl" />
                  <div className="w-full">
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Skeleton className="h-11 w-full" />
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-11 w-full" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Options Card */}
          <Card className="border-0 bg-card/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-8 bg-muted/50 p-1 rounded-xl">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-11 rounded-lg" />
                ))}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ))}
              </div>

              {/* Apply Button */}
              <div className="mt-8 pt-6 border-t border-border">
                <Skeleton className="h-11 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Stats */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-card/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}