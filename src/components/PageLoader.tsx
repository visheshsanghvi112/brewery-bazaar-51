
import React from 'react';

interface PageLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
}

export function PageLoader({ children, loading = false }: PageLoaderProps) {
  // Simple wrapper that contains the children content
  // You can enhance this with actual loading state logic if needed
  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
