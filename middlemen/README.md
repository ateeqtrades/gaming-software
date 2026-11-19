# Middlemen

Deal house based in Pakistan, working worldwide. Founders: Dayan Khan, Syed Ahmad Hassan.

## brand/
- `logo/` master SVGs: mark (The Between), wordmark (outlined, Archivo Expanded 800), horizontal and stacked lockups, in Ink (#0B0B0C) and Bone (#ECE8E1).
- `png/` 2400px transparent PNG exports of each.

Palette: Ink, Graphite #151517, Stone #8E8B85, Bone. Chrome is a finish for merch only.
Type: Archivo (wdth 125, wght 800) display, Inter Tight body, Geist Mono labels.
Primary line: "We know people."

## site/
Next.js (static export), GSAP + ScrollTrigger + SplitText, Lenis smooth scroll.

    cd site && npm install && npm run dev      # local
    npm run build                              # static output in site/out

Forms are front end only for now (intro request, drop waitlist); wire to Supabase or email before launch.
Placeholders to replace: founder photos, hello@middlemen.group (domain not yet registered), social links.
