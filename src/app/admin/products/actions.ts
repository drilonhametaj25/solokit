"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

interface ProductData {
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  features: string[];
  tags: string[];
  file_url: string;
  file_name: string | null;
  images: string[];
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  is_published: boolean;
}

export async function createProduct(data: ProductData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("products").insert(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image must be less than 5MB" };
  }

  const supabase = createAdminClient();

  // Generate unique filename
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${nanoid()}.${extension}`;

  // Convert File to ArrayBuffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return { error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return { url: publicUrl };
}

export async function deleteProductImage(url: string) {
  const supabase = createAdminClient();

  // Extract filename from URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/product-images/filename.jpg
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];

  if (!fileName) {
    return { error: "Invalid image URL" };
  }

  const { error } = await supabase.storage
    .from("product-images")
    .remove([fileName]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
