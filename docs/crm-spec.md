## CRM Functional Specification — Agent Dashboard (Single-User)

Version: 0.2 (Draft)
Date: 2025-08-12
Owner: Platform

### 1) Overview
- **Goal**: Provide a lightweight, fast, and privacy-safe CRM for an individual agent to manage inbound inquiries ("leads"), track pipeline stages, add notes, and view basic analytics.
- **Current state**: Lead capture via `POST /api/agents/[slug]/contact` with email notifications; dashboard list view at `agent/dashboard/leads`; server actions for stage update and notes. Prisma schema includes `Lead` and `LeadNote` with basic indexes.
- **Out of scope**: Team roles/multi-user assignment, omni-channel inbox, advanced automations, attachments, external integrations beyond email/WhatsApp links.

### 2) Persona and Use Cases
- **Agent (single user)**: Manages inbound leads from website and properties; needs quick triage, status changes, and notes.
- **Admin (platform)**: KPIs, moderation, anti-spam.

### 3) Data Model (as-is and planned)
- **Lead (as-is)**
  - id, agentId, timestamp, type (e.g., "contact"), source (e.g., "contact-form", "property"), propertyId?, metadata (JSON string), stage ('new'|'contacted'|'qualified'|'won'|'lost')
  - Indexes: (agentId, timestamp), (agentId, type)
- **LeadNote (as-is)**
  - id, leadId, userId, text, createdAt; FKs with ON DELETE CASCADE; index (leadId, createdAt)
- **Planned denormalized fields (Phase 2, optional)**
  - Lead.name, Lead.email, Lead.phone (copied from `metadata` on create, backfilled)
  - Lead.wonValue (numeric), Lead.lostReason (text)
  - Indexes: (agentId, stage), (agentId, email), (agentId, phone)

### 4) Sources and Capture Points
- **Sources**: 'contact-form' (default), 'property', 'manual', 'import', 'whatsapp', 'phone-log', 'other'.
- **Capture**
  - Public API: `POST /api/agents/[slug]/contact` (existing)
  - Manual add (future)
  - CSV import with validation and dry-run (future)

### 5) Pipeline and Stages
- **Stages**: 'new' → 'contacted' → 'qualified' → ('won' | 'lost')
- **Rules**
  - 'won' and 'lost' are terminal; can be re-opened to 'qualified' (optional justification later)
  - 'won' may capture `wonValue` (optional)
  - 'lost' may capture `lostReason` (optional)

### 6) Notes and Activity
- **Notes**: `LeadNote` creation via server action; shown in timeline.
- **Activity log (future)**: Stage changes and source displayed chronologically.

### 7) Views and UX
- **List View (as-is + Phase 1)**: Search (`metadata`), filter by `source`, `stage`, and date range; table with name/email/phone/subject/received; inline stage change; add note.
- **Detail View (Phase 1)**: Lead header (name/email/phone), stage selector, source and property link, notes timeline, quick actions (copy email/phone, WhatsApp link).
- **Bulk actions (Phase 1)**: Stage change, soft delete (planned), export CSV (entitlement based).

### 8) Anti-Spam
- Rate limit by IP and user-agent on public contact endpoint.
- Honeypot field and content heuristics; optional CAPTCHA.
- Idempotency window (e.g., 5 minutes) using hash(name,email,message,agent).
- Email send failures do not block lead creation.

### 9) Permissions and Security
- All mutations require authenticated session and agent ownership checks.
- Strict single-user model; no assignment or team roles.
- Optional audit logging in future.

### 10) Analytics and KPIs
- Phase 1: Counts by stage, counts by source, 7/30-day new leads trend.
- Phase 2: Conversion rate by source, time-to-first-contact (via notes proxy), win rate, average won value.

### 11) Subscription Entitlements (proposed)
- Starter: Basic CRM (list, stage, notes). Export disabled.
- Growth: Starter + export CSV, stage analytics.
- Pro: Growth + automations (future), custom fields (future).

### 12) API/Server Actions (as-is and planned)
- As-is (in `src/app/actions.ts`)
  - `updateLeadStage(leadId, stage)`
  - `addLeadNote(leadId, text)`
- Planned (Phase 1)
  - `bulkUpdateLeads({ ids: string[], stage? })`
  - `softDeleteLeads({ ids: string[] })` (add `deletedAt`)
  - `getLeadDetail(leadId)` returns lead + notes
  - `exportLeadsCSV(filters)` (growth+)
- Planned (Phase 2)
  - `createLead(manualPayload)`; `importLeads(file)`
  - `setLeadWonValue(leadId, amount)`; `setLeadLostReason(leadId, reason)`

### 13) Query and Performance Considerations
- Include `stage` in list select; no assignment fields.
- Consider denormalized columns for search.
- Proper indexes; DB pagination.

### 14) Edge Cases and Error Handling
- Inbound capture: missing required → 400; unknown propertySlug (owned by other) → ignore linkage; email failures → log; rate limit → 429; dedupe window → return success pointing to existing.
- Listing/filtering: invalid page clamped; end < start handled; store UTC, render local TZ.
- Stage changes: invalid value → 400; transitions back from terminal allowed; won without value allowed.
- Notes: empty → ignore; very long → 413 or trim.
- Bulk: partial success report; id count limit.
- Export: respects filters, apply plan limits; stream large results.
- Deletion: soft delete by default.
- Concurrency: last-writer-wins for stage/notes.

### 15) Migrations (Phase 1/2 roadmap)
- Phase 1: Add `Lead.deletedAt TIMESTAMP NULL`; exclude in queries.
- Phase 2: Add `Lead.name`, `Lead.email`, `Lead.phone`; backfill. Add `wonValue`, `lostReason`. Index `(agentId, stage)`, `(agentId, email)`, `(agentId, phone)`.

### 16) UI Changes Summary (Phase 1)
- Leads list: add Stage filter; keep Source, Search, Date range; inline stage and notes; no assignment controls.
- Lead detail: header, fields, notes timeline, quick actions.
- Bulk toolbar: stage change, export (if plan allows), soft delete.

### 17) Rollout Plan
- Feature flag: `crm.v1` for new filters and detail view.
- Progressive enhancement; keep current features during rollout.
- QA: creation, filters, stage/note, anti-spam, email ack, export (growth+), access control.

### 18) Acceptance Criteria (Phase 1)
- Agent can: view paginated leads, filter by stage/source/date/search, change stage, add notes.
- Anti-spam: basic rate limiting/honeypot on contact endpoint.
- List API returns `stage` without client casts.
- Detail view shows notes timeline and quick actions.

### 19) Open Questions
- Do we introduce a simple "Contact" consolidation in Phase 2?
- Should 'won' capture `wonValue` now or later?



