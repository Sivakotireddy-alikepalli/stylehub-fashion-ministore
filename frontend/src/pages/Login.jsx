import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/login", formData);
      localStorage.setItem("token", response.data.access_token);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Login to continue shopping on StyleHub
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black hover:bg-yellow-400"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;