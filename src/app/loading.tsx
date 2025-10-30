import { Store } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center">
      <div className="text-center">
        {/* Logo with Animation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Store className="h-12 w-12 text-blue-600 animate-pulse" />
            <span className="text-3xl font-bold text-gray-900">EasyBuilder</span>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  )
}