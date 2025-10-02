# Table of Contents

-   [High-Level Architecture](#high-level-architecture)
-   [Application Layers](#application-layers)
    -   [Presentation Layer (UI)](#presentation-layer-ui)
    -   [State Layer](#state-layer)
    -   [Domain & Logic Layer](#domain--logic-layer)
    -   [Services Layer](#services-layer)
    -   [Types & Contracts](#types--contracts)
    -   [Utilities Layer](#utilities-layer)
-   [Data Flow](#data-flow)
-   [Error Handling](#error-handling)
-   [Performance Considerations](#performance-considerations)
-   [Security](#security)
-   [Deployment & Environments](#deployment--environments)
-   [Future Extensions](#future-extensions)

## High-Level Architecture

-   **Framework**: Next.js (React + TypeScript)
-   **Styling**: Tailwind CSS + shadcn/ui component library
-   **State Management**: Zustand
-   **Data Fetching**: Axios
-   **Deployment**: Vercel

The app follows a **modular, feature-driven architecture**, with clear separation of concerns:

-   UI components live in `/components`
-   Core logic is organized in `/lib`
-   Services are integrated via `/services`
-   State is centralized in `/stores`
-   Shared contracts are defined in `/types`
-   Utility helpers are stored in `/utils`

---

## Application Layers

### **Presentation Layer (UI)**
- Built with React functional components
- Styled via Tailwind CSS utilities
- Consistency enforced with reusable shadcn/ui components
- Accessibility and responsiveness are first-class concerns

### **State Layer**
- Local state: `useState`
- Global state: Zustand (auth only)
- Keeps business logic out of components
### **Domain & Logic Layer**
- Encapsulated in `/lib`
- Handles application-specific logic

### **Services Layer**
- Located in `/services`
- Responsible for communicating with internal APIs (via Axios)
- Each service is isolated by domain (e.g., `games.service.ts`, `scores.service.ts`)
### **Types & Contracts**
- Defined in `/types`
- Provides TypeScript interfaces, enums, shared types, and Zod interfaces
- Ensures type safety across layers
### **Utilities Layer**
- Located in `/utils`
- Small, generic functions with no business logic (Supabase and Prisma utilities for auth)
- Example: Supabase middleware, server and browser clients

---

## Data Flow

-   **UI components** trigger **actions** (e.g., user clicks login).
-   Components call **services** (Axios requests).
-   Services return structured data, mapped to Zod **types**.
-   Data is stored in **Zustand stores** or local component state.
-   UI re-renders with updated state.

---

## Error Handling

-   Centralized in services layer (catch Axios errors, normalize error shape).
-   UI components display user-friendly error messages.
-   Critical failures logged.

---

## Performance Considerations

-   Use Next.js **server components** where possible.
-   Use **dynamic imports** for heavy UI components.
-   Optimize images via Next.js `<Image />`.

---

## Security

-   Authentication stored in Zustand store.
-   Sensitive tokens/keys never exposed in client-side code.
-   Environment variables managed via `.env.local` and Vercel dashboard.
-   All API requests routed through services layer for consistent security handling.

---

## Deployment & Environments

-   **Vercel** handles builds, previews, and production.
-   **Preview deployments** auto-generated on PRs.
-   Secrets managed via Vercel environment variables.
-   Local environment uses `.env.local`.

---

## Future Extensions

-   Introduce monitoring/logging tools (Sentry, LogRocket, etc.).
-   Define a testing strategy for integration and E2E.

---
