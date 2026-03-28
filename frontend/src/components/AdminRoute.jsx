import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminRole = localStorage.getItem("adminRole");

  if (!adminToken || adminRole !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default AdminRoute;