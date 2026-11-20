
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

  /* ---------- Recipe engine: any two vegetables give one recipe ---------- */
  function makeRecipe(a, b) {
    var pa = P[a.slug], pb = P[b.slug], key = a.slug + '+' + b.slug;
    var items = [a, b];
    var type, title, tag, steps = [], pantry = [], cook = 0, prepMin = 10;
    function prepStep(raw) {
      var t = items.map(function (v) { return '<b>' + lc(v.name) + '</b>: ' + ((raw && P[v.slug].rawPrep) || P[v.slug].prep); }).join('. ');
      return { lead: 'Prep', text: cap(t.charAt(0) === '<' ? t : t) + '.', meta: min(prepMin) };
    }
    var bothRaw = pa.raw && pb.raw && (pa.rawPref || pb.rawPref);
    var anyLeaf = pa.leaf || pb.leaf;
    var anyRawOnly = pa.rawOnly || pb.rawOnly;

    if (bothRaw) {
      type = 'salad';
      title = pick(['Crunchy %A and %B salad', 'Fresh %A and %B salad', 'Cool %A and %B bowl'], key);
      tag = pick(['No cooking, ready in minutes.', 'Crisp, bright and simple.', 'A raw, quick plate for a warm day.'], key);
      pantry = [['Olive oil', '2', 'tbsp'], ['Lemon juice', '1', 'tbsp'], ['Salt', '1/2', 'tsp'], ['Black pepper', '1', 'pinch']];
      steps.push(prepStep(true));
      steps.push({ lead: 'Dress', text: 'Whisk the olive oil, lemon juice, salt and pepper in a large bowl.' });
      steps.push({ lead: 'Toss', text: 'Add both vegetables and toss well. Let it rest so the flavours mix.', meta: min(5) });
      steps.push({ lead: 'Serve', text: 'Taste, add salt or lemon if needed, and serve cold.' });
      cook = 5;
    } else if (anyLeaf) {
      type = 'greens';
      var leaves = items.filter(function (v) { return P[v.slug].leaf; }).sort(function (x, y) { return P[y.slug].saute - P[x.slug].saute; });
      var others = items.filter(function (v) { return !P[v.slug].leaf; });
      var held = others.filter(function (v) { return P[v.slug].rawOnly; });
      var cooked = others.filter(function (v) { return !P[v.slug].rawOnly; });
      var main = cooked[0] || leaves[0];
      title = others.length ? pick(['Garlicky %M with wilted %L', 'Pan-tossed %M and %L'], key) : 'Garlicky %A and %B sauté';
      tag = pick(['One pan, about ten minutes at the stove.', 'Quick, green and garlicky.', 'A fast pan dish that tastes like more effort.'], key);
      pantry = [['Olive oil', '1', 'tbsp'], ['Garlic', '1', 'clove'], ['Lemon', '1/2', 'piece'], ['Salt', '1/2', 'tsp'], ['Black pepper', '1', 'pinch']];
      steps.push(prepStep(false));
      steps.push({ lead: 'Heat', text: 'Warm the olive oil in a large pan over medium heat. Add the sliced garlic and stir for 30 s.', meta: '30 s' });
      cooked.forEach(function (v) {
        steps.push({ lead: 'Cook', text: 'Add the <b>' + lc(v.name) + '</b> and cook, stirring, until tender.', meta: min(P[v.slug].saute) });
        cook += P[v.slug].saute;
      });
      leaves.forEach(function (v) {
        steps.push({ lead: 'Wilt', text: 'Add the <b>' + lc(v.name) + '</b> and cook until it just softens.', meta: min(P[v.slug].saute) });
        cook += P[v.slug].saute;
      });
      held.forEach(function (v) { steps.push({ lead: 'Fresh', text: 'Take the pan off the heat and stir in the fresh <b>' + lc(v.name) + '</b>.' }); });
      steps.push({ lead: 'Finish', text: 'Add the salt, pepper and a squeeze of lemon. Serve straight away.' });
      title = title.replace('%M', lc(main.name)).replace('%L', lc(leaves[0].name));
      cook += 1;
    } else if (anyRawOnly) {
      type = 'warm';
      var w = pa.rawOnly ? b : a, f = pa.rawOnly ? a : b;
      title = 'Warm ' + lc(w.name) + ' with fresh ' + lc(f.name);
      tag = pick(['Hot and cold on one plate.', 'Warm, crisp and fresh.'], key);
      pantry = [['Olive oil', '2.5', 'tbsp'], ['Lemon juice', '1', 'tbsp'], ['Salt', '3/4', 'tsp'], ['Black pepper', '1', 'pinch']];
      steps.push({ lead: 'Heat', text: 'Heat the oven to <b>200 °C</b> (180 °C with a fan).', meta: '200 °C' });
      steps.push(prepStep(false));
      steps.push({ lead: 'Roast', text: 'Toss the <b>' + lc(w.name) + '</b> with 1.5 tbsp olive oil and half the salt. Spread on a tray and roast until tender and golden.', meta: min(P[w.slug].roast) });
      steps.push({ lead: 'Dress', text: 'Meanwhile, toss the <b>' + lc(f.name) + '</b> with 1 tbsp olive oil, the lemon juice, the rest of the salt and the pepper.' });
      steps.push({ lead: 'Serve', text: 'Let the roasted vegetable cool for 3 min, then combine and serve warm.', meta: min(3) });
      cook = P[w.slug].roast + 3;
    } else {
      type = 'roast';
      var first = pa.roast >= pb.roast ? a : b, second = first === a ? b : a;
      var t1 = P[first.slug].roast, t2 = P[second.slug].roast, gap = t1 - t2;
      title = pick(['Sheet-pan %A and %B', 'Roasted %A and %B tray', 'Golden roasted %A and %B'], key);
      tag = pick(['One tray, one oven, very little washing up.', 'Roasted until sweet and golden.', 'Hands-off cooking: prep, roast, eat.'], key);
      pantry = [['Olive oil', '2', 'tbsp'], ['Garlic', '1', 'clove'], ['Lemon', '1/2', 'piece'], ['Salt', '1/2', 'tsp'], ['Black pepper', '1', 'pinch']];
      steps.push({ lead: 'Heat', text: 'Heat the oven to <b>200 °C</b> (180 °C with a fan).', meta: '200 °C' });
      steps.push(prepStep(false));
      steps.push({ lead: 'Season', text: 'Toss the vegetables with the olive oil, salt and pepper and spread them in one layer on a large tray.' });
      if (gap >= 5) {
        steps.push({ lead: 'Roast', text: 'Roast the <b>' + lc(first.name) + '</b> on its own first.', meta: min(gap) });
        steps.push({ lead: 'Add', text: 'Add the <b>' + lc(second.name) + '</b> and the sliced garlic clove. Roast until both are tender and golden.', meta: min(t2) });
      } else {
        steps.push({ lead: 'Roast', text: 'Roast both together with the sliced garlic clove until tender and golden.', meta: min(t1) });
      }
      steps.push({ lead: 'Finish', text: 'Squeeze over the lemon, taste for salt and serve hot.' });
      cook = t1;
    }
    title = title.replace('%A', lc(a.name)).replace('%B', lc(b.name));
    title = cap(title);
    return { a: a, b: b, type: type, title: title, tag: tag, steps: steps, pantry: pantry, time: prepMin + cook, key: key };
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

  var TIPS = { roast: 'Serve with yoghurt, feta or a fried egg. Leftovers keep 2 days in the fridge.', salad: 'Add a handful of nuts or a boiled egg to make it a meal. Best eaten the same day.', greens: 'Spoon over rice, pasta or toast, with a fried egg on top.', warm: 'Serve with grilled fish or chicken, or with good bread.' };

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
      '<header><div class="kick">' + chip('Recipe') + chip('2 servings') + chip('About ' + r.time + ' min') + '<span class="cg-chip cg-chip--solid">' + { salad: 'No cooking', greens: 'One pan', warm: 'Oven + fresh', roast: 'One tray' }[r.type] + '</span></div>' +
      '<h1>' + r.title + '</h1><p class="tag">' + r.tag + '</p></header>' +
      '<div class="hero">' + hero + '</div>' +
      '<div class="cols"><section><h2>You need</h2><div class="cg-table"><table><thead><tr><th scope="col">Ingredient</th><th scope="col">Amount</th><th scope="col">Unit</th><th scope="col">Edible part</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>' +
      '<section class="meth"><h2>Method</h2><ol class="steps">' + steps + '</ol><div class="tip"><b>Serving idea</b>' + TIPS[r.type] + '</div></section></div>' +
      '<section><h2>In one serving (about ' + n.edible + ' g of vegetables)</h2><div class="nutwrap"><div class="nut">' + bars + '</div>' +
      '<div class="cost"><b>&euro; ' + n.cost.toFixed(2) + '</b><span>for the two vegetables, 2 servings' + (n.est ? ' (includes an estimated or group price)' : '') + '</span></div></div>' +
      '<p class="foot" style="margin-top:6px">Bars show the share of the EU daily reference in one serving, from raw values.</p></section>' +
      '<footer class="foot"><b>Suggested method, not a tested recipe.</b> Times in min and oven temperatures in &deg;C are typical values. Nutrition: approximate per 100 g raw vegetable, USDA FoodData Central (provisional); daily reference EU 1169/2011 Annex XIII, fiber EFSA 25 g; Score = nutrient density per 100 g, 0 to 100. Prices: &euro; per kg as bought, MAPA panel, July 2026. Cooking changes nutrient amounts. Illustrations: Vegetable Chart. Cool Graphs design system.</footer>' +
      '</div>';
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
      }).join('') + '</div><div class="bar" id="bar"></div></section>';
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
      '<div class="bar"><button type="button" class="cg-btn cg-btn--secondary" id="back">' + 'Change vegetables</button>' +
      '<button type="button" class="cg-btn cg-btn--primary" id="dl">Download PDF ' + icon('arrow_forward') + '</button></div></section>';
    fitPreview();
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
    var el = cap_.querySelector('.sheet');
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
  window.__recipe = { makeRecipe: makeRecipe, sheetHTML: sheetHTML, veg: veg };
})();
