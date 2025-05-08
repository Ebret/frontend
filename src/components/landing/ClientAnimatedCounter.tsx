'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the AnimatedCounter component on the client side
const AnimatedCounter = dynamic(() => import('@/components/landing/AnimatedCounter'), {
  ssr: false,
  loading: () => <span className="text-4xl font-bold text-blue-600">0</span>
});

interface ClientAnimatedCounterProps {
  value: number;
  label: string;
  duration?: number;
}

const ClientAnimatedCounter: React.FC<ClientAnimatedCounterProps> = ({ 
  value, 
  label, 
  duration 
}) => {
  return <AnimatedCounter value={value} label={label} duration={duration} />;
};

export default ClientAnimatedCounter;
