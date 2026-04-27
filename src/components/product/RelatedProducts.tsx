import { useState, useEffect } from "react";
import { Product } from "@/types";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        // E-commerce Core: Fetch active products in the exact same category
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("category", "==", category),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        
        snapshot.forEach((doc) => {
          if (doc.id !== currentProductId) { // Prevent self-referencing
            const data = doc.data();
            // Basic mapping logic
            fetchedProducts.push({
              id: doc.id,
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
            });
          }
        });
        
        // Exact limitation to 4 products for grid aesthetics
        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to load related products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (category) {
      fetchRelatedProducts();
    }
  }, [currentProductId, category]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">You May Also Like</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} isMobile={false} />
        ))}
      </div>
    </div>
  );
}
