
// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  variants: ProductVariant[];
  featured?: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorCode: string;
  stock: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  selectedVariant: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// UI State Types
export interface FilterState {
  category: string | null;
  price: number[];
  size: string | null;
  color: string | null;
}

// Address Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Order Types
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  notes?: string;
}
