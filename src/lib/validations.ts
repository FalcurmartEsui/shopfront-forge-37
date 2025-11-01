import { z } from "zod";

// Authentication validation schemas
export const signUpSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  shopName: z.string().trim().min(2, "Shop name must be at least 2 characters").max(100).optional(),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional().or(z.literal("")),
  businessDescription: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  hallNumber: z.number().int().min(1, "Hall number must be between 1 and 9").max(9, "Hall number must be between 1 and 9"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

// Checkout validation schema
export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional().or(z.literal("")),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(200),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional(),
  price: z.number().positive("Price must be positive").max(999999, "Price is too high"),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative").max(999999),
  category: z.string().trim().max(100).optional(),
  imageUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
