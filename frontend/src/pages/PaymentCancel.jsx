import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";

function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    updateOrderStatus();
  }, []);

  const updateOrderStatus = async () => {
    try {
      await API.put(`/payment/update-status/${orderId}`, {
        status: "cancelled",
      });
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-6xl text-red-500">✖</div>

          <h1 className="mb-3 text-4xl font-bold text-red-500">
            Payment Cancelled
          </h1>

          <p className="mb-2 text-lg text-gray-700">
            Your payment was not completed.
          </p>

          <p className="mb-6 text-gray-600">Order ID: {orderId}</p>

          <button
            onClick={() => navigate("/cart")}
            className="rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-black"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </>
  );
}

export default PaymentCancel;