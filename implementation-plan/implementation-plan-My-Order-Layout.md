# Implementation Plan - Your Order Card Layout Redesign (With Alignment Details)

We will redesign the customer's "Your Order" list cards to use a 3-column layout. The quantity bar and trashcan will be placed side-by-side in the same line. The details column will be top-aligned, and the quantity bar and trashcan will have specific top and bottom alignments.

## Proposed Changes

### Customer Checkout Card Layout

---

#### [MODIFY] [CartItemRow.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/shared-components/CartItemRow/CartItemRow.tsx)

- Update wrapper style to white card container:
  - Add `backgroundColor: '#FFFFFF'`
  - Add `borderRadius: '16px'`
  - Add `padding: '24px 20px'`
  - Add `marginBottom: '16px'`
  - Add `border: '1px solid #E2E8F0'`
  - Add `boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)'`
- Implement note parsing logic `renderParsedNotes` to extract flavors, dips, rice, beverage, and fries options:
  - Prefix each selection with its corresponding quantity (flavor quantity computed dynamically using the item's name pieces count divided by selected flavors count, others default to `1`).
  - Render special instructions wrapped in double quotes `"..."`. No other detail should have double quotes.
- Lay out the three columns:
  - **Col 1 (Photo)**: Left-aligned, rounded square image (`100px` x `100px`), top-aligned.
  - **Col 2 (Text Details)**: Top-aligned (`alignSelf: 'flex-start'`), containing item name and parsed notes list.
  - **Col 3 (Price & Actions)**: Right-aligned flex-column, height matches Col 2 or has `alignSelf: 'stretch'`:
    - **Price**: Top-aligned, bold red text.
    - **Actions Container (Bottom Right)**: Flex row container holding the quantity stepper and trashcan in the same line.
      - **Quantity bar (`[- 1 +]`)**: Top-aligned within the actions row (`alignSelf: 'flex-start'`).
      - **Trashcan (`🗑️`)**: Bottom-aligned within the actions row (`alignSelf: 'flex-end'`).

#### [MODIFY] [MyOrderView.tsx](file:///c:/Users/Thea/Documents/DLSUD/INTERNSHIP/ALPHAEXPLORA/Fastfood-Web-Menu-Frontend/frontend-customer/src/features/my-order/view/MyOrderView.tsx)

- Change the page/item list background to `#F1F5F9` so that the white cart cards are separated by a grey gap.
- Ensure the header container retains its white background (`var(--white)`) for a consistent layout look.

---

## Verification Plan

### Automated Tests
- Run compiler checks:
  ```bash
  npm run build
  ```

### Manual Verification
- Open the Customer App, customize and add items (e.g., 9pcs wings with flavors and dips) to the cart.
- Navigate to the **My Order** screen.
- Verify the layout matches the wireframe screenshot:
  - Check that the quantity bar and trashcan are side-by-side at the bottom right.
  - Verify that the details are top-aligned.
  - Verify that the quantity bar is top-aligned, and the trashcan is bottom-aligned.
  - Verify that only special instructions have double quotes.
