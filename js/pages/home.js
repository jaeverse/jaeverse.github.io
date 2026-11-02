/* =============================================================
   home.js — interactive bits on the Home page
   1. Typewriter that cycles through my roles
   2. RF scanner toy that "picks" fun facts
   3. Number counters that count up when visible
   4. Flip cards for interests
   ============================================================= */

import "../main.js";
import { prefersReducedMotion } from "../components/ui.js";
import { icon } from "../components/icons.js";

/* ---------- 1. Typewriter ---------- */

// Edit this list to change the rotating roles under the headline.
const ROLES = [
    "WMS Developer",
    "T-SQL problem solver",
    "Go-Live survivor",
];

function startTypewriter() {
    const element = document.getElementById("typewriter");
    if (!element) return;

    // Reduced motion: just swap the words every few seconds.
    if (prefersReducedMotion()) {
        let index = 0;
        setInterval(() => {
            index = (index + 1) % ROLES.length;
            element.textContent = ROLES[index];
        }, 3000);
        return;
    }

    let roleIndex = 0;
    let charIndex = ROLES[0].length;
    let isDeleting = true;

    function tick() {
        const role = ROLES[roleIndex];
        charIndex += isDeleting ? -1 : 1;
        element.textContent = role.slice(0, charIndex);

        let delay = isDeleting ? 40 : 85;

        if (!isDeleting && charIndex === role.length) {
            delay = 1800; // pause on the full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % ROLES.length;
            delay = 300;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 2200);
}

/* ---------- 2. RF scanner ---------- */

// Each scan "picks" one of these fun facts. Add your own!
const FACTS = [
    { loc: "GYM-BAR-02", desc: "Calisthenics and gym sessions keep me sane." },
    { loc: "PC-RANKED", desc: "Competitive PC gamer. Ask me about clutch rounds." },
    { loc: "JAE-HQ-01", desc: "Friends call me Jae. Jasonne is for paperwork." },
    { loc: "COMP-2027", desc: "Training to compete in a calisthenics competition in 2027." },
];

// Every Nth scan fails, the way real labels sometimes do.
const FAIL_EVERY = 6;

function startScanner() {
    const scanner = document.getElementById("scanner");
    if (!scanner) return;

    const screen = document.getElementById("scanner-screen");
    const fields = {
        loc: document.getElementById("scan-loc"),
        item: document.getElementById("scan-item"),
        desc: document.getElementById("scan-desc"),
        qty: document.getElementById("scan-qty"),
        status: document.getElementById("scan-status"),
    };
    const scanButton = document.getElementById("scan-button");
    const soundButton = document.getElementById("scan-sound");

    buildBarcode(document.getElementById("barcode"));

    let scanCount = 0;
    let order = shuffle([...FACTS.keys()]);
    let soundOn = false;
    let isBusy = false;

    soundButton.addEventListener("click", () => {
        soundOn = !soundOn;
        soundButton.setAttribute("aria-pressed", String(soundOn));
        soundButton.innerHTML = icon(soundOn ? "volume" : "volume-x");
        if (soundOn) beep(1800, 0.06);
    });

    scanButton.addEventListener("click", () => {
        if (isBusy) return;
        isBusy = true;
        scanCount += 1;

        scanner.classList.remove("is-ok", "is-error");
        scanner.classList.add("is-scanning");
        fields.status.textContent = "> SCANNING...";

        setTimeout(() => {
            scanner.classList.remove("is-scanning");
            screen.classList.remove("is-flashing");
            void screen.offsetWidth; // restart the flash animation
            screen.classList.add("is-flashing");

            if (scanCount % FAIL_EVERY === 0) {
                scanner.classList.add("is-error");
                fields.status.textContent = "✖ LABEL UNREADABLE — RE-SCAN";
                if (soundOn) beep(220, 0.25);
            } else {
                if (order.length === 0) order = shuffle([...FACTS.keys()]);
                const index = order.pop();
                const fact = FACTS[index];

                scanner.classList.add("is-ok");
                fields.loc.textContent = fact.loc;
                fields.item.textContent = `JAE-${String(index + 1).padStart(4, "0")}`;
                fields.desc.textContent = fact.desc;
                fields.qty.textContent = "1 / 1";
                fields.status.textContent = `✔ SCAN OK · ${scanCount} picked`;
                if (soundOn) beep(1800, 0.08);
            }

            isBusy = false;
        }, prefersReducedMotion() ? 50 : 500);
    });
}

function buildBarcode(container) {
    if (!container) return;
    // Bar widths come from the letters of my name, so the barcode is always the same.
    const pattern = "JASONNELORESCA".split("").flatMap((letter) => {
        const code = letter.charCodeAt(0);
        return [(code % 3) + 1, (code % 2) + 1, ((code >> 2) % 3) + 1];
    });
    container.innerHTML = pattern
        .map((width, index) => `<span style="width:${width * 2}px;${index % 2 ? "background:transparent" : ""}"></span>`)
        .join("");
}

let audioContext;

function beep(frequency, duration) {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.04; // quiet!
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ---------- 3. Counters ---------- */

function startCounters() {
    const counters = document.querySelectorAll("[data-count-to]");
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            countUp(entry.target, Number(entry.target.dataset.countTo));
        });
    }, { threshold: 0.6 });

    counters.forEach((counter) => {
        counter.textContent = "0";
        observer.observe(counter);
    });
}

function countUp(element, target) {
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

/* ---------- 4. Flip cards ---------- */

// Focus moves to the face that just became visible (after the half-turn).
const HALF_TURN_MS = 320;

function setupFlipCards() {
    document.querySelectorAll(".interest").forEach((card) => {
        const front = card.querySelector(".interest__front");
        const unflip = card.querySelector(".interest__unflip");

        front.addEventListener("click", () => {
            card.classList.add("is-flipped");
            setTimeout(() => unflip.focus({ preventScroll: true }), HALF_TURN_MS);
        });

        unflip.addEventListener("click", () => {
            card.classList.remove("is-flipped");
            setTimeout(() => front.focus({ preventScroll: true }), HALF_TURN_MS);
        });
    });
}

/* ---------- Start ---------- */

startTypewriter();
startScanner();
startCounters();
setupFlipCards();
