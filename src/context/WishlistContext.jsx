/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { readStorage, writeStorage } from "../utils/storage";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `wishlist_${user.email}` : null;

  return (
    <WishlistStateProvider key={storageKey || "guest"} storageKey={storageKey}>
      {children}
    </WishlistStateProvider>
  );
};

const WishlistStateProvider = ({ children, storageKey }) => {
  const [wishlist, setWishlist] = useState(() =>
    storageKey ? readStorage(storageKey, []) : []
  );

  useEffect(() => {
    if (storageKey) {
      writeStorage(storageKey, wishlist);
    }
  }, [wishlist, storageKey]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      return exists ? prev : [...prev, product];
    });
  };

  const removeFromWishlist = (_id) => {
    setWishlist((prev) => prev.filter((p) => p._id !== _id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
