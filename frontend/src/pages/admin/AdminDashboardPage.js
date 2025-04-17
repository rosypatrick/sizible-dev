/**
 * Admin Dashboard Page
 * 
 * This page serves as the main dashboard for admin users.
 * It provides an overview of system statistics and navigation to different admin sections.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import SizibleNavigation from '../../components/common/SizibleNavigation';
import SizibleButton from '../../components/common/SizibleButton';
import SizibleCard from '../../components/common/SizibleCard';
import axios from 'axios';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const StatCard = styled(SizibleCard)`
  text-align: center;
  padding: ${props => props.theme.spacing.medium};
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.small};
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.large};
  margin-top: ${props => props.theme.spacing.large};
`;

const ActionCard = styled(SizibleCard)`
  display: flex;
  flex-direction: column;
`;

const CardContent = styled.div`
  flex-grow: 1;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const LoadingIndicator = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
`;

/**
 * Admin Dashboard Page Component
 * 
 * @returns {JSX.Element} The admin dashboard page component
 */
const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productCount: 0,
    retailerCount: 0,
    brandCount: 0,
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if admin is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
    
    // Fetch real statistics from the backend
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-stats`);
        console.log('Dashboard API response:', response.data);
        
        if (response.data && response.data.stats) {
          setStats({
            productCount: response.data.stats.productCount || 0,
            retailerCount: response.data.stats.retailerCount || 0,
            brandCount: response.data.stats.brandCount || 0,
            recentUploads: response.data.stats.recentUploads || []
          });
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Using default values.');
        // Keep the default values in case of error
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <PageHeader>
          <h1>Admin Dashboard</h1>
          <SizibleButton variant="secondary" onClick={handleLogout}>
            Logout
          </SizibleButton>
        </PageHeader>
        
        {loading ? (
          <LoadingIndicator>Loading statistics...</LoadingIndicator>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            <StatsGrid>
              <StatCard>
                <StatValue>{stats.productCount}</StatValue>
                <StatLabel>Total Products</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{stats.retailerCount}</StatValue>
                <StatLabel>Retailers</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{stats.brandCount}</StatValue>
                <StatLabel>Brands</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{stats.recentUploads.length}</StatValue>
                <StatLabel>Data Uploads</StatLabel>
              </StatCard>
            </StatsGrid>
          </>
        )}
        
        <h2>Admin Actions</h2>
        
        <ActionGrid>
          <ActionCard>
            <h3 className="card-heading">Excel Upload</h3>
            <CardContent>
              <p>Upload product data from Excel files to update the database.</p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton as={Link} to="/admin/excel-upload" fullWidth>
                Go to Excel Upload
              </SizibleButton>
            </div>
          </ActionCard>
          
          <ActionCard>
            <h3 className="card-heading">Tools & Calculators</h3>
            <CardContent>
              <p>Access AI-powered tools like Sophie Image Classifier and other utilities.</p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton as={Link} to="/admin/tools" fullWidth>
                Open Tools & Calculators
              </SizibleButton>
            </div>
          </ActionCard>
          
          <ActionCard>
            <h3 className="card-heading">Manage Retailers</h3>
            <CardContent>
              <p>View and manage retailer accounts and permissions.</p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton as={Link} to="/admin/retailers" fullWidth variant="secondary">
                Manage Retailers
              </SizibleButton>
            </div>
          </ActionCard>
          
          <ActionCard>
            <h3 className="card-heading">System Settings</h3>
            <CardContent>
              <p>Configure system settings and preferences.</p>
            </CardContent>
            <div className="card-footer">
              <SizibleButton as={Link} to="/admin/settings" fullWidth variant="secondary">
                System Settings
              </SizibleButton>
            </div>
          </ActionCard>
        </ActionGrid>
      </PageContainer>
    </>
  );
};

export default AdminDashboardPage;
