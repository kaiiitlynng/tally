# CLAUDE.md

## Project
Recreate the Tally website (Ramp Hackathon) from its Figma design as a production-quality, responsive site.
Source of truth: the Figma file, read through the Figma MCP server. Don't guess at a value you can read from Figma.

**Visual style override (2026-11-09):** the owner restyled the app to the light variant of `stripe-design/` (see `stripe-design/SKILL.md` and its screenshot). Layout, structure, copy and behavior still come from Figma and the code layer; **colors, radii, shadows and tag/nav styling come from stripe-design** via `src/styles/tokens.css`. Fonts stay DM Sans + Doto (owner's choice; the bundled Söhne files are not used). `reference/*.png` screenshots now differ in color on purpose.
Second pass (2026-11-09): type and radius tokens are now **semantic**, not Figma-px. Type: `text-caption` 12 / `small` 13 / `body` 14 / `lead` 16 / `title-sm` 18 / `title` 22 / `title-lg` 28 / `display` 36 (12px floor for accessibility; Figma's 6–11px copy maps up). Radii: `rounded-xs` 4 / `sm` 6 (buttons, inputs, nav) / `md` 8 / `lg` 12 (cards) / `xl` 16 (modals, hero) / `pill`. Motion utilities in tokens.css: `stagger`, `card-lift`, `animate-rise|pop|slide-in|toast|grow|ribbon`, `ribbon` / `ribbon-rim` gradients. `<Icon tint>` renders an icon as a currentColor mask.

Figma file: Tally - Ramp Hackathon
- File key: `eWPRE9opW6vilWvEk4bOZB`
- File URL: https://www.figma.com/design/eWPRE9opW6vilWvEk4bOZB/Tally---Ramp-Hackathon

### Frame scope (strict)
Only work with this frame and its children:

| Frame | Node ID (MCP format) | Link |
|---|---|---|
| Main frame | `37:15126` | https://www.figma.com/design/eWPRE9opW6vilWvEk4bOZB/Tally---Ramp-Hackathon?node-id=37-15126 |

Rules:
- Every Figma MCP call must target `37:15126` or a descendant of it. Pass the node ID explicitly. Never call a tool without a node ID, which would fall back to whatever is selected in Figma.
- URLs use `37-15126`; MCP tools use `37:15126`. Convert hyphen to colon when calling tools.
- Don't read, list, or export anything from other pages or frames in this file, even if they look related (other screens, older versions, component library pages). If something you need seems to live outside this frame (e.g. a component's main definition), stop and ask before reading it.
- To work on a smaller piece, first call `get_metadata` on `37:15126` to get the child node IDs, then call tools on those child IDs. Record the section → node ID mapping in the table below as you discover it.

### Section map (fill in as you go)
Frame `37:15126` ("V3") is a desktop web-app prototype (1280px wide, no mobile frames): 30 screens, each = main "Shell" (header + content) + 225px sidebar "Shell". Plus `36:3`, a code-instance copy of the prototype.

**Partner view (Vanessa Hart)** — built
| Screen / state | Node ID | Component file |
|---|---|---|
| Shell: sidebar / header | 36:289 / 36:12 | src/components/Sidebar.tsx, Header.tsx, AppShell.tsx. Partner Billing nav is a stepper rendered from `src/data/workflow.ts` |
| Home | 36:7 | src/pages/PartnerHome.tsx + src/sections/home/* (owner-requested: StartActions import + New Project first, then NextStepHero; the Figma workflow tracker is removed from Home and lives on as the sidebar stepper) |
| Clients & Projects | 36:711 | src/pages/ClientsProjects.tsx + src/sections/clients/ProjectCard.tsx (Current / Past Projects tabs via src/components/SegmentedTabs.tsx) |
| Time Entries: enter hours (36:2545, 36:5305 identical) | 36:1257 | src/pages/TimeEntries.tsx + src/sections/time/TimeEntryForm.tsx |
| Time Entries: import drop zone (36:3221 identical) | 36:1933 | src/sections/time/ImportDropzone.tsx (+ ParsingState.tsx, code layer) |
| Time Entries: column mapping (36:4569 identical) | 36:3833 | src/sections/time/ColumnMapping.tsx |
| Time Entries: all submitted time | 36:1365 | src/sections/time/EntriesSection.tsx (partner: the table is the page; "Enter hours" opens an "Add time" dialog with the enter/import tabs, 2026-11-10; Home links open it via `?add=enter` / `?mode=import`; partner filter adds Employee) |
| Ready for Review (was Review Invoices): list | 36:5983 | src/pages/ReviewInvoices.tsx + src/components/InvoiceTable.tsx |
| Review Invoices: invoice review detail | 36:6409 | src/pages/InvoiceReview.tsx + src/sections/review/* |
| Approved & Sent (was Invoices) | 36:7115 | src/pages/Invoices.tsx (current cycle first, then "Past cycles" month groups from src/data/history.ts; `?invoice=<id>` deep link) |
| Messages (empty; threads from code layer) | 36:7405 | src/pages/Messages.tsx |
| Team & Reminders (36:9120 same layout) | 36:7718 | src/pages/TeamReminders.tsx + src/sections/team/* |
| Team & Reminders: Request time now modal | 36:8726 | src/components/Modal.tsx (used in TeamReminders.tsx) |
| Settings: Billing rules / Team & permissions / Integrations / Data & privacy | 36:9778, 36:10273, 36:10647, 36:11056 | src/pages/Settings.tsx |

Behaviour/copy for states with no frame (flags 2+, approval, modals, invoice library, message threads, AI preferences tab) comes from the prototype code layer `36:3` (src/App.tsx, src/v2.css), which is inside this frame. Data model: src/data/store.ts.

**Employee view (Nora Chen)** — built
| Screen / state | Node ID | Component file |
|---|---|---|
| Home (36:14728 identical) | 36:11419 | src/pages/EmployeeHome.tsx |
| My Projects: current (36:12414, 36:14408 identical) / past | 36:11817 / 36:12137 | src/pages/MyProjects.tsx + src/sections/employee/ProjectDrawer.tsx (drawer from code layer) |
| My Time (enter / import / form) | 36:12734, 36:13228, 36:13657 | src/pages/TimeEntries.tsx (shared, role-aware) + src/sections/time/* |
| Messages | 36:14151 | src/pages/Messages.tsx (shared, role-aware) |
| Employee sidebar | 36:11564 | src/components/Sidebar.tsx |

Added from the code layer (no frames): New Project 3-step modal (src/sections/clients/NewProjectModal.tsx), entry filters/sort/search + chips (src/sections/time/EntriesToolbar.tsx), entry validation & soft warnings (src/data/store.ts), employee row menu Edit/Delete + locked-invoice dialog (src/sections/time/EntryDialogs.tsx), month picker (src/components/MonthPicker.tsx), employee correction reply in Messages.

**Spec v2 features (no frames; built from the written spec, 2026-11-09)**
| Feature | Component file |
|---|---|
| Inline edit / no charge / delete on invoice lines, adjustments line, "Edited by" marker, line source | src/sections/review/InvoiceDocument.tsx |
| Tie-out card | src/sections/review/TieOutCard.tsx |
| Daily-hours flags (derived from threshold), Keep as is / Edit hours / Ask employee | src/data/store.ts `dailyFlags`, src/pages/InvoiceReview.tsx |
| Send to client email preview, Approved & Sent page | src/sections/review/SendInvoiceModal.tsx, src/pages/Invoices.tsx |
| Notification bell + "invoices ready" trigger | src/components/NotificationBell.tsx, src/sections/team/SubmissionStats.tsx |
| Unrecognized case flow (import rows, held rows, Needs attention actions) | src/sections/time/ColumnMapping.tsx, src/sections/home/HeldRowItem.tsx |
| Threshold presets, 2026 rate schedule | src/pages/Settings.tsx, src/sections/settings/ScheduleRatesDrawer.tsx |
| Custom time request + reminder chips | src/sections/team/RequestTimeModal.tsx |
| AI processing card (clear working data) | src/pages/Settings.tsx `AiProcessingCard` |
| Sortable entry columns (default date, then last name) | src/sections/time/EntriesSection.tsx |
| Billing cycles (2026-11-10): no month UI in the top bar (current cycle implied; MonthPicker removed); read-only archive of closed cycles (April/March 2025) and 2 closed projects; past invoices and projects viewable. New copy: "Past cycles", "Last billed …", "View invoice". | src/data/history.ts, src/pages/Invoices.tsx, src/pages/ClientsProjects.tsx, src/pages/MyProjects.tsx, `InvoicePaper` / `ArchivedInvoiceDocument` in src/sections/review/InvoiceDocument.tsx |
| Owner pass (2026-11-10): no uppercase eyebrows above any heading; renames "Approved Invoices", "Manage Team", Settings "Team", role "Partner"; sidebar steps are solid dots (no "Step N of 4"), counts use `--color-notify`; all app tables left-aligned; cool project tints; Settings → Team add/remove members (`store.team`); flagged entry e2 moved to Nora so review questions reach the employee view; two-way Messages with partner notification on reply; review panel rebuilt for decisions (progress, invoice line, before → after, reply, collapsed tie-out). New copy: "Not yet", "Add team member", "Remove …?", "Reply to …", "Submit as corrected description", "Question N of M", "Up next", "N of 3 checks pass", "Nora replied: …". | src/components/StepMarker.tsx, Sidebar.tsx, src/pages/Settings.tsx, src/pages/Messages.tsx, src/sections/review/ReviewPanel.tsx, TieOutCard.tsx, src/data/store.ts |
