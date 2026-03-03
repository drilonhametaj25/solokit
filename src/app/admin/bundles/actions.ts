"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface BundleData {
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  is_published: boolean;
}

export async function createBundle(data: BundleData, productIds: string[]) {
  const supabase = createAdminClient();

  // Insert bundle
  const { data: bundle, error } = await supabase
    .from("bundles")
    .insert(data)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Insert bundle_products
  if (productIds.length > 0) {
    const bundleProducts = productIds.map((productId) => ({
      bundle_id: bundle.id,
      product_id: productId,
    }));

    const { error: linkError } = await supabase
      .from("bundle_products")
      .insert(bundleProducts);

    if (linkError) {
      return { error: linkError.message };
    }
  }

  revalidatePath("/admin/bundles");
  return { success: true };
}

export async function updateBundle(
  id: string,
  data: Partial<BundleData>,
  productIds?: string[]
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("bundles").update(data).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Update bundle_products if provided
  if (productIds !== undefined) {
    // Delete existing links
    await supabase.from("bundle_products").delete().eq("bundle_id", id);

    // Insert new links
    if (productIds.length > 0) {
      const bundleProducts = productIds.map((productId) => ({
        bundle_id: id,
        product_id: productId,
      }));

      const { error: linkError } = await supabase
        .from("bundle_products")
        .insert(bundleProducts);

      if (linkError) {
        return { error: linkError.message };
      }
    }
  }

  revalidatePath("/admin/bundles");
  return { success: true };
}

export async function deleteBundle(id: string) {
  const supabase = createAdminClient();

  // Delete bundle_products first (foreign key)
  await supabase.from("bundle_products").delete().eq("bundle_id", id);

  const { error } = await supabase.from("bundles").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/bundles");
  return { success: true };
}
