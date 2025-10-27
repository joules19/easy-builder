import Link from 'next/link'
import { Store } from 'lucide-react'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata = {
  title: 'Create Account',
  description: 'Create your EasyBuilder account and start showcasing your products',
}

export default function SignupPage() {
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
        <SignupForm />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Need help?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}