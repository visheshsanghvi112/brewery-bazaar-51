
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
import { auth } from '@/integrations/firebase/client';

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
    
    // Find the item and check stock
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
      // Check if user is authenticated
      if (!auth.currentUser) {
        toast({
          title: 'Authentication required',
          description: 'Please login to place an order',
          variant: 'destructive',
        });
        return null;
      }
      
      // Create the order
      const { newOrder, orderId } = createOrder(state, customer, paymentMethod, orders);
      
      // Save to Firestore if user is authenticated
      await saveOrder(auth.currentUser.uid, newOrder);
      
      // Add to orders in localStorage
      setOrders([...orders, newOrder]);
      
      // Update customer information
      const updatedCustomers = updateCustomer(customer, customers, newOrder.total);
      setCustomers(updatedCustomers);
      
      // Clear cart
      clearCart();
      
      // Show success message
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

  const requestReturn = (orderId: string, items: any[], reason: string) => {
    // Find the order
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast({
        title: 'Error',
        description: 'Order not found',
        variant: 'destructive',
      });
      return {} as ReturnRequest;
    }

    // Create a return request
    const returnRequest: ReturnRequest = {
      id: `return-${Date.now()}`,
      orderId,
      orderDate: order.date,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      items,
      reason,
      status: 'Requested' as ReturnStatus,
      createdAt: new Date().toISOString(),
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Schedule pickup in 2 days
    };

    // Update the orders status
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

    // Update local storage
    setReturnRequests([...returnRequests, returnRequest]);
    setOrders(updatedOrders);

    // Show success message
    toast({
      title: 'Return requested',
      description: `Your return for order #${orderId} has been requested and will be picked up on ${new Date(returnRequest.scheduledDate).toLocaleDateString()}.`,
    });

    return returnRequest;
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
