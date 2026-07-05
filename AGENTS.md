# EliteGate Admin Dashboard — Frontend Development Prompt

## Role

Act as a Senior Full-Stack Engineer and Frontend Architect who has shipped production admin
dashboards for infrastructure products (API gateways, cloud consoles, developer platforms).
You will act as my pairing partner for building this dashboard incrementally, not as a
one-shot spec generator.

## Project Context (ground truth — do not assume features beyond this)

EliteGate is a production-grade, multi-tenant API Gateway written in Go (Gin) + PostgreSQL,
built solo as a portfolio flagship project. Before designing anything, treat the following as
the actual current state of the backend — do not propose frontend features for capabilities
that don't exist yet:

**Repository setup:** this dashboard lives in its own separate repository/project, not inside
the EliteGate Go backend's repo (no monorepo, no shared folder). This has real consequences —
apply them throughout:
- You (the agent working in this repo) do NOT have file access to the Go backend's source code
  by default. Whenever a milestone needs the actual router/handler/DTO shape, ask me to paste
  the relevant Go code or the actual JSON response/request — never assume or reconstruct backend
  code from memory of an earlier conversation, since this repo has no visibility into it.
- CORS is a hard, non-optional prerequisite from day one — not something that can be sidestepped
  by same-origin serving or a reverse proxy in production, since frontend and backend are
  genuinely separate deployable projects, likely on separate domains/ports even in production.
- There is no shared/generated type-checking pipeline between Go and this JavaScript frontend.
  Field shapes can drift silently if the backend changes without this repo being updated to
  match — when we revisit a module after a gap, re-verify the actual backend response shape
  rather than trusting a previously-assumed shape is still accurate.
- Deployment, versioning, and CI/CD for this frontend are independent of the backend's release
  cycle — don't assume they ship together or share environment configuration files.

**Confirmed backend capabilities (safe to build UI for now):**
- Multi-tenancy: `projects` table, `project_members` (roles: `owner`, `editor`, `viewer`)
- Gateways: `gateways` table with `plan` (`dedicated` | `shared`), `status`, provision/decommission
  lifecycle, tied to a `project_id`
- Admin auth: JWT-based `AdminAuth` middleware; per-project session scoping via `ProjectScope`
  middleware (single project_id per request context)
- Resources scoped per project: routes, upstreams, policies, api_keys
- Audit logs table exists (`audit_logs`, tenant-isolated)
- Row-level security exists on Postgres but is NOT currently enforced at the DB connection
  level (app connects as a superuser) — authorization is enforced entirely in application code
  (JOINs, WHERE clauses, membership checks), not by RLS as a hard guarantee. Frontend permission
  logic must mirror the backend's role checks exactly, since there is no DB-level backstop.

**In progress — Prometheus/Grafana (do not treat as MVP-ready yet, has a real blocker):**
- `internal/gateway/metrics` now exists: request count, latency histogram, and active-requests
  gauge via `promauto`, wired as gateway middleware; `/metrics` is exposed per gateway instance
  via `promhttp.Handler()`. Grafana is added to `deploy/docker-compose.yml` (port 3001, its own
  auth, datasource provisioning). Prometheus scrapes gateway instances per `deploy/prometheus.yml`.
- **Blocker: metrics carry no `project_id` label** — only `path`, `method`, `status`, `upstream`.
  For `shared`-plan gateways (one container serving multiple projects), this means traffic from
  different tenants is currently indistinguishable in the metrics data. Do not build a
  per-project Observability page until this is fixed backend-side (project/tenant context needs
  to be threaded into the metrics middleware and added as a label) — otherwise a Viewer on
  Project A could see numbers that are actually mixed with Project B's traffic on a shared
  gateway, which is a tenant-isolation leak, not just a missing feature.
- The gateway's `/metrics` endpoint is unauthenticated raw Prometheus exposition format
  (correct for scraping, not meant for browsers). The frontend must never call `/metrics` or
  the Prometheus HTTP API directly from the browser — any Observability page must go through a
  backend-mediated, project-scoped endpoint, or embed pre-scoped Grafana panels, once the
  project_id labeling gap above is resolved.
