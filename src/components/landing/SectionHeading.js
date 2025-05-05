import React from 'react';

const SectionHeading = ({
  title,
  subtitle,
  centered = true,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${titleClassName}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg text-gray-600 max-w-3xl ${centered ? 'mx-auto' : ''} ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
