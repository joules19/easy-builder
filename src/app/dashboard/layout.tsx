import { DashboardNavigation } from '@/components/dashboard/navigation'
import { getVendor } from '@/lib/auth/server'
import { Button } from '@/components/ui/button'
import { Bell, Menu } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const vendor = await getVendor()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <DashboardNavigation vendor={vendor} />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Top Bar - Mobile Responsive */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                id="mobile-menu-button"
                aria-expanded="false"
                aria-controls="mobile-navigation"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </Button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-heading-sm lg:text-heading-lg font-semibold text-foreground truncate">
                  {vendor.name}
                </h1>
                <div className="hidden sm:flex items-center space-x-2 mt-1">
                  {vendor.status === 'pending' && (
                    <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-label-sm font-medium text-warning">
                      Pending Approval
                    </span>
                  )}
                  {vendor.status === 'active' && (
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-label-sm font-medium text-success">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Mobile Status Badge */}
              <div className="sm:hidden">
                {vendor.status === 'pending' && (
                  <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-1 text-label-sm font-medium text-warning">
                    Pending
                  </span>
                )}
                {vendor.status === 'active' && (
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-label-sm font-medium text-success">
                    Active
                  </span>
                )}
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  0
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]" role="main" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}