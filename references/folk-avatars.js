// Folk: a cast of drawn characters, one per seed. The same seed (an email, a name) always
// gives the same face, so a person keeps their character everywhere in the product. They
// blink and nod on their own; nothing here is a photo or a real person.
//
// Restyle per project so two products never share a cast:
//
//   const folk = Folk.create({
//     ink: '#10302a',                       // line and eye colour: the project's ink
//     palette: { field: ['#ffd9bf', '#ddd2ff'], shirt: ['#0b7d4f', '#ff8a4c', '#10302a'] },
//     frame: 'circle' | 'squircle' | 'square' | 'none',
//     outline: false,                       // ink stroke round head, ears and body (sticker look)
//     flat: false,                          // with outline: white skin and hair fills, line drawing
//     eyes: 'dot' | 'line' | 'oval',
//     cheeks: true,
//   });
//   el.innerHTML = folk.svg('maya@example.com', { size: 48 });
//   folk.mount();                           // fills every <span data-folk="seed" data-size="40">
//
// For a scene (a larger SVG in which the character acts), use `folk.markup(seed, opts)`:
// it returns a <g>, not a nested <svg>. Browsers run a nested <svg> on its own animation
// clock, so a face drawn that way ignores the scene's pauseAnimations()/setCurrentTime()
// and changes expression out of step with everything around it.
//
// Moods, for scenes: opts.mood = 'neutral' | 'sad' | 'tired' | 'smile'
//   or { glum: [fromSeconds, toSeconds], dur: loopSeconds } — sad between those moments of
//   the loop, smiling otherwise, for a scene that ends better than it starts.
(function (root) {
  const DEFAULTS = {
    skin: ['#ffe0c7', '#f6c9a4', '#e3ab7e', '#c98958', '#9c6642', '#6f4631'],
    hair: ['#2a1c14', '#47301f', '#7b4a27', '#c68637', '#e5be63', '#8d8c9c', '#b6412f', '#17153b'],
    field: ['#c6e4ff', '#ffd23f', '#a6ecd0', '#ffc2cf', '#dcd1ff', '#ffc59e'],
    shirt: ['#2b59ff', '#17153b', '#0a7f5a', '#ff5c7c', '#7a3ff2', '#ffffff', '#ff8a3d'],
    scarf: ['#2b59ff', '#7a3ff2', '#0a7f5a', '#ff5c7c', '#17153b', '#e9e4ff'],
  };

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  // A tiny seeded generator, so each feature gets its own independent pick.
  function picker(seed) {
    let x = hash(String(seed || 'folk')) || 1;
    return (n) => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x % n; };
  }
  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
    return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
  };

  const HAIRS = [
    // short crop
    'M18.6 27c-1.8-11 4.8-16.6 13.4-16.6S47.2 16 45.4 27c-1.6-5.4-5.2-8.2-13.4-8.2S20.2 21.6 18.6 27z',
    // side part
    'M18.4 28c-2.4-12 4.4-18 13.6-18 9.4 0 15.8 6 13.6 17-2.4-4.6-6.4-7.2-11.6-7.4-6 3.6-11.6 4-15.6 8.4z',
    // curls (circles, handled below)
    null,
    // bun (circle plus crop, handled below)
    null,
    // bald (a shine, handled below)
    null,
    // fringe (long hair is drawn behind the head)
    'M18.4 27c-2-11.6 4.6-17 13.6-17s15.6 5.4 13.6 17c-1.4-3.6-3.2-5.8-5.4-7-3.4 2.4-12.6 3-17.4.4-2 1.4-3.4 3.6-4.4 6.6z',
    // flat top
    'M19 25c-1.4-4-1.2-9 0-12.6h26c1.2 3.6 1.4 8.6 0 12.6-1.2-3.4-3-5-5-5.6H24c-2 .6-3.8 2.2-5 5.6z',
  ];

  function create(options) {
    const o = Object.assign({ ink: '#17153b', frame: 'circle', outline: false, flat: false, eyes: 'dot', cheeks: true }, options || {});
    const pal = Object.assign({}, DEFAULTS, o.palette || {});
    const ink = o.ink;
    const sw = o.outline ? ` stroke="${ink}" stroke-width="2" stroke-linejoin="round"` : '';
    const line = (d, w) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w || 1.8}" stroke-linecap="round"/>`;

    const MOUTHS = {
      smile: line('M27.4 35.4c2.2 2.8 7 2.8 9.2 0'),
      neutral: line('M28.2 36h7.6'),
      sad: line('M27.6 37.6c2.4-2.6 6.4-2.6 8.8 0'),
      tired: line('M28.4 36.8c2.2-1 5-1 7.2 0'),
    };

    function mouthFor(mood, fallback) {
      if (!mood) return fallback;
      if (typeof mood === 'string') return MOUTHS[mood] || fallback;
      const [from, to] = mood.glum;
      const t = (x) => (Math.min(Math.max(x, 0), mood.dur) / mood.dur).toFixed(3);
      const keys = `0;${t(from - 0.2)};${t(from)};${t(to)};${t(to + 0.2)};1`;
      const rep = `dur="${mood.dur}s" repeatCount="indefinite"`;
      return `<g opacity="0">${MOUTHS.sad}<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${keys}" ${rep}/></g>` +
        `<g>${MOUTHS.smile}<animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="${keys}" ${rep}/></g>`;
    }

    function eyesFor() {
      if (o.eyes === 'line') return `<g class="folk-e">${line('M25.2 29h3.6', 1.8)}${line('M35.2 29h3.6', 1.8)}</g>`;
      if (o.eyes === 'oval') return `<g class="folk-e" fill="${ink}"><ellipse cx="27" cy="29" rx="1.6" ry="2.4"/><ellipse cx="37" cy="29" rx="1.6" ry="2.4"/></g>`;
      return `<g class="folk-e" fill="${ink}"><circle cx="27" cy="29" r="1.8"/><circle cx="37" cy="29" r="1.8"/></g>`;
    }

    function clipShape(id) {
      if (o.frame === 'squircle') return `<clipPath id="${id}"><rect width="64" height="64" rx="18"/></clipPath>`;
      if (o.frame === 'square') return `<clipPath id="${id}"><rect width="64" height="64" rx="4"/></clipPath>`;
      if (o.frame === 'none') return '';
      return `<clipPath id="${id}"><circle cx="32" cy="32" r="32"/></clipPath>`;
    }

    /** The drawing without its outer <svg>; returns { body, delay }. */
    function draw(seed, opts) {
      const p = opts || {};
      const pick = picker(seed);
      let skin = pal.skin[pick(pal.skin.length)];
      let hair = pal.hair[pick(pal.hair.length)];
      const field = p.field || pal.field[pick(pal.field.length)];
      let shirt = pal.shirt[pick(pal.shirt.length)];
      if (shirt.toLowerCase() === String(field).toLowerCase()) shirt = pal.shirt.find((s) => s !== shirt) || ink;
      const look = pick(10); // 0-6 hair styles, 7 long hair, 8 headscarf, 9 cap
      const beard = look < 7 && pick(5) === 0;
      const glasses = pick(5) === 0;
      const mouth = ['smile', 'grin', 'soft'][pick(3)];
      const delay = (pick(50) / 10).toFixed(1);
      if (o.flat) { skin = '#ffffff'; hair = o.outline ? '#ffffff' : hair; }

      let behind = '', top = '';
      const hairPath = (d) => `<path d="${d}" fill="${hair}"${sw}/>`;
      if (look === 7) {
        behind = `<path d="M15 50c-4-26 4.6-40 17-40s21 14 17 40z" fill="${hair}"${sw}/>`;
        top = hairPath(HAIRS[5]);
      } else if (look === 8) {
        const scarf = pal.scarf[pick(pal.scarf.length)];
        behind = `<path d="M13.6 52c-5-25 5-42.6 18.4-42.6S55.4 27 50.4 52c-5 3-11 4.6-18.4 4.6S18.6 55 13.6 52z" fill="${scarf}"${sw}/>`;
        top = `<path d="M18.2 30c-1.6-11.6 4.8-18 13.8-18s15.4 6.4 13.8 18c-1.6-6.8-6.2-10.4-13.8-10.4S19.8 23.2 18.2 30z" fill="${scarf}"${sw}/>` +
          `<path d="M20 38c2.6 5 6.6 7.6 12 7.6s9.4-2.6 12-7.6c.4 5.6-.6 9-2 11.4H22c-1.4-2.4-2.4-5.8-2-11.4z" fill="${shade(scarf, 0.9)}"${sw}/>`;
      } else if (look === 9) {
        const cap = pal.shirt[pick(Math.min(4, pal.shirt.length))];
        top = `<path d="M18.4 24c-.6-9 5.2-13.6 13.6-13.6S46.2 15 45.6 24z" fill="${cap}"${sw}/>` +
          `<path d="M17 22.6h30.6c4.6.6 7.4 2 8.4 4-8-1.4-25.6-1.4-39 0z" fill="${shade(cap, 0.78)}"${sw}/>`;
      } else if (look === 2) {
        top = `<g fill="${hair}"${sw}><circle cx="22" cy="19" r="6"/><circle cx="29" cy="14" r="6.4"/><circle cx="37" cy="14.4" r="6.2"/><circle cx="43" cy="20" r="5.6"/><circle cx="19.4" cy="26" r="4"/><circle cx="45" cy="26.4" r="3.8"/></g>`;
      } else if (look === 3) {
        top = `<circle cx="32" cy="8.6" r="5.4" fill="${hair}"${sw}/>` + hairPath(HAIRS[0]);
      } else if (look === 4) {
        top = `<path d="M26 14.6c2-1.6 5-2.2 8-1.6" fill="none" stroke="${o.flat ? ink : '#fff'}" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`;
      } else {
        top = hairPath(HAIRS[look]);
      }

      const defaultMouths = {
        smile: MOUTHS.smile,
        grin: `<path d="M27 34.8h10c0 3.4-2.2 5.6-5 5.6s-5-2.2-5-5.6z" fill="${ink}"/><path d="M29.2 38.6c1.8-1 3.8-1 5.6 0-.8 1.2-1.7 1.8-2.8 1.8s-2-.6-2.8-1.8z" fill="#ff7d96"/>`,
        soft: line('M28 35.6c2.4 1.6 5.6 1.6 8 0'),
      };

      const id = 'f' + hash(String(seed) + (p.size || 40) + o.frame).toString(36);
      const clip = clipShape(id);
      const body =
        (clip ? `<defs>${clip}</defs><g clip-path="url(#${id})">` : '<g>') +
        (o.frame === 'none' ? '' : `<rect width="64" height="64" fill="${field}"/>`) +
        `<g class="folk-h">${behind}` +
        `<path d="M9 66c0-13 10-19.6 23-19.6S55 53 55 66z" fill="${shirt}"${sw}/>` +
        `<rect x="27" y="38" width="10" height="11" rx="4.6" fill="${o.flat ? '#ffffff' : shade(skin, 0.9)}"${sw}/>` +
        `<circle cx="19.4" cy="29.6" r="2.7" fill="${shade(skin, 0.94)}"${sw}/><circle cx="44.6" cy="29.6" r="2.7" fill="${shade(skin, 0.94)}"${sw}/>` +
        `<rect x="19.4" y="13" width="25.2" height="29.6" rx="12.6" fill="${skin}"${sw}/>` +
        (beard ? `<path d="M19.8 30c.2 10 5 14.2 12.2 14.2S44 40 44.2 30c-2 4.4-6 6.4-12.2 6.4S21.8 34.4 19.8 30z" fill="${hair}"${sw}/>` : '') +
        top + eyesFor() +
        (glasses ? `<g fill="none" stroke="${ink}" stroke-width="1.3"><circle cx="27" cy="29" r="4.2"/><circle cx="37" cy="29" r="4.2"/><path d="M31.2 29h1.6"/></g>` : '') +
        (o.cheeks ? `<circle cx="23.6" cy="33.6" r="2.3" fill="#ff7d96" opacity=".45"/><circle cx="40.4" cy="33.6" r="2.3" fill="#ff7d96" opacity=".45"/>` : '') +
        mouthFor(p.mood, defaultMouths[mouth]) +
        `</g></g>`;
      return { body, delay };
    }

    /** A standalone face: <svg class="folk">. */
    function svg(seed, opts) {
      const size = (opts && opts.size) || 40;
      const { body, delay } = draw(seed, opts);
      return `<svg class="folk folk-${o.frame}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" style="--fd:${delay}s">${body}</svg>`;
    }

    /** The same face as a <g> scaled to `size`, for use inside a scene's own SVG. */
    function markup(seed, opts) {
      const size = (opts && opts.size) || 40;
      const { body, delay } = draw(seed, opts);
      return `<g class="folk-g" transform="scale(${size / 64})" style="--fd:${delay}s">${body}</g>`;
    }

    /** Replace every <span data-folk="seed" [data-size]> with that seed's character. */
    function mount(scope) {
      (scope || document).querySelectorAll('[data-folk]').forEach((el) => {
        if (el.dataset.folkDone === el.dataset.folk) return;
        el.innerHTML = svg(el.dataset.folk, { size: Number(el.dataset.size) || 40 });
        el.dataset.folkDone = el.dataset.folk;
      });
    }

    return { svg, markup, mount };
  }

  // The characters' own motion: a blink and a small nod, each on its own clock. CSS, so it
  // keeps running inside a paused SMIL scene; drop the class to hold a face still.
  function installStyles(doc) {
    if (!doc || doc.getElementById('folk-css')) return;
    const st = doc.createElement('style');
    st.id = 'folk-css';
    st.textContent =
      '.folk{display:block;flex:none}.folk-circle{border-radius:50%}.folk-squircle{border-radius:28%}' +
      '.folk-e{transform-box:fill-box;transform-origin:center;animation:folk-blink 5.2s infinite;animation-delay:var(--fd,0s)}' +
      '.folk-h{transform-origin:32px 50px;animation:folk-nod 7s ease-in-out infinite;animation-delay:var(--fd,0s)}' +
      '@keyframes folk-blink{0%,93%,100%{transform:scaleY(1)}95.5%{transform:scaleY(.08)}}' +
      '@keyframes folk-nod{0%,100%{transform:rotate(0)}28%{transform:rotate(-3.5deg)}55%{transform:rotate(2.8deg)}80%{transform:rotate(-1deg)}}' +
      '@media (prefers-reduced-motion:reduce){.folk-e,.folk-h{animation:none}}';
    doc.head.appendChild(st);
  }

  const Folk = { create, installStyles };
  if (typeof module === 'object' && module.exports) module.exports = Folk;
  else root.Folk = Folk;
  if (typeof document !== 'undefined') installStyles(document);
})(typeof window !== 'undefined' ? window : globalThis);
