export interface StaffLayoutViewState {
  brandTitle: string;
  brandSubtitle: string;
  pageTitle: string;
  activeOrderCount: number;
}

export interface StaffLayoutOutletContext {
  setPageTitle: (pageTitle: string) => void;
  setActiveOrderCount: (activeOrderCount: number) => void;
}

export const STAFF_LAYOUT_DEFAULT_STATE: StaffLayoutViewState = {
  brandTitle: 'Blaine Wings',
  brandSubtitle: '- UNLIMITED WINGS -',
  pageTitle: 'Pending Orders',
  activeOrderCount: 12,
};