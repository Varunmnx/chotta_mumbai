import React from 'react';
import './button.css'; 
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      className={`learn-more ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
