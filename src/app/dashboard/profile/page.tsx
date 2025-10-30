import { getVendor } from '@/lib/auth/server'
import { ProfileTabs } from '@/components/dashboard/profile-tabs'

export const metadata = {
  title: 'Profile - Dashboard',
  description: 'Manage your vendor profile and business information',
}

export default async function ProfilePage() {
  const vendor = await getVendor()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-display-sm font-bold text-foreground">Business Profile</h1>
        <p className="text-body-lg text-muted-foreground">
          Manage your business information, contact preferences, and public presence
        </p>
      </div>

      {/* Tabbed Profile Interface */}
      <ProfileTabs vendor={vendor} />
    </div>
  )
}