/* =============================================================
   layout.js
   Builds the parts every page shares, so they live in one place:
   - the left sidebar (menu, time zone, theme toggle, links)
   - the mobile top bar with the menu button
   - the footer
   To add or rename a menu item, edit NAV in js/config.js.
   ============================================================= */

import { PROFILE, LINKS, NAV } from "../config.js";
import { icon } from "./icons.js";
import { toggleTheme } from "./theme.js";
import { startTimeZone } from "./timezone.js";

const currentPage = document.body.dataset.page;

/* ---------- HTML builders ---------- */

function brandHTML() {
    return `
        <a class="brand" href="/">
            <span class="brand__mark" aria-hidden="true">J</span>
            <span class="brand__text">
                <span class="brand__name">${PROFILE.siteName}</span>
                <span class="brand__role">${PROFILE.role}</span>
            </span>
        </a>`;
}

function navLinkHTML(item) {
    const isActive = item.page === currentPage;
    return `
        <li>
            <a class="nav__link${isActive ? " is-active" : ""}" href="${item.href}"${isActive ? ' aria-current="page"' : ""}>
                ${icon(item.icon)}<span>${item.label}</span>
            </a>
        </li>`;
}

function navGroupHTML(item, index) {
    const isOpen = item.children.some((child) => child.page === currentPage);
    const menuId = `nav-group-${index}`;
    return `
        <li class="nav__group${isOpen ? " is-open" : ""}">
            <button class="nav__link nav__toggle" type="button" aria-expanded="${isOpen}" aria-controls="${menuId}">
                ${icon(item.icon)}<span>${item.label}</span>${icon("chevron-down", "icon nav__chevron")}
            </button>
            <div class="nav__submenu" id="${menuId}">
                <ul class="nav">${item.children.map(navLinkHTML).join("")}</ul>
            </div>
        </li>`;
}

function sidebarHTML() {
    const navItems = NAV.map((item, index) => (item.children ? navGroupHTML(item, index) : navLinkHTML(item))).join("");

    return `
        <div class="sidebar__inner">
            <div class="sidebar__head">
                ${brandHTML()}
                <button class="icon-btn sidebar__close" id="menu-close" type="button" aria-label="Close menu">${icon("close")}</button>
            </div>

            <nav aria-label="Main">
                <p class="nav__label">Menu</p>
                <ul class="nav">${navItems}</ul>
            </nav>


            <div class="sidebar__foot">
                <div class="tz-card">
                    <p class="tz-card__label">Time zone</p>
                    <p class="tz-card__zone"><span data-tz-abbr>CET</span> <span class="tz-card__offset" data-tz-offset>UTC+1</span></p>
                    <p class="tz-card__local">${PROFILE.location.country} ${PROFILE.location.flag} · <span data-tz-time>--:--</span> local</p>
                </div>

                <div class="sidebar__tools">
                    <button class="icon-btn theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">
                        ${icon("sun", "icon icon-sun")}${icon("moon", "icon icon-moon")}
                    </button>
                    <a class="icon-btn" href="${LINKS.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)">${icon("linkedin")}</a>
                </div>
            </div>
        </div>`;
}

function topbarHTML() {
    return `
        ${brandHTML()}
        <button class="icon-btn" id="menu-open" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">${icon("menu")}</button>`;
}

function footerHTML() {
    const year = new Date().getFullYear();
    return `
        <div class="footer__inner">
            <span>© ${year} ${PROFILE.fullName}. Hand-built with HTML, CSS &amp; JavaScript.</span>
            <span>Psst… try <kbd>↑</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd><kbd>←</kbd><kbd>→</kbd><kbd>B</kbd><kbd>A</kbd></span>
        </div>`;
}

/* ---------- Behaviour ---------- */

function setupDropdowns(sidebar) {
    sidebar.querySelectorAll(".nav__toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const group = toggle.closest(".nav__group");
            const isOpen = group.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    });
}

function setupMobileDrawer(sidebar) {
    const openButton = document.getElementById("menu-open");
    const closeButton = document.getElementById("menu-close");
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    document.body.append(scrim);

    function open() {
        sidebar.classList.add("is-open");
        scrim.classList.add("is-visible");
        document.body.classList.add("is-locked");
        openButton.setAttribute("aria-expanded", "true");
        closeButton.focus();
    }

    function close() {
        if (!sidebar.classList.contains("is-open")) return;
        sidebar.classList.remove("is-open");
        scrim.classList.remove("is-visible");
        document.body.classList.remove("is-locked");
        openButton.setAttribute("aria-expanded", "false");
        openButton.focus();
    }

    openButton.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    });
}

/* ---------- Public ---------- */

export function renderLayout() {
    const sidebar = document.getElementById("sidebar");
    const topbar = document.getElementById("topbar");
    const footer = document.getElementById("footer");

    if (sidebar) {
        sidebar.innerHTML = sidebarHTML();
        setupDropdowns(sidebar);
        sidebar.querySelector("#theme-toggle").addEventListener("click", toggleTheme);
    }

    if (topbar) {
        topbar.innerHTML = topbarHTML();
    }

    if (sidebar && topbar) {
        setupMobileDrawer(sidebar);
    }

    if (footer) {
        footer.innerHTML = footerHTML();
    }

    startTimeZone();
    applyLinks();
}

/* Links marked data-link="linkedin" (etc.) get their URL from LINKS in config.js,
   so it only has to be changed in one place. */
function applyLinks() {
    document.querySelectorAll("[data-link]").forEach((link) => {
        const url = LINKS[link.dataset.link];
        if (url) {
            link.href = url;
            link.hidden = false;
        }
    });
}
