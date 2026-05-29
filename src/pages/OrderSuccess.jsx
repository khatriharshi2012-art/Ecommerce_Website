import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestOrder } from "../utils/orders";
import { formatPrice } from "../utils/format";
import "./pages.css";

const OrderSuccess = () => {
  const [order] = useState(() => getLatestOrder());
  const navigate = useNavigate();

  if (!order) {
    return (
      <h2 style={{ textAlign: "center", padding: "40px 20px" }}>
        No order found
      </h2>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-shell">
        <div className="success-badge">
          <span className="success-check">✓</span>
        </div>

        <h1>Thank you for your order!</h1>
        <p className="subtitle">Your order has been placed successfully.</p>

        <div className="success-order-card">
          <p className="success-order-label">Order ID</p>
          <h2>{order.id}</h2>
          <p>
            A confirmation has been sent to{" "}
            <strong>{order.customer.email}</strong>
          </p>
        </div>

        <div className="success-grid">
          <div className="success-panel">
            <h3>Order Summary</h3>
            {order.items.map((item, idx) => (
              <div key={item._id + idx} className="success-item">
                <div>
                  <p className="success-item-name">{item.name}</p>
                  <p className="success-item-meta">
                    Size: {item.size} - Qty: {item.quantity}
                  </p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <div className="success-totals">
              <div>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div>
                <span>Shipping</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div>
                  <span>Discount</span>
                  <span>- {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="success-panel">
            <h3>Delivery Address</h3>
            <p>
              <strong>
                {order.customer.firstName} {order.customer.lastName}
              </strong>
            </p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.state} -{" "}
              {order.customer.postalCode}
            </p>
            <p>{order.customer.country}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.email}</p>
          </div>
        </div>

        <div className="success-actions">
          <button
            type="button"
            className="success-btn primary"
            onClick={() => navigate(`/order-tracking/${order.id}`)}
          >
            Track Your Order <span>→</span>
          </button>
          <button
            type="button"
            className="success-btn"
            onClick={() => navigate("/everything")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
