export const dynamic = "force-dynamic";

import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, getCategoryLabel } from "@/lib/utils";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "Shop Templates",
  description:
    "Browse our collection of premium digital templates for freelancers and solopreneurs. Excel, Notion, and PDF templates for every business need.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
}

async function ProductsGrid({
  category,
  sort,
}: {
  category?: string;
  sort?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true);

  // Filter by category
  if (category && category in CATEGORIES) {
    query = query.eq("category", category);
  }

  // Sort
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("sales_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground">
          No products found. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, sort } = params;

  const categories = Object.entries(CATEGORIES).map(([key, label]) => ({
    key,
    label,
  }));

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              All Templates
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Professional templates to run your business like a pro
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <a href="/shop">
                <Badge
                  variant={!category ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                >
                  All
                </Badge>
              </a>
              {categories.map((cat) => (
                <a key={cat.key} href={`/shop?category=${cat.key}`}>
                  <Badge
                    variant={category === cat.key ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5"
                  >
                    {cat.label}
                  </Badge>
                </a>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="ml-auto">
              <select
                defaultValue={sort || "newest"}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", e.target.value);
                  window.location.href = url.toString();
                }}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter */}
          {category && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing results for:
              </span>
              <Badge variant="secondary">
                {getCategoryLabel(category as Category)}
              </Badge>
            </div>
          )}

          {/* Products Grid */}
          <Suspense fallback={<ProductsLoading />}>
            <ProductsGrid category={category} sort={sort} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
