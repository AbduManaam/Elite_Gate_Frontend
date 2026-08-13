EliteGate Admin Console

React + TypeScript control-plane interface for configuring and operating the EliteGate multi-tenant API gateway platform.

The EliteGate Admin Console gives project owners, editors and viewers a browser interface for managing gateway configuration without directly editing PostgreSQL, Redis, Docker or AWS infrastructure.

Users can create projects, register backend services, define routes and policies, issue API keys, provision gateways, inspect metrics and audit history, and manage custom-domain workflows.

Important: The frontend is the management plane UI. It does not proxy customer API traffic. Live traffic is processed by the EliteGate Gateway data plane.

Table of Contents

What the Console Does

Who Uses It

Quick User Guide

What Customers Change in Their Apps

Architecture

Technology Stack

Project Structure

Local Development Setup

Environment Variables

Testing

Production Build

Vercel Deployment

Authentication

Project Isolation

Current Status & Limitations

Troubleshooting

Documentation

Contributing

License

What the Console Does

The Admin Console provides project-scoped management for:

projects;

project members and roles;

upstream services;

upstream targets;

HTTP/gRPC routes;

authentication and traffic policies;

API credentials;

dedicated gateway containers;

gateway reload/decommission operations;

custom domains;

Prometheus-backed analytics;

audit logs;

platform administration for super administrators.

It communicates with the Go Admin API over HTTP/HTTPS and keeps server-owned data in TanStack React Query.

Who Uses It

User

Typical actions

Project Owner

Full project management, members, policies, domains and destructive actions

Project Editor

Routes, upstreams, targets, policies, API keys and gateways

Project Viewer

Read project configuration, logs, metrics and status

Super Administrator

Platform-wide tenant and gateway operations

Developer integrating a service

Registers a backend, creates routes and tests gateway URLs

DevOps / Platform Engineer

Observes gateway status, deployment state and connectivity

Quick User Guide

This section explains how to use EliteGate from the browser.

Step 1 — Create an account or sign in

Open the Admin Console and choose:

Sign Up for a new company/project;

Login for an existing account;

Google Login when OAuth is configured.

Signup creates the first project and gives the new user Owner access.

Step 2 — Create or select a project

Use the project selector/sidebar.

A project keeps its own:

routes;

upstreams;

targets;

policies;

API keys;

members;

gateways;

logs;

custom domains.

Example:

YUMZY Production
YUMZY Staging

The selected project is represented in the browser URL:

/projects/<project-id>

Step 3 — Add team members

Owners can add an already-registered user and assign:

owner

editor

viewer

Use the Team Collaboration / Members section.

Current source has a known backend contract bug affecting role changes and member removal. Initial member addition is available.

Step 4 — Create an upstream

Go to:

Project → Connectivity → Upstreams

Create an upstream for the backend service you want EliteGate to call.

Example:

Name: yumzy-backend
Protocol: HTTP
Target URL: http://10.0.2.15:8080
Health Path: /health
Load Balancing: Round Robin

Important

The URL must be reachable from the EliteGate gateway runtime.

This usually will not work for a remote gateway:

http://localhost:8080

because localhost would refer to the gateway environment itself.

Step 5 — Add additional targets

Open the upstream's target drawer and add more backend instances.

Example:

yumzy-backend
├── http://10.0.2.15:8080
└── http://10.0.2.16:8080

Configure target weight/enabled status as needed.

Step 6 — Choose load balancing

Current UI/runtime supports:

Round Robin

Least Connections

Use Round Robin for simple distribution or Least Connections when you want requests directed toward the currently less-busy target.

Step 7 — Create a route

Go to:

Project → Connectivity → Routes

Create a route and connect it to an upstream.

Example:

Name: Products
Path: /api/products/
Methods: GET
Match Type: Prefix
Upstream: yumzy-backend
Enabled: Yes

A route tells EliteGate:

“When a matching request arrives, send it to this upstream.”

Step 8 — Create and attach a policy

Go to:

Project → Connectivity → Policies

A policy can define:

authentication requirement;

rate limit;

allowed CORS origins;

roles;

scopes;

IP allowlist;

IP blocklist.

Example CORS origins:

https://app.example.com
http://localhost:5173

Then attach the policy to the required route.

Step 9 — Create an API key if the route requires one

Go to:

Project → Connectivity → API Credentials

Create a key with optional:

expiry;

roles;

scopes.

The generated raw key is shown once.

Copy it immediately and store it safely.

Do not place privileged API keys inside a public browser bundle.

Step 10 — Provision a gateway

Go to:

Project → Connectivity → Gateway Services

Provision the project gateway.

The backend creates a Docker gateway container, assigns a host port and waits for it to become healthy.

Current frontend endpoint format:

http://<public_host>:<public_port>

Per-gateway ALB target-group/listener-rule/DNS/HTTPS automation is not complete in the current source.

Step 11 — Reload configuration after changes

When necessary, use the gateway reload action so the runtime fetches the latest project snapshot.

The gateway also performs periodic configuration polling.

Step 12 — Test the route

API-key example:

