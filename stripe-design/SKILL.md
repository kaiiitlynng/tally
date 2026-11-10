---
name: stripe-design
description: Design system skill for stripe. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# stripe Design System

You are building UI for **stripe**. Light-themed, cool palette, sans-serif typography (SourceCodePro), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![stripe Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — SourceCodePro for body/UI text, sohne-var for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **cool palette** — the color temperature runs cool, matching the sans-serif typography.
- **Restrained accent** — `#9966ff` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#f5f5ff` | Page/app background |
| Surface | `--surface` | `#e8e9ff` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#0d253d` | Headings, body text |
| Text Muted | `--text-muted` | `#3c4f69` | Captions, placeholders |
| Accent | `--accent` | `#9966ff` | CTAs, links, focus rings |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Warning | `#ffd552` | Caution states, pending items |

### Extended Palette

- **hds-color-core-brand-600:** `#533afd` — Core brand color
- **hds-color-core-brand-900:** `#1c1e54` — Core brand color
- **hds-color-core-brand-500:** `#665efd` — Core brand color
- **hds-color-core-neutral-990:** `#061b31` — Deep background layer or shadow color
- **hds-color-core-neutralDark-700:** `#273f73`
- **hds-color-accentColorMode-magenta-icon-gradientStart:** `#f98bf9` — Gradient stop for decorative background or accent
- **hds-color-input-bg-focus:** `#000000` — Deep background layer or shadow color
- **badgeTextColor:** `#0073e6`

### CSS Variable Tokens

```css
--hds-space-customerCard-logo-height: 60px;
--hds-space-input-popover-width: 240px;
--hds-space-customerCard-logo-height: 40px;
--hds-space-input-popover-width: 240px;
--hds-space-customerCard-logo-height: 60px;
--hds-space-input-popover-width: 240px;
--hds-space-button-border: 1px;
--hds-space-core-border-sm: 1px;
--hds-space-core-border-md: 1.25px;
--hds-space-core-border-lg: 2px;
--hds-space-core-border-none: 0px;
--hds-space-input-border-default: 1px;
--hds-color-accent-border-quiet: var(--hds-color-action-border-quiet);
--hds-color-accent-border-solid: var(--hds-color-action-bg-solid);
--hds-color-accent-charm-bg: var(--hds-color-action-bg-solid);
--hds-color-accent-icon-solid: var(--hds-color-action-icon-solid);
--hds-color-accent-surface-solid: var(--hds-color-action-bg-solid);
--hds-color-accent-surface-subdued: var(--hds-color-action-bg-subdued);
--hds-color-accent-text-solid: var(--hds-color-action-bg-solid);
--hds-color-accentColorMode-default-icon-gradientEnd: var(--hds-color-core-brand-700);
```

## Typography

### Font Stack

- **SourceCodePro** — Heading 1, Heading 2, Heading 3
- **sohne-var** — Body, Caption
- **SFMono-Regular** — Code

### Font Sources

```css
@font-face {
  font-family: "sohne-var";
  src: url("fonts/sohne-var-1.woff2") format("woff2");
  font-weight: 1;
}
@font-face {
  font-family: "SourceCodePro";
  src: url("fonts/SourceCodePro-500.woff2") format("woff2");
  font-weight: 500;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | SourceCodePro | 110px | 700 |
| Heading 2 | SourceCodePro | 63px | 700 |
| Heading 3 | SourceCodePro | 62px | 700 |
| Body | sohne-var | 12px | 400 |
| Caption | sohne-var | 10px | 400 |
| Code | SFMono-Regular | 14px | 400 |

### Typography Rules

- Body/UI: **SourceCodePro**, Headings: **sohne-var** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `1px, 1rem, 1.5px, 2px, 3px, 4px, 4.51px, 5px, 6px, 8px, 16.5px, 20px, inherit, 10px, 12px, 16px, 28px, 30px, 32px, 38px, 60px, 99px, 100px, 100%, 114px, 999px`
Default: `10px`

### Container

Max-width: `1263px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 350px |
| xs | 375px |
| xs | 400px |
| xs | 480px |
| sm | 599px |
| sm | 600px |
| sm | 639px |
| sm | 639.9999px |
| sm | 640px |
| md | 706px |
| md | 749px |
| md | 750px |
| md | 767px |
| lg | 840px |
| lg | 899px |
| lg | 900px |
| lg | 901px |
| lg | 939px |
| lg | 939.9999px |
| lg | 940px |
| lg | 970px |
| lg | 990px |
| lg | 1000px |
| lg | 1019px |
| lg | 1020px |
| lg | 1023px |
| lg | 1024px |
| xl | 1051px |
| xl | 1069px |
| xl | 1111px |
| xl | 1112px |
| xl | 1115px |
| xl | 1199px |
| xl | 1200px |
| xl | 1263px |
| xl | 1264px |
| 2xl | 1295px |
| 2xl | 1299px |
| 2xl | 1300px |
| 2xl | 1600px |
| 2xl | 1609px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #e8e9ff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: var(--hds-shadow-xs);
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #9966ff;
  color: #0d253d;
  border-radius: 10px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #cccccc;
  color: #0d253d;
  border-radius: 10px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #f5f5ff;
  border: 1px solid #cccccc;
  border-radius: 10px;
  padding: 8px 12px;
  color: #0d253d;
  font-size: 14px;
}
.input:focus { border-color: #9966ff; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #e8e9ff;
  color: #3c4f69;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #e8e9ff;
  border-radius: 999px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 6px 12px -2px rgba(50,50,93,.08),0 3px 7px -3px rgba(0,0,0,.04);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #3c4f69;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #cccccc;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #cccccc;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}
.nav-link {
  color: #3c4f69;
  padding: 8px 12px;
  border-radius: 10px;
  transition: color 150ms;
}
.nav-link:hover { color: #0d253d; }
.nav-link.active { color: #9966ff; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**Button** (`html`)

**Card** (`html`)
- Variants: `grid`, `-startups`, `action`, `-atlas`, `-graphic-bottom`

**Navigation** (`html`)

**Badge** (`html`)

**Footer** (`html`)

**List** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (10 items)
- **Hero** — Hero/banner section with headline and CTAs
- **Features** — Feature/benefit cards grid (35 items)
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (89 items)
- **Cta** — Call-to-action section
- **Stats** — Statistics/metrics display
- **Testimonials** — Testimonials/reviews section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `opacityAnimation`
- `nav-hover-arrow-in`
- `nav-hover-arrow-out`
- `detect-scroll`
- `navigation-menu-delay-reset`

### Motion Tokens

- **Duration scale:** `0ms`, `.1s`, `.15s`, `.24s`, `.25s`, `.3s`, `.4s`, `.5s`, `.75s`, `.8s`, `1ms`, `1s`, `2s`, `3.25s`, `50ms`, `100ms`, `120ms`, `150ms`, `180ms`, `200ms`, `220ms`, `250ms`, `300ms`, `350ms`, `360ms`, `400ms`, `500ms`, `600ms`, `750ms`, `800ms`, `1000ms`, `1800ms`
- **Easing functions:** `cubic-bezier(.25,1,.5,1)`, `ease`, `cubic-bezier(.22,1,.36,1)`, `cubic-bezier(0,0,.1,1)`, `cubic-bezier(0,0,.2,1)`, `cubic-bezier(.65,.05,.36,1)`, `linear`, `ease-out`, `cubic-bezier(.6,0,.2,.5)`, `ease-in`, `ease-in-out`, `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(.33,1,.68,1)`, `cubic-bezier(.2,0,0,1)`, `cubic-bezier(.16,1,.3,1)`, `cubic-bezier(.65,0,.35,1)`, `cubic-bezier(.3,0,.2,1)`, `cubic-bezier(.9,0,.1,1)`, `cubic-bezier(.66,0,.34,1)`, `cubic-bezier(.78,0,.22,1)`, `cubic-bezier(0,.53,.32,1)`, `cubic-bezier(.7,0,0,1)`, `cubic-bezier(.45,.05,.55,.95),linear`, `cubic-bezier(.45,.05,.55,.95)`, `cubic-bezier(0,.09,.4,1)`, `cubic-bezier(.33,1,.54,1)`
- **Animated properties:** `background-color`, `color`, `outline-color`, `border`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0ms) for micro-interactions, long (1800ms) for page transitions
- **Easing:** Use `cubic-bezier(.25,1,.5,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 0 0 var(--hds-space-core-border-sm,1px) var(--hds-color-core-brand-50A)`
- Subtle: `inset 0 0 0 2px var(--hds-color-core-neutral-0)`
- Subtle: `0-1px 0 0 var(--hds-color-surface-border-quiet)`
- Subtle: `0-1px 0 0 var(--shadow-aside)`
- Subtle: `0 1px 2px rgba(6,27,49,.08)`
- Subtle: `0 0 0 1px rgb(from var(--hds-color-heading-solid) r g b/.1)`

### Z-Index Scale

`0, 1, 2, 3, 10, 11, 40, 41, 100, 999, 1000, 9999, 99999, 999999, 2147483638, 2147483645, 2147483646, 2147483647`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only SourceCodePro and sohne-var and SFMono-Regular are allowed
- **No arbitrary border-radius** — use the scale: 1px, 1rem, 1.5px, 2px, 3px, 4px, 4.51px, 5px, 6px, 8px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — SourceCodePro, sohne-var, SFMono-Regular only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `https://images.stripeassets.com/fzn2n1nzq965/1hgcBNd12BfT9VLgbId7By/01d91920114b124fb4cf6d448f9f06eb/favicon.svg`
- **Site URL:** `https://stripe.com/`
- **Brand color:** `#9966ff`
- **Brand typeface:** SourceCodePro

## Quick Reference

```
Background:     #f5f5ff
Surface:        #e8e9ff
Text:           #0d253d / #3c4f69
Accent:         #9966ff
Border:         (not extracted)
Font:           SourceCodePro
Spacing:        4px grid
Radius:         10px
Components:     10 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for stripe
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "stripe" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# stripe DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 10
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![stripe Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography pairs **sohne-var** for display/headings with **SourceCodePro** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#9966ff** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| hds-color-core-brand-25 | `#f5f5ff` | background | Page background, darkest surface |
| hds-color-core-brand-50 | `#e8e9ff` | surface | Card and panel backgrounds |
| hds-color-core-neutral-975 | `#0d253d` | text-primary | Headings and body text |
| hds-color-core-neutral-700 | `#3c4f69` | text-muted | Captions, placeholders, secondary info |
| badgeTextColor | `#9966ff` | accent | CTAs, links, focus rings, active states |
| hds-color-accentColorMode-lemon-icon-gradientStart | `#ffd552` | warning | Warning states, caution indicators |
| hds-color-core-brand-600 | `#533afd` | info | Informational highlights |
| hds-color-core-brand-900 | `#1c1e54` | unknown | Palette color |
| hds-color-core-brand-500 | `#665efd` | unknown | Palette color |
| hds-color-core-neutral-990 | `#061b31` | unknown | Palette color |
| hds-color-core-neutralDark-700 | `#273f73` | unknown | Palette color |
| hds-color-accentColorMode-magenta-icon-gradientStart | `#f98bf9` | unknown | Palette color |
| hds-color-input-bg-focus | `#000000` | unknown | Palette color |
| badgeTextColor | `#0073e6` | unknown | Palette color |
| hds-color-core-brand-100A | `#7680f5` | unknown | Palette color |
| hds-color-core-brand-950 | `#161741` | unknown | Palette color |
| hds-color-core-brand-200 | `#b9b9f9` | unknown | Palette color |
| hds-color-core-neutral-500 | `#64748d` | unknown | Palette color |
| hds-color-core-neutral-100 | `#d4dee9` | unknown | Palette color |
| hds-color-core-brand-800 | `#2e2b8c` | unknown | Palette color |

### CSS Variable Tokens

```css
--hds-space-customerCard-logo-height: 60px;
--hds-space-input-popover-width: 240px;
--hds-space-customerCard-logo-height: 40px;
--hds-space-input-popover-width: 240px;
--hds-space-customerCard-logo-height: 60px;
--hds-space-input-popover-width: 240px;
--hds-space-button-border: 1px;
--hds-space-core-border-sm: 1px;
--hds-space-core-border-md: 1.25px;
--hds-space-core-border-lg: 2px;
--hds-space-core-border-none: 0px;
--hds-space-input-border-default: 1px;
--hds-color-accent-border-quiet: var(--hds-color-action-border-quiet);
--hds-color-accent-border-solid: var(--hds-color-action-bg-solid);
--hds-color-accent-charm-bg: var(--hds-color-action-bg-solid);
--hds-color-accent-icon-solid: var(--hds-color-action-icon-solid);
--hds-color-accent-surface-solid: var(--hds-color-action-bg-solid);
--hds-color-accent-surface-subdued: var(--hds-color-action-bg-subdued);
--hds-color-accent-text-solid: var(--hds-color-action-bg-solid);
--hds-color-accentColorMode-default-icon-gradientEnd: var(--hds-color-core-brand-700);
```


---

## 3. Typography Rules

**Font Stack:**
- **SourceCodePro** — Heading 1, Heading 2, Heading 3
- **sohne-var** — Body, Caption
- **SFMono-Regular** — Code

**Font Sources:**

```css
@font-face {
  font-family: "sohne-var";
  src: url("fonts/sohne-var-1.woff2") format("woff2");
  font-weight: 1;
}
@font-face {
  font-family: "SourceCodePro";
  src: url("fonts/SourceCodePro-500.woff2") format("woff2");
  font-weight: 500;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | SourceCodePro | 110px | 700 |
| Heading 2 | SourceCodePro | 63px | 700 |
| Heading 3 | SourceCodePro | 62px | 700 |
| Body | sohne-var | 12px | 400 |
| Caption | sohne-var | 10px | 400 |
| Code | SFMono-Regular | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **SourceCodePro** for body/UI text, **sohne-var** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (3)

**Card** — `html`
- Variants: `grid`, `-startups`, `action`, `-atlas`, `-graphic-bottom`

**Badge** — `html`

**List** — `html`

### Data Input (2)

**Button** — `html`
- Animation: 

**Input** — `html`
- State: :focus, :placeholder

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** 1px, 1rem, 1.5px, 2px, 3px, 4px, 4.51px, 5px, 6px, 8px, 16.5px, 20px, inherit, 10px, 12px, 16px, 28px, 30px, 32px, 38px, 60px, 99px, 100px, 100%, 114px, 999px
- **Max content width:** 1263px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 0 0 var(--hds-space-core-border-sm,1px) var(--hds-color-core-brand-50A)`
- `inset 0 0 0 2px var(--hds-color-core-neutral-0)`
- `0-1px 0 0 var(--hds-color-surface-border-quiet)`

### Raised — cards, buttons, interactive elements

- `var(--hds-shadow-xs)`
- `var(--hds-shadow-md)`
- `var(--hds-canary-ui-shadow)`

### Floating — dropdowns, popovers, modals

- `0 6px 12px -2px rgba(50,50,93,.08),0 3px 7px -3px rgba(0,0,0,.04)`
- `4.5px 0 0 0#3f4b66,9px 0 0 0#3f4b66`
- `0 2px 10px rgba(0,55,112,.06),0 1px 4px rgba(0,59,137,.04)`

### Overlay — full-screen overlays, top-level dialogs

- `0-20px 30.64px 0 hsla(0,0%,9%,.08),0 20px 30.64px 0 hsla(0,0%,9%,.08)`
- `0-30px 60px -12px rgba(50,50,93,.25),0-18px 36px -18px rgba(0,0,0,.3)`
- `0 30px 60px -12px rgba(50,50,93,.25),0 18px 36px -18px rgba(0,0,0,.3)`

### Z-Index Scale

`0, 1, 2, 3, 10, 11, 40, 41, 100, 999, 1000, 9999, 99999, 999999, 2147483638, 2147483645, 2147483646, 2147483647`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes opacityAnimation`
- `@keyframes nav-hover-arrow-in`
- `@keyframes nav-hover-arrow-out`
- `@keyframes detect-scroll`
- `@keyframes navigation-menu-delay-reset`
- `@keyframes bento-overlay-gradient-opacity-animation`
- `@keyframes bento-dialog-reveal-fade-in-up`
- `@keyframes agentic-commerce-graphic-border-spin`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#9966ff` for interactive elements (buttons, links, focus rings)
- Use `#f5f5ff` as the primary page background
- Pair **SourceCodePro** (body) with **sohne-var** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 1px, 1rem, 1.5px, 2px, 3px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond SourceCodePro and sohne-var and SFMono-Regular
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| xs | 350px | css |
| xs | 375px | css |
| xs | 400px | css |
| xs | 480px | css |
| sm | 599px | css |
| sm | 600px | css |
| sm | 639px | css |
| sm | 639.9999px | css |
| sm | 640px | css |
| md | 706px | css |
| md | 749px | css |
| md | 750px | css |
| md | 767px | css |
| lg | 840px | css |
| lg | 899px | css |
| lg | 900px | css |
| lg | 901px | css |
| lg | 939px | css |
| lg | 939.9999px | css |
| lg | 940px | css |
| lg | 970px | css |
| lg | 990px | css |
| lg | 1000px | css |
| lg | 1019px | css |
| lg | 1020px | css |
| lg | 1023px | css |
| lg | 1024px | css |
| xl | 1051px | css |
| xl | 1069px | css |
| xl | 1111px | css |
| xl | 1112px | css |
| xl | 1115px | css |
| xl | 1199px | css |
| xl | 1200px | css |
| xl | 1263px | css |
| xl | 1264px | css |
| 2xl | 1295px | css |
| 2xl | 1299px | css |
| 2xl | 1300px | css |
| 2xl | 1600px | css |
| 2xl | 1609px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #e8e9ff
Border: 1px solid var(--border)
Radius: 10px
Padding: 16px
Font: SourceCodePro
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #9966ff, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 10px
Hover: opacity 0.9 or lighter shade
Focus: ring with #9966ff
```

### Build a Page Layout

```
Background: #f5f5ff
Max-width: 1263px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #e8e9ff
Label: #3c4f69 (muted, 12px, uppercase)
Value: #0d253d (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #f5f5ff
Input border: 1px solid var(--border)
Focus: border-color #9966ff
Label: #3c4f69 12px
Spacing: 16px between fields
Radius: 10px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: SourceCodePro, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/KaTeX_AMS-Regular.ttf`
- `fonts/KaTeX_AMS-Regular.woff`
- `fonts/KaTeX_AMS-Regular.woff2`
- `fonts/KaTeX_Caligraphic-700.ttf`
- `fonts/KaTeX_Caligraphic-700.woff`
- `fonts/KaTeX_Caligraphic-700.woff2`
- `fonts/KaTeX_Caligraphic-Regular.ttf`
- `fonts/KaTeX_Caligraphic-Regular.woff`
- `fonts/KaTeX_Caligraphic-Regular.woff2`
- `fonts/KaTeX_Fraktur-700.ttf`
- `fonts/KaTeX_Fraktur-700.woff`
- `fonts/KaTeX_Fraktur-700.woff2`
- `fonts/KaTeX_Fraktur-Regular.ttf`
- `fonts/KaTeX_Fraktur-Regular.woff`
- `fonts/KaTeX_Fraktur-Regular.woff2`
- `fonts/KaTeX_Main-700.ttf`
- `fonts/KaTeX_Main-700.woff`
- `fonts/KaTeX_Main-700.woff2`
- `fonts/KaTeX_Main-Regular.ttf`
- `fonts/KaTeX_Main-Regular.woff`
- `fonts/KaTeX_Main-Regular.woff2`
- `fonts/KaTeX_Math-700.ttf`
- `fonts/KaTeX_Math-700.woff`
- `fonts/KaTeX_Math-700.woff2`
- `fonts/KaTeX_Math-Regular.ttf`
- `fonts/KaTeX_Math-Regular.woff`
- `fonts/KaTeX_Math-Regular.woff2`
- `fonts/KaTeX_SansSerif-700.ttf`
- `fonts/KaTeX_SansSerif-700.woff`
- `fonts/KaTeX_SansSerif-700.woff2`
- `fonts/KaTeX_SansSerif-Regular.ttf`
- `fonts/KaTeX_SansSerif-Regular.woff`
- `fonts/KaTeX_SansSerif-Regular.woff2`
- `fonts/KaTeX_Script-Regular.ttf`
- `fonts/KaTeX_Script-Regular.woff`
- `fonts/KaTeX_Script-Regular.woff2`
- `fonts/KaTeX_Size1-Regular.ttf`
- `fonts/KaTeX_Size1-Regular.woff`
- `fonts/KaTeX_Size1-Regular.woff2`
- `fonts/KaTeX_Size2-Regular.ttf`
- `fonts/KaTeX_Size2-Regular.woff`
- `fonts/KaTeX_Size2-Regular.woff2`
- `fonts/KaTeX_Size3-Regular.ttf`
- `fonts/KaTeX_Size3-Regular.woff`
- `fonts/KaTeX_Size3-Regular.woff2`
- `fonts/KaTeX_Size4-Regular.ttf`
- `fonts/KaTeX_Size4-Regular.woff`
- `fonts/KaTeX_Size4-Regular.woff2`
- `fonts/KaTeX_Typewriter-Regular.ttf`
- `fonts/KaTeX_Typewriter-Regular.woff`
- `fonts/KaTeX_Typewriter-Regular.woff2`
- `fonts/SourceCodePro-500.woff`
- `fonts/SourceCodePro-500.woff2`
- `fonts/sohne-mono-100.woff2`
- `fonts/sohne-mono-300.woff2`
- `fonts/sohne-mono-500.woff2`
- `fonts/sohne-var-1.woff2`
- `fonts/sohne-var-Regular.woff2`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

