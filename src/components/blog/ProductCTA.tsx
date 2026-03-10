import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCTAProps {
  category?: string;
}

export function ProductCTA({ category }: ProductCTAProps) {
  return (
    <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="font-heading text-2xl font-bold text-foreground">
        Ready to level up your freelance business?
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        Explore our premium templates designed to save you time and help you
        work like a pro.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Link href="/shop">
          <Button>
            Browse Templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        {category && (
          <Link href={`/blog/category/${category}`}>
            <Button variant="outline">
              More in this category
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
