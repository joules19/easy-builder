import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Store, Smartphone, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EasyBuilder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Your Digital Catalog in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Perfect for local businesses, vendors, and entrepreneurs. Showcase your products 
            with a beautiful catalog and share it instantly with QR codes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href="/auth/signup">Start Free Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Showcase Your Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, powerful tools to create a professional online presence for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Easy Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create your vendor profile and start adding products in under 5 minutes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>QR Code Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Instantly share your catalog with customers using auto-generated QR codes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your catalog looks perfect on all devices - desktop, tablet, and mobile.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Contact Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Customers can contact you directly with click-to-call and email buttons.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your business online in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Create Profile</h3>
              <p className="text-gray-600">
                Register your business and add your basic information, logo, and contact details.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Products</h3>
              <p className="text-gray-600">
                Upload product photos, add descriptions, prices, and organize them into categories.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Catalog</h3>
              <p className="text-gray-600">
                Get your unique URL and QR code to share with customers anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of vendors who trust EasyBuilder for their online presence.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
            <Link href="/auth/signup">Create Your Catalog Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Store className="h-6 w-6" />
                <span className="text-xl font-bold">EasyBuilder</span>
              </div>
              <p className="text-gray-400">
                Simple vendor catalogs with QR code sharing for local businesses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EasyBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}