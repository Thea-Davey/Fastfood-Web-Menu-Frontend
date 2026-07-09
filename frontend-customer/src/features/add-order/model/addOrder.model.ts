// Model Layer: addOrder.model.ts
// Pure TypeScript types representing the Add Order configuration.
// Contains zero logic or functions.

export interface AddOrderConfig {
  flavors?: { min: number; max: number };
  dips?: { min: number; max: number };
  rice?: { min: number; max: number; optional?: boolean };
  fries?: { min: number; max: number; optional?: boolean };
  beverages?: { min: number; max: number; allowed?: string[]; optional?: boolean };
  specialInstructions?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  configuration?: AddOrderConfig;
}

export interface AddOrderState {
  item: MenuItem | null;
  selectedFlavors: string[];
  selectedDips: string[];
  selectedBeverage: string | null;
  selectedRice: string | null;
  selectedFriesFlavor: string | null;
  specialInstructions: string;
  quantity: number;
}
