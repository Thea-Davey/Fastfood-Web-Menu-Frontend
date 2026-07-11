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
  estimated_time: string;
  total: number;
  status: 'cancelled';
  cancellation_reason?: string;
}
