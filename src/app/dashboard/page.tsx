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
    <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-heading-xl lg:text-display-sm font-bold text-foreground">
          Welcome back!
        </h2>
        <p className="text-body-md lg:text-body-lg text-muted-foreground">
          Manage your product catalog and track your performance from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-0 bg-gradient-to-br from-chart-1/5 to-chart-1/10 hover:from-chart-1/10 hover:to-chart-1/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-label-md lg:text-label-lg font-medium text-foreground">Total Products</CardTitle>
            <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1">
              <Package className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-heading-lg lg:text-display-sm font-bold text-foreground">0</div>
            <p className="text-label-sm text-muted-foreground mt-1">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-chart-2/5 to-chart-2/10 hover:from-chart-2/10 hover:to-chart-2/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-label-md lg:text-label-lg font-medium text-foreground">QR Scans</CardTitle>
            <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
              <QrCode className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-heading-lg lg:text-display-sm font-bold text-foreground">{vendor.qr_scan_count}</div>
            <p className="text-label-sm text-muted-foreground mt-1">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-chart-4/5 to-chart-4/10 hover:from-chart-4/10 hover:to-chart-4/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-label-md lg:text-label-lg font-medium text-foreground">Page Views</CardTitle>
            <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-chart-4/10 text-chart-4">
              <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-heading-lg lg:text-display-sm font-bold text-foreground">0</div>
            <p className="text-label-sm text-muted-foreground mt-1">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-chart-3/5 to-chart-3/10 hover:from-chart-3/10 hover:to-chart-3/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-label-md lg:text-label-lg font-medium text-foreground">Contacts</CardTitle>
            <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-heading-lg lg:text-display-sm font-bold text-foreground">0</div>
            <p className="text-label-sm text-muted-foreground mt-1">
              +0 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-md lg:text-heading-lg font-semibold text-foreground">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="group hover:shadow-modern-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1 group-hover:bg-chart-1/20 transition-colors">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-heading-md">Products</CardTitle>
                  <CardDescription className="text-body-sm">
                    Manage your catalog
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Add products, organize categories, and manage your inventory with ease.
              </p>
              <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                <Button asChild variant="gradient" size="sm" className="touch-manipulation">
                  <Link href="/dashboard/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="touch-manipulation">
                  <Link href="/dashboard/products">View All Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-modern-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2 group-hover:bg-chart-2/20 transition-colors">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-heading-md">QR Code</CardTitle>
                  <CardDescription className="text-body-sm">
                    Share your catalog
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Download your QR code and track scan analytics to grow your reach.
              </p>
              <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                <Button asChild variant="gradient" size="sm" className="touch-manipulation">
                  <Link href="/dashboard/qr-code">View QR Code</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="touch-manipulation">
                  <Link href="/dashboard/analytics">View Analytics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-modern-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10 text-chart-4 group-hover:bg-chart-4/20 transition-colors">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-heading-md">Profile</CardTitle>
                  <CardDescription className="text-body-sm">
                    Update your info
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Edit your business details, contact info, and store settings.
              </p>
              <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                <Button asChild variant="gradient" size="sm" className="touch-manipulation">
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
                {/* <Button variant="outline" size="sm" asChild className="touch-manipulation">
                  <Link href="/dashboard/settings">Settings</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started */}
      {vendor.status === 'pending' && (
        <Card className="border-info/20 bg-gradient-to-br from-info/5 to-info/10">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 text-info">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-heading-md text-foreground">Complete Your Setup</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Complete these steps to activate your catalog and start selling.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground">
                  <div className="h-2 w-2 rounded-full bg-success-foreground"></div>
                </div>
                <span className="text-body-sm font-medium text-foreground">Business profile created</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 w-6 rounded-full border-2 border-border bg-muted"></div>
                <span className="text-body-sm text-muted-foreground">Add your first product</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 w-6 rounded-full border-2 border-border bg-muted"></div>
                <span className="text-body-sm text-muted-foreground">Upload business logo</span>
              </div>
            </div>
            <Button asChild variant="gradient" className="touch-manipulation">
              <Link href="/dashboard/products/new">Add Your First Product</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}