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
| Shell: sidebar / header | 36:289 / 36:12 | src/components/Sidebar.tsx, Header.tsx, AppShell.tsx |
| Home | 36:7 | src/pages/PartnerHome.tsx + src/sections/home/* |
| Clients & Projects | 36:711 | src/pages/ClientsProjects.tsx + src/sections/clients/ProjectCard.tsx |
| Time Entries: enter hours (36:2545, 36:5305 identical) | 36:1257 | src/pages/TimeEntries.tsx + src/sections/time/TimeEntryForm.tsx |
| Time Entries: import drop zone (36:3221 identical) | 36:1933 | src/sections/time/ImportDropzone.tsx (+ ParsingState.tsx, code layer) |
| Time Entries: column mapping (36:4569 identical) | 36:3833 | src/sections/time/ColumnMapping.tsx |
| Time Entries: all submitted time | 36:1365 | src/sections/time/SubmittedTimeTable.tsx |
| Ready for Review (was Review Invoices): list | 36:5983 | src/pages/ReviewInvoices.tsx + src/components/InvoiceTable.tsx |
| Review Invoices: invoice review detail | 36:6409 | src/pages/InvoiceReview.tsx + src/sections/review/* |
| Approved & Sent (was Invoices) | 36:7115 | src/pages/Invoices.tsx |
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

Shared: sidebar (e.g. 36:289), header (e.g. 36:12).

## Stack
- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- No UI component libraries unless asked. Build components by hand to match the design.
- Animation: CSS transitions first; use Framer Motion only if the design calls for something CSS can't do.

## Commands
- `npm run dev`: dev server (http://localhost:5173)
- `npm run build`: production build (must pass before a task is done)
- `npx tsc --noEmit`: type check

## Project structure
```
src/
  styles/tokens.css     # design tokens (@theme). The only place raw values live
  components/           # shared pieces: Button, Nav, Footer, SectionHeading...
  sections/             # one file per page section: Hero.tsx, Features.tsx...
  App.tsx               # composes sections in page order
public/assets/          # images, icons, logos exported from Figma
reference/              # screenshots of Figma frames, for visual comparison
```

## Figma MCP workflow
Follow this order for every section:

0. **Map the frame once.** At the start of the project, call `get_metadata` with node ID `37:15126` to get its layer tree, then fill in the Section map above.
1. **Read before writing.** Call `get_code` (or `get_design_context`) on one section's node ID from the Section map. Don't call it on the whole page. If the response is large, go down to child nodes.
2. **Get variables.** Call `get_variable_defs` to pull Figma variables and styles. Map them into `src/styles/tokens.css` before building components.
3. **Get a screenshot.** Call `get_screenshot` for the node and save it to `reference/<section>.png`. This is what "done" looks like.
4. **Export assets.** Save images and SVGs that the MCP returns into `public/assets/` with descriptive kebab-case names (`hero-illustration.svg`, not `image-12.svg`). Use the asset URLs the MCP returns. Don't make up placeholder images or install icon packages to stand in for real assets.
5. **Translate, don't paste.** MCP output is a reference, not final code. Rewrite it into our stack:
   - Replace hardcoded hex values, pixel sizes, and font names with tokens.
   - Replace absolute positioning with flex/grid layouts unless the design really overlaps elements.
   - Reuse existing components in `src/components/` before creating new ones.
6. **Build one section at a time.** Finish, verify, then move to the next. Don't scaffold the whole page in one pass.

## Design tokens
- All colors, font families, font sizes, line heights, letter spacing, radii, shadows, and spacing that recur go in `tokens.css` under `@theme`, named after the Figma variable (e.g. Figma `color/primary/500` → `--color-primary-500`).
- Components use only Tailwind classes backed by tokens. No arbitrary values like `text-[#3A2F1B]` or `mt-[37px]`, except for one-off values that truly appear once. Leave a comment saying so.
- Fonts: load via `@fontsource/*` packages or `<link>` in `index.html`, matching the exact families and weights in Figma.

## Responsive behavior
- Build mobile-first. Base styles match the mobile frame; `md:` / `lg:` match the desktop frame.
- Target widths: 390px (mobile), 768px (tablet), 1440px (desktop). Nothing should break between them.
- If there's no tablet frame, interpolate sensibly and note what you chose.

## Fidelity rules
- Match the Figma frame closely: spacing, type scale, colors, alignment, image crops.
- Text content comes from Figma exactly as written. Don't rewrite copy.
- Hover/focus/active states: use Figma's interactive variants if they exist; otherwise add subtle, consistent states and say so.
- Animations and interactions in the Figma prototype (e.g. smart animate, scroll effects) should be listed and implemented. Ask if something is unclear.

## Verification (required before saying a section is done)
1. `npm run build` and `npx tsc --noEmit` pass with no errors.
2. If Playwright MCP is available: screenshot the section at 390px and 1440px and compare against `reference/<section>.png`. Fix visible differences in spacing, sizing, color, and alignment. Repeat until it matches closely (max 3 rounds, then report what's left).
3. Check: no console errors, images have `alt` text, interactive elements are real `<button>`/`<a>` tags and reachable by keyboard.

## Accessibility & quality
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`; one `<h1>` per page; heading levels in order.
- Color contrast must meet WCAG AA. If the design fails, flag it rather than silently changing colors.
- Images: `loading="lazy"` below the fold, explicit `width`/`height` to prevent layout shift.

## Don'ts
- Don't install new dependencies without saying why.
- Don't change tokens to make one component look right. Fix the component.
- Don't leave TODOs or placeholder content without listing them in your summary.
- Don't read the entire Figma file at once; it blows the context window. Work node by node.
- Don't touch any Figma node outside `37:15126`.

## When reporting back
Summarize per section: what was built, what deviates from Figma and why, and any open questions.
