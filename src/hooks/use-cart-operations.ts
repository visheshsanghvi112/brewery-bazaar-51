
import { useToast } from '@/hooks/use-toast';
import { Product, ProductVariant, Address } from '@/types';
import { CartState, CartAction } from '@/contexts/cart/cartReducer';
import { auth, db } from '@/integrations/firebase/client';
import { doc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { saveShippingDetails } from '@/lib/firebase/collections';

export function useCartOperations(state: CartState, dispatch: React.Dispatch<CartAction>) {
  const { toast } = useToast();
  
  // Function to sync cart with Firestore for logged-in users
  const syncCartWithFirestore = async () => {
    if (auth.currentUser) {
      try {
        const userId = auth.currentUser.uid;
        const userCartRef = doc(db, COLLECTIONS.USER_CARTS, userId);
        
        await setDoc(userCartRef, {
          items: state.items,
          total: state.total,
          shippingAddress: state.shippingAddress,
          billingAddress: state.billingAddress,
          updatedAt: new Date().toISOString()
        });
        
        console.log("Cart synced with Firestore");
      } catch (error) {
        console.error("Error syncing cart with Firestore:", error);
      }
    }
  };
  
  const addItem = (product: Product, variant: ProductVariant, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} (${variant.size}, ${variant.color}) added to cart`,
    });
    
    // Sync with Firestore for logged-in users
    syncCartWithFirestore();
  };
  
  const removeItem = (productId: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
    
    // Sync with Firestore for logged-in users
    syncCartWithFirestore();
  };
  
  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const item = state.items.find(
      item => item.productId === productId && item.variantId === variantId
    );
    
    if (item && quantity > item.selectedVariant.stock) {
      toast({
        title: 'Maximum stock reached',
        description: `Only ${item.selectedVariant.stock} items available`,
        variant: 'destructive',
      });
      return;
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
    
    // Sync with Firestore for logged-in users
    syncCartWithFirestore();
  };
  
  const setShippingAddress = (address: Address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
    
    // Save shipping address to Firestore for logged-in users
    if (auth.currentUser) {
      saveShippingDetails(auth.currentUser.uid, address, state.billingAddress);
    }
    
    // Also sync cart with Firestore
    syncCartWithFirestore();
  };
  
  const setBillingAddress = (address: Address) => {
    dispatch({ type: 'SET_BILLING_ADDRESS', payload: address });
    
    // Save billing address to Firestore for logged-in users
    if (auth.currentUser && state.shippingAddress) {
      saveShippingDetails(auth.currentUser.uid, state.shippingAddress, address);
    }
    
    // Also sync cart with Firestore
    syncCartWithFirestore();
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    
    // Also clear the cart in Firestore if the user is logged in
    if (auth.currentUser) {
      try {
        const userCartRef = doc(db, COLLECTIONS.USER_CARTS, auth.currentUser.uid);
        setDoc(userCartRef, { 
          items: [],
          total: 0,
          updatedAt: new Date().toISOString() 
        });
      } catch (error) {
        console.error("Error clearing cart in Firestore:", error);
      }
    }
  };
  
  return {
    addItem,
    removeItem,
    updateQuantity,
    setShippingAddress,
    setBillingAddress,
    clearCart,
    syncCartWithFirestore
  };
}
