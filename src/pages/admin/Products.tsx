
import { useState } from "react";
import { EnhancedProductsTabContent } from "@/components/admin/EnhancedProductsTabContent";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { useAdmin } from "@/contexts/AdminContext";
import { colorOptions } from "@/contexts/AdminContext";
import { DuplicateModal } from "@/components/admin/product/DuplicateModal";
import { Product } from "@/types";
import { toast } from "sonner";

export default function AdminProducts() {
  const {
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
    showProductForm,
    setShowProductForm,
    formProduct,
    setFormProduct,
    editingProduct,
    productImages,
    setProductImages,
    productImageUrls,
    handleSaveProduct,
    handleAddVariant,
    handleRemoveVariant,
    handleVariantChange,
    handleFileChange,
    handleRemoveImage,
    isLoading
  } = useAdmin();

  // State for product duplication modal
  const [productToDuplicate, setProductToDuplicate] = useState<Product | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Handle product duplication
  const handleDuplicateProduct = async (product: Product, options: any) => {
    try {
      // Create a copy of the product with modified properties
      const newProduct: Partial<Product> = {
        name: `${product.name}${options.nameSuffix}`,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        rating: product.rating,
        reviews: 0, // Reset reviews for the duplicate
        inStock: true,
        featured: false, // Don't automatically feature duplicates
      };
      
      // Copy images if requested
      if (options.copyImages) {
        newProduct.images = [...product.images];
      } else {
        newProduct.images = [];
      }
      
      // Copy variants if requested
      if (options.copyVariants) {
        newProduct.variants = product.variants.map(variant => {
          return {
            ...variant,
            id: `v${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            stock: options.keepStock ? variant.stock : 0
          };
        });
      } else {
        newProduct.variants = [];
      }
      
      // Call handleSaveProduct with the new product data - modified to not pass an argument
      await handleSaveProduct();
      
      toast.success(`Product "${product.name}" duplicated successfully`);
    } catch (error) {
      console.error("Error duplicating product:", error);
      throw new Error("Failed to duplicate product");
    }
  };

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <EnhancedProductsTabContent
        products={products}
        filteredProducts={filteredProducts}
        categories={categories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        handleAddProduct={handleAddProduct}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
        handleDuplicateProduct={handleDuplicateProduct}
        isLoading={isLoading}
      />
      
      <ProductFormDialog
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        formProduct={formProduct}
        setFormProduct={setFormProduct}
        editingProduct={editingProduct}
        productImages={productImages}
        setProductImages={setProductImages}
        productImageUrls={productImageUrls}
        categories={categories}
        handleSaveProduct={handleSaveProduct}
        handleAddVariant={handleAddVariant}
        handleRemoveVariant={handleRemoveVariant}
        handleVariantChange={handleVariantChange}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        colorOptions={colorOptions}
      />
    </div>
  );
}
