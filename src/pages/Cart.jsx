import { useCart } from "../context/CartContext";
import "./pages.css";
import { useNavigate } from "react-router-dom";
import { formatPrice, getPrimaryImage } from "../utils/format";
import useRequireAuth from "../hooks/useRequireAuth";

const Cart = () => {

    const navigate = useNavigate();
    const { requireAuth } = useRequireAuth();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice
  } = useCart();

  const shippingFee = cartItems.length > 0 ? 10 : 0;
  const finalTotal = totalPrice + shippingFee;
  const isCartEmpty = cartItems.length === 0;

  const handleProceedToCheckout = () => {
    if (!requireAuth("Please login first to continue to checkout.")) {
      return;
    }

    if (isCartEmpty) {
      alert("Your cart is empty. Add a product before checkout.");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">YOUR CART</h2>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id + item.size}>
                <div className="cart-large">
                <img
                    src={getPrimaryImage(item.image)}
                    alt={item.name}
                    className="cart-img"
                />

                <div className="cart-details">
                    <h4>{item.name}</h4>
                    <p>{formatPrice(item.price)}</p>
                    <span className="size">{item.size}</span>
                </div>
                </div>

            <div className="cart-qty">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const nextQuantity = Number(e.target.value);

                  if (nextQuantity < 1) {
                    alert("Quantity must be at least 1.");
                    return;
                  }

                  updateQuantity(
                    item._id,
                    item.size,
                    nextQuantity
                  );
                }}
              />
            </div>
              

              <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm("Remove this product from your cart?")) {
                    removeFromCart(item._id, item.size);
                    alert("Product removed from cart.");
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>CART TOTALS</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping Fee</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>

           <button
            className={`checkout-btn ${isCartEmpty ? "button-disabled" : ""}`}
            onClick={handleProceedToCheckout}
            >
            PROCEED TO CHECKOUT
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
