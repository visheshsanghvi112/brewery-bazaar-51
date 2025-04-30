
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useLocalStorage<Product[]>('compare-items', []);
  const [compareCount, setCompareCount] = useState(0);
  
  useEffect(() => {
    setCompareCount(compareItems.length);
  }, [compareItems]);

  const addToCompare = (product: Product) => {
    // Limit the number of items that can be compared
    if (compareItems.length >= 4) {
      toast.error('You can only compare up to 4 products at a time');
      return;
    }
    
    // Check if product is already in compare
    if (compareItems.some(item => item.id === product.id)) {
      toast.info(`${product.name} is already in your comparison list`);
      return;
    }
    
    setCompareItems([...compareItems, product]);
    toast.success(`${product.name} added to comparison`);
  };

  const removeFromCompare = (productId: string) => {
    const itemToRemove = compareItems.find(item => item.id === productId);
    if (itemToRemove) {
      setCompareItems(compareItems.filter(item => item.id !== productId));
      toast.info(`${itemToRemove.name} removed from comparison`);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
    toast.info('Comparison list cleared');
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(item => item.id === productId);
  };

  return (
    <CompareContext.Provider 
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
