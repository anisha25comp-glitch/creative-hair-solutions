# Creative Hair Solutions — Complete Feature Checklist

**Status legend:** ☐ Not started · ◐ In progress · ✅ Complete only with passing application evidence · ⚠ Blocked by required external access/configuration

**Baseline inspected:** commit `608aeee78f1352e9178f9ce853a15fa6c7ace43f`, branch/tag `backup/baseline-20261016` / `baseline-20261016`, archive `/home/ubuntu/creative-hair-solutions-baseline-20261016.tar.gz`.

**Important acceptance rule:** a row is not marked complete from code inspection alone. It requires a passing test in the running application, persistence verification after refresh/re-login, backend authorization/error-path verification, and deployed-version verification where deployment is available.

## Current baseline findings and dependencies

- Existing public foundation: Home, Store, brand logo/images, branch/contact/service presentation, public booking form, enquiry form, feedback form, WhatsApp links.
- Existing protected routes: `/admin`, `/admin/*`, `/staff`, `/staff/*`; current login is environment-variable-based local admin/staff credentials.
- Existing persistent tables: `users`, `appointments`, `bills`, `enquiries`, `clients`, `feedback`.
- Current fallback: appointments can write to `server/data/appointments.json` when `DATABASE_URL` is missing; this is not acceptable as the production business database.
- Current placeholders: products, stock, vendors, expenses, services/packages, coupons, providers, settings, and reports render action cards/toasts rather than functional workflows.
- Missing data model: service catalogue, providers/staff profiles, customers linked to invoices/appointments, invoice line items, products/stock movements, suppliers/purchases, payments/refunds, expenses, attendance, commissions, memberships/packages/loyalty, permissions, audit log, business settings.
- Required configuration dependencies: production MySQL-compatible `DATABASE_URL` (or approved equivalent), strong `LOCAL_AUTH_SECRET`/`JWT_SECRET`, real admin/staff account strategy, production hosting environment variables, WhatsApp provider credentials for automated reminders (optional deep link works without credentials), and deployment/hosting access for public verification.
- Existing business source data dependency: confirm/import the real current service catalogue and prices from the public website; do not replace with invented prices. Public content currently contains service names, but no normalized service table exists.

## 1. Public foundation and brand preservation

- ☐ Inspect and preserve public Home page, logo, images, business name, address, branch details, service information, pricing, contact details, WhatsApp links, store/products, enquiry and feedback flows.
- ☐ Confirm public navigation and every visible public link/button still resolves correctly.
- ☐ Confirm public appointment/enquiry/feedback submissions persist in the same backend used by the admin system.
- ☐ Confirm public booking creates/reuses a customer record and uses database-backed services/providers where applicable.
- ☐ Confirm public website remains usable after admin-system migrations and deployment.
- ☐ Confirm sensitive admin routes are not publicly accessible without authentication.

## 2. Authentication, users, roles, and permissions

- ☐ Owner/admin login, logout, expired-session handling, invalid-credential error, secure cookie settings, and refresh persistence.
- ☐ Staff login/logout with separate account identity.
- ☐ Individual staff accounts (not one shared staff credential), activation/deactivation, password/session lifecycle.
- ☐ Role definitions: Owner/Admin, Manager, Receptionist, Service Provider, Accountant.
- ☐ Owner can create/update/deactivate users and assign roles.
- ☐ Owner can configure module/action permissions.
- ☐ Backend procedure guards enforce permissions; frontend hiding is not the only control.
- ☐ Database policies/queries scope records to authorized branch/user where configured.
- ☐ Unauthorized direct API calls return a safe denial and do not mutate data.
- ☐ Customer/financial/settings data access is restricted by permission.
- ☐ Audit log records login, permission changes, critical mutations, refunds/cancellations, and deletions.
- ☐ Cross-browser/device login sees the same authorized account data.

## 3. Dashboard and navigation

