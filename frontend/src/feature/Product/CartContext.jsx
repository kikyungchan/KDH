import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/product/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(res.data.length);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      // const total = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(guestCart.length);
    }
  }, []);
  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
