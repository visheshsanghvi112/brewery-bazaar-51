
import { Address, CartItem, Product, ProductVariant } from "@/types";

export type CartState = {
  items: CartItem[];
  total: number;
  shippingAddress: Address | null;
  billingAddress: Address | null;
};

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address }
  | { type: 'SET_BILLING_ADDRESS'; payload: Address }
  | { type: 'CLEAR_CART' };

export const initialState: CartState = {
  items: [],
  total: 0,
  shippingAddress: null,
  billingAddress: null
};

// Calculate total price from cart items
export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

// Load cart from localStorage if available
export const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') return initialState;
  
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : initialState;
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            productId: product.id,
            variantId: variant.id,
            product,
            selectedVariant: variant,
            quantity
          }
        ];
      }
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
      break;
    }
    
    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload;
      const newItems = state.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      const newItems = state.items.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
      break;
    }
    
    case 'SET_SHIPPING_ADDRESS': {
      newState = {
        ...state,
        shippingAddress: action.payload
      };
      break;
    }
    
    case 'SET_BILLING_ADDRESS': {
      newState = {
        ...state,
        billingAddress: action.payload
      };
      break;
    }
    
    case 'CLEAR_CART': {
      newState = {
        ...initialState
      };
      break;
    }
    
    default:
      return state;
  }
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(newState));
  }
  
  return newState;
};
