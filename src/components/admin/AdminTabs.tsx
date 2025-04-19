
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Package, ShoppingCart, Users, RefreshCw } from "lucide-react";
import { DashboardTabContent } from "./DashboardTabContent";
import { ProductsTabContent } from "./ProductsTabContent";
import { OrdersTabContent } from "./OrdersTabContent";
import { CustomersTabContent } from "./CustomersTabContent";
import { ProductFormDialog } from "./ProductFormDialog";
import { ReturnsTabContent } from "./ReturnsTabContent";
import { AdminProvider, colorOptions } from "@/contexts/AdminContext";
import { useAdmin } from "@/contexts/AdminContext";

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const {
    orders,
    customers,
    categories,
    filteredProducts,
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
    setViewingOrder
  } = useAdmin();
  
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Returns
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <DashboardTabContent orders={orders} setActiveTab={setActiveTab} />
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <ProductsTabContent 
            products={[]}  // This will use the context instead
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
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <OrdersTabContent
            orders={orders}
            setViewingOrder={setViewingOrder}
          />
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns">
          <ReturnsTabContent />
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers">
          <CustomersTabContent customers={customers} />
        </TabsContent>
      </Tabs>
      
      {/* Product form dialog */}
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
    </>
  );
}
