#!/usr/bin/env node
/**
 * Propose design directions for a product that differ from every world already shipped.
 *
 *   node scripts/direction.mjs "Product name" "one sentence: what it does to what"
 *   node scripts/direction.mjs "Ledgerly" "checks supplier invoices against orders" --count 3
 *   node scripts/direction.mjs "Ledgerly" "..." --json
 *   node scripts/direction.mjs "Ledgerly" "..." --worlds path/to/worlds.json
 *
 * Deterministic: the same name and sentence give the same proposals, so a card can be
 * discussed and reproduced. Options already used by shipped worlds are down-weighted, the
 * mechanism sentence nudges the hero, and every proposal is checked against the difference
 * rule in references/directions.md (>= 4 axes differ from each world, palette or type among
 * them). It proposes; a person decides. Change any choice the mechanism argues against.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AXES = {
  hero: ["dom-3d", "webgl", "svg-machine", "board", "timeline", "desk", "split", "toy"],
  palette: ["pastel-fields", "saturated-blocks", "mono-accent", "paper-ink", "night", "duotone"],
  type: ["humanist-sans", "rounded-sans", "geometric-sans", "grotesk", "serif-text", "slab"],
  shape: ["soft-plates", "sharp", "ticket", "cutout", "outline", "blob"],
  characters: ["round-faces", "square-stickers", "line-faces", "figures", "mascot", "objects-only"],
  motion: ["springy", "calm-drift", "stepwise", "ink-draw", "mechanical"],
  layout: ["colour-bands", "editorial", "story-column", "asymmetric-split", "canvas"],
  texture: ["flat", "grain", "paper", "halftone", "grid"],
};

const FAMILIES = {
  "humanist-sans": ["Figtree", "Source Sans 3", "Open Sans", "Nunito Sans"],
  "rounded-sans": ["Rubik", "Nunito", "Quicksand"],
  "geometric-sans": ["Outfit", "Plus Jakarta Sans", "Manrope", "Lexend"],
  grotesk: ["Instrument Sans", "Schibsted Grotesk", "Hanken Grotesk", "Archivo"],
  "serif-text": ["Literata", "Newsreader", "Source Serif 4", "Fraunces"],
  slab: ["Roboto Slab", "Zilla Slab", "Bitter"],
};

// Words in the mechanism sentence that suggest a hero. A nudge, not a rule.
const HERO_HINTS = [
  [/invoice|contract|document|paper|form|receipt|tender|letter|cv|resume|report/i, "desk"],
  [/stage|pipeline|sort|triage|kanban|status|queue|candidate|lead/i, "board"],
  [/schedule|day|calendar|week|routine|morning|shift|time/i, "timeline"],
  [/ship|parcel|deliver|warehouse|factory|build|machine|print/i, "webgl"],
  [/compare|before|after|rewrite|improve|fix|translate/i, "split"],
  [/simulate|plan|budget|price|calculate|forecast|tune/i, "toy"],
  [/process|convert|transform|check|scan|filter|match/i, "svg-machine"],
];

// Palettes that suit a hero, so the card hangs together.
const PAIRS = {
  desk: ["paper-ink", "duotone", "mono-accent"],
  board: ["saturated-blocks", "mono-accent", "pastel-fields"],
  timeline: ["night", "pastel-fields", "duotone"],
  webgl: ["saturated-blocks", "night", "pastel-fields"],
  split: ["mono-accent", "saturated-blocks", "paper-ink"],
  toy: ["saturated-blocks", "pastel-fields", "duotone"],
  "svg-machine": ["duotone", "paper-ink", "night"],
  "dom-3d": ["mono-accent", "night", "pastel-fields"],
};

// ----------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const asJson = args.includes("--json");
if (asJson) args.splice(args.indexOf("--json"), 1);
const count = Math.max(1, Math.min(6, Number(flag("--count") ?? 1)));
const here = dirname(fileURLToPath(import.meta.url));
const worldsPath = resolve(flag("--worlds") ?? resolve(here, "..", "worlds.json"));
const [name, mechanism = ""] = args;
if (!name) {
  console.error('usage: node scripts/direction.mjs "Product name" "what it does" [--count N] [--json]');
  process.exit(2);
}

let worlds = [];
try {
  worlds = JSON.parse(readFileSync(worldsPath, "utf8")).worlds ?? [];
} catch {
  console.error(`(no worlds file at ${worldsPath}; proposing without history)`);
}

// ----------------------------------------------------------------- randomness
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed) {
  let x = hash(seed) || 1;
  return () => {
    x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
    return x / 4294967296;
  };
}
function weighted(random, options, weightOf) {
  const weights = options.map(weightOf);
  let roll = random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < options.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return options[i];
  }
  return options[options.length - 1];
}

// ----------------------------------------------------------------- proposing
const used = (axis, option) => worlds.filter((w) => w[axis] === option).length;
const last = worlds[worlds.length - 1];
const hinted = HERO_HINTS.filter(([re]) => re.test(mechanism)).map(([, hero]) => hero);
const usedFamilies = new Set(worlds.map((w) => w.family).filter(Boolean));

function propose(random) {
  const card = {};
  for (const [axis, options] of Object.entries(AXES)) {
    card[axis] = weighted(random, options, (option) => {
      let w = 1 / (1 + 3 * used(axis, option));
      if (last && last[axis] === option) w *= 0.15;
      if (axis === "hero" && hinted.includes(option)) w *= 4;
      if (axis === "palette" && PAIRS[card.hero]?.includes(option)) w *= 3;
      return w;
    });
  }
  const families = FAMILIES[card.type].filter((f) => !usedFamilies.has(f));
  card.family = families.length
    ? families[Math.floor(random() * families.length)]
    : `(every ${card.type} family listed is used; pick another)`;
  return card;
}

function differences(card) {
  return worlds.map((w) => {
    const axes = Object.keys(AXES).filter((axis) => w[axis] !== card[axis]);
    const ok = axes.length >= 4 && (axes.includes("palette") || axes.includes("type"));
    return { id: w.id, differ: axes.length, ok };
  });
}

const proposals = [];
const seen = new Set();
for (let attempt = 0; proposals.length < count && attempt < 400; attempt++) {
  const card = propose(rng(`${name}|${mechanism}|${attempt}`));
  const key = Object.keys(AXES).map((a) => card[a]).join("/");
  if (seen.has(key)) continue;
  seen.add(key);
  const diff = differences(card);
  if (diff.every((d) => d.ok)) proposals.push({ ...card, differsFrom: diff });
}

if (asJson) {
  console.log(JSON.stringify({ product: name, mechanism, proposals }, null, 2));
} else {
  proposals.forEach((card, i) => {
    console.log(`\nDirection ${i + 1} for ${name}`);
    console.log(`World:      (write one line that makes these choices belong together)`);
    if (mechanism) console.log(`Mechanism:  ${mechanism}`);
    const row = (keys) => keys.map((k) => `${k.padEnd(10)} ${String(card[k]).padEnd(16)}`).join(" ");
    console.log(row(["hero", "palette", "type"]));
    console.log(row(["shape", "characters", "motion"]));
    console.log(row(["layout", "texture", "family"]));
    if (card.differsFrom.length) {
      console.log(
        "Differs from: " + card.differsFrom.map((d) => `${d.id} (${d.differ} axes)`).join(", "),
      );
    }
  });
  if (!proposals.length) console.log("No proposal met the difference rule; widen worlds.json options.");
  console.log(
    "\nThen choose an action colour and accent unlike these: " +
      (worlds.map((w) => w.colours?.action).filter(Boolean).join(", ") || "(none recorded)"),
  );
}
