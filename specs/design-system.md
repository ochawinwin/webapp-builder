# FutureCareer — Design System

> A modern, professional design system for a job matching platform. Clean, trustworthy, and highly readable — optimized for content-heavy pages, data tables, and form-driven workflows.

---

## 1. Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#2563EB` (Blue 600) | CTAs, active states, links, primary buttons, selected tags |
| **Primary Hover** | `#1D4ED8` (Blue 700) | Button/link hover states |
| **Primary Light** | `#DBEAFE` (Blue 100) | Tag backgrounds, highlight areas, selected rows |
| **Primary Subtle** | `#EFF6FF` (Blue 50) | Page section backgrounds, badge fills |
| **Secondary** | `#0F172A` (Slate 900) | Headings, navbar background, dark UI elements |
| **Secondary Light** | `#334155` (Slate 700) | Subheadings, secondary text |
| **Accent** | `#10B981` (Emerald 500) | Match scores, success indicators, "Apply" CTAs, positive status |
| **Accent Hover** | `#059669` (Emerald 600) | Accent button hover |
| **Accent Light** | `#D1FAE5` (Emerald 100) | Match score backgrounds, success tag fills |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **bg-primary** | `#FFFFFF` | Main content areas, cards, modals |
| **bg-secondary** | `#F8FAFC` (Slate 50) | Page backgrounds, sidebar, alternating table rows |
| **bg-tertiary** | `#F1F5F9` (Slate 100) | Input fields, disabled areas, code blocks |
| **bg-dark** | `#0F172A` (Slate 900) | Footer, dark sections, navbar |
| **bg-dark-secondary** | `#1E293B` (Slate 800) | Dark mode cards, elevated dark surfaces |
| **bg-overlay** | `rgba(15, 23, 42, 0.5)` | Modal/dialog backdrop |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **text-primary** | `#0F172A` (Slate 900) | Headings, body text, primary labels |
| **text-secondary** | `#475569` (Slate 600) | Descriptions, helper text, metadata |
| **text-tertiary** | `#94A3B8` (Slate 400) | Placeholders, disabled text, timestamps |
| **text-inverse** | `#FFFFFF` | Text on dark/primary backgrounds |
| **text-link** | `#2563EB` (Blue 600) | Hyperlinks, clickable text |
| **text-link-hover** | `#1D4ED8` (Blue 700) | Link hover state |

### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **Success** | `#10B981` (Emerald 500) | Success toasts, active status, verified badges |
| **Success bg** | `#D1FAE5` (Emerald 100) | Success alert backgrounds |
| **Error** | `#EF4444` (Red 500) | Validation errors, rejected status, delete actions |
| **Error bg** | `#FEE2E2` (Red 100) | Error alert backgrounds |
| **Warning** | `#F59E0B` (Amber 500) | Paused status, caution messages, pending states |
| **Warning bg** | `#FEF3C7` (Amber 100) | Warning alert backgrounds |
| **Info** | `#3B82F6` (Blue 500) | Informational banners, tooltips |
| **Info bg** | `#DBEAFE` (Blue 100) | Info alert backgrounds |

### Pipeline / ATS Stage Colors

| Stage | Badge Color | Badge BG |
|-------|------------|----------|
| New | `#3B82F6` (Blue) | `#DBEAFE` |
| Reviewing | `#8B5CF6` (Violet) | `#EDE9FE` |
| Interview | `#F59E0B` (Amber) | `#FEF3C7` |
| Offered | `#10B981` (Emerald) | `#D1FAE5` |
| Hired | `#059669` (Emerald 600) | `#A7F3D0` |
| Rejected | `#EF4444` (Red) | `#FEE2E2` |

### Job Status Colors

| Status | Badge Color | Badge BG |
|--------|------------|----------|
| Draft | `#94A3B8` (Slate 400) | `#F1F5F9` |
| Active | `#10B981` (Emerald) | `#D1FAE5` |
| Paused | `#F59E0B` (Amber) | `#FEF3C7` |
| Closed | `#EF4444` (Red) | `#FEE2E2` |

---

## 2. Typography

### Font Families

| Token | Font | Fallback Stack | Usage |
|-------|------|----------------|-------|
| **font-heading** | Inter | `system-ui, -apple-system, sans-serif` | Headings, buttons, navigation |
| **font-body** | Inter | `system-ui, -apple-system, sans-serif` | Body text, labels, descriptions |
| **font-mono** | JetBrains Mono | `ui-monospace, 'Courier New', monospace` | Code snippets, technical data, IDs |

