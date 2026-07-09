# Implementation Plan - Add Order Containers & Shadows Redesign

This plan covers the visual restructure of the **Add Order** customization screen to partition each selection category into separate full-width containers with distinct grey spacing gaps, and updates the **ToggleButton** styles to include a consistent drop shadow on selected/unselected buttons.

## Proposed Changes

### Component: ToggleButton Styling

#### ToggleButton.tsx
- Adjust the `boxShadow` styling:
  - Selected and Unselected buttons will display a distinct drop shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)`.
  - Disabled (greyed-out, unselected and max reached) buttons will have `boxShadow: 'none'`.

---

### Component: Add Order Layout Restructuring

#### AddOrderView.tsx
- Change the background of the main scroll container (`overflowY: 'auto'`) to a light grey `#F1F5F9` (or similar soft grey) to serve as the gap background color.
- Remove the main page wrapper `padding: '24px 20px'` that surrounds all customizer items so cards can span to the screen edges.
- Group the customization controls into separate white cards (`backgroundColor: '#FFFFFF'`, `padding: '24px 20px'`).
- Apply the specified gaps between containers:
  - **Item Name Card**: `marginBottom: '12px'` (medium gap).
  - **Flavors Section Card**: `marginBottom: '6px'` (small gap).
  - **Dips Section Card**: `marginBottom: '6px'` (small gap).
  - **Rice Options Card**: `marginBottom: '6px'` (small gap).
  - **Fries Flavors Card**: `marginBottom: '12px'` (medium gap).
  - **Beverages Card**: `marginBottom: '6px'` (small gap).
  - **Special Instructions Card**: `marginBottom: '0px'` (no gap at bottom).

---

## Verification Plan

### Automated Verification
- Run typescript compilation checks:
  - Command: `npm run build` in `frontend-customer`.

### Manual Verification
1. Open the customize screen for wings in the customer client.
2. Verify that each section (Item Name, Flavors, Dips, etc.) spans completely to the left and right edges of the screen (no margin).
3. Verify that the gaps between sections show the light grey background color.
4. Verify that unselected and selected buttons show a soft drop shadow, while disabled unselected buttons are flat/shadowless.
