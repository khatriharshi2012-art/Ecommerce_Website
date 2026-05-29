import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelOrder,
  getLiveOrder,
  getOrderHistory,
  getOrderTrackingMeta,
} from "../utils/orders";
import { formatPrice, getPrimaryImage } from "../utils/format";
import { useNotification } from "../context/NotificationContext";
import "./pages.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState(() =>
    getOrderHistory().map(getLiveOrder),
  );
  const [activeTrackOrderId, setActiveTrackOrderId] = useState(null);
  const navigate = useNavigate();
  const { confirm, notify } = useNotification();

  const handleCancelOrder = async (orderId) => {
    const shouldCancel = await confirm(
      "Are you sure you want to cancel this order?",
      {
        title: "Cancel Order",
        confirmText: "Cancel Order",
        tone: "danger",
      },
    );

    if (shouldCancel) {
      setOrders(cancelOrder(orderId).map(getLiveOrder));
      notify("Order cancelled.");
    }
  };

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getTrackingSteps = (order) => {
    if (order.status === "Cancelled") {
      return [
        { label: "Order Placed", state: "done" },
        { label: "Cancelled", state: "cancelled" },
      ];
    }

    const meta = getOrderTrackingMeta(order);

    return meta.steps.map((step, index) => ({
      label: step.label,
      state:
        index < meta.currentIndex
          ? "done"
          : index === meta.currentIndex
            ? "active"
            : "todo",
    }));
  };

  if (orders.length === 0) {
    return (
      <h2 style={{ textAlign: "center", padding: "40px 20px" }}>
        No orders yet
      </h2>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-head">
        <h1>MY ORDERS</h1>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="history-card">
          <div className="history-card-top">
            <div
              className="history-item-main clickable"
              role="button"
              tabIndex={0}
              onClick={() =>
                setActiveTrackOrderId((current) =>
                  current === order.id ? null : order.id,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveTrackOrderId((current) =>
                    current === order.id ? null : order.id,
                  );
                }
              }}
            >
              <p className="order-id-text">Order ID: {order.id}</p>
            </div>
          </div>

          <div className="items-list">
            {order.items.map((item, i) => (
              <div
                key={item._id + i}
                className="history-item"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    goToProduct(item._id);
                  }
                }}
              >
                <div className="item-left">
                  <img
                    src={getPrimaryImage(item.image)}
                    alt={item.name}
                    onClick={() => goToProduct(item._id)}
                  />
                  <div>
                    <p
                      className="history-product-name"
                      onClick={() => goToProduct(item._id)}
                    >
                      {item.name}
                    </p>
                    <div className="item-copy">
                      <p>{formatPrice(item.price * item.quantity)}</p>
                      <p>Size: {item.size}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div>
                      <p className="order-meta-text">Date: {order.date}</p>
                      <p className="order-meta-text">
                        Payment: {order.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`order-status ${order.status === "Cancelled" ? "is-cancelled" : "is-active"}`}
                >
                  <span className="status-dot" />
                  <span>{order.status || "Order Placed"}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="history-actions">
            <div className="history-buttons">
              <button
                type="button"
                className="track-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/order-tracking/${order.id}`);
                }}
              >
                Track Order
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelOrder(order.id);
                }}
                disabled={order.status === "Cancelled"}
              >
                {order.status === "Cancelled" ? "Cancelled" : "Cancel Order"}
              </button>
            </div>
          </div>
          {activeTrackOrderId === order.id && (
            <div className="track-panel">
              <div className="track-panel-head">
                <strong>Tracking Timeline</strong>
                <span>Order #{order.id}</span>
              </div>

              <div className="tracker">
                {getTrackingSteps(order).map((step) => (
                  <div
                    key={step.label}
                    className={`tracker-step ${step.state}`}
                  >
                    <span className="tracker-dot" />
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
