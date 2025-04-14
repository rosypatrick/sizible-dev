# PLANNING.md - Sizible Fashion Style Advice Prototype

## Project Overview

This prototype demonstrates a fashion platform with dual interfaces for retailers and consumers, aligned with Sizible's brand identity. Retailers can provide natural language style advice and promotion preferences, while consumers receive personalized size and style recommendations. The system leverages NLP to translate retailer guidance into consumer-facing recommendations.

## Brand Identity

### Visual Elements
- **Primary Color**: Pink (#ff5ea3) - Used for highlights, buttons, and key UI elements
- **Secondary Colors**: White and dark gray/black for text and backgrounds
- **Typography**: 
  - Primary Font: Poppins (100-900 weights)
  - Secondary Fonts: Montserrat Alternates, Manrope
- **Logo**: Sizible logo in white against colored backgrounds
- **Imagery**: Clean, modern fashion photography with emphasis on diverse models

### Design Principles
- Modern, clean interface with ample white space
- Mobile-responsive design prioritizing user experience
- Emphasis on visual hierarchy with clear call-to-action elements
- Professional yet approachable aesthetic

## User Flows

### Retailer Flow:
1. Login with retailer name and personal name (simplified authentication)
2. View existing garments in inventory
3. Provide free-form NLP guidance on:
   - Style pairings (items that go well together)
   - Promotional priorities (items to highlight)
4. Submit and save guidance in the system

### Consumer Flow:
1. Access consumer entry point
2. Input basic information:
   - Selected retailer
   - Brand preference
   - Garment type
3. System calls sizing API to retrieve fit information (e.g., "You are a size 10 for Joseph Ribkoff")
4. System applies retailer's style guidance to recommend complementary items
   (e.g., "We also recommend this Betty Barclay scarf with your Joseph Ribkoff dress")

## Architecture

### System Components

#### Frontend
- **Technology**: React
- **Key Components**:
  - Retailer Interface
    - Login Screen (branded with Sizible colors and logo)
    - Garment Inventory View (clean, card-based layout)
    - NLP Guidance Input Form (intuitive, conversational UI)
  - Consumer Interface
    - Retailer/Brand/Garment Selection (visually appealing selector)
    - Size Recommendation Display (clear, confidence-based visualization)
    - Style Recommendations Display (visual product cards with complementary items)
- **Styling**:
  - CSS Framework: Bootstrap with custom Sizible theme
  - Responsive design for all device sizes
  - Consistent branding across all components
  - Animations for transitions and user feedback

#### Backend
- **Technology**: Node.js with Express
- **Key Services**:
  - Authentication Service (simplified)
  - Garment Management Service
  - Retailer Guidance Processing Service
  - Sizing API Integration
  - Recommendation Engine

#### Database
- **Technology**: Supabase PostgreSQL
- **Key Tables**:
  - Retailers (simplified user accounts)
  - Garments (comprehensive attribute set)
  - RetailerGuidance (NLP inputs from retailers)
  - StyleRecommendations (processed from NLP guidance)

### Data Flow

1. **Retailer Input to Recommendation Flow**:
   - Retailer provides natural language style guidance
   - System processes NLP input into structured recommendations
   - Recommendations stored and linked to specific garments/retailers

2. **Consumer Recommendation Flow**:
   - Consumer selects retailer/brand/garment
   - System retrieves size recommendation from API
   - System queries matching style recommendations based on retailer guidance
   - Combined size and style advice presented to consumer

## Database Schema

### Main Garments Table
Based on the provided schema:

```sql
CREATE TABLE garments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "Version" TEXT,
  "Segment" TEXT,
  "Retailer" TEXT NOT NULL,
  "Date of Scan" TIMESTAMP WITH TIME ZONE,
  "Garment_Type_text" TEXT NOT NULL,
  "Garment_shape" TEXT,
  "FE_Item_Code" TEXT,
  "SKU" TEXT UNIQUE,
  "Garment_Type" TEXT,
  "Garment_description_check" TEXT,
  "Garment_Fit" TEXT,
  "Match_To" TEXT[],
  "Fabric" TEXT,
  "Fit flexibility" TEXT,
  "Title" TEXT,
  "Brand" TEXT NOT NULL,
  "Garment_Size" TEXT,
  "size_convention" TEXT,
  "prd_url" TEXT,
  "Image Src" TEXT,
  "Image Position" TEXT,
  "Price" NUMERIC,
  "Stock" INTEGER DEFAULT 0,
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
  "Versatility Score" INTEGER,
  "Compatibility Tags" TEXT[],
  "Body Flattery Zones" TEXT[],
  "Care Requirements" TEXT,
  "Events" TEXT[],
  "Travel" TEXT,
  "Occasions" TEXT[],
  "URL Check" TEXT,
  "Status" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Additional Tables

```sql
CREATE TABLE retailers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_name TEXT NOT NULL,
  personal_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE retailer_guidance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id UUID REFERENCES retailers(id),
  guidance_text TEXT NOT NULL,
  guidance_type TEXT NOT NULL, -- 'style' or 'promotion'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE style_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_garment_id UUID REFERENCES garments(id),
  recommended_garment_id UUID REFERENCES garments(id),
  retailer_id UUID REFERENCES retailers(id),
  recommendation_strength NUMERIC, -- calculated from NLP confidence
  guidance_id UUID REFERENCES retailer_guidance(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## NLP Processing Approach

1. **Guidance Extraction**:
   - Parse retailer's natural language input
   - Identify garment types, brands, and modifiers
   - Extract relationship types (pairs well with, complements, etc.)
   - Identify promotional intent (highlight, feature, etc.)

2. **Recommendation Generation**:
   - Map extracted concepts to database garments
   - Create structured style recommendations
   - Assign confidence/strength scores
   - Link recommendations to source guidance

## API Integration

### Sizing API Integration
- Endpoint for size recommendations
- Input: User details, retailer, brand, garment type
- Output: Size recommendation with confidence score

### Internal API Endpoints

```
// Retailer Endpoints
POST /api/retailer/login
GET /api/retailer/garments
POST /api/retailer/guidance

// Consumer Endpoints
GET /api/consumer/size?retailer={id}&brand={brand}&garmentType={type}
GET /api/consumer/recommendations?garmentId={id}
```

## Development Roadmap

### Phase 1: Core Setup (1 week)
- Set up Supabase project and database schema
- Create basic React app structure for both interfaces
- Implement simplified authentication for retailers

### Phase 2: Retailer Interface (1 week)
- Build retailer dashboard view
- Implement garment viewing functionality
- Create NLP guidance input form
- Build basic guidance storage

### Phase 3: NLP Processing (1-2 weeks)
- Implement guidance parsing system
- Build recommendation generation logic
- Create algorithm for matching recommendations to garments

### Phase 4: Consumer Interface (1-2 weeks)
- Build consumer entry flow
- Implement size API integration
- Create recommendation display
- Connect retailer guidance to consumer recommendations

### Phase 5: Testing & Refinement (1 week)
- Test end-to-end flows
- Refine NLP processing accuracy
- Optimize recommendation relevance
- Document system for stakeholders

## Technical Constraints

- Prototype focus - simplified authentication
- Limited error handling in early versions
- Basic NLP processing without advanced ML
- Minimal frontend styling/polish
- Limited optimization for performance

## Future Expansion Considerations

- Advanced authentication system
- More sophisticated NLP/ML for recommendation generation
- Integration with inventory management systems
- Consumer accounts and preference tracking
- Analytics for retailer recommendation performance

## Brand Compliance Guidelines

- All interfaces must adhere to Sizible's color palette and typography
- Logo placement should be consistent across all screens
- UI components should maintain the clean, modern aesthetic of the Sizible brand
- Messaging should align with Sizible's professional yet approachable tone
- All imagery should reflect diversity and inclusivity in fashion
- Interactive elements should provide visual feedback consistent with brand guidelines
