
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { Product } from '@/types';
import { EnhancedSearchFilter } from './EnhancedSearchFilter';
import { ProductGrid } from './product/ProductGrid';
import { BulkActions } from '@/components/product/BulkActions';
import { DuplicateModal } from './product/DuplicateModal';
import { toast } from 'sonner';

interface EnhancedProductsTabContentProps {
  products: Product[];
  filteredProducts: Product[];
  categories: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  handleDuplicateProduct: (product: Product, options: any) => Promise<void>;
  isLoading?: boolean;
}

export function EnhancedProductsTabContent({
  products,
  filteredProducts,
  categories,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleDuplicateProduct,
  isLoading = false
}: EnhancedProductsTabContentProps) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productToDuplicate, setProductToDuplicate] = useState<Product | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>();
  const [savedSearches, setSavedSearches] = useState<{ id: string; name: string; searchParams: any }[]>([]);
  
  const handleProductSelection = (product: Product, selected: boolean) => {
    if (selected) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    }
  };
  
  const handleClearSelection = () => {
    setSelectedProducts([]);
  };
  
  const handleDeleteSelected = () => {
    try {
      // Delete each selected product
      selectedProducts.forEach(product => {
        if (product.id) {
          handleDeleteProduct(product.id);
        }
      });
      
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete some products');
    }
  };
  
  const handleDuplicateSelected = async () => {
    if (selectedProducts.length === 1) {
      // If only one product is selected, show the duplicate modal
      setProductToDuplicate(selectedProducts[0]);
      setShowDuplicateModal(true);
    } else {
      // If multiple products are selected, duplicate with default options
      try {
        for (const product of selectedProducts) {
          await handleDuplicateProduct(product, {
            copyImages: true,
            copyVariants: true,
            keepStock: false,
            nameSuffix: ' (Copy)'
          });
        }
        toast.success(`${selectedProducts.length} products duplicated successfully`);
        setSelectedProducts([]);
      } catch (error) {
        console.error('Error duplicating products:', error);
        toast.error('Failed to duplicate some products');
      }
    }
  };
  
  const handleExportSelected = () => {
    try {
      // Create CSV content
      const headers = ['ID', 'Name', 'Category', 'Price', 'Original Price', 'Featured', 'In Stock', 'Variants'];
      const csvContent = [
        headers.join(','),
        ...selectedProducts.map(product => {
          return [
            product.id || '',
            `"${product.name.replace(/"/g, '""')}"`,
            product.category || '',
            product.price / 100,
            product.originalPrice ? product.originalPrice / 100 : '',
            product.featured ? 'Yes' : 'No',
            product.inStock ? 'Yes' : 'No',
            product.variants.length
          ].join(',');
        })
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Products exported successfully');
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };
  
  const handleRefreshInventory = () => {
    toast('Refreshing inventory...', {
      description: 'This may take a moment',
      duration: 3000
    });
  };
  
  const handleSaveSearchPreset = (name: string) => {
    const searchParams = {
      searchTerm,
      filterCategory,
      dateRange,
      sortBy
    };
    
    const newSavedSearch = {
      id: Date.now().toString(),
      name,
      searchParams
    };
    
    setSavedSearches([...savedSearches, newSavedSearch]);
    toast.success(`Search preset "${name}" saved successfully`);
  };
  
  const handleLoadSavedSearch = (searchParams: any) => {
    setSearchTerm(searchParams.searchTerm || '');
    setFilterCategory(searchParams.filterCategory || null);
    setDateRange(searchParams.dateRange || undefined);
    setSortBy(searchParams.sortBy || 'newest');
    toast.success('Search preset loaded');
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <EnhancedSearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            categories={categories}
            dateRange={dateRange}
            setDateRange={setDateRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSaveSearchPreset={handleSaveSearchPreset}
            savedSearches={savedSearches}
            onLoadSavedSearch={handleLoadSavedSearch}
          />
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleAddProduct} 
              className="shrink-0"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="bg-muted/50 p-2 rounded-md">
            <BulkActions
              selectedProducts={selectedProducts}
              onClearSelection={handleClearSelection}
              onDeleteSelected={handleDeleteSelected}
              onDuplicateSelected={handleDuplicateSelected}
              onExportSelected={handleExportSelected}
              onRefreshInventory={handleRefreshInventory}
            />
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium">Processing... Please wait</p>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid
          products={filteredProducts}
          categories={categories}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
          selectedProducts={selectedProducts}
          onProductSelection={handleProductSelection}
        />
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg p-6">
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterCategory 
              ? "No products found matching your filters." 
              : "No products found in the database."}
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setFilterCategory(null);
              setDateRange(undefined);
              setSortBy('newest');
            }}
            className="mr-2"
          >
            Clear Filters
          </Button>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Product
          </Button>
        </div>
      )}
      
      {/* Duplicate Modal */}
      <DuplicateModal
        product={productToDuplicate}
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onDuplicate={handleDuplicateProduct}
      />
    </motion.div>
  );
}
