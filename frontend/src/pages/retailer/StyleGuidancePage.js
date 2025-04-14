/**
 * Style Guidance Page
 * 
 * This page allows retailers to create and manage style guidance for their products.
 * It includes a form for adding natural language style advice and promotion preferences.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import SizibleNavigation from '../../components/common/SizibleNavigation';
import SizibleButton from '../../components/common/SizibleButton';
import SizibleCard from '../../components/common/SizibleCard';

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

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const GuidanceList = styled.div`
  margin-top: ${props => props.theme.spacing.large};
`;

const GuidanceItem = styled.div`
  padding: ${props => props.theme.spacing.medium};
  border: 1px solid #eee;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: ${props => props.theme.spacing.medium};
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const GuidanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const GuidanceTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const GuidanceActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};
`;

const GuidanceContent = styled.div`
  margin-top: ${props => props.theme.spacing.small};
  
  p {
    margin: ${props => props.theme.spacing.small} 0;
  }
`;

const GuidanceMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.small};
  font-size: ${props => props.theme.typography.fontSize.small};
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xsmall};
`;

const TabContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const TabButton = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : 'inherit'};
  font-weight: ${props => props.active ? props.theme.typography.fontWeight.medium : props.theme.typography.fontWeight.regular};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const InfoBox = styled.div`
  background-color: #f0f7ff;
  border-left: 4px solid #1976d2;
  padding: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
`;

/**
 * Sample guidance data for demonstration
 */
const sampleGuidance = [
  {
    id: 1,
    title: 'Summer Collection Style Advice',
    productType: 'Dress',
    content: 'Our summer dresses are designed for both comfort and style. Recommend pairing with light accessories and sandals for a casual day look, or dress up with heels and statement jewelry for evening events. These dresses are perfect for customers looking for versatile pieces that transition well from day to night.',
    target: 'All Customers',
    createdAt: '2025-03-15'
  },
  {
    id: 2,
    title: 'Formal Wear Recommendations',
    productType: 'Evening Gown',
    content: 'Our evening gowns are crafted with premium fabrics and attention to detail. For customers with hourglass figures, recommend styles with defined waistlines. For athletic builds, suggest gowns with ruching or embellishments at the waist to create curves. All our formal wear includes built-in support, eliminating the need for uncomfortable undergarments.',
    target: 'Formal Events',
    createdAt: '2025-03-20'
  },
  {
    id: 3,
    title: 'Casual Wear Styling Tips',
    productType: 'Top',
    content: 'Our casual tops are designed with everyday comfort in mind. For customers who prefer a relaxed fit, recommend our oversized styles. For those who like to highlight their figure, suggest our fitted options with stretch fabric. These tops pair well with both jeans and skirts, making them versatile additions to any wardrobe.',
    target: 'Casual Shoppers',
    createdAt: '2025-04-01'
  }
];

/**
 * StyleGuidancePage Component
 * 
 * @returns {JSX.Element} The style guidance page component
 */
const StyleGuidancePage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [guidance, setGuidance] = useState(sampleGuidance);
  
  // Form state
  const [title, setTitle] = useState('');
  const [productType, setProductType] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new guidance
    const newGuidance = {
      id: guidance.length + 1,
      title,
      productType,
      content,
      target,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Add to guidance list
    setGuidance([newGuidance, ...guidance]);
    
    // Reset form
    setTitle('');
    setProductType('');
    setContent('');
    setTarget('');
    
    // Switch to view tab
    setActiveTab('view');
  };
  
  // Handle guidance deletion
  const handleDelete = (id) => {
    setGuidance(guidance.filter(item => item.id !== id));
  };
  
  return (
    <>
      <SizibleNavigation isRetailer={true} />
      <PageContainer>
        <PageHeader>
          <h1>Style Guidance</h1>
        </PageHeader>
        
        <SizibleCard elevated>
          <TabContainer>
            <TabButtons>
              <TabButton 
                active={activeTab === 'create'} 
                onClick={() => setActiveTab('create')}
              >
                Create Guidance
              </TabButton>
              <TabButton 
                active={activeTab === 'view'} 
                onClick={() => setActiveTab('view')}
              >
                View Guidance
              </TabButton>
            </TabButtons>
            
            <TabContent active={activeTab === 'create'}>
              <InfoBox>
                <strong>Style Guidance Tips:</strong>
                <p>Provide natural language style advice and promotion preferences to guide your customers. This will be shown to customers when they use the Sizible sizing tool.</p>
                <p>Be specific about body types, occasions, and styling suggestions to help customers make confident purchasing decisions.</p>
              </InfoBox>
              
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="title">Guidance Title</Label>
                  <Input 
                    id="title"
                    type="text"
                    placeholder="E.g., Summer Collection Style Advice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="productType">Product Type</Label>
                  <Select 
                    id="productType"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    required
                  >
                    <option value="">-- Select Product Type --</option>
                    <option value="Dress">Dress</option>
                    <option value="Top">Top</option>
                    <option value="Pants">Pants</option>
                    <option value="Skirt">Skirt</option>
                    <option value="Evening Gown">Evening Gown</option>
                    <option value="All Products">All Products</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="target">Target Customer</Label>
                  <Select 
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    required
                  >
                    <option value="">-- Select Target --</option>
                    <option value="All Customers">All Customers</option>
                    <option value="Formal Events">Formal Events</option>
                    <option value="Casual Shoppers">Casual Shoppers</option>
                    <option value="Plus Size">Plus Size</option>
                    <option value="Petite">Petite</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="content">Style Guidance</Label>
                  <Textarea 
                    id="content"
                    placeholder="Provide detailed style advice, fit information, and recommendations..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </FormGroup>
                
                <SizibleButton type="submit">
                  Save Guidance
                </SizibleButton>
              </form>
            </TabContent>
            
            <TabContent active={activeTab === 'view'}>
              <GuidanceList>
                {guidance.length > 0 ? (
                  guidance.map(item => (
                    <GuidanceItem key={item.id}>
                      <GuidanceHeader>
                        <GuidanceTitle>{item.title}</GuidanceTitle>
                        <GuidanceActions>
                          <SizibleButton 
                            variant="secondary" 
                            size="small"
                            onClick={() => {
                              setTitle(item.title);
                              setProductType(item.productType);
                              setContent(item.content);
                              setTarget(item.target);
                              setActiveTab('create');
                            }}
                          >
                            Edit
                          </SizibleButton>
                          <SizibleButton 
                            variant="danger" 
                            size="small"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </SizibleButton>
                        </GuidanceActions>
                      </GuidanceHeader>
                      
                      <GuidanceContent>
                        <p>{item.content}</p>
                      </GuidanceContent>
                      
                      <GuidanceMeta>
                        <MetaItem>
                          <strong>Type:</strong> {item.productType}
                        </MetaItem>
                        <MetaItem>
                          <strong>Target:</strong> {item.target}
                        </MetaItem>
                        <MetaItem>
                          <strong>Created:</strong> {item.createdAt}
                        </MetaItem>
                      </GuidanceMeta>
                    </GuidanceItem>
                  ))
                ) : (
                  <p>No style guidance created yet. Switch to the "Create Guidance" tab to add some.</p>
                )}
              </GuidanceList>
            </TabContent>
          </TabContainer>
        </SizibleCard>
      </PageContainer>
    </>
  );
};

export default StyleGuidancePage;
