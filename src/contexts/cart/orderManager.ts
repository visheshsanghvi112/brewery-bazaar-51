
import { Address, Customer, Order, OrderStatus } from "@/types";
import { CartState } from "./cartReducer";

export const createOrder = (
  state: CartState,
  customer: Customer,
  paymentMethod: string,
  orders: Order[]
): { newOrder: Order; orderId: string } => {
  // Create order ID
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  
  // Calculate subtotal and shipping
  const subtotal = state.total;
  const shipping = subtotal >= 99900 ? 0 : 10000; // Free shipping for orders above ₹999
  const total = subtotal + shipping;
  
  // Create order items
  const items = state.items.map(item => ({
    product: item.product,
    variant: item.selectedVariant,
    quantity: item.quantity,
    price: item.product.price * item.quantity
  }));
  
  // Create new order
  const newOrder: Order = {
    id: orderId,
    customer,
    items,
    shippingAddress: state.shippingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    billingAddress: state.billingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    subtotal,
    shipping,
    total,
    status: 'Processing' as OrderStatus,
    date: new Date().toISOString(),
    paymentMethod
  };
  
  return { newOrder, orderId };
};

export const updateCustomer = (
  customer: Customer, 
  customers: any[], 
  total: number
): any[] => {
  const existingCustomerIndex = customers.findIndex(c => c.email === customer.email);
  
  if (existingCustomerIndex >= 0) {
    const updatedCustomers = [...customers];
    const existingCustomer = updatedCustomers[existingCustomerIndex];
    
    updatedCustomers[existingCustomerIndex] = {
      ...existingCustomer,
      orders: (existingCustomer.orders || 0) + 1,
      spent: (existingCustomer.spent || 0) + total
    };
    
    return updatedCustomers;
  } else {
    // Add new customer
    return [
      ...customers,
      {
        id: `cust-${Date.now()}`,
        ...customer,
        orders: 1,
        spent: total,
        joinedDate: new Date().toISOString()
      }
    ];
  }
};
