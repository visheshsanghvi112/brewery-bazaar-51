import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, ProductVariant, Cart, Order, Address, Customer, OrderStatus, ReturnRequest, ReturnStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  cartReducer, 
  initialState, 
  loadCartFromStorage, 
  CartState, 
  CartAction 
} from './cart/cartReducer';
import { CartContextType } from './cart/cartTypes';
import { createOrder, updateCustomer } from './cart/orderManager';
import { saveOrder } from '@/lib/firebase/collections';
import { auth, db } from '@/integrations/firebase/client';
import { doc, getDoc, setDoc, runTransaction, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { 
  saveShippingDetails, 
  getShippingDetails, 
  saveCustomer, 
  createReturnRequest,
  getReturnRequests,
  COLLECTIONS 
} from '@/lib/firebase/collections';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);
  const { toast } = useToast();
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  const [returnRequests, setReturnRequests] = useLocalStorage<ReturnRequest[]>("returnRequests", []);
  
  // Load user's orders from Firestore when auth state changes
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (auth.currentUser) {
        try {
          const userId = auth.currentUser.uid;
          const ordersRef = collection(db, COLLECTIONS.ORDERS);
          const q = query(ordersRef, where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userOrders = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                ...data,
                id: data.id || doc.id,
                firestoreId: doc.id
              } as Order;
            });
            
            // Merge orders from local storage with orders from Firestore
            const existingOrderIds = orders.map(o => o.id);
            const newOrders = userOrders.filter(o => !existingOrderIds.includes(o.id));
            
            if (newOrders.length > 0) {
              setOrders([...orders, ...newOrders]);
            }
          }
          
          // Also fetch user's return requests
          const userReturnRequests = await getReturnRequests(userId);
          if (userReturnRequests.length > 0) {
            // Merge with local storage return requests
            const existingRequestIds = returnRequests.map(r => r.id);
            const newRequests = userReturnRequests.filter(r => !existingRequestIds.includes(r.id));
            
            if (newRequests.length > 0) {
              setReturnRequests([...returnRequests, ...newRequests]);
            }
          }
          
          // Load shipping details if available
          const shippingDetails = await getShippingDetails(userId);
          if (shippingDetails && 'shippingAddress' in shippingDetails && 'billingAddress' in shippingDetails) {
            dispatch({ 
              type: 'SET_SHIPPING_ADDRESS', 
              payload: shippingDetails.shippingAddress as Address 
            });
            
            dispatch({ 
              type: 'SET_BILLING_ADDRESS', 
              payload: shippingDetails.billingAddress as Address 
            });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
    };
    
    fetchUserOrders();
  }, [auth.currentUser]);
  
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
  
  const placeOrder = async (customer: Customer, paymentMethod: string) => {
    try {
      if (!auth.currentUser) {
        toast({
          title: 'Authentication required',
          description: 'Please login to place an order',
          variant: 'destructive',
        });
        return null;
      }
      
      // Check if user is admin and prevent checkout
      const userRole = localStorage.getItem("userRole");
      if (userRole === "admin") {
        toast({
          title: 'Admin checkout restricted',
          description: 'Admin users cannot place orders. Please use a regular user account to checkout.',
          variant: 'destructive',
        });
        return null;
      }
      
      // Update customer ID with auth user ID if available
      const enhancedCustomer = {
        ...customer,
        id: auth.currentUser.uid || customer.id,
      };
      
      // Save customer details to Firestore
      await saveCustomer(enhancedCustomer);
      
      const { newOrder, orderId } = await createOrder(state, enhancedCustomer, paymentMethod, orders);
      
      // Save order to Firestore
      await saveOrder({
        ...newOrder,
        userId: auth.currentUser.uid,
      });
      
      // Save order to local state
      setOrders([...orders, newOrder]);
      
      // Update customer information
      const updatedCustomers = updateCustomer(enhancedCustomer, customers, newOrder.total);
      setCustomers(updatedCustomers);
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: 'Order placed successfully',
        description: `Your order #${orderId} has been placed and is being processed.`,
      });
      
      return orderId;
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: 'Order placement failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const requestReturn = async (orderId: string, items: any[], reason: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast({
        title: 'Error',
        description: 'Order not found',
        variant: 'destructive',
      });
      return {} as ReturnRequest;
    }

    try {
      const sequenceNumber = await getNextSequence("return_sequence");
      const returnId = `BREW-RET-${formatSequenceNumber(sequenceNumber)}`;
      
      const returnRequest: ReturnRequest = {
        id: returnId,
        orderId,
        orderDate: order.date,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        items,
        reason,
        status: 'Requested' as ReturnStatus,
        createdAt: new Date().toISOString(),
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Save return request to Firestore if user is authenticated
      if (auth.currentUser) {
        try {
          // Add userId to return request
          (returnRequest as any).userId = auth.currentUser.uid;
          
          // Save to Firestore collection
          const firestoreId = await createReturnRequest(returnRequest);
          
          // Add the Firestore ID to the return request
          (returnRequest as any).firestoreId = firestoreId;
          
          // Also update the order to mark it as having a return request
          if (order.firestoreId) {
            const orderRef = doc(db, COLLECTIONS.ORDERS, order.firestoreId);
            await setDoc(orderRef, {
              status: 'Return Requested' as OrderStatus,
              returnRequest: returnId,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
          
          console.log(`Return request ${returnId} saved to Firestore`);
        } catch (error) {
          console.error("Error saving return request to Firestore:", error);
        }
      }

      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Return Requested' as OrderStatus,
            returnRequest: returnRequest.id
          };
        }
        return o;
      });

      setReturnRequests([...returnRequests, returnRequest]);
      setOrders(updatedOrders);

      toast({
        title: 'Return requested',
        description: `Your return for order #${orderId} has been requested and will be picked up on ${new Date(returnRequest.scheduledDate).toLocaleDateString()}.`,
      });

      return returnRequest;
    } catch (error) {
      console.error("Error requesting return:", error);
      toast({
        title: 'Return request failed',
        description: 'There was an error processing your return request. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
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
  
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
  
  const value = {
    cart: { items: state.items, total: state.total },
    shippingAddress: state.shippingAddress,
    billingAddress: state.billingAddress,
    addItem,
    removeItem,
    updateQuantity,
    setShippingAddress,
    setBillingAddress,
    placeOrder,
    clearCart,
    itemCount,
    orders,
    returnRequests,
    requestReturn
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const getNextSequence = async (sequenceName: string): Promise<number> => {
  const sequenceRef = doc(db, "sequences", sequenceName);
  
  try {
    const result = await runTransaction(db, async (transaction) => {
      const sequenceDoc = await transaction.get(sequenceRef);
      
      if (!sequenceDoc.exists()) {
        transaction.set(sequenceRef, { value: 1 });
        return 1;
      }
      
      const newValue = (sequenceDoc.data().value || 0) + 1;
      transaction.update(sequenceRef, { value: newValue });
      return newValue;
    });
    
    return result;
  } catch (error) {
    console.error("Error getting next sequence:", error);
    return Date.now();
  }
};

const formatSequenceNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};
