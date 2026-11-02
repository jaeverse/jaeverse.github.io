/* =============================================================
   wms.js — "How a WMS Works" page
   Plays one order through a top-down warehouse (the SVG in
   html/wms.html), one step at a time:
     1 Receiving → 2 Putaway → 3 Order placed → 4 Picking
     → 5 Packing → 6 Loading → 7 Shipping
   Edit STEPS to change the wording. Coordinates match the SVG's
   viewBox (1000 × 620).
   ============================================================= */

import "../main.js";
import { prefersReducedMotion } from "../components/ui.js";

const STEPS = [
    {
        name: "Inbound Order Receiving",
        sub: "Supplier delivery arrives",
        zones: ["receiving"],
        text: "A supplier's truck backs into the inbound dock. Each pallet is unloaded and checked in.",
        system: "Matches what arrived against the expected delivery (purchase order / ASN) and creates the stock in the receiving area.",
        rf: "SCAN PO › SCAN PALLET › CONFIRM QTY",
    },
    {
        name: "Receiving Putaway",
        sub: "Place inventory on the shelves and racks",
        zones: ["receiving", "storage"],
        text: "Received pallets move from the dock into storage, onto the shelves and racks.",
        system: "Suggests the best location using putaway rules such as item size, how fast it sells, and free space.",
        rf: "SCAN PALLET › GO TO LOC › SCAN LOC",
    },
    {
        name: "Order Placed (Customer)",
        sub: "A customer orders online",
        zones: ["orders"],
        text: "A customer places an order. It drops into the WMS order queue.",
        system: "Allocates available stock to the order and turns it into pick tasks.",
        rf: "No scan yet: the system does this part.",
    },
    {
        name: "Outbound Order Picking",
        sub: "Based on the order placed",
        zones: ["storage", "picking"],
        text: "A picker follows the RF Gun from bin to bin, collecting each item on the order.",
        system: "Plans the walking route through the aisles and checks every scan, so the right item leaves the right bin.",
        rf: "SCAN LOC › SCAN ITEM › ENTER QTY",
    },
    {
        name: "Packing",
        sub: "Check, pack and label",
        zones: ["packing"],
        text: "Picked items are checked, packed into a carton and labelled.",
        system: "Verifies the contents and prints the shipping label for the carton.",
        rf: "SCAN ITEM › SCAN CARTON › PRINT LABEL",
    },
    {
        name: "Loading (Truck Loading)",
        sub: "Onto the outbound truck",
        zones: ["loading"],
        text: "The carton is moved to the outbound dock and loaded onto the truck.",
        system: "Confirms each carton is loaded onto the right truck for its route.",
        rf: "SCAN CARTON › SCAN DOCK DOOR",
    },
    {
        name: "Shipping",
        sub: "The order leaves the building",
        zones: ["loading", "shipping"],
        text: "The truck is closed and leaves. The order is on its way to the customer.",
        system: "Confirms the shipment and updates stock, then sends the confirmation back to the business systems.",
        rf: "CLOSE TRUCK › CONFIRM SHIPMENT",
    },
];

// Positions in the SVG
const POS = {
    truckInAway: [-30, 220],
    truckInDock: [130, 220],
    palletOffTruck: [100, 220],
    palletReceived: [225, 220],
    palletInRack: [357, 175],
    ticketFromCustomer: [515, 45],
    ticketInQueue: [520, 525],
    carton: [700, 182],
    truckOutDock: [870, 360],
    truckOutAway: [1120, 360],
};

const PUTAWAY_PATH = [POS.palletReceived, [305, 220], [305, 462], [392, 462], [392, 175], POS.palletInRack];
const PICK_PATH = [[465, 462], [392, 462], [392, 165], [462, 165], [462, 395], [532, 395], [532, 165], [597, 165], [597, 185], [700, 185]];
const LOAD_PATH = [POS.carton, [700, 360], [866, 360]];

