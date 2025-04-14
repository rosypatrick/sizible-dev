/**
 * SizibleCard Component
 * 
 * A styled card component that follows Sizible's brand guidelines.
 * This component provides a consistent container for content with
 * appropriate styling, shadows, and borders.
 */

import styled from 'styled-components';

const SizibleCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.elevated 
    ? props.theme.shadows.large 
    : props.theme.shadows.small};
  padding: ${props => props.compact 
    ? props.theme.spacing.medium 
    : props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.medium};
  transition: ${props => props.theme.transitions.default};
  border: ${props => props.bordered 
    ? `1px solid #eee` 
    : 'none'};
  
  /* Optional hover effect */
  ${props => props.hoverable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.large};
    }
  `}

  /* Optional heading styling */
  .card-heading {
    font-size: ${props => props.theme.typography.fontSize.large};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: ${props => props.theme.spacing.medium};
    color: ${props => props.theme.colors.text};
  }

  /* Optional content styling */
  .card-content {
    color: ${props => props.theme.colors.text};
  }

  /* Optional footer styling */
  .card-footer {
    margin-top: ${props => props.theme.spacing.medium};
    padding-top: ${props => props.theme.spacing.medium};
    border-top: 1px solid #eee;
  }
`;

export default SizibleCard;