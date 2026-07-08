<div align="center">

# 🍗 Fastfood Web Menu — Admin Frontend

**The administrative dashboard for managing orders, tracking metrics, and processing transactions.**  
Admin users and staff members log in to view real-time incoming orders, update order status (pending ➔ preparing ➔ completed / cancelled), review revenue metrics, and manage customer sessions.

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
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
| **Admin / Staff** | Signs in (`/login`) ➔ lands on Dashboard overview (`/admin/home`) to view daily sales summaries and recent transactions ➔ monitors and updates pending orders (`/admin/orders/pending`) ➔ reviews completed history (`/admin/orders/complete`) or cancellation reason details (`/admin/orders/cancel`) |

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework / Bundler | Vite + React + TypeScript |
| Styling | Vanilla CSS (Maroon and Cream premium brand design system) |
| Routing | React Router DOM v6 |
| Database Integration | Supabase Client JS (`@supabase/supabase-js`) |
| Icon Library | Lucide React (`lucide-react`) |

---

## 🏛 Architecture & Design System

This admin application follows a strict **MVVM (Model-View-ViewModel)** separation pattern to maintain a clean codebase:

- **Model (`*.model.ts`)**: Defines data interfaces representing Supabase DB rows (e.g., `PendingOrder`) or layout metrics (`DashboardSummary`). No functions, side effects, or hooks.
- **ViewModel (`use*ViewModel.ts`)**: Custom React hooks driving the feature logic. Handles local states, search queries, active status filtering, loading indicators, and Supabase database mutations.
- **View (`*View.tsx`)**: Dumb visual layer. Strictly consumes the ViewModel hook and maps items into React JSX/styling layers.

### 🎨 Design System
All colors utilize design system CSS variables declared inside `:root` in `src/index.css` (e.g. `--primary-color`, `--secondary-color`, `--bg-app`, `--text-main`). It features a persistent deep maroon sidebar matching the Blaine Wings primary branding, edge-to-edge full-bleed table headers, custom status badges, and hover micro-animations.

---

## 📁 Folder Structure

```
frontend-admin/
├── src/
│   ├── assets/
│   │   └── chicken_wings.png       # Wings image asset used in login branding
│   ├── docs/
│   │   └── ROUTES.md               # Dynamic page routing register checklist
│   ├── lib/
│   │   └── supabase.ts             # Supabase client instantiation
│   │
│   ├── shared-components/           # Reusable shared buttons, inputs, and layouts
│   │   └── MainLayout/
│   │       └── MainLayout.tsx      # Sidebar, brand branding logo, and layout shell
│   │
│   ├── features/                   # Feature-driven isolated modules
│   │   ├── login/                  # Login view, validation and auth viewmodel
│   │   ├── home/                   # Core dashboard metrics summary + recent transactions
│   │   ├── orders-all/             # Unified transaction record viewer
│   │   ├── orders-pending/         # Incoming orders pipeline with status edit actions
│   │   ├── orders-complete/        # Flipped complete orders history log
│   │   ├── orders-cancel/          # Voided items log showing cancellation reason details
│   │   └── profile/                # User settings card with log out routing
│   │
│   ├── App.tsx                     # React Router routes bootstrap wrapper
│   ├── main.tsx                    # React rendering bootstrap entry point
│   ├── index.css                   # Global stylesheets, colors, and layout variables
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
Navigate to the frontend admin folder and install packages:
```bash
cd frontend-admin
npm install --legacy-peer-deps
```

### 3. Setup Credentials Environment
Create a `.env.local` file inside the `frontend-admin/` root folder:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 4. Run Development Local Server
```bash
npm run dev
```
The admin website launches at `http://localhost:5173` (or `http://localhost:5174`).

---

## 📡 Frontend Page Routes

| Page | Path | Component | Feature Folder | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | `/login` | `LoginView` | `features/login` | No |
| **Main Layout** | `/admin` | `MainLayout` | `shared-components/MainLayout` | Yes |
| **Home (Dashboard)** | `/admin/home` | `HomeView` | `features/home` | Yes |
| **All Orders** | `/admin/orders/all` | `OrdersAllView` | `features/orders-all` | Yes |
| **Pending Orders** | `/admin/orders/pending` | `OrdersPendingView` | `features/orders-pending` | Yes |
| **Complete Orders** | `/admin/orders/complete`| `OrdersCompleteView`| `features/orders-complete`| Yes |
| **Cancel Orders** | `/admin/orders/cancel` | `OrdersCancelView` | `features/orders-cancel` | Yes |
| **Admin Profile** | `/admin/profile` | `ProfileView` | `features/profile` | Yes |

---

## ⚙️ Configuration & Mock Toggles

### Simulated Credentials Sign-In (Local Bypass)
To help test the dashboard interfaces and pagination pipelines without a direct Supabase connection or backend session, you can toggle simulated authentication.

In `src/features/login/viewmodel/useLoginViewModel.ts`:
```typescript
const USE_MOCK_LOGIN = true; // Set to true to bypass database fetches and load mock credentials
const MOCK_EMAIL = 'admin@blainewings.com';
const MOCK_PASSWORD = 'password123';
```
*(By default, this is toggled to `true` to allow instant access).*
