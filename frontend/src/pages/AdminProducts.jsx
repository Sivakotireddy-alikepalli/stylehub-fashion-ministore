import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import toast from "react-hot-toast";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
      stock: "",
    });
    setEditingProductId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      if (editingProductId) {
        await API.put(`/admin/products/${editingProductId}`, payload);
        toast.success("Product updated successfully");
      } else {
        await API.post("/admin/products", payload);
        toast.success("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Operation failed");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || "",
      category: product.category,
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Products</h1>
          <p className="mt-2 text-gray-600">
            Add, edit, and delete products from your store.
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleCreateOrUpdate} className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product name"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              required
            />

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              required
            />

            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              required
            />

            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              type="number"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              required
            />

            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 md:col-span-2"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 md:col-span-2"
              rows="4"
              required
            />

            <div className="flex gap-4 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                {editingProductId ? "Update Product" : "Add Product"}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Products List</h2>

          {products.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={product.image_url || "/images/tshirt.jpg"}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/images/tshirt.jpg";
                    }}
                    className="mb-4 h-48 w-full rounded-xl object-cover"
                  />

                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{product.description}</p>

                  <div className="mt-4 space-y-1">
                    <p className="font-semibold text-green-600">₹{product.price}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;