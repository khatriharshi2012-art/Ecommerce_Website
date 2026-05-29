import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../Components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import "./pages.css";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { notify } = useNotification();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your Wishlist is Empty</h2>
        <p>Browse products and add your favorites</p>
        <button
          type="button"
          className="wishlist-browse-btn"
          onClick={() => {
            notify("Taking you to the products page.");
            navigate("/everything");
          }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">My Wishlist</h2>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="wishlist-link"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
