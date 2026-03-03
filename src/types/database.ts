export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          description: string;
          price: number;
          compare_at_price: number | null;
          currency: string;
          category: string;
          tags: string[] | null;
          features: string[] | null;
          images: string[] | null;
          file_url: string;
          file_name: string | null;
          stripe_price_id: string | null;
          is_featured: boolean;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          sales_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline?: string | null;
          description: string;
          price: number;
          compare_at_price?: number | null;
          currency?: string;
          category: string;
          tags?: string[] | null;
          features?: string[] | null;
          images?: string[] | null;
          file_url: string;
          file_name?: string | null;
          stripe_price_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          sales_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          currency?: string;
          category?: string;
          tags?: string[] | null;
          features?: string[] | null;
          images?: string[] | null;
          file_url?: string;
          file_name?: string | null;
          stripe_price_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          sales_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bundles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          description: string;
          price: number;
          compare_at_price: number | null;
          currency: string;
          images: string[] | null;
          stripe_price_id: string | null;
          is_featured: boolean;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          sales_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline?: string | null;
          description: string;
          price: number;
          compare_at_price?: number | null;
          currency?: string;
          images?: string[] | null;
          stripe_price_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          sales_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          currency?: string;
          images?: string[] | null;
          stripe_price_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          sales_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bundle_products: {
        Row: {
          bundle_id: string;
          product_id: string;
        };
        Insert: {
          bundle_id: string;
          product_id: string;
        };
        Update: {
          bundle_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bundle_products_bundle_id_fkey";
            columns: ["bundle_id"];
            referencedRelation: "bundles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          stripe_session_id: string | null;
          stripe_payment_intent: string | null;
          customer_email: string;
          customer_name: string | null;
          product_id: string | null;
          bundle_id: string | null;
          amount: number;
          currency: string;
          status: string;
          download_count: number;
          download_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          customer_email: string;
          customer_name?: string | null;
          product_id?: string | null;
          bundle_id?: string | null;
          amount: number;
          currency?: string;
          status?: string;
          download_count?: number;
          download_token?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          customer_email?: string;
          customer_name?: string | null;
          product_id?: string | null;
          bundle_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          download_count?: number;
          download_token?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_bundle_id_fkey";
            columns: ["bundle_id"];
            referencedRelation: "bundles";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          author: string;
          category: string | null;
          tags: string[] | null;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          author?: string;
          category?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          author?: string;
          category?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          source: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          source?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          source?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          content: string;
          rating: number;
          avatar: string | null;
          product_id: string | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          content: string;
          rating?: number;
          avatar?: string | null;
          product_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          content?: string;
          rating?: number;
          avatar?: string | null;
          product_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
