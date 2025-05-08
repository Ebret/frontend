/**
 * Button Component
 * 
 * A themeable button component with various variants and sizes.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';
import './Button.css';

/**
 * Button Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Button component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...rest
}) => {
  const { themeData } = useTheme();
  
  // Generate button classes
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    loading ? 'btn-loading' : '',
    icon && !children ? 'btn-icon-only' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Generate loading spinner styles based on theme
  const spinnerStyle = {
    borderColor: `var(--color-${variant === 'primary' ? 'white' : 'primary'})`,
    borderTopColor: 'transparent'
  };
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <span className="btn-spinner" style={spinnerStyle} aria-hidden="true" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      
      {children && <span className="btn-text">{children}</span>}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link',
    'outline-primary',
    'outline-secondary',
    'outline-accent',
    'outline-success',
    'outline-danger',
    'outline-warning',
    'outline-info',
    'outline-light',
    'outline-dark'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
