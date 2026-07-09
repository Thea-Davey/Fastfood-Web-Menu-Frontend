export enum StaffOrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum StaffOrderType {
  DINE_IN = 'Dine In',
  TAKEOUT = 'Takeout',
}

export interface StaffOrderItem {
  quantity: number;
  name: string;
  specialInstructions?: string;
  flavors?: string[];
  dips?: string[];
}

export interface StaffPendingOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  orderTime: string;
  orderType: StaffOrderType;
  status: StaffOrderStatus;
  items: StaffOrderItem[];
}

export const STAFF_PENDING_ORDERS_DEFAULT: StaffPendingOrder[] = [
  {
    id: 'order-1',
    tableNumber: '4',
    customerName: 'Customer name',
    orderTime: 'Time',
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.PREPARING,
    items: [
      {
        quantity: 1,
        name: '9 pcs Wings',
        flavors: ['Buffalo', 'Creamy Cheese'],
        dips: ['Iced Tea'],
      },
    ],
  },
  {
    id: 'order-2',
    tableNumber: '4',
    customerName: 'Customer name',
    orderTime: 'Time',
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.PREPARING,
    items: [
      {
        quantity: 1,
        name: '9 pcs Wings',
        flavors: ['Buffalo', 'Creamy Cheese'],
        dips: ['Iced Tea'],
      },
    ],
  },
  {
    id: 'order-3',
    tableNumber: '4',
    customerName: 'Customer name',
    orderTime: 'Time',
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.PENDING,
    items: [
      {
        quantity: 1,
        name: '9 pcs Wings',
        flavors: ['Buffalo', 'Creamy Cheese'],
        dips: ['Iced Tea'],
      },
      {
        quantity: 2,
        name: 'Coke Mismo',
      },
    ],
  },
  {
    id: 'order-4',
    tableNumber: '4',
    customerName: 'Customer name',
    orderTime: 'Time',
    orderType: StaffOrderType.DINE_IN,
    status: StaffOrderStatus.PENDING,
    items: [
      {
        quantity: 1,
        name: '9 pcs Wings',
        flavors: ['Buffalo', 'Creamy Cheese'],
        dips: ['Iced Tea'],
      },
      {
        quantity: 2,
        name: 'Coke Mismo',
      },
    ],
  },
];