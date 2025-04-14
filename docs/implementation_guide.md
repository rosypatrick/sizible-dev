# Sizible Fashion Style Advice - Implementation Guide

## Overview

This guide provides practical implementation steps for the Sizible Fashion Style Advice prototype, following the project's technical documentation and adhering to Sizible's brand identity.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git
- Supabase account

### Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sizible-dev
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```
   # Frontend (.env.local)
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Backend (.env)
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   ```

## Frontend Implementation

### Setting Up the React Application

1. **Create a new React app**
   ```bash
   npx create-react-app frontend
   cd frontend
   ```

2. **Install required dependencies**
   ```bash
   npm install react-router-dom axios react-hook-form bootstrap styled-components
   ```

3. **Set up project structure**
   ```
   /src
     /assets
       /images
         sizible-logo.webp
     /components
       /common
       /retailer
       /consumer
     /context
     /hooks
     /pages
     /services
     /styles
     /utils
     App.js
     index.js
   ```

### Implementing Sizible's Brand Theme

1. **Create a theme file**
   ```javascript
   // src/styles/theme.js
   export const theme = {
     colors: {
       primary: '#ff5ea3',     // Sizible pink
       secondary: '#ffffff',   // White
       text: '#333333',        // Dark gray/black
       background: '#f8f9fa',  // Light gray
     },
     typography: {
       fontFamily: {
         primary: "'Poppins', sans-serif",
         secondary: "'Montserrat Alternates', 'Manrope', sans-serif"
       }
     }
   };
   ```

2. **Set up global styles**
   ```javascript
   // src/styles/GlobalStyles.js
   import { createGlobalStyle } from 'styled-components';

   const GlobalStyles = createGlobalStyle`
     @import url('https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap');
     @import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@100;200;300;400;500;600;700;800;900&display=swap');
     @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

     body {
       font-family: ${props => props.theme.typography.fontFamily.primary};
       color: ${props => props.theme.colors.text};
       background-color: ${props => props.theme.colors.background};
       margin: 0;
       padding: 0;
     }

     h1, h2, h3, h4, h5, h6 {
       font-family: ${props => props.theme.typography.fontFamily.primary};
       font-weight: 600;
     }

     button {
       background-color: ${props => props.theme.colors.primary};
       color: white;
       border: none;
       border-radius: 4px;
       padding: 10px 20px;
       cursor: pointer;
       font-family: ${props => props.theme.typography.fontFamily.primary};
       font-weight: 500;
     }
   `;

   export default GlobalStyles;
   ```

3. **Apply theme to the application**
   ```javascript
   // src/index.js
   import React from 'react';
   import ReactDOM from 'react-dom';
   import { ThemeProvider } from 'styled-components';
   import App from './App';
   import { theme } from './styles/theme';
   import GlobalStyles from './styles/GlobalStyles';

   ReactDOM.render(
     <React.StrictMode>
       <ThemeProvider theme={theme}>
         <GlobalStyles />
         <App />
       </ThemeProvider>
     </React.StrictMode>,
     document.getElementById('root')
   );
   ```

### Creating Reusable Sizible UI Components

1. **Sizible Button Component**
   ```javascript
   // src/components/common/SizibleButton.js
   import styled from 'styled-components';

   const SizibleButton = styled.button`
     background-color: ${props => props.theme.colors.primary};
     color: white;
     border: none;
     border-radius: 8px;
     padding: 12px 24px;
     font-family: ${props => props.theme.typography.fontFamily.primary};
     font-weight: 500;
     font-size: 16px;
     cursor: pointer;
     transition: all 0.2s ease-in-out;

     &:hover {
       opacity: 0.9;
       transform: translateY(-2px);
     }

     &:disabled {
       background-color: #ccc;
       cursor: not-allowed;
     }
   `;

   export default SizibleButton;
   ```

2. **Sizible Card Component**
   ```javascript
   // src/components/common/SizibleCard.js
   import styled from 'styled-components';

   const SizibleCard = styled.div`
     background-color: white;
     border-radius: 8px;
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
     padding: 24px;
     margin-bottom: 16px;
   `;

   export default SizibleCard;
   ```

3. **Sizible Navigation Component**
   ```javascript
   // src/components/common/SizibleNavigation.js
   import React from 'react';
   import { Link } from 'react-router-dom';
   import styled from 'styled-components';
   import sizibleLogo from '../../assets/images/sizible-logo.webp';

   const NavContainer = styled.nav`
     background-color: ${props => props.theme.colors.primary};
     padding: 16px 24px;
     display: flex;
     justify-content: space-between;
     align-items: center;
   `;

   const Logo = styled.img`
     height: 40px;
   `;

   const NavLinks = styled.div`
     display: flex;
     gap: 24px;
   `;

   const NavLink = styled(Link)`
     color: white;
     text-decoration: none;
     font-weight: 500;
     
     &:hover {
       text-decoration: underline;
     }
   `;

   const SizibleNavigation = ({ isRetailer = false }) => {
     return (
       <NavContainer>
         <Link to="/">
           <Logo src={sizibleLogo} alt="Sizible Logo" />
         </Link>
         <NavLinks>
           {isRetailer ? (
             <>
               <NavLink to="/retailer/dashboard">Dashboard</NavLink>
               <NavLink to="/retailer/guidance">Guidance</NavLink>
             </>
           ) : (
             <>
               <NavLink to="/consumer">Home</NavLink>
               <NavLink to="/consumer/recommendations">Recommendations</NavLink>
             </>
           )}
         </NavLinks>
       </NavContainer>
     );
   };

   export default SizibleNavigation;
   ```

