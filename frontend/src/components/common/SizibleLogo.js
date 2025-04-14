/**
 * SizibleLogo Component
 * 
 * A simple SVG logo component for Sizible that can be used when an image is not available.
 * This follows Sizible's brand guidelines with the primary pink color.
 */

import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  font-family: ${props => props.theme.typography.fontFamily.primary};
`;

const LogoText = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.inverse ? props.theme.colors.primary : 'white'};
  margin-left: 8px;
`;

/**
 * SizibleLogo component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.inverse - Whether to use inverse colors (pink text instead of white)
 * @param {number} props.size - Size of the logo in pixels
 * @returns {JSX.Element} Logo component
 */
const SizibleLogo = ({ inverse = false, size = 40 }) => {
  return (
    <LogoContainer>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill={inverse ? 'white' : '#ff5ea3'} 
          stroke={inverse ? '#ff5ea3' : 'white'} 
          strokeWidth="2" 
        />
        <path 
          d="M30 40C30 35 35 30 50 30C65 30 70 35 70 40M30 60C30 65 35 70 50 70C65 70 70 65 70 60" 
          stroke={inverse ? '#ff5ea3' : 'white'} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        <path 
          d="M50 30V70" 
          stroke={inverse ? '#ff5ea3' : 'white'} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      </svg>
      <LogoText inverse={inverse}>Sizible</LogoText>
    </LogoContainer>
  );
};

export default SizibleLogo;