import { StaffOrderStatus, StaffOrderType, type StaffPendingOrder } from '../../staff-pending-orders/model/staffPendingOrders.model';

export interface StaffCompletedOrder extends StaffPendingOrder {}

export const STAFF_COMPLETED_ORDERS_DEFAULT: StaffCompletedOrder[] = [
  {
    id: 'completed-2001',
    tableNumber: 'Table 2',
    customerName: 'L. Garcia',
    orderTime: '11:14 AM',
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.COMPLETED,
    items: [
      {
        quantity: 2,
        name: '20 Piece Wings',
        flavors: ['Lemon Pepper', 'Garlic Parmesan'],
        dips: ['Ranch'],
      },
      {
        quantity: 1,
        name: 'Loaded Fries',
        specialInstructions: 'No onions',
      },
    ],
  },
  {
    id: 'completed-2002',
    tableNumber: 'Table 6',
    customerName: 'T. Nguyen',
    orderTime: '11:22 AM',
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.COMPLETED,
    items: [
      {
        quantity: 1,
        name: '10 Piece Wings',
        flavors: ['Honey BBQ'],
        dips: ['Blue Cheese'],
      },
    ],
  },
];
