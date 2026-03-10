import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
  author: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="font-heading text-2xl font-bold text-foreground">
        Related Posts
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="p-4">
                {post.category && (
                  <Badge variant="secondary" className="mb-2">
                    {post.category}
                  </Badge>
                )}
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(post.published_at || "")}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
