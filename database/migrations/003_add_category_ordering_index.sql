-- Migration: Add index for category ordering
-- This improves performance when ordering categories by display_order

-- Create index for category ordering
CREATE INDEX IF NOT EXISTS idx_categories_vendor_display_order 
ON categories(vendor_id, display_order);

-- Update existing categories to have proper display_order if they don't
-- This ensures categories without display_order get sequential ordering
UPDATE categories 
SET display_order = sub.row_num
FROM (
  SELECT 
    id, 
    ROW_NUMBER() OVER (PARTITION BY vendor_id ORDER BY created_at) as row_num
  FROM categories 
  WHERE display_order IS NULL OR display_order = 0
) sub
WHERE categories.id = sub.id;