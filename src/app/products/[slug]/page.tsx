export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Download, Shield, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import { ProductGallery, BuyButton, PriceTag, ProductCard } from "@/components/products";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.tagline || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.tagline || product.description?.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("is_published", true)
    .neq("id", product.id)
    .limit(3);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline || product.description,
    image: product.images?.[0],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
    },
    ...(product.sales_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: product.sales_count,
      },
    }),
  };

  return (
    <>
      <Navbar />
      <main className="py-12">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Gallery */}
            <ProductGallery
              images={product.images || []}
              productName={product.name}
            />

            {/* Product Info */}
            <div>
              {/* Category Badge */}
              <Badge variant="secondary" className="mb-4">
                {getCategoryLabel(product.category)}
              </Badge>

              {/* Title */}
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {product.name}
              </h1>

              {/* Tagline */}
              {product.tagline && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {product.tagline}
                </p>
              )}

              {/* Price */}
              <div className="mt-6">
                <PriceTag
                  price={product.price}
                  compareAtPrice={product.compare_at_price}
                  currency={product.currency}
                  size="lg"
                />
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Buy Button */}
              <div className="mt-8">
                <BuyButton
                  productId={product.id}
                  price={product.price}
                  currency={product.currency}
                />
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <span>Instant download</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>14-day money back</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              About This Template
            </h2>
            <div className="prose prose-invert mt-6 max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Related Templates
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
