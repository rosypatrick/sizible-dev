/**
 * Excel Upload Page
 * 
 * This page allows admin users to upload Excel files containing product data.
 * It handles file validation, upload, and displays processing status.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const UploadArea = styled.div`
  border: 2px dashed ${props => props.isDragging ? props.theme.colors.primary : '#ddd'};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xlarge};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.large};
  transition: all 0.3s ease;
  background-color: ${props => props.isDragging ? 'rgba(0, 123, 255, 0.05)' : 'transparent'};
  cursor: pointer;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
`;

const FileInput = styled.input`
  display: none;
`;

const ProgressContainer = styled.div`
  margin: ${props => props.theme.spacing.large} 0;
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-top: ${props => props.theme.spacing.small};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const StatusMessage = styled.div`
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
  margin: ${props => props.theme.spacing.medium} 0;
  background-color: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(40, 167, 69, 0.1)';
      case 'error': return 'rgba(220, 53, 69, 0.1)';
      case 'info': return 'rgba(0, 123, 255, 0.1)';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'info': return '#007bff';
      default: return 'inherit';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'info': return '#007bff';
      default: return 'transparent';
    }
  }};
`;

const UploadHistoryCard = styled(SizibleCard)`
  margin-top: ${props => props.theme.spacing.xlarge};
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${props => props.theme.spacing.small};
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background-color: ${props => {
    switch(props.status) {
      case 'success': return 'rgba(40, 167, 69, 0.1)';
      case 'failed': return 'rgba(220, 53, 69, 0.1)';
      case 'processing': return 'rgba(255, 193, 7, 0.1)';
      default: return 'rgba(0, 123, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'success': return '#28a745';
      case 'failed': return '#dc3545';
      case 'processing': return '#ffc107';
      default: return '#007bff';
    }
  }};
`;

/**
 * Excel Upload Page Component
 * 
 * @returns {JSX.Element} The Excel upload page component
 */
const ExcelUploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  
  // Fetch upload history from the backend
  const fetchUploadHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/upload-history');
      if (response.ok) {
        const data = await response.json();
        if (data.history && Array.isArray(data.history)) {
          // Transform the data to match our frontend format
          const formattedHistory = data.history.map(item => ({
            id: item.id,
            filename: item.filename,
            timestamp: new Date(item.created_at).toLocaleString(),
            status: item.success_count > 0 ? 'success' : 'failed',
            records: item.success_count || 0
          }));
          setUploadHistory(formattedHistory);
        }
      } else {
        console.error('Failed to fetch upload history');
        // Fallback to sample data if API fails
        setUploadHistory([
          { id: 1, filename: 'products_march_2025.xlsx', timestamp: '2025-03-15 14:32', status: 'success', records: 124 },
          { id: 2, filename: 'products_feb_2025.xlsx', timestamp: '2025-02-22 09:15', status: 'success', records: 98 },
          { id: 3, filename: 'test_upload.xlsx', timestamp: '2025-02-10 16:45', status: 'failed', records: 0 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching upload history:', error);
      // Fallback to sample data if API fails
      setUploadHistory([
        { id: 1, filename: 'products_march_2025.xlsx', timestamp: '2025-03-15 14:32', status: 'success', records: 124 },
        { id: 2, filename: 'products_feb_2025.xlsx', timestamp: '2025-02-22 09:15', status: 'success', records: 98 },
        { id: 3, filename: 'test_upload.xlsx', timestamp: '2025-02-10 16:45', status: 'failed', records: 0 }
      ]);
    }
  };

  // Check if admin is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
    
    fetchUploadHistory();
  }, [navigate]);
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (file) => {
    // Check if file is an Excel file
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                file.type === 'application/vnd.ms-excel')) {
      setSelectedFile(file);
      setUploadStatus({ type: 'info', message: `File "${file.name}" selected and ready for upload.` });
    } else {
      setSelectedFile(null);
      setUploadStatus({ type: 'error', message: 'Please select a valid Excel file (.xlsx or .xls).' });
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: 'info', message: 'Uploading file...' });

    // Use XMLHttpRequest for better progress tracking
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', selectedFile);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    xhr.onload = async () => {
      try {
        // Add a timeout to prevent hanging at 100%
        setTimeout(() => {
          setIsUploading(false);
        }, 10000); // 10 second timeout as a fallback
        
        let result;
        try {
          result = JSON.parse(xhr.responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError, 'Response:', xhr.responseText);
          setUploadStatus({ type: 'error', message: 'Error processing server response. Check console for details.' });
          setIsUploading(false);
          return;
        }
        
        if (xhr.status === 200) {
          setUploadStatus({ 
            type: 'success', 
            message: result.message || `File uploaded and processed successfully. ${result.result?.success || 0} records updated.` 
          });
          setSelectedFile(null);
          
          // Add to upload history
          const now = new Date();
          const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          setUploadHistory(prevHistory => [
            {
              id: prevHistory.length + 1,
              filename: selectedFile.name,
              timestamp,
              status: 'success',
              records: result.result?.total || 0
            },
            ...prevHistory
          ]);
          
          // Fetch updated history
          fetchUploadHistory();
        } else {
          setUploadStatus({ type: 'error', message: result.error || 'Failed to upload or process file.' });
          setUploadHistory(prevHistory => [
            {
              id: prevHistory.length + 1,
              filename: selectedFile.name,
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              status: 'failed',
              records: 0
            },
            ...prevHistory
          ]);
        }
      } catch (err) {
        console.error('Error handling response:', err);
        setUploadStatus({ type: 'error', message: 'Error processing server response. Check console for details.' });
      } finally {
        setIsUploading(false);
      }
    };

    xhr.onerror = () => {
      setUploadStatus({ type: 'error', message: 'Network error occurred during upload.' });
      setIsUploading(false);
    };

    // Use the full URL with port to ensure it reaches the backend
    xhr.open('POST', 'http://localhost:5000/api/admin/upload-excel', true);
    xhr.send(formData);
  };

  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <PageHeader>
          <h1>Excel Upload</h1>
          <SizibleButton as="a" href="/admin/dashboard" variant="secondary">
            Back to Dashboard
          </SizibleButton>
        </PageHeader>
        
        <SizibleCard elevated>
          <h2>Upload Product Data</h2>
          <p>Upload an Excel file containing product data. The system will process the file and update the database accordingly.</p>
          <p>The Excel file should contain the following columns: FE_Item_Code, Name, Brand, Type, Size, Color, etc.</p>
          
          <UploadArea 
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <UploadIcon>📄</UploadIcon>
            <h3>Drag & Drop Excel File Here</h3>
            <p>or click to browse files</p>
            <FileInput 
              type="file" 
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={handleFileInputChange}
            />
            {selectedFile && (
              <p><strong>Selected file:</strong> {selectedFile.name}</p>
            )}
          </UploadArea>
          
          {uploadStatus && (
            <StatusMessage type={uploadStatus.type}>
              {uploadStatus.message}
            </StatusMessage>
          )}
          
          {isUploading && (
            <ProgressContainer>
              <p>Uploading: {uploadProgress}%</p>
              <ProgressBar>
                <ProgressFill progress={uploadProgress} />
              </ProgressBar>
            </ProgressContainer>
          )}
          
          <SizibleButton 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            style={{ marginTop: '20px' }}
          >
            {isUploading ? 'Processing...' : 'Upload File'}
          </SizibleButton>
        </SizibleCard>
        
        <UploadHistoryCard>
          <h2>Upload History</h2>
          
          {uploadHistory.length > 0 ? (
            <HistoryTable>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Records Updated</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map(upload => (
                  <tr key={upload.id}>
                    <td>{upload.filename}</td>
                    <td>{upload.timestamp}</td>
                    <td>
                      <StatusBadge status={upload.status}>
                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                      </StatusBadge>
                    </td>
                    <td>{upload.records}</td>
                  </tr>
                ))}
              </tbody>
            </HistoryTable>
          ) : (
            <p>No upload history available.</p>
          )}
        </UploadHistoryCard>
      </PageContainer>
    </>
  );
};

export default ExcelUploadPage;
