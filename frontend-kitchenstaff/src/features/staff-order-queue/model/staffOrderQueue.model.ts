import {
  StaffOrderStatus,
  StaffOrderType,
  type StaffPendingOrder,
} from '../../staff-pending-orders/model/staffPendingOrders.model';

export interface StaffOrderQueueEntry extends StaffPendingOrder {
  createdAt: string;
  queueNumber: number;
}

export const STAFF_ORDER_QUEUE_DEFAULT: StaffOrderQueueEntry[] = [
  {
    id: 'queue-3003',
    tableNumber: 'Table 9',
    customerName: 'J. Alvarez',
    orderTime: '12:08 PM',
    createdAt: '2026-07-08T12:08:10Z',
    queueNumber: 3,
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.PENDING,
    items: [
      {
        quantity: 2,
        name: '8 Piece Wings',
        flavors: ['Lemon Pepper'],
        dips: ['Ranch'],
      },
      {
        quantity: 1,
        name: 'Onion Rings',
        specialInstructions: 'Extra salt',
      },
    ],
  },
  {
    id: 'queue-3001',
    tableNumber: 'Table 2',
    customerName: 'S. Brooks',
    orderTime: '11:59 AM',
    createdAt: '2026-07-08T11:59:42Z',
    queueNumber: 1,
    orderType: StaffOrderType.TAKEOUT,
    status: StaffOrderStatus.PENDING,
    items: [
      {
        quantity: 1,
        name: '20 Piece Wings',
        flavors: ['Garlic Parmesan'],
        dips: ['Blue Cheese'],
      },
      {
        quantity: 2,
        name: 'Fries',
      },
    ],
  },
];