> **Why Inter**: Clean, highly readable at all sizes, excellent for data-heavy interfaces, professional tone. Available on Google Fonts with variable weight support.

### Font Sizes

| Token | Size (px) | Size (rem) | Usage |
|-------|-----------|------------|-------|
| **text-xs** | 12px | 0.75rem | Badges, fine print, timestamps |
| **text-sm** | 14px | 0.875rem | Helper text, table cells, metadata |
| **text-base** | 16px | 1rem | Body text, form labels, descriptions |
| **text-lg** | 18px | 1.125rem | Card titles, section labels |
| **text-xl** | 20px | 1.25rem | Page subtitles, dialog headers |
| **text-2xl** | 24px | 1.5rem | Page headings (h3) |
| **text-3xl** | 30px | 1.875rem | Section headings (h2) |
| **text-4xl** | 36px | 2.25rem | Page titles (h1) |
| **text-5xl** | 48px | 3rem | Hero/landing headline |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| **font-normal** | 400 | Body text, descriptions |
| **font-medium** | 500 | Labels, table headers, nav items |
| **font-semibold** | 600 | Card titles, section headings, buttons |
| **font-bold** | 700 | Page headings, hero text, emphasis |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| **leading-tight** | 1.25 | Headings (h1–h3) |
| **leading-snug** | 1.375 | Card titles, subheadings |
| **leading-normal** | 1.5 | Body text, descriptions |
| **leading-relaxed** | 1.625 | Long-form text, rich content |

### Heading Definitions

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| **h1** | 36px (2.25rem) | 700 (bold) | 1.25 | -0.025em |
| **h2** | 30px (1.875rem) | 700 (bold) | 1.25 | -0.02em |
| **h3** | 24px (1.5rem) | 600 (semibold) | 1.25 | -0.015em |
| **h4** | 20px (1.25rem) | 600 (semibold) | 1.375 | -0.01em |
| **h5** | 18px (1.125rem) | 600 (semibold) | 1.375 | 0 |
| **body** | 16px (1rem) | 400 (normal) | 1.5 | 0 |
| **small** | 14px (0.875rem) | 400 (normal) | 1.5 | 0 |
| **caption** | 12px (0.75rem) | 500 (medium) | 1.5 | 0.01em |

---

## 3. Spacing System

> **Base unit**: 4px. All spacing is a multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| **space-0** | 0px | Reset |
| **space-0.5** | 2px | Hairline gaps, icon nudges |
| **space-1** | 4px | Tight inline spacing, icon-to-text gaps |
| **space-1.5** | 6px | Tag padding vertical |
| **space-2** | 8px | Small padding, compact list spacing |
| **space-3** | 12px | Input padding, button padding vertical |
| **space-4** | 16px | Standard component padding, form field gaps |
| **space-5** | 20px | Card padding (compact) |
| **space-6** | 24px | Card padding (standard), section gaps |
| **space-8** | 32px | Section padding, large component spacing |
| **space-10** | 40px | Page section separation |
| **space-12** | 48px | Major section breaks |
| **space-16** | 64px | Page top/bottom padding |
| **space-20** | 80px | Landing page section spacing |
| **space-24** | 96px | Hero section padding |

---

## 4. Component Styles

### Buttons

#### Sizes

| Size | Height | Padding (h) | Font Size | Border Radius | Icon Size |
|------|--------|-------------|-----------|---------------|-----------|
| **xs** | 28px | 10px | 12px | 6px | 14px |
| **sm** | 32px | 12px | 14px | 6px | 16px |
| **md** | 40px | 16px | 14px | 8px | 18px |
| **lg** | 48px | 24px | 16px | 8px | 20px |
| **xl** | 56px | 32px | 18px | 10px | 22px |

#### Variants

| Variant | Background | Text | Border | Hover BG | Usage |
|---------|-----------|------|--------|----------|-------|
| **Primary** | `#2563EB` | `#FFFFFF` | none | `#1D4ED8` | Main CTAs: "Sign In", "Save Changes", "Publish" |
| **Secondary** | `#FFFFFF` | `#0F172A` | 1px `#CBD5E1` | `#F8FAFC` | Secondary actions: "Cancel", "Back", "Save Draft" |
| **Accent** | `#10B981` | `#FFFFFF` | none | `#059669` | Positive actions: "Apply Now", "Hire" |
| **Ghost** | transparent | `#475569` | none | `#F1F5F9` | Toolbar actions, subtle controls |
| **Danger** | `#EF4444` | `#FFFFFF` | none | `#DC2626` | Destructive: "Delete", "Remove", "Reject" |
| **Outline** | transparent | `#2563EB` | 1px `#2563EB` | `#EFF6FF` | Alternative CTAs, toggle options |
| **Link** | transparent | `#2563EB` | none | underline | Inline text actions |

