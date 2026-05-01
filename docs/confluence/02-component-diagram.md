# Component Diagram — Poly Micro Manager (Frontend Demo)

> Confluence page describing the runtime component structure of the SPA. The diagrams below are written in **Mermaid** — Confluence Cloud renders Mermaid natively from `mermaid` code fences. If your space uses Server/Data Center, install the *Mermaid Diagrams for Confluence* macro or paste the code into a Markdown macro.

## 1. High-Level Component Diagram

```mermaid
flowchart TB
  subgraph Browser["Browser (Single-Page App)"]
    direction TB

    subgraph Bootstrap["App Bootstrap"]
      App["App.tsx<br/>(BrowserRouter)"]
      AppContent["AppContent<br/>(auth guard)"]
    end

    subgraph Providers["Provider Stack (order matters)"]
      direction TB
      ProjectProvider["ProjectProvider"]
      ToastProvider["ToastProvider"]
      ReleaseProvider["ReleaseProvider"]
      GuidanceProvider["GuidanceProvider"]
    end

    subgraph Routes["React Router Routes"]
      direction TB
      LoginRoute["/login → LoginForm"]
      RegisterRoute["/register → RegisterForm"]
      AppRoutes["/dashboard, /monitoring,<br/>/cicd, /testing, /help<br/>→ AppLayout"]
    end

    subgraph Layout["AppLayout Shell"]
      direction LR
      Sidebar["Sidebar<br/>(tab navigation)"]
      TopBar["TopBar<br/>(project picker,<br/>theme, logout)"]
      MainContent["MainContent<br/>(tab → feature)"]
    end

    subgraph Features["Feature Components"]
      direction TB
      Monitoring["MonitoringDashboard<br/>+ CPUChart<br/>+ ServiceStatus<br/>+ LogViewer"]
      CICD["CICDPipeline"]
      Testing["AutomatedTesting<br/>+ ChatContainer<br/>+ TestList<br/>+ TestOutputModal"]
      Help["HelpPage"]
    end

    subgraph Overlays["Global Overlays"]
      direction LR
      ToastContainer["ToastContainer"]
      ReleaseModal["ReleaseModal<br/>+ ReleaseNotification"]
      Guidance["WelcomeGuidance<br/>+ CompletionGuidance"]
    end

    subgraph Hooks["Cross-Cutting Hooks"]
      direction TB
      UseAuth["useAuth"]
      UseTabNav["useTabNavigation"]
      UseProjectMgmt["useProjectManagement"]
      UseTheme["useTheme"]
    end

    subgraph Persistence["Client Persistence"]
      direction TB
      Dexie["Dexie / IndexedDB<br/>(AppDatabase)"]
      LocalStorage["localStorage<br/>(currentUser session)"]
    end

    subgraph DataSources["Static Data Sources"]
      ReleasesJSON["/releases/releases.json<br/>/releases/changes.json"]
      GitHubRaw["raw.githubusercontent.com<br/>(fallback)"]
    end
  end

  App --> AppContent
  AppContent --> Providers
  Providers --> Routes
  AppRoutes --> Layout
  Layout --> Sidebar
  Layout --> TopBar
  Layout --> MainContent
  MainContent --> Features
  AppContent --> Overlays

  Layout -.uses.-> Hooks
  Features -.uses.-> Hooks
  UseAuth -->|reads/writes| LocalStorage
  UseAuth -->|reads/writes| Dexie
  ReleaseProvider -->|reads| Dexie
  GuidanceProvider -->|reads| Dexie

  ReleaseSync["releaseSync.ts<br/>(autoSyncReleases)"] -->|fetch| ReleasesJSON
  ReleaseSync -->|fetch fallback| GitHubRaw
  ReleaseSync -->|writes| Dexie
  App -.on mount.-> ReleaseSync

  classDef provider fill:#E8F0FE,stroke:#4285F4,stroke-width:1px;
  classDef feature fill:#E6F4EA,stroke:#34A853,stroke-width:1px;
  classDef overlay fill:#FEF7E0,stroke:#F9AB00,stroke-width:1px;
  classDef store fill:#FCE8E6,stroke:#EA4335,stroke-width:1px;
  classDef hook fill:#F3E8FD,stroke:#9334E6,stroke-width:1px;

  class ProjectProvider,ToastProvider,ReleaseProvider,GuidanceProvider provider;
  class Monitoring,CICD,Testing,Help feature;
  class ToastContainer,ReleaseModal,Guidance overlay;
  class Dexie,LocalStorage,ReleasesJSON,GitHubRaw store;
  class UseAuth,UseTabNav,UseProjectMgmt,UseTheme hook;
```

## 2. Container View

| Container         | Type                  | Responsibility                                                                 |
| ----------------- | --------------------- | ------------------------------------------------------------------------------ |
| **App**           | React root            | Mounts `BrowserRouter`, kicks off `autoSyncReleases()` on mount.               |
| **AppContent**    | Auth guard            | Watches `useAuth().isAuthenticated`; redirects to `/login` when missing.       |
| **Provider Stack**| React Context layer   | `ProjectProvider → ToastProvider → ReleaseProvider → GuidanceProvider`.        |
| **AppLayout**     | Shell                 | Renders `Sidebar`, `TopBar`, `MainContent` for all authenticated routes.       |
| **MainContent**   | Tab dispatcher        | Maps `TabName` → feature component (`MonitoringDashboard`, `CICDPipeline`, etc.). |
| **Feature comps** | Domain UI             | Self-contained per-feature trees with their own `hooks/`, `constants.ts`.      |
| **Global overlays**| Sibling renderers    | `ToastContainer`, `ReleaseModal`, `WelcomeGuidance`, `CompletionGuidance`.     |
| **AppDatabase**   | Dexie / IndexedDB     | Tables: `users`, `releases`, `userAcknowledgments`.                            |
| **localStorage**  | Browser storage       | Holds `currentUser` for session persistence between reloads.                   |

