export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Download, Shield, Clock, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import { ProductGallery, BuyButton, PriceTag, ProductCard } from "@/components/products";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface BundlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BundlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: bundle } = await supabase
    .from("bundles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!bundle) {
    return {
      title: "Bundle Not Found",
    };
  }

  return {
    title: bundle.seo_title || bundle.name,
    description: bundle.seo_description || bundle.tagline || bundle.description?.slice(0, 160),
    openGraph: {
      title: bundle.name,
      description: bundle.tagline || bundle.description?.slice(0, 160),
      images: bundle.images?.[0] ? [bundle.images[0]] : [],
      type: "website",
    },
  };
}

export default async function BundlePage({ params }: BundlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: bundle } = await supabase
    .from("bundles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!bundle) {
    notFound();
  }

  // Fetch included products
  const { data: bundleProducts } = await supabase
    .from("bundle_products")
    .select("product_id")
    .eq("bundle_id", bundle.id);

  let includedProducts: Product[] = [];
  if (bundleProducts && bundleProducts.length > 0) {
    const productIds = bundleProducts.map((bp) => bp.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);
    includedProducts = (products as Product[]) || [];
  }

  // Calculate total value if buying separately
  const totalValue = includedProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = totalValue > bundle.price ? totalValue - bundle.price : 0;
  const savingsPercent = totalValue > 0 ? calculateDiscount(totalValue, bundle.price) : 0;

  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Gallery */}
            <ProductGallery
              images={bundle.images || []}
              productName={bundle.name}
            />

            {/* Bundle Info */}
            <div>
              {/* Bundle Badge */}
              <Badge variant="default" className="mb-4">
                <Package className="mr-1 h-3 w-3" />
                Bundle
              </Badge>

              {/* Title */}
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {bundle.name}
              </h1>

              {/* Tagline */}
              {bundle.tagline && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {bundle.tagline}
                </p>
              )}

              {/* Price */}
              <div className="mt-6">
                <PriceTag
                  price={bundle.price}
                  compareAtPrice={bundle.compare_at_price || totalValue}
                  currency={bundle.currency}
                  size="lg"
                />
              </div>

              {/* Savings Banner */}
              {savings > 0 && (
                <div className="mt-4 rounded-lg bg-success/10 p-4">
                  <p className="font-medium text-success">
                    Save {formatPrice(savings, bundle.currency)} ({savingsPercent}% off) compared to buying separately!
                  </p>
                </div>
              )}

              {/* Included Products Count */}
              <p className="mt-6 text-muted-foreground">
                Includes {includedProducts.length} template{includedProducts.length !== 1 ? "s" : ""}
              </p>

              {/* Buy Button */}
              <div className="mt-8">
                <BuyButton
                  bundleId={bundle.id}
                  price={bundle.price}
                  currency={bundle.currency}
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
              About This Bundle
            </h2>
            <div className="prose prose-invert mt-6 max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {bundle.description}
              </p>
            </div>
          </div>

          {/* Included Products */}
          {includedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {"What's Included"}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {includedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