#### States (all variants)

| State | Effect |
|-------|--------|
| **Default** | Base styles above |
| **Hover** | Darken background by one shade, cursor pointer |
| **Active/Pressed** | Darken by two shades, scale(0.98) |
| **Focus** | 2px ring `#93C5FD` (Blue 300) with 2px offset |
| **Disabled** | Opacity 0.5, cursor not-allowed, no hover effect |
| **Loading** | Spinner icon replaces label or appears before it, disabled state |

### Input Fields

| Property | Value |
|----------|-------|
| **Height** | 40px (md), 32px (sm), 48px (lg) |
| **Padding** | 12px horizontal, 8px vertical |
| **Background** | `#FFFFFF` |
| **Border** | 1px solid `#CBD5E1` (Slate 300) |
| **Border Radius** | 8px |
| **Font Size** | 14px (sm), 16px (md) |
| **Text Color** | `#0F172A` (Slate 900) |
| **Placeholder Color** | `#94A3B8` (Slate 400) |
| **Focus Border** | `#2563EB` (Blue 600) |
| **Focus Ring** | 3px `#BFDBFE` (Blue 200) |
| **Error Border** | `#EF4444` (Red 500) |
| **Error Ring** | 3px `#FECACA` (Red 200) |
| **Disabled BG** | `#F1F5F9` (Slate 100) |
| **Disabled Text** | `#94A3B8` (Slate 400) |
| **Label** | 14px, font-medium (500), `#334155` (Slate 700), margin-bottom 6px |
| **Helper Text** | 14px, font-normal (400), `#64748B` (Slate 500), margin-top 6px |
| **Error Text** | 14px, font-normal (400), `#EF4444` (Red 500), margin-top 6px |

#### Input Variants

| Variant | Description |
|---------|-------------|
| **Text** | Standard single-line input |
| **Textarea** | Multi-line, min-height 120px, resize vertical |
| **Select** | Dropdown with chevron icon right-aligned |
| **Autocomplete/Combobox** | Text input + dropdown list + chip display for selected items |
| **File Upload** | Dashed border zone, drag-and-drop, icon + "Browse" link |
| **Search** | Left-aligned search icon, optional clear button right-aligned |

### Cards

| Property | Value |
|----------|-------|
| **Background** | `#FFFFFF` |
| **Border** | 1px solid `#E2E8F0` (Slate 200) |
| **Border Radius** | 12px |
| **Padding** | 24px (standard), 16px (compact) |
| **Shadow** | `shadow-sm` by default (see elevation) |
| **Hover Shadow** | `shadow-md` (for clickable cards like job cards) |
| **Hover Border** | `#CBD5E1` (Slate 300) for interactive cards |
| **Transition** | `all 150ms ease` |

#### Card Variants

| Variant | Border | Shadow | Usage |
|---------|--------|--------|-------|
| **Default** | `#E2E8F0` | shadow-sm | Static content cards, settings sections |
| **Interactive** | `#E2E8F0` → `#CBD5E1` on hover | shadow-sm → shadow-md on hover | Job cards, candidate cards, clickable items |
| **Selected** | 2px `#2563EB` | shadow-md | Selected card in a list |
| **Kanban** | `#E2E8F0` | shadow-sm, shadow-lg on drag | ATS candidate cards |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **rounded-none** | 0px | Dividers, full-bleed elements |
| **rounded-sm** | 4px | Badges, small chips, inline tags |
| **rounded-md** | 6px | Buttons (sm/xs), small inputs |
| **rounded-lg** | 8px | Buttons (md+), inputs, dropdowns |
| **rounded-xl** | 12px | Cards, modals, dialogs |
| **rounded-2xl** | 16px | Large cards, hero sections, image containers |
| **rounded-full** | 9999px | Avatars, circular buttons, pill tags |

### Shadows / Elevation

| Token | Value | Usage |
|-------|-------|-------|
| **shadow-xs** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift: badges, chips |
| **shadow-sm** | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards (resting), inputs (focus) |
| **shadow-md** | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Cards (hover), dropdowns |
| **shadow-lg** | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, popovers, floating elements |
| **shadow-xl** | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Toast notifications, drag states |

### Badges / Status Tags

| Property | Value |
|----------|-------|
| **Padding** | 2px 8px (sm), 4px 12px (md) |
| **Border Radius** | 4px (rectangular), 9999px (pill) |
| **Font Size** | 12px (sm), 14px (md) |
| **Font Weight** | 500 (medium) |
| **Text Transform** | None (sentence case) |
| **Style** | Colored background (light) + darker text from same hue |

