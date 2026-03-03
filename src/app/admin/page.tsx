export const dynamic = "force-dynamic";

import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type OrderStats = {
  amount: number;
  created_at: string;
  status: string;
};

async function getStats() {
  const supabase = createAdminClient();

  // Get all orders
  const { data } = await supabase
    .from("orders")
    .select("amount, created_at, status")
    .eq("status", "completed");

  const orders = data as OrderStats[] | null;

  // Get products count
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  // Calculate stats
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;
  const totalOrders = orders?.length || 0;

  // This month's stats
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const ordersThisMonth = orders?.filter(
    (order) => new Date(order.created_at) >= thisMonth
  ) || [];
  const revenueThisMonth = ordersThisMonth.reduce(
    (sum, order) => sum + Number(order.amount),
    0
  );

  return {
    totalRevenue,
    totalOrders,
    productsCount: productsCount || 0,
    ordersThisMonth: ordersThisMonth.length,
    revenueThisMonth,
  };
}

type TopProduct = {
  id: string;
  name: string;
  sales_count: number;
  price: number;
};

async function getTopProducts() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("products")
    .select("id, name, sales_count, price")
    .eq("is_published", true)
    .order("sales_count", { ascending: false })
    .limit(5);

  const products = data as TopProduct[] | null;
  return products || [];
}

type RecentOrder = {
  id: string;
  customer_email: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  product_id: string | null;
  bundle_id: string | null;
};

async function getRecentOrders() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select(`
      id,
      customer_email,
      amount,
      currency,
      status,
      created_at,
      product_id,
      bundle_id
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const orders = data as RecentOrder[] | null;
  return orders || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const topProducts = await getTopProducts();
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatPrice(stats.totalRevenue)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatPrice(stats.revenueThisMonth)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalOrders}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.ordersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats.productsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Published products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalOrders > 0
                ? formatPrice(stats.totalRevenue / stats.totalOrders)
                : "$0"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <ul className="space-y-4">
                {topProducts.map((product, index) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {product.sales_count} sales
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">
                No products yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <ul className="space-y-4">
                {recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {order.customer_email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">
                      {formatPrice(Number(order.amount), order.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">
                No orders yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
