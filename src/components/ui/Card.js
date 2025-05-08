/**
 * Card Component
 * 
 * A themeable card component for displaying content in a contained box.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';
import './Card.css';

/**
 * Card Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card component
 */
const Card = ({
  children,
  variant = 'default',
  elevation = 'md',
  className = '',
  onClick,
  ...rest
}) => {
  const { themeData } = useTheme();
  
  // Generate card classes
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-elevation-${elevation}`,
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'accent',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'outline'
  ]),
  elevation: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  onClick: PropTypes.func
};

/**
 * Card Header Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card header component
 */
export const CardHeader = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  ...rest
}) => {
  // Generate card header classes
  const headerClasses = [
    'card-header',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...rest}>
      {children ? (
        children
      ) : (
        <>
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {action && <div className="card-header-action">{action}</div>}
        </>
      )}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card Body Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card body component
 */
export const CardBody = ({
  children,
  className = '',
  ...rest
}) => {
  // Generate card body classes
  const bodyClasses = [
    'card-body',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={bodyClasses} {...rest}>
      {children}
    </div>
  );
};

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card Footer Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card footer component
 */
export const CardFooter = ({
  children,
  className = '',
  ...rest
}) => {
  // Generate card footer classes
  const footerClasses = [
    'card-footer',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={footerClasses} {...rest}>
      {children}
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card Image Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card image component
 */
export const CardImage = ({
  src,
  alt = '',
  position = 'top',
  className = '',
  ...rest
}) => {
  // Generate card image classes
  const imageClasses = [
    'card-image',
    `card-image-${position}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={imageClasses}>
      <img src={src} alt={alt} {...rest} />
    </div>
  );
};

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  position: PropTypes.oneOf(['top', 'bottom']),
  className: PropTypes.string
};

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
