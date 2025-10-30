import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, ArrowLeft, Search } from 'lucide-react'

export default function VendorNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Store className="h-8 w-8 text-gray-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vendor Not Found
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            The vendor you're looking for doesn't exist or is no longer active.
            This could happen if the URL was mistyped or the vendor has been removed.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            {/* <Button asChild variant="outline" className="w-full">
              <Link href="/vendors">
                <Search className="h-4 w-4 mr-2" />
                Browse All Vendors
              </Link>
            </Button> */}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Looking for a specific vendor?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact support
              </Link>{' '}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}