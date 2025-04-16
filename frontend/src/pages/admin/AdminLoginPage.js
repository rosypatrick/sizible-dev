/**
 * Admin Login Page
 * 
 * This page provides a simple login form for admin users.
 * Currently uses dummy authentication (any username/password will work).
 */

import React, { useState } from 'react';
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
`;

const LoginCard = styled(SizibleCard)`
  width: 100%;
  max-width: 450px;
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

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

/**
 * Admin Login Page Component
 * 
 * @returns {JSX.Element} The admin login page component
 */
const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle form submission
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // For now, accept any username/password
      // In a real application, this would validate credentials against the backend
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin/dashboard');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <LoginCard elevated>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
        </LoginCard>
      </PageContainer>
    </>
  );
};

export default AdminLoginPage;
