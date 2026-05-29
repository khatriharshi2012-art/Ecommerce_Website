import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLatestOrder,
  getLiveOrder,
  getOrderById,
  getOrderTrackingMeta,
  rateOrderItem,
} from "../utils/orders";
import { formatPrice, getPrimaryImage } from "../utils/format";
import "./pages.css";

const formatDate = (date, options) =>
  new Intl.DateTimeFormat("en-IN", options).format(date);

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(() =>
    getLiveOrder(getOrderById(id) || getLatestOrder())
  );
  const [ratingNotice, setRatingNotice] = useState("");

  if (!order) {
    return (
      <div className="tracking-page empty">
        <h2>No order found</h2>
        <button type="button" className="track-primary-btn" onClick={() => navigate("/orders")}>
          Back to My Orders
        </button>
      </div>
    );
  }

  const meta = getOrderTrackingMeta(order);
  const activeStep = meta.steps[meta.currentIndex];
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const trackingNumber = order.trackingNumber || order.id.replace(/[^0-9a-z]/gi, "").toUpperCase();
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim();
  const handleRating = (productId, productName, rating) => {
    if (order.itemRatings?.[productId]) {
      setRatingNotice("You have already rated this product. Thank you!");
      return;
    }

    const updatedHistory = rateOrderItem(order.id, productId, rating);
    if (!updatedHistory) {
      setRatingNotice("You have already rated this product. Thank you!");
      return;
    }

    setOrder(getLiveOrder(getOrderById(order.id) || order));
    setRatingNotice(`Thank you for rating ${productName}.`);
  };

  return (
    <div className="tracking-page">
      <div className="tracking-head">
        <div>
          <h1>Order Tracking</h1>
          <p>Track your order status in real-time</p>
        </div>
        <div className="tracking-help">
          <i className="fa-solid fa-headset"></i>
          <span>
            <strong>Need Help?</strong>
            We're here to help you
          </span>
          <button type="button" onClick={() => navigate("/contact")}>Contact Support</button>
        </div>
      </div>

      <section className="tracking-summary-strip">
        <div>
          <span>Order ID</span>
          <strong>{order.id}</strong>
          <small className={order.status === "Cancelled" ? "status-pill danger" : "status-pill"}>
            {order.status === "Cancelled" ? "Cancelled" : order.status}
          </small>
        </div>
        <div>
          <span>Order Date</span>
          <strong>{formatDate(meta.orderDate, { day: "numeric", month: "short", year: "numeric" })}</strong>
          <small>{formatDate(meta.orderDate, { hour: "2-digit", minute: "2-digit" })}</small>
        </div>
        <div>
          <span>Estimated Delivery</span>
          <strong className="">
            {formatDate(meta.deliveryStart, { day: "numeric", month: "short", year: "numeric" })}
          </strong>
          <small>Between 10:00 AM - 6:00 PM</small>
        </div>
        <div>
          <span>Shipping Address</span>
          <strong>{customerName}</strong>
          <small>
            {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.postalCode}
          </small>
        </div>
      </section>

      <div className="tracking-layout">
        <main className="tracking-main">
          <section className="tracking-card">
            <h2>Order Progress</h2>
            <div
              className="progress-track"
              style={{
                "--progress": `${meta.progress}%`,
                "--progress-line": `${meta.progress * 0.75}%`,
              }}
            >
              {meta.steps.map((step, index) => {
                const isDone = index < meta.currentIndex;
                const isActive = index === meta.currentIndex;
                return (
                  <div
                    key={step.label}
                    className={`progress-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                  >
                    <span className="progress-icon">
                      <i className={isDone ? "fa-solid fa-check" : step.icon}></i>
                    </span>
                    <strong>{step.label}</strong>
                    <small>
                      {formatDate(step.date, { day: "numeric", month: "short", year: "numeric" })}
                    </small>
                  </div>
                );
              })}
            </div>

            <div className="tracking-alert">
              <i className={activeStep.icon}></i>
              <span>
                <strong>{activeStep.label === "Delivered" ? "Delivered!" : "Your order is on the way!"}</strong>
                {activeStep.text}
              </span>
              {meta.isDelivered ? (
                <div className="tracking-rating-panel">
                  <div className="tracking-rating-head">
                    <strong>Rate Delivered Items</strong>
                    <small>{ratingNotice || "Your rating updates product reviews."}</small>
                  </div>
                  {order.items.map((item) => {
                    const savedRating = order.itemRatings?.[item._id] || 0;
                    return (
                      <div key={item._id} className="tracking-rating-row">
                        <span>
                          <small>{item.name}</small>
                          {savedRating > 0 && <em>Thanks for rating</em>}
                        </span>
                        <div className="rating-stars" aria-label={`Rate ${item.name}`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={star <= savedRating ? "is-selected" : ""}
                              onClick={() => handleRating(item._id, item.name, star)}
                              aria-label={`${star} star${star > 1 ? "s" : ""}`}
                              disabled={savedRating > 0}
                            >
                              {"\u2605"}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <button type="button" onClick={() => navigate("/orders")}>
                  View Details
                </button>
              )}
            </div>
          </section>

          <div className="tracking-detail-grid">
            <section className="tracking-card">
              <h2>Tracking Details</h2>
              <div className="event-list">
                {meta.steps.slice(0, meta.currentIndex + 1).reverse().map((step, index) => (
                  <div key={step.label} className={`event-item ${index === 0 ? "current" : ""}`}>
                    <span></span>
                    <div>
                      <small>{formatDate(step.date, { day: "numeric", month: "short", year: "numeric" })}</small>
                      <strong>{step.text}</strong>
                      <p>{step.label}</p>
                    </div>
                    {index === 0 && <em>Current Status</em>}
                  </div>
                ))}
              </div>
            </section>

            <section className="tracking-card">
              <h2>Shipping Information</h2>
              <div className="tracking-info-row">
                <span>Courier</span>
                <strong>StyleStore Express</strong>
              </div>
              <div className="tracking-info-row">
                <span>Tracking Number</span>
                <strong>{trackingNumber}</strong>
              </div>
              <div className="tracking-info-row">
                <span>Payment</span>
                <strong>{order.paymentMethod.toUpperCase()}</strong>
              </div>
              <button
                type="button"
                className="copy-track-btn"
                onClick={() => navigator.clipboard?.writeText(trackingNumber)}
              >
                <i className="fa-regular fa-copy"></i>
                Copy Tracking Number
              </button>
            </section>
          </div>
        </main>

        <aside className="tracking-card tracking-order-summary">
          <h2>Order Summary</h2>
          <p>{totalItems} Items</p>
          <div className="tracking-items">
            {order.items.map((item, index) => (
              <div key={item._id + index} className="tracking-item">
                <img src={getPrimaryImage(item.image)} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <small>Size: {item.size} - Qty: {item.quantity}</small>
                </div>
                <b>{formatPrice(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="tracking-totals">
            <div><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div><span>Shipping</span><span>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span></div>
            {order.discount > 0 && <div><span>Discount</span><span>- {formatPrice(order.discount)}</span></div>}
            <div className="tracking-total"><span>Total Paid</span><span>{formatPrice(order.total)}</span></div>
          </div>
          <button type="button" onClick={() => navigate("/orders")}>View Order Details</button>
        </aside>
      </div>
    </div>
  );
};

export default OrderTracking;
