<div align="center">

# 🍗 Fastfood Web Menu — Frontend Workspace

**A real-time Dine-In ordering ecosystem for the Blaine Wings Unli-Wings restaurant.**  
This workspace contains both the client-side customer ordering interface and the administrative management dashboard. Both systems communicate with a unified Supabase cloud database to process transactions, manage customer sessions, and track real-time orders.

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x%20%7C%2019.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%7C%206.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Workspace Applications](#-workspace-applications)
- [Tech Stack](#-tech-stack)
- [Architecture & Design System](#-architecture--design-system)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Configuration & Mock Toggles](#-configuration--mock-toggles)

---

## 🧩 Overview

This restaurant workspace is divided into three distinct frontend client applications:

| Application | Actor | Purpose |
| :--- | :--- | :--- |
| **[frontend-customer](frontend-customer/)** | Customer | Scan QR code ➔ browse menu ➔ configure wing flavor passport limits ➔ submit items to shared table cart ➔ checkout. |
| **[frontend-admin](frontend-admin/)** | Admin / Staff | Sign in ➔ monitor daily metrics/revenue ➔ manage orders Kanban pipeline ➔ modify status flows ➔ view cancellation reason details. |
| **[frontend-kitchenstaff](frontend-kitchenstaff/)** | Kitchen Staff | View active pending/preparing orders queue ➔ process prep items ➔ mark orders as complete. |

---

## 📱 Workspace Applications

### 1. Customer Frontend (`frontend-customer`)
*   **Barkada Cart Session**: Shared real-time shopping cart synced across all customers sitting at the same table (via Socket.io).
*   **Flavor Passport**: Interactive wings modifier selection that enforces flavor selection limits at checkout.
*   **Mobile-First View**: Grayscale layout optimized to load automatically on scan on mobile viewports (maximum width 640px).

### 2. Admin Frontend (`frontend-admin`)
*   **Dashboard Summary**: High-level daily metrics (Today's Orders, Pending, Complete, Cancelled, and Revenue).
*   **Order pipelines**: Filterable tables segmented into Pending (incoming/preparing), Completed (fulfilled), and Cancelled (including cancellation reason details) order lists.
*   **Sign-In & Auth**: Secure login mechanism leveraging Supabase Auth role levels.

---

## 🛠 Tech Stack

| Layer | Customer Frontend | Admin Frontend |
| :--- | :--- | :--- |
| **Framework / Bundler** | Vite v5 + React v18 + TS | Vite v5 + React v19 + TS |
| **Styling** | Vanilla CSS (Grayscale mobile) | Vanilla CSS (Maroon / Cream panel) |
| **Routing** | React Router DOM v6 | React Router DOM v6 |
| **Database Integration**| `@supabase/supabase-js` | `@supabase/supabase-js` |
| **Icons Library** | Inline SVGs | `lucide-react` |

---

## 🏛 Architecture & Design System

Both applications follow a strict **MVVM (Model-View-ViewModel)** separation pattern to ensure modular, clean, and testable code:

- **Model (`*.model.ts`)**: Pure TypeScript interfaces and definitions representing database schemas or structures. No side effects.
- **ViewModel (`use*ViewModel.ts`)**: Custom React hooks driving all feature behaviors, pagination logic, state mutations, and Supabase client queries.
- **View (`*View.tsx`)**: Dumb visual components consuming viewmodel hooks and returning layout configurations.

---

## 📁 Folder Structure

```
Fastfood-Web-Menu-Frontend/
├── frontend-customer/              # Customer self-ordering application
│   ├── src/
│   │   ├── context/                # Shared Cart and session states
│   │   ├── data/                   # Fallback catalog data
│   │   ├── features/               # Home, Menu, Order configurations, Checkout
│   │   ├── lib/                    # Supabase instantiation
│   │   └── routes/                 # Navigation registers
│   └── README.md                   # Customer specific instructions
│
├── frontend-admin/                 # Administrative dashboard application
│   ├── src/
│   │   ├── features/               # Login, Home, Order tracking columns, Profile
│   │   ├── shared-components/      # Persistent sidebar MainLayout frame
│   │   ├── lib/                    # Supabase client instantiation
│   │   └── routes/                 # Navigation routes
│   └── README.md                   # Admin specific instructions
│
├── frontend-kitchenstaff/          # Kitchen queue dashboard application
│   ├── src/
│   │   ├── features/               # Pending, Completed, Queue features
│   │   ├── shared-components/      # Reusable header, order card, item list elements
│   │   └── routes/                 # Navigation routes
│   └── README.md                   # Kitchen staff specific instructions
│
├── backend-README.md               # Backend API and Socket.io specifications
└── README.md                       # Workspace general documentation (This file)
```

---

## 🚀 Getting Started

### 1. Configure Supabase Environment
Ensure you have created `.env.local` configuration files in both frontend directories:

*   **`frontend-customer/.env.local`**:
    ```env
    VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
    ```
*   **`frontend-admin/.env.local`**:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
    ```

### 2. Install and Run the Customer App
```bash
cd frontend-customer
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

### 3. Install and Run the Admin App
```bash
cd ../frontend-admin
npm install --legacy-peer-deps
npm run dev
```
*(Runs on `http://localhost:5174`)*

### 4. Install and Run the Kitchen Staff App
```bash
cd ../frontend-kitchenstaff
npm install
npm run dev
```
*(Runs on `http://localhost:5175` or next sequential open port)*

---

## ⚙️ Configuration & Mock Toggles

To support development and staging tests without direct database connections:

1.  **Customer Mock Data**: In `frontend-customer/src/features/menu/viewmodel/useMenuViewModel.ts`, set `const USE_MOCK_DATA = true;` to use offline fallback mock menus.
2.  **Admin Login Bypass**: In `frontend-admin/src/features/login/viewmodel/useLoginViewModel.ts`, set `const USE_MOCK_LOGIN = true;` to log in locally using `admin@blainewings.com` and `password123`.
