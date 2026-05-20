import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "..", "public", "images", "participants");

mkdirSync(outDir, { recursive: true });

const realPortraits = [
  ["r01", "#d6ecff", "#8db4d8", "#f2c6a8", "#1f2937", "#27364f", "Mina"],
  ["r02", "#fff0d8", "#d5a15d", "#d9a783", "#2b211c", "#6c3f2a", "Kaito"],
  ["r03", "#e7f8ed", "#7cbf95", "#e4b190", "#3b2b24", "#1f5134", "Sora"],
  ["r04", "#f0e8ff", "#a894d8", "#c98d72", "#171923", "#473b72", "Rina"],
  ["r05", "#e9f2ff", "#7f9fca", "#c58f69", "#222831", "#294267", "Ren"],
  ["r06", "#fff5e9", "#dda86e", "#e7b691", "#39271f", "#6b3b2e", "Yui"],
  ["r07", "#ddf5f4", "#73b7b1", "#cf9f7a", "#111827", "#285c5a", "Leo"],
  ["r08", "#f4ecdf", "#b78c65", "#d0a07d", "#2c241d", "#593c2d", "Aki"],
  ["r09", "#edf4ff", "#93b4e8", "#deb18e", "#20202a", "#283c6b", "Noa"],
  ["r10", "#fff1f5", "#d7899e", "#be866e", "#201a1d", "#6c3749", "Mao"],
];

const fakePortraits = [
  ["f01", "#e9f7ff", "#73a5d8", "#efc5a7", "#151f2e", "#31466d", "Niko"],
  ["f02", "#fff3db", "#d8a25f", "#d9aa88", "#2f241c", "#764526", "Lena"],
  ["f03", "#e8faef", "#70be8d", "#dca882", "#2b201d", "#255638", "Kai"],
  ["f04", "#f1eaff", "#a18dd9", "#c78c72", "#1c1b24", "#4c3d78", "Mika"],
  ["f05", "#eaf3ff", "#809fd0", "#c68f6b", "#232833", "#2a426e", "Theo"],
  ["f06", "#fff6ea", "#dca672", "#e7b28e", "#37251e", "#74402c", "Emi"],
  ["f07", "#dff5f2", "#73b4ae", "#d0a17c", "#151923", "#28605f", "Jin"],
  ["f08", "#f5eddf", "#b98c63", "#d3a17f", "#2c231c", "#64412c", "Nana"],
  ["f09", "#edf5ff", "#8fb4e7", "#dfb18d", "#1f2028", "#314171", "Rio"],
  ["f10", "#fff0f5", "#d889a3", "#bd866d", "#201a1d", "#71394b", "Sara"],
];