### Tag / Chip

| Property | Value |
|----------|-------|
| **Height** | 28px (sm), 32px (md) |
| **Padding** | 4px 10px (sm), 6px 12px (md) |
| **Background** | `#EFF6FF` (Blue 50) default, varies by category |
| **Text Color** | `#1D4ED8` (Blue 700) default |
| **Border** | 1px solid `#BFDBFE` (Blue 200) |
| **Border Radius** | 6px |
| **Font Size** | 12px (sm), 14px (md) |
| **Close Icon** | 14px, shows on hover or always (removable tags) |

#### Tag Color by Category

| Category | Background | Text | Border |
|----------|-----------|------|--------|
| **Skill** | `#EFF6FF` (Blue 50) | `#1D4ED8` (Blue 700) | `#BFDBFE` |
| **Industry** | `#F5F3FF` (Violet 50) | `#6D28D9` (Violet 700) | `#C4B5FD` |
| **Level** | `#FEF3C7` (Amber 100) | `#92400E` (Amber 800) | `#FCD34D` |
| **Location** | `#ECFDF5` (Emerald 50) | `#065F46` (Emerald 800) | `#A7F3D0` |
| **Type** | `#F1F5F9` (Slate 100) | `#334155` (Slate 700) | `#CBD5E1` |

---

## 5. Layout Grid

### Container

| Property | Value |
|----------|-------|
| **Max Width** | 1280px |
| **Padding (horizontal)** | 16px (mobile), 24px (tablet), 32px (desktop) |
| **Centering** | `margin: 0 auto` |

### Grid System

| Property | Value |
|----------|-------|
| **Columns** | 12 |
| **Gutter** | 24px (desktop), 16px (tablet), 12px (mobile) |
| **Column gap** | Same as gutter |
| **Row gap** | 24px |

### Common Layouts

| Layout | Structure |
|--------|-----------|
| **Full-width** | Single column, 12 cols |
| **Content + Sidebar** | 8 cols + 4 cols (desktop), stack on mobile |
| **Dashboard** | 250px fixed sidebar + fluid main content |
| **Two-column form** | 6 cols + 6 cols (desktop), stack on tablet |
| **Card grid (jobs)** | 3 cols (desktop), 2 cols (tablet), 1 col (mobile) |
| **Kanban** | Horizontal scroll with fixed-width columns (280px each) |

### Dashboard Sidebar

| Property | Value |
|----------|-------|
| **Width** | 250px (expanded), 64px (collapsed/icon-only) |
| **Background** | `#FFFFFF` with right border `#E2E8F0` |
| **Nav Item Height** | 40px |
| **Nav Item Padding** | 8px 16px |
| **Active Item** | Background `#EFF6FF`, text `#2563EB`, left border 3px `#2563EB` |

### Responsive Breakpoints

| Token | Min Width | Target |
|-------|-----------|--------|
| **sm** | 640px | Large phones (landscape) |
| **md** | 768px | Tablets |
| **lg** | 1024px | Small laptops, tablets (landscape) |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large desktops |

### Breakpoint Behavior

| Element | Mobile (<768) | Tablet (768–1023) | Desktop (1024+) |
|---------|--------------|-------------------|-----------------|
| **Navbar** | Hamburger menu | Full nav, condensed | Full nav |
| **Sidebar** | Hidden (drawer overlay) | Collapsed (icons) | Expanded (250px) |
| **Job cards** | 1 column | 2 columns | 3 columns |
| **Content + sidebar** | Stacked | Stacked | Side-by-side |
| **Form columns** | 1 column | 1 column | 2 columns |
| **Kanban** | Horizontal scroll, 1 visible | 2–3 visible | All visible |
| **Tables** | Card view (stacked) | Horizontal scroll | Full table |

---

## Tailwind CSS Token Mapping

> For implementation reference — these map to the Tailwind default palette.

```
primary         → blue-600
primary-hover   → blue-700
primary-light   → blue-100
primary-subtle  → blue-50
secondary       → slate-900
accent          → emerald-500
accent-hover    → emerald-600

bg-primary      → white
bg-secondary    → slate-50
bg-tertiary     → slate-100

text-primary    → slate-900
text-secondary  → slate-600
text-tertiary   → slate-400

success         → emerald-500
error           → red-500
warning         → amber-500
info            → blue-500

border-default  → slate-200
border-strong   → slate-300
focus-ring      → blue-300
```
