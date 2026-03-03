import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Bundle } from "@/types";

export default async function AdminBundlesPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("bundles")
    .select("*")
    .order("created_at", { ascending: false });

  const bundles = data as Bundle[] | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Bundles
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your product bundles
          </p>
        </div>
        <Link href="/admin/bundles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bundle
          </Button>
        </Link>
      </div>

      {/* Bundles Table */}
      <Card className="overflow-hidden">
        {bundles && bundles.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Bundle
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bundles.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {bundle.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bundle.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {formatPrice(bundle.price, bundle.currency)}
                      </p>
                      {bundle.compare_at_price && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(bundle.compare_at_price, bundle.currency)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {bundle.sales_count}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {bundle.is_published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {bundle.is_featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/bundles/${bundle.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No bundles yet</p>
            <Link href="/admin/bundles/new" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Bundle
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
