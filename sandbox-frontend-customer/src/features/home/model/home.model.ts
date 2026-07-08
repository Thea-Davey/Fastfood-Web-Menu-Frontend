// Model Layer: home.model.ts
// Pure TypeScript types representing the Home landing page sections.
// Contains zero logic or functions.

export interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface HomeProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface HomeDashboardData {
  banners: BannerItem[];
  popularItems: HomeProductItem[];
  deals: HomeProductItem[];
}

export const DEFAULT_HOME_DASHBOARD: HomeDashboardData = {
  banners: [],
  popularItems: [],
  deals: [],
};
