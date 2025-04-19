import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Product, Order, OrderStatus } from "@/types";
import { products as initialProducts, categories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

// Define the context type
interface AdminContextType {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  filteredProducts: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  
  // Categories
  categories: any[];
  
  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  
  // Customers
  customers: any[];
  
  // Product form state
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  formProduct: Partial<Product>;
  setFormProduct: (product: Partial<Product>) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  
  // Product image state
  productImages: (File | null)[];
  setProductImages: (images: (File | null)[]) => void;
  productImageUrls: string[];
  setProductImageUrls: (urls: string[]) => void;
  
  // Orders state
  viewingOrder: Order | null;
  setViewingOrder: (order: Order | null) => void;
  
  // Admin functions
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
}

// Create the context with a default value
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Color options for variants
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

// Provider component
export function AdminProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [productImages, setProductImages] = useState<(File | null)[]>([null]);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  
  // Get products from localStorage or use initial data
  const [products, setProducts] = useLocalStorage<Product[]>("products", initialProducts);
  
  // Get orders from localStorage or use empty array
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  
  // Get customers from localStorage
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  
  // Form state for product editing/creation
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
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === null || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Handle add new product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormProduct({
      name: "",
      description: "",
      price: 2000,
      category: "t-shirts",
      images: [],
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
    setProductImageUrls([]);
    setShowProductForm(true);
  };
  
  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormProduct(product);
    setProductImages([null]);
    setProductImageUrls(product.images || []);
    setShowProductForm(true);
  };
  
  // Handle delete product
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed.",
    });
  };
  
  // Handle save product (add or update)
  const handleSaveProduct = () => {
    if (!formProduct.name || !formProduct.price || !formProduct.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure there's at least one image
    if (!formProduct.images?.length) {
      toast({
        title: "Missing image",
        description: "Please add at least one product image.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...formProduct as Product, id: editingProduct.id } : p
      ));
      
      toast({
        title: "Product updated",
        description: `${formProduct.name} has been updated successfully.`,
      });
    } else {
      // Add new product
      const newId = `product-${Date.now()}`;
      const newProduct = {
        ...formProduct as Product,
        id: newId,
      };
      
      setProducts([...products, newProduct]);
      
      toast({
        title: "Product added",
        description: `${formProduct.name} has been added successfully.`,
      });
    }
    
    setShowProductForm(false);
  };
  
  // Handle add variant
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
  
  // Handle remove variant
  const handleRemoveVariant = (variantId: string) => {
    const updatedVariants = formProduct.variants?.filter(v => v.id !== variantId) || [];
    setFormProduct({
      ...formProduct,
      variants: updatedVariants
    });
  };
  
  // Handle variant change
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
  
  // Handle update order status
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
  
  // Handle file change
  const handleFileChange = (index: number, file: File | null) => {
    const newProductImages = [...productImages];
    newProductImages[index] = file;
    
    // If this was the last slot and a file was added, create a new empty slot
    if (index === productImages.length - 1 && file) {
      newProductImages.push(null);
    }
    
    setProductImages(newProductImages);
  };
  
  // Handle image upload changes
  useEffect(() => {
    // Convert any uploaded files to data URLs
    const convertFilesToUrls = async () => {
      const urls: string[] = [];
      
      for (const fileOrNull of productImages) {
        if (fileOrNull) {
          const url = await readFileAsDataURL(fileOrNull);
          urls.push(url);
        }
      }
      
      // Maintain existing image URLs that came from formProduct
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
  
  // Read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };
  
  // Handle remove image
  const handleRemoveImage = (index: number) => {
    // Remove from URLs array
    const newUrls = [...productImageUrls];
    newUrls.splice(index, 1);
    setProductImageUrls(newUrls);
    
    // Update form product
    setFormProduct(prev => ({
      ...prev,
      images: newUrls
    }));
    
    // If this was a file upload slot, remove it from productImages as well
    if (index < productImages.length) {
      const newProductImages = [...productImages];
      newProductImages.splice(index, 1);
      
      // Make sure we always have at least one upload slot
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
      handleRemoveImage
    }}>
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook for using the context
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
