import React from 'react';

/**
 * Loading spinner component used to show a loading state
 * @returns Loading spinner component
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner; 