/**
 * Tools & Calculators Page
 * 
 * This page serves as a hub for various tools and calculators available to admin users.
 * It provides access to AI-powered tools and utility calculators for fashion retail operations.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import SizibleNavigation from '../../../components/common/SizibleNavigation';
import SizibleButton from '../../../components/common/SizibleButton';
import SizibleCard from '../../../components/common/SizibleCard';

// Styled components
const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.large};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.medium};
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.large};
  margin-top: ${props => props.theme.spacing.large};
`;

const ToolCard = styled(SizibleCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardContent = styled.div`
  flex-grow: 1;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const ToolIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
  text-align: center;
`;

/**
 * Tools & Calculators Page Component
 * 
 * @returns {JSX.Element} The Tools & Calculators page component
 */
const ToolsCalculatorsPage = () => {
  const navigate = useNavigate();
  
  // Check if admin is authenticated
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <PageHeader>
          <h1>Tools & Calculators</h1>
          <SizibleButton variant="secondary" onClick={handleBack}>
            Back to Dashboard
          </SizibleButton>
        </PageHeader>
        
        <p>
          Welcome to the Tools & Calculators section. Here you'll find a collection of 
          powerful tools to help streamline your fashion retail operations and gain valuable insights.
        </p>
        
        <ToolsGrid>
          <ToolCard>
            <ToolIcon>🤖</ToolIcon>
            <h3 className="card-heading">Sophie - Image Classifier</h3>
            <CardContent>
              <p>
                AI-powered image classification tool that can analyze fashion images and 
                identify garment types, styles, colors, and other attributes.
              </p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton as={Link} to="/admin/tools/sophie-image-classifier" fullWidth>
                Open Sophie
              </SizibleButton>
            </div>
          </ToolCard>
          
          {/* Placeholder for future tools */}
          <ToolCard>
            <ToolIcon>📊</ToolIcon>
            <h3 className="card-heading">Size Calculator</h3>
            <CardContent>
              <p>
                Calculate size recommendations based on measurements and garment specifications.
                Coming soon!
              </p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton fullWidth variant="secondary" disabled>
                Coming Soon
              </SizibleButton>
            </div>
          </ToolCard>
          
          <ToolCard>
            <ToolIcon>🔍</ToolIcon>
            <h3 className="card-heading">Style Analyzer</h3>
            <CardContent>
              <p>
                Analyze fashion styles and trends based on your product catalog data.
                Coming soon!
              </p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton fullWidth variant="secondary" disabled>
                Coming Soon
              </SizibleButton>
            </div>
          </ToolCard>
        </ToolsGrid>
      </PageContainer>
    </>
  );
};

export default ToolsCalculatorsPage;
