import React from 'react';

interface MovieCardSkeletonProps {
  variant?: 'normal' | 'fluid';
}

export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({ variant = 'normal' }) => {
  const isFluid = variant === 'fluid';
  
  return (
    <div 
      className={`animate-pulse rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 ${
        isFluid ? 'w-full' : 'w-[180px]'
      }`}
    >
      {/* Poster placeholder */}
      <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-600"></div>
      
      {/* Title placeholder */}
      <div className="p-2 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
};
