import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [couponCode, setCouponCode] = useState("");
  const [discountData, setDiscountData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get("/cart/");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await API.delete(`/cart/remove/${cartItemId}`);
      toast.success("Item removed");
      fetchCart();
      setDiscountData(null);
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await API.post("/coupons/apply", {
        code: couponCode,
        total_amount: cart.total_price,
      });

      setDiscountData(response.data);
      toast.success("Coupon applied successfully");
    } catch (error) {
      setDiscountData(null);
      toast.error(error.response?.data?.detail || "Invalid coupon");
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await API.post("/orders/create");
      const orderId = response.data.id;
      navigate(`/checkout?order_id=${orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Checkout failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">My Cart</h1>

          {cart.items.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 shadow">
              <p className="text-lg text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow"
                  >
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
                        <h2 className="text-xl font-semibold">{item.product.name}</h2>
                        <p className="text-gray-600">₹{item.product.price}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          Total: ₹{item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold">Price Summary</h2>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Apply Coupon
                  </button>
                </div>

                <p className="mb-2 text-lg text-gray-700">
                  Original Total: ₹{cart.total_price}
                </p>

                {discountData && (
                  <>
                    <p className="mb-2 text-lg text-green-600">
                      Coupon: {discountData.coupon_code} ({discountData.discount_percent}% OFF)
                    </p>
                    <p className="mb-2 text-lg text-green-600">
                      Discount: -₹{discountData.discount_amount}
                    </p>
                    <p className="mb-4 text-3xl font-bold text-green-600">
                      Final Total: ₹{discountData.final_total}
                    </p>
                  </>
                )}

                {!discountData && (
                  <p className="mb-4 text-3xl font-bold text-green-600">
                    Total: ₹{cart.total_price}
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-yellow-500 px-5 py-3 text-lg font-semibold text-black hover:bg-yellow-400"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;