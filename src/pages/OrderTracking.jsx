import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLatestOrder, getOrderById } from "../utils/orders";
import { formatPrice } from "../utils/format";
import "./pages.css";

const getStepState = (order, index) => {
  if (order.status === "Cancelled") {
    return index === 0 ? "done" : "cancelled";
  }

  if (index === 0) return "done";
  if (index === 1) return "done";
  if (index === 2) return "active";
  return "todo";
};

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(id) || getLatestOrder(), [id]);

  if (!order) {
    return (
      <div className="track-page empty">
        <h2>No order found</h2>
        <button type="button" className="track-back-btn" onClick={() => navigate("/cart")}>
          Back to Cart
        </button>
      </div>
    );
  }

  const steps =
    order.status === "Cancelled"
      ? ["Order Placed", "Cancelled"]
      : ["Order Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="track-page">
      <div className="track-shell">
        <div className="track-hero">
          <div className="track-check">✓</div>
          <div>
            <h1>Order Tracking</h1>
            <p>Track your order status in real time.</p>
          </div>
        </div>

        <div className="track-summary-card">
          <div>
            <p className="track-label">Order ID</p>
            <h2>{order.id}</h2>
          </div>
          <div>
            <p className="track-label">Order Date</p>
            <h3>{order.date}</h3>
          </div>
        </div>

        <div className="track-timeline-card">
          <div className="track-timeline">
            {steps.map((step, index) => (
              <div key={step} className={`track-step ${getStepState(order, index)}`}>
                <span className="track-step-dot" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="track-grid">
          <div className="track-panel">
            <h3>Estimated Delivery</h3>
            <div className="delivery-box">
              <p>Expected by</p>
              <strong>{deliveryDate.toDateString()}</strong>
              <span>Between 10:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className="track-panel">
            <h3>Tracking Details</h3>
            <div className="track-detail-row">
              <span>Status</span>
              <strong>{order.status || "Order Placed"}</strong>
            </div>
            <div className="track-detail-row">
              <span>Tracking Number</span>
              <strong>{order.id}</strong>
            </div>
            <div className="track-detail-row">
              <span>Payment</span>
              <strong>{order.paymentMethod.toUpperCase()}</strong>
            </div>
          </div>
        </div>

        <div className="track-panel">
          <h3>Order Items</h3>
          <div className="track-items">
            {order.items.map((item, idx) => (
              <div key={item._id + idx} className="track-item">
                <div>
                  <p className="track-item-name">{item.name}</p>
                  <p className="track-item-meta">
                    Size: {item.size} - Qty: {item.quantity}
                  </p>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="track-panel">
          <h3>Delivery Address</h3>
          <p><strong>{order.customer.firstName} {order.customer.lastName}</strong></p>
          <p>{order.customer.address}</p>
          <p>
            {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
          </p>
          <p>{order.customer.country}</p>
          <p>{order.customer.phone}</p>
          <p>{order.customer.email}</p>
        </div>

        <div className="track-actions">
          <button type="button" className="track-primary-btn" onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
          <button type="button" className="track-secondary-btn" onClick={() => navigate("/orders")}>
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
