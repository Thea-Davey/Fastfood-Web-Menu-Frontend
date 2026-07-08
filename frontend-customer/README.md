<div align="center">

# 🍗 Fastfood Web Menu — Customer Frontend

**The customer-facing web application for the Unli-Wings ordering system.**  
Customers scan a QR code at their table to open the menu, pick their wing flavors, and build their orders locally or dynamically via Supabase.

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture & Design System](#-architecture--design-system)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Frontend Page Routes](#-frontend-page-routes)
- [Configuration & Mock Toggles](#-configuration--mock-toggles)

---

## 🧩 Overview

| Actor | Frontend Role |
| :--- | :--- |
| **Customer** | Lands on the landing dashboard (`/home`) → checks the catalog (`/menu`) → configures order items with custom flavors/dips (`/add-order/:id`) → reviews selections and updates quantities (`/my-order`) |

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework / Bundler | Vite + React + TypeScript |
| Styling | Vanilla CSS (Grayscale premium design system) |
| Routing | React Router DOM v6 |
| Database Integration | Supabase Client JS (`@supabase/supabase-js`) |

---

## 🏛 Architecture & Design System

This application follows a strict **MVVM (Model-View-ViewModel)** separation pattern to maintain a clean codebase:

- **Model (`*.model.ts`)**: Defines data interfaces representing Supabase DB rows (e.g., `SupabaseMenuItem`) or client-side mappings (`MenuItem`). No functions, side effects, or hooks.
- **ViewModel (`use*ViewModel.ts`)**: Custom React hooks driving the feature logic. Handles local states, search queries, active filtering categories, client-side validation limits, loading indicators, and Supabase fetching.
- **View (`*View.tsx`)**: Dumb visual layer. Strictly consumes the ViewModel hook and maps items into React JSX/styling layers.

### 🎨 Grayscale Design System
All colors across pages utilize design system css variables declared inside `:root` in `src/index.css` (e.g. `--primary-color`, `--bg-app`, `--text-main`). Outermost screen layout grids center automatically at `maxWidth: 640px` to look like a polished mobile app layout on desktop viewports.

---

## 📁 Folder Structure

```
frontend-customer/
├── src/
│   ├── context/
│   │   └── CartContext.tsx         # Global shopping cart context & item increments
│   ├── data/
│   │   └── menuData.ts             # Default fallback wings & dips mock catalog database
│   ├── docs/
│   │   └── ROUTES.md               # Dynamic page routing register checklist
│   ├── lib/
│   │   └── supabase.ts             # Supabase client instantiation
│   │
│   ├── shared-components/           # Reusable shared buttons, search inputs, and filters
│   │   ├── CategoryFilter/
│   │   ├── MenuItemCard/
│   │   ├── SearchBar/
│   │   └── ToggleButton/           # Flavors/dips selector config button tiles
│   │
│   ├── features/                   # Feature-driven isolated modules
│   │   ├── main-layout/            # Global navigation shell layout
│   │   ├── home/                   # Center carousel and horizontal catalog cards
│   │   ├── menu/                   # Category filter tabs + searchable menu list
│   │   ├── my-order/               # Finalized cart items checkout review container
│   │   └── add-order/              # Detail item configuration view (flavor limits count)
│   │
│   ├── App.tsx                     # Routes wrapper
│   ├── main.tsx                    # React rendering bootstrap
│   └── vite-env.d.ts               # Vite client types declaration reference
│
├── .env.local                      # Local Supabase credentials file
├── tsconfig.json                   # TS compiler settings
├── vite.config.ts                  # Vite build settings configuration
└── README.md                       # This instruction file
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.x or above installed.
- **npm** package manager.

### 2. Install Project Dependencies
Navigate to the frontend customer folder and install packages:
```bash
cd frontend-customer
npm install
```

### 3. Setup Credentials Environment
Create a `.env.local` file inside the `frontend-customer/` root folder:
```env
VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 4. Run Development Local Server
```bash
npm run dev
```
The client website launches at `http://localhost:5173`.

---

## 📡 Frontend Page Routes

| Page | Path | Component | Feature Folder | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Main Layout** | `/` | `MainLayoutView` | `features/main-layout` | No |
| **Home** | `/home` | `HomeView` | `features/home` | No |
| **Menu** | `/menu` | `MenuView` | `features/menu` | No |
| **My Order** | `/my-order` | `MyOrderView` | `features/my-order` | No |
| **Add Order** | `/add-order/:id` | `AddOrderView` | `features/add-order` | No |

---

## ⚙️ Configuration & Mock Toggles

To help test integration without DB connections, configure these toggles:

### 1. DB Fetch vs Mock Catalog Fallback
In `src/features/menu/viewmodel/useMenuViewModel.ts` and `src/features/add-order/viewmodel/useAddOrderViewModel.ts`:
```typescript
const USE_MOCK_DATA = false; // Set to true to bypass database fetches and load mock data
```

### 2. Pre-populated Demo Items Cart
In `src/context/CartContext.tsx`:
```typescript
const SIMULATE_ITEMS_IN_CART = false; // Set to true to seed the cart during layout styling
```
