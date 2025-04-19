
import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real implementation, this would perform the actual search
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex w-full max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </div>
        </form>
        
        <div className="mt-8">
          {searchQuery ? (
            <p className="text-center text-muted-foreground">
              No results found for "{searchQuery}". Try another search term.
            </p>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Popular Searches</h2>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['T-shirts', 'Shorts', 'Summer Collection', 'New Arrivals'].map(term => (
                  <Button 
                    key={term} 
                    variant="outline" 
                    onClick={() => setSearchQuery(term)}
                    className="animate-fade-in"
                  >
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
