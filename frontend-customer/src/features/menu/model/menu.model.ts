// Model Layer: menu.model.ts
// Pure TypeScript types, interfaces, and constants for the Menu catalog.
// ZERO functions, ZERO hooks.

export interface SupabaseMenuItem {
  id: string;
  name: string;
  price: number;
  category: 'unlimited' | 'ala_carte' | 'wings_to_share' | 'extra' | 'add_on' | 'drink' | string;
  max_flavors: number;
  is_available: boolean;
  created_at: string;
  max_dips: number;
}

export interface MockMenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  configuration?: {
    flavors?: { min: number; max: number };
    dips?: { min: number; max: number };
    rice?: { min: number; max: number; optional?: boolean };
    fries?: { min: number; max: number; optional?: boolean };
    beverages?: { min: number; max: number; allowed?: string[]; optional?: boolean };
    specialInstructions?: boolean;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'unlimited' | 'ala_carte' | 'wings_to_share' | 'sides' | 'add_on' | 'drinks';
  maxFlavors?: number;
  maxDips?: number;
}

export type MenuCategory =
  | 'All'
  | 'Unlimited'
  | 'Ala Carte'
  | 'Wings to Share'
  | 'Sides'
  | 'Add on Dips'
  | 'Drinks';

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Unlimited',
  'Ala Carte',
  'Wings to Share',
  'Sides',
  'Add on Dips',
  'Drinks',
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [];
