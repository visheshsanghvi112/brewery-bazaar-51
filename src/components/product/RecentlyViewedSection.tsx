
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductCard } from './ProductCard';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface RecentlyViewedSectionProps {
  currentProductId?: string;
  products: Product[];
}

export function RecentlyViewedSection({ currentProductId, products }: RecentlyViewedSectionProps) {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>('recently-viewed-products', []);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  
  // Add current product to recently viewed
  useEffect(() => {
    if (currentProductId) {
      // Don't add if it's already the most recent
      if (recentlyViewed[0] !== currentProductId) {
        // Remove if exists elsewhere in the array
        const filtered = recentlyViewed.filter(id => id !== currentProductId);
        // Add to front of array and limit to 10 items
        setRecentlyViewed([currentProductId, ...filtered].slice(0, 10));
      }
    }
  }, [currentProductId, recentlyViewed]);
  
  // Get product details for recently viewed IDs
  useEffect(() => {
    const recent = recentlyViewed
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as Product[];
    
    setRecentProducts(recent);
  }, [recentlyViewed, products]);
  
  if (recentProducts.length <= 1) return null;
  
  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {recentProducts.map(product => (
            product.id !== currentProductId && (
              <div key={product.id} className="w-[200px] min-w-[200px]">
                <ProductCard product={product} />
              </div>
            )
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
