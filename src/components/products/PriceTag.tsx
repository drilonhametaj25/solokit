import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}

export function PriceTag({
  price,
  compareAtPrice,
  currency = "USD",
  size = "md",
  showDiscount = true,
}: PriceTagProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discount = hasDiscount ? calculateDiscount(compareAtPrice, price) : 0;

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Current Price */}
      <span
        className={`font-heading font-bold text-foreground ${sizeClasses[size]}`}
      >
        {formatPrice(price, currency)}
      </span>

      {/* Compare at Price */}
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice, currency)}
        </span>
      )}

      {/* Discount Badge */}
      {hasDiscount && showDiscount && (
        <Badge variant="success">Save {discount}%</Badge>
      )}
    </div>
  );
}
