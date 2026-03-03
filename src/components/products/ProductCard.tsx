import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PriceTag } from "./PriceTag";
import { getCategoryLabel } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || "/images/placeholder.jpg";

  return (
    <Link href={`/products/${product.slug}`}>
      <Card hover className="group overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.is_featured && (
            <Badge className="absolute right-3 top-3" variant="default">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <Badge variant="secondary" className="mb-3">
            {getCategoryLabel(product.category)}
          </Badge>

          {/* Name */}
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
            {product.name}
          </h3>

          {/* Tagline */}
          {product.tagline && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.tagline}
            </p>
          )}

          {/* Price */}
          <div className="mt-4">
            <PriceTag
              price={product.price}
              compareAtPrice={product.compare_at_price}
              currency={product.currency}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
