# Task: Technician Blog Setup (React + Astro)

## 🎯 Objective
Build a high-performance, strictly typed blog for Computer Technicians using Astro + React.
**Design Aesthetic:** Industrial / Utilitarian (Brutalist, Schematic, High Contrast).
**Content Strategy:** Hybrid.
- `content/conteudos`: Manually authored `.md` files.
- `content/noticias`: Auto-generated `.md` files from RSS feeds (via script).

## 🎨 Design Language: "The Schematic"
- **Vibe:** Raw, reliable, technical, "under the hood".
- **Typography:** Monospace headers (Fira Code/JetBrains Mono), Grotesque body.
- **Palette:** 
  - Background: `#0a0a0a` (Near Black) / `#ffffff` (White paper look for docs)
  - Accents: `#ff3300` (Safety Orange) or `#00ff00` (Terminal Green).
  - Borders: Thick (2px-4px), solid, strict grid alignment.
- **UI Elements:** 
  - Visible layout grids.
  - "System status" indicators.
  - Raw HTML inputs styling.
  - No rounded corners (`rounded-none`).

## 🛠 Architecture

### 1. Stack
- **Framework:** Astro 5.0 (SSG Mode).
- **UI Architecture:** React for interactive islands (calculators, dynamic lists), Astro for layout/text.
- **Styling:** Tailwind CSS (configured for Brutalism).
- **SEO:** `astro-seo` or custom Meta tags per content.

### 2. Content Structure (`src/content`)
```text
src/content/
  ├── config.ts       # Strict Zod schemas
  ├── conteudos/      # Deep technical articles
  │     ├── fix-gpu-drivers.md
  │     └── ...
  └── noticias/       # RSS-fetched updates
        ├── news-12345.md
        └── ...
```

### 3. RSS Ingestion Workflow ("Fetch & Create")
The user specified "Fetch with React and create .md".
Since browsers cannot write to the file system, we will implement a **Utility Script** (`scripts/ingest-rss.js`) that:
1. Fetches configured RSS feeds.
2. Parses XML/JSON.
3. Formats content into Frontmatter + Markdown.
4. Writes files to `src/content/noticias`.
*Usage:* User runs `npm run ingest` before `npm run build`.

## 📅 Implementation Plan

### Phase 1: Foundation 
- [ ] Initialize Astro + React + Tailwind.
- [ ] Configure Tailwind theme (The "Industrial" Preset).
- [ ] Define Content Collections (Zod schemas).

### Phase 2: The Engine (RSS Ingestion)
- [ ] Create `scripts/ingest-rss.js` (XML parser, file writer).
- [ ] Map RSS fields to proper Markdown structure.
- [ ] Add `npm run ingest` automation.

### Phase 3: UI & Pages
- [ ] **Design System:** Buttons, Cards, Grid Layouts (Brutalist).
- [ ] **Home Page:** proper technical dashboard feel.
- [ ] **Blog Index & Post Layouts:**
  - Sidebar for ToC (Table of Contents).
  - "Schematic" layout for rendering Markdown.
- [ ] **SEO Components:** Canonical URLs, OpenGraph, JSON-LD.

### Phase 4: Polish
- [ ] Performance check (Lighthouse).
- [ ] Accessibility audit (High contrast checks).
