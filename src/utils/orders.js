import { readStorage, writeStorage } from "./storage";

export const getLatestOrder = () => readStorage("latestOrder", null);
export const getOrderHistory = () => readStorage("orderHistory", []);
export const getOrderById = (orderId) =>
  getOrderHistory().find((order) => order.id === orderId) || null;

export const saveOrder = (order) => {
  const normalizedOrder = {
    ...order,
    status: order.status || "Order Placed",
  };

  writeStorage("latestOrder", normalizedOrder);
  writeStorage("orderHistory", [normalizedOrder, ...getOrderHistory()]);
};

export const updateOrderInHistory = (orderId, updater) => {
  const updatedHistory = getOrderHistory().map((order) =>
    order.id === orderId ? updater(order) : order
  );

  writeStorage("orderHistory", updatedHistory);

  const latestOrder = getLatestOrder();
  if (latestOrder?.id === orderId) {
    writeStorage("latestOrder", updater(latestOrder));
  }

  return updatedHistory;
};

export const cancelOrder = (orderId) =>
  updateOrderInHistory(orderId, (order) => ({
    ...order,
    status: "Cancelled",
    cancelledAt: new Date().toLocaleString(),
  }));
