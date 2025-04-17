/**
 * Main App Component
 * 
 * This is the root component of the Sizible Fashion Style Advice application.
 * It sets up routing and global providers.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import SizibleNavigation from './components/common/SizibleNavigation';
import SizibleButton from './components/common/SizibleButton';
import SizibleCard from './components/common/SizibleCard';
import MeasurementInput from './components/consumer/MeasurementInput';
import CsvImportPage from './pages/retailer/CsvImportPage';
import ManageProductsPage from './pages/retailer/ManageProductsPage';
import StyleGuidancePage from './pages/retailer/StyleGuidancePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ExcelUploadPage from './pages/admin/ExcelUploadPage';
import styled from 'styled-components';
import axios from 'axios';

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

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: ${props => props.theme.spacing.small};
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

const RetailerLoginPage = () => {
  const [retailerName, setRetailerName] = useState('');
  const [personalName, setPersonalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!retailerName.trim()) {
      setError('Please enter your retailer name');
      return;
    }
    
    if (!personalName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsSubmitting(true);
    
    // For prototype purposes, we'll redirect to dashboard for any input
    setTimeout(() => {
      setIsSubmitting(false);
      setRedirectToDashboard(true);
    }, 1000);
  };
  
  if (redirectToDashboard) {
    return <Navigate to="/retailer/dashboard" />;
  }
  
  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <SizibleCard elevated style={{ maxWidth: '500px', margin: '40px auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Retailer Login</h2>
          
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '20px' 
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="retailerName">Retailer Name</Label>
              <Input 
                id="retailerName"
                type="text"
                value={retailerName}
                onChange={(e) => setRetailerName(e.target.value)}
                placeholder="Enter your retailer name"
                disabled={isSubmitting}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="personalName">Your Name</Label>
              <Input 
                id="personalName"
                type="text"
                value={personalName}
                onChange={(e) => setPersonalName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </FormGroup>
            
            <SizibleButton 
              type="submit" 
              fullWidth 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </SizibleButton>
          </form>
        </SizibleCard>
      </PageContainer>
    </>
  );
};

const RetailerDashboardPage = () => (
  <>
    <SizibleNavigation isRetailer={true} />
    <PageContainer>
      <h1>Retailer Dashboard</h1>
      <p>Welcome to your Sizible retailer dashboard. Manage your products and style guidance here.</p>
      
      <CardGrid>
        <SizibleCard>
          <h3 className="card-heading">Manage Products</h3>
          <p className="card-content">
            Add, edit, and manage your product catalog.
          </p>
          <div className="card-footer">
            <SizibleButton as="a" href="/retailer/products" variant="secondary">View Products</SizibleButton>
          </div>
        </SizibleCard>
        
        <SizibleCard>
          <h3 className="card-heading">Import Data</h3>
          <p className="card-content">
            Import product data from CSV files.
          </p>
          <div className="card-footer">
            <SizibleButton as="a" href="/retailer/import">Import CSV</SizibleButton>
          </div>
        </SizibleCard>
        
        <SizibleCard>
          <h3 className="card-heading">Style Guidance</h3>
          <p className="card-content">
            Create and manage style guidance for your customers.
          </p>
          <div className="card-footer">
            <SizibleButton as="a" href="/retailer/style-guidance" variant="secondary">Manage Guidance</SizibleButton>
          </div>
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
  
  // State for dropdown data
  const [brands, setBrands] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [garmentTypes, setGarmentTypes] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [itemCodes, setItemCodes] = useState([]);
  
  // State for selected values
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [selectedGarmentType, setSelectedGarmentType] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedItemCode, setSelectedItemCode] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default values for dropdowns if API fails
  const defaultBrands = [
    { id: "Joseph Ribkoff", name: "Joseph Ribkoff" },
    { id: "Vero Moda", name: "Vero Moda" },
    { id: "H&M", name: "H&M" }
  ];
  
  const defaultRetailers = [
    { id: "Nordstrom", name: "Nordstrom" },
    { id: "Macy's", name: "Macy's" },
    { id: "Bloomingdale's", name: "Bloomingdale's" }
  ];
  
  const defaultGarmentTypes = [
    { id: "Dress", name: "Dress" },
    { id: "Blouse", name: "Blouse" },
    { id: "Pants", name: "Pants" },
    { id: "Skirt", name: "Skirt" }
  ];
  
  const defaultOccasions = [
    { id: "Casual", name: "Casual" },
    { id: "Formal", name: "Formal" },
    { id: "Business", name: "Business" },
    { id: "Party", name: "Party" },
    { id: "Wedding", name: "Wedding" }
  ];
  
  const defaultItemCodes = [
    { id: "JR-12345", name: "JR-12345 - Black Dress" },
    { id: "JR-67890", name: "JR-67890 - Red Blouse" },
    { id: "VM-54321", name: "VM-54321 - Blue Jeans" }
  ];
  
  // Handle measurement changes
  const handleMeasurementChange = (type, value) => {
    setMeasurements(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Fetch data from the database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        console.log('Fetching dropdown data from API...');
        
        // Fetch brands
        const brandsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/brands`);
        console.log('Brands response:', brandsResponse.data);
        if (brandsResponse.data && brandsResponse.data.brands && brandsResponse.data.brands.length > 0) {
          setBrands(brandsResponse.data.brands);
        } else {
          console.log('Using default brands');
          setBrands(defaultBrands);
        }
        
        // Fetch retailers
        const retailersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/retailers`);
        console.log('Retailers response:', retailersResponse.data);
        if (retailersResponse.data && retailersResponse.data.retailers && retailersResponse.data.retailers.length > 0) {
          setRetailers(retailersResponse.data.retailers);
        } else {
          console.log('Using default retailers');
          setRetailers(defaultRetailers);
        }
        
        // Fetch garment types
        const garmentTypesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/garment-types`);
        console.log('Garment types response:', garmentTypesResponse.data);
        if (garmentTypesResponse.data && garmentTypesResponse.data.garmentTypes && garmentTypesResponse.data.garmentTypes.length > 0) {
          setGarmentTypes(garmentTypesResponse.data.garmentTypes);
        } else {
          console.log('Using default garment types');
          setGarmentTypes(defaultGarmentTypes);
        }
        
        // Fetch occasions
        const occasionsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/occasions`);
        console.log('Occasions response:', occasionsResponse.data);
        if (occasionsResponse.data && occasionsResponse.data.occasions && occasionsResponse.data.occasions.length > 0) {
          setOccasions(occasionsResponse.data.occasions);
        } else {
          console.log('Using default occasions');
          setOccasions(defaultOccasions);
        }
        
        // Fetch item codes
        const itemCodesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/item-codes`);
        console.log('Item codes response:', itemCodesResponse.data);
        if (itemCodesResponse.data && itemCodesResponse.data.itemCodes && itemCodesResponse.data.itemCodes.length > 0) {
          setItemCodes(itemCodesResponse.data.itemCodes);
        } else {
          console.log('Using default item codes');
          setItemCodes(defaultItemCodes);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
        setError('Failed to load dropdown options. Using default values.');
        
        // Set defaults if API fails
        setBrands(defaultBrands);
        setRetailers(defaultRetailers);
        setGarmentTypes(defaultGarmentTypes);
        setOccasions(defaultOccasions);
        setItemCodes(defaultItemCodes);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle dropdown selection changes
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };
  
  const handleRetailerChange = (e) => {
    setSelectedRetailer(e.target.value);
  };
  
  const handleGarmentTypeChange = (e) => {
    setSelectedGarmentType(e.target.value);
  };
  
  const handleOccasionChange = (e) => {
    setSelectedOccasion(e.target.value);
  };
  
  const handleItemCodeChange = (e) => {
    setSelectedItemCode(e.target.value);
  };

  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <SizibleCard elevated style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>Find Your Perfect Size</h1>
          <p>Enter your measurements and preferences to get personalized size recommendations.</p>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '15px' }}>
              {error}
            </div>
          )}
          
          <form>
            <FormSection>
              <SectionTitle>1. Select Your Preferences</SectionTitle>
              
              <div>
                <label htmlFor="brand">Select Brand</label>
                <select 
                  id="brand" 
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  disabled={loading}
                >
                  <option value="">-- Select a brand --</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="retailer">Select Retailer</label>
                <select 
                  id="retailer" 
                  value={selectedRetailer}
                  onChange={handleRetailerChange}
                  disabled={loading}
                >
                  <option value="">-- Select a retailer --</option>
                  {retailers.map(retailer => (
                    <option key={retailer.id} value={retailer.id}>{retailer.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="garmentType">Garment Type</label>
                <select 
                  id="garmentType" 
                  value={selectedGarmentType}
                  onChange={handleGarmentTypeChange}
                  disabled={loading}
                >
                  <option value="">-- Select garment type --</option>
                  {garmentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="occasion">Occasion</label>
                <select 
                  id="occasion" 
                  value={selectedOccasion}
                  onChange={handleOccasionChange}
                  disabled={loading}
                >
                  <option value="">-- Select occasion --</option>
                  {occasions.map(occasion => (
                    <option key={occasion.id} value={occasion.id}>{occasion.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="itemCode">Unique Identifier (FE_Item_Code)</label>
                <select 
                  id="itemCode" 
                  value={selectedItemCode}
                  onChange={handleItemCodeChange}
                  disabled={loading}
                >
                  <option value="">-- Select item code --</option>
                  {itemCodes.map(code => (
                    <option key={code.id} value={code.id}>{code.name}</option>
                  ))}
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
          <Route path="/retailer/import" element={<CsvImportPage />} />
          <Route path="/retailer/products" element={<ManageProductsPage />} />
          <Route path="/retailer/style-guidance" element={<StyleGuidancePage />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/excel-upload" element={<ExcelUploadPage />} />
          
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