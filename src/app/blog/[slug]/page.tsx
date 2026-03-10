import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { calculateReadingTime, extractHeadings, getRelatedPosts } from "@/lib/blog";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ProductCTA } from "@/components/blog/ProductCTA";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : [],
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";
  const readingTime = calculateReadingTime(post.content || "");
  const headings = extractHeadings(post.content || "");
  const relatedPosts = post.category
    ? await getRelatedPosts(supabase, post.category, post.id)
    : [];

  const wordCount = (post.content || "").trim().split(/\s+/).length;

  // Enhanced JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image
      ? {
          "@type": "ImageObject",
          url: post.cover_image,
          width: 1200,
          height: 675,
        }
      : undefined,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "SoloKit",
      url: baseUrl,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags?.join(", "),
    articleSection: post.category,
    wordCount,
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
          <article className="mx-auto max-w-3xl">
            {/* Breadcrumbs */}
            <Breadcrumbs category={post.category || undefined} postTitle={post.title} />

            {/* Header */}
            <header>
              {/* Category */}
              {post.category && (
                <Link href={`/blog/category/${post.category}`}>
                  <Badge variant="secondary" className="mb-4 cursor-pointer hover:bg-secondary/80">
                    {post.category}
                  </Badge>
                </Link>
              )}

              {/* Title */}
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="mt-6 flex items-center gap-4 text-muted-foreground">
                <span>{post.author}</span>
                <span>&bull;</span>
                <time dateTime={post.published_at || post.created_at}>
                  {formatDate(post.published_at || post.created_at)}
                </time>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
          </article>

          {/* Content + ToC layout */}
          <div className="mx-auto mt-12 max-w-7xl lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
            <article className="mx-auto max-w-3xl lg:mx-0">
              {/* Content */}
              <MarkdownContent content={post.content || ""} />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Product CTA */}
              <ProductCTA category={post.category || undefined} />

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />
            </article>

            {/* Sidebar ToC (desktop only) */}
            {headings.length >= 3 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}
          </div>

          {/* Inline ToC (mobile only) */}
          {headings.length >= 3 && (
            <div className="mx-auto mt-8 max-w-3xl lg:hidden">
              <details className="rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer font-heading text-sm font-semibold text-foreground">
                  Table of Contents
                </summary>
                <div className="mt-3">
                  <TableOfContents headings={headings} />
                </div>
              </details>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
