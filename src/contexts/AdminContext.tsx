
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
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await getProductsFromFirestore();
        setProducts(fetchedProducts);
        console.log("Products loaded from Firestore:", fetchedProducts.length);
      } catch (error) {
        console.error("Error loading products from Firestore:", error);
        toast({
          title: "Error",
          description: "Failed to load products from database",
          variant: "destructive",
        });
      }
    };

    loadProducts();
  }, [toast]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormProduct({
      name: "",
      description: "",
      price: 2000,
      category: "t-shirts",
      images: ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"], // Default image
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
    setProductImageUrls(["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"]); // Set default image
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
    setFormProduct({...product});
    setProductImages([null]);
    setProductImageUrls(product.images || []);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductFromFirestore(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "The product has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async () => {
    console.log("Saving product with data:", formProduct);

    if (!formProduct.name || !formProduct.price || !formProduct.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Always ensure there is at least one image (either from productImageUrls or default)
    const images = productImageUrls.length > 0 
      ? productImageUrls 
      : ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"];

    // Create a clean product object without undefined values
    const productToSave: Partial<Product> = {
      ...formProduct,
      images
    };

    // If originalPrice is empty string or 0, set to null to avoid Firestore errors
    if (!productToSave.originalPrice) {
      productToSave.originalPrice = null;
    }

    try {
      if (editingProduct) {
        console.log("Updating existing product:", editingProduct.id);
        await updateProductInFirestore(editingProduct.id, productToSave);
        
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productToSave, id: editingProduct.id } 
            : p
        ));
        
        toast({
          title: "Product updated",
          description: `${formProduct.name} has been updated successfully.`,
        });
      } else {
        console.log("Adding new product");
        const newProductId = await addProductToFirestore(productToSave as Omit<Product, 'id'>);
        
        const newProduct = {
          ...productToSave,
          id: newProductId,
        } as Product;
        
        setProducts([...products, newProduct]);
        
        toast({
          title: "Product added",
          description: `${formProduct.name} has been added successfully.`,
        });
      }
      
      setShowProductForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
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
      handleRemoveImage
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
