function ProductCard({ product, onAddToCart }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={product.image_url || "/images/tshirt.jpg"}
        alt={product.name}
        onError={(e) => {
          e.target.src = "/images/tshirt.jpg";
        }}
        className="h-64 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>

        <p className="mt-3 text-sm text-gray-400 line-through">
          ₹{product.price + 300}
        </p>
        <p className="text-2xl font-bold text-pink-600">₹{product.price}</p>
        <p className="text-sm text-green-600">Save ₹300</p>

        <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
        <p className="mt-1 text-sm text-gray-500">Stock: {product.stock}</p>

        <button
          onClick={() => onAddToCart(product.id)}
          className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;