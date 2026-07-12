// ─── DB-level status values (lowercase, matching the Postgres enum) ──────────
export enum StaffOrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum StaffOrderType {
  DINE_IN = 'Dine In',
}

// ─── UI-facing interfaces ─────────────────────────────────────────────────────
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
  /** Raw ISO-8601 timestamp from created_at — used by the elapsed timer */
  createdAt: string;
  updatedAt: string;
  orderType: StaffOrderType;
  status: StaffOrderStatus;
  items: StaffOrderItem[];
}

// ─── Raw backend API response shape ──────────────────────────────────────────
export interface OrderItemApiResponse {
  id: string;
  menu_item_id: string;
  participant_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes: string | null;
  selected_rice: string | null;
  selected_fries_flavor: string | null;
  selected_beverage: string | null;
  special_instructions: string | null;
  // Joined relations (present when backend selects them):
  menu_items?: { name: string } | null;
  order_item_flavors?: { flavors: { name: string } | null }[];
  order_item_dips?: { dips: { name: string } | null }[];
}

export interface OrderApiResponse {
  id: string;
  order_number: number;
  table_number: string;
  status: string;
  total_amount: number;
  payment_method: string;
  cancel_reason: string | null;
  session_id: string;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
  last_modified_by: string | null;
  order_items: OrderItemApiResponse[];
}

// ─── Mapping function (single source of truth) ───────────────────────────────
/**
 * Converts a raw backend OrderApiResponse into the UI's StaffPendingOrder shape.
 * Used by both the REST fetch handlers and socket event handlers so the conversion
 * lives in exactly one place.
 */
export function mapOrderResponseToStaffPendingOrder(raw: OrderApiResponse): StaffPendingOrder {
  const status = (raw.status as StaffOrderStatus) ?? StaffOrderStatus.PENDING;

  const items: StaffOrderItem[] = (raw.order_items ?? []).map((oi) => {
    const flavors = (oi.order_item_flavors ?? [])
      .map((f) => f.flavors?.name)
      .filter((n): n is string => Boolean(n));

    const dips = (oi.order_item_dips ?? [])
      .map((d) => d.dips?.name)
      .filter((n): n is string => Boolean(n));

    return {
      quantity: oi.quantity,
      // Fall back to menu_item_id if the name join is absent (backend doesn't join yet)
      name: oi.menu_items?.name ?? oi.menu_item_id,
      // Prefer special_instructions (customer-facing); fall back to notes.
      // Never join both — the customer app may populate both fields with the same text.
      ...(oi.special_instructions || oi.notes ? {
        specialInstructions: oi.special_instructions || oi.notes,
      } : {}),
      ...(flavors.length > 0 ? { flavors } : {}),
      ...(dips.length > 0 ? { dips } : {}),
    };
  });

  // Group identical items together by combining their quantities
  const groupedItems = items.reduce((acc, currentItem) => {
    const existingIndex = acc.findIndex(
      (i) =>
        i.name === currentItem.name &&
        i.specialInstructions === currentItem.specialInstructions &&
        JSON.stringify(i.flavors) === JSON.stringify(currentItem.flavors) &&
        JSON.stringify(i.dips) === JSON.stringify(currentItem.dips)
    );

    if (existingIndex >= 0) {
      acc[existingIndex].quantity += currentItem.quantity;
    } else {
      acc.push(currentItem);
    }
    return acc;
  }, [] as StaffOrderItem[]);

  // Format the time portion of created_at for display (e.g. "12:08 PM")
  const orderTime = new Date(raw.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: raw.id,
    tableNumber: raw.table_number,
    // No customer_name on orders table — use order number as identifier
    customerName: `Order #${raw.order_number}`,
    orderTime,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    orderType: StaffOrderType.DINE_IN, // order_type not yet in schema; default to DINE_IN
    status,
    items: groupedItems,
  };
}