
import React from 'react';
import { PageLoader as UIPageLoader } from './ui/page-loader';

interface PageLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
}

// This is just a wrapper around our UI PageLoader for backward compatibility
export function PageLoader({ children, loading = false }: PageLoaderProps) {
  return <UIPageLoader loading={loading}>{children}</UIPageLoader>;
}
