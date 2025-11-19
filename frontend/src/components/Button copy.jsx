// frontend/src/components/Button.js
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          &:hover {
            background-color: #2563eb;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover {
            background-color: #dc2626;
          }
        `;
      case 'secondary':
        return `
          background-color: #6b7280;
          color: white;
          &:hover {
            background-color: #4b5563;
          }
        `;
      default:
        return `
          background-color: #e5e7eb;
          color: #1f2937;
          &:hover {
            background-color: #d1d5db;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ children, variant = 'default', ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;