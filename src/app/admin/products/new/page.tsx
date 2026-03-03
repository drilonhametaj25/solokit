"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { slugify, CATEGORIES } from "@/lib/utils";

const categoryOptions = Object.entries(CATEGORIES).map(([value, label]) => ({
  value,
  label,
}));

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Form state
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [compareAtPrice, setCompareAtPrice] = React.useState("");
  const [category, setCategory] = React.useState("productivity");
  const [features, setFeatures] = React.useState<string[]>([""]);
  const [tags, setTags] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(false);

  // Auto-generate slug from name
  React.useEffect(() => {
    if (name && !slug) {
      setSlug(slugify(name));
    }
  }, [name, slug]);

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();

    const productData = {
      name,
      slug,
      tagline: tagline || null,
      description,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category,
      features: features.filter((f) => f.trim()),
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      file_url: fileUrl,
      file_name: fileName || null,
      images: [], // TODO: Add image upload
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      is_featured: isFeatured,
      is_published: isPublished,
    };

    const { error: insertError } = await supabase
      .from("products")
      .insert(productData);

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            New Product
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create a new digital template
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="e.g., Freelance Finance Tracker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Slug"
                  placeholder="freelance-finance-tracker"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  hint="URL-friendly identifier"
                />
                <Input
                  label="Tagline"
                  placeholder="Track your freelance income and expenses"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
                <Textarea
                  label="Description"
                  placeholder="Full product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Product File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="File URL"
                  placeholder="https://supabase.storage.../file.zip"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                  hint="Upload to Supabase Storage and paste the URL"
                />
                <Input
                  label="File Name"
                  placeholder="Template.xlsx"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="SEO Title"
                  placeholder="Leave empty to use product name"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
                <Textarea
                  label="SEO Description"
                  placeholder="Leave empty to use tagline"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="29.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <Input
                  label="Compare at Price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="49.00"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  hint="Original price for showing discount"
                />
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
                <Input
                  label="Tags"
                  placeholder="freelance, finance, excel"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  hint="Comma-separated"
                />
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm font-medium">Featured</span>
                </label>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                {error && (
                  <p className="mb-4 text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
