import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import { BLOG_CATEGORY_META, isValidCategory } from "@/lib/blog";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isValidCategory(category)) {
    return { title: "Category Not Found" };
  }

  const meta = BLOG_CATEGORY_META[category];
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";

  return {
    title: `${meta?.title || getCategoryLabel(category)} | SoloKit Blog`,
    description: meta?.description || `Articles about ${getCategoryLabel(category)} for freelancers and solopreneurs.`,
    alternates: {
      canonical: `${baseUrl}/blog/category/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .eq("category", category)
    .order("published_at", { ascending: false });

  const meta = BLOG_CATEGORY_META[category];
  const label = getCategoryLabel(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta?.title || label,
    description: meta?.description,
    url: `${baseUrl}/blog/category/${category}`,
    isPartOf: {
      "@type": "Blog",
      name: "SoloKit Blog",
      url: `${baseUrl}/blog`,
    },
  };

  return (
    <>
      <Navbar />
      <main className="py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {label}
            </Badge>
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {meta?.title || `${label} Articles`}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {meta?.description ||
                `Articles about ${label.toLowerCase()} for freelancers and solopreneurs.`}
            </p>
          </div>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card hover className="group overflow-hidden">
                    <div className="relative aspect-[16/9] bg-muted">
                      <Image
                        src={post.cover_image || "/images/placeholder.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>&bull;</span>
                        <span>
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No posts in this category yet. Check back soon!
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button>
                Browse Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
