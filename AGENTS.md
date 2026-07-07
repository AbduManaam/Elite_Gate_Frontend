# EliteGate Admin Dashboard — Project Development Guide

This document serves as the project development guide and a living reference for human developers and AI coding assistants working on the EliteGate Admin Dashboard frontend.

---

## 1. Project Overview
EliteGate is a production-grade, multi-tenant API Gateway written in Go (Gin) + PostgreSQL. This repository houses the separate React-based Admin Dashboard frontend. 

The dashboard provides a user interface to configure, monitor, and manage the gateway project resources including routes, upstreams, policies, API keys, and gateways. 

---

## 2. Tech Stack
* **Framework**: [React 19](https://react.dev)
* **Build Tool & Dev Server**: [Vite 8](https://vite.dev)
* **Language**: [TypeScript](https://www.typescriptlang.org)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (using `@tailwindcss/vite` plugin)
* **Icons**: Material Symbols (via Web Font link in [index.html](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/index.html))
* **Routing**: Centralized custom tab-based router in [AppRouter.tsx](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/src/app/router/AppRouter.tsx).
* **State Management**: React local `useState` hook state-sharing and prop-drilling for layout/auth tabs.
* **API Client**: None currently. All data views use mock datasets from the [mocks/](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/src/shared/mocks) directory.

---

## 3. Directory Structure
The codebase follows a strict **feature-first** architecture. Code is organized around business domains (features) rather than technical layers.

```text
src/
 ├── app/
 │    └── router/
 │         └── AppRouter.tsx           # Custom tab-based routing & auth wrapper
 ├── assets/                           # Static assets (images, logos)
 ├── main.tsx                          # App entry point
 ├── App.tsx                           # Core App component hosting the router
 ├── index.css                         # Tailwind CSS global styles & theme tokens
 ├── features/                         # Feature modules (isolated domain logic)
 │     ├── apiKeys/
 │     │     └── components/
 │     │           └── ApiKeysList.tsx
 │     ├── auditLogs/
 │     │     └── pages/
 │     │           └── AuditLogsPage.tsx
 │     ├── auth/
 │     │     ├── components/
 │     │     │     └── LoginForm.tsx
 │     │     └── pages/
 │     │           ├── LoginPage.tsx
 │     │           └── ProfileSettings.tsx
 │     ├── dashboard/
 │     │     ├── components/
 │     │     │     ├── DashboardWidgets.tsx
 │     │     │     ├── FeaturedBanner.tsx
 │     │     │     ├── QuickStats.tsx
 │     │     │     └── ServiceCards.tsx
 │     │     └── pages/
 │     │           └── WelcomeDashboard.tsx
 │     ├── gateways/
 │     │     └── pages/
 │     │           └── GatewaysPage.tsx
 │     ├── members/
 │     │     ├── components/
 │     │     │     └── MembersList.tsx
 │     │     └── pages/
 │     │           └── MembersPage.tsx
 │     ├── observability/
 │     │     └── pages/
 │     │           ├── ObservabilityExplorerPage.tsx
 │     │           └── ObservabilitySummaryPage.tsx
 │     ├── policies/
 │     │     └── pages/
 │     │           └── PoliciesPage.tsx
 │     ├── projects/
 │     │     └── pages/
 │     │           └── ProjectSettings.tsx
 │     ├── routes/
 │     │     └── components/
 │     │           └── RoutesList.tsx
 │     └── upstreams/
 │           └── components/
 │                 └── UpstreamsList.tsx
 └── shared/                           # Reusable code across multiple domains
       ├── components/                 # Global presentational UI components
       ├── layouts/
       │     └── Sidebar/
       │           └── Sidebar.tsx     # Central navigation layout component
       └── mocks/                      # Temporary static mock data files
             ├── bannerMock.ts
             ├── connectivityMock.ts
             ├── dashboardMock.ts
             ├── identityMock.ts
             ├── logsMock.ts
             ├── observabilityMock.ts
             ├── settingsMock.ts
             └── sidebarMock.ts
```

---

## 4. Coding Standards
All contributors (including AI assistants) must adhere to these standards:
* **Single Responsibility Per File**: Each file must do one thing (e.g., render a specific UI component, declare a mock, etc.).
* **File Size Ceiling**: ~200 lines soft ceiling per file. If a component grows past this, extract sub-components or custom hooks.
* **No Duplication**: Before writing utility functions or components, verify if an equivalent exists in [shared/](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/src/shared).
* **Dependencies Flow Inward**: Component imports should flow as: `Page` $\rightarrow$ `Feature` $\rightarrow$ `Shared`. Features must *never* import from other features directly. If two features need common functionality, move it to [shared/](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/src/shared).
* **Clean & Production-Grade**: Document non-trivial components and functions with JSDoc `@typedef`, `@param` and `@returns` syntax. Clean up commented-out debug code before saving.

---

## 5. State Management Strategy
Currently, state is kept local and declarative:
* **Session & Navigation State**: Authenticated status and the active navigation tab are managed inside [AppRouter.tsx](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/src/app/router/AppRouter.tsx) via `useState` and propagated down.
* **Feature State**: Component-level interactive elements (toggles, forms) manage local UI state.

**Future State Management Recommendations**:
As soon as backend integration begins, implement the following:
1. **Zustand**: For lightweight global client state, such as active project context, current logged-in user profile, and theme.
2. **TanStack Query (React Query)**: For server-state fetching, caching, loading/error states, and mutations. Avoid raw React `useEffect` for data fetching.

---

## 6. API Conventions
Once connected to the Go admin API:
* **Central Client**: Implement a single centralized HTTP client (using `fetch` or `axios`) inside a `src/shared/api` folder.
* **Auth Format**: Attach JWT tokens using the header: `Authorization: Bearer <token>` to match the backend's `AdminAuth` middleware.
* **Base URL**: The frontend must read the base API endpoint from Vite env variables (e.g., `import.meta.env.VITE_API_BASE_URL` in [.env](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/.env)).
* **CORS Setup**: The dashboard operates on a separate origin. While Vite's dev proxy can ease local dev, the backend admin API must enable CORS headers (`Access-Control-Allow-Origin` mapped to allowed tenants with `Vary: Origin`) for production.

---

## 7. UI & Design System Rules
* **Design Source of Truth**: The approved **Stitch** project design. Keep layout, fonts, margins, and component placements faithful to the Stitch mocks.
* **Tailwind CSS v4 Utility Classes**: Styling must use Tailwind classes. Custom inline styles, plain CSS rules, or external component styles are not allowed.
* **Theme Colors & Tokens**:
  * **Brand Dark**: `bg-[#113346]` / `bg-brand-dark`
  * **Outline/Border**: `border-outline-variant` or `border-white/10`
  * **Typography**: Outfit/Inter font families with standard body margins.
* **Reusability**: Wrap standard components (Buttons, Inputs, Modals, Drawers) as reusable UI primitives in `src/shared/components/ui/` instead of duplicating Tailwind styling across screens.

---

## 8. Error Handling
* **API Errors**: Parse structured JSON error payloads returned by the Go backend (e.g., `{ "error": "message" }`) and display human-readable alerts rather than swallowing them.
* **401 Unauthorized**: Redirect users automatically to the login page.
* **403 Forbidden**: Disable action buttons (or display an access-denied state) if the user has insufficient permissions.
* **UI Resiliency**: Use React Error Boundaries on feature-level layout grids to prevent a single component failure from crashing the entire page.

---

## 9. Authentication/RBAC Flow
The frontend must mirror the backend role checks exactly:
* **Viewer**: Read-only access across the workspace. Disable or hide all create, edit, save, and delete buttons.
* **Editor**: Full read/write access to project resources (routes, upstreams, policies, API keys).
* **Owner**: Full editor privileges + project members management, global settings deletion, and gateway provisioning/decommission controls.

---

## 10. Git Conventions
* **Branching**: Use feature branches derived from `main` (e.g., `feature/auth-client` or `bugfix/sidebar-overflow`).
* **Linear History**: Rebase feature branches before merging.
* **Commit Messages**: Write clear, imperative-style commits (e.g., `feat: integrate routes API endpoint`).

---

## 11. Instructions for AI Assistants
Future AI assistants working on this project must follow these guidelines:
1. **Never Assume Backend Contracts**: If you need the schema/DTO/handler response of a backend API endpoint, ask the user to paste it. Do not invent backend properties.
2. **Follow Feature-First Layout**: Do not put component code directly in `src/components` unless it is a globally shared UI primitive. Do not import from one feature into another.
3. **Respect File Limits**: Do not exceed ~200 lines per file. Refactor into helper hooks or child components when needed.
4. **Link Files & Symbols**: Always use `file://` link format to mention workspace files.
5. **No Placeholders**: Do not insert dummy data or placeholder code for features unless specifically requested. Use the existing mock framework under [mocks/](file:///c:/Users/abdum/OneDrive/Desktop/New%20folder/Coding/Elite%20Gate%20Frontend/src/shared/mocks) if adding temporary mock states.