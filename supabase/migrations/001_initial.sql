-- SoloKit Database Schema
-- Run this migration in your Supabase SQL Editor

-- ===================
-- Products Table
-- ===================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  category TEXT NOT NULL,
  tags TEXT[],
  features TEXT[],
  images TEXT[],
  file_url TEXT NOT NULL,
  file_name TEXT,
  stripe_price_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===================
-- Bundles Table
-- ===================
CREATE TABLE bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  images TEXT[],
  stripe_price_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===================
-- Bundle Products Junction
-- ===================
CREATE TABLE bundle_products (
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);

-- ===================
-- Orders Table
-- ===================
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_id UUID REFERENCES products(id),
  bundle_id UUID REFERENCES bundles(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed',
  download_count INTEGER DEFAULT 0,
  download_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================
-- Blog Posts Table
-- ===================
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'SoloKit',
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===================
-- Newsletter Subscribers
-- ===================
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================
-- Testimonials Table
-- ===================
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar TEXT,
  product_id UUID REFERENCES products(id),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================
-- Row Level Security
-- ===================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view published products
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (is_published = true);

-- Public can view published bundles
CREATE POLICY "Public can view published bundles" ON bundles
  FOR SELECT USING (is_published = true);

-- Public can view bundle products for published bundles
CREATE POLICY "Public can view bundle products" ON bundle_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bundles WHERE bundles.id = bundle_products.bundle_id AND bundles.is_published = true
    )
  );

-- Public can view published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (is_published = true);

-- Public can view published testimonials
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

-- Subscribers can insert (for newsletter signup)
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- ===================
-- Indexes for Performance
-- ===================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_published ON products(is_published) WHERE is_published = true;

CREATE INDEX idx_bundles_slug ON bundles(slug);
CREATE INDEX idx_bundles_featured ON bundles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_bundles_published ON bundles(is_published) WHERE is_published = true;

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(is_published) WHERE is_published = true;
CREATE INDEX idx_posts_published_at ON posts(published_at);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_download_token ON orders(download_token);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_subscribers_email ON subscribers(email);

-- ===================
-- Updated At Trigger
-- ===================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bundles_updated_at
  BEFORE UPDATE ON bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- Storage Buckets (run separately in Supabase Dashboard)
-- ===================
-- 1. Create bucket "product-images" (public)
-- 2. Create bucket "product-files" (private)
--
-- For product-images bucket, add this policy:
-- CREATE POLICY "Public read access" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');
--
-- For product-files bucket, files are accessed via signed URLs from the API
