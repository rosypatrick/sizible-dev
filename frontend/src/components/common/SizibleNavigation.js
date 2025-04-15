/**
 * SizibleNavigation Component
 * 
 * A navigation bar component that follows Sizible's brand guidelines.
 * This component provides the main navigation for both retailer and consumer interfaces.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SizibleButton from './SizibleButton';

const NavContainer = styled.nav`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.small};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.mobileMenuOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.primary};
    padding: ${props => props.theme.spacing.medium};
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

/**
 * SizibleNavigation component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isRetailer - Whether this is the retailer interface
 * @returns {JSX.Element} Navigation component
 */
const SizibleNavigation = ({ isRetailer = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <NavContainer>
      <Logo to="/">
        <LogoImage src="/sizible-logo.webp" alt="Sizible Logo" />
      </Logo>
      
      <MobileMenuButton onClick={toggleMobileMenu}>
        {mobileMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
      
      <NavLinks mobileMenuOpen={mobileMenuOpen}>
        {isRetailer ? (
          // Retailer navigation links
          <>
            <NavLink to="/retailer/dashboard">Dashboard</NavLink>
            <NavLink to="/retailer/products">Inventory</NavLink>
            <NavLink to="/retailer/style-guidance">Style Guidance</NavLink>
            <SizibleButton as={Link} to="/retailer/logout" size="small">Logout</SizibleButton>
          </>
        ) : (
          // Consumer navigation links
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/consumer">Find Your Style</NavLink>
            <NavLink to="/about">About</NavLink>
            <SizibleButton as={Link} to="/retailer/login" size="small">Retailer Login</SizibleButton>
          </>
        )}
      </NavLinks>
    </NavContainer>
  );
};

export default SizibleNavigation;