const DWELL_MS = 2200; // pause on each finished step while auto-playing

/* ---------- Elements ---------- */

const map = document.getElementById("wms-map");
const zones = [...map.querySelectorAll(".wh-zone")];
const el = {
    truckIn: document.getElementById("wh-truck-in"),
    truckOut: document.getElementById("wh-truck-out"),
    pallet: document.getElementById("wh-pallet"),
    ticket: document.getElementById("wh-ticket"),
    picker: document.getElementById("wh-picker"),
    carton: document.getElementById("wh-carton"),
    shipped: document.getElementById("wh-shipped"),
};
const ui = {
    toggle: document.getElementById("wms-toggle"),
    prev: document.getElementById("wms-prev"),
    next: document.getElementById("wms-next"),
    count: document.getElementById("wms-count"),
    detail: document.getElementById("wms-detail"),
    name: document.getElementById("wms-step-name"),
    text: document.getElementById("wms-step-text"),
    system: document.getElementById("wms-step-system"),
    rf: document.getElementById("wms-step-rf"),
    steps: document.getElementById("wms-steps"),
};

const reduceMotion = prefersReducedMotion();
let current = 0;
let runId = 0;        // bumps whenever a new step starts, so old animations stop
let isPlaying = false;

/* ---------- Drawing helpers ---------- */

function setPos(element, [x, y]) {
    element.setAttribute("transform", `translate(${x} ${y})`);
}

function show(element, visible = true) {
    element.classList.toggle("is-hidden", !visible);
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms));
}

/** Moves an SVG group along a list of points. Stops early if another step starts. */
function moveAlong(element, points, duration, id) {
    return new Promise((resolve) => {
        if (reduceMotion) {
            setPos(element, points[points.length - 1]);
            resolve();
            return;
        }

        const lengths = points.slice(1).map((point, i) => Math.hypot(point[0] - points[i][0], point[1] - points[i][1]));
        const total = lengths.reduce((sum, length) => sum + length, 0);
        const start = performance.now();

        function frame(now) {
            if (id !== runId) return resolve();

            const t = Math.min((now - start) / duration, 1);
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            let distance = eased * total;
            let segment = 0;
            while (segment < lengths.length - 1 && distance > lengths[segment]) {
                distance -= lengths[segment];
                segment += 1;
            }
            const ratio = lengths[segment] ? distance / lengths[segment] : 1;
            const [x1, y1] = points[segment];
            const [x2, y2] = points[segment + 1];
            setPos(element, [x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio]);

            if (t < 1) requestAnimationFrame(frame);
            else resolve();
        }

        requestAnimationFrame(frame);
    });
}

/* ---------- Scene state ----------
   applyState(n) snaps everything to how it looks after n finished steps,
   so any step can be started directly. */

function applyState(done) {
    setPos(el.truckIn, done >= 1 ? POS.truckInDock : POS.truckInAway);

    show(el.pallet, done >= 1);
    setPos(el.pallet, done >= 2 ? POS.palletInRack : POS.palletReceived);

    show(el.ticket, done === 3);
    setPos(el.ticket, POS.ticketInQueue);

    show(el.picker, false);

    show(el.carton, done === 4 || done === 5);
    setPos(el.carton, POS.carton);
    el.carton.classList.toggle("is-sealed", done >= 5);

    setPos(el.truckOut, done >= 7 ? POS.truckOutAway : POS.truckOutDock);
    show(el.shipped, done >= 7);
}

/* ---------- Step animations ---------- */

