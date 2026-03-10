import { slugify, CATEGORIES, type CategoryKey } from "@/lib/utils";

// Calculate reading time (words / 200, rounded up)
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Extract headings from markdown content
export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2].trim()),
    });
  }

  return headings;
}

// Get related posts by category
export async function getRelatedPosts(
  supabase: ReturnType<typeof import("@/lib/supabase/server").createClient> extends Promise<infer T> ? T : never,
  category: string,
  currentId: string,
  limit: number = 3
) {
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, category, published_at, author")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(limit);

  return data || [];
}

// Blog category SEO metadata
export const BLOG_CATEGORY_META: Record<
  string,
  { title: string; description: string }
> = {
  money: {
    title: "Money & Finance Tips for Freelancers",
    description:
      "Learn how to manage your finances, set rates, and grow your income as a freelancer or solopreneur.",
  },
  clients: {
    title: "Client Management for Freelancers",
    description:
      "Tips and strategies for finding, managing, and retaining clients as a freelancer.",
  },
  productivity: {
    title: "Productivity Tips for Solopreneurs",
    description:
      "Boost your productivity with proven strategies, tools, and templates for freelancers.",
  },
  marketing: {
    title: "Marketing Strategies for Freelancers",
    description:
      "Grow your freelance business with effective marketing strategies, templates, and tips.",
  },
  career: {
    title: "Career Growth for Freelancers",
    description:
      "Advance your freelance career with expert advice on skills, positioning, and growth.",
  },
  life: {
    title: "Work-Life Balance for Freelancers",
    description:
      "Find balance and well-being while building your freelance or solo business.",
  },
  niche: {
    title: "Niche Business Strategies",
    description:
      "Discover strategies for finding and dominating your niche as a freelancer or solopreneur.",
  },
};

// Get valid category keys
export function isValidCategory(category: string): category is CategoryKey {
  return category in CATEGORIES;
}