curl -i \
  -H "X-API-Key: <generated-key>" \
  http://<gateway-host>:<gateway-port>/api/products/

JWT example:

curl -i \
  -H "Authorization: Bearer <customer-jwt>" \
  http://<gateway-host>:<gateway-port>/api/products/

Expected result: the response comes from the registered customer backend through EliteGate.

Step 13 — Configure a custom domain

From the project's Custom Domains page:

add the hostname;

copy the provided TXT verification record;

create that record with your DNS provider;

run ownership verification;

configure routing DNS as instructed;

request activation;

watch provisioning status;

retry when supported if provisioning fails.

Current custom-domain AWS automation is partial, so some DNS/routing operations remain external/manual.

Step 14 — Monitor the project

Use:

Dashboard — resource overview;

Analytics — request/system metrics;

Audit Logs — control-plane actions;

Gateway Status — gateway runtime records;

Custom Domains — DNS/certificate provisioning status.

What Customers Change in Their Apps

EliteGate sits in front of an existing backend. It does not replace that backend.

Keep the backend running

The customer service can run on:

EC2;

Docker;

Kubernetes;

a private VM;

on-premises infrastructure;

another reachable environment.

Change the frontend API base URL

Before EliteGate:

const api = axios.create({
  baseURL: 'https://orders-api.example.com',
});

After EliteGate:

const api = axios.create({
  baseURL: 'https://gateway.example.com',
});

For the current host-port form:

const api = axios.create({
  baseURL: 'http://<gateway-host>:<gateway-port>',
});

Send required credentials

JWT example:

