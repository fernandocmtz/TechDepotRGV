import { CartItem } from "@/services/types";
import { createContext } from "react";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateCartItem: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});
