'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the TestimonialCard component on the client side
const TestimonialCard = dynamic(() => import('@/components/landing/TestimonialCard'), {
  loading: () => (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  )
});

interface ClientTestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  image?: string;
}

const ClientTestimonialCard: React.FC<ClientTestimonialCardProps> = ({ 
  name, 
  role, 
  testimonial, 
  image 
}) => {
  return <TestimonialCard name={name} role={role} testimonial={testimonial} image={image} />;
};

export default ClientTestimonialCard;
