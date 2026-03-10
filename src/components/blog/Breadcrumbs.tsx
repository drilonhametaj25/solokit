import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryLabel } from "@/lib/utils";

interface BreadcrumbsProps {
  category?: string;
  postTitle?: string;
}

export function Breadcrumbs({ category, postTitle }: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";

  const items = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ];

  if (category) {
    items.push({
      name: getCategoryLabel(category),
      href: `/blog/category/${category}`,
    });
  }

  if (postTitle) {
    items.push({ name: postTitle, href: "" });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.name} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {index < items.length - 1 && item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
