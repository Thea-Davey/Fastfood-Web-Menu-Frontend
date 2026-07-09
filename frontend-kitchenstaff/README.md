<div align="center">

# 🍗 Fastfood Web Menu — Kitchen Staff Frontend

**The kitchen-facing web application for the Unli-Wings restaurant order queue management.**  
Kitchen staff monitor incoming pending orders, prepare them, and mark them as complete in real-time.

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
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

---

## 🧩 Overview

| Actor | Frontend Role |
| :--- | :--- |
| **Kitchen Staff** | Lands on the pending orders screen (`/staff/pending-orders`) → views active/pre-orders queue → moves pending items to "preparing" status → marks preparing orders complete to clear the list. |

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework / Bundler | Vite v5 + React v19 + TypeScript |
| Styling | Vanilla CSS (Maroon / Cream brand-aligned design system) |
| Routing | React Router DOM v7 |

---

## 🏛 Architecture & Design System

This application follows a strict **MVVM (Model-View-ViewModel)** separation pattern to maintain a clean codebase:

- **Model (`*.model.ts`)**: Defines data interfaces representing order structures (e.g., `StaffPendingOrder`, `StaffOrderItem`). No side effects.
- **ViewModel (`use*ViewModel.ts`)**: Custom React hooks driving the feature logic. Handles local states (e.g., pending order counts, queue ordering, completed records) and state updates.
- **View (`*View.tsx`)**: Dumb visual layer. Strictly consumes the ViewModel hook and maps items into React JSX/styling layers.

### 🎨 Modular UI Design
All component styling is local to the React TSX files using React inline styles (`style={{ ... }}`) for maximum encapsulation and alignment with the strict component folder specifications. Outermost page layout centers automatically on screen without padding to span the full viewport width.

---

## 📁 Folder Structure

```
frontend-kitchenstaff/
├── src/
│   ├── assets/
│   │   └── blaine-logo.png         # Restaurant branding logo assets
│   ├── docs/
│   │   └── ROUTES.md               # Dynamic page routing register checklist
│   │
│   ├── shared-components/           # Reusable shared layout headers, order cards, and items lists
│   │   ├── StaffHeader/
│   │   ├── StaffOrderCard/
│   │   └── StaffOrderItemList/
│   │
│   ├── features/                   # Feature-driven isolated modules
│   │   ├── staff-layout/           # Main platform navigation container shell
│   │   ├── staff-pending-orders/   # Column display tracking incoming/preparing items
│   │   ├── staff-completed-orders/ # Record list showing finished checkouts
│   │   └── staff-order-queue/      # Priority-based kitchen pipeline queue
│   │
│   ├── App.tsx                     # Routes wrapper
│   ├── main.tsx                    # React rendering bootstrap
│   └── vite-env.d.ts               # Vite client types declaration reference
│
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
Navigate to the kitchen staff folder and install packages:
```bash
cd frontend-kitchenstaff
npm install
```

### 3. Run Development Local Server
```bash
npm run dev
```
The client website launches at `http://localhost:5173` (or the next available port sequentially).

---

## 📡 Frontend Page Routes

| Page | Path | Component | Feature Folder | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Staff Main Layout** | `/staff` | `StaffLayoutView` | `features/staff-layout` | No |
| **Staff Pending Orders** | `/staff/pending-orders` | `StaffPendingOrdersView` | `features/staff-pending-orders` | No |
| **Staff Completed Orders** | `/staff/completed-orders` | `StaffCompletedOrdersView` | `features/staff-completed-orders` | No |
| **Staff Order Queue** | `/staff/order-queue` | `StaffOrderQueueView` | `features/staff-order-queue` | No |
