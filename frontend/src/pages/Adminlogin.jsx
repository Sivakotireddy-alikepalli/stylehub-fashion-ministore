import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/admin-login", formData);

      localStorage.setItem("adminToken", res.data.access_token);
      localStorage.setItem("adminRole", res.data.role);

      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Admin login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Only admin can access dashboard
        </p>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black hover:bg-yellow-400"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;