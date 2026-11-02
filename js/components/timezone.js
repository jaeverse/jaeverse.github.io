/* =============================================================
   timezone.js — my time zone (Spain) and current local time
   Fills any element on the page marked with:
     data-tz-abbr    → CET in winter, CEST in summer
     data-tz-offset  → UTC+1 / UTC+2
     data-tz-time    → current local time, e.g. 14:05
   ============================================================= */

import { PROFILE } from "../config.js";

function zonePart(now, style) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: PROFILE.location.timeZone,
        timeZoneName: style,
    })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName").value;
}

export function getTimeZoneInfo(now = new Date()) {
    return {
        abbr: zonePart(now, "short"),                              // "CET"
        offset: zonePart(now, "shortOffset").replace("GMT", "UTC"), // "UTC+1"
        time: new Intl.DateTimeFormat("en-GB", {
            timeZone: PROFILE.location.timeZone,
            hour: "2-digit",
            minute: "2-digit",
        }).format(now),
    };
}

function render() {
    const info = getTimeZoneInfo();
    document.querySelectorAll("[data-tz-abbr]").forEach((el) => (el.textContent = info.abbr));
    document.querySelectorAll("[data-tz-offset]").forEach((el) => (el.textContent = info.offset));
    document.querySelectorAll("[data-tz-time]").forEach((el) => (el.textContent = info.time));
}

/** Updates every time-zone element now and every 30 seconds. */
export function startTimeZone() {
    render();
    setInterval(render, 30_000);
}
