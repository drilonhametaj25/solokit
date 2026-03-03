"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface BuyButtonProps {
  productId?: string;
  bundleId?: string;
  price: number;
  currency?: string;
}

export function BuyButton({
  productId,
  bundleId,
  price,
  currency = "USD",
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleBuy() {
    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          bundleId,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={handleBuy}
      isLoading={isLoading}
    >
      <ShoppingCart className="h-4 w-4" />
      Buy Now — {formatPrice(price, currency)}
    </Button>
  );
}
