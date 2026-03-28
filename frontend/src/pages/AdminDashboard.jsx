import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Dashboard error", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track revenue, orders, users, products, and stock alerts.
          </p>
        </div>

        {!data ? (
          <div className="rounded-2xl bg-white p-8 shadow">
            <p className="text-lg text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">Products</p>
                <h2 className="mt-3 text-3xl font-bold text-blue-600">
                  {data.total_products}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">Orders</p>
                <h2 className="mt-3 text-3xl font-bold text-purple-600">
                  {data.total_orders}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">Users</p>
                <h2 className="mt-3 text-3xl font-bold text-orange-500">
                  {data.total_users}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">Coupons</p>
                <h2 className="mt-3 text-3xl font-bold text-pink-600">
                  {data.total_coupons}
                </h2>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow">
                <p className="text-sm font-medium text-green-100">Revenue</p>
                <h2 className="mt-3 text-3xl font-bold">₹{data.total_revenue}</h2>
              </div>
            </div>

            {/* Charts */}
            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Overview Chart</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.overview_chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Top Selling Products</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.top_selling_products}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total_sold" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Revenue Trend</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenue_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders + Low Stock */}
            <div className="grid gap-8 xl:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                    {data.recent_orders.length} Recent
                  </span>
                </div>

                {data.recent_orders.length === 0 ? (
                  <p className="text-gray-600">No recent orders</p>
                ) : (
                  <div className="space-y-4">
                    {data.recent_orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.user_email}
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                          <span>Items: {order.items_count}</span>
                          <span className="font-semibold text-green-600">
                            ₹{order.total_amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-red-600">Low Stock Alerts</h2>
                  <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-600">
                    {data.low_stock_products.length} Alerts
                  </span>
                </div>

                {data.low_stock_products.length === 0 ? (
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="font-medium text-green-700">
                      No low stock products. Inventory looks good.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.low_stock_products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image_url || "/images/tshirt.jpg"}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {product.category}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white">
                          Stock: {product.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;