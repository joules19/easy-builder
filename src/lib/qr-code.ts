import QRCode from 'qrcode'

export interface QRCodeOptions {
  size?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  type?: 'image/png' | 'image/jpeg' | 'image/webp'
  quality?: number
}

export interface UTMParameters {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

/**
 * Generate a vendor page URL with optional UTM parameters
 */
export function generateVendorURL(
  vendorSlug: string, 
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  utm?: UTMParameters
): string {
  const url = new URL(`/vendors/${vendorSlug}`, baseUrl)
  
  if (utm) {
    if (utm.source) url.searchParams.set('utm_source', utm.source)
    if (utm.medium) url.searchParams.set('utm_medium', utm.medium)
    if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign)
    if (utm.content) url.searchParams.set('utm_content', utm.content)
    if (utm.term) url.searchParams.set('utm_term', utm.term)
  }

  return url.toString()
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCodeDataURL(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: options.size || 400,
    margin: options.margin || 2,
    color: {
      dark: options.color?.dark || '#000000',
      light: options.color?.light || '#FFFFFF',
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    type: options.type || 'image/png',
    quality: options.quality || 0.92,
  }

  try {
    return await QRCode.toDataURL(text, defaultOptions)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  text: string,
  options: Omit<QRCodeOptions, 'type' | 'quality'> = {}
): Promise<string> {
  const defaultOptions = {
    width: options.size || 400,
    margin: options.margin || 2,
    color: {
      dark: options.color?.dark || '#000000',
      light: options.color?.light || '#FFFFFF',
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
  }

  try {
    return await QRCode.toString(text, { type: 'svg', ...defaultOptions })
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

/**
 * Generate a complete QR code package for a vendor
 */
export async function generateVendorQRCode(
  vendorSlug: string,
  vendorName: string,
  options: QRCodeOptions & { 
    utm?: UTMParameters 
    includeMultipleSizes?: boolean
  } = {}
) {
  const url = generateVendorURL(vendorSlug, undefined, options.utm)
  
  const qrCodeData = {
    url,
    dataURL: await generateQRCodeDataURL(url, options),
    svg: await generateQRCodeSVG(url, options),
    vendorName,
    vendorSlug,
    generatedAt: new Date().toISOString(),
  }

  // Generate multiple sizes if requested
  if (options.includeMultipleSizes) {
    const sizes = [200, 400, 800, 1200]
    const multipleSizes = await Promise.all(
      sizes.map(async (size) => ({
        size,
        dataURL: await generateQRCodeDataURL(url, { ...options, size }),
      }))
    )
    
    return {
      ...qrCodeData,
      sizes: multipleSizes,
    }
  }

  return qrCodeData
}

/**
 * Download QR code as file
 */
export function downloadQRCode(
  dataURL: string,
  filename: string = 'qrcode.png'
) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate branded QR code with logo overlay (advanced feature)
 */
export async function generateBrandedQRCode(
  text: string,
  logoUrl?: string,
  options: QRCodeOptions = {}
): Promise<string> {
  // For now, return standard QR code
  // In a full implementation, this would overlay a logo in the center
  return generateQRCodeDataURL(text, options)
}

/**
 * Validate QR code content
 */
export function validateQRContent(content: string): boolean {
  try {
    // Check if it's a valid URL
    new URL(content)
    return true
  } catch {
    // If not a URL, check if it's reasonable text (not too long)
    return content.length > 0 && content.length <= 2000
  }
}