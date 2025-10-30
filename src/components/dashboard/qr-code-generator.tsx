'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  RefreshCw, 
  Share2, 
  Copy,
  Palette,
  Settings,
  ExternalLink,
  QrCode,
  TrendingUp
} from 'lucide-react'
import { generateVendorQRCode, downloadQRCode, UTMParameters } from '@/lib/qr-code'
import { Vendor } from '@/types/database'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface QRCodeGeneratorProps {
  vendor: Vendor
}

const QR_SIZES = [
  { label: 'Small (200x200)', value: 200 },
  { label: 'Medium (400x400)', value: 400 },
  { label: 'Large (800x800)', value: 800 },
  { label: 'Extra Large (1200x1200)', value: 1200 },
]

const COLOR_PRESETS = [
  { name: 'Classic', dark: '#000000', light: '#FFFFFF' },
  { name: 'Ocean', dark: '#0F172A', light: '#F1F5F9' },
  { name: 'Forest', dark: '#14532D', light: '#FFFFFF' },
  { name: 'Royal', dark: '#581C87', light: '#FFFFFF' },
  { name: 'Sunset', dark: '#B91C1C', light: '#FFFFFF' },
]

export function QRCodeGenerator({ vendor }: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState({
    size: 400,
    colorDark: '#000000',
    colorLight: '#FFFFFF',
    errorCorrection: 'M' as const,
  })
  const [utmParams, setUtmParams] = useState<UTMParameters>({
    source: 'qr_code',
    medium: 'print',
    campaign: 'vendor_catalog',
  })
  const [activeTab, setActiveTab] = useState<'basic' | 'utm' | 'style'>('basic')

  useEffect(() => {
    generateQR()
  }, [vendor.slug])

  const generateQR = async () => {
    setIsLoading(true)
    try {
      const qrCode = await generateVendorQRCode(vendor.slug, vendor.name, {
        size: options.size,
        color: {
          dark: options.colorDark,
          light: options.colorLight,
        },
        errorCorrectionLevel: options.errorCorrection,
        utm: utmParams,
        includeMultipleSizes: true,
      })
      setQrData(qrCode)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Error generating QR code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (size?: number) => {
    if (!qrData) return
    
    if (size && qrData.sizes) {
      const sizeData = qrData.sizes.find((s: any) => s.size === size)
      if (sizeData) {
        downloadQRCode(sizeData.dataURL, `${vendor.slug}-qr-${size}x${size}.png`)
      }
    } else {
      downloadQRCode(qrData.dataURL, `${vendor.slug}-qr-code.png`)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* QR Code Preview */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-heading-lg font-semibold text-foreground">QR Code Preview</CardTitle>
                <p className="text-body-sm text-muted-foreground">Live preview of your customized QR code</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateQR}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <div className="flex flex-col items-center space-y-6">
              <div className="w-80 h-80 bg-gradient-to-br from-muted/30 to-muted/20 rounded-2xl flex items-center justify-center border border-border relative overflow-hidden">
                {qrData ? (
                  <div className="relative">
                    <Image
                      src={qrData.dataURL}
                      alt={`QR Code for ${vendor.name}`}
                      width={300}
                      height={300}
                      className="rounded-xl shadow-lg"
                    />
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-chart-1/20 rounded-2xl blur-xl -z-10"></div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-1/10 text-chart-1 mx-auto">
                      <QrCode className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-body-sm font-medium text-foreground">
                        {isLoading ? 'Generating QR Code...' : 'QR Code Preview'}
                      </p>
                      <p className="text-label-sm text-muted-foreground">
                        {isLoading ? 'Please wait' : 'Customize options below to generate'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {qrData && (
                <div className="bg-muted/30 rounded-xl p-4 w-full text-center">
                  <p className="text-label-lg font-medium text-foreground mb-2">Scan to visit your catalog:</p>
                  <p className="text-label-sm font-mono bg-background border rounded-lg px-3 py-2 break-all text-muted-foreground">
                    {qrData.url}
                  </p>
                </div>
              )}
            </div>

            {/* QR Code Info */}
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-heading-md font-semibold text-foreground mb-4">QR Code Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-muted-foreground">Vendor Name:</span>
                    <Badge variant="outline" className="font-medium">{vendor.name}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-muted-foreground">Image Size:</span>
                    <Badge variant="outline" className="font-medium">{options.size}×{options.size}px</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-muted-foreground">File Format:</span>
                    <Badge variant="outline" className="font-medium">PNG</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-muted-foreground">Error Correction:</span>
                    <Badge variant="outline" className="font-medium">Level {options.errorCorrection}</Badge>
                  </div>
                  {qrData && (
                    <div className="flex justify-between items-center">
                      <span className="text-body-sm text-muted-foreground">Generated:</span>
                      <Badge variant="success" className="font-medium">
                        {new Date(qrData.generatedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={() => handleDownload()} 
                  disabled={!qrData}
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => qrData && copyToClipboard(qrData.url)}
                    disabled={!qrData}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open(qrData?.url, '_blank')}
                    disabled={!qrData}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Options */}
      <Card className="border-0 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-heading-lg font-semibold text-foreground">Customization Options</CardTitle>
              <p className="text-body-sm text-muted-foreground">Configure size, colors, and tracking parameters</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted/50 p-1 rounded-xl">
            {[
              { id: 'basic', label: 'Basic Settings', icon: Settings },
              { id: 'utm', label: 'Analytics Tracking', icon: TrendingUp },
              { id: 'style', label: 'Visual Style', icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-body-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Basic Options */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="size" className="text-label-lg font-medium text-foreground">QR Code Size</Label>
                <Select
                  value={options.size.toString()}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, size: parseInt(value) }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {QR_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-label-sm text-muted-foreground">Higher resolution for better print quality</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="errorCorrection" className="text-label-lg font-medium text-foreground">Error Correction Level</Label>
                <Select
                  value={options.errorCorrection}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, errorCorrection: value as any }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select error correction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%) - Smallest QR code</SelectItem>
                    <SelectItem value="M">Medium (15%) - Recommended</SelectItem>
                    <SelectItem value="Q">Quartile (25%) - Good for damage resistance</SelectItem>
                    <SelectItem value="H">High (30%) - Maximum damage resistance</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-label-sm text-muted-foreground">Higher levels resist damage but create larger codes</p>
              </div>
            </div>
          )}

          {/* UTM Parameters */}
          {activeTab === 'utm' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="utm-source" className="text-label-lg font-medium text-foreground">UTM Source</Label>
                <Input
                  id="utm-source"
                  value={utmParams.source || ''}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., qr_code, business_card, flyer"
                  className="h-11"
                />
                <p className="text-label-sm text-muted-foreground">Where the traffic comes from (referrer)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-medium" className="text-label-lg font-medium text-foreground">UTM Medium</Label>
                <Input
                  id="utm-medium"
                  value={utmParams.medium || ''}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, medium: e.target.value }))}
                  placeholder="e.g., print, digital, social, email"
                  className="h-11"
                />
                <p className="text-label-sm text-muted-foreground">Marketing medium or channel type</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-campaign" className="text-label-lg font-medium text-foreground">UTM Campaign</Label>
                <Input
                  id="utm-campaign"
                  value={utmParams.campaign || ''}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, campaign: e.target.value }))}
                  placeholder="e.g., spring_2024, grand_opening, holiday_sale"
                  className="h-11"
                />
                <p className="text-label-sm text-muted-foreground">Specific campaign or promotion name</p>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/20 text-info mt-0.5">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-foreground mb-2">Analytics Tracking Benefits</p>
                    <ul className="text-label-sm text-muted-foreground space-y-1">
                      <li>• Track where your QR code scans originate from</li>
                      <li>• Measure marketing campaign performance and ROI</li>
                      <li>• Understand customer behavior and preferences</li>
                      <li>• Optimize your marketing strategy with data insights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Style Options */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-label-lg font-medium text-foreground">Color Presets</Label>
                <div className="grid grid-cols-5 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setOptions(prev => ({ 
                        ...prev, 
                        colorDark: preset.dark, 
                        colorLight: preset.light 
                      }))}
                      className={`flex flex-col items-center p-3 border-2 rounded-xl hover:border-primary/50 transition-all duration-200 group ${
                        options.colorDark === preset.dark && options.colorLight === preset.light
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg border border-border mb-2 shadow-sm group-hover:shadow-md transition-shadow"
                        style={{ backgroundColor: preset.dark }}
                      />
                      <span className="text-label-sm font-medium text-foreground">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="color-dark" className="text-label-lg font-medium text-foreground">Foreground Color</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="color-dark"
                      type="color"
                      value={options.colorDark}
                      onChange={(e) => setOptions(prev => ({ ...prev, colorDark: e.target.value }))}
                      className="w-16 h-11 p-1 rounded-lg"
                    />
                    <Input
                      value={options.colorDark}
                      onChange={(e) => setOptions(prev => ({ ...prev, colorDark: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1 h-11"
                    />
                  </div>
                  <p className="text-label-sm text-muted-foreground">The QR code pattern color</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-light" className="text-label-lg font-medium text-foreground">Background Color</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="color-light"
                      type="color"
                      value={options.colorLight}
                      onChange={(e) => setOptions(prev => ({ ...prev, colorLight: e.target.value }))}
                      className="w-16 h-11 p-1 rounded-lg"
                    />
                    <Input
                      value={options.colorLight}
                      onChange={(e) => setOptions(prev => ({ ...prev, colorLight: e.target.value }))}
                      placeholder="#FFFFFF"
                      className="flex-1 h-11"
                    />
                  </div>
                  <p className="text-label-sm text-muted-foreground">The background color</p>
                </div>
              </div>
              
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/20 text-warning mt-0.5">
                    <Palette className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-foreground mb-2">Color Guidelines for Best Results</p>
                    <ul className="text-label-sm text-muted-foreground space-y-1">
                      <li>• Use high contrast between foreground and background</li>
                      <li>• Dark patterns on light backgrounds work best</li>
                      <li>• Avoid very bright or neon colors for better scanning</li>
                      <li>• Test your QR code after changing colors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apply Changes Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button 
              onClick={generateQR} 
              disabled={isLoading} 
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating QR Code...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Apply Changes & Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Download Multiple Sizes */}
      {qrData?.sizes && (
        <Card className="border-0 bg-card/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-heading-lg font-semibold text-foreground">Download Multiple Sizes</CardTitle>
                <p className="text-body-sm text-muted-foreground">Choose the perfect size for your use case</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {qrData.sizes.map((sizeData: any) => (
                <Button
                  key={sizeData.size}
                  variant="outline"
                  onClick={() => handleDownload(sizeData.size)}
                  className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-muted/30 to-muted/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <QrCode className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <div className="text-body-sm font-semibold text-foreground">{sizeData.size}×{sizeData.size}</div>
                    <div className="text-label-sm text-muted-foreground">PNG Format</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-6 bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-label-sm text-muted-foreground">
                💡 <strong>Size recommendations:</strong> 200px for web, 400px for social media, 800px+ for print materials
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}