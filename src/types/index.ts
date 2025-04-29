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
  lifetimeValue?: number;
  segment?: 'new' | 'regular' | 'loyal' | 'vip';
  purchaseCount?: number;
  lastPurchaseDate?: string;
  loyaltyPoints?: number;
  joinedDate?: string;
}

// Order Types
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Returned';

// Return Status Types
export type ReturnStatus = 'Requested' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';

// Refund Status Types
export type RefundStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Not Applicable';

// Email notification status
export type EmailStatus = 'Not Sent' | 'Sent' | 'Failed';

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
  returnRequest?: string;
  fulfillmentStatus?: 'Pending' | 'Preparing' | 'Packed' | 'Shipped' | 'Delivered';
  shippingLabelGenerated?: boolean;
  trackingNumber?: string;
  inventoryUpdated?: boolean;
  lastEmailNotification?: {
    status: string;
    date: string;
  };
  // Firebase-specific fields
  firestoreId?: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enhanced Return Request Type
export interface ReturnRequest {
  id: string;
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  scheduledDate: string;
  refundStatus?: RefundStatus;
  refundAmount?: number;
  refundDate?: string;
  labelGenerated?: boolean;
  labelUrl?: string;
  lastNotificationStatus?: EmailStatus;
  lastNotificationDate?: string;
  processingNotes?: string;
}

// Return Analytics
export interface ReturnAnalytics {
  totalReturns: number;
  returnRate: number;
  totalRefunded: number;
  averageProcessingTime: number;
  returnsByStatus: {
    status: ReturnStatus;
    count: number;
  }[];
  returnsByReason: {
    reason: string;
    count: number;
  }[];
  monthlyReturns: {
    month: string;
    count: number;
  }[];
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  helpful: number;
}
