
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductVariant } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export function useProductDetail(id: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for product
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for selected options
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        // Get product from Firestore
        const productDoc = doc(db, "products", id);
        const productSnapshot = await getDoc(productDoc);
        
        if (productSnapshot.exists()) {
          const data = productSnapshot.data();
          const productData: Product = {
            id: productSnapshot.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            originalPrice: data.originalPrice,
            category: data.category || '',
            images: data.images || [],
            variants: data.variants || [],
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            inStock: data.inStock !== undefined ? data.inStock : true,
            featured: data.featured || false
          };
          
          setProduct(productData);
          
          // Set default selections if available
          if (productData.variants && productData.variants.length > 0) {
            const firstVariant = productData.variants[0];
            setSelectedSize(firstVariant.size);
            setSelectedColor(firstVariant.color);
          }
          
        } else {
          console.log("No such product!");
          toast({
            title: "Product not found",
            description: "The product you're looking for does not exist",
            variant: "destructive"
          });
          navigate("/products");
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, toast, navigate]);

  // Find selected variant based on size and color
  const selectedVariant = product?.variants.find(
    (variant) =>
      variant.size === selectedSize && variant.color === selectedColor
  );

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    } else if (!selectedVariant) {
      setQuantity(quantity + 1);
    }
  };

  // Handle variant selection
  const handleVariantChange = (size: string | null, color: string | null) => {
    setSelectedSize(size);
    setSelectedColor(color);
  };

  return {
    product,
    loading,
    selectedSize,
    selectedColor,
    selectedVariant,
    quantity,
    decreaseQuantity,
    increaseQuantity,
    handleVariantChange,
  };
}
