import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LayoutDashboard, ArrowLeft, Search } from 'lucide-react'

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-red-600" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">404</h1>
              <h2 className="text-xl font-semibold text-gray-800">
                Dashboard Page Not Found
              </h2>
              <p className="text-gray-600 text-sm">
                The dashboard page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/products">
                  Products
                </Link>
              </Button>
            </div>

            {/* Help */}
            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>Common dashboard pages:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Link href="/dashboard/categories" className="text-blue-600 hover:underline">
                  Categories
                </Link>
                <Link href="/dashboard/analytics" className="text-blue-600 hover:underline">
                  Analytics
                </Link>
                <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
                  Profile
                </Link>
                <Link href="/dashboard/qr-code" className="text-blue-600 hover:underline">
                  QR Code
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}