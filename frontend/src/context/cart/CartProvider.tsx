import { CartItem } from "@/services/types";
import { ReactNode, useEffect, useReducer, useState } from "react";

import { CartContext } from "./context";
import { cartReducer } from "./reducer";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    const stored = localStorage.getItem("cart");
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productId: number, quantity: number) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product_id: productId, quantity },
    });
  };

  const updateCartItem = (productId: number, quantity: number) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { product_id: productId, quantity },
    });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
