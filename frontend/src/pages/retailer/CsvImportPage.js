/**
 * CSV Import Page
 * 
 * This page allows retailers to import garment data from CSV files.
 * It includes instructions, a file upload form, and displays import results.
 */

import React from 'react';
import styled from 'styled-components';
import SizibleNavigation from '../../components/common/SizibleNavigation';
import CsvImportForm from '../../components/retailer/CsvImportForm';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const InstructionsCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.large};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.theme.spacing.large};
`;

const InstructionsTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
`;

const InstructionsList = styled.ol`
  padding-left: ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.medium};
  
  li {
    margin-bottom: ${props => props.theme.spacing.small};
  }
`;

const SampleLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
  
  &:hover {
    text-decoration: none;
  }
`;

/**
 * CSV Import Page Component
 * 
 * @returns {JSX.Element} The CSV import page
 */
const CsvImportPage = () => {
  return (
    <>
      <SizibleNavigation isRetailer={true} />
      <PageContainer>
        <PageHeader>
          <h1>Import Garment Data</h1>
          <p>Upload your garment catalog data using CSV files</p>
        </PageHeader>
        
        <InstructionsCard>
          <InstructionsTitle>CSV Import Instructions</InstructionsTitle>
          <p>Follow these steps to import your garment data:</p>
          
          <InstructionsList>
            <li>Prepare your CSV file with the required columns (see format below)</li>
            <li>Select your retailer and brand from the dropdown menus</li>
            <li>Choose your CSV file using the file selector</li>
            <li>Click the "Import CSV" button to upload and process your data</li>
            <li>Review the import results for any errors or warnings</li>
          </InstructionsList>
          
          <p><strong>Required CSV Format:</strong></p>
          <p>Your CSV file must include the following columns:</p>
          <ul>
            <li><strong>fe_item_code</strong> - Unique identifier for each garment (required)</li>
            <li><strong>name</strong> - Garment name (required)</li>
            <li><strong>description</strong> - Garment description</li>
            <li><strong>price</strong> - Price in decimal format (e.g., 129.99)</li>
            <li><strong>color</strong> - Color name</li>
            <li><strong>material</strong> - Material description</li>
            <li><strong>season</strong> - Season (e.g., Spring, Summer, Fall, Winter, All Season)</li>
            <li><strong>year</strong> - Year as a number (e.g., 2025)</li>
            <li><strong>available_sizes</strong> - Comma-separated list of sizes (e.g., "S,M,L,XL")</li>
            <li><strong>stock_status</strong> - Stock status (e.g., In Stock, Limited Stock, Out of Stock)</li>
            <li><strong>garment_type</strong> - Type of garment (e.g., Dress, Top, Pants)</li>
            <li><strong>is_active</strong> - Whether the garment is active (true/false)</li>
          </ul>
          
          <p>
            <SampleLink href="/database/sample_garments.csv" download>
              Download Sample CSV
            </SampleLink>
          </p>
        </InstructionsCard>
        
        <CsvImportForm />
      </PageContainer>
    </>
  );
};

export default CsvImportPage;
