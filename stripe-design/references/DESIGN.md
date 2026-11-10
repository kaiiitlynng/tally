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
