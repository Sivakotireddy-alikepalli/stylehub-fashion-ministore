import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    updateOrderStatus();
  }, []);

  const updateOrderStatus = async () => {
    try {
      const res = await API.put(`/payment/update-status/${orderId}`, {
        status: "paid",
      });

      console.log("EMAIL RESPONSE:", res.data);
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await API.get(`/orders/invoice/${orderId}`, {
        responseType: "blob",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `invoice_order_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error("Failed to download invoice");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-6xl text-green-600">✔</div>

          <h1 className="mb-3 text-4xl font-bold text-green-600">
            Payment Successful
          </h1>

          <p className="mb-2 text-lg text-gray-700">
            Your order has been placed successfully!
          </p>

          <p className="mb-6 text-gray-600">Order ID: {orderId}</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/orders")}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View Orders
            </button>

            <button
              onClick={handleDownloadInvoice}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;