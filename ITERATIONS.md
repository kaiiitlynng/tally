# Tally prototype: design iterations and changes

A record of the major rounds of work on the Tally prototype (Vite + React + TypeScript + Tailwind v4). Tally is an AI time-and-billing review tool for small professional-services firms. It has two roles: the **partner** (Vanessa Hart), who reviews and approves invoices, and the **employee** (Nora Chen), who logs time and answers billing questions.

Every change was checked with `npm run build`, and most were also checked in the browser. Feature behavior was kept intact unless a change was explicitly asked for.

---

## 1. Visual system: stripe-design restyle

**What changed**
- Restyled the whole app to the light `stripe-design` system. Colors, radii, shadows and motion come from tokens in `src/styles/tokens.css`, so components carry no raw values.
- Fonts stayed DM Sans + Doto, by the owner's choice.
- Introduced a semantic type scale (caption 12 / small 13 / body 14 / lead 16 / title-sm 18 / title 22 / title-lg 28 / display 36) with a **12px minimum**. Figma's 6–11px text maps up to it.
- Introduced a semantic radius scale and motion utilities (rise, pop, slide-in, ribbon). All motion respects `prefers-reduced-motion`.
- Changed the accent from violet to **orange** (`#c2410c` brand, `#ea580c` accent).
- Lightened the backgrounds, and made hover and active nav states a pale gray. Orange is kept for selected states and primary actions.
- Replaced the integration icons with real Gmail, QuickBooks and Google Calendar marks.
- Gave project cards cool tints (blue, teal, lavender, sky, seafoam, slate), each with a matching deeper outline.

**Why:** the owner wanted a polished, consistent look, readable type and interaction states, without changing what the product does.
**Who it helps:** everyone. Readable sizes and AA contrast help users with low vision, and tokens keep future design changes cheap.
**Details:** contrast pairs were checked against WCAG AA. Every interactive element has a visible focus ring.

## 2. Navigation and shell

**What changed**
- The partner sidebar's **Billing** group became a workflow: Clients & Projects → Time Entries → Ready for Review → Approved Invoices.
  - It went through several versions: numbered markers, then green checkmarks, then solid dots. It ended as uniform orange dots on one line, with no "current step" emphasis. A step is highlighted only when you're on that page.
- Count badges (unread, to review) use a light purple, so they stand apart from the orange nav.
- Removed the month picker and billing-cycle crumbs from the top bar. The current cycle is implied.
- Removed the profile avatar from the top right. The notification bell exists for **both** roles.
- The Tally logo links to Home. The user block at the bottom of the sidebar links to Settings → Profile.
- Renames:
  - "Approved & Sent" → **Approved Invoices**
  - "Team & Reminders" → **Manage Team**
  - "Team & permissions" → **Team**
  - "Partner / reviewer" → **Partner**
- Removed the uppercase labels above page titles everywhere.

**Why:** the nav should mirror how billing actually flows, and leftover chrome (dead dropdowns, duplicate labels) added noise.
**Who it helps:** partners orient themselves in the monthly cycle at a glance. New users aren't misled by controls that do nothing.

## 3. Billing cycles and history

**What changed**
- Added a read-only archive (`src/data/history.ts`) holding the April and March 2025 cycles and two closed projects.
- **Approved Invoices** lists current invoices first, then "Past cycles" grouped by month, with read-only previews and export.
- Clients & Projects and My Projects have **Current / Past** tabs.
- Every past project has **View entries**. Harlow Foods has a seeded April entry, so that link shows real data.

**Why:** firms need to look back at what was billed without risking edits to closed records.
**Who it helps:** partners answering client questions about earlier invoices, and employees checking past work.

## 4. Ready for Review and the invoice review experience

**What changed**
- Ready for Review went from a table to **compact white cards**. Each card has the project's color outline, the project name and the billing period, and a Review button aligned across cards.
  - Status, amount and question counts were removed.
  - Projects still missing time, and invoices already approved, aren't listed.
