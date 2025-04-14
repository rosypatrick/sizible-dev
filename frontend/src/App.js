/**
 * Main App Component
 * 
 * This is the root component of the Sizible Fashion Style Advice application.
 * It sets up routing and global providers.
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import SizibleNavigation from './components/common/SizibleNavigation';
import SizibleButton from './components/common/SizibleButton';
import SizibleCard from './components/common/SizibleCard';
import MeasurementInput from './components/consumer/MeasurementInput';
import styled from 'styled-components';

// Styled components for the pages
const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.xlarge};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.large};
  margin-top: ${props => props.theme.spacing.xlarge};
`;

const AboutSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xlarge};
`;

const AboutImage = styled.img`
  width: 100%;
  max-width: 600px;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin: ${props => props.theme.spacing.large} 0;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${props => props.theme.spacing.medium} 0;
  
  li {
    margin-bottom: ${props => props.theme.spacing.medium};
    padding-left: ${props => props.theme.spacing.medium};
    position: relative;
    
    &:before {
      content: "✓";
      color: ${props => props.theme.colors.primary};
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.large};
  margin: ${props => props.theme.spacing.large} 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormDivider = styled.div`
  border-top: 1px solid #eee;
  margin: ${props => props.theme.spacing.large} 0;
  padding-top: ${props => props.theme.spacing.medium};
`;

const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const SectionTitle = styled.h4`
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
`;

// Placeholder pages with Sizible styling
const HomePage = () => (
  <>
    <SizibleNavigation />
    <PageContainer>
      <HeroSection>
        <h1>Sizible Fashion Style Advice</h1>
        <p>Personalized size and style recommendations for fashion retailers and consumers</p>
        <SizibleButton as="a" href="/consumer" size="large" style={{ marginTop: '20px' }}>
          Get Started
        </SizibleButton>
      </HeroSection>
      
      <h2>How It Works</h2>
      <CardGrid>
        <SizibleCard>
          <h3 className="card-heading">For Retailers</h3>
          <p className="card-content">
            Already a Sizible customer? Provide guidance and direction to your customers when they use our sizing tool.
          </p>
          <div className="card-footer">
            <SizibleButton as="a" href="/retailer/login" variant="secondary">Retailer Login</SizibleButton>
          </div>
        </SizibleCard>
        
        <SizibleCard>
          <h3 className="card-heading">For Consumers</h3>
          <p className="card-content">
            Receive personalized size recommendations and complementary style suggestions.
          </p>
          <div className="card-footer">
            <SizibleButton as="a" href="/consumer">Find Your Style</SizibleButton>
          </div>
        </SizibleCard>
        
        <SizibleCard>
          <h3 className="card-heading">Smart Recommendations</h3>
          <p className="card-content">
            Our AI-powered system translates retailer guidance into personalized recommendations.
          </p>
          <div className="card-footer">
            <SizibleButton as="a" href="/about" variant="secondary">Learn More</SizibleButton>
          </div>
        </SizibleCard>
      </CardGrid>
    </PageContainer>
  </>
);

const AboutPage = () => (
  <>
    <SizibleNavigation />
    <PageContainer>
      <HeroSection>
        <h1>About Sizible</h1>
        <p>AI driven eCommerce plugin to reduce consumer returns</p>
      </HeroSection>
      
      <AboutSection>
        <h2>Our Mission</h2>
        <p>
          At Sizible, we're on a mission to solve the sizing problem in fashion eCommerce. 
          We help retailers reduce returns, increase conversion rates, and improve customer satisfaction 
          through our innovative AI-driven sizing solution.
        </p>
      </AboutSection>
      
      <AboutSection>
        <h2>The Problem We Solve</h2>
        <p>
          The fashion industry faces significant challenges with online shopping returns:
        </p>
        <FeatureList>
          <li>Up to 40% of all online fashion purchases are returned</li>
          <li>Wrong size is the #1 reason for returns</li>
          <li>Returns cost retailers billions annually in lost revenue</li>
          <li>Environmental impact of shipping and processing returns is substantial</li>
        </FeatureList>
      </AboutSection>
      
      <TwoColumnGrid>
        <div>
          <h2>Our Solution</h2>
          <p>
            Sizible provides an AI-driven sizing solution that helps consumers find their perfect fit 
            when shopping online. Our technology integrates seamlessly with eCommerce platforms to:
          </p>
          <FeatureList>
            <li>Provide accurate size recommendations based on customer data</li>
            <li>Reduce return rates by up to 50%</li>
            <li>Increase conversion rates by improving customer confidence</li>
            <li>Enhance the overall shopping experience</li>
          </FeatureList>
        </div>
        <div>
          <AboutImage src="/sizible-logo.webp" alt="Sizible Technology" />
        </div>
      </TwoColumnGrid>
      
      <AboutSection>
        <h2>How It Works</h2>
        <p>
          Our AI-powered technology analyzes multiple data points to provide personalized size recommendations:
        </p>
        <FeatureList>
          <li>Customer preferences and previous purchases</li>
          <li>Detailed garment specifications from retailers</li>
          <li>Brand-specific sizing variations</li>
          <li>Style and fit considerations</li>
        </FeatureList>
        <p>
          Retailers can enhance these recommendations by providing style advice and promotional guidance 
          through our intuitive interface, creating a comprehensive shopping experience for their customers.
        </p>
      </AboutSection>
      
      <SizibleCard elevated style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 className="card-heading">Ready to Transform Your Fashion eCommerce Experience?</h2>
        <p className="card-content">
          Join the growing number of retailers using Sizible to reduce returns and increase customer satisfaction.
        </p>
        <div className="card-footer" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <SizibleButton as="a" href="/retailer/login">Retailer Login</SizibleButton>
          <SizibleButton as="a" href="/consumer" variant="secondary">Try It Now</SizibleButton>
        </div>
      </SizibleCard>
    </PageContainer>
  </>
);

const RetailerLoginPage = () => (
  <>
    <SizibleNavigation />
    <PageContainer>
      <SizibleCard elevated style={{ maxWidth: '500px', margin: '40px auto' }}>
        <h2 className="card-heading">Retailer Login</h2>
        <form>
          <div>
            <label htmlFor="retailerName">Retailer Name</label>
            <input id="retailerName" type="text" placeholder="Enter your business name" />
          </div>
          <div>
            <label htmlFor="personalName">Personal Name</label>
            <input id="personalName" type="text" placeholder="Enter your name" />
          </div>
          <SizibleButton type="submit" fullWidth style={{ marginTop: '20px' }}>
            Login
          </SizibleButton>
        </form>
      </SizibleCard>
    </PageContainer>
  </>
);

const RetailerDashboardPage = () => (
  <>
    <SizibleNavigation isRetailer={true} />
    <PageContainer>
      <h1>Retailer Dashboard</h1>
      <p>Welcome to your Sizible dashboard. Manage your inventory and style guidance here.</p>
      
      <CardGrid>
        <SizibleCard>
          <h3 className="card-heading">Inventory</h3>
          <p className="card-content">Manage your garment inventory</p>
          <SizibleButton>View Inventory</SizibleButton>
        </SizibleCard>
        
        <SizibleCard>
          <h3 className="card-heading">Style Guidance</h3>
          <p className="card-content">Provide style advice for your customers</p>
          <SizibleButton>Add Guidance</SizibleButton>
        </SizibleCard>
        
        <SizibleCard>
          <h3 className="card-heading">Analytics</h3>
          <p className="card-content">View recommendation performance</p>
          <SizibleButton>View Analytics</SizibleButton>
        </SizibleCard>
      </CardGrid>
    </PageContainer>
  </>
);

const ConsumerHomePage = () => {
  const [measurements, setMeasurements] = useState({
    bust: 90,
    waist: 70,
    hips: 100
  });
  
  const handleMeasurementChange = (type, value) => {
    setMeasurements(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <h1>Find Your Perfect Style</h1>
        <p>Get personalized size and style recommendations from your favorite retailers.</p>
        
        <SizibleCard style={{ maxWidth: '600px', margin: '40px auto' }}>
          <h3 className="card-heading">Get Started</h3>
          <form>
            <FormSection>
              <SectionTitle>1. Select Your Retailer</SectionTitle>
              <div>
                <label htmlFor="retailer">Select Retailer</label>
                <select id="retailer">
                  <option value="">-- Select a retailer --</option>
                  <option value="1">Fashion Boutique</option>
                  <option value="2">Style Haven</option>
                  <option value="3">Trend Setters</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="brand">Select Brand</label>
                <select id="brand">
                  <option value="">-- Select a brand --</option>
                  <option value="1">Joseph Ribkoff</option>
                  <option value="2">Betty Barclay</option>
                  <option value="3">Frank Lyman</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="garmentType">Garment Type</label>
                <select id="garmentType">
                  <option value="">-- Select garment type --</option>
                  <option value="dress">Dress</option>
                  <option value="top">Top</option>
                  <option value="pants">Pants</option>
                  <option value="skirt">Skirt</option>
                </select>
              </div>
            </FormSection>
            
            <FormDivider />
            
            <FormSection>
              <SectionTitle>2. Enter Your Measurements</SectionTitle>
              <p>Drag the sliders or enter your measurements directly.</p>
              
              <MeasurementInput 
                label="Bust" 
                value={measurements.bust} 
                onChange={(value) => handleMeasurementChange('bust', value)} 
                min={60}
                max={150}
              />
              
              <MeasurementInput 
                label="Waist" 
                value={measurements.waist} 
                onChange={(value) => handleMeasurementChange('waist', value)} 
                min={50}
                max={140}
              />
              
              <MeasurementInput 
                label="Hips" 
                value={measurements.hips} 
                onChange={(value) => handleMeasurementChange('hips', value)} 
                min={70}
                max={160}
              />
            </FormSection>
            
            <SizibleButton type="submit" fullWidth style={{ marginTop: '20px' }}>
              Get Recommendations
            </SizibleButton>
          </form>
        </SizibleCard>
      </PageContainer>
    </>
  );
};

const NotFoundPage = () => (
  <>
    <SizibleNavigation />
    <PageContainer>
      <SizibleCard elevated style={{ textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <SizibleButton as="a" href="/">Return to Home</SizibleButton>
      </SizibleCard>
    </PageContainer>
  </>
);

/**
 * App component - the main application component
 * 
 * @returns {JSX.Element} The App component
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Retailer routes */}
          <Route path="/retailer/login" element={<RetailerLoginPage />} />
          <Route path="/retailer/dashboard" element={<RetailerDashboardPage />} />
          
          {/* Consumer routes */}
          <Route path="/consumer" element={<ConsumerHomePage />} />
          
          {/* Fallback routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;