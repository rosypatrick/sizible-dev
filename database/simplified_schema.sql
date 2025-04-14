-- Sizible Fashion Style Advice Database Schema (Simplified)
-- This script creates a streamlined schema focused on garment data with FE_item_Code as the primary key
-- Designed to support CSV imports and external sizing API integration

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ===============================
-- USERS AND AUTHENTICATION TABLES
-- ===============================

-- Profiles table to store user information
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- ===============================
-- RETAILER TABLES
-- ===============================

-- Retailers table
CREATE TABLE retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Retailer users (staff accounts)
CREATE TABLE retailer_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, retailer_id)
);

-- Enable Row Level Security
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_users ENABLE ROW LEVEL SECURITY;

-- Create policies for retailers and users
CREATE POLICY "Retailer staff can view their retailer" 
    ON retailers FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users
            WHERE retailer_users.retailer_id = retailers.id
            AND retailer_users.profile_id = auth.uid()
        )
    );

-- ===============================
-- BRANDS TABLE
-- ===============================

-- Brands table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID REFERENCES retailers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view brands" 
    ON brands FOR SELECT 
    USING (true);

-- ===============================
-- GARMENT TYPES
-- ===============================

-- Garment types
CREATE TABLE garment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert common garment types
INSERT INTO garment_types (name, description) VALUES
    ('Dress', 'Full-length or knee-length garment'),
    ('Top', 'Upper body garment including blouses, shirts, and t-shirts'),
    ('Pants', 'Lower body garment including trousers and jeans'),
    ('Skirt', 'Lower body garment with open bottom'),
    ('Jacket', 'Outerwear garment for the upper body'),
    ('Coat', 'Heavy outerwear garment'),
    ('Jumpsuit', 'One-piece garment with top and bottom connected');

-- Enable Row Level Security
ALTER TABLE garment_types ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view garment types" 
    ON garment_types FOR SELECT 
    USING (true);

-- ===============================
-- GARMENTS TABLE (MAIN TABLE)
-- ===============================

-- Garments table - designed for CSV import
CREATE TABLE garments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fe_item_code TEXT UNIQUE NOT NULL, -- Primary business key from external system
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    garment_type_id UUID NOT NULL REFERENCES garment_types(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    color TEXT,
    material TEXT,
    season TEXT,
    year INTEGER,
    image_url TEXT,
    available_sizes TEXT[], -- Array of available sizes (e.g., ['S', 'M', 'L'])
    stock_status TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on FE_item_Code for fast lookups
CREATE INDEX idx_garments_fe_item_code ON garments(fe_item_code);

-- Enable Row Level Security
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active garments" 
    ON garments FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Retailer staff can manage their garments" 
    ON garments FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            JOIN brands b ON b.retailer_id = ru.retailer_id
            WHERE b.id = garments.brand_id
            AND ru.profile_id = auth.uid()
        )
    );

-- ===============================
-- STYLE ATTRIBUTES
-- ===============================

-- Style tags/attributes
CREATE TABLE style_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert common style attributes
INSERT INTO style_attributes (name, description) VALUES
    ('Casual', 'Relaxed, everyday style'),
    ('Formal', 'Dressy, elegant style for special occasions'),
    ('Business', 'Professional attire for work environments'),
    ('Bohemian', 'Free-spirited, artistic style with natural elements'),
    ('Vintage', 'Inspired by past eras and decades'),
    ('Minimalist', 'Simple, clean lines with neutral colors'),
    ('Sporty', 'Athletic-inspired, comfortable style'),
    ('Romantic', 'Feminine style with soft details and colors');

-- Garment style attributes
CREATE TABLE garment_style_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garment_id UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    style_attribute_id UUID NOT NULL REFERENCES style_attributes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(garment_id, style_attribute_id)
);

-- Enable Row Level Security
ALTER TABLE style_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE garment_style_attributes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view style attributes" 
    ON style_attributes FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can view garment style attributes" 
    ON garment_style_attributes FOR SELECT 
    USING (true);

