
import { Product } from "@/types";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductComparisonTableProps {
  products: Product[];
}

export function ProductComparisonTable({ products }: ProductComparisonTableProps) {
  const { removeFromCompare } = useCompare();
  const { addItem } = useCart();
  
  // Get all unique properties from variants for comparison
  const getVariantProperties = () => {
    const properties = new Set<string>();
    products.forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          properties.add('size');
          properties.add('color');
        });
      }
    });
    return Array.from(properties);
  };
  
  const variantProperties = getVariantProperties();
  
  const handleAddToCart = (product: Product) => {
    if (product.variants.length === 0) {
      toast.error("No variants available for this product");
      return;
    }
    
    // Find the variant with the most stock
    const defaultVariant = product.variants.reduce(
      (prev, current) => (current.stock > prev.stock ? current : prev),
      product.variants[0]
    );
    
    if (defaultVariant.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    addItem(product, defaultVariant, 1);
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <ScrollArea className="h-full max-h-[60vh]">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 text-left min-w-[120px] border-r border-border">Features</th>
              {products.map((product) => (
                <th key={product.id} className="p-2 text-center min-w-[180px] border-r border-border relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeFromCompare(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="pt-4">
                    <Link to={`/products/${product.id}`} className="block">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-24 h-24 object-contain mx-auto mb-2"
                      />
                    </Link>
                    <Link 
                      to={`/products/${product.id}`} 
                      className="font-medium hover:text-primary text-sm"
                    >
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 font-medium border-r border-border">Price</td>
              {products.map((product) => (
                <td key={product.id} className="p-2 text-center border-r border-border">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-primary">₹{(product.price / 100).toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{(product.originalPrice / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="bg-muted/30">
              <td className="p-2 font-medium border-r border-border">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="p-2 text-center border-r border-border">
                  <div className="flex items-center justify-center">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs">({product.reviews})</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 font-medium border-r border-border">Category</td>
              {products.map((product) => (
                <td key={product.id} className="p-2 text-center border-r border-border capitalize">
                  {product.category.replace('-', ' ')}
                </td>
              ))}
            </tr>
            {variantProperties.map((property) => (
              <tr key={property} className="bg-muted/30">
                <td className="p-2 font-medium border-r border-border capitalize">
                  Available {property}s
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-2 text-center border-r border-border">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {property === 'size' ? (
                        [...new Set(product.variants.map(v => v.size))].map(size => (
                          <span key={size} className="px-2 py-1 text-xs bg-secondary rounded">
                            {size}
                          </span>
                        ))
                      ) : property === 'color' ? (
                        [...new Set(product.variants.map(v => v.color))].map(color => (
                          <div 
                            key={color} 
                            className="flex items-center gap-1"
                            title={color}
                          >
                            <span
                              className="w-4 h-4 rounded-full border"
                              style={{ 
                                backgroundColor: product.variants.find(v => v.color === color)?.colorCode || color 
                              }}
                            />
                          </div>
                        ))
                      ) : null}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-2 font-medium border-r border-border">Description</td>
              {products.map((product) => (
                <td key={product.id} className="p-2 text-center border-r border-border">
                  <div className="text-xs text-muted-foreground line-clamp-3 max-w-[250px] mx-auto">
                    {product.description}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="bg-muted/30">
              <td className="p-2 font-medium border-r border-border">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="p-2 text-center border-r border-border">
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.variants.length === 0 || !product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Link to={`/products/${product.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}
