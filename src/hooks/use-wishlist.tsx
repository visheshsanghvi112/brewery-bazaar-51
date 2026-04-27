
import { useGlobalWishlist } from "@/contexts/WishlistContext";

export function useWishlist(productId?: string) {
  const { wishlistItems, isInWishlist, toggleWishlist, loading } = useGlobalWishlist();

  return {
    isInWishlist: productId ? isInWishlist(productId) : false,
    wishlistItems,
    loading,
    toggleWishlist
  };
}
