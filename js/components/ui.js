/* =============================================================
   ui.js — small shared helpers
   - showToast("Copied!")       pop-up message bottom-right
   - copyText(text, label)      copy to clipboard + toast
   - initReveal()               fade-in elements with [data-reveal]
   - initSpotlight()            glow follows the mouse on .spotlight
   - prefersReducedMotion()     true if the visitor wants less motion
   ============================================================= */

import { icon } from "./icons.js";

export function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Toasts ---------- */

let toastRegion;

export function showToast(message, iconName = "check") {
    if (!toastRegion) {
        toastRegion = document.createElement("div");
        toastRegion.className = "toast-region";
        toastRegion.setAttribute("role", "status");
        toastRegion.setAttribute("aria-live", "polite");
        document.body.append(toastRegion);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `${icon(iconName)}<span></span>`;
    toast.querySelector("span").textContent = message;
    toastRegion.append(toast);

    setTimeout(() => {
        toast.classList.add("is-leaving");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
        // Fallback in case animations are disabled
        setTimeout(() => toast.remove(), 400);
    }, 2600);
}

/* ---------- Clipboard ---------- */

export async function copyText(text, label = "Text") {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`${label} copied to clipboard`);
    } catch (error) {
        showToast(`Couldn't copy — ${text}`, "close");
    }
}

/* ---------- Scroll reveal ---------- */

export function initReveal() {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
}

/* ---------- Mouse spotlight on cards ---------- */

export function initSpotlight() {
    document.addEventListener("pointermove", (event) => {
        const card = event.target.closest?.(".spotlight");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
}