- The review panel ("Review with Tally") was rebuilt for non-technical owners:
  - One plain **yes/no question** per flag, e.g. "Did Nora mean 2 hours, not 20?"
  - The entry card ("Nora Chen · Fri, May 16 / 'Emails and follow up'").
  - One sentence explaining why, and a before → after box ("Hours 20 → 2", "Client billed $12,400 → $1,240").
  - Two equal buttons ("Change to 2 hours" / "20 is correct") and a **More options** menu (Edit hours myself, Ask Nora).
  - The wording for every flag type is generated in `flagCopy.ts`: hours typos, vague descriptions, the daily-hours limit, and warnings the employee confirmed.
- Tie-out and the activity log merged into one collapsed **"Tally's reasoning"** section, written as plain sentences about how the invoice was built and why Tally asked.
- Removed the status pill from every invoice document.
- Fixed the accept handler, which had the "2 hours" fix hard-coded. It now applies whatever value the flag suggests.
- Tried and reverted: a fit-to-window layout and zoom / pinch-zoom controls for the invoice. The page is back to scrolling as a whole.

**Why:** the original panel was dense with jargon ("decimal error", "invoice impact") and labels. Owners need to decide quickly and confidently.
**Who it helps:** small-firm owners and managers, who are not billing specialists. Fewer words and clear consequences reduce mistakes on client invoices.

## 5. Time entries (partner) and My Time (employee)

**What changed**
- Both pages are **table-first**. Adding time happens in a shared **Add time** pop-up, with **Upload timesheet** as the primary tab and Enter hours directly as the second.
- One shared table style across every app table (`tableStyles.ts`): sentence-case headers, left alignment, and consistent rows and padding.
- Status pills fit their text. "Flagged" displays as **Needs review**.
  - Employees see "Needs review" only for entries the partner actually asked them about.
- Employee rows have inline **Edit / Delete** buttons instead of a "•••" menu.
- The partner view has an Employee filter.
- **Visible billing-period filter**, like a Notion database view:
  - A "Billing period: May 2025 · Default" chip with a period menu, and × for "All time".
  - Custom dates.
  - "Reset view".
  - A "Show all periods" empty state.
  - Deep links open on the right period: Messages opens the entry's month, and past projects open the month they were last billed.

**Why:** time had been entered and reviewed in several disconnected places, and the hidden May-only scope confused users.
**Who it helps:** employees log time faster with upload first. Partners always know which period they're looking at.

## 6. Messages and notifications

**What changed**
- Two-way conversations between partner and employee:
  - Questions from the review panel go to the employee.
  - Replies come back as notifications, and answers update the flag to "Response received".
  - A **New message** button starts a conversation with anyone on the team.
- Conversations are ordered by latest activity. **Enter sends**. One **Send** button.
- The reply box always stays on screen.
- Linked time entries and project names in a thread **link back** to the right table, with the entry highlighted.
- Unread counts are per person. Only conversations you're in, where the newest message isn't yours, count, and opening one marks it read.
- The notification bell works for both roles, and each person sees only their own notifications.

**Why:** the "ask the employee" loop is central to fixing invoices, and it used to dead-end.
**Who it helps:** employees can answer billing questions in context. Partners see responses without hunting.

## 7. Manage Team and reminders

**What changed**
- Statuses are **derived from data**, all for one period. "Today" is set to June 1, 2025, and May timesheets are due June 3:
  - **Submitted**
  - **Due soon** (within 7 days)
  - **Not submitted**
  - **Overdue · n days**
- Summary cards are colored green, orange and red. Cards with zero people are hidden.
- The header button reads "**Remind 2 people**" (disabled as "Everyone's submitted" when no one is outstanding).
- Table:
  - The table sorts Overdue → Due soon → Submitted.
  - "Reminded May 27" sits under the status pill.
  - After sending, the button becomes "Reminded today" with a confirmation.
  - The partner doesn't appear in their own table.
- Automatic reminders read "1 week before / 1 day before / 1 day after", with clear on/off chips.
- Removed the Reminder activity and Notification channels cards.
- An email prompt appears once while email isn't connected. Dismissing it is remembered.

**Why:** the old data contradicted itself ("April overdue" next to a June due date), and the page mixed logs with actions.
**Who it helps:** partners know exactly who to chase and when, and employees get timely, accurate reminders.

## 8. Home pages

