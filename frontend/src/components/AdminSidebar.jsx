import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="min-h-screen w-64 bg-slate-900 p-6 text-white">
      <h2 className="mb-8 text-2xl font-bold text-yellow-400">Admin Panel</h2>

      <div className="space-y-4">
        <Link to="/admin/dashboard" className="block rounded px-3 py-2 hover:bg-slate-800">
          Dashboard
        </Link>
        <Link to="/admin/products" className="block rounded px-3 py-2 hover:bg-slate-800">
          Products
        </Link>
        <Link to="/admin/orders" className="block rounded px-3 py-2 hover:bg-slate-800">
          Orders
        </Link>
        <Link to="/admin/coupons" className="block rounded px-3 py-2 hover:bg-slate-800">
          Coupons
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;