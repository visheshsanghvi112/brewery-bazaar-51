
import { Database } from '@/integrations/supabase/types';
import { Product, ProductVariant, Order, OrderStatus } from './index';

// Type definitions for database tables
export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert'];
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update'];

export type ProductImageRow = Database['public']['Tables']['product_images']['Row'];
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert'];
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update'];

export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update'];

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type CategoryRow = Database['public']['Tables']['categories']['Row'];

// Implement mappings between our application types and Supabase row types
export const mapProductFromRow = (row: ProductRow, images: string[] = [], variants: ProductVariantRow[] = []): Product => ({
  id: row.id,
  name: row.name,
  description: row.description || "",
  price: row.price,
  originalPrice: row.original_price || undefined,
  category: row.category || "uncategorized",
  images: images,
  variants: variants.map(mapVariantFromRow),
  featured: row.featured || false,
  rating: row.rating || 4.5,
  reviews: row.reviews || 0,
  inStock: row.in_stock || true
});

export const mapVariantFromRow = (row: ProductVariantRow): ProductVariant => ({
  id: row.id,
  size: row.size,
  color: row.color,
  colorCode: row.color_code,
  stock: row.stock || 0
});

export const mapVariantToRow = (variant: ProductVariant, productId?: string): ProductVariantInsert => ({
  id: variant.id,
  product_id: productId,
  size: variant.size,
  color: variant.color,
  color_code: variant.colorCode,
  stock: variant.stock
});

export const mapProductToInsert = (product: Partial<Product>): ProductInsert => ({
  name: product.name!,
  description: product.description,
  price: product.price!,
  original_price: product.originalPrice,
  category: product.category,
  in_stock: product.inStock,
  featured: product.featured,
  rating: product.rating,
  reviews: product.reviews
});

export const mapProductToUpdate = (product: Partial<Product>): ProductUpdate => ({
  name: product.name,
  description: product.description,
  price: product.price,
  original_price: product.originalPrice,
  category: product.category,
  in_stock: product.inStock,
  featured: product.featured,
  rating: product.rating,
  reviews: product.reviews,
  updated_at: new Date().toISOString()
});

export const mapOrderFromRow = (
  order: OrderRow, 
  customer: any, 
  items: any[] = [], 
  shippingAddress: any = {}, 
  billingAddress: any = {}
): Order => ({
  id: order.id,
  customer,
  items,
  shippingAddress,
  billingAddress,
  subtotal: order.subtotal,
  shipping: order.shipping,
  total: order.total,
  status: order.status as OrderStatus,
  date: order.created_at || new Date().toISOString(),
  paymentMethod: order.payment_method || "",
  notes: order.notes || undefined
});
