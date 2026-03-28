import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert(error.response?.data?.detail || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">My Orders</h1>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 shadow">
              <p className="text-lg text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-white p-6 shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                    <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                      {order.status}
                    </span>
                  </div>

                  <p className="mb-4 text-lg font-semibold text-gray-800">
                    Total: ₹{order.total_amount}
                  </p>

                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl border p-4"
                      >
                        <img
                          src={item.product?.image_url || "/images/tshirt.jpg"}
                          alt={item.product?.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-lg font-semibold">{item.product?.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-gray-600">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Orders;