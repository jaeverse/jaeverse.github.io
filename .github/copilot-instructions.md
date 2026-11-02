# Jae's Portfolio — Project Context

Shared context for every agent in `.github/agents/`. Read this before acting; do not re-derive it.

## The site
- "Jae's Portfolio" for Jasonne (Jae) Loresca, published at `https://jaeverse.github.io` (GitHub Pages user site, served from the repo root on `main`, `.nojekyll` present).
- Static multi-page site: hand-written HTML, CSS and vanilla JavaScript ES modules. No build step, no package manager, no server.
- Root-relative paths (`/css/base.css`) are correct because this is a user site served at the domain root. ES modules mean the site must be viewed over HTTP, not `file://`.

## Layout
- `index.html` (Home) and `404.html` must stay in the root; GitHub Pages requires it. All other pages live in `html/`: `wms.html` (animated "How a WMS Works" warehouse floor plan). There is deliberately no gallery or videos page.
- `css/base.css` (design tokens, light/dark themes), `css/layout.css` (sidebar shell), `css/components.css` (buttons, cards, chips, toasts), `css/pages/*.css` (one per page or page pair).
- `js/theme-init.js` (classic script in `<head>`, prevents theme flash), `js/main.js` (shared init, imported by every page script), `js/config.js` (name, role, public links, nav menu — **single source of truth**), `js/components/` (layout, icons, theme, time zone, ui helpers, easter egg), `js/pages/` (one script per page).
- The sidebar, mobile top bar and footer are rendered by `js/components/layout.js` from `NAV` in `config.js`. Each page sets `<body data-page="...">` to mark the active link.
- `assets/images/` (favicon).
- `md/README.md` (owner bio), `md/EDITING.md` (how the owner edits the site), `md/CHANGELOG.md` (modification history, header format `Version  Date (DDMMMYYYY)  Name  Description`).
- `temp/` — scratch notes. Never publish or link to anything in it.

## Visual language
- Light: cream `#fbf6ea` background, deep blue `#00446e` accent, safety orange `#e8772e` for decoration only (fails contrast as text). Dark theme tokens are in `css/base.css`.
- Fonts: Abril Fatface (display headings), Work Sans (body), JetBrains Mono (labels, RF scanner).
- Signature motif: warehouse / RF-scanner details (the scanner toy on Home, the "LOC NOT FOUND" 404). Keep additions in that spirit, without overdoing it.

## Owner facts (from the owner; do not embellish)
- WMS Developer: four years on HighJump → Körber → Infios Warehouse Advantage. Advantage Architect (system behaviour, mostly in the RF terminal), WebWise Page Editor (web pages that retrieve data and perform actions), T-SQL (stored procedures behind RF screens, pick/put rules, allocation, putaway). Integrations are deliberately not featured on the site.
- Delivery: requirements gathering, test plans and UAT, Go-Live and cutover, migrations and upgrades, JIRA, documentation, end-user training. Development: SQL/T-SQL, Microsoft SQL Server, C#, C++, HTML, CSS.
- In-house WMS Developer, 2025–present. Implementation Consultant, 2022–2025, with on-site Go-Lives in several countries. Support Engineer Intern (Philippines), 2020. Employers are never named.
- BS Computer Engineering, Mapúa Malayan Colleges Laguna, 2022. Certifications: Warehouse Advantage Certified Professional (2023), Körber Core Technical & Product Training (2023), Warehouse Advantage Certified Associate (2024), Order Management System Certified Associate (2024). Micro-credentials (2024): Körber One, REST Link Advantage, Outbound, Replenishment.
- On-site Go-Lives: Melbourne, Brisbane and Mackay (Australia). Implementation clients in Australia, Thailand, Malaysia and Sri Lanka (countries only; never name clients).
- Developed: Hybrid Scan + Voice Pick (batch/case pick); Advantage Architect publisher/subscriber called from T-SQL; pick/put rules for transfer orders (expiry-date allocation, picking flow); Move to Stock (kitting); Merge MLP (two MLPs into one).
- Filipino, now based in Spain (time zone CET/CEST). The country and time zone may be shown; the city never.
- Interests: calisthenics and the gym (goal: compete in a calisthenics competition in 2027), competitive PC games, travel, building PCs. The owner removed all YouTube content; do not add it back unless asked.
- The only public contact channel is LinkedIn (`LINKS` in `js/config.js`).
- Anything not listed here is unknown — ask, or leave a clearly marked `TODO(owner):` placeholder.

## Privacy rules (owner's explicit decision — do not override)
- The site is public and the repo is public. Never add the owner's email, phone numbers, home city or anything more precise than the country, CV, cover letter, or a contact form/page. The owner shares these privately.
- Never name current or past employers or their cities, and never say or imply the owner is job-seeking ("open to work", "looking for a role", "available", hiring CTAs).
- Never commit PDFs of the CV or cover letter, or copy files from the owner's personal folders into the repo.
- Any image ever added must have EXIF/GPS data stripped and must not show identifying location details.
- If a request would conflict with these rules, stop and ask the owner.

## Ground rules for all agents
- Stay static-first. Do not add a framework, bundler, `package.json`, or backend unless the owner explicitly asks.
- The owner edits this site by hand: keep code commented, readable and consistent with the existing file structure. Personal data belongs in `js/config.js`, not hard-coded in several places.
- Test via a local static server: `python3 -m http.server 8000` from the repo root.
- One-off tooling via `npx` (validators, link checkers, Lighthouse) is fine; do not commit dependencies.
- Never invent experience, employers, metrics, testimonials, or project outcomes.
- When you make a notable change, add a line to `md/CHANGELOG.md` only if the owner asks you to.
- Keep changes small and scoped to your specialty; hand off to the right agent (see `Portfolio Lead`) for the rest.
