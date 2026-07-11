# Order Status & New Order Checkout Flow Implementation

This plan details the steps to build out the "Order Status" and "New Order Checkout" flows for the customer frontend, transitioning away from the simple success screen to a persistent order tracking interface.

## User Review Required

- Please review the **Proposed Changes** to ensure the new routing (`/order-status` and `/new-order-checkout`) aligns with your expectations.
- Note the styling details in `PlacedItemRow` (status colors: orange, yellow, green).

> [!WARNING]
> This feature requires the frontend to retrieve the list of orders previously submitted by the current session. See the **Open Questions** below regarding backend support.

## Open Questions

> [!IMPORTANT]
> 1. **Backend Orders Endpoint**: Does the backend already have an endpoint where the customer app can fetch all submitted orders for their active session? (e.g., `GET /api/tables/:table_name/session/orders` or `GET /api/orders?session_id=...`). If this doesn't exist, I will need to know if I should mock it for now, or if we can use an existing endpoint.
> 2. **Order Structure**: When fetching a customer's placed orders, does the backend include the `status` (`pending`, `preparing`, `complete`) for each individual item, or is the status tied to the entire order? 

## Proposed Changes

### Routes (`frontend-customer/src/routes/`)

#### [MODIFY] `index.tsx`
- Register `/order-status` pointing to the new `OrderStatusView`.
- Register `/new-order-checkout` pointing to `NewOrderCheckoutView`.

### My Order (`frontend-customer/src/features/my-order/`)

#### [MODIFY] `view/MyOrderView.tsx`
- Update the "Order Placed!" success screen.
- Remove the `Cancel Order` button.
- Rename `Back to Menu` to `Check Order Status`.
- Update the button's `onClick` to redirect the user to `/order-status` instead of `/`.

#### [NEW] `view/OrderStatusView.tsx`
- Implement the UI from Picture 1.
- Add a scrollable container for the `Table # [number]` header.
- Create dynamically mapped sections for `ORDER [number]` (sticky header).
- Render `PlacedItemRow` cards for each item in the order.
- Fix an `Add new order` button at the bottom of the screen (just above the bottom nav) that redirects to `/new-order-checkout`.

#### [NEW] `viewmodel/useOrderStatusViewModel.ts`
- Extract session ID / table number from context.
- Fetch the list of historical orders placed during this session.
- Process and group items by their order batch so the view can render "ORDER 1", "ORDER 2", etc.

#### [NEW] `view/NewOrderCheckoutView.tsx`
- Implement the UI from Picture 2.
- Reuse logic from `useMyOrderViewModel` but adapt the view layout.
- Dynamically set the title to `Your Order # [number]` (where number is total past orders + 1).
- Split the bottom action area into two buttons: `Cancel` and `Checkout`.
- Implement `Cancel` to clear the current cart and navigate back to `/order-status`.

### Shared Components (`frontend-customer/src/shared-components/`)

#### [NEW] `PlacedItemRow/PlacedItemRow.tsx`
- Duplicate the styling of `MenuItemCard` but adapt it for placed orders.
- Replace the quantity stepper and trashcan with a customized status badge.
- Implement conditional styling for the badge:
  - `pending` -> Orange
  - `preparing` -> Yellow
  - `complete` -> Green

## Verification Plan

### Manual Verification
1. **Initial Order**: Go to "My Order" and checkout. Confirm the success screen shows "Check Order Status" and NO "Cancel" button.
2. **Order Status Screen**: Click "Check Order Status". Verify layout matches Picture 1, with a sticky "Order 1" header and "pending" status badges on items.
3. **Add New Order**: Scroll to the bottom and click "Add new order". Verify redirection to `/new-order-checkout`.
4. **New Order Checkout Screen**: Verify the title says "Your Order # 2" and the "Cancel" button appears next to "Checkout".
5. **Cancel Flow**: Click "Cancel", confirm the cart is cleared (or abandoned) and you return to the "Order Status" screen.
