/**
 * SizibleButton Component
 * 
 * A styled button component that follows Sizible's brand guidelines.
 * This component extends the standard button with Sizible's styling.
 */

import styled from 'styled-components';

const SizibleButton = styled.button`
  background-color: ${props => props.variant === 'secondary' ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.primary : 'white'};
  border: ${props => props.variant === 'secondary' ? `2px solid ${props.theme.colors.primary}` : 'none'};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.size === 'large' 
    ? `${props.theme.spacing.medium} ${props.theme.spacing.large}`
    : props.size === 'small'
      ? `${props.theme.spacing.small} ${props.theme.spacing.medium}`
      : `${props.theme.spacing.small} ${props.theme.spacing.medium}`
  };
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-size: ${props => props.size === 'large' 
    ? props.theme.typography.fontSize.large
    : props.size === 'small'
      ? props.theme.typography.fontSize.small
      : props.theme.typography.fontSize.medium
  };
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.small};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
    color: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Add space between icon and text if both exist */
  svg + span, span + svg {
    margin-left: ${props => props.theme.spacing.small};
  }
`;

export default SizibleButton;