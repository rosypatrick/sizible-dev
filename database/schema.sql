-- Sizible Fashion Style Advice Database Schema
-- This script creates all necessary tables for the Sizible application
-- with proper relationships and constraints

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

-- Create policies for retailers
CREATE POLICY "Retailer staff can view their retailer" 
    ON retailers FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users
            WHERE retailer_users.retailer_id = retailers.id
            AND retailer_users.profile_id = auth.uid()
        )
    );

CREATE POLICY "Retailer admins can update their retailer" 
    ON retailers FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users
            WHERE retailer_users.retailer_id = retailers.id
            AND retailer_users.profile_id = auth.uid()
            AND retailer_users.role = 'admin'
        )
    );

-- Create policies for retailer_users
CREATE POLICY "Retailer admins can manage staff" 
    ON retailer_users FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            WHERE ru.retailer_id = retailer_users.retailer_id
            AND ru.profile_id = auth.uid()
            AND ru.role = 'admin'
        )
    );

-- ===============================
-- BRAND AND PRODUCT TABLES
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

-- Garment types
CREATE TABLE garment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
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

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    garment_type_id UUID NOT NULL REFERENCES garment_types(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE garment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view brands" 
    ON brands FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their brands" 
    ON brands FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users
            WHERE retailer_users.retailer_id = brands.retailer_id
            AND retailer_users.profile_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view garment types" 
    ON garment_types FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can view products" 
    ON products FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their products" 
    ON products FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            JOIN brands b ON b.retailer_id = ru.retailer_id
            WHERE b.id = products.brand_id
            AND ru.profile_id = auth.uid()
        )
    );

-- ===============================
-- SIZE AND MEASUREMENT TABLES
-- ===============================

-- Size chart table
CREATE TABLE size_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    garment_type_id UUID NOT NULL REFERENCES garment_types(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Size definitions
CREATE TABLE sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    size_chart_id UUID NOT NULL REFERENCES size_charts(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "S", "M", "L", "XL", "10", "12", etc.
    order_index INTEGER NOT NULL, -- For sorting sizes in correct order
    bust_min INTEGER, -- in cm
    bust_max INTEGER,
    waist_min INTEGER,
    waist_max INTEGER,
    hips_min INTEGER,
    hips_max INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product sizes available
CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id UUID NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, size_id)
);

-- Enable Row Level Security
ALTER TABLE size_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view size charts" 
    ON size_charts FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their size charts" 
    ON size_charts FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            JOIN brands b ON b.retailer_id = ru.retailer_id
            WHERE b.id = size_charts.brand_id
            AND ru.profile_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view sizes" 
    ON sizes FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their sizes" 
    ON sizes FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            JOIN brands b ON b.retailer_id = ru.retailer_id
            JOIN size_charts sc ON sc.brand_id = b.id
            WHERE sc.id = sizes.size_chart_id
            AND ru.profile_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view product sizes" 
    ON product_sizes FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their product sizes" 
    ON product_sizes FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            JOIN brands b ON b.retailer_id = ru.retailer_id
            JOIN products p ON p.brand_id = b.id
            WHERE p.id = product_sizes.product_id
            AND ru.profile_id = auth.uid()
        )
    );

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

-- Product style attributes
CREATE TABLE product_style_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    style_attribute_id UUID NOT NULL REFERENCES style_attributes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, style_attribute_id)
);

-- Enable Row Level Security
ALTER TABLE style_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_style_attributes ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Anyone can view style attributes" 
    ON style_attributes FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can view product style attributes" 
    ON product_style_attributes FOR SELECT 
    USING (true);

CREATE POLICY "Retailer staff can manage their product style attributes" 
    ON product_style_attributes FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM retailer_users ru
            JOIN brands b ON b.retailer_id = ru.retailer_id
            JOIN products p ON p.brand_id = b.id
            WHERE p.id = product_style_attributes.product_id
            AND ru.profile_id = auth.uid()
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

-- Size recommendations
CREATE TABLE size_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id UUID NOT NULL REFERENCES consumer_profiles(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id),
    garment_type_id UUID NOT NULL REFERENCES garment_types(id),
    size_id UUID NOT NULL REFERENCES sizes(id),
    confidence_score DECIMAL(3, 2) NOT NULL, -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consumer_id, brand_id, garment_type_id)
);

-- Style recommendations
CREATE TABLE style_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id UUID NOT NULL REFERENCES consumer_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    recommendation_score DECIMAL(3, 2) NOT NULL, -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_style_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE size_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view and manage their own consumer profile" 
    ON consumer_profiles FOR ALL 
    USING (auth.uid() = id);

CREATE POLICY "Users can view and manage their own style preferences" 
    ON consumer_style_preferences FOR ALL 
    USING (auth.uid() = consumer_id);

CREATE POLICY "Users can view their own size recommendations" 
    ON size_recommendations FOR SELECT 
    USING (auth.uid() = consumer_id);

CREATE POLICY "Users can view their own style recommendations" 
    ON style_recommendations FOR SELECT 
    USING (auth.uid() = consumer_id);

-- ===============================
-- ANALYTICS TABLES
-- ===============================

-- User interactions
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    interaction_type TEXT NOT NULL, -- e.g., 'view_product', 'get_recommendation', etc.
    resource_type TEXT, -- e.g., 'product', 'size_chart', etc.
    resource_id UUID, -- ID of the resource being interacted with
    metadata JSONB, -- Additional interaction data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interactions" 
    ON user_interactions FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "System can insert interactions" 
    ON user_interactions FOR INSERT 
    WITH CHECK (true);

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

-- Products
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_garment_type_id ON products(garment_type_id);

-- Size charts
CREATE INDEX idx_size_charts_brand_id ON size_charts(brand_id);
CREATE INDEX idx_size_charts_garment_type_id ON size_charts(garment_type_id);

-- Sizes
CREATE INDEX idx_sizes_size_chart_id ON sizes(size_chart_id);

-- Style guidance
CREATE INDEX idx_style_guidance_retailer_id ON style_guidance(retailer_id);
CREATE INDEX idx_style_guidance_garment_type_id ON style_guidance(garment_type_id);

-- Consumer profiles
CREATE INDEX idx_consumer_profiles_measurements ON consumer_profiles(bust, waist, hips);

-- Recommendations
CREATE INDEX idx_size_recommendations_consumer_id ON size_recommendations(consumer_id);
CREATE INDEX idx_size_recommendations_brand_garment ON size_recommendations(brand_id, garment_type_id);
CREATE INDEX idx_style_recommendations_consumer_id ON style_recommendations(consumer_id);

-- User interactions
CREATE INDEX idx_user_interactions_profile_id ON user_interactions(profile_id);
CREATE INDEX idx_user_interactions_created_at ON user_interactions(created_at);
CREATE INDEX idx_user_interactions_resource ON user_interactions(resource_type, resource_id);
