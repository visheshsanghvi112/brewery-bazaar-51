import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price from cents to rupees with ₹ symbol
export function formatPrice(priceInCents: number): string {
  return `₹${(priceInCents / 100).toFixed(2)}`;
}
