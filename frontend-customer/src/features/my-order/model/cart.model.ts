// Model Layer: cart.model.ts
// Pure TypeScript types for the shared cart state.
// ZERO functions, ZERO hooks.

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  notes?: string;
}

export interface CartState {
  items: CartItem[];
}

export const DEFAULT_CART_STATE: CartState = {
  items: [],
};
