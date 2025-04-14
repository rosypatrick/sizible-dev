/**
 * MeasurementInput Component
 * 
 * A component for inputting body measurements with a slider and numeric input.
 * This component follows Sizible's brand guidelines and provides a user-friendly
 * interface for entering measurements like bust, waist, and hips.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MeasurementContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.medium};
`;

const NumberInput = styled.input`
  width: 70px;
  text-align: center;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.medium};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SliderContainer = styled.div`
  position: relative;
  flex: 1;
  height: 40px;
`;

const Ruler = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background: #f8f9fa;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const RulerMarks = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
`;

const Mark = styled.div`
  position: absolute;
  bottom: 0;
  width: 1px;
  background-color: #aaa;
  height: ${props => (props.isMajor ? '10px' : '6px')};
  left: ${props => props.position}%;
`;

const MarkLabel = styled.div`
  position: absolute;
  bottom: -16px;
  font-size: 9px;
  transform: translateX(-50%);
  left: ${props => props.position}%;
  color: #666;
`;

const Slider = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
  }
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 9px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ddd;
  z-index: 1;
`;

/**
 * MeasurementInput component
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the measurement (e.g., "Bust", "Waist")
 * @param {number} props.value - Current measurement value
 * @param {function} props.onChange - Function to call when measurement changes
 * @param {number} props.min - Minimum value for the slider
 * @param {number} props.max - Maximum value for the slider
 * @returns {JSX.Element} Measurement input component
 */
const MeasurementInput = ({ 
  label, 
  value, 
  onChange,
  min = 50,
  max = 150
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      newValue = min;
    } else if (newValue < min) {
      newValue = min;
    } else if (newValue > max) {
      newValue = max;
    }
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Generate ruler marks
  const renderMarks = () => {
    const marks = [];
    const step = 5; // 5cm steps
    const majorStep = 10; // 10cm for major marks
    
    for (let i = min; i <= max; i += step) {
      const position = ((i - min) / (max - min)) * 100;
      const isMajor = i % majorStep === 0;
      
      marks.push(
        <Mark key={`mark-${i}`} position={position} isMajor={isMajor} />
      );
      
      if (isMajor) {
        marks.push(
          <MarkLabel key={`label-${i}`} position={position}>
            {i}
          </MarkLabel>
        );
      }
    }
    
    return marks;
  };

  return (
    <MeasurementContainer>
      <Label htmlFor={`${label.toLowerCase()}-input`}>{label} (cm)</Label>
      <InputGroup>
        <NumberInput
          id={`${label.toLowerCase()}-input`}
          type="number"
          value={localValue}
          onChange={handleInputChange}
          min={min}
          max={max}
        />
        
        <SliderContainer>
          <SliderTrack />
          <Slider
            type="range"
            min={min}
            max={max}
            value={localValue}
            onChange={handleSliderChange}
          />
          <Ruler>
            <RulerMarks>
              {renderMarks()}
            </RulerMarks>
          </Ruler>
        </SliderContainer>
      </InputGroup>
    </MeasurementContainer>
  );
};

export default MeasurementInput;