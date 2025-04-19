
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useProductDetail } from "@/hooks/use-product-detail";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductVariants from "@/components/product/ProductVariants";
import ProductQuantity from "@/components/product/ProductQuantity";
import ProductActions from "@/components/product/ProductActions";
import ProductShippingInfo from "@/components/product/ProductShippingInfo";
import Reviews from "@/components/product/Reviews";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const { 
    product, 
    loading, 
    selectedSize, 
    selectedColor, 
    selectedVariant, 
    quantity, 
    decreaseQuantity, 
    increaseQuantity, 
    handleVariantChange 
  } = useProductDetail(id);
  
  // If product is loading, show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Loading product details...</p>
      </div>
    );
  }
  
  // If product not found, show a message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/products")}>
          Browse Products
        </Button>
      </div>
    );
  }
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Select both size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedVariant) {
      toast({
        title: "Variant not available",
        description: "The selected combination is not available",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedVariant.stock < quantity) {
      toast({
        title: "Not enough stock",
        description: `Only ${selectedVariant.stock} items available`,
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart using context
    addItem(product, selectedVariant, quantity);
    
    // Navigate to cart
    navigate("/cart");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 -ml-3 hover:bg-secondary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <ProductImageGallery images={product.images} productName={product.name} />
        
        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <ProductInfo 
            name={product.name}
            category={product.category}
            rating={product.rating}
            reviews={product.reviews}
            price={product.price}
            originalPrice={product.originalPrice}
            description={product.description}
          />
          
          <ProductVariants 
            variants={product.variants} 
            onVariantChange={handleVariantChange} 
          />
          
          <ProductQuantity 
            quantity={quantity}
            stock={selectedVariant?.stock}
            onDecrease={decreaseQuantity}
            onIncrease={increaseQuantity}
          />
          
          <ProductShippingInfo />
          
          <ProductActions 
            product={product}
            selectedVariantId={selectedVariant?.id || ''}
            quantity={quantity}
            onAddToCart={handleAddToCart}
          />
        </motion.div>
      </div>
      
      {/* Reviews Section */}
      <Reviews productId={id || ''} rating={product.rating} reviewCount={product.reviews} />
    </div>
  );
}
