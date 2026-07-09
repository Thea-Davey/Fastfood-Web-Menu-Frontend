# Implementation Plan - Category-Specific Stepper Functionality

We will modify the customer menu views so that the inline quantity stepper (`[- Qty +]`) is only shown for simple add-ons: **Drinks** and **Adds on Dips**. For all other customizable categories (**Unlimited**, **Ala Carte**, **Wings to Share**, and **Sides**), clicking the card or the `+` button will direct the user to the item's customization view instead of toggling an inline stepper.

## Proposed Changes

### Category-Specific Quantity Control

---

#### [MODIFY] [home.model.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/home/model/home.model.ts)

- Update the `HomeProductItem` interface to include an optional `category?: string;` property.

#### [MODIFY] [useHomeViewModel.ts](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/home/viewmodel/useHomeViewModel.ts)

- Update `mapApiToHomeProduct` mapping function to extract and format the item's category property (supporting `unlimited`, `ala_carte`, `wings_to_share`, `sides`, `add_on`, `drinks`).

#### [MODIFY] [MenuView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/menu/view/MenuView.tsx)

- Update the `MenuItemCard` rendering iteration loop:
  - Define `isDirectStepper = item.category === 'add_on' || item.category === 'drinks';`
  - Pass `quantity={isDirectStepper ? quantity : 0}` to `MenuItemCard` so it only displays the stepper for those two categories.
  - Implement `onIncrement` behavior:
    - If `isDirectStepper` is true, trigger `handleIncrement(item)` to add directly to cart.
    - If `isDirectStepper` is false, navigate to the customization view (`handleCardClick(item)`).

#### [MODIFY] [HomeView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/home/view/HomeView.tsx)

- Apply the same layout check to `popularItems` and `bestSellers` loops:
  - Define `isDirectStepper = item.category === 'add_on' || item.category === 'drinks';`
  - Pass `quantity={isDirectStepper ? quantity : 0}` to the rendered `MenuItemCard`.
  - Implement `onIncrement` behavior to navigate to configuration (`handleCardClick(item)`) if `isDirectStepper` is false, and increment directly if it is true.

---

## Verification Plan

### Automated Tests
- Run compiler checks:
  ```bash
  npm run build
  ```

### Manual Verification
- Open the Customer App Menu:
  - Select the **Drinks** or **Adds on Dips** categories, click `+` and verify that the stepper `[- Qty +]` appears immediately.
  - Select the **Unlimited**, **Ala Carte**, **Wings to Share**, or **Sides** categories:
    - Click `+` and verify that it opens the customization view instead of adding directly.
    - Verify that no stepper appears on the menu item cards for these categories even if they are in the cart.