- ☐ Dashboard page loads from real transactions, not hardcoded examples.
- ☐ KPI cards: today sales, today collections, monthly revenue, bills, customers, appointments, cancellations, outstanding balances.
- ☐ Date range and branch filters update all dashboard metrics.
- ☐ Best-selling services, product sales, staff performance/commissions, expenses/refunds, low-stock, and payment-method breakdown widgets.
- ☐ Loading, empty, retry, and backend-error states for each widget.
- ☐ Responsive navigation works on mobile, tablet, and desktop.
- ☐ Every sidebar item maps to a functional page; no placeholder-only action cards remain.
- ☐ Breadcrumbs, tabs, modals, drawers, dropdowns, pagination, sorting, and search controls work.
- ☐ `/manus-routes.json` declares all application pages and remains synchronized with routes.

## 4. Services and pricing

- ☐ Services list page with search, category filter, active/inactive filter, sorting, and pagination.
- ☐ Add Service form: name, category, description, price, duration, tax, active/inactive.
- ☐ Required-field, numeric, duration, percentage, duplicate-name, and invalid-price validation.
- ☐ Create service persists to database and appears immediately after refresh.
- ☐ Edit service persists and appears in billing/public booking as allowed.
- ☐ Activate/deactivate service.
- ☐ Safe delete/archive; used services preserve historical invoice snapshots.
- ☐ Service changes are audited.
- ☐ Billing, appointment booking, packages, reports, and public booking read the same catalogue.

## 5. Staff and service providers

- ☐ Provider/staff list with search, filters, status, specialization, and branch.
- ☐ Add provider form: full name, phone, email, role, specialization, joining date, commission type/rate, availability, working hours, active status.
- ☐ Edit/deactivate provider; safe handling for provider used in historical records.
- ☐ Provider appears in appointment assignment and billing provider selection from database.
- ☐ Provider availability and working hours are enforced for appointment conflict checks.
- ☐ Provider login linkage and role permissions where applicable.
- ☐ Attendance check-in/check-out and history.
- ☐ Staff-wise/service-wise earnings and commission reports.
- ☐ Provider changes are audited.

## 6. Customers and CRM

- ☐ Unified customer table with name, phone, email, notes/preferences, branch, and status.
- ☐ Add/edit customer form with validation.
- ☐ Search by name/phone/email; duplicate detection and merge-safe behavior.
- ☐ Customer created from billing, appointment, or public booking appears in the same CRM.
- ☐ Customer detail page: visit history, appointments, invoices, services/products purchased, spend, balance, memberships/packages, loyalty, notes/preferences.
- ☐ Customer access obeys role/branch permissions.
- ☐ Customer records can be exported according to permission.

## 7. Appointments and calendar

- ☐ Create appointment form selects database customer, service, provider, branch, date, time, notes, and status.
- ☐ Daily, weekly, and monthly calendar views.
- ☐ Edit/reschedule/cancel appointment.
- ☐ Status lifecycle: scheduled/booked, confirmed, completed, cancelled.
- ☐ Provider availability and overlapping-booking prevention enforced in backend.
- ☐ Appointment/customer history and contact actions.
- ☐ Completed appointment can flow into billing without re-entering customer/service.
- ☐ Optional WhatsApp reminder integration is either configured and tested or explicitly shown as requiring provider credentials.
- ☐ Appointment changes are audited.

## 8. Billing/POS and invoices

- ☐ Billing screen searches existing customer or creates one inline.
- ☐ Services are selected from the live service catalogue.
- ☐ Each service line supports provider selection, quantity, price snapshot, duration, tax.
- ☐ Products are selected from live inventory with quantity validation.
- ☐ Subtotal, line discounts, overall discounts, tax, payable, paid, and balance calculate accurately in rupees.
- ☐ Configurable payment methods: cash, UPI, card, other.
- ☐ Split payments, advance payments, outstanding balances, and payment allocation.
- ☐ Unique invoice number generated server-side with duplicate prevention/idempotency.
- ☐ Transaction saved atomically with invoice lines, payments, customer history, revenue, commission, and inventory effects.
- ☐ Historical line prices/details remain unchanged after catalogue edits.
- ☐ Completed bills are searchable, viewable, reprintable, and reopen after refresh/re-login.
- ☐ Professional print invoice and PDF include business details, invoice number/date/time, customer, service/product lines, quantities, providers, discount, tax, total, paid, payment methods, and balance.
- ☐ ₹ renders correctly in UI/PDF/print.
- ☐ WhatsApp invoice/payment-summary action works as a deep link; automated API sharing requires configured credentials and successful test.
- ☐ Refund/cancellation workflow reverses payments, inventory, commission/revenue effects correctly and records reason/audit trail.
- ☐ Duplicate submit/retry cannot create duplicate bill or stock deduction.
- ☐ Billing permission checks are enforced server-side.

