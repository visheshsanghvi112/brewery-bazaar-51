
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Truck, ShieldCheck, Package } from "lucide-react";
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
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}, ${selectedColor}) added to your cart`,
    });
  };
  
  // Format stock status
  const formatStockStatus = () => {
    if (!selectedVariant) return "Select options";
    if (selectedVariant.stock > 10) return "In Stock";
    if (selectedVariant.stock > 0) return `Only ${selectedVariant.stock} left`;
    return "Out of Stock";
  };
  
  // Get stock status color
  const getStockStatusColor = () => {
    if (!selectedVariant) return "text-gray-500";
    if (selectedVariant.stock > 10) return "text-green-600";
    if (selectedVariant.stock > 0) return "text-amber-500";
    return "text-red-600";
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
          
          {/* Stock Status */}
          <div className="flex items-center">
            <span className="text-sm mr-2">Availability:</span>
            <span className={`text-sm font-medium ${getStockStatusColor()}`}>
              {formatStockStatus()}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
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
          </div>
          
          {/* Enhanced Shipping & Benefits Section */}
          <div className="border rounded-md p-4 space-y-3 bg-muted/30">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2 text-primary" />
              <div>
                <p className="text-sm font-medium">Free shipping</p>
                <p className="text-xs text-muted-foreground">On orders above ₹899</p>
              </div>
            </div>
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary" />
              <div>
                <p className="text-sm font-medium">Easy returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
              <div>
                <p className="text-sm font-medium">Secure checkout</p>
                <p className="text-xs text-muted-foreground">Encrypted payment processing</p>
              </div>
            </div>
          </div>
          
          <ProductActions 
            product={product}
            selectedVariantId={selectedVariant?.id || ''}
            quantity={quantity}
            onAddToCart={handleAddToCart}
          />
        </motion.div>
      </div>
      
      {/* Product Details Sections */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="space-y-8">
          {/* Description Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
              
              {/* Additional product details if available */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-medium">Features:</h3>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    <li>Premium quality material</li>
                    <li>Comfortable fit</li>
                    <li>Durable and long-lasting</li>
                    <li>Easy to maintain</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Care Instructions:</h3>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    <li>Machine wash cold</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                    <li>Iron on low heat if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating and Reviews Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ratings & Reviews</h2>
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-muted-foreground">
                ({product.reviews} {product.reviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <Reviews productId={id || ''} rating={product.rating} reviewCount={product.reviews} />
    </div>
  );
}