## Backend Implementation

### Setting Up the Node.js Server

1. **Create server structure**
   ```bash
   mkdir -p backend/src/{routes,controllers,services,data,middleware,utils}
   cd backend
   npm init -y
   npm install express cors dotenv helmet morgan @supabase/supabase-js
   npm install --save-dev nodemon jest supertest
   ```

2. **Configure Express server**
   ```javascript
   // src/server.js
   const express = require('express');
   const cors = require('cors');
   const helmet = require('helmet');
   const morgan = require('morgan');
   const dotenv = require('dotenv');

   // Load environment variables
   dotenv.config();

   // Import routes
   const retailerRoutes = require('./routes/retailerRoutes');
   const consumerRoutes = require('./routes/consumerRoutes');

   // Initialize express app
   const app = express();

   // Middleware
   app.use(cors());
   app.use(helmet());
   app.use(morgan('dev'));
   app.use(express.json());

   // Routes
   app.use('/api/retailer', retailerRoutes);
   app.use('/api/consumer', consumerRoutes);

   // Error handling middleware
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({
       success: false,
       message: 'Internal server error',
       error: process.env.NODE_ENV === 'development' ? err.message : undefined
     });
   });

   // Start server
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });

   module.exports = app;
   ```

### Implementing Supabase Integration

1. **Create Supabase client**
   ```javascript
   // src/utils/supabase.js
   const { createClient } = require('@supabase/supabase-js');

   const supabaseUrl = process.env.SUPABASE_URL;
   const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

   if (!supabaseUrl || !supabaseKey) {
     throw new Error('Missing Supabase environment variables');
   }

   const supabase = createClient(supabaseUrl, supabaseKey);

   module.exports = supabase;
   ```

2. **Create data repositories**
   ```javascript
   // src/data/retailerRepository.js
   const supabase = require('../utils/supabase');

   const retailerRepository = {
     async getById(id) {
       const { data, error } = await supabase
         .from('retailers')
         .select('*')
         .eq('id', id)
         .single();
       
       if (error) throw error;
       return data;
     },
     
     async getByName(retailerName, personalName) {
       const { data, error } = await supabase
         .from('retailers')
         .select('*')
         .eq('retailer_name', retailerName)
         .eq('personal_name', personalName)
         .single();
       
       if (error && error.code !== 'PGRST116') throw error;
       return data;
     },
     
     async create(retailer) {
       const { data, error } = await supabase
         .from('retailers')
         .insert([retailer])
         .select();
       
       if (error) throw error;
       return data[0];
     }
   };

   module.exports = retailerRepository;
   ```

## Database Setup

### Creating Supabase Tables

Execute the following SQL in the Supabase SQL Editor:

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
  color VARCHAR(255),
  pattern VARCHAR(255),
  material VARCHAR(255),
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

### Setting Up Row-Level Security

```sql
-- Enable RLS on tables
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_recommendations ENABLE ROW LEVEL SECURITY;

-- Retailer can only see their own data
CREATE POLICY retailer_isolation ON retailers
  FOR ALL
  USING (auth.uid()::text = id::text);

-- Retailer can only see their own garments
CREATE POLICY retailer_garments ON garments
  FOR ALL
  USING (retailer_id IN (
    SELECT id FROM retailers WHERE auth.uid()::text = id::text
  ));
```

## Testing Implementation

### Unit Testing with Jest

1. **Create test for recommendation service**
   ```javascript
   // tests/services/recommendationService.test.js
   const recommendationService = require('../../src/services/recommendationService');

   describe('RecommendationService', () => {
     it('should generate recommendations based on guidance', async () => {
       // Mock data
       const mockGarment = { id: '123', type: 'dress', color: 'red' };
       const mockGuidance = 'Red dresses pair well with black shoes and gold accessories';
       
       // Mock dependencies
       jest.spyOn(recommendationService, 'processGuidanceText').mockResolvedValue([
         { garmentType: 'shoes', color: 'black', confidence: 0.9 },
         { garmentType: 'accessories', color: 'gold', confidence: 0.8 }
       ]);
       
       // Execute
       const result = await recommendationService.generateRecommendations(
         mockGarment.id,
         mockGuidance
       );
       
       // Assert
       expect(result.recommendations).toHaveLength(2);
       expect(result.recommendations[0].garmentType).toBe('shoes');
       expect(result.recommendations[0].color).toBe('black');
     });
   });
   ```

2. **Create test script in package.json**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch"
     }
   }
   ```

## Deployment

### Frontend Deployment to Vercel

1. **Create a `vercel.json` file**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "build" }
       }
     ],
     "routes": [
       { "handle": "filesystem" },
       { "src": "/.*", "dest": "/index.html" }
     ]
   }
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "build": "react-scripts build",
       "vercel-build": "react-scripts build"
     }
   }
   ```

### Backend Deployment to Heroku

1. **Create a `Procfile`**
   ```
   web: node src/server.js
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "dev": "nodemon src/server.js"
     },
     "engines": {
       "node": "16.x"
     }
   }
   ```

## Next Steps

1. Implement the NLP processing service
2. Develop the size recommendation integration
3. Create comprehensive test suite
4. Set up CI/CD pipeline
5. Implement monitoring and logging

## Resources

- [Sizible Website](https://sizible.com)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [Styled Components Documentation](https://styled-components.com/docs)
