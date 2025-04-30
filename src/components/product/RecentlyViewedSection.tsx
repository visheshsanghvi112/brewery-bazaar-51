
import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { EnhancedProductCard } from '@/components/product/EnhancedProductCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { db } from '@/integrations/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { QuickViewModal } from './QuickViewModal';

const RECENTLY_VIEWED_LIMIT = 4;

interface RecentlyViewedSectionProps {
  currentProductId?: string;
}

export function RecentlyViewedSection({ currentProductId }: RecentlyViewedSectionProps) {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>("recently-viewed", []);
  const [products, setProducts] = useState<Product[]>([]);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Add current product to recently viewed
  useEffect(() => {
    if (currentProductId) {
      setRecentlyViewed(prev => {
        // Remove if already exists
        const filtered = prev.filter(id => id !== currentProductId);
        // Add to beginning of array
        const updated = [currentProductId, ...filtered].slice(0, RECENTLY_VIEWED_LIMIT);
        return updated;
      });
    }
  }, [currentProductId, setRecentlyViewed]);

  // Fetch products from recently viewed IDs
  useEffect(() => {
    const fetchProducts = async () => {
      if (recentlyViewed.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Filter out current product
        const idsToFetch = recentlyViewed.filter(id => id !== currentProductId);
        
        if (idsToFetch.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch products from Firebase
        const productsPromises = idsToFetch.map(async (id) => {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || '',
              description: data.description || '',
              price: data.price || 0,
              originalPrice: data.originalPrice,
              category: data.category || '',
              images: data.images || [],
              variants: data.variants || [],
              rating: data.rating || 0,
              reviews: data.reviews || 0,
              inStock: data.inStock !== undefined ? data.inStock : true,
              featured: data.featured || false
            } as Product;
          }
          return null;
        });

        const fetchedProducts = await Promise.all(productsPromises);
        setProducts(fetchedProducts.filter(Boolean) as Product[]);
      } catch (error) {
        console.error('Error fetching recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [recentlyViewed, currentProductId]);

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    setProducts([]);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  if (products.length === 0 && !loading) return null;

  return (
    <div className="border-t mt-12 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recently Viewed</h3>
        <Button variant="ghost" size="sm" onClick={clearRecentlyViewed}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[300px] bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      ) : (
        <ScrollArea className="w-full pb-4">
          <div className="flex space-x-4">
            {products.map((product) => (
              <div key={product.id} className="min-w-[240px] max-w-[240px]">
                <EnhancedProductCard 
                  product={product} 
                  isMobile={isMobile} 
                  onQuickView={handleQuickView}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
