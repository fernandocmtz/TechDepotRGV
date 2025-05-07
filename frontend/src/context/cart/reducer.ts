import { CartItem } from "@/services/types";

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "CLEAR_CART" };

export const cartReducer = (
  state: CartItem[],
  action: CartAction
): CartItem[] => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product_id, quantity, product_inventory } = action.payload;
      const existing = state.find((item) => item.product_id === product_id);
      if (existing) {
        return state.map((item) =>
          item.product_id === product_id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product_inventory),
              }
            : item
        );
      }
      return [...state, action.payload];
    }
    case "UPDATE_ITEM": {
      const { product_id, quantity, product_inventory } = action.payload;
      return state.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: Math.min(quantity, product_inventory) }
          : item
      );
    }
    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.product_id !== action.payload.productId
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};
