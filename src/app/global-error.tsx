'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, Home, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex flex-col justify-center items-center px-4">
          <div className="text-center max-w-md mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                <Store className="h-12 w-12 text-red-600" />
                <span className="text-3xl font-bold text-gray-900">EasyBuilder</span>
              </div>
            </div>

            {/* Error Content */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Application Error
              </h2>
              <p className="text-gray-600 mb-8">
                A global error occurred. This has been logged and we'll look into it.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}