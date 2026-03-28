import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "T-Shirts", "Jeans", "Footwear", "Hoodies", "Jackets"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        product_id: productId,
        quantity: 1,
      });
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Please login first");
    }
  };

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || p.category === selectedCategory)
    );
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-14 text-white shadow-lg">
            <h2 className="text-4xl font-bold">Welcome to StyleHub</h2>
            <p className="mt-3 text-lg text-gray-200">
              Discover trendy fashion, stylish footwear, and everyday essentials.
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <h2 className="mb-6 text-3xl font-bold text-gray-800">Featured Products</h2>

          {products.length === 0 ? (
            <p className="text-gray-500">Loading products...</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;