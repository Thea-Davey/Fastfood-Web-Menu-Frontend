# Implementation Plan - MenuItemCard Interactions & My Order 3-Column Layout

This plan outlines the changes required to:
1. Make the **MenuItemCard** fully clickable (redirecting to customization page `/add-order/:id`), and convert its "+" button to an inline quantity selector (`[- Qty +]`) once added to the cart.
2. Re-layout the **Your Order** list in `MyOrderView` into a premium 3-column format:
   - **Column 1**: Product Photo
   - **Column 2**: Name, Flavors, Dips, and Special Notes (left-aligned)
   - **Column 3**: Total Price, inline quantity controls (`[- Qty +]`), and a Trashcan icon (right-aligned).

---

## Proposed Changes

We will modify files across the models, context, shared components, and feature views in `frontend-customer`.

### 1. Data Model & Context Updates

#### [MODIFY] [cart.model.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/model/cart.model.ts)
- Add `menuItemId: string` and `notes?: string` properties to the `CartItem` interface.

#### [MODIFY] [CartContext.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/context/CartContext.tsx)
- In `fetchCart`, map the backend response fields `ci.menu_item_id` to `menuItemId` and `ci.notes` to `notes`.
- In `addItem` (for both backend and local fallback), map `payload.menu_item_id` to `menuItemId` and include the generated `notes` in the state update.
- Modify `decrementQty` to automatically call `removeItem(cartItemId)` if the item's quantity reaches `0` (or falls below `1`), ensuring synchronization with the backend database.

---

### 2. Component Layout & Interaction Updates

#### [MODIFY] [MenuItemCard.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/shared-components/MenuItemCard/MenuItemCard.tsx)
- Update properties: replace `onAddToCart` with `onCardClick: () => void`, `quantity?: number`, `onIncrement?: () => void`, and `onDecrement?: () => void`.
- Make the main card wrapper clickable:
  - Add `onClick={onCardClick}` and `cursor: 'pointer'`.
  - Implement smooth micro-animations on hover (lift, shadow scale) using state-tracked styling flags.
- Update the "+" button:
  - If `quantity` is undefined or 0, display the simple `+` button.
  - If `quantity > 0`, display the inline quantity selector `[- Qty +]`.
  - Use `e.stopPropagation()` on all button clicks to prevent triggering `onCardClick` (card-level navigation).

#### [MODIFY] [CartItemRow.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/shared-components/CartItemRow/CartItemRow.tsx)
- Add `notes?: string` to the props interface.
- Implement the **3-Column Layout**:
  - **Column 1 (Left)**: Photo (fixed size `80px`).
  - **Column 2 (Center)**: Menu item name (`fontSize: 15px`, bold), with flavors, dips, and notes listed underneath on separate lines parsed from the `notes` string (`split(' | ')`).
  - **Column 3 (Right)**: Vertical flex container containing:
    - Calculated total price (`₱{(price * quantity).toFixed(2)}`).
    - Inline quantity selector (`[- Qty +]`).
    - Trashcan button at the bottom.

---

### 3. Feature Page Integration

#### [MODIFY] [useMenuViewModel.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/menu/viewmodel/useMenuViewModel.ts)
- Connect to `useCart()` context.
- Expose methods `handleIncrement(item)` and `handleDecrement(item)`:
  - Finds existing cart items matching the menu item ID.
  - If none exist, call `addItem` with default parameters.
  - If they do exist, call `incrementQty` or `decrementQty` on the last matched cart item to preserve configuration.
- Expose `cartItems` or direct lookup helper to check quantity of each menu item.

#### [MODIFY] [MenuView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/menu/view/MenuView.tsx)
- Update the `MenuItemCard` map to calculate and pass `quantity`, `onIncrement`, `onDecrement`, and `onCardClick`.

#### [MODIFY] [useHomeViewModel.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/home/viewmodel/useHomeViewModel.ts)
- Connect to `useCart()` context.
- Implement matching and quantity calculation logic for Popular and Best Sellers menu items, exposing `handleIncrement`, `handleDecrement`, and `cartItems`.

#### [MODIFY] [HomeView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/home/view/HomeView.tsx)
- Update the mapping for Popular and Best Sellers sections to calculate and pass quantity/interaction props to `MenuItemCard`.

#### [MODIFY] [MyOrderView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/view/MyOrderView.tsx)
- Pass the `notes={item.notes}` property into the `<CartItemRow>` component.

---

## Verification Plan

### Automated Verification
- Run TypeScript checks and compiler build:
  - Command: `npm run build` in `frontend-customer`.

### Manual Verification
1. **Menu Tab Card Clicks**:
   - Verify clicking anywhere on a menu card redirects to `/add-order/:id`.
   - Verify clicking `+` changes it to `[- 1 +]`.
   - Verify clicking `+` inside the selector increments quantity (e.g. to `2`), and `-` decrements it.
   - Verify when quantity drops to `0`, it reverts back to the simple `+` button.
2. **My Order Layout (Your Order)**:
   - Add customized wings (specifying flavors and dips) and simple items to the cart.
   - Go to **My Order** and verify the 3-column layout matches:
     - Col 1: Item image.
     - Col 2: Name, followed by flavor/dip details list (e.g., "Flavors: Hickory BBQ", "Dips: Honey Mustard") and special notes.
     - Col 3: Price, quantity selector, and Trashcan button.
