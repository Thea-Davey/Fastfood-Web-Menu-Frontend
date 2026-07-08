// Model Layer: mainLayout.model.ts
// Pure TypeScript definitions and static constants representing the domain logic for MainLayout.
// Contains zero imports of React, react-router-dom, or views.

export interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export const MAIN_LAYOUT_TABS: TabItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: 'home' },
  { id: 'menu', label: 'Menu', path: '/menu', icon: 'restaurant_menu' },
  { id: 'my-order', label: 'My Order', path: '/my-order', icon: 'shopping_cart' },
];
