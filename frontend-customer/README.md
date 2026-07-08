# Fastfood Web Menu — Customer Frontend

This is the customer-facing web application for the Unli-Wings ordering system, built with **Vite, React, TypeScript, and Supabase**.

It utilizes a strict **MVVM (Model-View-ViewModel)** architectural pattern to keep UI rendering, logic, and data models separate.

---

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have **Node.js** (v18 or higher recommended) and **npm** installed.

### 2. Setup Configuration
Create a `.env.local` file in the root directory and configure the database environment variables:
```env
VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Installation
Install the project dependencies:
```bash
npm install
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```

### 5. Build for Production
To compile and bundle the application:
```bash
npm run build
```

---

## 🛠️ Database Schema Alignment (Supabase)

To enable live fetching, the backend team must ensure the Supabase instance includes a table named `menu_items` with the following structure:

### Table Name: `menu_items`
| Column Name | Data Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (Default: `gen_random_uuid()`) |
| `name` | `text` | Item name |
| `price` | `numeric` | Base price (or can fall back to `base_price` column) |
| `category` | `text` | Values should match category mapping (e.g., `unlimited`, `ala_carte`, `wings_to_share`, `extra` or `sides`, `add_on`, `drink`) |
| `max_flavors` | `integer` | Maximum selectable flavors limit per order item |
| `max_dips` | `integer` | Maximum selectable dips limit per order item |
| `is_available` | `boolean` | Display availability flag |
| `created_at` | `timestamptz` | Record creation timestamp |

---

## ⚙️ Configuration & Testing Toggles

### 1. Database vs. Mock Data Toggle
Inside the ViewModels, there are toggles to control whether the app fetches live data from Supabase or loads local mock data from `src/data/menuData.ts`:

- **Menu View**: Located in `src/features/menu/viewmodel/useMenuViewModel.ts`:
  ```typescript
  const USE_MOCK_DATA = false; // set to true to fall back to static local data
  ```
- **Add Order Page**: Located in `src/features/add-order/viewmodel/useAddOrderViewModel.ts`:
  ```typescript
  const USE_MOCK_DATA = false; // set to true to fall back to static local data
  ```

### 2. Simulate Items in Cart Toggle
Located in `src/context/CartContext.tsx`:
```typescript
const SIMULATE_ITEMS_IN_CART = false; // set to true to pre-populate cart with demo items
```

---

## 📁 Architecture Overview (MVVM)

Each feature folder is organized into:
- **`model/`**: Contains pure TypeScript interfaces representing raw DB data (e.g., `SupabaseMenuItem`) and UI structures (`MenuItem`). No functions or business logic.
- **`viewmodel/`**: Custom React hooks handling states, text search filters, categories tabs, data fetching, mapping rules, and cart interactions.
- **`view/`**: Clean UI layout components. Uses JSX and ViewModel properties only. No direct API or hook calls.