**Partner Home**
- **Upload Excel files** sits next to a **Projects** snapshot: up to 3 projects with this period's hours, "+ New project" and "All projects →".
- Below them are the "Review 2 invoices" and "Remind 2 people to submit" cards. Each has a one-line explanation of what's flagged and who's outstanding.
- Removed: the workflow tracker, "Needs attention" (unmatched imported rows moved to Time Entries) and filler descriptions.

**Employee Home**
- The same two-card layout: **Upload your timesheet** (due date, Enter hours directly, drop zone) and **Messages** (recent conversations with unread markers).
- Removed: "On track" and the assigned-projects list.

**Why:** Home should lead with the next action, not a dashboard of facts.
**Who it helps:** both roles reach their main job (upload time, review, remind, reply) in one click.

## 9. Projects

**What changed**
- Clients & Projects cards were made compact:
  - Each card shows the title, client line and team avatars, then **Status** (Completed / In progress / **Time missing**, with a warning icon) and Time due.
  - Buttons are fixed width.
  - Type and Reviewer were removed.
- Projects still missing time **can't be reviewed**. The card offers "Remind Ryan" instead, and the review address redirects.
- The employee's **My Projects** cards match the partner's design.
- The **New project** flow gained:
  - Choice of assigned employees.
  - "Other…" with free text for category and billing frequency.
  - Custom invoice template upload.
  - Per-person **custom project rates**, which apply to time logged on that project.

**Why:** a project's state should be obvious, and invoices built on incomplete time shouldn't reach review.
**Who it helps:** partners avoid approving incomplete invoices, and firms with non-standard engagements can set them up correctly.

## 10. Settings

**What changed**
- Both roles share one Settings layout (section tabs on the left, the open section on the right, the section kept in the URL).
- **Profile** (both roles):
  - Photo, name and email each have their own **pen** button for editing in place.
  - Role, access and rate are read-only.
  - Edits show in the sidebar and greeting.
- **Notifications**, split into **In-app** and **Email**:
  - "Email me notifications" goes to the account's own email and works for everyone with no integration needed. For employees it's the only email option.
  - The partner's "Send team reminders by email" stays faded until **Gmail** is connected, with a link to Integrations.
- **Integrations:** Gmail connect is simulated, and all buttons use the consistent "Not connected" / "Connected" wording.
- **Team:** add or remove members, with confirmation.
- **Billing rules:** "Schedule 2026 rates" is moved left, and the "Optional override" column is removed.
- Removed "Review retention settings", which had no flow behind it.
- Employee **Time entry defaults** (default project and billing treatment) pre-fill new entries.

**Why:** settings had to be consistent between roles, honest about what's connected, and editable without friction.
**Who it helps:** admins managing the team and integrations, and every user managing their own profile and notifications.

## 11. Copy reduction pass

**What changed**
- Removed 33 strings and rewrote 67 across about 33 files:
  - Taglines under headings that restated the heading.
  - Filler labels.
  - All-caps labels.
  - AI and system jargon ("flag", "invoice impact", "materially overstate").
  - Instructions for obvious UI.
- Buttons now describe their result, and actions use first names ("Ask Nora").

**Why:** the audience is non-technical firm owners, and every extra word slowed decisions.
**Who it helps:** all users, especially first-time ones. Clearer screens make it faster to act.

---

## Things tried and reverted

- **Nora ↔ Maya employee swap:** made the employee view Maya and swapped all demo data, then reverted. Nora is the employee again. The per-person unread fix from that round was kept.
- **Invoice review layout:** the fit-to-window layout, the zoom controls and pinch-zoom were all reverted.
- **Settings:** the personal in-app notification switch was replaced by email notifications.
- **Sidebar steps:** "current step" emphasis was removed in favor of uniform dots.

## Where to look

- **Tokens:** `src/styles/tokens.css`
- **Shared table and card styles:** `src/components/tableStyles.ts`, `src/components/projectCardStyles.ts`
- **Data model:** `src/data/store.ts`, `src/data/history.ts`, `src/data/workflow.ts`
- **Review panel wording:** `src/sections/review/flagCopy.ts`
- **Section-by-section change log:** `CLAUDE.md`, the section map rows dated 2026-11-09 and 2026-11-10