await api.get('/api/orders', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

API keys should generally be used from trusted server-side environments when the key is privileged.

Configure CORS correctly

If a browser calls EliteGate directly, the route policy must allow the exact browser origin.

Example:

https://app.example.com

not simply:

*

when credentialed requests are involved.

Provide a health endpoint

A simple backend health endpoint is recommended:

GET /health
200 OK

It should be fast and reflect whether the service can receive requests.

Architecture

flowchart TD
    Browser[Browser] --> Router[React Router]
    Router --> Guards[Auth / Role / Project Guards]
    Guards --> Pages[Feature Pages]

    Pages --> Hooks[TanStack Query Hooks]
    Hooks --> APIs[Feature API Modules]
    APIs --> Axios[Axios Client]

    Axios --> Token[In-Memory Access Token]
    Axios --> Admin[Go Admin API]

    Admin --> DB[(PostgreSQL)]
    Admin --> Runtime[Gateway Runtime]

    Store[Zustand] --> Router
    Storage[Local Storage] --> Store

State responsibilities

Zustand

authenticated user state;

super-admin resolution;

sidebar/UI state;

active project ID;

active project role.

TanStack React Query

projects;

routes;

upstreams;

targets;

policies;

API keys;

gateways;

metrics;

custom domains;

members;

audit logs.

This keeps client-owned UI state separate from server-owned API state.

Technology Stack

Area

Technology

UI

React

Language

TypeScript

Build

Vite

Routing

React Router

HTTP

Axios

Server state

TanStack React Query

Client/UI state

Zustand

Styling

Tailwind CSS

Charts

Recharts

Testing

Vitest + Testing Library

Browser E2E dependency

Playwright

Linting

ESLint

Deployment

Vercel

Current source expects Node.js 24.x.

Project Structure

.
├── .github/workflows/
│   └── ci.yml
├── public/
├── src/
│   ├── app/router/
│   ├── features/
│   │   ├── apiKeys/
│   │   ├── auditLogs/
│   │   ├── auth/
│   │   ├── customDomains/
│   │   ├── dashboard/
│   │   ├── gateways/
│   │   ├── members/
│   │   ├── observability/
│   │   ├── policies/
│   │   ├── projects/
│   │   ├── routes/
│   │   └── upstreams/
│   ├── lib/api/
│   ├── shared/
│   ├── store/
│   └── test/
├── package.json
├── package-lock.json
├── vercel.json
├── vite.config.js
└── vitest.config.ts

Feature modules generally own their:

API functions;

types;

React Query hooks;

UI components/pages.

Local Development Setup

Prerequisites

Install:

Node.js 24.x;

npm;

the EliteGate Go backend;

PostgreSQL and Redis for the backend.

The Admin API should be available before testing authenticated frontend features.

1. Enter the frontend repository

cd Elite_Gate_Frontend-main

2. Install dependencies

npm ci

This uses the committed package-lock.json.

3. Configure the Admin API

Create .env from .env.example:

cp .env.example .env

Set:

VITE_API_BASE_URL=http://localhost:9090/admin

The /admin suffix is important because frontend API calls are built relative to that base URL.

4. Start the backend

Follow the backend README, then verify:

curl -i http://localhost:9090/healthz

Expected:

HTTP/1.1 200 OK

5. Start the frontend

npm run dev

Open the Vite URL, normally:

http://localhost:5173

6. Verify login/session behavior

Use Signup or Login and confirm:

login/signup succeeds;

backend refresh cookie is set;

authenticated requests contain a Bearer access token;

/admin/v1/me succeeds;

projects load.

7. Verify the core product flow

Create:

Project
  ↓
Upstream
  ↓
Target
  ↓
Route
  ↓
Policy
  ↓
API Key
  ↓
Gateway

Then call a route through the gateway.

Environment Variables

The current frontend application reads one primary application environment variable:

Variable

Required

Local example

Purpose

VITE_API_BASE_URL

Yes

http://localhost:9090/admin

Base URL for the Go Admin API

Example:

VITE_API_BASE_URL=http://localhost:9090/admin

Security

VITE_* values are embedded into browser JavaScript.

Never place:

JWT signing secrets;

OAuth client secrets;

SMTP passwords;

database passwords;

Redis passwords;

privileged gateway/API secrets

inside frontend environment variables.

Testing

Available commands:

Command

Purpose

npm run dev

Start development server

npm run lint

ESLint

npm run typecheck

TypeScript checks

npm test

Start Vitest

npm run test:ci

Run tests once with coverage

npm run build

TypeScript + Vite production build

npm run preview

Preview production build

Recommended before a pull request:

npm run lint
npm run typecheck
npm run test:ci
npm run build

Current automated coverage includes smoke/API URL and custom-domain component tests, but the test suite is not yet comprehensive.

Production Build

Build:

npm run build

Output:

dist/

Preview locally:

npm run preview

Vercel Deployment

1. Import the frontend repository

Create a Vercel project from the repository.

2. Use these settings

Install command: npm ci
Build command:   npm run build
Output directory: dist
Node.js:         24.x

3. Set the production API URL

Example:

VITE_API_BASE_URL=https://api.example.com/admin

This value is injected at build time. Redeploy after changing it.

4. Keep SPA routing enabled

The repository includes vercel.json so deep React Router paths can resolve through the SPA entry point.

Verify:

/login
/oauth/callback
/projects/<valid-project-id>

Authentication

The frontend uses:

access token stored in memory;

backend-managed HttpOnly refresh cookie;

silent refresh on application startup when a local session marker exists;

Axios Bearer-token interceptor;

automatic one-time refresh/retry after 401;

protected routes;

role-aware UI controls.

The local browser session marker is a UX hint only. It is not proof of authentication.

The backend remains responsible for authorization.

Project Isolation

Every tenant feature should preserve the active project through:

Browser URL project ID
        ↓
Project-scoped API path
        ↓
Project-scoped React Query key
        ↓
Backend membership + RBAC
        ↓
Project-scoped database operation

For new frontend features:

include the project ID in the URL;

include it in API paths;

include it in query keys;

invalidate only the relevant project's queries;

clear stale state when switching projects.

Current Status & Limitations

The frontend contains substantial working functionality, but the current source has known issues.

Important items:

custom-domain mutations currently contain a missing import that can block a strict TypeScript build;

frontend logout currently clears local state without consistently invoking backend logout/invalidation;

member role-change/removal is blocked by a backend route-parameter mismatch;

some platform health/metrics frontend contracts do not match backend responses;

gateway monitoring contains placeholder/static content;

the gateway status route can display gateway data broader than the URL-selected project;

the generated dedicated-gateway URL is currently host + dynamic port, not an automatically provisioned HTTPS hostname;

profile/roles-permissions areas contain placeholder or incomplete behavior;

Playwright exists as a dependency but a complete E2E suite is not wired.

These should be treated as active development items, not hidden as completed features.

Troubleshooting

Frontend loads but every API call returns 404

Check:

VITE_API_BASE_URL=http://localhost:9090/admin

The /admin prefix matters.

Restart Vite after changing .env.

Browser reports CORS errors

Check:

frontend origin exactly matches backend ALLOWED_ORIGINS;

scheme and port are correct;

backend permits credentials;

frontend requests use the configured Axios client;

preflight allows Authorization and Content-Type.

Login works but page refresh logs the user out

Check:

refresh cookie exists;

cookie domain/path are correct;

HTTPS/Secure settings match the environment;

/admin/refresh is reachable;

browser privacy settings are not blocking the cookie.

Upstream works directly but not through EliteGate

The upstream must be reachable from the gateway environment.

For example:

http://orders-service:8080
http://10.0.2.15:8080
https://orders.internal.example.com

may work depending on networking, while remote gateway access to:

http://localhost:8080

usually will not.

Gateway is healthy but the public URL does not work

The current source does not complete the entire per-gateway ALB target-group/listener-rule/DNS/HTTPS automation lifecycle.

Documentation

Keep the README focused and move deep implementation detail to docs/.

Recommended structure:

docs/
├── ELITEGATE_COMPLETE_DOCUMENTATION.md
├── ARCHITECTURE.md
├── API.md
├── AUTHENTICATION.md
├── DEPLOYMENT.md
├── SECURITY.md
└── TROUBLESHOOTING.md

If present, see Complete EliteGate Documentation.

Contributing

Before opening a pull request:

npm run lint
npm run typecheck
npm run test:ci
npm run build

For project-scoped features, verify:

the browser URL contains the correct project ID;

the API path contains the same project ID;

React Query keys contain the project ID;

cache invalidation is project-specific;

backend authorization is still authoritative;

switching projects cannot display stale data from another project.