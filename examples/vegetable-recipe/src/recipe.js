
  /* ---------- Theme ---------- */
  var themeBtn = document.getElementById('theme');
  function setTheme(dark) { root.setAttribute('data-theme', dark ? 'dark' : 'light'); themeBtn.setAttribute('aria-checked', String(dark)); }
  if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) setTheme(true);
  themeBtn.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') !== 'dark'); });

  /* ---------- Cooking profile of each vegetable ----------
     roast / saute = typical minutes. raw = pleasant raw. rawPref = best raw. rawOnly = not cooked here. leaf = leafy green.
     buy = grams as bought for 2 servings. prep / rawPrep = how to prepare it cooked / raw. */
  var P = {
    'esparrago-verde': { roast: 12, saute: 5, buy: 300, prep: 'snap off the woody ends' },
    champinon: { roast: 15, saute: 7, buy: 250, prep: 'wipe clean and halve' },
    'lechuga-romana': { leaf: 1, saute: 1, raw: 1, rawPref: 1, buy: 200, prep: 'tear the leaves', rawPrep: 'tear the leaves' },
    alcachofa: { roast: 30, saute: 12, buy: 500, prep: 'trim the tough outer leaves and the choke, then quarter' },
    remolacha: { roast: 35, saute: 15, raw: 1, buy: 300, prep: 'peel and cut into 2 cm cubes', rawPrep: 'peel and grate' },
    puerro: { roast: 20, saute: 8, buy: 300, prep: 'wash well and slice into 1 cm rings' },
    cebolleta: { roast: 10, saute: 3, raw: 1, rawPref: 1, buy: 150, prep: 'slice, white and green parts', rawPrep: 'slice thinly' },
    maiz: { roast: 15, saute: 6, buy: 450, prep: 'cut the kernels off the cobs' },
    apio: { roast: 20, saute: 6, raw: 1, rawPref: 1, buy: 200, prep: 'slice thinly', rawPrep: 'slice very thinly' },
    berenjena: { roast: 25, saute: 10, buy: 300, prep: 'cut into 2 cm cubes' },
    calabaza: { roast: 30, saute: 15, buy: 400, prep: 'peel, deseed and cut into 2 cm cubes' },
    pepino: { rawOnly: 1, raw: 1, rawPref: 1, buy: 300, prep: 'slice thinly', rawPrep: 'slice thinly' },
    patata: { roast: 35, saute: 15, buy: 400, prep: 'cut into 2 cm cubes' },
    cebolla: { roast: 25, saute: 10, raw: 1, buy: 200, prep: 'cut into half-moons', rawPrep: 'slice very thinly' },
    zanahoria: { roast: 30, saute: 10, raw: 1, buy: 300, prep: 'peel and slice into coins', rawPrep: 'peel and grate' },
    tomate: { roast: 20, saute: 6, raw: 1, rawPref: 1, buy: 400, prep: 'cut into wedges', rawPrep: 'cut into wedges' },
    calabacin: { roast: 20, saute: 6, raw: 1, buy: 300, prep: 'cut into half-moons', rawPrep: 'slice into thin ribbons' },
    acelga: { leaf: 1, saute: 5, buy: 250, prep: 'separate stems and leaves, then chop both' },
    espinaca: { leaf: 1, saute: 1, raw: 1, rawPref: 1, buy: 200, prep: 'wash the leaves', rawPrep: 'wash the leaves' },
    repollo: { roast: 25, saute: 8, raw: 1, buy: 300, prep: 'shred', rawPrep: 'shred very finely' },
    guisantes: { roast: 10, saute: 4, raw: 1, buy: 300, prep: 'shell the peas (frozen is fine, no need to thaw)', rawPrep: 'shell the peas' },
    coliflor: { roast: 25, saute: 8, buy: 400, prep: 'cut into small florets' },
    'col-bruselas': { roast: 25, saute: 10, buy: 300, prep: 'trim and halve' },
    brocoli: { roast: 20, saute: 6, buy: 350, prep: 'cut into small florets' },
    'pimiento-rojo': { roast: 25, saute: 8, raw: 1, buy: 300, prep: 'deseed and cut into strips', rawPrep: 'deseed and cut into thin strips' },
    kale: { leaf: 1, saute: 4, raw: 1, buy: 150, prep: 'remove the stems and tear the leaves', rawPrep: 'remove the stems, tear the leaves and massage with a little salt for 1 min' },
    endibia: { leaf: 1, saute: 4, raw: 1, rawPref: 1, buy: 200, prep: 'separate the leaves', rawPrep: 'separate the leaves' }
  };

  /* ---------- Helpers ---------- */
  var bySlug = {}; veg.forEach(function (v) { bySlug[v.slug] = v; });
  var sorted = veg.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
  function lc(n) { return n.replace(/\b(Brussels|Belgian|Swiss)\b/g, '\u0001$1').toLowerCase().replace(/\u0001(\w)/g, function (m, c) { return c.toUpperCase(); }); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pic(v, cls) { return '<img src="icons/' + v.slug + '.png" alt="" data-fb="' + v.color + '"' + (cls ? ' class="' + cls + '"' : '')+ '>'; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function pick(list, key) { return list[hash(key) % list.length]; }
  function chip(t) { return '<span class="cg-chip">' + t + '</span>'; }
  function min(n) { return n + ' min'; }
  function banner(kind, name, title, text) {
    return '<div class="cg-banner cg-banner--' + kind + '" role="alert"><span class="cg-banner__icon">' + icon(name) + '</span><div class="cg-banner__body"><strong class="cg-banner__title">' + title + '</strong><div>' + text + '</div></div></div>';
  }
  document.addEventListener('error', function (e) {
    var img = e.target; if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-fb')) return;
    var fb = document.createElement('span'); fb.className = 'dot-fallback'; fb.style.background = img.getAttribute('data-fb'); img.replaceWith(fb);
  }, true);

  /* ---------- Recipe engine: any two vegetables give one recipe ----------
     Each dish type checks whether the pair suits it. Among the dishes that suit, one is picked from the pair
     (always the same one for the same pair). Extras (meat, fish, eggs, dairy, rice, pasta, spices) are suggestions
     and are not part of the nutrition or cost numbers, which only count the two chosen vegetables. */
  var L = function (s) { return s.split(' '); };
  var SOUP = L('calabaza zanahoria brocoli coliflor puerro patata tomate calabacin espinaca guisantes remolacha champinon apio pimiento-rojo maiz cebolla alcachofa');
  var STIR = L('brocoli zanahoria pimiento-rojo champinon calabacin esparrago-verde guisantes repollo apio cebolleta coliflor col-bruselas cebolla maiz acelga kale puerro berenjena');
  var EGG = L('patata cebolla calabacin espinaca champinon pimiento-rojo puerro acelga esparrago-verde guisantes tomate berenjena alcachofa calabaza brocoli coliflor maiz kale cebolleta zanahoria');
  var CURRY = L('coliflor patata calabaza guisantes berenjena espinaca tomate zanahoria champinon pimiento-rojo calabacin kale acelga brocoli');
  var GRATIN = L('coliflor brocoli patata calabacin puerro calabaza zanahoria espinaca col-bruselas berenjena champinon acelga');
  var FRITTER = L('calabacin zanahoria maiz patata guisantes espinaca coliflor remolacha cebolleta brocoli calabaza puerro acelga');
  var NOPASTA = L('lechuga-romana endibia pepino');
  var VESSEL = { 'pimiento-rojo': ['red peppers', 'halve lengthways and remove the seeds', 25], berenjena: ['eggplants', 'halve lengthways, score the flesh and scoop out the middle (chop it and add it to the filling)', 30],
    calabacin: ['zucchini', 'halve lengthways and scoop out the middle (chop it and add it to the filling)', 25], tomate: ['tomatoes', 'cut off the tops and scoop out the insides (keep them for the filling)', 20],
    champinon: ['mushrooms', 'remove the stalks (chop them and add them to the filling)', 18], calabaza: ['butternut squash', 'halve lengthways and remove the seeds', 40] };
  var has = function (arr, s) { return arr.indexOf(s) >= 0; };

  var PROT = {
    chicken: { row: ['Chicken thighs, boneless', '300', 'g'], prep: 'cut into 3 cm pieces and season with salt and pepper', pan: 9, roast: 25, tail: 'chicken' },
    chorizo: { row: ['Chorizo', '80', 'g'], prep: 'cut into thin rounds', pan: 4, roast: 15, tail: 'chorizo' },
    ham: { row: ['Serrano ham or bacon', '60', 'g'], prep: 'cut into strips', pan: 3, tail: 'crispy ham' },
    beef: { row: ['Minced beef', '250', 'g'], prep: 'season with salt and pepper', pan: 8, tail: 'beef' },
    prawns: { row: ['Peeled prawns', '200', 'g'], prep: 'pat dry', pan: 3, roast: 8, tail: 'prawns' },
    salmon: { row: ['Salmon fillets', '2', 'fillets, about 250 g'], prep: 'pat dry and season', pan: 6, roast: 12, tail: 'salmon' },
    eggs: { row: ['Eggs', '4', 'large'], tail: 'eggs' },
    chickpeas: { row: ['Chickpeas, cooked', '240', 'g, drained'], pan: 2, tail: 'chickpeas' },
    tofu: { row: ['Firm tofu', '200', 'g'], prep: 'press dry and cut into cubes', pan: 6, tail: 'tofu' },
    feta: { row: ['Feta', '100', 'g'], tail: 'feta' },
    yoghurt: { row: ['Greek yoghurt', '150', 'g'], tail: 'yoghurt' },
    halloumi: { row: ['Halloumi', '150', 'g'], prep: 'cut into slices', pan: 4, roast: 10, tail: 'halloumi' },
    tuna: { row: ['Tinned tuna', '1', 'can, 120 g drained'], tail: 'tuna' }
  };
  var SEASON = [['Smoked paprika', '1', 'tsp'], ['Ground cumin', '1', 'tsp'], ['Dried thyme', '1', 'tsp'], ['Fresh rosemary', '2', 'sprigs']];
  var HERBS = [['Fresh parsley', '1', 'handful'], ['Fresh mint', '1', 'handful'], ['Fresh coriander', '1', 'handful'], ['Fresh basil', '1', 'handful']];

  function makeRecipe(a0, b0) {
    var items = [a0, b0].sort(function (x, y) { return x.slug < y.slug ? -1 : 1; }), a = items[0], b = items[1];
    var pa = P[a.slug], pb = P[b.slug], key = a.slug + '+' + b.slug;
    var H = function (salt, list) { return list[hash(key + salt) % list.length]; };
    var nm = function (v) { return lc(v.name); }, B = function (v) { return '<b>' + nm(v) + '</b>'; };
    var pro = function (id) { return PROT[id]; };
    var skipOnion = a.slug === 'cebolla' || b.slug === 'cebolla';
    var onionRow = skipOnion ? [] : [['Onion', '1', 'medium']];
    var oil = function (n) { return ['Olive oil', String(n), 'tbsp']; };
    var salt = function (n) { return ['Salt', n || '1/2', 'tsp']; }, pepper = ['Black pepper', '1', 'pinch'];
    var prepMin = 10;
    var both = function (arr) { return has(arr, a.slug) && has(arr, b.slug); };
    var leafs = items.filter(function (v) { return P[v.slug].leaf; }), hardItems = items.filter(function (v) { return !P[v.slug].leaf; });
    var prepStep = function (raw, extra, over) {
      var t = items.map(function (v) { return B(v) + ': ' + (over || (raw && P[v.slug].rawPrep) || P[v.slug].prep); }).concat((extra || []).map(function (x) { return x.charAt(0) === '<' ? x : x.replace(/^([^:]+):/, '<b>$1</b>:'); }));
      return { lead: 'Prep', text: t.join('. ') + '.', meta: min(prepMin) };
    };
    var protPrep = function (p) { return p.prep ? '<b>' + p.row[0].toLowerCase() + '</b>: ' + p.prep : null; };
    var heat = { lead: 'Heat', text: 'Heat the oven to <b>200 °C</b> (180 °C with a fan).', meta: '200 °C' };
    // Timeline for oven dishes: things that take longer go in first so everything finishes together.
    function roastSteps(list, verb) {
      var mx = Math.max.apply(null, list.map(function (x) { return x.d; }));
      list.forEach(function (x) { x.start = mx - x.d < 5 ? 0 : mx - x.d; });
      var starts = []; list.forEach(function (x) { if (starts.indexOf(x.start) < 0) starts.push(x.start); }); starts.sort(function (p, q) { return p - q; });
      return starts.map(function (s, i) {
        var grp = list.filter(function (x) { return x.start === s; }).map(function (x) { return x.label; });
        var names = grp.join(' and '), next = i + 1 < starts.length ? starts[i + 1] : mx, dur = next - s;
        if (i === 0) return { lead: verb || 'Roast', text: (starts.length > 1 ? 'Roast the ' + names + ' on their own first.' : 'Roast ' + (list.length > 1 ? 'everything together' : 'the ' + names) + ' until tender and golden.'), meta: min(dur) };
        return { lead: 'Add', text: 'Add the ' + names + ' to the tray and keep roasting' + (i === starts.length - 1 ? ' until everything is cooked through and golden.' : '.'), meta: min(dur) };
      });
    }
    var out = null;

    /* ----- dish builders ----- */
    var dishes = {};

    dishes.salad = function () {
      var pid = H('sp', ['chicken', 'tuna', 'eggs', 'feta', 'chickpeas', 'halloumi']), p = pro(pid);
      var dress = H('d', [
        { rows: [oil(2), ['Lemon juice', '1', 'tbsp'], salt('1/2'), pepper], text: 'Whisk the olive oil, lemon juice, salt and pepper in a large bowl.' },
        { rows: [['Greek yoghurt', '100', 'g'], ['Fresh mint', '1', 'handful'], ['Lemon juice', '1', 'tbsp'], oil(1), salt('1/2')], text: 'Stir the yoghurt with the chopped mint, lemon juice, olive oil and salt in a large bowl.' },
        { rows: [oil(2), ['Wholegrain mustard', '1', 'tsp'], ['Red wine vinegar', '1', 'tbsp'], ['Honey', '1', 'tsp'], salt('1/4')], text: 'Whisk the olive oil, mustard, vinegar, honey and salt in a large bowl.' }
      ]);
      var cook = 5, steps = [prepStep(true, protPrep(p) ? [protPrep(p)] : null)];
      var rows = dress.rows.slice();
      if (p.pan && pid !== 'chickpeas') {
        steps.push({ lead: 'Cook', text: 'Fry the <b>' + p.row[0].toLowerCase() + '</b> in a pan with a little oil over medium-high heat until browned' + (pid === 'chicken' ? ' and cooked through (no pink inside).' : '.'), meta: min(p.pan) }); cook += p.pan; rows.unshift(oil(1));
      }
      if (pid === 'eggs') { steps.push({ lead: 'Boil', text: 'Boil the eggs in simmering water for 7 min, cool in cold water, peel and halve.', meta: min(7) }); cook += 7; }
      steps.push({ lead: 'Dress', text: dress.text });
      steps.push({ lead: 'Toss', text: 'Add both vegetables and toss well. Let it rest so the flavours mix.', meta: min(5) });
      steps.push({ lead: 'Serve', text: 'Top with the ' + (pid === 'feta' ? 'crumbled feta' : p.tail) + ' and serve ' + (p.pan ? 'while the topping is still warm.' : 'cold.') });
      var tails = { chicken: 'pan-fried chicken', tuna: 'tuna', eggs: 'soft-boiled eggs', feta: 'feta', chickpeas: 'chickpeas', halloumi: 'fried halloumi' };
      return { title: H('t', ['Crunchy %A and %B salad', 'Fresh %A and %B salad', 'Bright %A and %B bowl']) + ' with ' + tails[pid], label: p.pan && pid !== 'chickpeas' ? 'Warm salad' : 'Salad', tag: H('g', ['A proper lunch, with barely any cooking.', 'Crisp, bright and filling.', 'Raw vegetables, but a meal.']),
        pantry: [p.row].concat(rows), steps: steps, cook: cook, tip: 'Serve with good bread to mop up the dressing.' };
    };

    dishes.greens = function () {
      var pid = H('gp', ['eggs', 'chorizo', 'chickpeas', 'ham', 'prawns']), p = pro(pid);
      var fresh = function (v) { return P[v.slug].rawOnly || v.slug === 'lechuga-romana'; };
      var ls = leafs.filter(function (v) { return !fresh(v); }).sort(function (x, y) { return P[y.slug].saute - P[x.slug].saute; });
      var others = items.filter(function (v) { return !P[v.slug].leaf; });
      var held = items.filter(fresh), cooked = others.filter(function (v) { return !P[v.slug].rawOnly; });
      var main = cooked[0] || ls[0], cook = 1;
      var steps = [prepStep(false, protPrep(p) ? [protPrep(p)] : null)];
      steps.push({ lead: 'Heat', text: 'Warm 1 tbsp olive oil in a large pan over medium heat.' + (p.pan && pid !== 'chickpeas' ? ' Add the <b>' + p.row[0].toLowerCase() + '</b> and cook until golden, then lift it out and keep it warm.' : ' Add the sliced garlic and stir for 30 s.'), meta: p.pan && pid !== 'chickpeas' ? min(p.pan) : '30 s' });
      if (p.pan && pid !== 'chickpeas') { cook += p.pan; steps.push({ lead: 'Garlic', text: 'Add the sliced garlic to the same pan and stir for 30 s.' }); }
      cooked.forEach(function (v) { steps.push({ lead: 'Cook', text: 'Add the ' + B(v) + ' and cook, stirring, until tender.', meta: min(P[v.slug].saute) }); cook += P[v.slug].saute; });
      ls.forEach(function (v) { steps.push({ lead: 'Wilt', text: 'Add the ' + B(v) + ' and cook until it just softens.', meta: min(P[v.slug].saute) }); cook += P[v.slug].saute; });
      held.forEach(function (v) { steps.push({ lead: 'Fresh', text: 'Take the pan off the heat and stir in the fresh ' + B(v) + '.' }); });
      if (pid === 'eggs') { steps.push({ lead: 'Eggs', text: 'Push the greens to the side, add a drizzle of oil and fry the eggs until the whites are set.', meta: min(4) }); cook += 4; }
      else if (pid === 'chickpeas') { steps.push({ lead: 'Warm', text: 'Stir in the chickpeas and warm through.', meta: min(2) }); cook += 2; }
      else steps.push({ lead: 'Return', text: 'Return the ' + p.row[0].toLowerCase() + ' to the pan and toss everything together.' });
      steps.push({ lead: 'Finish', text: 'Add the salt, pepper and a squeeze of lemon.' + (pid === 'eggs' ? ' Serve the greens with the eggs on top.' : ' Serve straight away.') });
      var tails = { eggs: 'fried eggs', chorizo: 'chorizo', chickpeas: 'chickpeas', ham: 'crispy ham', prawns: 'prawns' };
      var ttl;
      if (!ls.length) ttl = 'Warm garlicky ' + nm(main) + ' with fresh ' + nm(held[0]) + ' and ' + tails[pid];
      else if (!cooked.length) ttl = 'Garlicky ' + nm(a) + ' and ' + nm(b) + ' sauté with ' + tails[pid];
      else ttl = H('t', ['Garlicky %M with wilted %L and ' + tails[pid], 'Pan-tossed %M and %L with ' + tails[pid]]).replace('%M', nm(main)).replace('%L', nm(ls[0]));
      return { title: ttl, label: 'One pan', tag: H('g', ['One pan, about ten minutes at the stove.', 'Quick, green and savoury.', 'A fast pan dish that tastes like more effort.']),
        pantry: [p.row, oil(1), ['Garlic', '1', 'clove'], ['Lemon', '1/2', 'piece'], salt('1/2'), pepper], steps: steps, cook: cook, tip: pid === 'eggs' ? 'Serve on toasted bread for a brunch.' : 'Spoon over rice, couscous or toast.' };
    };

    dishes.warm = function () {
      var w = pa.rawOnly ? b : a, f = pa.rawOnly ? a : b, pid = H('wp', ['chicken', 'halloumi', 'feta', 'salmon']), p = pro(pid);
      var list = [{ label: B(w), d: P[w.slug].roast }];
      if (p.roast && pid !== 'feta') list.push({ label: '<b>' + p.row[0].toLowerCase() + '</b>', d: p.roast });
      var steps = [heat, prepStep(false, protPrep(p) ? [protPrep(p)] : null)];
      steps.push({ lead: 'Season', text: 'Toss the ' + B(w) + (p.roast ? ' and the ' + p.row[0].toLowerCase() : '') + ' with 1.5 tbsp olive oil, ' + SEASON[hash(key) % 2][0].toLowerCase() + ' and half the salt on a tray.' });
      roastSteps(list).forEach(function (s) { steps.push(s); });
      steps.push({ lead: 'Dress', text: 'Meanwhile, toss the ' + B(f) + ' with 1 tbsp olive oil, the lemon juice, the rest of the salt and the pepper' + (pid === 'feta' ? ', then crumble the feta over it' : '') + '.' });
      steps.push({ lead: 'Serve', text: 'Let the roasted food cool for 3 min, then combine with the fresh ' + nm(f) + ' and serve warm.', meta: min(3) });
      var mx = Math.max.apply(null, list.map(function (x) { return x.d; }));
      return { title: ({ chicken: 'Roast chicken and %W with fresh %F', halloumi: 'Roasted %W and halloumi with fresh %F', feta: 'Warm %W with fresh %F and feta', salmon: 'Roasted salmon and %W with fresh %F' })[pid].replace('%W', nm(w)).replace('%F', nm(f)), label: 'Oven + fresh', tag: 'Hot and cold on one plate.',
        pantry: [p.row, ['Olive oil', '2.5', 'tbsp'], SEASON[hash(key) % 2], ['Lemon juice', '1', 'tbsp'], salt('3/4'), pepper], steps: steps, cook: mx + 3, tip: 'Add a spoonful of Greek yoghurt on the side.' };
    };

    dishes.roast = function () {
      var pid = H('rp', ['chicken', 'chorizo', 'salmon', 'feta', 'yoghurt', 'halloumi']), p = pro(pid), seas = pid === 'yoghurt' ? SEASON[1] : H('s', SEASON);
      var list = items.map(function (v) { return { label: B(v), d: P[v.slug].roast }; });
      if (p.roast && pid !== 'feta') list.push({ label: '<b>' + p.row[0].toLowerCase() + '</b>', d: p.roast });
      var steps = [heat, prepStep(false, protPrep(p) ? [protPrep(p)] : null)];
      steps.push({ lead: 'Season', text: 'Toss everything that goes in the oven with 2 tbsp olive oil, ' + seas[0].toLowerCase() + ', salt and pepper and spread in one layer on a large tray.' });
      roastSteps(list).forEach(function (s) { steps.push(s); });
      var fin = { feta: 'Crumble the feta over the hot tray, add the herbs and a squeeze of lemon.', yoghurt: 'Stir the yoghurt with the crushed garlic and lemon juice and spoon it over the tray.', halloumi: 'Squeeze over the lemon and scatter the herbs.' }[pid] || 'Squeeze over the lemon, add the herbs and taste for salt.';
      steps.push({ lead: 'Finish', text: fin });
      var rows = [p.row, oil(2), seas, ['Garlic', '1', 'clove'], ['Lemon', '1/2', 'piece'], H('h', HERBS), salt('1/2'), pepper];
      var titles = { chicken: 'Chicken tray bake with %A and %B', chorizo: 'Roasted %A and %B with chorizo', salmon: 'Salmon with roasted %A and %B', feta: 'Roasted %A and %B with feta and herbs', yoghurt: 'Spiced roasted %A and %B with garlic yoghurt', halloumi: 'Roasted %A and %B with halloumi' };
      return { title: titles[pid], label: 'Tray bake', tag: H('g', ['One tray, one oven, very little washing up.', 'Roasted until sweet and golden.', 'Hands-off cooking: prep, roast, eat.']),
        pantry: rows, steps: steps, cook: Math.max.apply(null, list.map(function (x) { return x.d; })), tip: pid === 'salmon' ? 'Serve with a green salad or boiled potatoes.' : 'Serve with rice, couscous or crusty bread.' };
    };

    dishes.soup = function () {
      var pid = H('sop', ['yoghurt', 'chorizo', 'ham', 'chickpeas']), p = pro(pid), spice = H('s', [SEASON[1], SEASON[0], ['Fresh thyme', '4', 'sprigs']]);
      var hard = items.some(function (v) { return (P[v.slug].roast || 0) >= 25; }), simmer = hard ? 20 : 12, softs = leafs;
      var steps = [prepStep(false, ['<b>onion</b>: chop' + (skipOnion ? '' : ''), 'garlic: slice'].slice(skipOnion ? 1 : 0))];
      steps.push({ lead: 'Soften', text: 'Soften the ' + (skipOnion ? '' : 'onion and ') + 'garlic in 1 tbsp olive oil in a large pot over medium heat with the ' + spice[0].toLowerCase() + '.', meta: min(5) });
      steps.push({ lead: 'Simmer', text: 'Add the ' + hardItems.map(nm).join(' and ') + ' and the stock. Bring to the boil, then simmer with the lid half on until the vegetables are very soft.', meta: min(simmer) });
      if (softs.length) steps.push({ lead: 'Greens', text: 'Stir in the ' + softs.map(B).join(' and ') + ' for the last 2 min.', meta: min(2) });
      if (pid === 'chorizo' || pid === 'ham') steps.push({ lead: 'Crisp', text: 'While it simmers, fry the ' + p.row[0].toLowerCase() + ' in a dry pan until crisp.', meta: min(p.pan) });
      steps.push({ lead: 'Blend', text: 'Blend until smooth' + (pid === 'chickpeas' ? ', keeping half of the chickpeas whole and stirring them in afterwards' : '') + '. Add a splash of water if too thick and season to taste.', meta: min(3) });
      steps.push({ lead: 'Serve', text: pid === 'yoghurt' ? 'Ladle into bowls and swirl in the yoghurt with a drizzle of olive oil.' : pid === 'chickpeas' ? 'Ladle into bowls and top with a drizzle of olive oil.' : 'Ladle into bowls and top with the crispy ' + p.row[0].toLowerCase() + '.' });
      var tails = { yoghurt: 'a yoghurt swirl', chorizo: 'crispy chorizo', ham: 'crispy ham', chickpeas: 'chickpeas' };
      return { title: H('t', ['Velvety %A and %B soup', 'Creamy %A and %B soup', 'Silky %A and %B soup']) + ' with ' + tails[pid], label: 'Soup', tag: H('g', ['A bowl of comfort, blended smooth.', 'Warming, simple and made in one pot.']),
        pantry: [p.row, oil(1)].concat(onionRow, [['Garlic', '1', 'clove'], ['Vegetable or chicken stock', '700', 'ml'], spice, salt('1/2'), pepper]), steps: steps, cook: 5 + simmer + 3, tip: 'Serve with toasted bread and a little cheese.' };
    };

    dishes.stir = function () {
      var pid = H('stp', ['chicken', 'beef', 'prawns', 'tofu']), p = pro(pid), cut = function (v) { return Math.max(3, Math.min(6, Math.round(P[v.slug].saute * 0.6))); };
      var vs = items.slice().sort(function (x, y) { return cut(y) - cut(x); }), veg = cut(vs[0]) + (cut(vs[1]) >= 3 && vs[0] !== vs[1] ? 2 : 0);
      var steps = [prepStep(false, [protPrep(p), 'ginger: grate'], 'cut into thin bite-sized pieces')];
      steps.push({ lead: 'Rice', text: 'Cook the rice in salted water following the packet instructions, then drain.', meta: min(12) });
      steps.push({ lead: 'Sauce', text: 'Mix the soy sauce, ginger, sesame oil and 2 tbsp water in a small bowl.' });
      steps.push({ lead: 'Brown', text: 'Stir-fry the ' + p.row[0].toLowerCase() + ' in 1 tbsp oil in a hot wok or large pan until cooked, then set aside.', meta: min(p.pan) });
      steps.push({ lead: 'Veg', text: 'In the same pan stir-fry the ' + B(vs[0]) + ' first, then add the ' + B(vs[1]) + ' with the garlic.', meta: min(veg) });
      steps.push({ lead: 'Combine', text: 'Return the ' + p.row[0].toLowerCase() + ', pour in the sauce and toss for 1 min until glossy. Serve over the rice.', meta: min(1) });
      var tails = { chicken: 'chicken', beef: 'beef', prawns: 'prawns', tofu: 'tofu' };
      return { title: H('t', ['Ginger %A and %B stir-fry', 'Sesame %A and %B stir-fry', 'Quick %A and %B wok']) + ' with ' + tails[pid], label: 'Stir-fry', tag: H('g', ['Fast, hot and savoury, with rice.', 'Everything in one hot pan.']),
        pantry: [p.row, ['Rice, dry', '150', 'g'], ['Soy sauce', '2', 'tbsp'], ['Fresh ginger', '2', 'cm piece'], ['Garlic', '1', 'clove'], ['Sesame oil', '1', 'tsp'], oil(1)], steps: steps, cook: Math.max(12, p.pan + veg + 1 + 2), tip: 'Finish with sesame seeds or a few chilli flakes.' };
    };

    dishes.egg = function () {
      var spanish = a.slug === 'patata' || b.slug === 'patata' || hash(key + 'e') % 2 === 0, pid = H('ep', spanish ? ['ham', 'chorizo', 'parmesan', 'feta'] : ['feta', 'ham', 'parmesan', 'chorizo']);
      var p = pid === 'parmesan' ? { row: ['Parmesan, grated', '40', 'g'], tail: 'parmesan' } : pro(pid);
      var soft = Math.min(15, Math.max(P[a.slug].saute || 6, P[b.slug].saute || 6)), steps = [prepStep(false, ['<b>onion</b>: slice thinly'].slice(skipOnion ? 1 : 0).concat(protPrep(p) ? [protPrep(p)] : []), 'cut into small thin pieces')];
      steps.push({ lead: 'Cook', text: 'Cook the ' + (skipOnion ? '' : 'onion, ') + items.map(B).join(' and ') + ' in 2 tbsp olive oil in a 24 cm non-stick pan over medium-low heat, covered, until soft.', meta: min(soft) });
      steps.push({ lead: 'Beat', text: 'Beat the eggs with the salt and pepper' + (pid === 'parmesan' ? ' and parmesan' : '') + ', then stir in the cooled vegetables' + (pid === 'ham' || pid === 'chorizo' ? ' and the ' + p.row[0].toLowerCase() : '') + (pid === 'feta' ? ' and crumbled feta' : '') + '.' });
      steps.push({ lead: 'Set', text: 'Pour back into the pan and cook over low heat until the edges are set.', meta: min(6) });
      steps.push({ lead: spanish ? 'Flip' : 'Finish', text: spanish ? 'Flip using a plate and cook the other side until golden.' : 'Finish under a hot grill until puffed and golden.', meta: min(4) });
      return { title: spanish ? 'Spanish-style %A and %B tortilla'.replace('%A', nm(a)).replace('%B', nm(b)) : (nm(a) + ' and ' + nm(b) + ' frittata with ' + p.tail).replace(/^./, function (c) { return c.toUpperCase(); }), label: spanish ? 'Tortilla' : 'Frittata', tag: spanish ? 'Soft in the middle, golden outside.' : 'Slice it hot or cold.',
        pantry: [['Eggs', '5', 'large'], p.row[0] === 'Eggs' ? ['Feta', '60', 'g'] : p.row, oil(2)].concat(onionRow, [salt('1/2'), pepper]), steps: steps, cook: soft + 10, tip: 'Serve with a tomato salad and bread.' };
    };

    dishes.pasta = function () {
      var pid = H('pp', ['chorizo', 'ham', 'chicken', 'prawns', 'parmesan']), p = pid === 'parmesan' ? { row: ['Chilli flakes', '1/2', 'tsp'], pan: 0, tail: 'garlic and chilli' } : pro(pid);
      var vs = items.filter(function (v) { return !P[v.slug].leaf; }).concat(leafs), vt = Math.max(P[a.slug].saute, P[b.slug].saute);
      var steps = [prepStep(false, (protPrep(p) ? [protPrep(p)] : []).concat(['garlic: slice']), 'cut into small bite-sized pieces')];
      steps.push({ lead: 'Boil', text: 'Cook the pasta in plenty of salted boiling water until al dente. Keep a cup of the water, then drain.', meta: min(10) });
      if (p.pan) steps.push({ lead: 'Brown', text: 'Meanwhile, fry the <b>' + p.row[0].toLowerCase() + '</b> in 1 tbsp olive oil until golden.', meta: min(p.pan) });
      steps.push({ lead: 'Cook', text: 'Cook the ' + vs.filter(function (v) { return !P[v.slug].leaf; }).map(B).join(' and ') + ' in 1 tbsp olive oil with the garlic until tender' + (leafs.length ? ', adding the ' + leafs.map(B).join(' and ') + ' for the last minute' : '') + '.', meta: min(Math.min(vt, 12)) });
      steps.push({ lead: 'Toss', text: 'Toss the pasta with the vegetables' + (p.pan ? ', the ' + p.row[0].toLowerCase() : '') + ', a splash of the pasta water and the parmesan until glossy.', meta: min(1) });
      steps.push({ lead: 'Serve', text: 'Finish with black pepper and a squeeze of lemon.' });
      var tails = { chorizo: 'chorizo', ham: 'crispy ham', chicken: 'chicken', prawns: 'prawns', parmesan: 'garlic and chilli' };
      return { title: pid === 'parmesan' ? 'Garlic and chilli pasta with %A and %B' : 'Pasta with %A, %B and ' + tails[pid], label: 'Pasta', tag: H('g', ['Weeknight pasta where the vegetables lead.', 'Glossy, garlicky and ready in 20 minutes.']),
        pantry: [['Pasta, dry', '160', 'g'], p.row, ['Parmesan, grated', '30', 'g'], oil(2), ['Garlic', '2', 'cloves'], ['Lemon', '1/2', 'piece'], salt('1/2'), pepper], steps: steps, cook: Math.max(10, p.pan + Math.min(vt, 12) + 2), tip: 'Add a handful of fresh basil or parsley at the end.' };
    };

    dishes.curry = function () {
      var pid = H('cp', ['chicken', 'chickpeas', 'prawns', 'tofu']), p = pro(pid), hardV = items.filter(function (v) { return !P[v.slug].leaf; });
      var vt = Math.min(15, Math.max.apply(null, hardV.map(function (v) { return P[v.slug].saute; }).concat([4]))) + 8;
      var steps = [prepStep(false, (protPrep(p) ? [protPrep(p)] : []).concat(['ginger and garlic: grate and crush']))];
      steps.push({ lead: 'Rice', text: 'Cook the rice in salted water following the packet instructions, then drain.', meta: min(12) });
      steps.push({ lead: 'Soften', text: 'Soften the ' + (skipOnion ? '' : 'onion ') + 'in 1 tbsp oil in a wide pan, then add the ginger, garlic and curry powder for 1 min.', meta: min(skipOnion ? 2 : 6) });
      if (pid === 'chicken' || pid === 'tofu') steps.push({ lead: 'Brown', text: 'Add the <b>' + p.row[0].toLowerCase() + '</b> and stir until lightly browned.', meta: min(p.pan > 6 ? 5 : 4) });
      steps.push({ lead: 'Simmer', text: 'Add ' + hardV.map(B).join(' and ') + ', the coconut milk and 100 ml water. Simmer with a lid on until the vegetables are tender' + (pid === 'chicken' ? ' and the chicken is cooked through.' : '.'), meta: min(vt) });
      var last = leafs.map(B); if (pid === 'chickpeas' || pid === 'prawns') last.push('<b>' + p.row[0].toLowerCase() + '</b>');
      if (last.length) steps.push({ lead: 'Add', text: 'Stir in the ' + last.join(' and ') + ' for the last ' + (pid === 'prawns' ? '3' : '3') + ' min.', meta: min(3) });
      steps.push({ lead: 'Finish', text: 'Season with salt and lemon, scatter the coriander and serve over the rice.' });
      var tails = { chicken: 'chicken', chickpeas: 'chickpeas', prawns: 'prawns', tofu: 'tofu' };
      return { title: H('t', ['Coconut %A and %B curry', 'Golden %A and %B curry', 'Mild %A and %B curry']) + ' with ' + tails[pid], label: 'Curry', tag: H('g', ['Gently spiced, creamy and warming.', 'One pot, big flavour.']),
        pantry: [p.row, ['Rice, dry', '150', 'g'], ['Coconut milk', '400', 'ml'], ['Curry powder', '2', 'tsp'], oil(1)].concat(onionRow, [['Garlic and ginger', '2 + 2', 'cloves, cm'], ['Fresh coriander', '1', 'handful'], salt('1/2')]), steps: steps, cook: Math.max(12, 8 + vt + 3), tip: 'Serve with a spoonful of yoghurt and lemon wedges.' };
    };

    dishes.gratin = function () {
      var pid = H('gr', ['ham', 'none']), boil = items.some(function (v) { return (P[v.slug].roast || 0) >= 25; }) ? 8 : 5;
      var steps = [heat, prepStep(false, ['garlic: crush'], 'slice thinly (about 3 mm)')];
      steps.push({ lead: 'Boil', text: 'Boil the ' + items.map(B).join(' and ') + ' in salted water until just tender, then drain very well' + (leafs.length ? ' (squeeze the greens dry)' : '') + '.', meta: min(boil) });
      steps.push({ lead: 'Layer', text: 'Layer the vegetables in a baking dish' + (pid === 'ham' ? ' with the ham' : '') + '. Mix the cream with the garlic, nutmeg, salt and pepper, pour it over and cover with the cheese.' });
      steps.push({ lead: 'Bake', text: 'Bake until bubbling and golden on top.', meta: min(25) });
      steps.push({ lead: 'Rest', text: 'Let it rest for 5 min before serving.', meta: min(5) });
      return { title: H('t', ['Creamy %A and %B gratin', 'Golden %A and %B bake']) + (pid === 'ham' ? ' with ham' : ' with cheese'), label: 'Gratin', tag: 'Bubbling, golden and very comforting.',
        pantry: [pid === 'ham' ? ['Cooked ham', '100', 'g'] : ['Cheddar, grated', '60', 'g'], pid === 'ham' ? ['Cheddar, grated', '60', 'g'] : ['Cream', '200', 'ml'], pid === 'ham' ? ['Cream', '200', 'ml'] : ['Garlic', '1', 'clove'], pid === 'ham' ? ['Garlic', '1', 'clove'] : ['Nutmeg', '1', 'pinch'], pid === 'ham' ? ['Nutmeg', '1', 'pinch'] : salt('1/2'), pid === 'ham' ? salt('1/2') : pepper, pid === 'ham' ? pepper : null].filter(Boolean), steps: steps, cook: boil + 25 + 5, tip: 'Serve with a sharp green salad.' };
    };

    dishes.stuffed = function () {
      var vessels = vesselsOK();
      var vs = vessels.length === 2 ? H('v', vessels) : vessels[0], fl = vs === a ? b : a, V = VESSEL[vs.slug];
      var pid = H('stf', ['beef', 'chorizo', 'feta']), p = pro(pid), ft = Math.min(P[fl.slug].saute, 8);
      var steps = [heat, prepStep(false, [], 'cut into small dice')];
      steps[1] = { lead: 'Prep', text: B(vs) + ': ' + V[1] + '. ' + B(fl) + ': ' + (P[fl.slug].leaf ? 'chop finely' : 'cut into small dice') + (protPrep(p) ? '. ' + protPrep(p) : '') + '. Onion and garlic: chop finely.', meta: min(prepMin) };
      steps.push({ lead: 'Filling', text: 'Fry the ' + (skipOnion ? '' : 'onion, ') + (pid === 'feta' ? '' : '<b>' + p.row[0].toLowerCase() + '</b>, ') + 'garlic and ' + B(fl) + ' in 1 tbsp oil until soft' + (pid === 'beef' ? ' and the beef is browned' : '') + '.', meta: min(ft + (pid === 'feta' ? 0 : p.pan)) });
      steps.push({ lead: 'Mix', text: 'Stir in the cooked rice' + (pid === 'feta' ? ', crumbled feta' : ', half of the parmesan') + ', salt and pepper.' });
      steps.push({ lead: 'Fill', text: 'Fill the ' + V[0] + ' generously, place in a baking dish with a splash of water and drizzle with oil.' });
      steps.push({ lead: 'Bake', text: 'Bake until the ' + V[0] + ' are tender and the tops are golden.', meta: min(V[2]) });
      return { title: 'Stuffed ' + V[0] + ' with ' + nm(fl) + ' and ' + (pid === 'feta' ? 'feta' : p.tail), label: 'Stuffed', tag: 'A small feast in its own edible dish.',
        pantry: [pid === 'feta' ? p.row : p.row, ['Cooked rice', '150', 'g'], oil(2)].concat(onionRow, [['Garlic', '1', 'clove'], pid === 'feta' ? ['Fresh parsley', '1', 'handful'] : ['Parmesan, grated', '30', 'g'], salt('1/2'), pepper]), steps: steps, cook: ft + (pid === 'feta' ? 0 : p.pan) + 2 + V[2], tip: 'Serve with a simple tomato salad.' };
    };

    dishes.fritter = function () {
      var steps = [prepStep(false, [], 'grate or chop finely')];
      steps.push({ lead: 'Dry', text: 'Salt the grated vegetables, leave for 5 min and squeeze out the water in a clean cloth.', meta: min(5) });
      steps.push({ lead: 'Mix', text: 'Mix with the eggs, flour, cumin, salt and pepper into a thick batter.' });
      steps.push({ lead: 'Fry', text: 'Fry spoonfuls in 3 tbsp hot oil, 3 min per side, in two batches, until golden. Drain on paper.', meta: min(12) });
      steps.push({ lead: 'Dip', text: 'Stir the yoghurt with the lemon juice and mint and serve alongside.' });
      return { title: H('t', ['Crispy %A and %B fritters', 'Golden %A and %B fritters']) + ' with yoghurt dip', label: 'Fritters', tag: 'Crisp outside, soft inside.',
        pantry: [['Eggs', '2', 'large'], ['Plain flour', '4', 'tbsp'], ['Greek yoghurt', '150', 'g'], ['Lemon juice', '1', 'tbsp'], ['Fresh mint', '1', 'handful'], ['Ground cumin', '1', 'tsp'], oil(3), salt('1/2')], steps: steps, cook: 5 + 12 + 1, tip: 'Serve with a green salad for a light dinner.' };
    };

    function vesselsOK() {
      return items.filter(function (v) { var o = v === a ? b : a; return VESSEL[v.slug] && !P[o.slug].rawOnly && !has(NOPASTA, o.slug); });
    }
    /* ----- which dishes suit this pair? ----- */
    var bothRaw = pa.raw && pb.raw && (pa.rawPref || pb.rawPref), anyLeaf = pa.leaf || pb.leaf, anyRawOnly = pa.rawOnly || pb.rawOnly;
    var roastable = !pa.leaf && !pb.leaf && !pa.rawOnly && !pb.rawOnly;
    var elig = [];
    if (bothRaw) elig.push('salad');
    if (items.some(function (v) { return !P[v.slug].rawOnly && v.slug !== 'lechuga-romana'; }) && anyLeaf) elig.push('greens');
    if (anyRawOnly && !anyLeaf && !bothRaw) elig.push('warm');
    if (roastable) elig.push('roast');
    if (both(SOUP)) elig.push('soup');
    if (both(STIR)) elig.push('stir');
    if (both(EGG)) elig.push('egg');
    if (!has(NOPASTA, a.slug) && !has(NOPASTA, b.slug)) elig.push('pasta');
    if (both(CURRY)) elig.push('curry');
    if (both(GRATIN)) elig.push('gratin');
    if (vesselsOK().length) elig.push('stuffed');
    if (both(FRITTER)) elig.push('fritter');
    if (elig.length > 1 && elig.indexOf('pasta') >= 0 && hash(key + 'pasta') % 2) elig.splice(elig.indexOf('pasta'), 1);
    if (elig.length > 1 && elig.indexOf('greens') >= 0 && hash(key + 'gr') % 2) elig.splice(elig.indexOf('greens'), 1);
    var kind = elig[hash(key + 'kind') % elig.length], d = dishes[kind]();
    var title = d.title.replace('%A', nm(a)).replace('%B', nm(b));
    title = cap(title);
    return { a: a, b: b, type: kind, label: d.label, title: title, tag: d.tag, steps: d.steps, pantry: d.pantry, time: prepMin + d.cook, key: key, tip: d.tip, elig: elig.length };
  }

  /* ---------- Nutrition and cost for the card ---------- */
  function numbers(r) {
    var items = [r.a, r.b], servings = 2, tot = {}, cost = 0, est = false;
    NUTRIENTS.forEach(function (k) { tot[k] = 0; });
    items.forEach(function (v) {
      var g = P[v.slug].buy * v.edible;
      NUTRIENTS.forEach(function (k) { tot[k] += g / servings * v.n[k] / 100 / REF[k] * 100; });
      cost += P[v.slug].buy / 1000 * v.price; if (v.source !== 'panel') est = true;
    });
    var list = NUTRIENTS.map(function (k) { return { k: k, label: NAMES[k][0], pct: tot[k] }; }).sort(function (x, y) { return y.pct - x.pct; }).slice(0, 5);
    var edible = items.reduce(function (s, v) { return s + P[v.slug].buy * v.edible; }, 0) / servings;
    return { list: list, cost: cost, est: est, edible: Math.round(edible / 10) * 10 };
  }

  /* ---------- The sheet (preview and PDF use the same markup) ---------- */
  function sheetHTML(r) {
    var n = numbers(r), items = [r.a, r.b];
    var rows = items.map(function (v) {
      var p = P[v.slug], ed = Math.round(p.buy * v.edible / 5) * 5;
      return '<tr><td>' + cap(lc(v.name)) + '<span class="sub">' + (v.source === 'panel' ? '' : v.source === 'grupo' ? 'group price' : 'estimated price') + '</span></td><td>' + p.buy + '</td><td>g as bought</td><td>' + ed + ' g edible</td></tr>';
    }).concat(r.pantry.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td><td>' + x[2] + '</td><td></td></tr>'; })).join('');
    rows = rows.replace(/<span class="sub"><\/span>/g, '');
    var steps = r.steps.map(function (s) { return '<li><p><b>' + s.lead + '.</b> ' + s.text + (s.meta ? ' ' + chip(s.meta) : '') + '</p></li>'; }).join('');
    var bars = n.list.map(function (x) {
      var w = Math.max(0, Math.min(100, x.pct));
      return '<div class="cg-score"><span class="cg-score__label">' + x.label + '</span><div class="cg-score__track"><div class="cg-score__bar" style="width:' + w + '%"></div></div><span class="cg-score__value">' + Math.round(x.pct) + ' %</span></div>';
    }).join('');
    var hero = items.map(function (v) {
      return '<div class="one"><span class="pic">' + pic(v) + '</span><b>' + cap(lc(v.name)) + '</b><span class="sc">Nutrient score <i>' + Math.round(v.score) + '</i> of 100 (per 100 g)</span></div>';
    }).join('<span class="plus" aria-hidden="true">+</span>');
    return '<div class="sheet">' +
      '<header><div class="kick">' + chip('Recipe') + chip('2 servings') + chip('About ' + r.time + ' min') + '<span class="cg-chip cg-chip--solid">' + r.label + '</span></div>' +
      '<h1>' + r.title + '</h1><p class="tag">' + r.tag + '</p></header>' +
      '<div class="hero">' + hero + '</div>' +
      '<div class="cols"><section><h2>You need</h2><div class="cg-table"><table><thead><tr><th scope="col">Ingredient</th><th scope="col">Amount</th><th scope="col">Unit</th><th scope="col">Edible part</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>' +
      '<section class="meth"><h2>Method</h2><ol class="steps">' + steps + '</ol><div class="tip"><b>Serving idea</b>' + r.tip + '</div></section></div>' +
      '<section><h2>The two vegetables, in one serving (about ' + n.edible + ' g)</h2><div class="nutwrap"><div class="nut">' + bars + '</div>' +
      '<div class="cost"><b>&euro; ' + n.cost.toFixed(2) + '</b><span>for the two vegetables only, 2 servings' + (n.est ? ' (includes an estimated or group price)' : '') + '. Extras are not included.</span></div></div>' +
      '<p class="foot" style="margin-top:6px">Bars show the share of the EU daily reference in one serving, from the raw values of the two vegetables only. Extras such as meat, eggs, dairy, rice or pasta are not counted.</p></section>' +
      '<footer class="foot"><b>Suggested method, not a tested recipe.</b> Extras (meat, fish, eggs, dairy, rice, pasta, spices) are suggestions: swap meat for chickpeas or tofu to make it vegetarian. Times in min and oven temperatures in &deg;C are typical values. Nutrition: approximate per 100 g raw vegetable, USDA FoodData Central (provisional); daily reference EU 1169/2011 Annex XIII, fiber EFSA 25 g; Score = nutrient density per 100 g, 0 to 100. Prices: &euro; per kg as bought, MAPA panel, July 2026. Cooking changes nutrient amounts. Illustrations: Vegetable Chart. Cool Graphs design system.</footer>' +
      '</div>';
  }

  /* If a recipe is long, shrink the text a little until it fits the page. Never below 70%. */
  function fitSheet(sheet) {
    var cols = sheet.querySelector('.cols'), s = 1; sheet.style.setProperty('--s', 1);
    while (cols.scrollHeight > cols.clientHeight + 1 && s > 0.7) { s = Math.round((s - 0.03) * 100) / 100; sheet.style.setProperty('--s', s); }
    return s;
  }

  /* ---------- Screens ---------- */
  var app = document.getElementById('app'), live = document.getElementById('live');
  var state = { sel: [], screen: 'pick', recipe: null };
  function say(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }

  function barHTML() {
    var s = state.sel;
    if (s.length === 2) return '<button type="button" class="cg-btn cg-btn--primary" id="gen">Generate recipe: ' + lc(bySlug[s[0]].name) + ' + ' + lc(bySlug[s[1]].name) + ' ' + icon('arrow_forward') + '</button>';
    return '<button type="button" class="cg-btn cg-btn--primary" id="gen" disabled>' + (s.length ? 'Pick one more vegetable' : 'Pick two vegetables') + '</button>';
  }
  function renderPick() {
    var h = '<section class="screen" aria-labelledby="h-pick"><div class="status"><h2 id="h-pick" style="font-size:var(--cg-text-title)">Choose your two vegetables</h2>' + '<span class="cg-chip" id="count"></span></div>' +
      '<div class="vgrid" role="group" aria-label="Vegetables">' +
      sorted.map(function (v) {
        return '<button type="button" class="cg-card veg" data-s="' + v.slug + '" aria-pressed="false"><span class="num" aria-hidden="true"></span><span class="pic">' + pic(v) + '</span><b>' + v.name + '</b></button>';
      }).join('') + '</div><div class="cg-action-bar" id="bar" role="group" aria-label="Generate recipe"></div></section>';
    app.innerHTML = h;
    app.querySelectorAll('.veg').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-s'), i = state.sel.indexOf(s);
        if (i >= 0) { state.sel.splice(i, 1); say(bySlug[s].name + ' removed.'); }
        else {
          if (state.sel.length === 2) { var gone = state.sel.shift(); say(bySlug[gone].name + ' replaced by ' + bySlug[s].name + '.'); }
          else say(bySlug[s].name + ' selected.');
          state.sel.push(s);
        }
        updatePick();
      });
    });
    updatePick();
  }
  function updatePick() {
    app.querySelectorAll('.veg').forEach(function (b) {
      var i = state.sel.indexOf(b.getAttribute('data-s'));
      b.setAttribute('aria-pressed', String(i >= 0));
      b.querySelector('.num').textContent = i >= 0 ? String(i + 1) : '';
    });
    document.getElementById('count').textContent = state.sel.length + ' of 2 selected';
    var bar = document.getElementById('bar'); bar.innerHTML = barHTML();
    document.getElementById('gen').addEventListener('click', function () {
      if (state.sel.length !== 2) return;
      state.recipe = makeRecipe(bySlug[state.sel[0]], bySlug[state.sel[1]]); state.screen = 'preview'; render(true);
    });
  }

  var scaleTimer;
  function fitPreview() {
    var wrap = document.querySelector('.prev'); if (!wrap) return;
    var s = Math.min(1, wrap.clientWidth / 794), sheet = wrap.querySelector('.sheet');
    sheet.style.transform = 'scale(' + s + ')'; wrap.style.height = Math.round(1123 * s) + 'px';
  }
  window.addEventListener('resize', function () { clearTimeout(scaleTimer); scaleTimer = setTimeout(fitPreview, 60); });

  function renderPreview(focus) {
    var r = state.recipe;
    app.innerHTML = '<section class="screen" aria-labelledby="h-prev"><div class="prevhead"><h2 id="h-prev" tabindex="-1">' + r.title + '</h2>' +
      '<p>Preview of your one-page A4 recipe card. The PDF looks exactly like this, always in the light theme. On a phone, pinch to zoom the preview.</p></div><div id="msg"></div>' +
      '<div class="prev" role="img" aria-label="Preview of the recipe card for ' + r.title + '">' + sheetHTML(r) + '</div>' +
      '<div class="cg-action-bar" role="group" aria-label="Recipe actions"><button type="button" class="cg-btn cg-btn--secondary" id="back">' + 'Change vegetables</button>' +
      '<button type="button" class="cg-btn cg-btn--primary" id="dl">Download PDF ' + icon('arrow_forward') + '</button></div></section>';
    fitSheet(document.querySelector('.prev .sheet')); fitPreview();
    document.getElementById('back').addEventListener('click', function () { state.screen = 'pick'; render(true); });
    document.getElementById('dl').addEventListener('click', download);
    if (focus) document.getElementById('h-prev').focus({ preventScroll: true });
  }

  /* ---------- PDF ---------- */
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); }
  function waitImages(el) {
    return Promise.all([].slice.call(el.querySelectorAll('img')).map(function (im) {
      return im.complete ? Promise.resolve() : new Promise(function (ok) { im.onload = im.onerror = ok; });
    }));
  }
  /* Turn each illustration into inline data so the picture of the page can never be blocked by the browser's cross-site image rules. */
  function inlineImages(el) {
    return Promise.all([].slice.call(el.querySelectorAll('img')).map(function (im) {
      return fetch(im.src).then(function (res) { return res.blob(); }).then(function (bl) {
        return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { im.src = fr.result; im.onload = ok; if (im.complete) ok(); }; fr.onerror = ok; fr.readAsDataURL(bl); });
      }).catch(function () {});
    }));
  }
  function makePdf(r) {
    var cap_ = document.getElementById('capture');
    if (!cap_) { cap_ = document.createElement('div'); cap_.id = 'capture'; document.body.appendChild(cap_); }
    cap_.innerHTML = sheetHTML(r);
    var el = cap_.querySelector('.sheet'); fitSheet(el);
    return Promise.all([document.fonts ? document.fonts.ready : 0, waitImages(el)]).then(function () { return inlineImages(el); }).then(function () { return waitImages(el); }).then(function () {
      return html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null, width: 794, height: 1123, windowWidth: 900 });
    }).then(function (canvas) {
      var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      pdf.setProperties({ title: r.title + ' - Vegetable Recipe', subject: 'One-page recipe card', creator: 'Cool Graphs' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
      var text = r.title + '. ' + r.tag + ' ' + plain(el.querySelector('.cols').innerHTML.replace(/<\/(li|tr|p)>/g, '. '));
      pdf.setFontSize(6);
      pdf.text(pdf.splitTextToSize(text, 190), 10, 10, { renderingMode: 'invisible' });
      return pdf.output('blob');
    });
  }
  function saveFile(blob, name) {
    var getDl = (window.claude && claude.use) ? claude.use('downloads') : Promise.resolve(null);
    return getDl.catch(function () { return null; }).then(function (dl) {
      if (dl) return dl.save({ filename: name, data: blob }).then(function () { return 'saved'; }, function (e) { if (e && e.code === 'declined') return 'declined'; throw e; });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000); return 'saved';
    });
  }
  function download() {
    var r = state.recipe, btn = document.getElementById('dl'), msg = document.getElementById('msg');
    if (!window.html2canvas || !window.jspdf) { msg.innerHTML = banner('error', 'error', 'The PDF tool did not load', 'Check your connection and reload the page, then try again.'); return; }
    btn.disabled = true; msg.innerHTML = ''; btn.firstChild.nodeValue = 'Preparing PDF... '; say('Preparing the PDF.');
    makePdf(r).then(function (blob) { return saveFile(blob, 'recipe-' + r.a.slug + '-' + r.b.slug + '.pdf'); }).then(function (res) {
      if (res === 'saved') { msg.innerHTML = '<div class="cg-banner cg-banner--success" role="status"><span class="cg-banner__icon">' + icon('check_circle') + '</span><div class="cg-banner__body"><strong class="cg-banner__title">PDF ready</strong><div>Your recipe card was sent to your downloads.</div></div></div>'; say('PDF ready.'); }
    }).catch(function () {
      msg.innerHTML = banner('error', 'error', 'The PDF could not be made', 'Try again. If it keeps failing, reload the page.');
    }).then(function () { btn.disabled = false; btn.firstChild.nodeValue = 'Download PDF '; });
  }

  function render(focus) {
    if (state.screen === 'pick') { renderPick(); if (focus) document.getElementById('h-pick').scrollIntoView({ block: 'start' }); }
    else renderPreview(focus);
    if (focus) window.scrollTo({ top: 0 });
  }
  render(false);
  window.__recipe = { makeRecipe: makeRecipe, sheetHTML: sheetHTML, fitSheet: fitSheet, veg: veg };
})();
