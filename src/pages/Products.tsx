
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { categories } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import { AdvancedFilters } from "@/components/product/AdvancedFilters";
import { useProducts } from "@/hooks/use-products";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductSort from "@/components/product/ProductSort";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const initialCategory = searchParams.get("category") || null;
  const initialSort = searchParams.get("sort") || "relevance";
  const initialPriceMin = searchParams.get("priceMin") || "";
  const initialPriceMax = searchParams.get("priceMax") || "";
  const initialRating = searchParams.get("rating") || "";
  
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [sort, setSort] = useState<string>(initialSort);
  const [priceMin, setPriceMin] = useState<string>(initialPriceMin);
  const [priceMax, setPriceMax] = useState<string>(initialPriceMax);
  const [rating, setRating] = useState<string>(initialRating);
  
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    if (rating) params.set("rating", rating);
    
    setSearchParams(params);
  }, [category, sort, priceMin, priceMax, rating, setSearchParams]);
  
  const handleCategoryChange = (category: string | null) => {
    setCategory(category);
  };
  
  const handleSortChange = (sort: string) => {
    setSort(sort);
  };
  
  const handlePriceMinChange = (priceMin: string) => {
    setPriceMin(priceMin);
  };
  
  const handlePriceMaxChange = (priceMax: string) => {
    setPriceMax(priceMax);
  };
  
  const handleRatingChange = (rating: string) => {
    setRating(rating);
  };
  
  const clearFilters = () => {
    setCategory(null);
    setSort("relevance");
    setPriceMin("");
    setPriceMax("");
    setRating("");
    
    toast({
      title: "Filters cleared",
      description: "All filters have been cleared.",
    });
  };
  
  const filteredProducts = products.filter(product => {
    if (category && product.category !== category) {
      return false;
    }
    
    if (priceMin && product.price < parseFloat(priceMin) * 100) {
      return false;
    }
    
    if (priceMax && product.price > parseFloat(priceMax) * 100) {
      return false;
    }
    
    if (rating && product.rating < parseFloat(rating)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (sort === "price-asc") {
      return a.price - b.price;
    }
    
    if (sort === "price-desc") {
      return b.price - a.price;
    }
    
    if (sort === "rating-asc") {
      return a.rating - b.rating;
    }
    
    if (sort === "rating-desc") {
      return b.rating - a.rating;
    }
    
    return 0;
  });
  
  return (
    <div className="container py-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          Products
        </BreadcrumbItem>
      </BreadcrumbList>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <aside className="hidden md:block">
          <AdvancedFilters
            filters={{ 
              category, 
              price: [priceMin ? parseInt(priceMin) : 10, priceMax ? parseInt(priceMax) : 10000],
              size: "",
              color: ""
            }}
            showFilters={true}
            isMobile={isMobile}
            onCategoryChange={handleCategoryChange}
            onPriceChange={(values) => {
              setPriceMin(values[0].toString());
              setPriceMax(values[1].toString());
            }}
            onSizeChange={() => {}}
            onColorChange={() => {}}
            onClearFilters={clearFilters}
            onToggleFilters={() => {}}
          />
        </aside>
        
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Products</h1>
            <ProductSort 
              currentSort={sort} 
              onSort={handleSortChange} 
            />
          </div>
          <Separator className="mb-4" />
          <ProductGrid filteredProducts={filteredProducts} isMobile={isMobile} handleCategoryChange={handleCategoryChange} />
        </div>
      </div>
    </div>
  );
}
