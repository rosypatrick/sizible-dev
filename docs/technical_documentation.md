# Sizible Fashion Style Advice - Technical Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Size Recommendation Technology](#size-recommendation-technology)
5. [Style Recommendation System](#style-recommendation-system)
6. [Frontend Implementation](#frontend-implementation)
7. [Backend Implementation](#backend-implementation)
8. [Database Design](#database-design)
9. [API Documentation](#api-documentation)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Guidelines](#deployment-guidelines)
12. [References](#references)

## Introduction

The Sizible Fashion Style Advice prototype is a dual-interface platform connecting retailers and consumers through personalized size and style recommendations. This document provides technical guidance for implementing the system according to Sizible's brand identity and best practices.

## Technology Stack

### Frontend
- **Framework**: React
- **State Management**: React Context API
- **Styling**: CSS Modules or Styled Components with Sizible theme
- **UI Framework**: Bootstrap with custom Sizible theme
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

### Backend
- **Framework**: Node.js with Express
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Joi/Yup

### Infrastructure
- **Hosting**: Vercel (Frontend), Heroku or Render (Backend)
- **Database Hosting**: Supabase Cloud
- **Version Control**: Git

## Architecture Overview

The system follows a modern client-server architecture with clear separation of concerns:

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Retailer         │     │  Backend          │     │  Consumer         │
│  Interface        │◄────┤  Services         │────►│  Interface        │
│  (React)          │     │  (Node.js)        │     │  (React)          │
│                   │     │                   │     │                   │
└───────────────────┘     └─────────┬─────────┘     └───────────────────┘
                                    │
                                    │
                          ┌─────────▼─────────┐     ┌───────────────────┐
                          │                   │     │                   │
                          │  Supabase         │     │  Sizing API       │
                          │  PostgreSQL       │◄────┤  (External)       │
                          │                   │     │                   │
                          └───────────────────┘     └───────────────────┘
```

### Key Architectural Principles

1. **Modular Design**: Breaking the application into smaller, reusable components
2. **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
3. **Consistent State Management**: Using React Context API for global state
4. **Responsive Design**: Mobile-first approach using Bootstrap breakpoints
5. **API-First Development**: Well-defined API contracts between frontend and backend

## Size Recommendation Technology

Size recommendation is a critical component of the system, leveraging external APIs to provide accurate sizing information.

### Implementation Approaches

Based on industry research, several approaches can be considered:

1. **Body Measurement-Based**:
   - Requires user input of key measurements
   - Matches measurements to garment specifications
   - Higher accuracy but requires more user effort

2. **Purchase History-Based**:
   - Analyzes previous purchases and return data
   - Recommends sizes based on similar users' behavior
   - Works well for returning customers

3. **Questionnaire-Based**:
   - Simple questions about body type, fit preferences
   - Maps responses to size recommendations
   - Good balance of effort vs. accuracy

4. **Hybrid Approach** (Recommended):
   - Combines multiple data points
   - Adapts based on available information
   - Provides confidence scores with recommendations

### Integration with External Size API

The system will integrate with external sizing APIs through a standardized interface:

```javascript
// Example size API integration
async function getSizeRecommendation(retailerId, brand, garmentType, userMetrics) {
  try {
    const response = await axios.post('/api/external/size-recommendation', {
      retailerId,
      brand,
      garmentType,
      userMetrics
    });
    
    return {
      recommendedSize: response.data.size,
      confidence: response.data.confidence,
      alternativeSizes: response.data.alternatives || []
    };
  } catch (error) {
    console.error('Error fetching size recommendation:', error);
    throw new Error('Unable to get size recommendation');
  }
}
```

## Style Recommendation System

The style recommendation system processes retailer guidance to generate personalized style recommendations.

### NLP Processing Pipeline

1. **Text Preprocessing**:
   - Tokenization
   - Stop word removal
   - Lemmatization

2. **Entity Extraction**:
   - Identify garment types
   - Extract attributes (colors, patterns, styles)
   - Recognize brand mentions

3. **Relationship Mapping**:
   - Identify complementary items
   - Detect styling suggestions
   - Extract promotional priorities

4. **Confidence Scoring**:
   - Assign confidence scores to recommendations
   - Prioritize recommendations based on scores
   - Filter low-confidence suggestions

### Recommendation Algorithm

```javascript
// Pseudocode for recommendation generation
function generateRecommendations(garmentId, retailerGuidance) {
  // Get garment details
  const mainGarment = getGarmentById(garmentId);
  
  // Extract relevant guidance for this garment type
  const relevantGuidance = filterGuidanceByGarmentType(
    retailerGuidance, 
    mainGarment.type
  );
  
  // Find complementary items based on guidance
  const complementaryItems = findComplementaryItems(
    mainGarment,
    relevantGuidance,
    mainGarment.attributes
  );
  
  // Score and rank recommendations
  const scoredRecommendations = scoreRecommendations(
    complementaryItems,
    mainGarment
  );
  
  // Return top recommendations with confidence scores
  return {
    mainGarment,
    recommendations: scoredRecommendations.slice(0, 5)
  };
}
```

## Frontend Implementation

### Component Architecture

#### Retailer Interface
```
RetailerApp
├── LoginPage (Sizible-branded)
├── DashboardPage
│   ├── Header (with Sizible logo)
│   ├── GarmentInventoryComponent
│   │   ├── GarmentCard
│   │   ├── GarmentFilters
│   │   └── GarmentPagination
│   └── GuidanceInputComponent
│       ├── NLPInputForm
│       ├── GuidanceHistory
│       └── GuidancePreview
└── SharedComponents
    ├── SizibleNavigation
    ├── SizibleFooter
    ├── SizibleButton
    └── SizibleCard
```

#### Consumer Interface
```
ConsumerApp
├── SelectionPage (Sizible-branded)
│   ├── RetailerSelector
│   ├── BrandSelector
│   └── GarmentTypeSelector
├── RecommendationPage
│   ├── SizeRecommendationComponent
│   │   ├── SizeDisplay
│   │   └── ConfidenceIndicator
│   └── StyleRecommendationComponent
│       ├── MainGarmentCard
│       └── ComplementaryItemsList
└── SharedComponents
    ├── SizibleNavigation
    ├── SizibleFooter
    ├── SizibleButton
    └── SizibleCard
```

### Styling Implementation

The application will use a combination of Bootstrap and custom styling to implement Sizible's brand identity:

```javascript
// src/styles/theme.js
export const theme = {
  colors: {
    primary: '#ff5ea3',     // Sizible pink
    secondary: '#ffffff',   // White
    text: '#333333',        // Dark gray/black
    background: '#f8f9fa',  // Light gray
    accent: '#f0f0f0'       // Very light gray
  },
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      secondary: "'Montserrat Alternates', 'Manrope', sans-serif"
    },
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    unit: '8px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
    xxlarge: '48px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)'
  }
};
```

### Responsive Design Implementation

Following a mobile-first approach:

```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
}

/* Desktop styles */
@media (min-width: 992px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Backend Implementation

### Server Architecture

The backend follows a layered architecture:

1. **Routes Layer**: Defines API endpoints
2. **Controller Layer**: Handles request/response
3. **Service Layer**: Contains business logic
4. **Data Access Layer**: Interacts with database

```javascript
// Example server structure
/server
  /routes
    retailerRoutes.js
    consumerRoutes.js
  /controllers
    retailerController.js
    consumerController.js
  /services
    guidanceService.js
    recommendationService.js
    sizeService.js
  /data
    garmentRepository.js
    retailerRepository.js
    recommendationRepository.js
  /middleware
    auth.js
    validation.js
    errorHandler.js
  /utils
    nlpProcessor.js
    confidenceScorer.js
  server.js
```

### API Implementation

Using Express.js with middleware for authentication, validation, and error handling:

```javascript
// Example retailer routes
const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

// Retailer authentication
router.post('/login', validationMiddleware.validateLogin, retailerController.login);

// Garment management (protected routes)
router.get('/garments', authMiddleware.verifyToken, retailerController.getGarments);

// Guidance submission
router.post(
  '/guidance', 
  authMiddleware.verifyToken, 
  validationMiddleware.validateGuidance,
  retailerController.submitGuidance
);

module.exports = router;
```

## Database Design

### Supabase PostgreSQL Schema

```sql
-- Retailers table
CREATE TABLE retailers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_name VARCHAR(255) NOT NULL,
  personal_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garments table
CREATE TABLE garments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id UUID REFERENCES retailers(id),
  brand VARCHAR(255) NOT NULL,
  garment_type VARCHAR(255) NOT NULL,
  version VARCHAR(255),
  segment VARCHAR(255),
  -- Add all 45 required attributes
  color VARCHAR(255),
  pattern VARCHAR(255),
  material VARCHAR(255),
  -- ... other attributes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Retailer guidance table
CREATE TABLE retailer_guidance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id UUID REFERENCES retailers(id),
  guidance_text TEXT NOT NULL,
  guidance_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style recommendations table
CREATE TABLE style_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_garment_id UUID REFERENCES garments(id),
  complementary_garment_id UUID REFERENCES garments(id),
  guidance_id UUID REFERENCES retailer_guidance(id),
  confidence_score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row-Level Security Policies

```sql
-- Enable RLS on tables
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_recommendations ENABLE ROW LEVEL SECURITY;

-- Retailer can only see their own data
CREATE POLICY retailer_isolation ON retailers
  FOR ALL
  USING (auth.uid() = id);

-- Retailer can only see their own garments
CREATE POLICY retailer_garments ON garments
  FOR ALL
  USING (auth.uid() = retailer_id);

-- Retailer can only see their own guidance
CREATE POLICY retailer_guidance ON retailer_guidance
  FOR ALL
  USING (auth.uid() = retailer_id);
```

## API Documentation

### Retailer API

```
POST /api/retailer/login
Request: { retailerName, personalName }
Response: { success, token, retailerId }

GET /api/retailer/garments
Headers: { Authorization: Bearer <token> }
Response: { garments: [...] }

POST /api/retailer/guidance
Headers: { Authorization: Bearer <token> }
Request: { guidanceText, guidanceType }
Response: { success, guidanceId, processedRecommendations: [...] }
```

### Consumer API

```
GET /api/consumer/retailers
Response: { retailers: [...] }

GET /api/consumer/brands?retailerId=<id>
Response: { brands: [...] }

GET /api/consumer/garment-types?retailerId=<id>&brand=<brand>
Response: { garmentTypes: [...] }

GET /api/consumer/size?retailerId=<id>&brand=<brand>&garmentType=<type>
Response: { sizeRecommendation, confidence }

GET /api/consumer/recommendations?garmentId=<id>
Response: { mainGarment, complementaryItems: [...] }
```

## Testing Strategy

### Unit Testing

Using Jest for unit testing components and services:

```javascript
// Example unit test for recommendation service
describe('RecommendationService', () => {
  it('should generate recommendations based on guidance', async () => {
    // Arrange
    const mockGarment = { id: '123', type: 'dress', color: 'red' };
    const mockGuidance = 'Red dresses pair well with black shoes and gold accessories';
    
    // Act
    const result = await recommendationService.generateRecommendations(
      mockGarment.id,
      mockGuidance
    );
    
    // Assert
    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations[0].garmentType).toBe('shoes');
    expect(result.recommendations[0].color).toBe('black');
    expect(result.recommendations[1].garmentType).toBe('accessories');
    expect(result.recommendations[1].color).toBe('gold');
  });
});
```

### Integration Testing

Testing API endpoints with Supertest:

```javascript
// Example API integration test
describe('Retailer API', () => {
  it('should return garments for authenticated retailer', async () => {
    // Arrange
    const token = await getAuthToken();
    
    // Act
    const response = await request(app)
      .get('/api/retailer/garments')
      .set('Authorization', `Bearer ${token}`);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.garments).toBeDefined();
    expect(Array.isArray(response.body.garments)).toBe(true);
  });
});
```

### End-to-End Testing

Using Cypress for end-to-end testing:

```javascript
// Example E2E test
describe('Consumer Flow', () => {
  it('should display size recommendation', () => {
    // Visit consumer entry point
    cy.visit('/consumer');
    
    // Select retailer
    cy.get('[data-testid="retailer-selector"]').click();
    cy.get('[data-testid="retailer-option-1"]').click();
    
    // Select brand
    cy.get('[data-testid="brand-selector"]').click();
    cy.get('[data-testid="brand-option-1"]').click();
    
    // Select garment type
    cy.get('[data-testid="garment-type-selector"]').click();
    cy.get('[data-testid="garment-type-option-1"]').click();
    
    // Verify size recommendation is displayed
    cy.get('[data-testid="size-recommendation"]').should('be.visible');
    cy.get('[data-testid="confidence-indicator"]').should('be.visible');
  });
});
```

## Deployment Guidelines

### Frontend Deployment (Vercel)

1. Set up Vercel project
2. Configure environment variables
3. Connect to Git repository
4. Set up build command: `npm run build`
5. Configure custom domain if needed

### Backend Deployment (Heroku/Render)

1. Create Heroku/Render application
2. Configure environment variables
3. Set up database connection
4. Deploy from Git repository
5. Set up CI/CD pipeline

### Database Setup (Supabase)

1. Create Supabase project
2. Run database migration scripts
3. Configure Row-Level Security policies
4. Set up database indexes
5. Configure backup strategy

## References

1. Sizible Website - https://sizible.com
2. Supabase Documentation - https://supabase.com/docs
3. React Best Practices - https://www.sitepoint.com/react-architecture-best-practices/
4. Size Recommendation Systems - https://3dlook.ai/content-hub/size-recommendation-tools/
5. Fashion Recommendation Systems - https://dev.to/jimatjibba/build-a-content-based-recommendation-engine-in-js-2lpi
6. Node.js Best Practices - https://mdjamilkashemporosh.medium.com/best-practices-for-building-react-applications-using-node-js-12e71890aa65
