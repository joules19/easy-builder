import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { ProductImageInsert } from '@/types/database'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `easybuilder/products/${productId}`,
          transformation: [
            { width: 800, height: 800, crop: 'limit', quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          allowed_formats: ['jpg', 'png', 'webp', 'avif'],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const result = uploadResult as any

    // Save image record to database
    const imageData: ProductImageInsert = {
      product_id: productId,
      url: result.secure_url,
      alt_text: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      display_order: displayOrder,
      file_size: file.size,
      mime_type: file.type,
      cloudinary_public_id: result.public_id,
    }

    const { data: imageRecord, error: dbError } = await supabase
      .from('product_images')
      .insert(imageData as any)
      .select()
      .single()

    if (dbError) {
      // If database save fails, delete the uploaded image from Cloudinary
      await cloudinary.uploader.destroy(result.public_id)
      throw dbError
    }

    return NextResponse.json({
      success: true,
      image: imageRecord,
      cloudinary: {
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      }
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}