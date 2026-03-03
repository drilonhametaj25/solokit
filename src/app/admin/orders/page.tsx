import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

type OrderWithRelations = Order & {
  products: { name: string } | null;
  bundles: { name: string } | null;
};

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select(`
      *,
      products:product_id (name),
      bundles:bundle_id (name)
    `)
    .order("created_at", { ascending: false });

  const orders = data as OrderWithRelations[] | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Orders
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and manage customer orders
        </p>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        {orders && orders.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Downloads
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      {order.id.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {order.customer_name || "—"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-foreground">
                      {order.products?.name ||
                        order.bundles?.name ||
                        "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-foreground">
                    {formatPrice(Number(order.amount), order.currency)}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "success"
                          : order.status === "refunded"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {order.download_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
