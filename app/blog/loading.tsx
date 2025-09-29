import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        {/* Pulse effect */}
        <div className="absolute inset-0 -z-10 bg-blue-500/20 rounded-full animate-ping"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}