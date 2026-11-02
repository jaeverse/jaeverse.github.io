/* =============================================================
   config.js — YOUR DETAILS LIVE HERE
   The sidebar and footer read from this file.
   Change something here and it updates everywhere.

   PRIVACY: this website is public. Do not put your email, phone
   numbers, home city, CV, employer names or job-search status
   here. Share those privately, only with people you choose.
   ============================================================= */

export const PROFILE = {
    siteName: "Jae's Portfolio",
    fullName: "Jasonne D. Loresca",
    nickname: "Jae",
    role: "WMS Developer",

    location: {
        country: "Spain",
        flag: "🇪🇸",
        timeZone: "Europe/Madrid", // drives the CET / CEST time zone display
    },
};

export const LINKS = {
    linkedin: "https://www.linkedin.com/in/jdloresca/",
};

// Sidebar menu. "page" must match <body data-page="..."> on that page.
// Items with "children" become a dropdown.
export const NAV = [
    { label: "Home", href: "/", page: "home", icon: "home" },
    { label: "How a WMS Works", href: "/html/wms.html", page: "wms", icon: "package" },
];
