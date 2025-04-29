
// This file is preserved but no longer in use
// The application now uses Firebase for data storage and authentication

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// NOTE: This Supabase configuration is kept for backward compatibility
// but is not actively used. All data operations now use Firebase.
const SUPABASE_URL = "https://wxfkerzlhukixngzpcho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZmtlcnpsaHVraXhuZ3pwY2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1ODU4NjksImV4cCI6MjA1OTE2MTg2OX0.4mHjs_59IjqOZFEuY_Muzi8AvhEhvFnxB6-010arDSM";

// Create the supabase client but mark it as deprecated
console.warn('⚠️ Supabase client is deprecated. Use Firebase instead.');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enable real-time updates for product-related tables
// This is needed for immediate product visibility when admin creates products
supabase.channel('public:products')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
    console.log('Product change:', payload);
  })
  .subscribe();

// Enable real-time updates for orders table
// This helps when tracking order status changes
supabase.channel('public:orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
    console.log('Order change:', payload);
  })
  .subscribe();
