import { getVendor } from '@/lib/auth/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeGenerator } from '@/components/dashboard/qr-code-generator'
import { QRCodeStats } from '@/components/dashboard/qr-code-stats'

export const metadata = {
  title: 'QR Code - Dashboard',
  description: 'Generate and manage your vendor QR code',
}

export default async function QRCodePage() {
  const vendor = await getVendor()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-display-sm font-bold text-foreground">QR Code Generator</h1>
        <p className="text-body-lg text-muted-foreground">
          Create and customize your QR code with advanced tracking and styling options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Code Generator */}
        <div className="lg:col-span-2">
          <QRCodeGenerator vendor={vendor} />
        </div>

        {/* QR Code Stats */}
        <div className="lg:col-span-1">
          <QRCodeStats vendorId={vendor.id} />
        </div>
      </div>
    </div>
  )
}