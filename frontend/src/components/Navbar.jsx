import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await API.get("/cart/");
      setCartCount(res.data.items.length);
    } catch (err) {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 px-6 py-4 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-yellow-400">StyleHub</h1>

        <div className="hidden flex-1 md:block">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full rounded-lg px-4 py-2 text-black outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>

          {token ? (
            <>
              <Link to="/cart" className="relative hover:text-yellow-400">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/orders" className="hover:text-yellow-400">
                Orders
              </Link>

              <button
                onClick={handleLogout}
                className="rounded bg-yellow-500 px-4 py-2 font-medium text-black hover:bg-yellow-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;