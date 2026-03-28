import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import toast from "react-hot-toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex bg-gray-100">
      <AdminSidebar />

      <div className="min-h-screen flex-1 p-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Manage Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                  <p className="text-gray-600">User: {order.user?.email}</p>
                  <p className="text-gray-600">Total: ₹{order.total_amount}</p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="rounded border px-4 py-2"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="failed">failed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;