## 9. Inventory, stock, suppliers, and purchases

- ☐ Product list with name, SKU, category, supplier, purchase cost, selling price, quantity, min stock, expiry, active status.
- ☐ Add Product/Add Stock form validates all required fields and persists.
- ☐ Edit/deactivate/search/filter products.
- ☐ Stock receiving/purchase form records supplier, purchase invoice, cost, quantity, date, and notes.
- ☐ Stock adjustments support increase/decrease with reason and authorization.
- ☐ Stock movement history is immutable/audited and shows before/after quantity.
- ☐ Low-stock and out-of-stock alerts.
- ☐ Billing sale decrements stock exactly once at the configured completion stage.
- ☐ Refund/cancellation reverses the correct stock movement.
- ☐ Supplier list, supplier form, purchase history, and receiving workflow.
- ☐ Product sales and salon usage reporting.
- ☐ Cross-device stock quantity remains consistent.

## 10. Payments, expenses, attendance, commissions, memberships, packages, loyalty

- ☐ Payment records and payment-method breakdown.
- ☐ Expense form, categories, date, amount, payment method, notes, receipt/reference, edit/void with audit.
- ☐ Outstanding balances and reconciliation.
- ☐ Refund records distinct from revenue and collections.
- ☐ Staff attendance check-in/out, correction permission, history, and report.
- ☐ Configurable percentage/fixed commissions; service/provider commission calculation on completed paid/eligible bill.
- ☐ Membership catalogue, customer membership purchase, expiry/status, benefits.
- ☐ Service packages catalogue, package sale, redemption, remaining uses, expiry.
- ☐ Discounts/coupons/offers with eligibility, date limits, redemption history.
- ☐ Loyalty point earn/redeem/adjust with reason and customer ledger.
- ☐ Package sales and redemptions are not double-counted as revenue.
- ☐ All adjustments persist and feed reports/audit history.

## 11. Reports, exports, and analytics

- ☐ Daily/weekly/monthly sales and collections report.
- ☐ Revenue report separates paid amounts, unpaid balances, expenses, refunds, and net revenue.
- ☐ Bills/invoices report with date, branch, customer, provider, payment method, status.
- ☐ Service performance/best sellers report.
- ☐ Product sales, usage, stock valuation, low-stock, and movement reports.
- ☐ Staff attendance, performance, earnings, and commissions reports.
- ☐ Appointment, cancellation, enquiry, feedback, outstanding, advance, expense, and reconciliation reports.
- ☐ Date/branch/provider/status filters.
- ☐ CSV export with correct headers, dates, currency, and permission checks.
- ☐ PDF export/print with correct branding and totals.
- ☐ Reports query real persisted transactions and reconcile against source records.

## 12. Settings and integrations

- ☐ Business profile/settings: name, logo, address, phones, branches, tax, currency, invoice numbering, receipt footer.
- ☐ Working hours, holidays, appointment defaults, payment methods, commission rules.
- ☐ Notification/communication settings.
- ☐ WhatsApp deep-link generation tested; WhatsApp Business/API reminders require provider token, phone number ID, templates, webhook/configuration, and approved sender.
- ☐ Production database connection and migrations configured.
- ☐ No privileged keys exposed in frontend bundle.
- ☐ Backup and recovery procedure documented and tested on a safe copy.
- ☐ Deployment environment variables and hosting/DNS/access requirements documented.

## 13. Required end-to-end acceptance tests

