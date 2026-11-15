(function () {
  var root = document.documentElement;
  var app = document.getElementById('app');
  var live = document.getElementById('live');

  /* ---------- Theme ---------- */
  var themeBtn = document.getElementById('theme');
  function setTheme(dark) { root.setAttribute('data-theme', dark ? 'dark' : 'light'); themeBtn.setAttribute('aria-checked', String(dark)); }
  setTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeBtn.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') !== 'dark'); });

  /* ---------- Icons (Material Design, outlined) ---------- */
  var ICONS = {
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    check_circle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z',
    arrow_forward: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    arrow_back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    play_arrow: 'M8 5v14l11-7z',
    stop: 'M6 6h12v12H6z',
    replay: 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
    info: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
  };
  function icon(n, size) { size = size || 24; return '<svg class="cg-icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="' + ICONS[n] + '"/></svg>'; }

  /* ---------- Data: your whiteboard, entered 15 November 2026 ---------- */
  var IMG = { 'latera-normal': '@@IMG_LATERA_NORMAL@@', 'decaf-latera': '@@IMG_DECAF_LATERA@@', 'decaf-lavazza': '@@IMG_DECAF_LAVAZZA@@', bean: '@@IMG_BEAN@@' };
  var COFFEES = [
    { id: 'latera-normal', name: 'Latera Normal', kind: 'Regular', img: 'latera-normal', alt: 'A blue coffee cup with open eyes and a smile', dose: 18, grind: 12, wip: false, yield: 36, tmin: 30, tmax: 30, temp: 94, chapita: true },
    { id: 'decaf-latera', name: 'Decaf Latera', kind: 'Decaf', img: 'decaf-latera', alt: 'A blue coffee cup with closed eyes and a smile', dose: 18, grind: 11.5, wip: false, yield: 35, tmin: 30, tmax: 35, temp: 92, chapita: false },
    { id: 'decaf-lavazza', name: 'Decaf Lavazza', kind: 'Decaf', img: 'decaf-lavazza', alt: 'A yellow coffee cup with closed eyes and a smile', dose: 18, grind: 11, wip: false, yield: 36, tmin: 30, tmax: 35, temp: 94, chapita: false }
  ];
  function byId(id) { for (var i = 0; i < COFFEES.length; i++) if (COFFEES[i].id === id) return COFFEES[i]; return null; }
  function time(c) { return c.tmin === c.tmax ? String(c.tmin) : c.tmin + '–' + c.tmax; }

  /* ---------- Steps for one coffee ---------- */
  function stepsFor(c) {
    var s = [];
    s.push({ ico: '🔥', t: 'Heat the water', p: 'Switch the machine on and set the water temperature to ' + c.temp + ' °C. Wait until it is ready.', bigs: [[c.temp, '°C', 'water temperature']] });
    s.push({ ico: '⚙️', t: 'Set the grinder', p: 'Turn the grinder to setting ' + c.grind + '.' + (c.wip ? ' On your board this grind is marked work in progress.' : ''), bigs: [[c.grind, '', 'grind setting']], wip: c.wip });
    s.push({ ico: '⚖️', t: 'Weigh the coffee', p: 'Grind ' + c.dose + ' g of coffee into the portafilter. Check the weight on the scale.', bigs: [[c.dose, 'g', 'ground coffee']] });
    s.push({ ico: '💪', t: 'Level and tamp', p: 'Level the grounds, then tamp them evenly.' });
    if (c.chapita) s.push({ ico: '🪙', t: 'Add the chapita', p: 'Place the chapita, the small disc, on top of the coffee.' });
    s.push({ ico: '🔒', t: 'Lock in and place the cup', p: 'Lock the portafilter into the machine and put your cup underneath.' });
    s.push({ ico: '▶️', t: 'Pull the shot', p: 'Start the shot and watch the time. Stop when the cup holds ' + c.yield + ' ml, around ' + time(c) + ' s.', bigs: [[time(c), 's', 'shot time'], [c.yield, 'ml', 'in the cup']], timer: true });
    s.push({ ico: '☕', t: 'Serve and clean', p: 'Take your cup, knock out the used coffee and rinse the portafilter. Enjoy!' });
    return s;
  }

  /* ---------- State ---------- */
  var state = { screen: 'pick', coffee: null, step: 0 };
  var timer = { running: false, t0: 0, elapsed: 0, id: null };
  function stopTimer() { if (timer.id) clearInterval(timer.id); timer.id = null; timer.running = false; }
  function say(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }

  function chips(c) {
    return '<div class="mine"><span>Your settings:</span>' +
      '<span class="cg-chip"><b>' + c.dose + '</b> g</span>' +
      '<span class="cg-chip">grind <b>' + c.grind + '</b></span>' +
      '<span class="cg-chip"><b>' + c.yield + '</b> ml</span>' +
      '<span class="cg-chip"><b>' + time(c) + '</b> s</span>' +
      '<span class="cg-chip"><b>' + c.temp + '</b> °C</span></div>';
  }
  function settingsTable(c, cls) {
    var wip = c.wip ? '<span class="cg-chip cg-chip--dashed">work in progress</span>' : '';
    return '<div class="cg-table set ' + (cls || '') + '"><table><caption class="cg-sr-only">Settings for ' + c.name + '</caption>' +
      '<thead><tr><th scope="col">Setting</th><th scope="col">Value</th><th scope="col">Unit</th></tr></thead><tbody>' +
      '<tr><td>Dose</td><td>' + c.dose + '</td><td>g, ground coffee</td></tr>' +
      '<tr><td>Grind setting</td><td>' + c.grind + '</td><td>number on the grinder' + wip + '</td></tr>' +
      '<tr><td>Yield</td><td>' + c.yield + '</td><td>ml, coffee in the cup</td></tr>' +
      '<tr><td>Shot time</td><td>' + time(c) + '</td><td>s, from the start of the shot</td></tr>' +
      '<tr><td>Water temperature</td><td>' + c.temp + '</td><td>°C, as set on the machine</td></tr>' +
      '</tbody></table></div>';
  }

  /* ---------- Screen 1: pick a coffee ---------- */
  function renderPick() {
    stopTimer();
    var h = '<section class="screen" aria-labelledby="h-pick"><div class="head"><h2 id="h-pick" tabindex="-1">Which coffee are you brewing?</h2><p>Pick one. Its settings appear below, then press start.</p></div>' +
      '<div class="coffees" role="group" aria-label="Coffee type">';
    COFFEES.forEach(function (c) {
      h += '<button type="button" class="coffee" data-id="' + c.id + '" aria-pressed="' + (state.coffee === c.id) + '">' +
        '<span class="tick">' + icon('check_circle', 20) + 'Selected</span>' +
        '<span class="pic"><img src="' + IMG[c.img] + '" alt=""></span>' +
        '<span class="txt"><b>' + c.name + '</b><span class="cg-chip' + (c.kind === 'Decaf' ? '' : ' cg-chip--solid') + '">' + c.kind + '</span>' +
        '<span class="line">' + c.dose + ' g · grind ' + c.grind + ' · ' + c.yield + ' ml</span></span></button>';
    });
    h += '</div><div class="settings" id="settings"></div>' +
      '<div class="actions"><button type="button" class="cg-btn cg-btn--primary big" id="start">Start brewing ' + icon('arrow_forward') + '</button></div></section>';
    app.innerHTML = h;
    updatePick();
    app.querySelectorAll('.coffee').forEach(function (b) {
      b.addEventListener('click', function () {
        state.coffee = b.getAttribute('data-id');
        app.querySelectorAll('.coffee').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        updatePick();
        say(byId(state.coffee).name + ' selected.');
      });
    });
    document.getElementById('start').addEventListener('click', function () { if (state.coffee) { state.screen = 'steps'; state.step = 0; render(true); } });
  }
  function updatePick() {
    var box = document.getElementById('settings'), btn = document.getElementById('start');
    var c = state.coffee && byId(state.coffee);
    btn.disabled = !c;
    if (!c) { box.innerHTML = '<p class="hint">No coffee picked yet. Choose one above to see its dose, grind, yield, time and temperature.</p>'; return; }
    box.innerHTML = '<h3>' + c.name + ': settings</h3>' + settingsTable(c) + '<p class="src">Source: your whiteboard, entered on 15 November 2026.</p>';
  }

  /* ---------- Screen 2: step by step ---------- */
  /* Numbered stepper: finished steps show a check (and can be reopened), the current step is outlined, later steps are quiet. */
  function stepper(steps, i) {
    var h = '<ol class="stepper" aria-label="Progress, step ' + (i + 1) + ' of ' + steps.length + '">';
    steps.forEach(function (x, k) {
      var cls = k < i ? 'done' : (k === i ? 'now' : 'todo');
      h += '<li class="' + cls + '"' + (k === i ? ' aria-current="step"' : '') + '>';
      if (k < i) h += '<button type="button" class="dot" data-go="' + k + '" aria-label="Go back to step ' + (k + 1) + ': ' + x.t + '">' + icon('check', 20) + '</button>';
      else h += '<span class="dot"><span class="sr">Step </span>' + (k + 1) + '</span>';
      h += '</li>';
    });
    return h + '</ol>';
  }
  function renderSteps(focus) {
    stopTimer(); timer.elapsed = 0;
    var c = byId(state.coffee), steps = stepsFor(c), n = steps.length, i = state.step, s = steps[i];
    var h = '<section class="screen" aria-labelledby="h-step">' +
      '<div class="steps-top"><button type="button" class="cg-btn cg-btn--link" id="change">' + icon('arrow_back', 20) + ' Change coffee</button><span class="who"><img src="' + IMG[c.img] + '" alt=""><span class="cg-chip">' + c.name + '</span></span></div>' +
      '<div class="stat">Step <b>' + (i + 1) + '</b> of <b>' + n + '</b></div>' +
      stepper(steps, i) +
      '<article class="step"><div class="ico" aria-hidden="true">' + s.ico + '</div><div class="body">' +
      '<h2 id="h-step" tabindex="-1">' + s.t + '</h2><p>' + s.p + '</p>';
    if (s.wip) h += '<div><span class="cg-chip cg-chip--dashed">work in progress</span></div>';
    if (s.bigs) {
      h += '<div class="bigs">';
      s.bigs.forEach(function (b) { h += '<div class="bigval"><span class="n">' + b[0] + (b[1] ? '<small>' + b[1] + '</small>' : '') + '</span><span class="l">' + b[2] + '</span></div>'; });
      h += '</div>';
    }
    if (s.timer) {
      var max = c.tmax + 10, left = c.tmin / max * 100, w = Math.max((c.tmax - c.tmin) / max * 100, 1.5);
      h += '<div class="timer"><div class="t-read"><span id="t-val">0.0</span><small>s</small></div>' +
        '<div class="t-bar" aria-hidden="true"><i class="zone" style="left:' + left + '%;width:' + w + '%"></i><i class="mark" id="t-mark" style="left:0%"></i></div>' +
        '<div class="t-scale" aria-hidden="true"><span>0 s</span><span>target ' + time(c) + ' s</span><span>' + max + ' s</span></div>' +
        '<p class="t-status" id="t-status">Optional timer. Press start when the shot starts.</p>' +
        '<div class="t-btns"><button type="button" class="cg-btn cg-btn--secondary sm" id="t-go">' + icon('play_arrow', 20) + ' Start timer</button>' +
        '<button type="button" class="cg-btn cg-btn--link sm" id="t-reset">' + icon('replay', 20) + ' Reset</button></div></div>';
    }
    h += '</div></article>' +
      '<div class="nav">' +
      '<button type="button" class="cg-btn cg-btn--secondary big nav-btn" id="prev"' + (i === 0 ? ' disabled' : '') + '>' + icon('arrow_back') + ' Previous step</button>' +
      '<button type="button" class="cg-btn cg-btn--primary big nav-btn" id="next">' + (i === n - 1 ? 'Finish ' + icon('check_circle') : 'Next step ' + icon('arrow_forward')) + '</button></div>' +
      chips(c) + '</section>';
    app.innerHTML = h;
    document.getElementById('change').addEventListener('click', function () { state.screen = 'pick'; render(true); });
    document.getElementById('next').addEventListener('click', function () {
      if (i === n - 1) { state.screen = 'done'; render(true); } else { state.step = i + 1; render(true); }
    });
    var pv = document.getElementById('prev');
    if (pv) pv.addEventListener('click', function () { if (i > 0) { state.step = i - 1; render(true); } });
    app.querySelectorAll('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () { state.step = parseInt(b.getAttribute('data-go'), 10); render(true); });
    });
    if (s.timer) wireTimer(c);
    if (focus) { var hd = document.getElementById('h-step'); hd.focus({ preventScroll: true }); hd.scrollIntoView({ block: 'nearest' }); say('Step ' + (i + 1) + ' of ' + n + ': ' + s.t); }
  }
  function wireTimer(c) {
    var max = c.tmax + 10, val = document.getElementById('t-val'), mark = document.getElementById('t-mark'),
        status = document.getElementById('t-status'), go = document.getElementById('t-go');
    function paint() {
      var t = timer.elapsed, f = Math.floor(t);
      val.textContent = t.toFixed(1);
      mark.style.left = Math.min(t / max * 100, 100) + '%';
      if (f < c.tmin) status.innerHTML = icon('info', 20) + 'Keep going. Target starts at ' + c.tmin + ' s.';
      else if (f <= c.tmax) status.innerHTML = icon('check_circle', 20) + 'In the target time (' + time(c) + ' s). Stop at ' + c.yield + ' ml.';
      else status.innerHTML = icon('info', 20) + 'Past the target time of ' + time(c) + ' s.';
    }
    function setBtn() { go.innerHTML = timer.running ? icon('stop', 20) + ' Stop timer' : icon('play_arrow', 20) + ' Start timer'; }
    go.addEventListener('click', function () {
      if (timer.running) { stopTimer(); setBtn(); return; }
      timer.running = true; timer.t0 = Date.now() - timer.elapsed * 1000; setBtn();
      timer.id = setInterval(function () { timer.elapsed = (Date.now() - timer.t0) / 1000; paint(); }, 100);
    });
    document.getElementById('t-reset').addEventListener('click', function () { stopTimer(); timer.elapsed = 0; val.textContent = '0.0'; mark.style.left = '0%'; status.textContent = 'Optional timer. Press start when the shot starts.'; setBtn(); });
  }

  /* ---------- Screen 3: celebration ---------- */
  function rain() {
    var h = '<div class="rain" aria-hidden="true">';
    for (var k = 0; k < 26; k++) {
      var x = Math.round(Math.random() * 94), s = 22 + Math.round(Math.random() * 26), d = (Math.random() * 1.6).toFixed(2), dur = (2.4 + Math.random() * 1.6).toFixed(2);
      var r = Math.round(Math.random() * 360), y = Math.round(Math.random() * 70);
      h += '<img src="' + IMG.bean + '" alt="" style="--x:' + x + '%;--y:' + y + '%;--s:' + s + 'px;--r:' + r + 'deg;--d:' + d + 's;--dur:' + dur + 's;--fall:460px;--spin:' + (r + 240) + 'deg">';
    }
    return h + '</div>';
  }
  function renderDone() {
    stopTimer();
    var c = byId(state.coffee), n = stepsFor(c).length;
    var h = '<section class="screen" aria-labelledby="h-done"><div class="celebrate" id="party">' + rain() +
      '<div class="hero-cup"><img src="' + IMG[c.img] + '" alt="' + c.alt + '"></div>' +
      '<h2 id="h-done" tabindex="-1">Your coffee is ready! 🎉</h2>' +
      '<p>You brewed a ' + c.name + '. Enjoy it while it is hot ☕</p>' +
      '<div class="cg-banner cg-banner--success done-banner" role="status"><span class="cg-banner__icon">' + icon('check_circle') + '</span><div class="cg-banner__body"><span class="cg-banner__title">Brew complete</span><span>All ' + n + ' steps done: ' + c.dose + ' g in, ' + c.yield + ' ml in the cup.</span></div></div>' +
      '<div class="done-table">' + settingsTable(c) + '</div>' +
      '<div class="actions"><button type="button" class="cg-btn cg-btn--primary big" id="again">' + icon('replay') + ' Brew another coffee</button>' +
      '<button type="button" class="cg-btn cg-btn--secondary big" id="redo">Brew this again</button>' +
      '<button type="button" class="cg-btn cg-btn--link" id="cheer">Celebrate again 🎊</button></div></div></section>';
    app.innerHTML = h;
    document.getElementById('again').addEventListener('click', function () { state = { screen: 'pick', coffee: null, step: 0 }; render(true); });
    document.getElementById('redo').addEventListener('click', function () { state.screen = 'steps'; state.step = 0; render(true); });
    document.getElementById('cheer').addEventListener('click', function () {
      var old = document.querySelector('#party .rain'), tmp = document.createElement('div');
      tmp.innerHTML = rain(); old.parentNode.replaceChild(tmp.firstChild, old);
    });
    var hd = document.getElementById('h-done'); hd.focus({ preventScroll: true });
    say('Your coffee is ready. Brew complete.');
  }

  function render(focus) {
    if (state.screen === 'pick') { renderPick(); if (focus) { document.getElementById('h-pick').focus({ preventScroll: true }); } }
    else if (state.screen === 'steps') renderSteps(focus);
    else renderDone();
    if (focus) window.scrollTo({ top: 0 });
  }
  render(false);
})();
