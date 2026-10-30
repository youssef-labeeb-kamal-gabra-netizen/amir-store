## 2026-10-30T13:40:18Z
From: dbe60015-7af9-4298-a52b-536f980ce583 (Parent Orchestrator)
Role: Test Writer 1 (E2E Test Architect)
Working Directory: E:\ameer-store\.agents\teamwork\test_writer_1\

You are Test Writer 1 (E2E Test Architect).
Your Working Directory: E:\ameer-store\.agents\teamwork\test_writer_1\
Your Parent Orchestrator ID: dbe60015-7af9-4298-a52b-536f980ce583

MANDATORY FIRST STEP:
Read E:\ameer-store\.agents\teamwork\ORIGINAL_REQUEST.md and E:\ameer-store\.agents\teamwork\orchestrator\PROJECT.md before doing any work.

STRICT PROJECT BOUNDARY:
Operate strictly within E:\ameer-store. DO NOT touch, inspect, or modify anything in E:\WEB or any external directory.

WRITE OWNERSHIP:
You exclusively own:
- `scripts/run-tests.js`
- `scripts/verify-all.js`
- Any new test runner scripts in `scripts/`
- `TEST_INFRA.md`
- `TEST_READY.md`
Do NOT modify any application source files in `src/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

OBJECTIVE:
Design and build a comprehensive 4-tier opaque-box test suite for Ameer Store, replacing the obsolete agricultural LKL assertions in `scripts/run-tests.js` with rigorous tests for Ameer Store luxury perfumes.

TEST METHODOLOGY (4 Tiers):
1. Tier 1: Feature Coverage (>=5 tests per feature across order creation, catalog query, server price validation, admin auth/protection, WhatsApp order link generator).
2. Tier 2: Boundary & Corner Cases (>=5 tests per feature: price tampering rejection, negative quantities, 0 items, string injection in numbers, invalid phone regex, unknown governorates, unauthorized admin access).
3. Tier 3: Cross-Feature Combinations (COD flow vs WhatsApp flow, catalog price change synchronization, cart hydration safety).
4. Tier 4: Real-World Scenarios (Full customer purchase journeys, order status progression).

DELIVERABLES:
1. `TEST_INFRA.md` at project root (`E:\ameer-store\TEST_INFRA.md`).
2. Updated and expanded test suite in `scripts/run-tests.js` that executes all tiers and can be run via `npm test` or `node scripts/run-tests.js`.
3. `TEST_READY.md` at project root (`E:\ameer-store\TEST_READY.md`) detailing runner command and tier counts.
4. `handoff.md` in your working directory.
5. Send completion message to parent orchestrator (`dbe60015-7af9-4298-a52b-536f980ce583`) via `send_message`.
