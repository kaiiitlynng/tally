# antislop audit 001: follow-up (2026-11-09)

Approved: 2, 3, 4, 5, 7, 8, 9, 10, 11, 15, 16 (drop "Your next step" only), 17, 19.
Kept with a written reason: 13, 14, 18.
Not touched: 1, 6, 12, 20, 21, 22.

## Fixed

| # | Change | Where | Verified in Chrome |
|---|---|---|---|
| 2 | Unread badge moved from `#ff7b31` to the clay accent `#9a572f`; white text now 5.56:1 (was 2.58:1) | `components/Sidebar.tsx` | Badge background rgb(154, 87, 47) |
| 3 | "Submitted — 9.7 hours" → "Submitted: 9.7 hours" (also the Draft variant) | `data/progress.ts` | Drawer shows the new text; no em dashes left in UI strings |
| 4 | Base rule: pointer cursor on every enabled control, `not-allowed` on disabled ones | `index.css` | Header and nav controls report `cursor: pointer` |
| 5 | Fonts self-hosted with `@fontsource-variable/dm-sans` and `@fontsource/doto` (2 new deps); Google Fonts links removed | `index.html`, `main.tsx`, `tokens.css` | Both fonts load; no googleapis requests |
| 7 | Hero "timesheet missing" / "ready for billing", Needs attention rows, table completeness, Employee "days left" and "On track", Team last-submission dates now come from the data | `store.ts`, `NextStepHero`, `NeedsAttention`, `InvoiceTable`, `EmployeeHome`, `TeamTable` | Starts at 02/01/02 as in Figma; "2 review questions" disappears once flags are resolved; Nora's date becomes May 30 after she submits |
| 8 | Dropping a non-Excel file shows an error and imports nothing | `sections/time/ImportDropzone.tsx` | report.pdf → error; Nora_May.xlsx → "Reading columns…" |
| 9 | Headings re-leveled (project cards, invoice client name, parsing state, My Projects empty state) | 4 files | No skipped levels on any page, either role |
| 10 | Visible "Search" label in the entry search box, with a focus ring on the box | `EntriesToolbar.tsx` | Label visible |
| 11 | Arrow / Home / End keys on all three tab lists (roving tabindex); field focus outlines now solid | `components/tabKeys.ts` + 3 pages; `Field.tsx` and 4 other files | Right and Left both move focus and switch tabs |
| 15 | Sparkle icon removed from "View how Tally worked" and "Review with Tally"; assets deleted | `NeedsAttention.tsx`, `ReviewPanel.tsx` | |
| 16 | "Your next step" pill removed (it repeated the card's purpose); "Due June 3" and "5 columns detected" kept | `NextStepHero.tsx` | |
| 17 | Decorative green dot removed from "Interactive prototype" | `Sidebar.tsx` | |
| 19 | Arrow removed from "Continue" and "Create project"; arrows remain only on controls that navigate to another page | `NewProjectModal.tsx` | |

**Needs your approval:** item 8's error text is my draft, as it appears in neither Figma nor the prototype source:
> "“report.pdf” isn’t an Excel file. Drop a .xlsx or .xls timesheet, or select the demo file."

## Kept, reason written in code

- **13 (blur):** kept on the header and sidebar only, the two fixed surfaces that content scrolls under. Dialog backdrops blur to push the page back. See `tokens.css`.
- **14 (page glow):** the brand's single warm light, fixed to one corner, tying the cream background to the clay accent. See `tokens.css`.
- **18 (uppercase labels, Doto):** eyebrows name the billing context the heading doesn't repeat (`PageTitle.tsx`). Doto is used only for counts, as Tally's identity motif (`tokens.css`).

## Footer landmark (#9)

Recorded as an exception: the app shell has `header`, `nav` and `main`. The design has no footer content, and adding an empty one would add nothing.

## Delivery Gate

### Hard Gate

| Rule | Result | Evidence |
|---|---|---|
| R-02 | PASS | No em dashes in UI strings (code comments excluded) |
| R-03 | **FAIL, your decision** | Desktop only (#12), chosen 2026-11-09 |
| R-17 / R-36 / R-38 | PASS | Every displayed number now comes from the demo data; data labeled synthetic |
| R-18, R-28 | PASS | No testimonials, no FAQ |
| R-23 | PASS | Logo drawn from the Figma shapes; avatars are initials |
| R-24 | PASS | Every nav item goes to a real page |
| R-25 | **FAIL, needs your call** | #1: 16 text colors still below 4.5:1 |
| R-26 | **FAIL, not approved** | #6: 13 controls still do nothing |
| R-27 | PASS | Empty states exist; import has loading (parsing) and error states; no other data is fetched |
| R-32 | PASS | Tab / Enter / Esc everywhere; arrow keys on tabs; visible focus |
| R-33 | PASS | No patch scripts; all edits are in source |
| R-34 | n/a | No theme toggle |
| R-35 | PASS | Built and type-checked; click-through above and in earlier sessions; no console errors |
| R-37 | PASS | The Figma file is the direction |
| R-39 | PASS | Pointer cursor, named controls, visible labels, heading order, `lang` and `title` set; footer exception recorded |
| R-40 | PASS | Fonts self-hosted; every image has width and height; no hero image; no performance numbers claimed (not measured) |

### Purpose-Gate
R-01, R-06, R-10: kept with written reasons. R-04, R-08, R-09: fixed. R-12, R-13, R-14, R-19, R-22: pass.

### Liveliness
**FAIL**: dials and a Design Read are not written down (#20, not approved). The Figma design supplies the focal point, the clay accent and the Doto identity motif.

### Craftsmanship
C-2 still fails because of #6. R-29 (#21) and R-21 (#22) are open and not approved.

**Status:** not a clean gate. Three items need your decision: #1 (contrast), #6 (inert controls) and #20 (dials).
