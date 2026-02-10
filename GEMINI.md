# MorataFMS - Project Context for Gemini

## 1. Project Overview
**MorataFMS (Freight Management System)** is a full-stack web application designed for F.M. Morata, a freight/customs brokerage company. It tracks import/export transactions, manages client records, and handles document storage.

## 2. Technology Stack

### Backend
*   **Framework:** Laravel 12 (PHP 8.2+)
*   **Database:** MySQL (configured in `.env`), with SQLite default in example.
*   **Authentication:** Laravel Sanctum (SPA Cookie-based).
*   **Scaffolding:** Laravel Breeze (API).
*   **Key Libraries:** `laravel/sanctum`, `laravel/framework`.

### Frontend
*   **Framework:** React 19 (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
*   **State/Networking:** Axios, React Context (Auth).
*   **Routing:** React Router DOM v7.

## 3. Architecture & Conventions

### Directory Structure
*   **`backend/`**: Standard Laravel application.
    *   `app/Models`: Contains Eloquent models (Client, User, ImportTransaction, etc.).
    *   `database/migrations`: Defines the schema including polymorphic `documents` table.
    *   `routes/api.php`: API endpoints. Auth routes prefixed with `/auth`.
*   **`frontend/`**: Feature-based React application.
    *   `src/features/`: functionality grouped by domain (e.g., `auth`, `dashboard`).
    *   `src/lib/axios.ts`: Centralized Axios instance with CSRF handling.
    *   `src/routes/`: Route definitions.

### Development Conventions
*   **Authentication:** The frontend uses **cookie-based authentication**. It must first request `/sanctum/csrf-cookie` before attempting login.
*   **API Pattern:** RESTful API.
*   **Styling:** Utility-first CSS using Tailwind.
*   **Frontend State:** Context API for global state (Auth), likely local state or simple fetching for data (currently).

## 4. Setup and Execution

### Backend
```bash
cd backend
composer install
cp .env.example .env # Configure DB_DATABASE=morata_fms and DB_CONNECTION=mysql
php artisan key:generate
php artisan migrate --seed # Seeds countries and admin user
php artisan serve
```
*   **Base URL:** `http://localhost:8000`
*   **Default Admin:** `admin@morata.com` / `password`

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```
*   **Base URL:** `http://localhost:3000`

## 5. Key Domain Concepts

### Transactions
*   **Import:** Tracks incoming shipments. Has 6 stages (BOC, PPA, DO, Port Charges, Releasing, Billing).
*   **Export:** Tracks outgoing shipments. Has 4 stages (Docs Prep, CO, CIL, BL).
*   **Stages:** Each stage tracks status, completion time, and the user who completed it.

### Documents
*   **Polymorphic:** The `documents` table relates to both `import_transactions` and `export_transactions`.

## 6. Current Status (as of Feb 2026)
*   **Completed:** Auth flow (Login/Logout), Database Schema & Migrations, Basic Dashboard UI, Seeders.
*   **Pending:** CRUD for Transactions/Clients/Documents, Role-based access control, Search/Filter.

## 7. Important Files
*   `PROJECT_CONTEXT.md`: Detailed documentation of schema and features.
*   `backend/routes/api.php`: API Route definitions.
*   `frontend/src/lib/axios.ts`: Networking configuration.
*   `frontend/src/features/auth/context/AuthContext.tsx`: Authentication logic.
