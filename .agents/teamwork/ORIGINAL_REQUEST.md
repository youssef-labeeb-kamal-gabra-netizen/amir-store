# Original User Request

## Initial Request — 2026-10-30 12:47:36 UTC

Perform a comprehensive security audit, CodeRabbit-style professional code review, and full debugging/hardening on the Ameer Store (أمير ستور) luxury perfume e-commerce web application, identifying and directly resolving all vulnerabilities, bugs, and edge cases.

Working directory: E:\ameer-store
Integrity mode: development

## Requirements

### R1. Comprehensive Security Audit and Code Review
Conduct a rigorous security audit and CodeRabbit-style code review across all pages, components, and API routes in Ameer Store (`E:\ameer-store`), identifying all potential security vulnerabilities, logic bugs, performance pitfalls, and edge cases. Produce a clear review summary detailing findings by severity (Critical, High, Medium, Low) and their remediations.

### R2. Code Remediation and Bug Fixing
Directly remediate and fix all identified vulnerabilities, logic flaws, and bugs in the codebase (`E:\ameer-store`). Ensure strict server-side validation and authorization on all API routes, secure handling of order data, robust cart/checkout state management (maintaining the active COD + WhatsApp dual flow), and error-free client and server execution.

### R3. Strict Project Boundary Constraint
The team must operate exclusively within `E:\ameer-store` and must NOT touch, modify, or delete any files outside this project, including `E:\WEB` which belongs to an isolated project.

## Verification Resources
Standard automated project verification: Next.js production build (`npm run build`), TypeScript strict check (`npx tsc --noEmit`), ESLint linting (`npm run lint`), and programmatic API/route verification.

## Acceptance Criteria

### Security & Data Integrity
- [ ] Server-side input validation and payload sanitization are enforced across all API endpoints (including `/api/orders`).
- [ ] Admin routes and sensitive data operations enforce server-side authorization checks.
- [ ] Order creation, persistence, and retrieval handle malformed requests, missing fields, and edge cases gracefully without server crashes or data corruption.
- [ ] COD and WhatsApp checkout flows function correctly with accurate pricing and item data calculation on the server.

### Code Quality & Build Verification
- [ ] TypeScript strict mode checks (`npx tsc --noEmit`) pass with zero errors.
- [ ] Next.js production build (`npm run build`) completes successfully without build errors or blocking warnings.
- [ ] ESLint passes without unhandled errors.
- [ ] A structured review and audit report is provided summarizing all identified issues and their verified fixes.
