# EliteGate Admin Dashboard

EliteGate is a production-grade, multi-tenant API Gateway. This repository houses the React-based administrative control plane (frontend), designed for configuring gateway deployments, managing upstream routing, enforcing traffic policies, and monitoring traffic analytics.

Built using **React (v19)**, **Vite**, **TypeScript**, and **Tailwind CSS**, it features a professional, highly responsive enterprise design inspired by modern cloud infrastructure platforms like Kong Konnect and Grafana.

---

## 🏗️ Architectural Blueprint: Feature-First Structure

This project is built using a strict **Feature-First Architecture** organized around business domains and backend resources rather than technical layers. Every domain module is self-contained.

### Folder Structure
```text
src/
 ├── app/                             # Application Bootstrapping
 │     ├── router/                    # Global routing & shell layout controllers
 │     ├── providers/                 # App-wide context providers
 │     └── config/                    # Global app configuration
 │
 ├── assets/                          # Global static media/images/fonts
 │
 ├── features/                        # Encapsulated Business Modules
 │     ├── auth/                      # Login Pages, Profile Settings, session management
 │     ├── dashboard/                 # Welcome & high-level summary widgets
 │     ├── projects/                  # Workspace / Project settings
 │     ├── gateways/                  # Control Plane Gateway configurations
 │     ├── routes/                    # API Ingress routing rules
 │     ├── upstreams/                 # Upstream destinations & load balancer settings
 │     ├── policies/                  # Security policies and plugins (CORS, Rate Limiting, Key Auth)
 │     ├── apiKeys/                   # Programmable API credential managers
 │     ├── members/                   # Tenant workspace team roles and membership controls
 │     └── auditLogs/                 # Immutable security audit logs
 │
 ├── shared/                          # Global Reusable Core (Layouts, UI, hooks)
 │     ├── layouts/                   # Global page shells (Sidebar, Topbar)
 │     ├── ui/                        # Reusable primitives (Buttons, Inputs, Modals)
 │     └── mocks/                     # Centralized mock telemetries for dev
 │
 ├── App.tsx                          # App root bootstrapping component
 └── main.tsx                         # App entry point
```

### Encapsulation Rules
* **Strict Feature Boundaries**: Features never import from another feature directly.
* **Public APIs**: Every feature exposes its public surface explicitly via a root `index.ts` file. All cross-feature or routing imports reference this public interface.
* **Layout Isolation**: Global application shells (like the `Sidebar`) live under `src/shared/layouts/` to keep page layout separate from reusable visual components.
* **Centralized Mocks**: Mock telemetry data is segregated in `src/shared/mocks/` to make it trivial to remove when transitioning to live backend endpoints.

---

## ⚡ Setup & Development

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* npm (v10+ recommended)

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Running Locally
To launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Building for Production
To typecheck the TypeScript codebase and bundle static assets for hosting:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

### Linting
To check and format the codebase according to ESLint and stylistic configurations:
```bash
npm run lint
```

---

## 🔒 Security & Environment
All API endpoint variables, dev keys, and local environments are configured via `.env` files. To ensure secrets are not committed:
* `.env` files are ignored by git in [.gitignore](.gitignore).
* Private keys (`*.key`, `*.pem`) and TLS certificates are blocked globally.
