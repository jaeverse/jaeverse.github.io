/* =============================================================
   easter-egg.js
   Type the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) on any page
   for a confetti "GG". Because every portfolio needs one.
   ============================================================= */

import { showToast, prefersReducedMotion } from "./ui.js";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const COLORS = ["#e8772e", "#00446e", "#7cc4ef", "#4ade80", "#facc15", "#f472b6"];

function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:300";
    document.body.append(canvas);

    const context = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    context.scale(ratio, ratio);

    const pieces = Array.from({ length: 160 }, () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        velocityX: (Math.random() - 0.5) * 18,
        velocityY: Math.random() * -16 - 4,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const startTime = performance.now();

    function frame(now) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        pieces.forEach((piece) => {
            piece.velocityY += 0.45; // gravity
            piece.velocityX *= 0.99; // air resistance
            piece.x += piece.velocityX;
            piece.y += piece.velocityY;
            piece.rotation += piece.spin;

            context.save();
            context.translate(piece.x, piece.y);
            context.rotate(piece.rotation);
            context.fillStyle = piece.color;
            context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
            context.restore();
        });

        if (now - startTime < 3500) {
            requestAnimationFrame(frame);
        } else {
            canvas.remove();
        }
    }

    requestAnimationFrame(frame);
}

export function initEasterEgg() {
    let position = 0;

    document.addEventListener("keydown", (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        position = key === KONAMI[position] ? position + 1 : key === KONAMI[0] ? 1 : 0;

        if (position === KONAMI.length) {
            position = 0;
            if (!prefersReducedMotion()) launchConfetti();
            showToast("GG WP! Secret unlocked: +100 XP 🎮");
        }
    });
}
