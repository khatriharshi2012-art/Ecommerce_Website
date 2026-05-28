import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../assets/assets";
import ProductCard from "../Components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/format";
import useRequireAuth from "../hooks/useRequireAuth";
import "./pages.css";

const ProductDetailsContent = ({ id }) => {
  const navigate = useNavigate();
  const product = products.find((p) => p._id === id);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { requireAuth } = useRequireAuth();

  const [mainImage, setMainImage] = useState(product?.image[0] || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) return <p style={{ padding: "20px" }}>Product not found</p>;

  const isWishlisted = wishlist.some((p) => p._id === product._id);

  const handleWishlist = () => {
    if (!requireAuth("Please login first to use your wishlist.")) {
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

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.subCategory === product.subCategory &&
        p._id !== product._id
    )
    .slice(0, 4);

  return (
    <div className="product-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="product-details-container">
        <div className="product-images">
          <div className="side-images">
            {product.image.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                className={img === mainImage ? "active-thumb" : ""}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
        </div>

        <div className="product-details-info">
          <div className="title-wishlist">
            <h2>{product.name}</h2>

            <button className="wishlist-btn" onClick={handleWishlist}>
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>

          <p className="price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>

          <div className="size-section">
            <p>Select Size:</p>
            <div className="sizes">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={
                    selectedSize === size
                      ? "size-btn selected"
                      : "size-btn"
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-section">
            <p>Quantity:</p>
            <div className="quantity-controls">
              <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={() => {
              if (!requireAuth("Please login first to add products to your cart.")) {
                return;
              }

              if (!selectedSize) return alert("Select a size!");
              addToCart(product, selectedSize, quantity);
              alert("Product added to cart.");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tabs-header">
          <button
            className={activeTab === "description" ? "active-tab" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={activeTab === "reviews" ? "active-tab" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "reviews" && <p>No reviews yet.</p>}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  return <ProductDetailsContent key={id} id={id} />;
};

export default ProductDetails;
