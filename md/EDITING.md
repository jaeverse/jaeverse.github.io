# How to edit Jae's Portfolio

## Preview it on your computer
The site uses JavaScript modules, so double-clicking `index.html` won't work. Run a tiny local server from the project folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. (The VS Code "Live Server" extension also works.)

## Where things live

| I want to change… | Edit this |
|---|---|
| LinkedIn link | `js/config.js` → `LINKS` |
| Name, role, country, time zone | `js/config.js` → `PROFILE` |
| Sidebar menu items | `js/config.js` → `NAV` |
| Home page text, skills, certifications | `index.html` |
| Rotating roles under the headline | `js/pages/home.js` → `ROLES` |
| Fun facts in the RF scanner | `js/pages/home.js` → `FACTS` |
| "How a WMS Works" page steps and wording | `js/pages/wms.js` → `STEPS` (floor plan drawing in `html/wms.html`) |
| Colours and fonts | `css/base.css` (top of the file) |

## Folder map

```
index.html            Home (must stay in the root for GitHub Pages)
404.html              "Page not found" (must stay in the root)
html/                 All other pages
css/                  base.css, layout.css, components.css
css/pages/            Styles for a single page
js/config.js          Your details: one place, used everywhere
js/main.js            Runs on every page
js/components/        Shared pieces (sidebar, icons, theme…)
js/pages/             One script per page
assets/               Favicon
```

## Privacy
This site and its GitHub repo are public. Keep your email, phone numbers, city (the country is fine), CV, cover letter, employer names and any "open to work" wording **off** it. Share those privately.

If you ever add a photo, remove its location data first (Photos app → File → Export → untick "Location information").

## Publishing
Commit and push to `main`. GitHub Pages updates https://jaeverse.github.io within a minute or two.

## Secret
Type ↑ ↑ ↓ ↓ ← → ← → B A on any page.