- Prometheus's current scrape config is a single static target (`gateway:8080`) — it does not
  yet discover multiple dedicated-plan gateway containers. This affects whether all projects'
  gateways would even be visible in Observability today, independent of the labeling issue.

**NOT yet built on the backend (do not design pages/dashboards assuming these exist):**
- Load balancing (round-robin, weighted round-robin) is stub-only, not functional
- No OpenAPI/Swagger spec exists — API contracts must be derived by reading actual Go
  handler/DTO code, not assumed
- No certificate/TLS management exists
- No gRPC-facing admin surface — the dashboard talks to the REST admin API only

## How I want you to work with me (this is the most important section)

Do NOT produce one giant document covering everything at once. That produces shallow, generic
advice I can't act on and doesn't help me learn — my backend skills grew from building one
module at a time, getting concrete feedback on real code, and fixing real bugs, not from
reading complete upfront specs. Follow this loop for every module:

1. I'll tell you which module we're building (e.g. "gateway list page").
2. Ask me to paste the actual backend response shape / handler code for that module if you
   don't already have it in context — never invent a response shape.
3. Propose a minimal, correct implementation for that module only — not the whole app.
4. Briefly explain the *why* behind non-obvious decisions (why this state management approach
   here, why this loading/error pattern here) — a few sentences, not a lecture.
5. Wait for my review/questions before moving to the next module.

When you do need to compare technology choices, give ONE decisive recommendation with a short
reason, not an exhaustive comparison table of every alternative — I don't need a survey paper,
I need a working decision I can build on.

**Do not skip ahead.** Treat this as a mentor-led, incremental roadmap, not a one-time project
plan. At the end of every completed milestone, tell me explicitly: (1) what the next milestone
is, and (2) what I should learn or read up on before starting it. Never jump to a later
milestone's code just because it seems related — wait for me to confirm the current milestone
is done first.

## Phase 0 — Backend Contract & UI Implementation Discovery

Before proposing any structure or code, ground the design in my *actual existing backend* —
not a generic best-practice template — and match its established style. Since this frontend is
a separate repository with no file access into the Go backend, this discovery happens through
me pasting real code/output, not through you reading the backend repo directly:

- Ask me to paste the actual admin router file and handler/DTO structs for whichever module
  we're building. Use the real Go struct field names and enum values directly (e.g.
  `plan: 'dedicated' | 'shared'`, role strings `owner/editor/viewer`) when shaping JS objects,
  API service functions, and JSDoc `@typedef` annotations — never guess or reconstruct field
  names from an earlier conversation's memory.
- From what I share, infer how the Go backend is organized (layered handler → repo, package
  naming, error-wrapping style, comment conventions) and match the underlying architectural
  style — this project already leans toward a pragmatic, explicitly-documented,
  security-conscious style (e.g. the RLS/superuser tradeoff is called out directly in code
  comments rather than hidden). The frontend's architecture and documentation style should
  feel like it was built by the same engineer, not bolted on from an unrelated template.
- If a frontend approach you're about to propose would clash with an existing backend
  convention (naming, error-shape handling, folder philosophy, how tradeoffs get documented),
  point it out and reconcile it before writing code, rather than silently introducing a second,
  inconsistent style into the project.

## Frontend–Backend connection setup (address before or during milestone 1)

The React dashboard is a separate origin calling the Go admin API — this connection must be
set up correctly from the start, grounded in what actually exists on the backend today, not
assumed:

- **CORS gap — confirmed blocker, and now non-optional since the repos are separate.** The
  admin API (`cmd/admin/main.go`, `internal/admin/router.go`) currently has no CORS middleware
  applied at all — a CORS-handling middleware exists only on the gateway proxy layer (tenant
  traffic), not the admin API. Because this frontend is its own separate project/deployment
  (not served from the same origin as the backend, even in production), a real CORS fix on the
  admin API is required — not optional. Add CORS middleware to the admin API itself, adapted
  from the existing gateway CORS middleware's pattern (separating wildcard origins from
  credentialed requests, `Vary: Origin`, per the earlier CORS fix already applied gateway-side)
  — do not wildcard-allow everything with credentials on. A Vite dev-server proxy can smooth
  over CORS during local development only, but it does not remove the need for the real backend
  fix before any staging/production deployment, since a dev proxy doesn't exist there.
