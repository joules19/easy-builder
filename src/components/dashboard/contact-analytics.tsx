import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Globe,
  TrendingUp,
  Users,
  Clock,
  BarChart3
} from 'lucide-react'

interface ContactAnalyticsProps {
  vendorId: string
}

interface ContactInteraction {
  id: string
  interaction_type: 'phone' | 'email' | 'location' | 'social' | 'whatsapp'
  interaction_value: string | null
  created_at: string
}

export async function ContactAnalytics({ vendorId }: ContactAnalyticsProps) {
  const supabase = createServerSupabaseClient()

  // Get date ranges
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Fetch contact interaction data
  const { data: interactions } = await supabase
    .from('contact_interactions')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  const { data: weekInteractions } = await supabase
    .from('contact_interactions')
    .select('*')
    .eq('vendor_id', vendorId)
    .gte('created_at', weekAgo.toISOString())

  const { data: monthInteractions } = await supabase
    .from('contact_interactions')
    .select('*')
    .eq('vendor_id', vendorId)
    .gte('created_at', monthAgo.toISOString())

  // Group by interaction type
  const groupByType = (data: ContactInteraction[]) => {
    const groups: Record<string, number> = {}
    data?.forEach(item => {
      groups[item.interaction_type] = (groups[item.interaction_type] || 0) + 1
    })
    return groups
  }

  const totalCounts = groupByType(interactions || [])
  const weekCounts = groupByType(weekInteractions || [])
  const monthCounts = groupByType(monthInteractions || [])

  // Group by day for the past week
  const getWeeklyTrend = () => {
    const weekDays: { date: string; label: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      weekDays.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: 0
      })
    }

    weekInteractions?.forEach((interaction: any) => {
      const interactionDate = new Date(interaction.created_at).toISOString().split('T')[0]
      const dayData = weekDays.find(day => day.date === interactionDate)
      if (dayData) {
        dayData.count++
      }
    })

    return weekDays
  }

  const weeklyTrend = getWeeklyTrend()
  const maxDayCount = Math.max(...weeklyTrend.map(day => day.count), 1)

  const contactTypes = [
    { 
      type: 'phone', 
      label: 'Phone Calls', 
      icon: Phone, 
      color: 'chart-1',
      total: totalCounts.phone || 0,
      week: weekCounts.phone || 0,
      month: monthCounts.phone || 0
    },
    { 
      type: 'whatsapp', 
      label: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'chart-2',
      total: totalCounts.whatsapp || 0,
      week: weekCounts.whatsapp || 0,
      month: monthCounts.whatsapp || 0
    },
    { 
      type: 'email', 
      label: 'Email', 
      icon: Mail, 
      color: 'chart-3',
      total: totalCounts.email || 0,
      week: weekCounts.email || 0,
      month: monthCounts.email || 0
    },
    { 
      type: 'location', 
      label: 'Location/Maps', 
      icon: MapPin, 
      color: 'chart-4',
      total: totalCounts.location || 0,
      week: weekCounts.location || 0,
      month: monthCounts.location || 0
    },
    { 
      type: 'social', 
      label: 'Social Media', 
      icon: Globe, 
      color: 'primary',
      total: totalCounts.social || 0,
      week: weekCounts.social || 0,
      month: monthCounts.social || 0
    }
  ]

  const totalContacts = interactions?.length || 0
  const weekContacts = weekInteractions?.length || 0
  const monthContacts = monthInteractions?.length || 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-chart-1/5 to-chart-1/10 hover:shadow-modern-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-label-lg text-muted-foreground">Total Contacts</p>
                <p className="text-display-xs font-bold text-foreground">{totalContacts}</p>
                <p className="text-body-sm text-muted-foreground">{monthContacts} this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-chart-2/5 to-chart-2/10 hover:shadow-modern-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-label-lg text-muted-foreground">This Week</p>
                <p className="text-display-xs font-bold text-foreground">{weekContacts}</p>
                <p className="text-body-sm text-muted-foreground">
                  {weekContacts > 0 ? '+' : ''}{weekContacts} interactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-chart-3/5 to-chart-3/10 hover:shadow-modern-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-label-lg text-muted-foreground">Daily Average</p>
                <p className="text-display-xs font-bold text-foreground">{Math.round(weekContacts / 7)}</p>
                <p className="text-body-sm text-muted-foreground">per day this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Methods Breakdown */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Contact Methods</CardTitle>
              <p className="text-body-sm text-muted-foreground">How customers are reaching out to you</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {contactTypes.map(contact => (
              <div key={contact.type} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${contact.color}/10 text-${contact.color}`}>
                    <contact.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-foreground">{contact.label}</p>
                    <p className="text-label-sm text-muted-foreground">
                      {contact.week} this week • {contact.month} this month
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-heading-lg font-bold text-foreground">{contact.total}</p>
                  <p className="text-label-sm text-muted-foreground">total</p>
                </div>
              </div>
            ))}
          </div>
          
          {contactTypes.every(c => c.total === 0) && (
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-4/10 text-chart-4 mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">No contact interactions yet</h3>
              <p className="text-body-sm text-muted-foreground">Encourage customers to reach out by sharing your catalog</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-heading-md font-semibold text-foreground">Weekly Contact Trend</CardTitle>
              <p className="text-body-sm text-muted-foreground">Daily contact interactions over the past week</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6">
            <div className="flex items-end justify-between h-40 px-4 bg-muted/30 rounded-xl">
              {weeklyTrend.map((day, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 flex-1">
                  <div className="relative w-8 bg-muted/50 rounded-t-lg overflow-hidden">
                    <div 
                      className="bg-gradient-to-t from-primary to-primary/80 rounded-t-lg transition-all duration-500 ease-out"
                      style={{ 
                        height: `${maxDayCount > 0 ? (day.count / maxDayCount) * 120 : 0}px`,
                        minHeight: day.count > 0 ? '8px' : '0px'
                      }}
                    />
                  </div>
                  <span className="text-label-sm text-muted-foreground font-medium">{day.label}</span>
                  <span className="text-body-sm font-bold text-foreground">{day.count}</span>
                </div>
              ))}
            </div>
            
            {weeklyTrend.every(d => d.count === 0) && (
              <div className="bg-muted/30 rounded-xl p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-heading-sm font-semibold text-foreground mb-2">No contacts this week</h3>
                <p className="text-body-sm text-muted-foreground">Share your QR code to start tracking customer contact attempts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}