import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Product, Order, OrderStatus } from "@/types";
import { categories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore,
  getProductsFromFirestore 
} from "@/lib/firebase/productOperations";

interface AdminContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  filteredProducts: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  
  categories: any[];
  
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  
  customers: any[];
  
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  formProduct: Partial<Product>;
  setFormProduct: (product: Partial<Product>) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  
  productImages: (File | null)[];
  setProductImages: (images: (File | null)[]) => void;
  productImageUrls: string[];
  setProductImageUrls: (urls: string[]) => void;
  
  viewingOrder: Order | null;
  setViewingOrder: (order: Order | null) => void;
  
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  handleSaveProduct: () => void;
  handleAddVariant: () => void;
  handleRemoveVariant: (variantId: string) => void;
  handleVariantChange: (variantId: string, field: string, value: any) => void;
  handleUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  handleFileChange: (index: number, file: File | null) => void;
  handleRemoveImage: (index: number) => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const colorOptions = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Gray", code: "#808080" },
  { name: "Navy", code: "#000080" },
  { name: "Red", code: "#FF0000" },
  { name: "Green", code: "#008000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Yellow", code: "#FFFF00" }
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [productImages, setProductImages] = useState<(File | null)[]>([null]);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 2000,
    category: "t-shirts",
    images: ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"],
    variants: [
      {
        id: "var1",
        size: "M",
        color: "Black",
        colorCode: "#000000",
        stock: 10
      }
    ],
    rating: 4.5,
    reviews: 0,
    inStock: true
  });
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === null || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Enhanced products fetching with better error handling
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      console.log("Starting to fetch products from Firestore");
      
      const fetchedProducts = await getProductsFromFirestore();
      
      if (fetchedProducts.length === 0) {
        console.warn("No products were fetched from Firestore");
        toast({
          title: "Warning",
          description: "No products found in the database",
          variant: "default",
        });
      } else {
        console.log("Successfully loaded products:", fetchedProducts.length);
        setProducts(fetchedProducts);
        toast({
          title: "Success",
          description: `Loaded ${fetchedProducts.length} products from the database`,
        });
      }
    } catch (error) {
      console.error("Error loading products from Firestore:", error);
      toast({
        title: "Error",
        description: "Failed to load products from database. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load products when the component mounts
  useEffect(() => {
    console.log("AdminProvider mounted - loading products");
    loadProducts();
    
    // Add a periodic check to ensure we have products
    const intervalId = setInterval(() => {
      if (products.length === 0) {
        console.log("No products found in state, reloading...");
        loadProducts();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAddProduct = () => {
    console.log("Adding new product - resetting form");
    setEditingProduct(null);
    setFormProduct({
      name: "",
      description: "",
      price: 2000,
      category: "t-shirts",
      images: ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"],
      variants: [
        {
          id: "var1",
          size: "M",
          color: "Black",
          colorCode: "#000000",
          stock: 10
        }
      ],
      rating: 4.5,
      reviews: 0,
      inStock: true
    });
    setProductImages([null]);
    setProductImageUrls(["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"]);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    console.log("Editing product:", product);
    if (!product || !product.id) {
      toast({
        title: "Error",
        description: "Invalid product data. Cannot edit.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingProduct(product);
    setFormProduct({...product});
    setProductImages([null]);
    setProductImageUrls(product.images || []);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) {
      toast({
        title: "Error",
        description: "Invalid product ID. Cannot delete.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Deleting product with ID:", productId);
      setIsLoading(true);
      
      // Call the Firestore operation directly
      await deleteProductFromFirestore(productId);
      
      // Update local state after successful deletion
      setProducts(prevProducts => {
        const updatedProducts = prevProducts.filter(p => p.id !== productId);
        console.log(`Product ${productId} removed. Remaining products: ${updatedProducts.length}`);
        return updatedProducts;
      });
      
      toast({
        title: "Success",
        description: "Product has been successfully deleted",
        variant: "default", 
      });
      
      // If there are no products after deletion, reload to make sure we didn't miss any
      if (products.length <= 1) {
        console.log("Few or no products left, reloading from Firestore");
        await loadProducts();
      }
    } catch (error) {
      console.error("Error in handleDeleteProduct:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product. Check console for details.",
        variant: "destructive",
      });
      
      // Reload products to ensure state is in sync with Firestore
      await loadProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      setIsLoading(true);
      console.log("Saving product with data:", formProduct);

      // Validate required fields
      if (!formProduct.name || formProduct.name.trim() === '') {
        toast({
          title: "Missing information",
          description: "Product name is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!formProduct.price || formProduct.price <= 0) {
        toast({
          title: "Invalid price",
          description: "Product price must be greater than zero",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!formProduct.category) {
        toast({
          title: "Missing information",
          description: "Please select a category",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const images = productImageUrls.length > 0 
        ? productImageUrls 
        : ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"];

      const productToSave: Partial<Product> = {
        ...formProduct,
        images
      };

      if (!productToSave.originalPrice || productToSave.originalPrice === 0) {
        productToSave.originalPrice = null;
      }
      
      console.log("Product prepared for saving:", productToSave);

      if (editingProduct && editingProduct.id) {
        console.log("Updating existing product with ID:", editingProduct.id);
        await updateProductInFirestore(editingProduct.id, productToSave);
        
        // Update local state after successful update
        setProducts(prevProducts => prevProducts.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productToSave, id: editingProduct.id } 
            : p
        ));
        
        toast({
          title: "Success",
          description: `${formProduct.name} has been updated successfully`,
          variant: "default", 
        });
      } else {
        console.log("Adding new product");
        const newProductId = await addProductToFirestore(productToSave as Omit<Product, 'id'>);
        
        const newProduct = {
          ...productToSave,
          id: newProductId,
        } as Product;
        
        // Update local state after successful addition
        setProducts(prevProducts => [...prevProducts, newProduct]);
        
        toast({
          title: "Success",
          description: `${formProduct.name} has been added successfully`,
          variant: "default", 
        });
      }
      
      setShowProductForm(false);
      
      // Reload products to ensure we have the latest data
      console.log("Reloading all products from Firestore to ensure consistency");
      await loadProducts();
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = () => {
    const variants = formProduct.variants || [];
    const newVariant = {
      id: `var-${Date.now()}`,
      size: "M",
      color: "Black",
      colorCode: "#000000",
      stock: 10
    };
    
    setFormProduct({
      ...formProduct,
      variants: [...variants, newVariant]
    });
  };

  const handleRemoveVariant = (variantId: string) => {
    const updatedVariants = formProduct.variants?.filter(v => v.id !== variantId) || [];
    setFormProduct({
      ...formProduct,
      variants: updatedVariants
    });
  };

  const handleVariantChange = (variantId: string, field: string, value: any) => {
    const updatedVariants = formProduct.variants?.map(v => {
      if (v.id === variantId) {
        return { ...v, [field]: value };
      }
      return v;
    }) || [];
    
    setFormProduct({
      ...formProduct,
      variants: updatedVariants
    });
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    
    setOrders(updatedOrders);
    
    toast({
      title: "Order updated",
      description: `Order #${orderId} status changed to ${status}`,
    });
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newProductImages = [...productImages];
    newProductImages[index] = file;
    
    if (index === productImages.length - 1 && file) {
      newProductImages.push(null);
    }
    
    setProductImages(newProductImages);
  };

  useEffect(() => {
    const convertFilesToUrls = async () => {
      const urls: string[] = [];
      
      for (const fileOrNull of productImages) {
        if (fileOrNull) {
          const url = await readFileAsDataURL(fileOrNull);
          urls.push(url);
        }
      }
      
      const existingUrls = formProduct.images?.filter(url => 
        !url.startsWith('blob:') && !url.startsWith('data:')
      ) || [];
      
      const allUrls = [...existingUrls, ...urls];
      
      setProductImageUrls(allUrls);
      setFormProduct(prev => ({
        ...prev,
        images: allUrls
      }));
    };
    
    convertFilesToUrls();
  }, [productImages]);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = [...productImageUrls];
    newUrls.splice(index, 1);
    setProductImageUrls(newUrls);
    
    setFormProduct(prev => ({
      ...prev,
      images: newUrls
    }));
    
    if (index < productImages.length) {
      const newProductImages = [...productImages];
      newProductImages.splice(index, 1);
      
      if (newProductImages.length === 0) {
        newProductImages.push(null);
      }
      
      setProductImages(newProductImages);
    }
  };

  return (
    <AdminContext.Provider value={{
      products,
      setProducts,
      filteredProducts,
      searchTerm,
      setSearchTerm,
      filterCategory,
      setFilterCategory,
      orders,
      setOrders,
      customers,
      categories,
      editingProduct,
      setEditingProduct,
      formProduct,
      setFormProduct,
      showProductForm,
      setShowProductForm,
      productImages,
      setProductImages,
      productImageUrls,
      setProductImageUrls,
      viewingOrder,
      setViewingOrder,
      handleAddProduct,
      handleEditProduct,
      handleDeleteProduct,
      handleSaveProduct,
      handleAddVariant,
      handleRemoveVariant,
      handleVariantChange,
      handleUpdateOrderStatus,
      handleFileChange,
      handleRemoveImage,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