-- ===============================
-- STYLE GUIDANCE TABLES
-- ===============================

-- Style guidance from retailers
CREATE TABLE style_guidance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    garment_type_id UUID NOT NULL REFERENCES garment_types(id),
    guidance_text TEXT NOT NULL, -- Natural language style advice
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE style_guidance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view style guidance" 
    ON style_guidance FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their style guidance" 
    ON style_guidance FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users
            WHERE retailer_users.retailer_id = style_guidance.retailer_id
            AND retailer_users.profile_id = auth.uid()
        )
    );

-- ===============================
-- CONSUMER TABLES
-- ===============================

-- Consumer profiles
CREATE TABLE consumer_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    bust INTEGER, -- in cm
    waist INTEGER,
    hips INTEGER,
    height INTEGER,
    weight INTEGER,
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Consumer style preferences
CREATE TABLE consumer_style_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id UUID NOT NULL REFERENCES consumer_profiles(id) ON DELETE CASCADE,
    style_attribute_id UUID NOT NULL REFERENCES style_attributes(id) ON DELETE CASCADE,
    preference_level INTEGER NOT NULL CHECK (preference_level BETWEEN 1 AND 5), -- 1 to 5 rating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consumer_id, style_attribute_id)
);

-- Enable Row Level Security
ALTER TABLE consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_style_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view and manage their own consumer profile" 
    ON consumer_profiles FOR ALL 
    USING (auth.uid() = id);

CREATE POLICY "Users can view and manage their own style preferences" 
    ON consumer_style_preferences FOR ALL 
    USING (auth.uid() = consumer_id);

-- ===============================
-- API INTEGRATION TABLES
-- ===============================

-- External API size recommendations
CREATE TABLE api_size_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id UUID NOT NULL REFERENCES consumer_profiles(id) ON DELETE CASCADE,
    fe_item_code TEXT NOT NULL REFERENCES garments(fe_item_code),
    recommended_size TEXT NOT NULL,
    confidence_score DECIMAL(3, 2) NOT NULL, -- 0.00 to 1.00
    api_response_json JSONB, -- Store the full API response for reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consumer_id, fe_item_code)
);

-- Enable Row Level Security
ALTER TABLE api_size_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own size recommendations" 
    ON api_size_recommendations FOR SELECT 
    USING (auth.uid() = consumer_id);

-- ===============================
-- CSV IMPORT TRACKING
-- ===============================

-- Track CSV imports
CREATE TABLE csv_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    imported_by UUID NOT NULL REFERENCES profiles(id),
    record_count INTEGER NOT NULL,
    success_count INTEGER NOT NULL,
    error_count INTEGER NOT NULL,
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE csv_imports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Retailer staff can view their import history" 
    ON csv_imports FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users
            WHERE retailer_users.retailer_id = csv_imports.retailer_id
            AND retailer_users.profile_id = auth.uid()
        )
    );

-- ===============================
-- HELPER FUNCTION FOR CSV IMPORT
-- ===============================

-- Function to import garments from CSV
CREATE OR REPLACE FUNCTION import_garments_from_csv(
    p_retailer_id UUID,
    p_brand_id UUID,
    p_csv_data TEXT,
    p_imported_by UUID
) RETURNS UUID AS $$
DECLARE
    v_import_id UUID;
    v_record_count INTEGER := 0;
    v_success_count INTEGER := 0;
    v_error_count INTEGER := 0;
    v_error_details JSONB := '[]'::JSONB;
    v_csv_row RECORD;
    v_garment_type_id UUID;
    v_garment_id UUID;
