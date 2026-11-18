# Directions: how worlds differ

A house approach (show the mechanism, characters, acting icons, a tour) quickly turns into a
house *look* if every project also gets the same pastel fields, the same rounded sans and the
same round faces on soft plates. The process stays; these eight choices change.

The ids below are what `worlds.json` and `scripts/direction.mjs` use.

## The difference rule

A new project's card must differ from **every** world in `worlds.json` on at least **four**
axes, and one of them must be `palette` or `type`. Never reuse the previous project's type
family or action colour, even when the axis option matches.

## 1. `hero` — what the signature object is made of

| id | What it is | Good when |
|---|---|---|
| `dom-3d` | A 3D object built of real HTML (cards on a wheel, a stack, a carousel in CSS 3D) | the object is made of text people should read |
| `webgl` | A Three.js model with lighting, self-hosted | the object is physical: parcels, buildings, a machine |
| `svg-machine` | A flat SVG machine whose parts move: inputs go in, results come out | the mechanism is a process |
| `board` | A live board or table where items move between columns/stages | the product sorts or progresses things |
| `timeline` | A timeline or map of a day that assembles itself | the product works over time |
| `desk` | A tabletop of real artifacts (documents, receipts, letters) seen from above, being worked on | the product handles paperwork |
| `split` | One input, two outcomes side by side, played live (before / after) | the value is the difference |
| `toy` | A small simulation the visitor plays with (sliders, dragging, dropping) | the value is felt by trying |

## 2. `palette` — how colour is used (still at most four identity colours)

| id | Description |
|---|---|
| `pastel-fields` | Light ground, two pastel section fields, one saturated action colour, one warm accent |
| `saturated-blocks` | Whole sections in strong flat colour; text set in ink or white by measured contrast |
| `mono-accent` | Near-monochrome (one hue, many tints) plus one loud accent used rarely |
| `paper-ink` | Warm paper ground, deep ink, one stamp colour; print feeling |
| `night` | Dark-first: deep tinted ground, luminous accents; light theme as the second set |
| `duotone` | Two inks overprinting on paper (risograph): every illustration in the same two colours |

## 3. `type` — one family, chosen for its voice

| id | Examples (self-host, check the licence) |
|---|---|
| `humanist-sans` | Figtree, Source Sans 3, Open Sans, Nunito Sans |
| `rounded-sans` | Rubik, Nunito, Quicksand (body-safe weights only) |
| `geometric-sans` | Outfit, Plus Jakarta Sans, Manrope, Lexend |
| `grotesk` | Instrument Sans, Schibsted Grotesk, Hanken Grotesk, Archivo |
| `serif-text` | Literata, Newsreader, Source Serif 4, Fraunces at text optical size |
| `slab` | Roboto Slab, Zilla Slab, Bitter |

One family, 400/500 (600 for a wordmark only). Need Arabic, Cyrillic or another script? Check
coverage before choosing; it narrows the list fast.

## 4. `shape` — the shape language of surfaces and controls

| id | Description |
|---|---|
| `soft-plates` | Generous radii (12–24px), floating tiles, pills |
| `sharp` | Square corners or 2–4px radii, hairline rules, a grid you can feel |
| `ticket` | Notched or perforated edges, stamps, stubs |
| `cutout` | Slightly irregular, hand-cut shapes; nothing perfectly rectangular |
| `outline` | Everything drawn with an ink stroke, flat fills, sticker/comic feel |
| `blob` | Organic rounded masses behind content; use with care, it is easy to make generic |

## 5. `characters` — who appears, and how they are drawn

| id | Description | `folk-avatars.js` options |
|---|---|---|
| `round-faces` | Seeded faces in a circle, flat fills | `frame: 'circle'` |
| `square-stickers` | Faces in a rounded square with an ink outline | `frame: 'squircle', outline: true` |
| `line-faces` | Ink line drawing on white, one accent colour | `outline: true, flat: true` |
| `figures` | Whole bodies doing things (build from the face plus a simple body) | `frame: 'none'` |
| `mascot` | An animal or object character carries the story instead of people | (draw your own) |
| `objects-only` | No people; the product's objects act | — |

## 6. `motion` — the personality of movement

| id | Description |
|---|---|
| `springy` | Small overshoots, pops, bounces: a toy |
| `calm-drift` | Slow eases, things float in and settle |
| `stepwise` | Stop-motion: discrete steps, no tweening between |
| `ink-draw` | Lines draw themselves (stroke-dash), fills arrive after |
| `mechanical` | Linear, timed, conveyor-like: machines and clocks |

## 7. `layout` — the page's rhythm

| id | Description |
|---|---|
| `colour-bands` | Full-width bands, one colour per section |
| `editorial` | Columns with a wide margin, notes in the margin, like a printed page |
| `story-column` | One narrow centred column that scrolls like a story, objects inline |
| `asymmetric-split` | Text on one side, a large stage on the other, swapping sides |
| `canvas` | One large continuous scene the page scrolls through |

## 8. `texture` — the surface

| id | Description |
|---|---|
| `flat` | Clean flat colour |
| `grain` | A faint noise over fields |
| `paper` | Paper fibre or a slight warm tone variation |
| `halftone` | Dot patterns for shading |
| `grid` | A faint drawing grid behind the stage |

## Writing the card

```
World:      a print shop at night — every invoice comes off the press checked
Mechanism:  reads each supplier invoice, checks it against the order, flags what is wrong
hero        desk          palette  night        type     slab
shape       ticket        chars    line-faces   motion   stepwise
layout      editorial     texture  halftone
Differs from: morning-round (8 axes), toy-planet (8 axes)
```

The world line is the part that makes the choices hang together. If the axes do not agree
with it, change the axes, not the world.
