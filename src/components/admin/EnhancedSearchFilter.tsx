
import { useState, useEffect } from 'react';
import { Search, X, Filter, CalendarRange, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  categories: any[];
  dateRange?: { from: Date | undefined; to: Date | undefined };
  setDateRange?: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  onSaveSearchPreset?: (name: string) => void;
  savedSearches?: { id: string; name: string; searchParams: any }[];
  onLoadSavedSearch?: (searchParams: any) => void;
}

export function EnhancedSearchFilter({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  onSaveSearchPreset,
  savedSearches,
  onLoadSavedSearch
}: SearchFilterProps) {
  const [searchPresetName, setSearchPresetName] = useState('');
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  const handleSaveSearch = () => {
    if (searchPresetName.trim() && onSaveSearchPreset) {
      onSaveSearchPreset(searchPresetName);
      setSearchPresetName('');
      setShowSaveSearch(false);
    }
  };

  const handleLoadSearch = (searchParams: any) => {
    if (onLoadSavedSearch) {
      onLoadSavedSearch(searchParams);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <Select 
          value={filterCategory || "all"} 
          onValueChange={(value) => setFilterCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {setDateRange && dateRange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd")
                  )
                ) : (
                  "Date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
              <div className="flex items-center justify-between p-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setDateRange(undefined)}
                >
                  Clear
                </Button>
                <Button size="sm">Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {setSortBy && sortBy && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                {sortBy === 'newest' && "Newest"}
                {sortBy === 'oldest' && "Oldest"}
                {sortBy === 'name-asc' && "Name (A-Z)"}
                {sortBy === 'name-desc' && "Name (Z-A)"}
                {sortBy === 'price-asc' && "Price (Low to High)"}
                {sortBy === 'price-desc' && "Price (High to Low)"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>Oldest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name-asc')}>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name-desc')}>Name (Z-A)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price-asc')}>Price (Low to High)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price-desc')}>Price (High to Low)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {onSaveSearchPreset && (
          <Popover open={showSaveSearch} onOpenChange={setShowSaveSearch}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Save Search
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Save current search</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a preset to quickly access this search later.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Input
                      id="search-preset-name"
                      placeholder="My favorite products"
                      value={searchPresetName}
                      onChange={(e) => setSearchPresetName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveSearch} disabled={!searchPresetName.trim()}>
                    Save Search
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {savedSearches && savedSearches.length > 0 && onLoadSavedSearch && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Saved Searches
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Saved Searches</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {savedSearches.map(search => (
                <DropdownMenuItem 
                  key={search.id} 
                  onClick={() => handleLoadSearch(search.searchParams)}
                >
                  {search.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Active filter indicators */}
      {(searchTerm || filterCategory || (dateRange && dateRange.from)) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {searchTerm && (
            <div className="flex items-center bg-muted text-sm px-3 py-1 rounded-full">
              <span className="mr-1">Search:</span>
              <span className="font-medium">{searchTerm}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 ml-1"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {filterCategory && (
            <div className="flex items-center bg-muted text-sm px-3 py-1 rounded-full">
              <span className="mr-1">Category:</span>
              <span className="font-medium capitalize">
                {filterCategory.replace('-', ' ')}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 ml-1"
                onClick={() => setFilterCategory(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {dateRange && dateRange.from && (
            <div className="flex items-center bg-muted text-sm px-3 py-1 rounded-full">
              <span className="mr-1">Date:</span>
              <span className="font-medium">
                {format(dateRange.from, "MMM d")}
                {dateRange.to && ` - ${format(dateRange.to, "MMM d")}`}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 ml-1"
                onClick={() => setDateRange && setDateRange(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