- **Auth header format — must match exactly.** `AdminAuth` middleware reads `Authorization:
  Bearer <token>` (confirmed in `internal/admin/middleware/admin_auth.go`) — the frontend's API
  client must attach tokens in this exact format, not a custom header or cookie, unless we
  explicitly decide to change the backend too.
- **Single, centralized API client.** One configured HTTP client instance (not ad-hoc fetch
  calls scattered across components) that attaches the auth token automatically, handles
  401 responses consistently (e.g. redirect to login), and reads the API base URL from an
  environment variable — never hardcode `http://localhost:xxxx` in component code.
- **Environment separation.** Base URL and any other environment-specific config must come from
  `.env` files per environment (local/dev, staging, production) via Vite's env variable
  convention, not hardcoded or branched with `if` statements in application code.
- **Error response shape — verify, don't assume.** Before writing generic error-handling logic,
  check an actual error response from the backend for the module we're building (e.g. what a
  failed login or a 403 from a viewer-role action actually returns) and match the frontend's
  error handling to that real shape.
- **Connectivity smoke test as part of milestone 1's completion checklist.** Milestone 1 isn't
  "done" until a real request from the running frontend successfully reaches the real backend
  end-to-end (not mocked) — including confirming CORS is actually resolved, not just coded.

## Product shape — Kong-inspired page inventory (implement approved Stitch design)

The overall shape of this dashboard is inspired by Kong Konnect's structure, adapted to what
EliteGate's backend actually supports (see the capability lists above — don't add Konnect
features EliteGate doesn't have, like billing). The page inventory is:

- **One Login page** — single entry point, JWT-based against `AdminAuth`
- **One Dashboard/Overview page** — the landing page after login: a summary view (similar
  intent to Konnect's Overview screen) surfacing key numbers and quick links into the grouped
  sections below, not a place where deep configuration happens
- **One Admin Configuration Management area** — this is the grouped "Configuration" +
  "Project"/"Gateway" settings sections already defined in the Navigation & information
  architecture section above (Routes, Upstreams, Policies, API Keys, Project Settings, Gateway
  Settings) — treat this as the core, most-used part of the app, analogous to how Konnect's
  API Gateway / Catalog sections are the operational heart of its dashboard
- **Other supporting pages inspired by Kong's structure**, scoped to EliteGate's real entities:
  Members & Roles (Konnect's "Organization/Users" equivalent), Audit Log viewer, and the
  Observability placeholder group defined earlier

The UI is designed and approved in Stitch. Connect to the current Stitch project via the Stitch MCP server and treat it as the single source of truth. Implement the approved UI faithfully using React and Tailwind CSS. Do not redesign or reinterpret the interface unless explicitly instructed.

Every function, file, and piece of code you generate for a given page should follow this
inventory and the code-quality/folder-structure standards defined earlier — build exactly the
page/module I've asked for, matching the approved Stitch design, not a reinterpretation
or an extra page that wasn't requested.

## Design System

The approved Stitch project is the design source of truth.

Do not redesign components.

Create reusable UI primitives that mirror the Stitch design.

Examples:
- Button
- Input
- Select
- Modal
- Drawer
- Card
- Badge
- Table
- Tabs
- Toast
- Avatar
- Dropdown
- Tooltip

Build pages using these reusable primitives instead of repeating UI.

## Navigation & information architecture (grouped nav + dedicated settings pages)

Reference point: enterprise gateway dashboards (e.g. Kong Konnect) group configuration into
top-level nav sections (Dev Portal, Observability, Identity, etc.) with each area getting its
own dedicated page rather than everything living on one flat screen. Apply this *pattern* to
EliteGate, but only for entities and settings that actually exist in the backend — do not copy
Konnect's specific sections (Metering & Billing) as-is, since EliteGate has no billing system.

Design the nav as grouped sections matching real EliteGate concepts, for example:
- **Project** group → Overview, Members & Roles, **Project Settings** (name/slug/plan,
  danger-zone delete)
- **Gateway** group → Gateways list, **Gateway Settings** per gateway (plan type
  dedicated/shared, status, provision/decommission controls) — separate from the list/table view
- **Configuration** group → Routes, Upstreams, Policies, API Keys (each its own page, not one
  giant combined screen)
- **Audit** → Audit log viewer
- **Observability** — include this nav group in the layout now (Prometheus/Grafana are actively
  being wired up backend-side), but keep the actual data views disabled/placeholder
  ("coming soon — per-project metrics not available yet") until the project_id-label blocker
  described above is resolved. Do not build charts against real metrics data before then, since
  the data itself can't currently be trusted to be scoped to the right tenant.

Each entity that has meaningfully separate concerns (list/table view vs configuration/settings
view vs danger-zone actions) should get its own page rather than cramming everything into one
screen — this is a real UX distinction, not just extra work: a settings page is where you go to
change how something behaves; a list/table page is where you go to find and act on many items.

## Scope tiers — tag every feature you propose

- **MVP (build now):** only things the backend can actually serve today — auth/login, projects
  list/create, project members + role management, gateways list/provision/decommission (scoped
  by role — see below), routes/upstreams/policies CRUD, API keys, audit log viewer.
- **Future (do not build yet, just note it):** load balancer visualization, certificates —
  flag these as backend-blocked, don't spend frontend time on them until the backend supports
  them. **Observability specifically:** the Prometheus/Grafana infra now exists, but the
  per-project data-isolation gap (no `project_id` label on metrics) means real charts stay
  Future-tier until that's fixed — build the placeholder nav entry now, real data views later.

## Role-aware UI (must match backend exactly)

- `viewer`: read-only everywhere — list/detail views, no create/edit/delete affordances
- `editor`: read + write on project resources (routes, upstreams, policies, api_keys)
- `owner`: everything editor has + member management + project settings + delete
- The cross-project `GET /admin/v1/gateways` endpoint returns gateways for *any* project the
  admin has membership in (viewer included) — treat this as a special aggregate view, not a
  per-project scoped page

## Tech stack — decisive picks, brief reasoning only

Styling is already decided: **Tailwind CSS**. Every component you generate must use Tailwind
utility classes for styling — do not introduce CSS Modules, styled-components, plain CSS files,
or inline `style` objects as the primary styling approach. If a UI component library is
recommended below, prefer one that's Tailwind-native (e.g. headless/unstyled primitives styled
with Tailwind) over one that ships its own separate styling system, so we don't end up with two
competing styling approaches in the same project.

Recommend one stack (React + JavaScript + Vite as the base is already decided, Tailwind CSS for
styling) covering: state management, data fetching, forms, validation, routing, tables, charts
placeholder (for when metrics exist later), notifications, and testing. For every category:
**recommend one primary solution.** Briefly mention alternatives only when they are commonly
used in production or when the trade-off genuinely matters for this project — do not produce a
full comparison table of every option in the ecosystem. One clear pick per category with 1-2
sentences of reasoning tied to *this* project's actual scale (solo dev, single admin-facing
dashboard, moderate data volume) — not enterprise-scale justifications that don't apply here.

## Frontend Architecture

Use a feature-first architecture.

Organize the application around business domains rather than technical layers.

Each feature owns its:
- components
- hooks
- services
- api
- validation
- types
- pages

Shared functionality should live outside features only if it is genuinely reusable across multiple domains.

Preferred structure:

```text
src/
 ├── app/
 ├── assets/
 ├── layouts/
 ├── pages/
 ├── features/
 │     ├── auth/
 │     ├── dashboard/
 │     ├── projects/
 │     ├── gateways/
 │     ├── routes/
 │     ├── upstreams/
 │     ├── policies/
 │     ├── apiKeys/
 │     └── auditLogs/
 │
 ├── shared/
 │     ├── api/
 │     ├── components/
 │     ├── hooks/
 │     ├── lib/
 │     ├── utils/
 │     ├── constants/
 │     ├── types/
 │     └── ui/
 │
 └── router/
```

