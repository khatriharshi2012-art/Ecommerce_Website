import { readStorage, writeStorage } from "./storage";

const DAY = 24 * 60 * 60 * 1000;

export const trackingSteps = [
  {
    label: "Order Confirmed",
    status: "Order Confirmed",
    icon: "fa-solid fa-check",
    offsetDays: 0,
    text: "Your order is confirmed.",
  },
  {
    label: "Packed",
    status: "Packed",
    icon: "fa-solid fa-box",
    offsetDays: 1,
    text: "Your items are packed and ready to ship.",
  },
  {
    label: "Shipped",
    status: "Shipped",
    icon: "fa-solid fa-truck-fast",
    offsetDays: 2,
    text: "Your package is on its way.",
  },
  {
    label: "Delivered",
    status: "Delivered",
    icon: "fa-solid fa-cube",
    offsetDays: 3,
    text: "Your order has been delivered.",
  },
];

export const getLatestOrder = () => readStorage("latestOrder", null);
export const getOrderHistory = () => readStorage("orderHistory", []);
export const getOrderById = (orderId) =>
  getOrderHistory().find((order) => order.id === orderId) || null;
export const getProductReviews = (productId) =>
  readStorage("productReviews", []).filter((review) => review.productId === productId);

export const getOrderDate = (order) => {
  const parsed = Date.parse(order.createdAt || order.date);
  return Number.isNaN(parsed) ? new Date() : new Date(parsed);
};

export const getOrderTrackingMeta = (order, now = new Date()) => {
  const orderDate = getOrderDate(order);
  const elapsedDays = Math.max(0, Math.floor((now - orderDate) / DAY));
  const currentIndex =
    order.status === "Cancelled"
      ? 0
      : Math.min(trackingSteps.length - 1, elapsedDays);
  const steps = trackingSteps.map((step) => ({
    ...step,
    date: new Date(orderDate.getTime() + step.offsetDays * DAY),
  }));

  return {
    orderDate,
    currentIndex,
    steps,
    currentStep: steps[currentIndex],
    deliveryStart: steps[trackingSteps.length - 1].date,
    deliveryEnd: steps[trackingSteps.length - 1].date,
    progress:
      order.status === "Cancelled"
        ? 0
        : (currentIndex / (steps.length - 1)) * 100,
    status:
      order.status === "Cancelled"
        ? "Cancelled"
        : steps[currentIndex]?.status || "Order Confirmed",
    isDelivered:
      order.status !== "Cancelled" && currentIndex === trackingSteps.length - 1,
  };
};

export const getLiveOrder = (order) => {
  if (!order) return null;
  const meta = getOrderTrackingMeta(order);

  return {
    ...order,
    status: meta.status,
    deliveredAt: meta.isDelivered
      ? order.deliveredAt || meta.deliveryEnd.toISOString()
      : order.deliveredAt,
  };
};

const syncLatestOrder = (updatedHistory) => {
  const latestOrder = getLatestOrder();
  const updatedLatest = updatedHistory.find((order) => order.id === latestOrder?.id);

  if (updatedLatest) {
    writeStorage("latestOrder", updatedLatest);
  }

  return updatedHistory;
};

export const saveOrder = (order) => {
  const normalizedOrder = {
    ...order,
    createdAt: order.createdAt || new Date().toISOString(),
    trackingNumber:
      order.trackingNumber || order.id.replace(/[^0-9a-z]/gi, "").toUpperCase(),
    status: order.status || "Order Confirmed",
  };

  writeStorage("latestOrder", normalizedOrder);
  writeStorage("orderHistory", [normalizedOrder, ...getOrderHistory()]);
};

export const updateOrderInHistory = (orderId, updater) => {
  const updatedHistory = getOrderHistory().map((order) =>
    order.id === orderId ? updater(order) : order
  );

  writeStorage("orderHistory", updatedHistory);
  return syncLatestOrder(updatedHistory);
};

export const cancelOrder = (orderId) =>
  updateOrderInHistory(orderId, (order) => ({
    ...order,
    status: "Cancelled",
    cancelledAt: new Date().toLocaleString(),
  }));

export const rateOrderItem = (orderId, productId, rating) => {
  const numericRating = Number(rating);
  const ratedAt = new Date().toISOString();
  let reviewRecord = null;

  const updatedHistory = updateOrderInHistory(orderId, (order) => {
    const item = order.items.find((entry) => entry._id === productId);

    if (order.itemRatings?.[productId]) {
      return order;
    }

    reviewRecord = {
      id: `${orderId}-${productId}`,
      orderId,
      productId,
      productName: item?.name || "Product",
      rating: numericRating,
      createdAt: ratedAt,
    };

    return {
      ...order,
      itemRatings: {
        ...(order.itemRatings || {}),
        [productId]: numericRating,
      },
    };
  });

  if (reviewRecord) {
    const currentReviews = readStorage("productReviews", []);
    const otherReviews = currentReviews.filter((review) => review.id !== reviewRecord.id);
    writeStorage("productReviews", [reviewRecord, ...otherReviews]);
    return updatedHistory;
  }

  return null;
};