## 3. Module / Feature Map

```mermaid
flowchart LR
  subgraph src["src/"]
    direction TB

    subgraph components["components/"]
      auth["auth/<br/>LoginForm, RegisterForm,<br/>useAuth, useForm"]
      layout["layout/<br/>AppLayout, Sidebar,<br/>TopBar, MainContent"]
      monitoring["monitoring/<br/>MonitoringDashboard,<br/>CPUChart, ServiceStatus,<br/>LogViewer/, hooks/"]
      pipelining["pipelining/<br/>CICDPipeline"]
      testing["testing/<br/>AutomatedTesting,<br/>ChatContainer, TestList,<br/>TestOutputModal, hooks/"]
      releases["releases/<br/>ReleaseModal,<br/>ReleaseNotification,<br/>ReleaseDebug"]
      guidance["guidance/<br/>WelcomeGuidance,<br/>CompletionGuidance"]
      help["help/<br/>HelpPage"]
      shared["shared/<br/>cross-feature primitives"]
    end

    subgraph context["context/"]
      pCtx["ProjectContext"]
      tCtx["ToastContext"]
      rCtx["ReleaseContext"]
      gCtx["GuidanceContext"]
    end

    subgraph db["db/"]
      dbts["db.ts<br/>(AppDatabase)"]
      seed["seedReleases.ts"]
    end

    utils["utils/<br/>releaseSync.ts"]
    hooks["hooks/<br/>useTheme, ..."]
    helpers["helpers/<br/>constants"]
    types["types/"]
    tests["__tests__/<br/>unit/, integration/,<br/>mocks/, utils/"]
  end

  layout -.imports.-> monitoring
  layout -.imports app-wide hooks.-> monitoring
  monitoring --> shared
  testing --> shared
  pipelining --> shared
  auth -.uses.-> dbts
  releases -.uses.-> rCtx
  rCtx -.reads.-> dbts
  utils -.writes.-> dbts
  guidance -.uses.-> gCtx
  gCtx -.reads.-> dbts

  classDef feature fill:#E6F4EA,stroke:#34A853;
  classDef ctx fill:#E8F0FE,stroke:#4285F4;
  classDef store fill:#FCE8E6,stroke:#EA4335;

  class auth,layout,monitoring,pipelining,testing,releases,guidance,help,shared feature;
  class pCtx,tCtx,rCtx,gCtx ctx;
  class dbts,seed,utils store;
```

> Note: `useTabNavigation`, `useProjectManagement`, and `useAuthManagement` live under `components/monitoring/hooks/` even though `AppLayout` consumes them as app-wide hooks. This is intentional and documented in `CLAUDE.md`.

## 4. Key Interfaces & Contracts

| Boundary                         | Direction          | Contract                                                                 |
| -------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| `useAuth` ↔ `localStorage`       | read / write       | Key `currentUser`; value is the JSON-serialized `User` from Dexie.       |
| `useAuth` ↔ Dexie `users` table  | read / write       | Lookup by `username`; plaintext `password` comparison; insert on register. |
| `releaseSync` ↔ `releases.json`  | read (fetch)       | Schema: `{ releases: [{ version, releaseDate, title, description, changes[] }] }`. |
| `releaseSync` ↔ Dexie `releases` | write              | Inserts new versions; toggles `isLatest` (1/0) by semver-descending sort. |
| `ReleaseProvider` ↔ `releases`   | read               | Drives `ReleaseModal` and `ReleaseNotification`.                         |
| `GuidanceProvider` ↔ `userAcknowledgments` | read / write | Tracks per-user release acknowledgements and onboarding state.        |
| `MainContent` ↔ feature comps    | render contract    | Passes `selectedProject.id` and an `initialServiceName` getter.          |

## 5. External Dependencies (runtime)

- **React 18 / React Router 6** — UI rendering and routing.
- **Dexie 3** — IndexedDB persistence.
- **Recharts** — CPU / memory time-series charts in `monitoring/`.
- **Lucide React** — icon set.
- **React Toastify** — global toast container.
- **GitHub raw content** — fallback source for `releases.json` when the local fetch returns no entries.

## 6. Deployment Topology

```mermaid
flowchart LR
  Dev["Developer browser"] -->|HTTP| Static["Static hosting<br/>(GitHub Pages /<br/>any static CDN)"]
  Static -->|serves| Bundle["Vite production bundle<br/>(JS, CSS, assets)"]
  Bundle -->|loads| Browser["Browser SPA"]
  Browser -->|persists| IDB[("IndexedDB<br/>AppDatabase")]
  Browser -->|persists| LS[("localStorage<br/>currentUser")]
  Browser -->|fetch (optional)| GH["raw.githubusercontent.com<br/>(release notes fallback)"]
```

There is no application server in this repo; all runtime logic executes in the user's browser.
