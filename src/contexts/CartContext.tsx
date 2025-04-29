
import React, { createContext, useContext, useReducer } from 'react';
import { Product, ProductVariant, Cart, Order, Address, Customer, ReturnRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  cartReducer, 
  initialState, 
  loadCartFromStorage, 
  CartState
} from './cart/cartReducer';
import { CartContextType } from './cart/cartTypes';
import { useCartOperations } from '@/hooks/use-cart-operations';
import { useOrderOperations } from '@/hooks/use-order-operations';
import { useUserDataLoader } from '@/hooks/use-user-data-loader';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  const [returnRequests, setReturnRequests] = useLocalStorage<ReturnRequest[]>("returnRequests", []);
  
  // Use our custom hooks
  const { 
    addItem, 
    removeItem, 
    updateQuantity, 
    setShippingAddress, 
    setBillingAddress, 
    clearCart 
  } = useCartOperations(state, dispatch);
  
  const { 
    placeOrder, 
    requestReturn 
  } = useOrderOperations(
    state, 
    orders, 
    setOrders, 
    customers, 
    setCustomers, 
    returnRequests, 
    setReturnRequests, 
    clearCart
  );
  
  // Load user data from Firestore
  useUserDataLoader(orders, setOrders, returnRequests, setReturnRequests, dispatch);
  
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
