-- Sizible Database Setup Script
-- This script creates the necessary tables for the Sizible application

-- Create garments table if it doesn't exist
CREATE TABLE IF NOT EXISTS garments (
  id SERIAL PRIMARY KEY,
  fe_item_code TEXT UNIQUE NOT NULL,
  name TEXT,
  brand TEXT,
  type TEXT,
  size TEXT,
  color TEXT,
  price NUMERIC,
  stock INTEGER,
  image_url TEXT,
  product_url TEXT,
  retailer TEXT,
  material TEXT,
  pattern TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_garments_fe_item_code ON garments(fe_item_code);
CREATE INDEX IF NOT EXISTS idx_upload_logs_created_at ON upload_logs(created_at);

-- Insert a test record if garments table is empty
INSERT INTO garments (fe_item_code, name, brand, type, size, color, price, stock, image_url, product_url, retailer, material, pattern)
SELECT 'TEST001', 'Test Product', 'Test Brand', 'Shirt', 'M', 'Blue', 0.00, 0, '', '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM garments LIMIT 1);

-- Insert a test upload log if upload_logs table is empty
INSERT INTO upload_logs (filename, user_id, status, success_count)
SELECT 'test_upload.xlsx', 'admin', 'success', 1
WHERE NOT EXISTS (SELECT 1 FROM upload_logs LIMIT 1);
