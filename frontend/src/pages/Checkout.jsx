import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function Checkout() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await API.get("/orders/");
      const foundOrder = response.data.find(
        (item) => String(item.id) === String(orderId)
      );
      setOrder(foundOrder || null);
    } catch (error) {
      console.error("Error fetching order", error);
    }
  };

  const handleStripeRedirect = async () => {
    try {
      setLoading(true);
      const response = await API.post(
        `/payment/create-checkout-session/${orderId}`
      );

      const checkoutUrl = response.data.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Stripe checkout URL not found");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to redirect to Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">Checkout</h1>

          {order ? (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white p-5 shadow">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image_url || "/images/tshirt.jpg"}
                        alt={item.product.name}
                        onError={(e) => {
                          e.target.src = "/images/tshirt.jpg";
                        }}
                        className="h-24 w-24 rounded-xl object-cover"
                      />

                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {item.product.name}
                        </h2>
                        <p className="text-gray-600">
                          ₹{item.price} x {item.quantity}
                        </p>
                        <p className="font-semibold text-gray-900">
                          Total: ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Payment Summary
                </h2>
                <p className="mb-6 text-3xl font-bold text-green-600">
                  ₹{order.total_amount}
                </p>

                <button
                  onClick={handleStripeRedirect}
                  disabled={loading}
                  className="w-full rounded-xl bg-yellow-500 px-5 py-3 text-lg font-semibold text-black hover:bg-yellow-400 disabled:opacity-70"
                >
                  {loading ? "Redirecting..." : "Pay with Stripe"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-600">Loading order...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Checkout;