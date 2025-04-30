
import React from 'react';

interface PageLoaderProps {
  children: React.ReactNode;
}

export function PageLoader({ children }: PageLoaderProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
