import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users/register", formData);
      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Join StyleHub and start shopping
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

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
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;