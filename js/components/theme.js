/* =============================================================
   theme.js — light / dark mode switching
   (The initial theme is set early by js/theme-init.js.)
   ============================================================= */

const STORAGE_KEY = "jae-theme";

export function getTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        // Storage blocked: the theme still applies for this visit.
    }
}

export function toggleTheme() {
    setTheme(getTheme() === "dark" ? "light" : "dark");
}
