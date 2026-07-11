# Multi-Order Flow: Order Status & New Order Checkout

This plan outlines the updates to the "My Order" tab to support placing multiple separate orders within a single dining session. Instead of clearing the session upon checkout, the app will keep the session active and transition to an "Order Status" view where users can track their placed orders and add new ones.

## User Review Required

> [!WARNING]
> **Session Persistence Change**
> Currently, checking out an order destroys the session by clearing `session_id` and `participant_id` from `localStorage`. To support multiple orders per table, **we will stop destroying the session upon checkout**. The session will remain alive so the customer can check order statuses and add more orders. (The session should ultimately be closed by the Admin/Kitchen when the customer leaves).

## Open Questions

> [!IMPORTANT]
> **1. Backend API for Fetching Orders**
> To display the "Order Status" screen, we need to fetch all previously placed orders for the current session. 
> - Is there an existing backend endpoint for this (e.g., `GET /api/sessions/:session_id/orders` or `GET /api/tables/:table_name/session`)?
> - Does this endpoint return the `status` of each order item (pending/preparing/complete)?
> - If not, should I mock this data for the frontend first, or do we need to build the backend endpoint as well?
>
> **2. "Order Placed" vs "Order Status" screens**
> In the flow you described: `Checkout` -> `Order Placed!` -> `Check Order Status` -> `Order Status Screen`. 
> Do you want the "Order Placed!" screen to still exist as a brief confirmation page, or should checkout immediately redirect to the "Order Status" screen? (Based on your prompt, it seems you want to keep the "Order Placed!" screen as an intermediate step. Please confirm.)

## Proposed Changes

---

### Context & ViewModel Layer

Modifying the checkout flow to retain the session and tracking the global "My Order" tab state.

#### [MODIFY] [useMyOrderViewModel.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/viewmodel/useMyOrderViewModel.ts)
- **Remove Session Destruction:** Remove `localStorage.removeItem('session_id')` from `handleCheckout`.
- **State Management:** Add view state management to track which screen to show in the "My Order" tab (`cart`, `order_placed`, `order_status`, `new_order_checkout`).
- **Fetch Orders:** Add logic/function to fetch the history of placed orders for the current session (pending your answer to Question 1).

---

### View Layer: Screens & Components

Updating existing screens and creating new components for the Order Status interface.

#### [MODIFY] [MyOrderView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/view/MyOrderView.tsx)
- Refactor to act as a **Controller Component** that renders one of the following screens based on the current state:
  1. `Initial Cart Screen` (the current cart view)
  2. `Order Placed Screen` (updated to match new button requirements)
  3. `Order Status Screen` (new component)
  4. `New Order Checkout Screen` (new component)

#### [NEW] `OrderPlacedScreen.tsx` (Extracted from MyOrderView)
- Remove the "Cancel" button.
- Change the "Back to Menu" button text to "Check Order Status".
- Clicking it updates the view state to `order_status`.

#### [NEW] `OrderStatusScreen.tsx`
- **Header:** Sticky header showing `Table # [number]`.
- **Order List:** Scrollable list rendering an expandable container for each placed order (Order 1, Order 2, etc.).
- **Footer:** Fixed bottom container with the `[Add new order]` button, which changes the view state to `new_order_checkout`.

#### [NEW] `PlacedItemRow.tsx` (Shared Component)
- A clone of `MenuItemCard.tsx` but purely for display.
- Replaces the interactive `[ - 1 + ] [trash]` stepper with a **Status Badge** (pending: orange, preparing: yellow, complete: green).

#### [NEW] `NewOrderCheckoutScreen.tsx`
- Reuses the cart UI but updates the title to `Your Order # [N]`.
- Adds a secondary `[Cancel]` button beside the `[Checkout]` button.
- `[Cancel]` clears the current cart items (undoing the additions) and returns the user to the `order_status` screen.

## Verification Plan

### Manual Verification
1. Open the Customer app via Admin QR link.
2. Add items to cart and Checkout -> Confirm transition to "Order Placed!" screen (No Cancel button, only "Check Order Status").
3. Click "Check Order Status" -> Confirm transition to "Order Status" screen.
4. Verify "Order Status" shows the previously placed order with items marked as "Pending" (orange).
5. Click "Add new order" -> Confirm transition to "New Order Checkout" with title "Your Order # 2".
6. Click "Cancel" -> Confirm it reverts to "Order Status" and cart is emptied.
7. Add items again, click "Checkout" -> Confirm Order 2 is successfully placed and added to the Order Status list.
