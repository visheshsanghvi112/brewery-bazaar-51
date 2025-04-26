
import { useAdmin } from "@/contexts/AdminContext";
import { ProductsTabContent } from "@/components/admin/ProductsTabContent";

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
    </div>
  );
}
