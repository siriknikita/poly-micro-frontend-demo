# Sequence Diagrams — Poly Micro Manager (Frontend Demo)

> Confluence page collecting the principal runtime sequences of the SPA. Diagrams use **Mermaid** sequence syntax — Confluence Cloud renders these natively from `mermaid` code fences. On Server/Data Center, install the *Mermaid Diagrams for Confluence* macro.

---

## 1. Application Bootstrap & Release Sync

Triggered automatically on first render of `App.tsx`.

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Browser
  participant App as App.tsx
  participant ReleaseSync as releaseSync.autoSyncReleases
  participant Local as /releases/releases.json
  participant GitHub as raw.githubusercontent.com
  participant Dexie as IndexedDB (releases table)

  User->>Browser: Open app URL
  Browser->>App: Mount React tree
  App->>App: useEffect(() => autoSyncReleases())
  App->>ReleaseSync: autoSyncReleases()
  ReleaseSync->>Local: fetch('/releases/releases.json')
  alt Local file has entries
    Local-->>ReleaseSync: { releases: [...] }
  else No local entries
    ReleaseSync->>GitHub: fetch raw releases.json (fallback)
    GitHub-->>ReleaseSync: { releases: [...] }
  end
  ReleaseSync->>Dexie: read existing versions
  Dexie-->>ReleaseSync: existing[]
  ReleaseSync->>ReleaseSync: diff (new = source \ existing)
  ReleaseSync->>Dexie: where(isLatest=1).modify({isLatest:0})
  loop for each new release
    ReleaseSync->>Dexie: add(release, isLatest = matches latest semver)
  end
  ReleaseSync-->>App: addedIds[]
  App->>Browser: render <Routes /> + overlays
```

**Notes**

- The fallback path is hard-coded to `siriknikita/poly-micro-frontend-demo/main/releases/releases.json` in `releaseSync.ts`.
- `isLatest` uses `1` / `0` (not booleans) to satisfy Dexie indexing.

---

## 2. Login Flow

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant LoginForm
  participant useForm
  participant useAuth
  participant Dexie as Dexie users
  participant LS as localStorage
  participant Router as React Router

  User->>LoginForm: enters username + password
  User->>LoginForm: submit
  LoginForm->>useForm: handleSubmit(values)
  useForm->>useForm: validate(rules)
  alt validation fails
    useForm-->>LoginForm: errors
    LoginForm-->>User: render inline errors
  else validation passes
    useForm->>useAuth: login(username, password)
    useAuth->>Dexie: users.where('username').equals(u).first()
    Dexie-->>useAuth: user | undefined
    alt match + password correct
      useAuth->>LS: setItem('currentUser', JSON.stringify(user))
      useAuth->>useAuth: setAuthState({ user, isAuthenticated: true })
      useAuth-->>useForm: resolve
      useForm-->>LoginForm: success
      LoginForm->>Router: navigate('/dashboard')
    else not found / wrong password
      useAuth-->>useForm: reject('Invalid username or password')
      useForm-->>LoginForm: submitError
      LoginForm-->>User: show error message
    end
  end
```

**Caveats**

- Passwords are compared as plaintext against the Dexie record. Demo-only.
- `useAuth` listens to `storage` events so a login in another tab propagates to all open tabs.

---

## 3. Registration Flow

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant RegisterForm
  participant useAuth
  participant Dexie as Dexie users
  participant Router

  User->>RegisterForm: fills form (businessName, email, username, password)
  User->>RegisterForm: submit
  RegisterForm->>useAuth: register(userData)
  useAuth->>Dexie: users.where('username').equals(u).first()
  Dexie-->>useAuth: existing | undefined
  alt username taken
    useAuth-->>RegisterForm: reject('Username already exists')
    RegisterForm-->>User: show error
  else username free
    useAuth->>Dexie: users.add(userData)
    Dexie-->>useAuth: new id
    useAuth-->>RegisterForm: resolve
    RegisterForm->>Router: navigate('/login')
  end
```

---

## 4. Authenticated Tab Navigation

`AppLayout` is the same component for `/dashboard`, `/monitoring`, `/cicd`, `/testing`, and `/help`. The active feature is selected by `useTabNavigation`, not by route path.

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Sidebar
  participant useTabNavigation
  participant AppLayout
  participant MainContent
  participant Feature as Active feature<br/>(MonitoringDashboard /<br/>CICDPipeline /<br/>AutomatedTesting / HelpPage)

  User->>Sidebar: click tab (e.g. "Testing")
  Sidebar->>useTabNavigation: setActiveTab(TABS.TESTING)
  useTabNavigation-->>AppLayout: activeTab updated
  AppLayout->>MainContent: <MainContent activeTab=... selectedProject=... />
  MainContent->>MainContent: pick component by TabName
  alt no project selected and tab != HELP
    MainContent-->>User: "Please select a project"
  else
    MainContent->>Feature: mount with selectedProject.id + lastSelectedService
    Feature-->>User: render feature UI
  end
```

