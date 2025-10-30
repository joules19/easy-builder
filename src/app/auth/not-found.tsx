import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, LogIn, UserPlus, ArrowLeft } from 'lucide-react'

export default function AuthNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EasyBuilder</span>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Content */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
              <p className="text-gray-600 text-sm">
                The authentication page you're looking for doesn't exist.
              </p>
            </div>

            {/* Available Auth Pages */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Available options:</p>
              
              <div className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="pt-4 border-t">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Homepage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Need help? Support coming soon
        </p>
      </div>
    </div>
  )
}