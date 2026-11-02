/* =============================================================
   main.js — runs on every page
   Page-specific scripts (js/pages/*.js) import this first.
   ============================================================= */

import { renderLayout } from "./components/layout.js";
import { hydrateIcons } from "./components/icons.js";
import { initReveal, initSpotlight } from "./components/ui.js";
import { initEasterEgg } from "./components/easter-egg.js";

renderLayout();
hydrateIcons();
initReveal();
initSpotlight();
initEasterEgg();
