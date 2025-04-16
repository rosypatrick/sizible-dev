-- Sizible Database Setup Script - Updated for Excel format
-- This script creates the necessary tables for the Sizible application with exact column matching

-- Create garments_excel table with columns matching Excel headers exactly
CREATE TABLE IF NOT EXISTS garments_excel (
  id SERIAL PRIMARY KEY,
  "Version" TEXT,
  "Segment" TEXT,
  "Retailer" TEXT,
  "Date of Scan" TEXT,
  "Garment_Type_text" TEXT,
  "Garment_shape" TEXT,
  "FE_Item_Code" TEXT UNIQUE NOT NULL,
  "SKU" TEXT,
  "Garment_Type" TEXT,
  "Garment_description_check" TEXT,
  "Garment_Fit" TEXT,
  "Match_To" TEXT,
  "Fabric" TEXT,
  "Fit flexibility" TEXT,
  "Title" TEXT,
  "Brand" TEXT,
  "Garment_Size" TEXT,
  "size_convention" TEXT,
  "prd_url" TEXT,
  "Image Src" TEXT,
  "Image Position" TEXT,
  "Price" TEXT,  -- Changed to TEXT to handle Euro format (€49.99)
  "Stock" TEXT,  -- Changed to TEXT to handle any format
  "Pattern" TEXT,
  "Texture" TEXT,
  "Material" TEXT,
  "Neckline" TEXT,
  "Sleeve Type" TEXT,
  "Style Category" TEXT,
  "Trend Status" TEXT,
  "Seasonality" TEXT,
  "Occasion Suitability" TEXT,
  "Fashion Era" TEXT,
  "Color Family" TEXT,
  "Layering Position" TEXT,
  "Statement Level" TEXT,
  "Versatility Score" TEXT,
  "Compatibility Tags" TEXT,
  "Body Flattery Zones" TEXT,
  "Care Requirements" TEXT,
  "Events" TEXT,
  "Travel" TEXT,
  "Occasions" TEXT,
  "URL Check" TEXT,
  "Status" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on the primary identifier
CREATE INDEX IF NOT EXISTS idx_garments_excel_fe_item_code ON garments_excel("FE_Item_Code");

-- Create upload_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS upload_logs (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  details JSONB
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_upload_logs_created_at ON upload_logs(created_at);
