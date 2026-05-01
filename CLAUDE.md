# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server on port **5174** (`vite.config.ts`).
- `npm run build` — production build via Vite.
- `npm run preview` — preview built output.
- `npm run lint` / `npm run lint:errors` — ESLint over the repo (errors-only mode is what CI runs).
- `npm run format` / `npm run format:check` — Prettier over the repo.
- `npm test` — Vitest, scoped to `src/__tests__`.
- `npm run test:unit` — `src/__tests__/unit` only.
- `npm run test:integration` — `src/__tests__/integration` only.
- `npm run test:watch` — Vitest UI.
- `npm run test:coverage` — v8 coverage; output in `coverage/` (excludes listed in `vitest.config.ts`).

Run a single test file: `npx vitest run path/to/file.test.tsx`. Run a single test name: `npx vitest run -t "test name"`.

## Architecture

This is a **Vite + React 18 + TypeScript** SPA. There is no backend in this repo — everything persists client-side via **Dexie/IndexedDB**, and tests use **MSW** for any HTTP mocking. The README's "JWT auth" framing is aspirational; auth is just a Dexie `users` table (`src/db/db.ts`).

### Routing and layout

`src/App.tsx` wires the providers and routes. All authenticated screens (`/dashboard`, `/monitoring`, `/cicd`, `/testing`, `/help`) render the **same** `AppLayout` component (`src/components/layout/AppLayout.tsx`); the active feature is selected by a `TabName` from `layout/constants.ts` driven by `useTabNavigation`, **not** by the route path. Auth redirects happen in `AppContent` (logout effect) and inside `AppLayout` (no-user → `/login`). When touching navigation, update `TABS`/`TabName` and the route list together.

### Provider stack

Order in `App.tsx` is load-bearing: `Router` → `ProjectProvider` → `ToastProvider` → `ReleaseProvider` → `GuidanceProvider`. Each lives in `src/context/`. Convention: `XContext.tsx` defines the provider, `useX.tsx` exports the consumer hook, `xTypes.ts` holds shared types — keep this split when adding contexts.

### Feature folders

Features live under `src/components/<feature>/` (`auth`, `monitoring`, `pipelining`, `testing`, `releases`, `guidance`, `help`, `layout`, `shared`). Each folder typically has its own `index.ts` barrel, a `hooks/` subfolder for feature-local hooks, and sometimes `constants.ts`. Cross-feature reuse goes through `components/shared/` or top-level `src/hooks/`. Notable: `AppLayout` imports `useTabNavigation`, `useProjectManagement`, `useAuthManagement` from `../monitoring/hooks` — those hooks are **app-wide** despite living under `monitoring/`.

### Persistence

`src/db/db.ts` defines `AppDatabase` (Dexie v3) with tables `users`, `releases`, `userAcknowledgments`. Schema migrations require bumping `this.version(N).stores({...})` — do not edit a published version block in place. `src/db/seedReleases.ts` and `src/utils/releaseSync.ts` (called from `App.tsx` on mount) keep the local `releases` table in sync with `releases/releases.json` + `releases/changes.json` at the repo root; new releases are added by editing those JSON files, not by writing to the DB directly. See `docs/release-management.md` for the full flow.

### Path aliases

Aliases are duplicated in `vite.config.ts` and `vitest.config.ts` — keep them in sync when adding one. Note `@constants` resolves to `src/helpers/constants` in Vite but `src/helpers/constants.tsx` in Vitest, and `@tests → src/__tests__` only exists in Vitest.

### Tests

`src/__tests__/` mirrors the `unit/` vs `integration/` split that the npm scripts target; shared test helpers in `__tests__/utils/`, MSW handlers in `__tests__/mocks/`, setup at `src/__tests__/setup.ts` (configured in `vitest.config.ts`, **not** the top-level `src/setupTests.ts`). Coverage excludes are explicit in `vitest.config.ts` — `src/components/pipelining/**`, `src/utils/**`, and several db/hook files are intentionally excluded; don't "fix" these by adding tests unless that's the task.

## Conventions worth preserving

From the README's stated philosophy that the codebase actually follows:

- Components stay small (~150 lines) with shallow JSX nesting; logic moves into custom hooks (e.g. `useResizablePanel`, `useTestItems`, `useMicroserviceNavigation`).
- Magic values live in per-feature `constants.ts` files, not inline.
- ESLint config (`eslint.config.js`) runs `prettier/prettier` as an **error** — `npm run format` before committing, or lint will fail.
