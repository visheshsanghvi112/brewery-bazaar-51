
import { ProductsTabContent } from "@/components/admin/ProductsTabContent";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { useAdmin } from "@/contexts/AdminContext";
import { colorOptions } from "@/contexts/AdminContext";

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
    handleRemoveImage
  } = useAdmin();

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <ProductsTabContent
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
