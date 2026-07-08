export interface OrderDetailItem {
  id: string;
  name: string;
  quantity: number;
  flavors: string[];
  instructions?: string;
}

export interface CancelledOrder {
  id: string;
  order_id_display: string;
  date: string;
  time: string;
  table_number: string;
  customer_name: string;
  details: OrderDetailItem[];
  order_type: 'Dine In' | 'Takeout';
  estimated_time: string;
  total: number;
  payment_method: 'Cash' | 'GCash' | 'Card' | 'Maya';
  status: 'cancelled';
  cancellation_reason?: string;
}
