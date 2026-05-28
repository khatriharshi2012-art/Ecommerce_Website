import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { saveOrder } from "../utils/orders";
import { formatPrice } from "../utils/format";
import { readStorage, writeStorage } from "../utils/storage";
import useRequireAuth from "../hooks/useRequireAuth";
import "./pages.css";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, requireAuth } = useRequireAuth();

  const shippingFee = totalPrice > 0 ? 10 : 0;
  const isCartEmpty = cartItems.length === 0;
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [editAddress, setEditAddress] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notice, setNotice] = useState(null);
  const [customerReady, setCustomerReady] = useState(false);
  const noticeTimerRef = useRef(null);

  const [customer, setCustomer] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const savedCustomer = readStorage("checkoutCustomer", null);
    if (savedCustomer) {
      setCustomer((prev) => ({
        ...prev,
        ...savedCustomer,
        firstName: savedCustomer.firstName || prev.firstName,
        lastName: savedCustomer.lastName || prev.lastName,
        email: savedCustomer.email || prev.email,
      }));
      setEditAddress(false);
    }

    setCustomerReady(true);
  }, []);

  useEffect(() => {
    if (!customerReady) {
      return;
    }

    writeStorage("checkoutCustomer", customer);
  }, [customer, customerReady]);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2400);
  };

  const handleChange = (e) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateCustomerFields = () => {
    for (const key in customer) {
      if (!customer[key]) {
        showNotice(`Please enter ${key}.`, "error");
        return false;
      }
    }

    return true;
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      showNotice("Please enter a coupon code first.", "error");
      return;
    }

    if (coupon === "SAVE10") {
      setDiscount(10);
      showNotice("Coupon applied successfully.");
    } else {
      showNotice("Invalid coupon code.", "error");
    }
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toDateString();
  };

  const finalTotal = useMemo(
    () => totalPrice + shippingFee - discount,
    [discount, shippingFee, totalPrice]
  );

  const handlePlaceOrder = () => {
    if (!requireAuth("Please login first to place your order.")) {
      return;
    }

    if (isCartEmpty) {
      showNotice("Your cart is empty. Add a product before placing an order.", "error");
      return;
    }

    if (editAddress) {
      showNotice("Please save the address first.", "error");
      return;
    }

    if (!validateCustomerFields()) {
      return;
    }

    const order = {
      id: `ORD-${Date.now()}`,
      customer,
      items: cartItems,
      paymentMethod,
      subtotal: totalPrice,
      shippingFee,
      discount,
      total: finalTotal,
      date: new Date().toLocaleString(),
    };

    saveOrder(order);
    clearCart();
    navigate(`/order-tracking/${order.id}`, { replace: true });
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Shipping Details</h2>

          <div className="form-row">
            <input
              name="firstName"
              placeholder="First Name"
              value={customer.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={customer.lastName}
              onChange={handleChange}
            />
          </div>

          <input
            className="full-width"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
          />
          <input
            className="full-width"
            name="address"
            placeholder="Street Address"
            value={customer.address}
            onChange={handleChange}
          />

          <div className="form-row">
            <input
              name="city"
              placeholder="City"
              value={customer.city}
              onChange={handleChange}
            />
            <input
              name="state"
              placeholder="State"
              value={customer.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              name="postalCode"
              placeholder="Zip Code"
              value={customer.postalCode}
              onChange={handleChange}
            />
            <input
              name="country"
              placeholder="Country"
              value={customer.country}
              onChange={handleChange}
            />
          </div>

          <input
            className="full-width"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
          />

          <button
            type="button"
            className="save-address-btn"
            onClick={() => {
              if (!requireAuth("Please login first to continue with checkout.")) {
                return;
              }

              if (isCartEmpty) {
                showNotice("Add products to your cart before saving checkout details.", "error");
                return;
              }

              if (!validateCustomerFields()) {
                return;
              }

              setEditAddress(false);
              showNotice("Address saved successfully.");
            }}
          >
            Save Address
          </button>
        </div>

        <div className="checkout-right">
          <h2>Order Summary</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item, i) => (
              <div key={item._id + item.size + i} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))
          )}

          <hr />
          <div className="summary-item">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-item">
              <span>Discount</span>
              <span>- {formatPrice(discount)}</span>
            </div>
          )}
          <div className="summary-item total">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>

          <p className="delivery-date">
            Estimated Delivery: <strong>{getDeliveryDate()}</strong>
          </p>

          <div className="coupon-box">
            <input
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="button" onClick={applyCoupon}>Apply</button>
          </div>

          <div className="address-summary">
            <div className="address-header">
              <h3>Delivery Address</h3>
              <button onClick={() => setEditAddress(true)} className="edit-btn">
                Edit
              </button>
            </div>
            {!editAddress ? (
              <>
                <p><strong>{customer.firstName} {customer.lastName}</strong></p>
                <p>{customer.address}</p>
                <p>{customer.city}, {customer.state} - {customer.postalCode}</p>
                <p>{customer.country}</p>
                <p>{customer.phone}</p>
                <p>{customer.email}</p>
              </>
            ) : (
              <p className="muted">Save address to preview here</p>
            )}
          </div>

          <h3 className="payment-title">Payment Method</h3>
          <div className="payment-flex">
            {["cod", "stripe", "razorpay"].map((m) => (
              <label key={m} className={`payment-option ${paymentMethod === m ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
                {m === "cod" ? "Cash on Delivery" : m.toUpperCase()}
              </label>
            ))}
          </div>

          <button
            className={`place-order-btn ${isCartEmpty ? "button-disabled" : ""}`}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>

      </div>

      {notice && (
        <div className={`checkout-toast ${notice.type === "error" ? "is-error" : ""}`}>
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)}>x</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
