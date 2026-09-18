---
name: cinematic-dark-editorial
description: Applies a cinematic dark glassmorphism and atmospheric visual storytelling aesthetic featuring full-bleed photography, frosted glass cards, line-bracketed typography, and smooth gradient transitions.
---

# Cinematic Dark Glassmorphism Design System

Use this skill when building or styling web pages with an atmospheric, luxury, or cinematic storytelling aesthetic.

## 1. Color Palette & Lighting
- **Canvas Base:** `#0a0a0c` to `#0d0d12` (rich, obsidian dark, never pure `#ffffff` or flat `#1e1e1e`).
- **Surface / Card Background:** `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)`.
- **Card Borders:** `1px solid rgba(255, 255, 255, 0.12)`.
- **Primary Text:** `#f3f4f6` (soft off-white).
- **Secondary / Muted Text:** `#9ca3af` (cool neutral gray).
- **Keyword Accent:** Warm Amber/Gold (`#f59e0b` or `#eab308`) or Electric Cyan (`#06b6d4`), used selectively to highlight 1-2 words in body paragraphs.
- **Ambient Lighting:** Soft warm gradients or subtle radial glows blending into the dark base (`radial-gradient` or gradient masks).

## 2. Typography Hierarchy
- **Header Font:** Geometric, bold, high-character sans-serif (e.g., `Syne`, `Clash Display`, `Montserrat`, or `Plus Jakarta Sans`).
- **Body Font:** Crisp, highly legible sans-serif (`Inter`, `Plus Jakarta Sans`).
- **Hero Giant Backdrop Text:**
  - `font-size: clamp(4rem, 12vw, 10rem)`
  - `font-weight: 800`
  - `letter-spacing: 0.15em`
  - `color: rgba(255, 255, 255, 0.2)` or `backdrop-filter` blend.
  - Positioned behind foreground elements for cinematic depth.
- **Section Headers (Line-Bracketed):**
  - Uppercase, bold with wide letter-spacing (`letter-spacing: 0.1em`).
  - Bracketed with horizontal divider lines:
    ```css
    .section-title {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #f3f4f6;
    }
    .section-title::before,
    .section-title::after {
      content: "";
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
    ```

## 3. Surface, Buttons & Metadata Rules

### A. Glass & Button Tokens
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
}

.pill-button {
  border-radius: 9999px;
  padding: 0.6rem 1.6rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pill-button-primary {
  background: #ffffff;
  color: #0a0a0c;
  border: none;
}
.pill-button-primary:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
}
```

### B. Pill Usage Rules: Avoid "Pill with Text", "Pill with Icon" is Fine
- **NEVER use "Pill with Text" for passive metadata**:
  - Do **not** wrap text labels, dates/years (e.g. `badge-year`), category tags (`flagship-badge`), or statuses (`status-indicator`) in rounded capsule pills (`border-radius: 9999px` with solid/translucent background bubbles and borders). This looks like generic mobile chip filters and weakens the cinematic editorial seriousness.
- **"Pill with Icon" is fine**:
  - Interactive clickable controls (e.g. social icon circles/pills, circular action icons, or CTA buttons with icons) are completely fine because the pill/circle shape signifies an interactive touchpoint.
- **Editorial Typographic Metadata Alternative**:
  - Display passive metadata using crisp, understated typography:
    - Clean monospace (`font-family: var(--font-mono); font-size: 0.8rem;`)
    - Monospace dates with optional subtle slash prefix: `// 2024 — 2025`
    - Kicker labels: uppercase with wide letter-spacing (`letter-spacing: 0.12em; color: var(--accent-gold);`)
    - Status indicators: clean borderless inline dot with text (e.g. glowing emerald dot + plain monospace text `Live in Production`) without any capsule pill wrapper.


## 4. Key Layout Patterns

### A. Hero with Floating Micro-Pill Cards
* Hero backdrop fills the container with a bottom gradient fade:
  `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`.
* A row of rounded vertical pill thumbnails (aspect ratio ~ 3:4) showing preview images/highlights with frosted glass bottom badges.

### B. Vertical Node Timeline
* A 1px vertical line connecting milestones.
* Circular glowing nodes (`width: 10px; height: 10px; border-radius: 50%`) with micro-photo/project cards clustered beside each milestone.

### C. Outlined Feature Bento Cards
* 3 or 4-column responsive grid.
* Cards have a subtle rounded corner (`border-radius: 18px`), an accent icon at the top, a bold title, and secondary description.
* Hover effect: `border-color: rgba(255, 255, 255, 0.3)` and subtle elevation (`transform: translateY(-4px)`).

### D. Floating Form / Contact Card
* Anchored over a scenic or atmospheric backdrop.
* Uses frosted glass container with minimalist bottom-border inputs:
  `border: none; border-bottom: 1px solid rgba(255, 255, 255, 0.2); background: transparent; color: #f3f4f6;`.