BEGIN
    -- Create import record
    INSERT INTO csv_imports (
        retailer_id, 
        filename, 
        imported_by, 
        record_count, 
        success_count, 
        error_count, 
        error_details
    ) VALUES (
        p_retailer_id,
        'direct-import-' || TO_CHAR(NOW(), 'YYYY-MM-DD-HH24-MI-SS'),
        p_imported_by,
        0, 0, 0, '[]'::JSONB
    ) RETURNING id INTO v_import_id;
    
    -- Process each row from the CSV
    FOR v_csv_row IN 
        SELECT * FROM csvparse(p_csv_data)
    LOOP
        v_record_count := v_record_count + 1;
        
        BEGIN
            -- Look up garment type
            SELECT id INTO v_garment_type_id 
            FROM garment_types 
            WHERE name = v_csv_row.garment_type;
            
            IF v_garment_type_id IS NULL THEN
                -- Create new garment type if it doesn't exist
                INSERT INTO garment_types (name, description)
                VALUES (v_csv_row.garment_type, 'Imported from CSV')
                RETURNING id INTO v_garment_type_id;
            END IF;
            
            -- Check if garment already exists
            SELECT id INTO v_garment_id
            FROM garments
            WHERE fe_item_code = v_csv_row.fe_item_code;
            
            IF v_garment_id IS NULL THEN
                -- Insert new garment
                INSERT INTO garments (
                    fe_item_code,
                    brand_id,
                    garment_type_id,
                    name,
                    description,
                    price,
                    color,
                    material,
                    season,
                    year,
                    available_sizes,
                    stock_status,
                    is_active
                ) VALUES (
                    v_csv_row.fe_item_code,
                    p_brand_id,
                    v_garment_type_id,
                    v_csv_row.name,
                    v_csv_row.description,
                    NULLIF(v_csv_row.price, '')::DECIMAL,
                    v_csv_row.color,
                    v_csv_row.material,
                    v_csv_row.season,
                    NULLIF(v_csv_row.year, '')::INTEGER,
                    string_to_array(v_csv_row.available_sizes, ','),
                    v_csv_row.stock_status,
                    COALESCE(v_csv_row.is_active::BOOLEAN, TRUE)
                );
            ELSE
                -- Update existing garment
                UPDATE garments SET
                    brand_id = p_brand_id,
                    garment_type_id = v_garment_type_id,
                    name = v_csv_row.name,
                    description = v_csv_row.description,
                    price = NULLIF(v_csv_row.price, '')::DECIMAL,
                    color = v_csv_row.color,
                    material = v_csv_row.material,
                    season = v_csv_row.season,
                    year = NULLIF(v_csv_row.year, '')::INTEGER,
                    available_sizes = string_to_array(v_csv_row.available_sizes, ','),
                    stock_status = v_csv_row.stock_status,
                    is_active = COALESCE(v_csv_row.is_active::BOOLEAN, TRUE),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = v_garment_id;
            END IF;
            
            v_success_count := v_success_count + 1;
        EXCEPTION WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            v_error_details := v_error_details || jsonb_build_object(
                'row', v_record_count,
                'fe_item_code', v_csv_row.fe_item_code,
                'error', SQLERRM
            );
        END;
    END LOOP;
    
    -- Update import record with results
    UPDATE csv_imports SET
        record_count = v_record_count,
        success_count = v_success_count,
        error_count = v_error_count,
        error_details = v_error_details
    WHERE id = v_import_id;
    
    RETURN v_import_id;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);

-- Retailers
CREATE INDEX idx_retailers_name ON retailers(name);

-- Brands
CREATE INDEX idx_brands_retailer_id ON brands(retailer_id);
CREATE INDEX idx_brands_name ON brands(name);

-- Garments
CREATE INDEX idx_garments_brand_id ON garments(brand_id);
CREATE INDEX idx_garments_garment_type_id ON garments(garment_type_id);
CREATE INDEX idx_garments_name ON garments(name);

-- Style guidance
CREATE INDEX idx_style_guidance_retailer_id ON style_guidance(retailer_id);
CREATE INDEX idx_style_guidance_garment_type_id ON style_guidance(garment_type_id);

-- Consumer profiles
CREATE INDEX idx_consumer_profiles_measurements ON consumer_profiles(bust, waist, hips);

-- API recommendations
CREATE INDEX idx_api_size_recommendations_consumer_id ON api_size_recommendations(consumer_id);
CREATE INDEX idx_api_size_recommendations_fe_item_code ON api_size_recommendations(fe_item_code);
