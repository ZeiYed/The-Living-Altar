# Living Altar — Session Handover

## Project
Retreat website for The Living Altar, Casa Prema, Portugal, August 13–17 2026.
Two files: `index.html` (landing page) and `booking.html` (booking/room picker page).
Deployed on Vercel. User pushes via GitHub Desktop — never push from terminal.

---

## Critical Rules
- All CSS changes are mobile-only inside `@media (max-width: 600px)` UNLESS explicitly stated as desktop
- Do NOT push to GitHub — user handles this themselves
- Do NOT remove or move the fixed CTA button (`#reserve-fixed`) from its floating position
- When working desktop, don't touch mobile. When working mobile, don't touch desktop
- Never use em dashes (—) in any copy

---

## Current State (uncommitted changes in working tree)

All changes below are **not yet pushed to GitHub** — they exist only in the local files.

### index.html changes since last commit
- Footer `padding-bottom`: 22px → 32px
- `.footer-contacts-row` `margin-top`: -20px → 0px
- `.footer-copy` `bottom`: 0 → -20px
- Footer logo: 160px → 128px (inline style)
- Hard-refresh scroll-to-top JS removed (browser now restores scroll position)
- Accommodation list `max-width`: 680px → 820px
- Root room description: "garden" → "land" (two instances)
- Experience section: all `margin-right` offsets removed from `exp-title` inline styles, all `margin-top: calc()` values restored to originals (reverted mobile bleed into desktop)
- Desktop footer social: `padding-top: 20px`, individual handle offsets (`a:nth-child(1) { left: 20px }`, `a:nth-child(2) { left: 10px }`)
- Mobile footer social: `padding-top: 0 !important`, nth-child left offsets neutralised
- Mobile CTA button: `padding: 18px 52px`, `font-size: 9.2px` (was 15px/43px/7.7px)
- Mobile nav bar: `height: 60px; padding: 0 20px` (was `padding: 18px 20px`)
- Mobile CTA `top`: 12px → 6px (to align with hamburger center in 60px bar)
- Mobile footer logo: 69px → 83px
- Mobile Instagram icons: 22px → 26px
- Mobile accommodation `acc-preview-desc` now visible (was `display: none`), `font-size: 11px`
- Mobile `.accom-acc .acc-title-wrap`: `margin-top: -8px; gap: 1px`
- Mobile `.accom-acc .acc-chakra`: `font-size: 10px !important`

### booking.html changes since last commit
- Footer `padding-bottom`: 22px → 32px
- `.footer-contacts-row` `margin-top`: -20px → 0px
- `.footer-copy` `bottom`: 0 → -20px
- Footer logo: 160px → 128px (inline style)
- Footer `max-width`: 1200px (restored from 940px)
- Desktop footer social: `padding-top: 20px`, nth-child offsets same as index.html
- Mobile footer social: `padding-top: 0 !important`, nth-child offsets neutralised
- Mobile footer logo: 69px → 83px
- Mobile Instagram icons: 22px → 26px
- `.rp-desc`: `white-space: normal; overflow: visible; max-width: 300px` (was nowrap/hidden/ellipsis)
- Root room: "Direct garden access" → "Direct land access"
- Mobile `.rp-header`: `padding-top: 70px` added (space between back button and header text)

---

## Key CSS Architecture

### Desktop footer (both pages)
3-column CSS grid: `1fr auto 1fr`
- Col 1: `.footer-logo-wrap` (`justify-self: start`)
- Col 2: `.footer-center` (contacts + copyright, `auto` width)
- Col 3: `.footer-social` (`justify-self: end`, `padding-top: 20px`)
- Individual desktop handle offsets: `a:nth-child(1) { position: relative; left: 20px }`, `a:nth-child(2) { left: 10px }`
- `.footer-copy`: `position: absolute; left: 50%; bottom: -20px; transform: translateX(-50%)`

### Mobile footer (both pages, inside `@media (max-width: 600px)`)
2-column CSS grid: `auto auto`, `justify-content: center`
- Row 1: `.footer-center` spans full width (contacts side by side)
- Row 2 col 1: `.footer-logo-wrap` (centered)
- Row 2 col 2: `.footer-social` (centered, `padding-top: 0 !important`)
- Logo: 83px, Instagram SVG icons: 26px

### Mobile nav (index.html)
- `#mobile-nav`: `position: fixed; height: 60px; padding: 0 20px; align-items: center`
- Hamburger on left, CTA on right — both centered at 30px from top
- `#reserve-fixed` on mobile: `top: 6px; right: 2px; padding: 18px 52px; font-size: 9.2px`

### Accommodation accordion (index.html)
- Desktop: `max-width: 820px`, images in 2×2 grid (`gap: 5px`), titles 36px, chakra 12px
- Mobile: thumb 120×86px, `acc-preview-desc` visible at 11px, title-wrap `margin-top: -8px`, chakra 10px

### Experience section (index.html)
- Desktop HTML inline styles: all `exp-title` elements have only `margin-top` (no `margin-right`)
- Mobile overrides in `@media (max-width: 600px)`: `.exp-title { width: 140px; margin-right: -20px }` etc.

### booking.html `.rp-desc`
- `white-space: normal; overflow: visible; max-width: 300px`
- Hidden on mobile: `display: none` at line ~851

---

## Pending / Watch Out
- User has not pushed any of the current session's changes to GitHub yet
- The Instagram handle alignment on desktop was a recurring pain point — the nth-child `left` offsets are the current solution (uXu: 20px, Awakening Prema: 10px)
- The `acc-preview-desc` on mobile (index.html) — check if the card height looks right on real device
- booking.html `body.picker-mode` hides `#book-hero` and shows `#room-picker` — test both states on mobile
