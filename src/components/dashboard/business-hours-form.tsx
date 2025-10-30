'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, Clock, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface BusinessHoursFormProps {
  vendorId: string
  currentHours?: any
}

const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

export function BusinessHoursForm({ vendorId, currentHours }: BusinessHoursFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [hours, setHours] = useState(() => {
    const defaultHours = DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { open: '09:00', close: '17:00', closed: false }
    }), {})
    
    return currentHours || defaultHours
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('vendors')
        // @ts-ignore - Supabase types are conflicting here
        .update({
          operating_hours: hours
        })
        .eq('id', vendorId)

      if (error) throw error

      toast.success('Business hours updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error updating business hours:', error)
      toast.error('Error updating business hours. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDay = (day: string, field: string, value: any) => {
    setHours((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const copyToAllDays = (sourceDay: string) => {
    const sourceHours = hours[sourceDay]
    const newHours = { ...hours }
    
    DAYS_OF_WEEK.forEach(day => {
      if (day !== sourceDay) {
        newHours[day] = { ...sourceHours }
      }
    })
    
    setHours(newHours)
  }

  const setCommonHours = (type: 'business' | 'retail' | 'restaurant') => {
    const templates = {
      business: { open: '09:00', close: '17:00', closed: false },
      retail: { open: '10:00', close: '20:00', closed: false },
      restaurant: { open: '11:00', close: '22:00', closed: false }
    }
    
    const template = templates[type]
    const newHours = { ...hours }
    
    DAYS_OF_WEEK.forEach(day => {
      if (day === 'sunday' && type === 'business') {
        newHours[day] = { ...template, closed: true }
      } else {
        newHours[day] = { ...template }
      }
    })
    
    setHours(newHours)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Templates */}
      <div className="space-y-2">
        <Label>Quick Templates</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCommonHours('business')}
          >
            Business Hours (9-5)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCommonHours('retail')}
          >
            Retail Hours (10-8)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCommonHours('restaurant')}
          >
            Restaurant Hours (11-10)
          </Button>
        </div>
      </div>

      {/* Individual Day Settings */}
      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="w-20">
              <Label className="text-sm font-medium">
                {DAY_LABELS[day as keyof typeof DAY_LABELS]}
              </Label>
            </div>

            <div className="flex items-center space-x-2 flex-1">
              <input
                type="checkbox"
                checked={!hours[day]?.closed}
                onChange={(e) => updateDay(day, 'closed', !e.target.checked)}
                className="rounded"
              />
              
              {!hours[day]?.closed ? (
                <>
                  <Input
                    type="time"
                    value={hours[day]?.open || '09:00'}
                    onChange={(e) => updateDay(day, 'open', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <Input
                    type="time"
                    value={hours[day]?.close || '17:00'}
                    onChange={(e) => updateDay(day, 'close', e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToAllDays(day)}
                    title="Copy to all days"
                  >
                    Copy
                  </Button>
                </>
              ) : (
                <Badge variant="secondary">Closed</Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Special Notes */}
      <div className="space-y-2">
        <Label>Special Instructions</Label>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Hours will be displayed on your public vendor page</p>
          <p>• Use 24-hour format for consistency</p>
          <p>• Consider adding holiday hours or seasonal changes</p>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Business Hours</h4>
          <div className="space-y-1 text-sm">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex justify-between">
                <span className="capitalize">{day}:</span>
                <span>
                  {hours[day]?.closed ? (
                    <span className="text-gray-500">Closed</span>
                  ) : (
                    `${hours[day]?.open || '09:00'} - ${hours[day]?.close || '17:00'}`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating Hours...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Business Hours
            </>
          )}
        </Button>
      </div>
    </form>
  )
}