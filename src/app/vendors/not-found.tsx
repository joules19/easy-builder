import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Store, Home, Search } from 'lucide-react'

export default function VendorNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Store className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EasyBuilder</span>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-yellow-600" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900">Vendor Not Found</h1>
                <p className="text-gray-600">
                  The vendor page you're looking for doesn't exist or may have been removed.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="text-blue-800">
                    <strong>Possible reasons:</strong>
                  </p>
                  <ul className="text-blue-700 mt-2 space-y-1">
                    <li>• The vendor URL was typed incorrectly</li>
                    <li>• The vendor account has been deactivated</li>
                    <li>• The vendor page has been moved or deleted</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/signup">
                    <Store className="h-4 w-4 mr-2" />
                    Create Your Own Store
                  </Link>
                </Button>
              </div>

              {/* Additional Help */}
              <div className="text-xs text-gray-500 pt-4 border-t">
                <p>
                  Looking for a specific vendor?{' '}
                  <Link href="/" className="text-blue-600 hover:underline">
                    Browse our directory
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}