**Side effects in `AppLayout`**

- A `sessionStorage` flag `forceTestingTab` (set by guidance navigation) forces `activeTab = TESTING` and is then cleared.
- A `?guidance=true` query param triggers `refreshAuthState()` and is stripped from the URL via `history.replaceState`.

---

## 5. Project Selection

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant TopBar
  participant useProjectManagement
  participant ProjectContext
  participant MainContent
  participant Feature

  User->>TopBar: open project picker
  User->>TopBar: select project
  TopBar->>useProjectManagement: handleSelectProject(project)
  useProjectManagement->>ProjectContext: setProject(project)
  ProjectContext-->>MainContent: re-render with selectedProject
  MainContent->>Feature: mount/update with new selectedProject.id
  Feature-->>User: render data scoped to project
```

---

## 6. Release Notification & Acknowledgement

Triggered after login when the synced "latest" release has not yet been acknowledged by the current user.

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant ReleaseProvider
  participant Dexie as Dexie
  participant ReleaseNotification
  participant ReleaseModal

  ReleaseProvider->>Dexie: releases.where('isLatest').equals(1).first()
  Dexie-->>ReleaseProvider: latestRelease
  ReleaseProvider->>Dexie: userAcknowledgments<br/>.where({userId, releaseId}).first()
  Dexie-->>ReleaseProvider: acknowledgement | undefined
  alt not yet acknowledged
    ReleaseProvider-->>ReleaseNotification: show toast
    User->>ReleaseNotification: click "View"
    ReleaseNotification->>ReleaseModal: open(latestRelease)
    User->>ReleaseModal: read changes, click "Got it"
    ReleaseModal->>Dexie: userAcknowledgments.add({userId, releaseId, acknowledgedAt})
    ReleaseModal-->>User: close modal
  else already acknowledged
    ReleaseProvider-->>ReleaseNotification: stay hidden
  end
```

---

## 7. Logout

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant TopBar
  participant useAuthManagement
  participant useAuth
  participant LS as localStorage
  participant AppContent
  participant Router

  User->>TopBar: click "Logout"
  TopBar->>useAuthManagement: handleLogout()
  useAuthManagement->>useAuth: logout()
  useAuth->>LS: removeItem('currentUser')
  useAuth->>useAuth: setAuthState({ user: null, isAuthenticated: false })
  useAuth-->>AppContent: isAuthenticated=false
  AppContent->>Router: navigate('/login', { replace: true })
  Router-->>User: render LoginForm
```

---

## 8. End-to-End: New User → Dashboard

A consolidated happy-path covering registration through first feature view.

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant App
  participant ReleaseSync
  participant RegisterForm
  participant LoginForm
  participant AppLayout
  participant Feature
  participant Dexie
  participant LS as localStorage

  User->>App: open /
  App->>ReleaseSync: autoSyncReleases() (background)
  ReleaseSync->>Dexie: upsert releases
  App->>LoginForm: redirect / → /login
  User->>LoginForm: click "Sign up"
  LoginForm->>RegisterForm: navigate /register
  User->>RegisterForm: submit registration
  RegisterForm->>Dexie: users.add(...)
  RegisterForm->>LoginForm: navigate /login
  User->>LoginForm: submit credentials
  LoginForm->>Dexie: users.where(username).first()
  Dexie-->>LoginForm: user
  LoginForm->>LS: setItem('currentUser', user)
  LoginForm->>AppLayout: navigate /dashboard
  AppLayout->>AppLayout: useTabNavigation → DASHBOARD
  AppLayout->>Feature: render MonitoringDashboard
  Feature-->>User: dashboard ready
```

---

## 9. Cross-Cutting Notes

- **No backend HTTP** in production runtime — only `fetch` calls hit the **static** `releases.json` (and optionally GitHub raw as a fallback). Tests use **MSW** to intercept any HTTP traffic.
- **State propagation** between contexts is synchronous within the React render cycle; cross-tab synchronisation relies on `localStorage` `storage` events handled inside `useAuth`.
- **No tokens / no refresh flow.** Session = presence of the `currentUser` JSON in `localStorage`.
