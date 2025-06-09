'use client';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    <p className="ml-4 text-gray-400">Loading...</p>
  </div>
); 