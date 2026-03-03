import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, formatAmountFromStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPurchaseEmail } from "@/lib/email";
import { generateToken } from "@/lib/utils";

export async function POST(request: Request) {
  if (!stripe) {
    console.error("Stripe not configured - missing STRIPE_SECRET_KEY");
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutCompleted(session);
    } catch (error) {
      console.error("Error handling checkout:", error);
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  const productId = session.metadata?.productId || null;
  const bundleId = session.metadata?.bundleId || null;

  // Generate download token
  const downloadToken = generateToken(32);

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      customer_email: session.customer_details?.email || session.customer_email || "",
      customer_name: session.customer_details?.name || null,
      product_id: productId || null,
      bundle_id: bundleId || null,
      amount: formatAmountFromStripe(session.amount_total || 0),
      currency: session.currency || "usd",
      status: "completed",
      download_token: downloadToken,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw orderError;
  }

  // Increment sales count for product
  if (productId) {
    const { data: product } = await supabase
      .from("products")
      .select("sales_count")
      .eq("id", productId)
      .single();

    if (product) {
      await supabase
        .from("products")
        .update({ sales_count: (product.sales_count || 0) + 1 })
        .eq("id", productId);
    }
  }

  if (bundleId) {
    const { data: bundle } = await supabase
      .from("bundles")
      .select("sales_count")
      .eq("id", bundleId)
      .single();

    if (bundle) {
      await supabase
        .from("bundles")
        .update({ sales_count: (bundle.sales_count || 0) + 1 })
        .eq("id", bundleId);
    }
  }

  // Get product/bundle name for email
  let productName = "Your Purchase";
  if (productId) {
    const { data: product } = await supabase
      .from("products")
      .select("name")
      .eq("id", productId)
      .single();
    productName = product?.name || productName;
  } else if (bundleId) {
    const { data: bundle } = await supabase
      .from("bundles")
      .select("name")
      .eq("id", bundleId)
      .single();
    productName = bundle?.name || productName;
  }

  // Send purchase email
  const downloadUrl = `${process.env.NEXT_PUBLIC_URL}/api/download?token=${downloadToken}`;

  await sendPurchaseEmail({
    to: order.customer_email,
    customerName: order.customer_name || undefined,
    productName,
    downloadUrl,
    orderAmount: Number(order.amount),
    currency: order.currency,
  });
}
