# LKL Website — Architecture Assessment & Blueprint (TASK 010)
## شركة لبيب كمال للأدوات والآلات الزراعية (LKL)

### 1. Executive Architecture Summary
Following the Discovery Phase (Tasks 000–009), the workspace `e:\WEB` is a clean slate. The project requires a production-grade, Arabic-first, RTL-correct, highly maintainable web application with public catalog, contact workflows, Google OAuth, and an enterprise-ready administration system.

### 2. Technology Stack Selection
- **Runtime:** Node.js v24.22.0 LTS
- **Package Manager:** npm (v11.19.1)
- **Framework:** Next.js 15 (App Router with React Server Components & Server Actions)
- **Language:** TypeScript 5 (Strict Mode enabled, no `any`, no `@ts-ignore`)
- **Styling & Design System:** Tailwind CSS v3/v4 with custom design tokens (LKL Green & Gold brand palette, RTL support via logical CSS properties)
- **Icons:** `lucide-react` (semantic, consistent, accessible)
- **Typography:** Cairo font family (Google Fonts) with system fallbacks optimized for Arabic and English readability
- **Data & Persistence Layer:** Relational architecture (PostgreSQL schema definition + Type-safe repository layer)
- **Authentication:** Official Google OAuth integration with secure HTTP-only cookies and server-side session verification
- **Authorization:** Server-side Role-Based Access Control (RBAC: USER, ADMIN) enforced on Server Actions and Route Handlers

### 3. Layered Architectural Separation
```
src/
├── app/                  # Next.js App Router (RSC, layouts, pages, routes, error boundaries)
│   ├── (public)/         # Public facing routes (Home, Products, About, Services, Contact)
│   ├── (auth)/           # Authentication routes (Login, OAuth callbacks)
│   ├── (account)/        # User account management
│   ├── admin/            # Secure Admin dashboard & management interfaces
│   └── api/              # Validated REST / webhook endpoints
├── components/           # Reusable UI Design System & Building Blocks
│   ├── ui/               # Base primitives (Button, Input, Card, Modal, Toast, Skeleton, etc.)
│   ├── layout/           # Header, Footer, Sidebar, Navigation, MobileDrawer
│   └── common/           # Error states, Empty states, SEO metadata, Breadcrumbs
├── features/             # Feature-based business domain modules
│   ├── products/         # Catalog, search, filters, specifications, gallery
│   ├── categories/       # Category definitions, navigation, badges
│   ├── contact/          # Inquiries, WhatsApp routing, contact requests
│   ├── admin/            # Admin widgets, metrics, audit viewers
│   └── settings/         # Site business settings and content blocks
├── lib/                  # Shared utilities and configurations
│   ├── env.ts            # Type-safe environment validation
│   ├── db.ts             # Database client and repository connections
│   ├── auth.ts           # Authentication session helpers
│   ├── rbac.ts           # Role-based authorization rules
│   └── utils.ts          # Pure helper functions (formatting, dates, classes)
└── types/                # Core domain types and interfaces
```

### 4. Non-Negotiable Standards Adherence
- **Zero Fabrication:** No fake prices, no fictitious statistics, no invented branches or claims.
- **RTL-First:** Semantic logical spacing (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`), proper directional iconography.
- **Security:** CSRF protection, secure cookie flags, input validation with strict schemas, server-side authorization enforcement.
- **Performance:** Native image optimization, zero client bloat, minimal bundle footprint, semantic caching.
