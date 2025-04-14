# ARCHITECTURE.md - Sizible Fashion Style Advice Prototype

## System Architecture Overview

This document outlines the architecture for the Sizible Fashion Style Advice prototype, a system that connects retailer style guidance with consumer recommendations while maintaining Sizible's brand identity.

## Brand & Design System

### Brand Elements
- **Logo**: Sizible logo (white version for dark backgrounds, dark version for light backgrounds)
- **Color Palette**:
  - Primary: Pink (#ff5ea3)
  - Secondary: White (#ffffff)
  - Text: Dark gray/black (#333333)
  - Accents: Light gray (#f8f9fa) for backgrounds
- **Typography**:
  - Primary: Poppins (weights 100-900)
  - Secondary: Montserrat Alternates, Manrope
- **UI Components**:
  - Buttons: Pink background with white text, rounded corners
  - Cards: White background with subtle shadows
  - Navigation: Clean, minimal with clear hierarchy

### Design System Implementation
- Bootstrap-based framework with custom Sizible theme
- Responsive breakpoints following standard Bootstrap conventions
- Consistent spacing system (8px base unit)
- Component library adhering to Sizible's visual language

## High-Level Architecture

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

## Component Architecture

### Frontend Components

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

## Technology Stack

### Frontend
- **Framework**: React
- **State Management**: React Context API
- **Styling**: CSS Modules or Styled Components with Sizible theme
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **NLP Processing**: Compromise.js or similar lightweight NLP library
- **Authentication**: Supabase Auth (simplified for prototype)
- **Validation**: Joi or Yup

### Database
- **Platform**: Supabase
- **Database**: PostgreSQL
- **ORM**: Supabase JS Client

### DevOps
- **Source Control**: Git
- **Hosting**: Vercel (Frontend), Heroku or Render (Backend)
- **Database Hosting**: Supabase Cloud

## UI/UX Design Specifications

### Retailer Interface
- **Login Screen**: 
  - Clean, minimalist design with Sizible logo prominently displayed
  - Pink accent buttons against white background
  - Poppins font for all text elements
- **Dashboard**:
  - White background with subtle grid layout
  - Card-based UI for garment inventory
  - Sizible pink for action buttons and highlights
  - Clear visual hierarchy with consistent spacing

### Consumer Interface
- **Selection Flow**:
  - Step-by-step interface with progress indicator
  - Large, touch-friendly selection components
  - Visual feedback for selections using Sizible pink
- **Recommendation Display**:
  - Prominent size recommendation with confidence visualization
  - Visually appealing product cards for style recommendations
  - Clear call-to-action buttons in Sizible pink
  - Responsive layout adapting to all device sizes

## Responsive Design Strategy
- Mobile-first approach using Bootstrap breakpoints
- Flexible layouts that adapt to different screen sizes
- Touch-optimized interface elements on mobile
- Consistent experience across devices while optimizing for each form factor

## API Contract

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

## Performance Considerations

As a prototype, performance optimizations are minimal, but we consider:
- Basic database indexing on frequently queried fields
- Simple result caching for NLP processing results
- Pagination for large result sets
- Image optimization for product displays

## Monitoring & Logging

Basic monitoring and logging include:
- Console logging for backend services
- Error tracking for API endpoints
- Simple analytics for recommendation effectiveness
- Performance timing for NLP processing

## Future Architectural Considerations

1. **Scalability**: Move to a microservice architecture for production
2. **Machine Learning**: Replace simple NLP with ML-based recommendation engine
3. **Authentication**: Implement proper OAuth-based authentication system
4. **Real-time Updates**: Add WebSocket support for inventory updates
5. **CDN Integration**: Implement proper CDN for product imagery
6. **Caching Layer**: Add Redis or similar for improved performance
7. **Analytics Pipeline**: Create comprehensive analytics for recommendation effectiveness
