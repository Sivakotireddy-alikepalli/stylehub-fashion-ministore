import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import toast from "react-hot-toast";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discount_percent: "",
    is_active: 1,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await API.get("/admin/coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    try {
      await API.post("/admin/coupons", {
        code: formData.code,
        discount_percent: parseFloat(formData.discount_percent),
        is_active: 1,
      });

      toast.success("Coupon created");
      setFormData({
        code: "",
        discount_percent: "",
        is_active: 1,
      });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create coupon");
    }
  };

  return (
    <div className="flex bg-gray-100">
      <AdminSidebar />

      <div className="min-h-screen flex-1 p-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Manage Coupons</h1>

        <form onSubmit={handleCreateCoupon} className="mb-8 rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Coupon code"
              className="rounded border px-4 py-3"
            />
            <input
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleChange}
              placeholder="Discount percent"
              className="rounded border px-4 py-3"
            />
          </div>

          <button className="mt-4 rounded bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
            Add Coupon
          </button>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Coupon List</h2>

          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="text-gray-600">{coupon.discount_percent}% OFF</p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                  {coupon.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;