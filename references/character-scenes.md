# Character scenes: one person acting out each point

When a section lists the visitor's problems ("you apply every day and nobody replies",
"software rejects you before a person reads a word"), give each line a small animated scene
in which **the same character** lives it. Five illustrations read as decoration; one person
having a bad week reads as the visitor's own week, and the last scene can turn to the product.

Worked example (a job-application agent; the character is "Maya", the same sample person
whose data the hero shows):

| Line | Scene |
|---|---|
| You apply every day, and the replies don't come | Paper planes leave her one after another; her inbox badge stays at **0** while a thought bubble pulses "…" |
| Software rejects you before a person reads a word | Her CV slides into a screening machine, a scan line runs, the light turns red, a rejection envelope comes back; her face drops as it lands |
| Every company wants something different | Three speech bubbles appear in turn ("One page." / "More detail." / "Our words."), she turns her head to each, then all three talk at once |
| It takes your evenings | Through the window the sky goes from day to dusk to night, moon and stars come out, the pile of rewritten CVs grows |
| It starts to feel personal | A rain cloud settles over her and she bows her head, then the sun (with the product's mark) comes in, the cloud drifts off and she looks up smiling |

And beside the headline "Hundreds of applications. Not one reply.", a chat "typing…" bubble
that appears, bounces its dots, and vanishes without sending: the headline told again
without words, at the size of a word.

## Building one

- **One inline SVG per scene** (a 200×128 viewBox works for a tile beside a paragraph),
  SMIL inside (`<animate>`, `<animateTransform>`, `<animateMotion>`), one loop of 6–8 s.
  Generate the markup from small helper functions (`character(x, y, size, mood)`,
  `plane(window)`, `bubble(x, y, text)`) so props are consistent and timings readable.
- **The character is a `<g>`, never a nested `<svg>`.** A nested SVG runs on its own
  animation clock: pausing or seeking the scene does not pause or seek it, and the face
  changes expression out of step with everything else. `Folk.create(...).markup()` returns
  a group for this reason.
- **Give the face a mood.** A seeded face usually smiles; that is right in a contact list and
  wrong for someone who was just rejected. Use `neutral`, `sad`, `tired`, or a timed
  `{ glum: [from, to], dur }` that turns sad when the bad thing lands and back when it
  resolves. Time `glum` to the scene's own events, in seconds of the loop.
- **Props are hidden until their entrance.** With `opacity` animated from the loop's start, a
  prop is faintly visible before it is due. Hold it at 0 until a moment before its entrance:
  `values="0;0;1;1;0;0" keyTimes="0;start-0.01;start+0.02;end-0.04;end;1"`.
- **Sky changes need believable stops.** Interpolating straight from peach to navy passes
  through mud. Go peach → warm orange → lilac → indigo → night, hold night, and return. Move
  the sun below the horizon (and out of the window's clip) before the sky darkens.
- **Text in scenes** inherits the page font; keep it to two or three words and give speech
  bubbles room (measure the longest word at the scene's rendered width).
- **Alternate tile colours** between the palette's two fields; on phones put the scene above
  its text, at full width, with a max width so it never dominates.

## Pausing, reduced motion, and checking

```ts
function useSmil(host, still) {
  useEffect(() => {
    const svg = host.current?.querySelector('svg');
    if (!svg) return;
    svg.pauseAnimations();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { svg.setCurrentTime(still); return; }
    const io = new IntersectionObserver((es) =>
      es.some((e) => e.isIntersecting) ? svg.unpauseAnimations() : svg.pauseAnimations());
    io.observe(svg);
    return () => io.disconnect();
  }, [host, still]);
}
```

Each scene declares a `still`: the moment that tells its story (the red light, the full
moon, the sun arriving). Reduced motion shows that frame and nothing moves.

Check by seeking, not by watching: for each scene, `pauseAnimations()`, then
`setCurrentTime(t)` for five or six values of `t` across the loop, screenshot each. Faults
found this way and missed by watching: bubbles overlapping at one moment, a plane visible
before take-off, a face still frowning after the sun came out (the nested-SVG clock), a sun
visible in the night sky, a "tired" mouth that read as a smile.

Give each scene `role="img"` and an `aria-label` that says what happens, since the SVG is
`aria-hidden`.
