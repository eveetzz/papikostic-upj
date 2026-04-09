# AI Copilot Instructions for PSI App

## Project Overview

**PSI App** is a React + Vite application with Firebase Authentication integration. The app implements a route-based auth system where unauthenticated users are redirected to login, and authenticated users can access protected pages like Home.

### Tech Stack
- **Framework**: React 19 + React Router DOM 7
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- **Backend**: Firebase Authentication (email/password + Google OAuth)
- **Linting**: ESLint with React Hooks rules
- **Language**: JavaScript (JSX) - no TypeScript

## Architecture & Data Flows

### Authentication Flow

1. **Firebase Integration** (`src/firebase.js`):
   - Initializes Firebase app with `VITE_*` environment variables (not in repo)
   - Exports `auth` object as singleton for use across app
   - Credentials come from `.env.local` - ensure this file exists with keys: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

2. **Auth Store** (`src/store/authStore.js`):
   - **Not a context provider** - contains standalone async functions (design choice)
   - `register(email, password)` / `login(email, password)` - return `{success, user/error}`
   - `googleLogin()` - Firebase popup OAuth flow
   - `logout()` - clears Firebase session
   - `checkAuth(callback)` - Firebase listener that triggers callback on auth state changes
   - **Pattern**: Error handling uses try-catch; all functions return structured responses

3. **AuthGuard Component** (`src/components/AuthGuard.jsx`):
   - Route wrapper that enforces authentication logic
   - Routes hierarchy: `<AuthGuard>` contains ALL routes (root, auth pages, protected pages)
   - **Redirect Logic**: 
     - If authenticated + on auth page → redirect to `/pages/Home`
     - If unauthenticated + on protected page → redirect to `/auth/Login`
     - Renders loading spinner while checking `onAuthStateChanged`
   - Auth pages: `/`, `/auth/Login`, `/auth/Register`

### Routing Structure (`src/App.jsx`)

```
/
├── / → Navigate to /auth/Login
├── /auth/Login → Login component
├── /auth/Register → Register component
└── /pages/Home → Home component (protected)
```

**All routes wrapped in `<AuthGuard>` for auth protection.**

## Key Patterns & Conventions

### Component Conventions
- **Functional components** with hooks only (no class components)
- **File naming**: PascalCase for components (`Login.jsx`, `AuthGuard.jsx`)
- **Export style**: Named exports for page/auth components (e.g., `export const Login = () => {}`)
- **Default export**: Only used in `App.jsx` and `main.jsx`

### State Management
- **No Redux/Context** - uses local `useState` in components
- **Firebase listener pattern**: `onAuthStateChanged` subscribed in components, unsubscribed on unmount
- Auth state not persisted in app state; relies on Firebase's persistent session

### Styling
- **Tailwind CSS only** - no CSS modules or CSS-in-JS
- Tailwind loaded via Vite plugin (not CDN) for HMR support
- Inline classes; no custom component abstractions yet

### Error Handling (Incomplete)
- `Login.jsx` and `Register.jsx` reference undefined `setError` state - **this is a bug to fix**
- Current pattern: Catch errors, show error message to user
- Google login handler has wrong param reference (`handleLoginWithGoogle` uses `e` which is undefined)

## Developer Workflows

### Build & Dev
```bash
npm run dev          # Start Vite dev server (hot reload on file changes)
npm run build        # Production build → dist/
npm run lint         # ESLint check
npm run preview      # Preview production build locally
```

### Environment Setup
1. Create `.env.local` in project root
2. Add Firebase config keys (ask for values from Firebase console)
3. Dev server auto-reloads `.env.local` changes

## Integration Points & External Dependencies

### Firebase Auth Methods Used
- `createUserWithEmailAndPassword()` - Registration
- `signInWithEmailAndPassword()` - Email login
- `signInWithPopup()` + `GoogleAuthProvider()` - Google OAuth
- `signOut()` - Logout
- `onAuthStateChanged()` - Persistent auth listener

### Cross-Component Communication
1. **Auth state flows via Firebase, not props** - components call `checkAuth()` independently
2. **Navigation** - use `useNavigate()` hook from React Router after auth success
3. **No shared component state** - each page manages its own local state

## Code Quality & Linting

- **ESLint Config** (`eslint.config.js`):
  - `no-unused-vars` rule: Ignores `^[A-Z_]` pattern (constants, components)
  - React Hooks rules enabled (must use hooks correctly)
  - React Refresh plugin for Vite HMR
  - Browser globals enabled

### Common Patterns to Preserve
- Async/await for Firebase operations (not then-chains)
- Loading states during auth checks
- Path-based route protection (not component-level)

## Known Issues & TODOs

1. **Error state not implemented**: `Login.jsx` and `Register.jsx` have broken error handling
2. **Google login bug**: `handleLoginWithGoogle` uses undefined `e` parameter
3. **Commented Context code**: `AuthStore` context provider commented out in `authStore.js` - consider removing or documenting why
4. **Database/Functions disabled**: Firestore and Cloud Functions imports commented in `firebase.js`
5. **Incomplete UI**: Home page is just placeholder
