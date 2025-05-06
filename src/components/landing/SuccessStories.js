import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { trackEvent } from '@/utils/analytics';

const SuccessStories = ({ stories = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const storiesRef = useRef(null);

  // Default stories if none provided
  const defaultStories = [
    {
      id: 1,
      title: 'Increased Loan Processing Efficiency by 60%',
      quote: 'The loan management system has revolutionized how we process applications. What used to take days now takes hours, and our members are thrilled with the quick turnaround time.',
      author: {
        name: 'Maria Santos',
        title: 'General Manager',
        organization: 'ABC Cooperative',
        image: '/images/testimonials/placeholder-1.jpg',
      },
      metrics: [
        { label: 'Loan Processing Time', before: '3 days', after: '1 day' },
        { label: 'Member Satisfaction', before: '72%', after: '94%' },
        { label: 'Operational Costs', before: '₱120,000/mo', after: '₱75,000/mo' },
      ],
    },
    {
      id: 2,
      title: 'Doubled Member Engagement with Mobile Access',
      quote: 'Since implementing the mobile access feature, we\'ve seen a dramatic increase in member engagement. Our younger members especially appreciate being able to check their accounts and apply for loans from their phones.',
      author: {
        name: 'Juan Reyes',
        title: 'IT Director',
        organization: 'XYZ Credit Union',
        image: '/images/testimonials/placeholder-2.jpg',
      },
      metrics: [
        { label: 'Mobile Transactions', before: '15%', after: '65%' },
        { label: 'New Members (Monthly)', before: '50', after: '120' },
        { label: 'Member Retention', before: '82%', after: '95%' },
      ],
    },
    {
      id: 3,
      title: 'Reduced Reporting Time by 80%',
      quote: 'The reporting and analytics features have transformed our decision-making process. What used to take our team a full week to compile now happens automatically, giving us real-time insights into our financial performance.',
      author: {
        name: 'Elena Cruz',
        title: 'Finance Manager',
        organization: 'PQR Cooperative',
        image: '/images/testimonials/placeholder-3.jpg',
      },
      metrics: [
        { label: 'Report Generation Time', before: '40 hours', after: '8 hours' },
        { label: 'Data Accuracy', before: '85%', after: '99%' },
        { label: 'Decision Response Time', before: '2 weeks', after: '3 days' },
      ],
    },
  ];

  // Use provided stories or default ones
  const displayStories = stories.length > 0 ? stories : defaultStories;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % displayStories.length);
      }, 8000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, displayStories.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Change active story
  const handleStoryChange = (index) => {
    setActiveIndex(index);
    trackEvent('Success Stories', 'Story Changed', `Story ${index + 1}`);
  };

  // Get active story
  const activeStory = displayStories[activeIndex];

  return (
    <div 
      className="bg-white rounded-lg shadow-xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={storiesRef}
    >
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Story Content */}
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-blue-600 mb-4">
                {activeStory.title}
              </h4>
              <blockquote className="text-gray-700 italic mb-6">
                "{activeStory.quote}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center">
                {activeStory.author.image ? (
                  <Image
                    src={activeStory.author.image}
                    alt={activeStory.author.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-medium">
                      {activeStory.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold">{activeStory.author.name}</div>
                  <div className="text-sm text-gray-600">
                    {activeStory.author.title}, {activeStory.author.organization}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Metrics */}
            {activeStory.metrics && activeStory.metrics.length > 0 && (
              <div className="mt-8">
                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Impact Metrics
                </h5>
                <div className="space-y-4">
                  {activeStory.metrics.map((metric, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {metric.label}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">Before:</span>
                          <span className="ml-2 font-medium">{metric.before}</span>
                        </div>
                        <svg className="h-4 w-4 text-blue-500 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">After:</span>
                          <span className="ml-2 font-medium text-green-600">{metric.after}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Image or Illustration */}
          <div className="hidden lg:block bg-blue-50 rounded-lg p-6 relative h-full min-h-[400px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {activeStory.metrics && activeStory.metrics[0] ? (
                    <>
                      {activeStory.metrics[0].after}
                      <span className="text-2xl ml-1">vs {activeStory.metrics[0].before}</span>
                    </>
                  ) : (
                    <span className="text-4xl">Success Story</span>
                  )}
                </div>
                <p className="text-blue-700 font-medium">
                  {activeStory.metrics && activeStory.metrics[0] ? activeStory.metrics[0].label : 'Results'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Story Navigation */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {displayStories.map((story, index) => (
              <button
                key={story.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => handleStoryChange(index)}
                aria-label={`View success story ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
