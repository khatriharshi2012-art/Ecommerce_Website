import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice, getPrimaryImage } from "../utils/format";
import useRequireAuth from "../hooks/useRequireAuth";
import "./components.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user, requireAuth } = useRequireAuth();
  const navigate = useNavigate();

  const isWishlisted = wishlist.some((p) => p._id === product._id);

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleWishlist = (e) => {
    stop(e);
    if (!requireAuth("Please login first to save products to your wishlist.")) {
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product._id);
      alert("Product removed from wishlist.");
      return;
    }

    addToWishlist(product);
    alert("Product added to wishlist.");
  };

  const handleAddToCart = (e) => {
    stop(e);
    if (!requireAuth("Please login first to add products to your cart.")) {
      return;
    }

    addToCart(product, product.sizes?.[0] || "M", 1);
    alert("Product added to cart.");
  };

  const handleViewDetails = (e) => {
    stop(e);
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="product-card">
      <Link
        to={`/product/${product._id}`}
        className="product-link"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
      >
        <div className="product-img-wrapper">
          <img src={getPrimaryImage(product.image)} alt={product.name} />

          <div className="product-actions">
            <div className="product-actions-inner">
              <button className="cart-btn" onClick={handleAddToCart}>
                <i className="fa-solid fa-bag-shopping fs-6"></i>
              </button>

              <button className="wishlist-btn" onClick={handleWishlist}>
                {isWishlisted ? "♥" : "♡"}
              </button>

              <button className="details-btn" onClick={handleViewDetails}>
                <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
              </button>
            </div>
          </div>
        </div>

         <div className="latest-info">
              <h4>{product.name}</h4>
              <p className="category">
                {product.category} / {product.subCategory}
              </p>
              <p className="price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
