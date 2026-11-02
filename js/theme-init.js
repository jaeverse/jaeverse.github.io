/* =============================================================
   theme-init.js
   Runs in <head> before the page paints, so a dark-mode visitor
   never sees a flash of the light theme. Kept tiny on purpose.
   ============================================================= */
(function () {
    var theme;
    try {
        theme = localStorage.getItem("jae-theme");
    } catch (error) {
        // Storage can be blocked (private mode); fall back to the system setting.
    }
    if (theme !== "light" && theme !== "dark") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.add("js");
})();
