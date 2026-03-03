import type { Database } from "./database";

// Table row types
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type Bundle = Database["public"]["Tables"]["bundles"]["Row"];
export type BundleInsert = Database["public"]["Tables"]["bundles"]["Insert"];
export type BundleUpdate = Database["public"]["Tables"]["bundles"]["Update"];

export type BundleProduct = Database["public"]["Tables"]["bundle_products"]["Row"];

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
export type SubscriberInsert = Database["public"]["Tables"]["subscribers"]["Insert"];

export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];

// Extended types with relations
export type BundleWithProducts = Bundle & {
  products: Product[];
};

export type ProductWithTestimonials = Product & {
  testimonials: Testimonial[];
};

export type OrderWithProduct = Order & {
  product: Product | null;
  bundle: Bundle | null;
};

// Category type
export type Category =
  | "money"
  | "clients"
  | "productivity"
  | "marketing"
  | "career"
  | "life"
  | "niche";

// Order status
export type OrderStatus = "pending" | "completed" | "refunded" | "failed";

// Form state types
export interface ActionState {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

// Checkout types
export interface CheckoutItem {
  type: "product" | "bundle";
  id: string;
}

export interface CheckoutSession {
  url: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Filter types for shop
export interface ProductFilters {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
  search?: string;
}

// Stats for admin dashboard
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  salesCount: number;
  revenue: number;
}

// Re-export database types
export type { Database } from "./database";
