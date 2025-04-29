
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  description: string;
}

export default function ProductInfo({
  name,
  category,
  rating,
  reviews,
  price,
  originalPrice,
  description
}: ProductInfoProps) {
  // Calculate discount percentage if original price exists
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : null;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <div className="text-sm text-muted-foreground mb-4 capitalize">
        {category.replace("-", " ")}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        
        {discountPercentage && discountPercentage > 0 && (
          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md">
            Save {discountPercentage}%
          </span>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground mb-6 line-clamp-3">
        {description}
      </div>
    </div>
  );
}
