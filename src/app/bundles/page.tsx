import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/products/PriceTag";

export const metadata: Metadata = {
  title: "Template Bundles",
  description:
    "Save more with our template bundles. Get multiple premium templates at a discounted price.",
};

export default async function BundlesPage() {
  const supabase = await createClient();

  const { data: bundles } = await supabase
    .from("bundles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Template Bundles
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Get more value with our curated template bundles. Save up to 50%
              compared to buying individually.
            </p>
          </div>

          {/* Bundles Grid */}
          {bundles && bundles.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {bundles.map((bundle) => (
                <Link key={bundle.id} href={`/bundles/${bundle.slug}`}>
                  <Card hover className="overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-[16/9] bg-muted">
                      <Image
                        src={bundle.images?.[0] || "/images/placeholder.jpg"}
                        alt={bundle.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {bundle.is_featured && (
                        <Badge className="absolute right-3 top-3">
                          Most Popular
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="font-heading text-xl font-semibold text-foreground">
                        {bundle.name}
                      </h2>
                      {bundle.tagline && (
                        <p className="mt-2 text-muted-foreground">
                          {bundle.tagline}
                        </p>
                      )}
                      <div className="mt-4">
                        <PriceTag
                          price={bundle.price}
                          compareAtPrice={bundle.compare_at_price}
                          currency={bundle.currency}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No bundles available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