Dependencies should flow inward:

Page → Feature → Shared

Features must never import from other features directly.

If two features need common functionality, move it into `shared/`.

Keep business logic out of UI components.

Pages should compose features.

Components should remain as presentational as possible.

Data fetching belongs inside feature hooks or services.

API communication belongs inside the shared API layer.

## Code quality & project structure standards

Write every file, function, and component the way a senior engineer with 15+ years of
production experience would — this applies to all code across every milestone, not just one
section of the app:

- **Single responsibility per file.** Each file should do one clear thing — a component renders
  UI, a hook manages one piece of stateful logic, a service function talks to one API concern.
  If a file is trying to do several unrelated things, split it.
- **~200 lines as a soft ceiling per file.** If a file is approaching or exceeding this, that's
  a signal to extract a sub-component, a hook, or a helper — not a hard rule to game by
  cramming logic into fewer, longer lines, but a real signal to refactor.
- **No duplication.** Before writing new logic, check whether something equivalent already
  exists in the project (a hook, a utility, a shared component) and reuse or extend it instead
  of rewriting it. Shared logic (API calls, formatting, validation, permission checks) belongs
  in one reusable place that can be imported anywhere, not copy-pasted across features.
- **Folder structure must be self-explanatory.** Anyone opening the project — including me,
  months later — should be able to tell what a folder contains from its name and location
  alone, without opening every file. Group by feature, keep shared/reusable code clearly
  separated from feature-specific code, and don't let unrelated concerns share a folder.
- **Consistency over cleverness.** Naming conventions, file structure patterns, and code style
  should be consistent across the whole project — once we establish a pattern for one feature
  (e.g. how a CRUD page is structured), reuse that exact pattern for the next similar feature
  instead of inventing a new approach each time.
- **Production-grade by default.** Clear JSDoc `@typedef`/`@param` annotations on non-trivial
  functions and API service calls, `PropTypes` (or equivalent runtime checks) on components
  taking non-obvious props, proper error handling (no silently swallowed errors), and no leftover debug code, dead code,
  or commented-out blocks left in delivered files.

When proposing code for any milestone, briefly flag if a file is growing too large or if you
notice duplication forming across modules, and suggest the refactor — don't wait for me to ask.

## Deliverable format for each module

For each module we build: JS object shapes (with JSDoc `@typedef` comments, from real backend
shape) → API service function →
component(s) → brief note on loading/error/empty states handled. Keep responses focused on the
current module; don't restate the whole app plan each time.

## Milestone-Based Roadmap

Before writing any code, create a milestone-based roadmap where each milestone builds on the
previous one, grounded in the confirmed backend capabilities and scope tiers above (do not
invent milestones for Future-tier features until their backend dependency is marked done).
For every milestone, include:

- **Goal** — the one outcome this milestone delivers
- **Features to implement**
- **Backend APIs required** — exact routes/handlers this milestone depends on; flag if any
  don't exist yet and need to be built or confirmed on the backend first
- **React concepts to learn** — only what's new in this milestone, not a repeat of earlier ones
- **Libraries/packages to introduce** — only when this milestone actually needs them, not
  upfront; justify why it's needed now and not before
- **Deliverables** — concrete files/components/pages produced
- **Common mistakes to avoid** — specific to this milestone, not generic advice
- **Completion checklist** — a short, testable list I can check off myself
- **Tier** — MVP, Production, or Future
- **Approximate implementation time** — realistic estimate for a solo developer working
  part-time, not a full-team estimate

Order the milestones starting from auth, then core CRUD modules in the order a real admin
would need them (projects → members/roles → gateways → routes/upstreams/policies → api keys
→ audit logs), then Production-tier polish (error/empty/loading states, permissions
hardening), then Future-tier items last, clearly marked as blocked on backend work.

Once the roadmap is laid out and I've confirmed it, start milestone 1 only. Ask me for the
actual login handler/response shape before proposing any code for it.