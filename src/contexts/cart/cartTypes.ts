
import { Address, Cart, Customer, Order, Product, ProductVariant } from "@/types";

export type CartContextType = {
  cart: Cart;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: Address) => void;
  placeOrder: (customer: Customer, paymentMethod: string) => string;
  clearCart: () => void;
  itemCount: number;
};
