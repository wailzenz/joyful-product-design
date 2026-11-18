# Icons that act out their sentence

Each icon is a small inline SVG (viewBox 64×64) that performs the point it sits beside:
"research eats your time" → an hourglass runs out and turns; "clean lists" → a red row slides
out of a list; "every application is tailored" → a sheet gets a new line threaded in and a
tick; "inbox-first" → a letter drops into a tray, then a tick pops.

Recipe:
- Draw in the project's line style: the stroke weight, cap and fill rules of the direction
  card (3px ink strokes and white fills on soft tiles; hairlines on a sharp grid; two-ink
  overprint for duotone). Red only for "bad".
- Animate with SMIL inside the SVG (`<animate>`, `<animateTransform>`, `<animateMotion>`):
  it runs everywhere inline SVG runs, needs no CSS keyframes per icon, and can be paused.
- Loops of 3–5 s with a rest at the end; motion that explains (arrive, fill, remove, tick),
  never wobble for its own sake. Match the card's motion personality (springy pops, stepwise
  jumps, ink lines that draw themselves).
- Pause off screen and under reduced motion:
  ```js
  document.querySelectorAll('svg.ani').forEach((svg) => {
    if (reduce) { svg.pauseAnimations(); svg.setCurrentTime(1.2); return; }
    svg.pauseAnimations();
    new IntersectionObserver((es) => es[0].isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()).observe(svg);
  });
  ```
- Put them on tiles in the card's shape language, in both themes; never mix a light tint into
  a dark ground (it goes brown and hides the ink).
- Gotchas: `keySplines` values must be within 0–1; `transform` on the outer `<svg>` element
  does not animate (wrap the drawing in a `<g>`); a nested `<svg>` has its own clock (use
  `<g>`); text inside SVG inherits the page font.
- Keep the set in one module of small template functions so 10–25 icons stay consistent and
  can be regenerated.

Counting numbers: animate stats from 0 to their value once, when they enter the view, keeping
the language's own thousands separator. Every figure on the page should come from the same
data file the hero uses, never typed into the copy by hand.
