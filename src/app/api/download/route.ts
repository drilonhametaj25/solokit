import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_DOWNLOADS = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Download token is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Find order by download token
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products:product_id (*), bundles:bundle_id (*)")
    .eq("download_token", token)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Invalid or expired download link" },
      { status: 404 }
    );
  }

  // Check download count
  if (order.download_count >= MAX_DOWNLOADS) {
    return NextResponse.json(
      {
        error: `Download limit reached. This link has been used ${MAX_DOWNLOADS} times. Contact support for assistance.`,
      },
      { status: 403 }
    );
  }

  // Increment download count
  await supabase
    .from("orders")
    .update({ download_count: order.download_count + 1 })
    .eq("id", order.id);

  // Get file URL
  let fileUrl: string | null = null;

  if (order.product_id && order.products) {
    const product = order.products as { file_url: string; file_name: string | null; name: string };
    fileUrl = product.file_url;
  } else if (order.bundle_id && order.bundles) {
    // For bundles, we need to get all product files
    const { data: bundleProducts } = await supabase
      .from("bundle_products")
      .select("product_id")
      .eq("bundle_id", order.bundle_id);

    if (bundleProducts && bundleProducts.length > 0) {
      const productIds = bundleProducts.map((bp) => bp.product_id);
      const { data: products } = await supabase
        .from("products")
        .select("file_url, file_name, name")
        .in("id", productIds);

      // For now, return the first product's file
      // In a real implementation, you'd zip all files together
      if (products && products.length > 0) {
        fileUrl = products[0].file_url;
      }
    }
  }

  if (!fileUrl) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }

  // Redirect to the file URL
  // In production, you'd want to generate a signed URL from Supabase Storage
  return NextResponse.redirect(fileUrl);
}
