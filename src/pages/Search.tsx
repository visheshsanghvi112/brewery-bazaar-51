import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products';
import ProductGrid from '@/components/product/ProductGrid';
import { useSearchParams } from 'react-router-dom';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const { products, loading } = useProducts();
  
  // Sync URL params when arriving with ?q=...
  useEffect(() => {
    if (initialQuery && initialQuery !== submittedQuery) {
      setSearchQuery(initialQuery);
      setSubmittedQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSubmittedQuery('');
      setSearchParams({});
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setSubmittedQuery(term);
    setSearchParams({ q: term });
  };

  // Filter products based on search term
  const searchResults = useMemo(() => {
    if (!submittedQuery) return [];
    
    const query = submittedQuery.toLowerCase();
    return products.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const catMatch = product.category?.toLowerCase().includes(query);
      
      return nameMatch || descMatch || catMatch;
    });
  }, [products, submittedQuery]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Products</h1>
        
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex w-full max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, categories..."
                className="pl-10 pr-4 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2 h-12 px-6">
              Search
            </Button>
          </div>
        </form>
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : submittedQuery ? (
            <div>
              <h2 className="text-xl mb-6">
                Showing results for <span className="font-semibold">"{submittedQuery}"</span>
                <span className="text-muted-foreground text-sm ml-2">({searchResults.length} items)</span>
              </h2>
              
              {searchResults.length > 0 ? (
                <ProductGrid 
                  filteredProducts={searchResults} 
                  isMobile={false} 
                  handleCategoryChange={(cat) => handlePopularSearch(cat || '')} 
                />
              ) : (
                <div className="text-center py-16 bg-secondary/20 rounded-lg border border-dashed">
                  <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground mb-4">
                    No results found for "{submittedQuery}".
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setSubmittedQuery('');
                    setSearchParams({});
                  }}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center mt-12">
              <h2 className="text-xl font-medium mb-6">Popular Searches</h2>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {['T-shirts', 'Shorts', 'Summer', 'New Arrivals', 'Cotton', 'Linen'].map(term => (
                  <Button 
                    key={term} 
                    variant="secondary" 
                    onClick={() => handlePopularSearch(term)}
                    className="animate-fade-in px-6 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <SearchIcon className="w-4 h-4 mr-2 opacity-50" />
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
