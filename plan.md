# Creative Hair Solutions — Implementation Plan

## Objective

Evolve the existing Creative Hair Solutions public website into one integrated salon operations system. Preserve the current public brand and content while replacing placeholder admin workspaces with database-backed workflows that share one domain model.

## Baseline and constraints

The repository is a Vite/React/Express/tRPC/Drizzle TypeScript app using MySQL when `DATABASE_URL` is configured. The current schema covers users, appointments, bills, enquiries, clients, and feedback, but the admin UI still contains placeholder workspaces and hardcoded service/provider choices. A baseline branch, tag, and archive were created before changes. The source requirements are tracked in `docs/feature-checklist.md` and remain the acceptance source of truth.

## Architecture

- **Frontend:** existing React/Wouter shell and branded styles; add routed feature pages/components for services, providers, customers, appointments, POS, inventory, suppliers, expenses, reports, settings, and permissions.
- **Backend:** tRPC procedures with Zod validation and explicit permission guards. Business mutations use transactions/idempotency where multiple records must stay consistent.
- **Database:** extend Drizzle MySQL schema with normalized catalogue, CRM, POS, inventory, finance, attendance, membership, permissions, and audit tables. Preserve historical snapshots on invoice lines and transaction records.
- **Persistence:** require production `DATABASE_URL`; retain the existing appointment JSON fallback only for local legacy compatibility and never use it for the new business workflows.
- **Auth:** retain current secure local session as a compatibility path, but model individual users/roles/permissions in the database and enforce them in backend procedures. Do not rely on frontend visibility.
- **Integration:** WhatsApp browser deep links are available without credentials. API reminders require credentials and will be marked blocked until configured and tested.
- **Documents:** generate branded printable/PDF invoices from persisted invoice data; exports use server-validated report queries.

## Delivery order

1. Data model, migrations, server storage helpers, permission utilities, audit/idempotency primitives.
2. Service catalogue, providers, customers, appointments.
3. Products, stock movements, suppliers/purchases.
4. POS/invoices/payments/refunds and cross-module side effects.
5. Dashboard, reports, exports, attendance, commissions, memberships/packages/loyalty.
6. Settings, account/permission administration, integration configuration.
7. Replace placeholder routes with real pages and wire all visible navigation/actions.
8. Automated tests, typecheck/build, running-app smoke/E2E tests, deployment verification where credentials/access exist.
9. Update `docs/feature-checklist.md` with evidence; leave blocked items explicitly documented.

## Design direction

Use the existing brand as the primary reference: warm editorial family-salon styling with cream/beige surfaces, brown-black text, copper/gold accents, and restrained white space. Keep the public website visually intact. The admin should feel like a premium control room rather than a generic SaaS template: dense but legible operational tables, clear monetary hierarchy, strong states, and mobile-first stacked forms.

- **Core principles:** trustworthy money handling, fast front-desk workflows, obvious status, reversible actions with auditability.
- **Layout paradigm:** persistent compact navigation with task-focused workspaces and dense list/detail panels rather than decorative dashboard tiles.
- **Signature elements:** gold rule accents, branded invoice treatment, consistent rupee formatting and status pills.
- **Interaction philosophy:** every save reports success or actionable failure; destructive/financial actions require explicit intent and preserve history.
- **Typography:** retain existing UI typography and hierarchy; use bold display treatment only for brand/section headers.

## Project structure

- `drizzle/schema.ts`: normalized tables and inferred types.
- `drizzle/*.sql`: generated migrations.
- `server/db.ts`: query/mutation storage and transaction helpers.
- `server/permissions.ts`: role/action authorization helpers.
- `server/routers.ts`: typed API procedures grouped by domain.
- `server/tests/`: backend unit/integration tests for validation, permissions, calculations, and persistence contracts.
- `client/src/pages/`: route-level feature workspaces.
- `client/src/components/`: reusable tables, forms, dialogs, invoice/metric/report components.
- `client/src/lib/`: formatting and client utilities.
- `docs/feature-checklist.md`: living acceptance checklist and evidence ledger.
- `TODO.md`: outcome-based work queue preserving concrete acceptance clauses.

## Completion standard

Do not claim production readiness while any required feature is unimplemented, inaccessible, or untested. Update the checklist only with passing evidence from the actual app and distinguish local-only passing tests from deployed/cross-device verification. External credentials and deployment blockers must remain explicit.
