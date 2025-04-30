
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FilterState } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { AdvancedFilters } from "@/components/product/AdvancedFilters";
import { EnhancedProductGrid } from "@/components/product/EnhancedProductGrid";
import { ProductSort } from "@/components/product/ProductSort";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedFilters } from "@/hooks/use-saved-filters";

export default function Products() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Get products using our custom hook
  const { products, loading } = useProducts();
  
  // Use saved filters
  const { savedFilters, saveFilter } = useSavedFilters();
  
  // State for filters and filtered products
  const [filters, setFilters] = useState<FilterState>({
    category: categoryFromUrl,
    price: [10, 10000],
    size: null,
    color: null,
  });
  
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  // Apply filters to show all products
  useEffect(() => {
    try {
      let result = [...products];
      
      if (filters.category) {
        result = result.filter(
          (product) => product.category === filters.category
        );
      }
      
      result = result.filter(
        (product) => 
          product.price >= filters.price[0] &&
          product.price <= filters.price[1]
      );
      
      if (filters.size) {
        result = result.filter((product) =>
          product.variants.some((variant) => variant.size === filters.size)
        );
      }
      
      if (filters.color) {
        result = result.filter((product) =>
          product.variants.some((variant) => variant.color === filters.color)
        );
      }
      
      result = sortProducts(result, sortOption);
      setFilteredProducts(result);
    } catch (error) {
      console.error('Error filtering products:', error);
      toast({
        title: "Error",
        description: "There was an error filtering the products. Please try again.",
        variant: "destructive"
      });
    }
  }, [filters, products, sortOption, toast]);
  
  const handleCategoryChange = (category: string | null) => {
    setFilters({ ...filters, category });
  };
  
  const handlePriceChange = (values: number[]) => {
    setFilters({ ...filters, price: values });
  };
  
  const handleSizeChange = (size: string) => {
    setFilters({ ...filters, size: filters.size === size ? null : size });
  };
  
  const handleColorChange = (color: string) => {
    setFilters({ ...filters, color: filters.color === color ? null : color });
  };
  
  const clearFilters = () => {
    setFilters({
      category: null,
      price: [10, 10000],
      size: null,
      color: null,
    });
    toast({
      title: "Filters cleared",
      description: "All filters have been reset"
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleSaveFilter = (name: string) => {
    saveFilter(name, filters);
  };

  const sortProducts = (products, option: string) => {
    const productsCopy = [...products];
    
    switch (option) {
      case "price-asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return productsCopy.sort((a, b) => (b.id || "").localeCompare(a.id || ""));
      default:
        return productsCopy;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          {filters.category 
            ? `${filters.category.replace('-', ' ').charAt(0).toUpperCase() + filters.category.replace('-', ' ').slice(1)}`
            : "All Products"
          }
        </motion.h1>
        
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFilters}
              className="md:hidden"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
          <ProductSort onSort={handleSortChange} currentSort={sortOption} />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full lg:w-64"
            >
              <AdvancedFilters 
                filters={filters}
                showFilters={showFilters}
                isMobile={isMobile}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onSizeChange={handleSizeChange}
                onColorChange={handleColorChange}
                onClearFilters={clearFilters}
                onToggleFilters={toggleFilters}
                onSaveFilter={handleSaveFilter}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex-1 flex flex-col">
          <EnhancedProductGrid 
            filteredProducts={filteredProducts}
            isMobile={isMobile}
            handleCategoryChange={handleCategoryChange}
          />
          
          <RecentlyViewedSection />
        </div>
      </div>
    </div>
  );
}
