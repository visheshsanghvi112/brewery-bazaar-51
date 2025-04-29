
import React, { createContext, useContext, useReducer } from 'react';
import { Product, ProductVariant, Cart, Order, Address, Customer, OrderStatus, ReturnRequest, ReturnStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
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
import { saveOrder } from '@/lib/firebase/userOperations';
import { auth, db } from '@/integrations/firebase/client';
import { doc, getDoc, setDoc, runTransaction, collection, addDoc } from 'firebase/firestore';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);
  const { toast } = useToast();
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  const [returnRequests, setReturnRequests] = useLocalStorage<ReturnRequest[]>("returnRequests", []);
  
  const addItem = (product: Product, variant: ProductVariant, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} (${variant.size}, ${variant.color}) added to cart`,
    });
  };
  
  const removeItem = (productId: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
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
  };
  
  const setShippingAddress = (address: Address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  };
  
  const setBillingAddress = (address: Address) => {
    dispatch({ type: 'SET_BILLING_ADDRESS', payload: address });
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
      
      // Update customer ID with auth user ID if available
      const enhancedCustomer = {
        ...customer,
        id: auth.currentUser.uid || customer.id,
      };
      
      const { newOrder, orderId } = await createOrder(state, enhancedCustomer, paymentMethod, orders);
      
      // Save order using Firebase operation
      await saveOrder(auth.currentUser.uid, newOrder);
      
      // Also save to local storage for now (can be removed later if not needed)
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
          const returnRef = collection(db, "returnRequests");
          await addDoc(returnRef, {
            ...returnRequest,
            userId: auth.currentUser.uid,
            updatedAt: new Date().toISOString()
          });
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
