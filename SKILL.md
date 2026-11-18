---
name: joyful-product-design
description: A process for designing or redesigning a product's website and app (landing page, dashboard, app shell, icons, characters, motion, logo, marketing copy) so it feels alive and joyful without looking like AI slop or like the last product you designed. Use for any UI design or redesign, "make it look better / fun / alive", a new logo, icons, illustrations or animation work. Each project gets its OWN world: a direction is picked on several axes and checked against previous projects before anything is drawn.
---

# Joyful product design

A way of working, not a look to copy. Two things make a product page feel made rather than
generated: **it shows the product's real mechanism with real data**, and **it has a world of
its own**. This skill gives a process for both, a set of techniques (acting icons, drawn
characters, character scenes, an animated tour), and a guard against the most common failure
of a house style: every product ending up looking like the previous one.

Pair it with a general frontend-quality skill if one is installed (for example `impeccable` or
`frontend-design`). Their bans hold here too: no label above a heading, no gradient text, no
monospace as a costume, no grid of identical cards as the page, no emoji as icons.

## Files

- `references/taste.md` — the taste this skill was built on (what was liked and rejected in
  real reviews). Read it first; the owner of the project you are working on may override it.
- `references/directions.md` — the axes a world varies on, with options, and the
  difference rule.
- `worlds.json` — the worlds already shipped with this skill. Add yours when you finish.
- `scripts/direction.mjs` — proposes a direction for a product that differs from every
  world in `worlds.json`: `node scripts/direction.mjs "Product name" "what it does"`.
- `references/animated-icons.md` — icons that act out the sentence beside them.
- `references/character-scenes.md` — one recurring character acting out each point, with
  moods, timing and the SMIL gotchas found doing it.
- `references/folk-avatars.js` — seeded drawn characters, restylable (frame, outline, eyes,
  palette) and with moods.
- `references/copy.md` — writing the page: the visitor's feeling first, then the mechanism.

## Process

1. **Name the mechanism.** One sentence: what does the product actually do to what? ("It
   reads every job posting each morning, keeps the few worth your name, and stamps each one
   with why.") The world comes from this sentence, not from the category.

2. **Pick a direction that is not a previous one.** Run `scripts/direction.mjs` with the
   product's name and mechanism, read `references/directions.md`, and write a direction card:
   one choice per axis (hero kind, palette strategy, type personality, shape language,
   character style, motion personality, layout rhythm, texture) and a one-line *world*
   ("the morning round", "a print shop at night"). The card must differ from every entry in
   `worlds.json` on **at least four axes, including palette strategy or type personality**.
   The script's proposal is a starting point; change any choice the mechanism argues against,
   then re-check the difference rule. Show the card to the user before building when they
   are around.

3. **Choose the hero object** from the product's own material, built from its own data, that
   the visitor can touch: a board where candidates move through stages, a wheel of postings
   being read and stamped, a stack of documents being checked, parcels on a conveyor, a
   timeline that assembles itself. Pick the one a customer would recognise as *their* day.
   Make it out of the medium the direction card names (Three.js, DOM/CSS 3D, SVG, canvas).
   If the object is made of text, use DOM, not WebGL: canvas text is blurry and invisible to
   screen readers. **Never a globe, planet, earth or world map** — it is the most repeated
   hero there is.

4. **Palette.** At most four identity colours: one action colour (buttons, links, focus),
   one "current / new" accent, two fields. Follow the palette strategy on the card; do not
   default to pastel fields. Ink is a deep tinted colour, never pure black; secondary text is
   tinted, never grey. Light default, dark theme as a second, hand-picked set. Measure text
   contrast on every field and write down which text colours are allowed on which ground.

5. **Type.** One family, from the type personality on the card, self-hosted, weights
   400/500 (600 only for a wordmark). Headings are the text face a size up with tight
   tracking. Check `worlds.json`: never reuse the previous project's family.

6. **Characters.** Wherever a person appears, draw one (`references/folk-avatars.js`): the
   same seed always gives the same face. Restyle them to the card's character style — frame,
   outline, eyes, palette — so they belong to this world. Use them in the hero data, in page
   headers and in scenes. Never photos of real people. If the card says "objects only",
   leave people out entirely and let the objects act.

7. **Icons that act** (`references/animated-icons.md`). Each claim gets a small SVG that
   performs it.

8. **Scenes for feelings** (`references/character-scenes.md`). When a section lists the
   visitor's problems, one recurring character acts out each one, with the right expression,
   and the last scene turns to the product's answer.

9. **How it works.** One component: steps on one side, a stage that *plays* each step
   (typing, counting, items arriving, a scan, a stamp), not screenshots. Holds while pointed
   at, advances on its own; on a phone, small step tabs and one caption.

10. **Logo.** A mark that tells the mechanism in one object (a sheet with a seal stamped on its
    corner: an application carrying its own proof). Reads at 16px; animates once in the
    header, nowhere else. Re-render favicon, touch icon and share image (headless Chromium
    screenshots of a small HTML page work well).

11. **Dashboard = same world, quieter.** Shared shell: full sidebar on wide screens, icon rail
    that opens on hover at medium widths, a drawer on phones. Each page header carries a small
    scene (the page's icon on a floating tile, a character or two). Data rows become cards on
    phones. Empty states teach, with the mascot if there is one.

12. **Calm the page.** One hero object, one tour, and per section either one object or a
    plain list. If a section needs a box around every item, it is too busy.

13. **Write it down.** A `DESIGN.md` in the project, written from what was built: the world
    sentence, colour roles with measured contrast, type, the signature pieces, motion rules,
    and what the project refuses. Then add the project's direction card to `worlds.json`.

## Verify before showing

- Real widths: 360, 375, 640, 760, 1100, 1440, and the width of the user's preview pane if
  they use one (check `innerWidth`). No horizontal scroll on any page: compare `scrollWidth`
  with `clientWidth`. Grid children need `min-width: 0` or one long word breaks a phone layout.
- The dark theme and any right-to-left language, for every new component.
- No console errors; SMIL `keySplines` values within 0–1.
- **Animated scenes frame by frame**: pause each SVG and `setCurrentTime(t)` at several
  moments of its loop, screenshot, and look. Overlaps, a prop visible before its entrance,
  a face with the wrong expression and a sun still in a night sky are all invisible when
  you only watch it play.
- Reduced motion: every scene parked on the frame that tells its story, nothing moving.
  Animations pause off screen.
- Unbalanced inline tags in translated strings (an unclosed `<b>` once made a page bold).
- Inline scripts change CSP hashes in projects with a strict CSP.
- Signed-in pages without a backend: a tiny stand-in API with fixtures makes every page and
  every empty state reviewable. Keep it out of the deploy.

## Delivery

Show screenshots, say what was not checked, commit locally. Deploy and push only when the
user says so.