- ☐ Add service → refresh → saved.
- ☐ Edit service → appears in billing with new details.
- ☐ Add provider → selectable in appointments and billing.
- ☐ Add stock item → refresh → quantity remains correct.
- ☐ Receive stock → movement history and quantity update.
- ☐ Create customer → appears in billing and CRM.
- ☐ Create appointment → appears on calendar.
- ☐ Multi-service/product bill → calculations, tax, discount, split/advance/balance correct.
- ☐ Complete sale → invoice, payment, revenue, commission, inventory, customer history correct.
- ☐ Refresh/reopen invoice → record remains available.
- ☐ Refund/cancel → financial, stock, commission, and audit reversals correct.
- ☐ Second authorized browser/device → same records available after login/refresh.
- ☐ Each role → allowed actions work; unauthorized API/UI actions blocked.
- ☐ Invalid entries, duplicate submissions, network/database failures → clear errors, no partial/duplicate writes.
- ☐ Every remaining visible button/form/link across every module → verified action and backend result.
- ☐ Automated checks, typecheck, build, server tests, and deployed smoke tests pass.

## 14. Completion evidence ledger

| Area | Result | Evidence / test date |
|---|---|---|
| Baseline backup | ✅ Complete | Branch/tag/archive created before implementation |
| Public foundation | ◐ Partially verified | Running app returned HTTP 200 for `/`; full browser flow not tested |
| Authentication/permissions | ☐ Not tested | Blocked: no configured repository auth credentials; backend role paths still require full test matrix |
| Dashboard/navigation | ◐ Partially verified | Typecheck/build passed; full visible-control audit not complete |
| Services | ◐ Implemented with searchable selectors | Service UI/router/schema/migration added; appointment, enquiry, client, and billing fields now use type-to-search catalogue inputs; full DB migration test still open |
| Providers/staff | ◐ Implemented with seeded names | Sonu, Ankit, Golu, Shivam, Arti, Greta, Vidhya, Shikha, and Priyanka returned by the running backend; full DB persistence/attendance/commission matrix still open |
| Customers/CRM | ◐ Existing partial flow only | Existing client form/list compiles; unified history not implemented/tested |
| Appointments | ◐ Existing partial flow only | Existing appointment flow compiles; provider availability/conflict flow not implemented/tested |
| Billing/POS | ☐ Not tested | |
| Inventory/purchases | ◐ Implemented with staging fallback | Product add, stock receiving, quantity, and movement ledger are wired; production DB migration and billing stock deduction still open |
| Payments/expenses/attendance/commissions | ◐ Expenses implemented | Product/salary/operating expense form, staff linkage, history, and category totals added; payments/attendance/commission settlement remain open |
| Memberships/packages/loyalty | ☐ Incomplete | Not implemented |
| Reports/exports | ◐ Daily reports implemented | Sales, collections, bills, appointments, expenses, category totals, and net-after-expenses report added; CSV/PDF/report breadth remains open |
| Settings/integrations | ☐ Incomplete | WhatsApp deep links exist; settings/API integrations not fully implemented |
| Cross-device synchronization | ⚠ Blocked | Requires shared production DATABASE_URL and two authorized sessions |
| Deployed version | ⚠ Blocked | Deployment URL/access not provided/configured in this task |

## Remaining external requirements

1. **Production database:** provide/enable a persistent MySQL-compatible `DATABASE_URL` for the deployed environment; local JSON fallback must not be used for business data.
2. **Authentication:** configure strong secrets and decide whether to retain local credentials or connect a real identity provider; individual staff account provisioning is required for full role support.
3. **Business catalogue:** confirm the authoritative service names/prices/tax rules from the existing website/business records before importing.
4. **WhatsApp automation:** API credentials and approved templates are required for automated reminders/messages; browser deep links do not require an API credential.
5. **Deployment:** hosting environment-variable and deployment access are required to verify the production URL and cross-device behavior.

Verified in this pass: the running backend returned all nine supplied provider names, and the new expense/report/service-selector code passed typecheck/build; `pnpm check` passed; `pnpm test -- --reporter=dot` passed (1 test); `pnpm build` passed; running app served `/` and `/manus-routes.json` with HTTP 200; route manifest was present in `dist/public`. The full acceptance suite remains open because the repository has no configured production database, account credentials, or deployed verification target. This file must be updated as features are implemented and only moved from ☐/◐ to ✅ after evidence is recorded above.
