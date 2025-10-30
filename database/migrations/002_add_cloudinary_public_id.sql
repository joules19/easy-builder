-- Add Cloudinary public_id to product_images table
-- This field stores the Cloudinary public_id for image deletion

ALTER TABLE product_images 
ADD COLUMN cloudinary_public_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX idx_product_images_cloudinary_public_id ON product_images (cloudinary_public_id);

-- Add comment for documentation
COMMENT ON COLUMN product_images.cloudinary_public_id IS 'Cloudinary public_id for image deletion and management';