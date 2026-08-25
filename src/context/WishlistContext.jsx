import { createContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse wishlist", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (movie) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === movie.id)) return prev;
      showToast(`"${movie.title || movie.name}" added to Wishlist!`, "success");
      return [...prev, movie];
    });
  };

  const removetowishlist = (movie) => {
    setWishlist((prev) => prev.filter((item) => item.id !== movie.id));
    showToast(`Removed from Wishlist`, "danger");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removetowishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}