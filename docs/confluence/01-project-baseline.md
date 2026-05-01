# Project Baseline — Poly Micro Manager (Frontend Demo)

> Confluence page baseline for the `poly-micro-frontend-demo` repository. Paste this into the Confluence editor; headings, tables, and code fences map directly to Confluence elements.

## 1. Purpose

Poly Micro Manager is a single-page web application that demonstrates a unified operator console for microservice fleets. It bundles four operator workflows behind one shell:

- **Dashboard / Monitoring** — service health, CPU/memory charts, log viewer.
- **CI/CD** — pipeline visualization and deployment status.
- **Automated Testing** — AI-assisted test authoring and execution UI.
- **Help & Guidance** — in-app onboarding and release notifications.

This repository is a **frontend-only demo**: there is no backend service in this repo. All persistence is client-side (IndexedDB via Dexie), and any HTTP interactions in tests are mocked via MSW. The README's "JWT auth" framing is aspirational — authentication is implemented as a Dexie `users` table.

## 2. Technology Stack

| Concern              | Choice                                  |
| -------------------- | --------------------------------------- |
| Framework            | React 18.3 + TypeScript 5.5             |
| Build tool           | Vite 5.4                                |
| Styling              | TailwindCSS 3.4                         |
| Routing              | React Router DOM 6.22                   |
| State management     | React Context API (no Redux/Zustand)    |
| Client persistence   | Dexie 3.2 (IndexedDB wrapper)           |
| Charts               | Recharts 2.12                           |
| Icons                | Lucide React                            |
| Notifications        | React Toastify                          |
| Test runner          | Vitest 1.3 + React Testing Library      |
| HTTP mocking (tests) | MSW 2.2                                 |
| Lint / format        | ESLint 9 (flat config) + Prettier 3.5   |

## 3. Repository Layout

```
poly-micro-frontend-demo/
├── src/
│   ├── App.tsx                    # Provider composition + routing
│   ├── components/
│   │   ├── auth/                  # Login, Register, useAuth, useForm
│   │   ├── layout/                # AppLayout, Sidebar, TopBar, MainContent
│   │   ├── monitoring/            # Dashboard, CPUChart, ServiceStatus, LogViewer
│   │   ├── pipelining/            # CI/CD pipeline visualization
│   │   ├── testing/               # Automated testing UI, chat, modals
│   │   ├── releases/              # Release modal, notifications
│   │   ├── guidance/              # Onboarding & completion guidance
│   │   ├── help/                  # In-app help page
│   │   └── shared/                # Cross-feature primitives
│   ├── context/                   # ProjectContext, ToastContext, ReleaseContext, GuidanceContext
│   ├── db/                        # Dexie database (db.ts), seed data
│   ├── hooks/                     # App-wide custom hooks (e.g. useTheme)
│   ├── utils/                     # releaseSync, helpers
│   ├── helpers/                   # constants, shared utilities
│   ├── types/                     # Shared TypeScript types
│   └── __tests__/                 # Vitest suites (unit/, integration/, mocks/, utils/)
├── releases/                      # releases.json + changes.json (release notes source)
├── docs/                          # Project documentation
└── public/                        # Static assets
```

## 4. Application Shell & Routing

- `src/App.tsx` mounts the provider stack and the route table.
- All authenticated screens (`/dashboard`, `/monitoring`, `/cicd`, `/testing`, `/help`) render the **same** `AppLayout` component. The active feature is selected by a `TabName` from `layout/constants.ts` driven by the `useTabNavigation` hook — **not** by the route path.
- `/` redirects to `/login`; `AppContent` (in `App.tsx`) and `AppLayout` both perform an auth-guard redirect to `/login` when no user is present.

### Provider stack (order matters)

```
Router
└── ProjectProvider
    └── ToastProvider
        └── ReleaseProvider
            └── GuidanceProvider
                └── <Routes />
```

Convention: each context lives in `src/context/` as `XContext.tsx` (provider) + `useX.tsx` (consumer hook) + `xTypes.ts` (shared types).

## 5. Persistence Model

`src/db/db.ts` defines `AppDatabase` (Dexie v3) with three tables:

| Table                 | Indexed fields                              | Purpose                                  |
| --------------------- | ------------------------------------------- | ---------------------------------------- |
| `users`               | `++id, username, email, hasCompletedOnboarding` | Local user accounts (login/register)  |
| `releases`            | `++id, version, releaseDate, isLatest`      | Release notes synced from JSON           |
| `userAcknowledgments` | `++id, userId, releaseId`                   | Tracks which releases each user has seen |

