# SANDY.SYSDEV v2.0 — retro dev-station

Awwwards-style retro arcade portfolio for **Sandy E. Quintero**, rebuilt from the ground up
with **React 19 + GSAP (ScrollTrigger) + Three.js**, themed on the sanblue logo palette
(navy, gold, pink, mint, cyan, purple) fused with '80s CRT arcade aesthetics.

**Live:** https://sanbluedot.com

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production bundle in dist/
```

## What's inside

| Section | Interaction |
| --- | --- |
| Preloader | CRT boot sequence (SANDY_OS BIOS check + progress bar) |
| Hero | Pixel starfield canvas, typewriter, **interactive 3D Rubik's cube** — drag to spin, click to twist a layer |
| Arcade Station | **Three.js sphere gallery** — look around from inside a sphere of game cartridges (drag + inertia), tap a READY one → zoom → **Rubik's cube cartridge loader** → playable **Pac-Toe** vs ghost AI |
| Reception Desk | Bio, languages, certification vault, education cards, **SKILLS.EXE** system disk (dashed-gradient power bars with count-up scores) — GSAP scroll reveals |
| Career Timeline | Scroll-scrubbed gradient rail, alternating XP cards |
| Analytics Desk | **Research showcase** — published book with Zenodo DOI, real-data financial dashboard (GSAP build sequence), plus a compound-interest calculator with animated counters + live SVG growth chart |
| TV Studio | Working CRT static (canvas noise), rotating channel knob, power switch, 4 channels — channel 01 plays the Cat-Bot station intro; channel 02 is reserved for the research film |
| System Room | Illustrative GitHub grid and sample commit console (not live activity), **Mail Room Terminal** that opens a draft in the visitor's email app; delivery is not tracked |

All sound effects are synthesized WebAudio chiptune beeps (no assets); mute toggle in the header.

---

© 2026 Sandy E. Quintero — sanblueᵈᵒᵗ · retro dev-station
