import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, Home, ArrowLeft } from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Store className="h-12 w-12 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">EasyBuilder</span>
          </div>
        </div>

        {/* 404 Error */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <BackButton />
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, you can{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}