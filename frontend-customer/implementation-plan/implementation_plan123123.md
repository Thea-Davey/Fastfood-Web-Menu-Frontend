# Order Status Flow and Screen Implementation

This plan details the implementation for updating the checkout flow and introducing the new "Order Status" screen where users can track their placed orders.

## User Review Required

- **Data Fetching for Order Status:** Since the backend handles order creation via `/api/orders/checkout`, I will implement the order status fetching in the frontend either by querying the Supabase `orders` and `order_items` tables directly (if RLS allows) or by making a `GET` request to `/api/orders/:id` on the backend. If the backend doesn't have an endpoint for this, querying Supabase directly will be the fallback. 
- **Session State:** Currently, when an order is checked out, the local `session_id` is cleared from `localStorage`. I will ensure we save the `checkoutOrderId` and `checkoutSessionId` so that the "Order Status" screen can successfully fetch and cancel the order even after the checkout happens.

## Open Questions

> [!WARNING]
> **Page Refresh:** If a user refreshes the page while on the "Order Status" screen, the React state will reset. Should I save the `checkoutOrderId` in `localStorage` so that if they return to the app they can still see their active order status?

## Proposed Changes

---

### `frontend-customer` - View & ViewModel Updates

#### [MODIFY] [useMyOrderViewModel.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/viewmodel/useMyOrderViewModel.ts)
- Add `showOrderStatus` state boolean.
- Export a function `handleCheckOrderStatus` to set this state to true.
- Make sure `checkoutOrderId` and `checkoutSessionId` are exposed to be passed to the new view.

#### [MODIFY] [MyOrderView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/view/MyOrderView.tsx)
- Update the `checkoutSuccess` fallback screen:
  - Remove the "Cancel Order" button.
  - Rename the "Back to Menu" button to "Check Order Status".
  - Wire the button to `handleCheckOrderStatus`.
- Conditionally render the new `OrderStatusView` if `showOrderStatus` is true.

---

### `frontend-customer` - New Feature: Order Status

#### [NEW] `src/features/order-status/view/OrderStatusView.tsx`
- Build the UI layout as requested:
  - Top scrollable container displaying "Table # [number]".
  - Scrollable Orders Container.
  - Maps through the ordered items and renders `PlacedItemRow`.
  - Fixed bottom section with a "Cancel Order" button.
  - A modal/overlay that appears when "Cancel Order" is clicked, containing a text field for the cancellation reason, "Submit", and "Cancel" buttons.

#### [NEW] `src/features/order-status/viewmodel/useOrderStatusViewModel.ts`
- Takes `orderId` and `sessionId` as props.
- Fetches the order details and order items from the database.
- Implements the cancellation logic using the existing `PATCH /api/orders/:id/customer-cancel` endpoint with the reason from the overlay.

#### [NEW] `src/features/order-status/components/PlacedItemRow.tsx`
- A UI component styled identically to `MenuItemCard`.
- Removes the quantity stepper and trashcan.
- Replaces them with a status box showing "pending" (orange), "preparing" (yellow), or "complete" (green).

## Verification Plan

### Manual Verification
1. I will place a new order using the local app and click "Checkout".
2. I will verify that the success screen shows "Check Order Status" without the "Cancel Order" button.
3. I will click "Check Order Status" and verify that it correctly displays the `OrderStatusView` with the table number and the newly created `PlacedItemRow` components.
4. I will verify the colors of the status badges.
5. I will test clicking the "Cancel Order" button at the bottom, typing a reason in the overlay, and submitting to ensure it properly cancels the order.
