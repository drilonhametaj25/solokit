import { NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, Bundle } from "@/types";

export async function POST(request: Request) {
  try {
    if (!stripe) {
      console.error("Stripe not configured - missing STRIPE_SECRET_KEY");
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 }
      );
    }

    const { productId, bundleId } = await request.json();

    if (!productId && !bundleId) {
      return NextResponse.json(
        { error: "Product ID or Bundle ID is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    let item: Product | Bundle;
    let itemType: "product" | "bundle";

    if (productId) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_published", true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      item = data;
      itemType = "product";
    } else {
      const { data, error } = await supabase
        .from("bundles")
        .select("*")
        .eq("id", bundleId)
        .eq("is_published", true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Bundle not found" },
          { status: 404 }
        );
      }

      item = data;
      itemType = "bundle";
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: item.currency.toLowerCase(),
            product_data: {
              name: item.name,
              description: item.tagline || undefined,
              images: item.images?.[0] ? [item.images[0]] : undefined,
            },
            unit_amount: formatAmountForStripe(item.price),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${itemType === "product" ? "products" : "bundles"}/${item.slug}`,
      metadata: {
        productId: productId || "",
        bundleId: bundleId || "",
        type: itemType,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
