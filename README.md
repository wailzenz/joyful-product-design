# joyful-product-design

A [Claude Code](https://claude.com/claude-code) skill for designing or redesigning a product's
website and app so it feels alive and joyful, shows what the product really does, and does
not look like AI slop or like the last product you designed.

It is a process, not a theme:

1. **Name the mechanism** in one sentence: what does the product do to what?
2. **Pick a direction that is not a previous one.** A world varies on eight axes (hero object,
   palette strategy, type, shape language, characters, motion, layout, texture).
   `scripts/direction.mjs` proposes cards that differ from every world in `worlds.json`, so a
   house approach never becomes a house look.
3. **Build a hero object from the product's real data** that the visitor can touch. Never a
   globe.
4. **Characters, icons that act, scenes for feelings, an animated tour**: techniques with
   working code in `references/`.
5. **Verify frame by frame** at real widths, dark theme, RTL and reduced motion, then write the
   project's `DESIGN.md` and add its card to `worlds.json`.

## Install

```bash
git clone https://github.com/wailzenz/joyful-product-design ~/.claude/skills/joyful-product-design
```

Claude Code picks it up for design, redesign, logo, icon and animation work. Ask for it by
name ("use the joyful-product-design skill") to be sure.

## Try the direction picker

```bash
node ~/.claude/skills/joyful-product-design/scripts/direction.mjs "Ledgerly" "checks supplier invoices against purchase orders" --count 3
```

```
Direction 1 for Ledgerly
hero       desk             palette    duotone          type       serif-text
shape      ticket           characters line-faces       motion     mechanical
layout     story-column     texture    grain            family     Fraunces
Differs from: toy-planet (8 axes), morning-round (8 axes)
```

Deterministic for the same name and sentence. It proposes; you decide, and write the one-line
world that makes the choices belong together.

## What's inside

| Path | What it is |
|---|---|
| `SKILL.md` | The process Claude follows |
| `references/taste.md` | Liked and rejected, from real design reviews. Replace with your own taste |
| `references/directions.md` | The eight axes, their options, and the difference rule |
| `worlds.json` | Worlds already shipped. Add yours after each project |
| `scripts/direction.mjs` | Proposes directions that differ from every shipped world (Node 18+, no dependencies) |
| `references/folk-avatars.js` | Seeded drawn characters, restylable (frame, outline, line drawing, eyes, palette), with moods for scenes |
| `references/character-scenes.md` | One character acting out each of the visitor's problems: SMIL recipe, gotchas, frame-by-frame checking |
| `references/animated-icons.md` | Icons that perform the sentence beside them |
| `references/copy.md` | Writing the page: the visitor's feeling first, then the mechanism |
| `examples/folk-styles.html` | The same seeds in four styles; open it in a browser |

## Make it yours

The taste file records one owner's reviews. Keep the process, replace `references/taste.md`
with what you and your clients actually like and reject, and reset `worlds.json` to your own
projects (or keep the two examples so you never repeat them either).

## Licence

MIT. The characters are drawn from code; no photos or real people.