const ANIMATIONS = [
    async (id) => {
        await moveAlong(el.truckIn, [POS.truckInAway, POS.truckInDock], 1200, id);
        if (id !== runId) return;
        setPos(el.pallet, POS.palletOffTruck);
        show(el.pallet);
        await moveAlong(el.pallet, [POS.palletOffTruck, POS.palletReceived], 900, id);
    },
    async (id) => {
        await moveAlong(el.pallet, PUTAWAY_PATH, 2400, id);
    },
    async (id) => {
        setPos(el.ticket, POS.ticketFromCustomer);
        show(el.ticket);
        await moveAlong(el.ticket, [POS.ticketFromCustomer, POS.ticketInQueue], 1500, id);
    },
    async (id) => {
        show(el.ticket, false);
        setPos(el.picker, PICK_PATH[0]);
        show(el.picker);
        await moveAlong(el.picker, PICK_PATH, 3600, id);
        if (id !== runId) return;
        show(el.picker, false);
        show(el.carton);
    },
    async (id) => {
        await wait(500);
        if (id !== runId) return;
        el.carton.classList.add("is-sealed", "is-bump");
        setTimeout(() => el.carton.classList.remove("is-bump"), 400);
    },
    async (id) => {
        await moveAlong(el.carton, LOAD_PATH, 1700, id);
        if (id === runId) show(el.carton, false);
    },
    async (id) => {
        await moveAlong(el.truckOut, [POS.truckOutDock, POS.truckOutAway], 1600, id);
        if (id === runId) show(el.shipped);
    },
];

/* ---------- Panel ---------- */

function renderStepList() {
    ui.steps.innerHTML = STEPS.map((step, index) => `
        <li>
            <button class="wms-step" type="button" data-step="${index}">
                <span class="wms-step__num">${index + 1}</span>
                <span>${step.name}<span class="wms-step__sub">${step.sub}</span></span>
            </button>
        </li>`).join("");
}

function updatePanel(index) {
    const step = STEPS[index];
    ui.name.textContent = step.name;
    ui.text.textContent = step.text;
    ui.system.textContent = step.system;
    ui.rf.textContent = step.rf;
    ui.count.textContent = `Step ${index + 1} of ${STEPS.length}`;

    ui.steps.querySelectorAll(".wms-step").forEach((button, i) => {
        button.classList.toggle("is-active", i === index);
        button.classList.toggle("is-done", i < index);
        button.setAttribute("aria-current", i === index ? "step" : "false");
    });

    map.classList.add("has-active");
    zones.forEach((zone) => zone.classList.toggle("is-active", step.zones.includes(zone.dataset.zone)));
}

/* ---------- Playback ---------- */

async function runStep(index) {
    const id = ++runId;
    current = index;
    applyState(index);
    updatePanel(index);
    await ANIMATIONS[index](id);
    return id;
}

async function play() {
    isPlaying = true;
    updateToggle();
    let id = await runStep(current);

    while (isPlaying && id === runId) {
        // A real pause even with reduced motion, so steps never flash past
        await new Promise((resolve) => setTimeout(resolve, DWELL_MS));
        if (!isPlaying || id !== runId) return;
        id = await runStep((current + 1) % STEPS.length);
    }
}

function pause() {
    isPlaying = false;
    updateToggle();
}

function updateToggle() {
    ui.toggle.textContent = isPlaying ? "Pause" : "Play";
    // Announce step changes only when the visitor is driving
    ui.detail.setAttribute("aria-live", isPlaying ? "off" : "polite");
}

function goTo(index) {
    pause();
    runStep((index + STEPS.length) % STEPS.length);
}

ui.toggle.addEventListener("click", () => {
    if (isPlaying) {
        pause();
    } else {
        current = (current + 1) % STEPS.length;
        play();
    }
});
ui.prev.addEventListener("click", () => goTo(current - 1));
ui.next.addEventListener("click", () => goTo(current + 1));

ui.steps.addEventListener("click", (event) => {
    const button = event.target.closest(".wms-step");
    if (button) goTo(Number(button.dataset.step));
});

map.addEventListener("click", (event) => {
    const zone = event.target.closest(".wh-zone");
    if (zone) goTo(Number(zone.dataset.step));
});

/* ---------- Start ---------- */

renderStepList();

if (reduceMotion) {
    pause();
    runStep(0);
} else {
    play();
}
