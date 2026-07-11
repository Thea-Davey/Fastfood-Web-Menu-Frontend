export interface DashboardSummary {
  today_orders: number;
  pending_orders: number;
  completed_today: number;
  cancelled_today: number;
  revenue_today: number;
  aov?: number;
  average_prep_time?: number;
  top_items?: { name: string; sales: number }[];
}

export interface RecentOrder {
  id: string;
  order_id_display: string;
  customer_name: string;
  time: string;
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt?: string;
}
