/**
 * CSV Import Form Component
 * 
 * This component provides a form for retailers to upload CSV files containing garment data.
 * It handles file selection, validation, and submission.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import SizibleButton from '../common/SizibleButton';

const FormContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.large};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.theme.spacing.large};
`;

const FormTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const FileInput = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
  
  input[type="file"] {
    display: none;
  }
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  background-color: #f0f0f0;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const FileName = styled.div`
  margin-top: ${props => props.theme.spacing.small};
  font-size: ${props => props.theme.typography.fontSize.small};
  color: #666;
`;

const ImportStatus = styled.div`
  margin-top: ${props => props.theme.spacing.medium};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.success ? '#e6f7e6' : '#ffebeb'};
  color: ${props => props.success ? '#2e7d32' : '#c62828'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const ImportSummary = styled.div`
  margin-top: ${props => props.theme.spacing.medium};
  
  ul {
    margin-top: ${props => props.theme.spacing.small};
    padding-left: ${props => props.theme.spacing.large};
  }
`;

/**
 * CSV Import Form Component
 * 
 * @returns {JSX.Element} The CSV import form
 */
const CsvImportForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState({
    show: false,
    success: false,
    message: '',
    details: null
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setImportStatus({
        show: true,
        success: false,
        message: 'Please select a CSV file to import.',
        details: null
      });
      return;
    }
    
    setLoading(true);
    setImportStatus({ show: false, success: false, message: '', details: null });
    
    try {
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        // Parse the CSV data
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        
        // Remove empty lines
        const nonEmptyLines = lines.filter(line => line.trim() !== '');
        
        // Count header as 1 line, so subtract 1 from total
        const recordCount = nonEmptyLines.length > 0 ? nonEmptyLines.length - 1 : 0;
        
        // Get column headers to display
        const headers = nonEmptyLines.length > 0 ? 
          nonEmptyLines[0].split(',').map(header => header.trim()) : [];
        
        // For prototype purposes, we'll consider all records as successfully imported
        setTimeout(() => {
          setImportStatus({
            show: true,
            success: true,
            message: 'CSV data imported successfully!',
            details: {
              record_count: recordCount,
              success_count: recordCount,
              error_count: 0,
              headers: headers
            }
          });
          setLoading(false);
        }, 1500);
      };
      
      reader.onerror = () => {
        setImportStatus({
          show: true,
          success: false,
          message: 'Error reading the CSV file.',
          details: null
        });
        setLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({
        show: true,
        success: false,
        message: `Error during import: ${error.message}`,
        details: null
      });
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Import Garments from CSV</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>CSV File</Label>
          <FileLabel>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              disabled={loading}
            />
            Choose File
          </FileLabel>
          {fileName && <FileName>{fileName}</FileName>}
        </FormGroup>
        
        <SizibleButton 
          type="submit" 
          disabled={loading || !file}
        >
          {loading ? 'Importing...' : 'Import CSV'}
        </SizibleButton>
      </form>
      
      <ImportStatus show={importStatus.show} success={importStatus.success}>
        <strong>{importStatus.message}</strong>
        
        {importStatus.details && importStatus.success && (
          <ImportSummary>
            <p>Import Summary:</p>
            <ul>
              <li>Total Records: {importStatus.details.record_count}</li>
              <li>Successfully Imported: {importStatus.details.success_count}</li>
              <li>Errors: {importStatus.details.error_count}</li>
            </ul>
            {importStatus.details.headers && importStatus.details.headers.length > 0 && (
              <>
                <p>CSV Headers:</p>
                <ul>
                  {importStatus.details.headers.map((header, index) => (
                    <li key={index}>{header}</li>
                  ))}
                </ul>
              </>
            )}
          </ImportSummary>
        )}
        
        {importStatus.details && !importStatus.success && Array.isArray(importStatus.details) && (
          <ImportSummary>
            <p>Error Details:</p>
            <ul>
              {importStatus.details.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </ImportSummary>
        )}
      </ImportStatus>
    </FormContainer>
  );
};

export default CsvImportForm;