**Migration rule:** schema migrations require a new `this.version(N).stores({...})` block. Never edit a published version block in place.

**Release sync:** `src/utils/releaseSync.ts` (called from `App.tsx` on mount) reconciles the `releases` table against `releases/releases.json` + `releases/changes.json` at the repo root. New releases are added by editing those JSON files, not by writing to the DB directly.

## 6. Authentication Flow (current state)

Authentication is implemented as a Dexie lookup, not JWT:

1. `RegisterForm` calls `useAuth().register()` → inserts into Dexie `users` table.
2. `LoginForm` calls `useAuth().login()` → looks up user by `username`, compares plaintext `password`, and on success stores the user in `localStorage` under `currentUser`.
3. `useAuth()` rehydrates auth state from `localStorage` on mount and listens to `storage` events to sync across tabs.
4. Logout clears `localStorage`; `AppContent`'s effect redirects unauthenticated users to `/login`.

> ⚠️ **Security note:** passwords are stored in plaintext in IndexedDB. This is acceptable for a demo only; do not reuse this pattern in production.

## 7. Build, Test, and Tooling Commands

| Command                     | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`               | Vite dev server on port **5174** (`vite.config.ts`)                          |
| `npm run build`             | Production build via Vite                                                    |
| `npm run preview`           | Preview built output                                                         |
| `npm run lint`              | ESLint over the repo                                                         |
| `npm run lint:errors`       | ESLint, errors-only — CI runs this                                           |
| `npm run format`            | Prettier (write) — required before commit (Prettier runs as ESLint **error**) |
| `npm run format:check`      | Prettier (check)                                                             |
| `npm test`                  | Vitest, scoped to `src/__tests__`                                            |
| `npm run test:unit`         | `src/__tests__/unit` only                                                    |
| `npm run test:integration`  | `src/__tests__/integration` only                                             |
| `npm run test:watch`        | Vitest UI                                                                    |
| `npm run test:coverage`     | v8 coverage; output in `coverage/`                                           |

Run a single test file: `npx vitest run path/to/file.test.tsx`
Run a single test name: `npx vitest run -t "test name"`

## 8. Path Aliases

Aliases are duplicated in `vite.config.ts` and `vitest.config.ts` — keep both in sync when adding one. Notable quirks:

- `@constants` resolves to `src/helpers/constants` in Vite but `src/helpers/constants.tsx` in Vitest.
- `@tests → src/__tests__` exists **only** in Vitest.

## 9. Coding Conventions

- Components stay small (~150 lines) with shallow JSX nesting (≤ 3 levels). Extract logic into custom hooks (e.g. `useResizablePanel`, `useTestItems`, `useMicroserviceNavigation`).
- Magic values live in per-feature `constants.ts` files, not inline.
- `useAuthManagement`, `useTabNavigation`, `useProjectManagement` live under `components/monitoring/hooks/` despite being **app-wide** — `AppLayout` imports them from there. Cross-feature reuse normally goes through `components/shared/` or top-level `src/hooks/`.
- ESLint runs `prettier/prettier` as an **error** — run `npm run format` before committing or lint will fail.
- Test setup: `src/__tests__/setup.ts` is configured in `vitest.config.ts`. There is also a top-level `src/setupTests.ts` that is **not** the active setup file — do not edit it expecting an effect.
- Coverage excludes (`vitest.config.ts`) intentionally skip `src/components/pipelining/**`, `src/utils/**`, and several db/hook files. Don't "fix" these by adding tests unless that is the task.

## 10. CI/CD

- GitHub Actions runs lint (errors-only), tests, and a build verification on PRs to `main`.
- Docker support: `docker-compose up -d` (app) and `docker-compose -f docker-compose.sonarqube.yml up -d` (SonarQube analysis).

## 11. Documentation Map

- [`docs/README.md`](../README.md) — main documentation index
- [`docs/architecture/patterns.md`](../architecture/patterns.md) — design patterns
- [`docs/components/`](../components/) — UI component specifications
- [`docs/implementation/`](../implementation/) — implementation notes
- [`docs/release-management.md`](../release-management.md) — release sync flow
- Online: <https://siriknikita.github.io/poly-micro-frontend-demo/>

## 12. Out of Scope (for this baseline)

- Real backend services and APIs (mocked / absent)
- Production-grade authentication (no JWT, no hashed passwords)
- Multi-tenant data isolation
- Server-side rendering
