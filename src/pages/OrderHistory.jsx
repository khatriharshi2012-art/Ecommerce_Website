import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelOrder, getOrderHistory } from "../utils/orders";
import { formatPrice, getPrimaryImage } from "../utils/format";
import "./pages.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState(() => getOrderHistory());
  const navigate = useNavigate();

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure to cancel this order?")) {
      const updated = cancelOrder(orderId);
      setOrders(updated);
    }
  };

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
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
        <span className="order-history-line" />
      </div>

      {orders.map((order) => (
        <div key={order.id} className="history-card">
          <div className="history-card-top">
            <div
              className="history-item-main clickable"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/order-tracking/${order.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/order-tracking/${order.id}`);
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
                className="history-item clickable"
                onClick={() => goToProduct(item._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    goToProduct(item._id);
                  }
                }}
              >
                <div className="item-left">
                  <img src={getPrimaryImage(item.image)} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
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

                <div className="history-actions">
                  <div className="history-buttons">
                    <button
                      type="button"
                      className="track-btn"
                      onClick={() => navigate(`/order-tracking/${order.id}`)}
                    >
                      Track Order
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={order.status === "Cancelled"}
                    >
                      {order.status === "Cancelled"
                        ? "Cancelled"
                        : "Cancel Order"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
