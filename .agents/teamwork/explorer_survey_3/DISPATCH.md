## 2026-10-30T12:52:26Z
[From Orchestrator: dbe60015-7af9-4298-a52b-536f980ce583]
You are Explorer 3 (Code Quality & UI Explorer).
Your Working Directory: E:\ameer-store\.agents\teamwork\explorer_survey_3\
Your Parent Orchestrator ID: dbe60015-7af9-4298-a52b-536f980ce583

MANDATORY FIRST STEP:
Read E:\ameer-store\.agents\teamwork\ORIGINAL_REQUEST.md before doing any analysis.

STRICT PROJECT BOUNDARY:
You must operate exclusively within E:\ameer-store. DO NOT touch, inspect, or modify anything in E:\WEB or any external directory.

OBJECTIVE:
Perform a CodeRabbit-style comprehensive code review across all pages, UI components, TypeScript type safety, Next.js build readiness, and ESLint configurations in Ameer Store (E:\ameer-store).

SCOPE & FOCUS:
1. TypeScript strictness & Type Safety:
   - Run or inspect `npx tsc --noEmit` checks in `E:\ameer-store`.
   - Inspect any/unknown types, type assertions, non-null assertions (`!`), missing interface definitions in `src/types/` and components.
2. Build & Lint Configuration:
   - Check `package.json`, `tsconfig.json`, `.eslintrc.json`, Next.js config for deprecated patterns, build warnings, and ESLint failures.
   - Run or inspect `npm run lint` and `npm run build` diagnostics in `E:\ameer-store`.
3. UI/UX, Components & Performance:
   - Component lifecycle, memory leaks, unoptimized re-renders, useEffect dependencies.
   - React hydration mismatches (especially with localStorage, dates, dynamic values, or client/server differences).
   - Error boundaries: are there graceful error fallbacks for page crashes or failed fetches?
   - Arabic language (RTL) formatting, logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`), typography, layout overflows on 360px+ viewports.
   - Accessibility (semantic HTML, image alt tags, ARIA attributes).

OUTPUT REQUIREMENTS:
- Write your findings in `E:\ameer-store\.agents\teamwork\explorer_survey_3\analysis.md` organized by severity (Critical, High, Medium, Low) with exact file paths, line numbers, issue descriptions, and refactoring solutions.
- Write a structured `E:\ameer-store\.agents\teamwork\explorer_survey_3\handoff.md` with Observation, Logic Chain, Caveats, Conclusion, and Recommended Fix Strategy.
- Update `progress.md` in your directory periodically.
- Send a completion message to parent orchestrator (`dbe60015-7af9-4298-a52b-536f980ce583`) via `send_message` with your summary and handoff path.
