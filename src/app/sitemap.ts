export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";
  const supabase = await createClient();

  // Fetch all published products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_published", true);

  // Fetch all published bundles
  const { data: bundles } = await supabase
    .from("bundles")
    .select("slug, updated_at")
    .eq("is_published", true);

  // Fetch all published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  const productUrls: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const bundleUrls: MetadataRoute.Sitemap = (bundles || []).map((bundle) => ({
    url: `${baseUrl}/bundles/${bundle.slug}`,
    lastModified: new Date(bundle.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postUrls: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bundles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...productUrls,
    ...bundleUrls,
    ...postUrls,
  ];
}
