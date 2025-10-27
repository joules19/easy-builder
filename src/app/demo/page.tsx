import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, ArrowRight, QrCode, Smartphone, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Demo - See EasyBuilder in Action',
  description: 'Explore how EasyBuilder helps vendors create beautiful product catalogs and share them via QR codes.',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EasyBuilder</span>
            </Link>
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

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            See EasyBuilder in Action
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Explore our demo vendor pages to see how easy it is to create and share your product catalog.
          </p>
        </div>
      </section>

      {/* Demo Vendors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try Our Demo Vendors
            </h2>
            <p className="text-lg text-gray-600">
              Click on any vendor below to see their complete catalog
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Tech Solutions Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Store className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Tech Solutions Inc</CardTitle>
                    <CardDescription>Electronics & Gadgets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  A technology store featuring laptops, smartphones, and accessories with detailed product information.
                </p>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/vendors/tech-solutions-inc">
                      View Catalog
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <Link href="/vendors/tech-solutions-inc?utm_source=qr&utm_medium=demo">
                      <QrCode className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Artisan Bakery Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Store className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Artisan Bakery</CardTitle>
                    <CardDescription>Fresh Baked Goods</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  A local bakery showcasing fresh breads, pastries, and custom cakes with beautiful food photography.
                </p>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/vendors/artisan-bakery">
                      View Catalog
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <Link href="/vendors/artisan-bakery?utm_source=qr&utm_medium=demo">
                      <QrCode className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fashion Boutique Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Store className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Fashion Boutique</CardTitle>
                    <CardDescription>Trendy Clothing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  A fashion store with curated clothing collections, organized by category with style inspiration.
                </p>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/vendors/fashion-boutique">
                      View Catalog
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <Link href="/vendors/fashion-boutique?utm_source=qr&utm_medium=demo">
                      <QrCode className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of vendors who use EasyBuilder to showcase their products
            </p>
            <Button asChild size="lg">
              <Link href="/auth/signup">
                Start Building Your Catalog
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes EasyBuilder Special
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">QR Code Sharing</h3>
              <p className="text-gray-600">
                Every vendor gets a unique QR code that customers can scan to instantly access their catalog. Perfect for business cards, flyers, and storefront displays.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mobile First</h3>
              <p className="text-gray-600">
                All catalogs are optimized for mobile devices. Your customers can easily browse products, search, and contact you from any smartphone or tablet.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Direct Contact</h3>
              <p className="text-gray-600">
                Customers can instantly call, email, or get directions to your business. No complicated checkout process - just direct communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Store className="h-6 w-6" />
            <span className="text-xl font-bold">EasyBuilder</span>
          </div>
          <p className="text-gray-400 mb-6">
            Simple vendor catalogs with QR code sharing for local businesses.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}