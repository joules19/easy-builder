import { getVendor } from '@/lib/auth/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Package, QrCode, Users, BarChart3, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your vendor catalog and analytics',
}

export default async function DashboardPage() {
  const vendor = await getVendor()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">{vendor.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href={`/vendors/${vendor.slug}`} target="_blank">
                  View Your Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {vendor.name}!
          </h2>
          <p className="text-gray-600">
            Manage your product catalog and track your performance from here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendor.qr_scan_count}</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Products</span>
              </CardTitle>
              <CardDescription>
                Manage your product catalog and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add products, organize categories, and manage your inventory.
                </p>
                <div className="flex space-x-2">
                  <Button asChild>
                    <Link href="/dashboard/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/products">View All</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>QR Code</span>
              </CardTitle>
              <CardDescription>
                Share your catalog with QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Download your QR code and track scan analytics.
                </p>
                <div className="flex space-x-2">
                  <Button asChild>
                    <Link href="/dashboard/qr-code">View QR Code</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/analytics">Analytics</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>
                Update your business information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Edit your business details, contact info, and settings.
                </p>
                <div className="flex space-x-2">
                  <Button asChild>
                    <Link href="/dashboard/profile">Edit Profile</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        {vendor.status === 'pending' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Complete Your Setup</CardTitle>
              <CardDescription className="text-blue-700">
                Your account is pending approval. Complete these steps to activate your catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Business profile created</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Add your first product</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Upload business logo</span>
                </div>
              </div>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/dashboard/products/new">Add Your First Product</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}