function mulberry32(seed) {
  return function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pixelNoise(id, fake) {
  const rng = mulberry32([...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0));
  const blocks = [];
  const count = fake ? 34 : 12;
  for (let i = 0; i < count; i += 1) {
    const x = Math.floor(rng() * 860) + 20;
    const y = Math.floor(rng() * 620) + 22;
    const size = fake ? Math.floor(rng() * 8) + 3 : Math.floor(rng() * 4) + 2;
    const opacity = fake ? (0.06 + rng() * 0.12).toFixed(2) : (0.03 + rng() * 0.04).toFixed(2);
    const color = fake && i % 3 === 0 ? "#47d8ff" : fake && i % 4 === 0 ? "#ff5d94" : "#ffffff";
    blocks.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="1" fill="${color}" opacity="${opacity}"/>`);
  }
  return blocks.join("");
}

function makeSvg([id, bgA, bgB, skin, hair, shirt, name], fake = false) {
  const initial = name.slice(0, 1).toUpperCase();
  const asymEar = fake ? 13 : 0;
  const fringe = fake ? `
    <path d="M355 277 C365 174 534 174 545 277 C553 356 513 421 451 426 C385 419 346 352 355 277Z" fill="none" stroke="#39d9ff" stroke-width="6" opacity=".42" transform="translate(8 -2)"/>
    <path d="M355 277 C365 174 534 174 545 277 C553 356 513 421 451 426 C385 419 346 352 355 277Z" fill="none" stroke="#ff4f89" stroke-width="5" opacity=".35" transform="translate(-7 3)"/>
  ` : "";
  const fakeGrid = fake ? `
    <g opacity=".20">
      <path d="M318 210 H590" stroke="#ffffff" stroke-width="2" stroke-dasharray="7 14"/>
      <path d="M329 380 H578" stroke="#ffffff" stroke-width="2" stroke-dasharray="5 18"/>
      <path d="M456 160 V439" stroke="#47d8ff" stroke-width="2" stroke-dasharray="6 13"/>
    </g>
    <rect x="361" y="286" width="54" height="8" fill="#48d8ff" opacity=".22"/>
    <rect x="493" y="330" width="42" height="7" fill="#ff5d94" opacity=".18"/>
  ` : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" role="img" aria-label="Video call participant ${id}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bgA}"/>
      <stop offset="1" stop-color="${bgB}"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".5"/>
      <stop offset="1" stop-color="#000000" stop-opacity=".16"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#111827" flood-opacity=".22"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="${fake ? ".9" : ".55"}" numOctaves="2" seed="${fake ? "8" : "3"}"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 ${fake ? ".08" : ".035"}"/>
      </feComponentTransfer>
      <feBlend mode="soft-light" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="900" height="675" fill="url(#bg)"/>
  <g opacity=".28">
    <rect x="66" y="56" width="188" height="116" rx="8" fill="#ffffff" opacity=".22"/>
    <rect x="642" y="82" width="178" height="102" rx="8" fill="#ffffff" opacity=".14"/>
    <rect x="96" y="480" width="168" height="88" rx="8" fill="#ffffff" opacity=".13"/>
    <path d="M0 520 C156 484 241 556 370 520 C512 481 644 510 900 454 V675 H0Z" fill="#ffffff" opacity=".14"/>
  </g>
  <g filter="url(#soft)">
    <path d="M271 652 C287 539 344 492 450 492 C556 492 615 539 631 652Z" fill="${shirt}"/>
    <path d="M365 469 C370 514 532 514 536 469 L520 441 C501 462 399 462 380 441Z" fill="${skin}"/>
    <path d="M337 280 C332 191 386 133 453 133 C520 133 571 191 564 281 L548 318 C536 206 373 207 354 320Z" fill="${hair}"/>
    ${fringe}
    <ellipse cx="333" cy="311" rx="25" ry="39" fill="${skin}" opacity=".96"/>
    <ellipse cx="${567 + asymEar}" cy="311" rx="${fake ? 18 : 25}" ry="${fake ? 35 : 39}" fill="${skin}" opacity=".96"/>
    <path d="M355 277 C365 174 534 174 545 277 C553 356 513 421 451 426 C385 419 346 352 355 277Z" fill="${skin}"/>
    <path d="M355 277 C365 174 534 174 545 277 C553 356 513 421 451 426 C385 419 346 352 355 277Z" fill="url(#shade)" opacity=".28"/>
    <path d="M352 273 C372 172 531 174 548 276 C531 242 505 223 478 220 C435 216 393 224 352 273Z" fill="${hair}"/>
    <path d="M377 286 C394 276 415 276 432 287" fill="none" stroke="${hair}" stroke-width="8" stroke-linecap="round" opacity=".72"/>
    <path d="M471 286 C488 276 510 277 526 288" fill="none" stroke="${hair}" stroke-width="8" stroke-linecap="round" opacity=".72"/>
    <ellipse cx="405" cy="316" rx="8" ry="${fake ? 8 : 10}" fill="#111827"/>
    <ellipse cx="${fake ? 500 : 498}" cy="316" rx="${fake ? 8 : 9}" ry="10" fill="#111827"/>
    <path d="M451 321 C446 348 441 358 452 366" fill="none" stroke="#9d624d" stroke-width="5" stroke-linecap="round" opacity=".45"/>
    <path d="M410 389 C431 407 475 408 496 389" fill="none" stroke="#7f463b" stroke-width="7" stroke-linecap="round"/>
    <path d="M362 263 C388 223 506 220 541 266" fill="none" stroke="#ffffff" stroke-width="4" opacity=".16"/>
    ${fakeGrid}
  </g>
  <g opacity=".86">
    <rect x="28" y="28" width="194" height="50" rx="25" fill="#0f172a" opacity=".52"/>
    <circle cx="58" cy="53" r="10" fill="${fake ? "#f97373" : "#36d399"}"/>
    <text x="78" y="59" font-family="Inter, Arial, sans-serif" font-size="18" fill="#ffffff" opacity=".92">${fake ? "Reconnecting" : "Live"}</text>
  </g>
  <g opacity=".78">
    <rect x="718" y="30" width="154" height="46" rx="23" fill="#0f172a" opacity=".45"/>
    <text x="746" y="59" font-family="Inter, Arial, sans-serif" font-size="18" fill="#ffffff">${fake ? "720p" : "HD"}</text>
    <circle cx="836" cy="53" r="8" fill="#ffffff" opacity=".45"/>
  </g>
  <rect width="900" height="675" fill="#000000" opacity="${fake ? ".06" : ".025"}" filter="url(#grain)"/>
  ${pixelNoise(id, fake)}
  <g>
    <rect x="30" y="585" width="252" height="56" rx="10" fill="#111827" opacity=".76"/>
    <circle cx="61" cy="613" r="17" fill="#334155"/>
    <text x="61" y="620" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${initial}</text>
    <text x="90" y="619" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${name}</text>
  </g>
</svg>`;
}

for (const portrait of realPortraits) {
  writeFileSync(join(outDir, `${portrait[0]}.svg`), makeSvg(portrait, false));
}

for (const portrait of fakePortraits) {
  writeFileSync(join(outDir, `${portrait[0]}.svg`), makeSvg(portrait, true));
}
