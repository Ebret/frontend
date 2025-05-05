import React from 'react';
import Image from 'next/image';

const TestimonialCard = ({
  quote,
  name,
  title,
  company,
  avatarUrl,
  rating = 5,
  className = '',
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${className}`}>
      {/* Star Rating */}
      {rating > 0 && (
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <p className="text-gray-600 mb-6 italic">"{quote}"</p>

      {/* Author Info */}
      <div className="flex items-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <span className="text-gray-600 font-medium">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-600 text-sm">
            {title}{company && `, ${company}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
