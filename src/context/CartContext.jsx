/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { readStorage, writeStorage } from "../utils/storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => readStorage("cart", []));

  useEffect(() => {
    writeStorage("cart", cartItems);
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, size, quantity }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item._id === id && item.size === size)));
  };

  const updateQuantity = (id, size, qty) => {
    if (qty < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item._id === id && item.size === size ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
