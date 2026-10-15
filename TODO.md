# Implementation TODO

## Data foundation and authorization

- [ ] Add normalized persistent tables and migrations for services, providers/staff, customers, invoice lines, products, stock movements, suppliers/purchases, payments/refunds, expenses, attendance, commissions, memberships/packages/loyalty, permissions, settings, and audit events. Preserve historical invoice snapshots and enforce unique/idempotent transaction keys.
- [ ] Add backend permission helpers and apply them to every protected read and mutation; support Owner/Admin, Manager, Receptionist, Service Provider, and Accountant permissions.
- [ ] Add robust error handling, loading/retry states, transaction boundaries, and no-secret-in-client checks.

## Core operations

- [ ] Replace hardcoded service/provider choices with database-backed service catalogue and provider management, including add/edit/archive/search/filter and validation.
- [ ] Build unified customer CRM and link customers from public booking, appointments, billing, invoices, and purchase history.
- [ ] Build appointment calendar with database customer/service/provider selectors, availability/conflict validation, reschedule/cancel/status lifecycle, and billing handoff.
- [ ] Build products, stock receiving/adjustment, suppliers/purchases, low-stock alerts, and immutable movement history.
- [ ] Build transactional POS with line items, provider attribution, taxes/discounts, configurable/split/advance payments, invoice numbering, idempotency, inventory and commission side effects, refunds/cancellations, print/PDF/WhatsApp actions.

## Finance, people, reporting, and settings

- [ ] Add payments, outstanding balances, refunds, expenses, attendance, configurable commissions, memberships, packages, coupons/offers, and loyalty ledgers.
- [ ] Add real dashboard KPIs, date/branch filters, operational/financial/staff/inventory reports, CSV/PDF exports, and reconciliation-safe definitions.
- [ ] Add business/settings screens, staff account management, permission configuration, invoice settings, branch/hours/tax/payment settings, integration configuration, and audit history.

## UI and integration

- [ ] Replace every placeholder sidebar workspace and action toast with a working route/page/form/list/detail flow; keep public website, branding, contact details, services, prices, images, and WhatsApp links intact.
- [ ] Add and maintain `public/manus-routes.json` for all routes; verify responsive behavior on mobile, tablet, and desktop.
- [ ] Configure/test WhatsApp deep-link sharing. If automated WhatsApp reminders are desired, document and test the required provider credentials/templates instead of presenting them as active without credentials.

## Validation and delivery

- [ ] Add automated backend tests for calculations, validation, duplicate submissions, permissions, inventory/reversal side effects, and report definitions.
- [ ] Run typecheck, unit/integration tests, production build, and running-app smoke tests for every acceptance workflow in `docs/feature-checklist.md`.
- [ ] Verify refresh/re-login persistence and a second authorized browser/device against the real shared database.
- [ ] Verify deployed version, privacy of admin routes, backups/recovery procedure, environment variables, and owner/staff operating instructions.
- [ ] Update every checklist row with actual evidence and leave any external/deployment blocker explicitly incomplete.
