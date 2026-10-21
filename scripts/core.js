/* ================================================================
   CORE.JS — Shared logic for every page
   Particle canvas · Custom cursor · Nav · Command palette ·
   Theme · Recruiter mode · Easter egg · Scroll reveals
================================================================ */

/* ---- Particles ---- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLORS = [
    {r:52,g:120,b:246},{r:136,g:87,b:255},{r:49,g:213,b:255},{r:102,g:242,b:194}
  ];
  const COUNT = 48, DIST = 120;
  let particles = [], af;

  function Particle() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.32;
    this.vy = (Math.random() - 0.5) * 0.32;
    this.r  = Math.random() * 1.3 + 0.4;
    this.a  = Math.random() * 0.28 + 0.05;
    this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -5 || this.x > canvas.width  + 5) this.vx *= -1;
    if (this.y < -5 || this.y > canvas.height + 5) this.vy *= -1;
  };
  Particle.prototype.draw = function () {
    const {r,g,b} = this.c;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.a})`; ctx.fill();
  };

  function connect() {
    for (let i = 0; i < particles.length; i++)
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < DIST) {
          const {r,g,b} = particles[i].c;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1-d/DIST)*0.07})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
  }

  function frame() { af = requestAnimationFrame(frame); ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); connect(); }

  function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    particles = Array.from({length:COUNT}, () => new Particle());
    cancelAnimationFrame(af); frame();
  }

  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(init, 200); }, {passive:true});
  init();
})();

/* ---- Custom Cursor ---- */
(function () {
  const isTouch = window.matchMedia('(hover: none)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || reducedMotion) return;

  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  const lbl  = document.createElement('div'); lbl.className  = 'cursor-label';
  document.body.append(dot, ring, lbl);

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive:true});

  function lerp(a, b, n) { return a + (b - a) * n; }

  (function loop() {
    requestAnimationFrame(loop);
    rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    lbl.style.left  = mx + 'px'; lbl.style.top  = my + 'px';
  })();

  // Hover detection
  function onEnter(e) {
    const el = e.currentTarget;
    ring.classList.add('expanded');
    if (el.dataset.cursor) {
      lbl.textContent = el.dataset.cursor;
      lbl.classList.add('visible');
    }
    if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button')) {
      ring.classList.add('link');
    }
  }
  function onLeave() {
    ring.classList.remove('expanded', 'link');
    lbl.classList.remove('visible');
  }

  function attach() {
    document.querySelectorAll('a, button, [data-cursor], .card, .proj-card, .preview-card, .sk-card').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
  }
  attach();
  // Re-attach on dynamic content
  const obs = new MutationObserver(attach);
  obs.observe(document.body, { childList: true, subtree: true });
})();

/* ---- Nav scroll ---- */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const fn = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', fn, {passive:true}); fn();
})();

/* ---- Nav active page ---- */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === path || (path === '' && l.getAttribute('href') === 'index.html'));
  });
  document.querySelectorAll('.mobile-menu a').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === path || (path === '' && l.getAttribute('href') === 'index.html'));
  });
})();

/* ---- Mobile nav toggle ---- */
(function () {
  const btn  = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  function setOpen(o) {
    menu.classList.toggle('open', o);
    btn.setAttribute('aria-expanded', String(o));
    const sp = btn.querySelectorAll('span');
    if (o) { sp[0].style.transform='rotate(45deg) translate(5px,5px)'; sp[1].style.opacity='0'; sp[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
    else { sp.forEach(s => { s.style.transform=''; s.style.opacity=''; }); }
  }
  btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();

/* ---- Theme toggle ---- */
(function () {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const stored = localStorage.getItem('rbtw-theme') || 'night';
  document.documentElement.setAttribute('data-theme', stored === 'day' ? 'day' : '');

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'day' ? '' : 'day';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rbtw-theme', next === 'day' ? 'day' : 'night');
  });
})();

/* ---- Command palette ---- */
(function () {
  const overlay = document.getElementById('cmdOverlay');
  const input   = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResults');
  if (!overlay || !input) return;

  const PAGES = [
    {icon:'⌂', label:'Home',          href:'index.html',      desc:'home'},
    {icon:'◈', label:'About Me',       href:'pages/about.html',desc:'about'},
    {icon:'⚡', label:'Skills',         href:'pages/skills.html',desc:'skills'},
    {icon:'⊞', label:'Projects',       href:'pages/projects.html',desc:'projects'},
    {icon:'⌘', label:'Code Lab',       href:'pages/lab.html',  desc:'lab'},
    {icon:'◷', label:'Journey',        href:'pages/experience.html',desc:'experience'},
    {icon:'✉', label:'Contact',        href:'pages/contact.html',desc:'contact'},
    {icon:'↑', label:'Back to top',    href:'#',               desc:'',action:()=>window.scrollTo({top:0,behavior:'smooth'})},
  ];

  let sel = 0, filtered = [...PAGES];

  function open() {
    overlay.classList.add('open'); input.value = ''; render(PAGES);
    setTimeout(() => input.focus(), 30);
    document.body.style.overflow = 'hidden';
  }
  function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

  function render(items) {
    filtered = items; sel = 0; results.innerHTML = '';
    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'cmd-result' + (i === 0 ? ' sel' : '');
      el.setAttribute('role', 'option');
      el.innerHTML = `<span class="cmd-result-icon">${item.icon}</span><span class="cmd-result-label">${item.label}</span><span class="cmd-result-desc">${item.desc}</span>`;
      el.addEventListener('click', () => { if (item.action) { item.action(); close(); } else window.location.href = item.href; close(); });
      results.appendChild(el);
    });
  }

  function updateSel(idx) {
    const els = results.querySelectorAll('.cmd-result');
    els.forEach((el, i) => { el.classList.toggle('sel', i === idx); el.setAttribute('aria-selected', String(i === idx)); });
    sel = idx; els[idx]?.scrollIntoView({block:'nearest'});
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    render(q ? PAGES.filter(x => x.label.toLowerCase().includes(q)) : PAGES);
  });
  input.addEventListener('keydown', e => {
    const n = filtered.length; if (!n) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); updateSel((sel+1)%n); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); updateSel((sel-1+n)%n); }
    if (e.key === 'Enter') { const it = filtered[sel]; if (it) { if (it.action) {it.action();} else window.location.href=it.href; } close(); }
    if (e.key === 'Escape') close();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.querySelectorAll('[data-cmd]').forEach(el => el.addEventListener('click', open));
  document.addEventListener('keydown', e => { if ((e.ctrlKey||e.metaKey) && e.key === 'k') { e.preventDefault(); open(); } });
})();

/* ---- Recruiter mode ---- */
(function () {
  const btn     = document.getElementById('recruiterBtn');
  const overlay = document.getElementById('recruiterOverlay');
  const closeBtn= document.getElementById('recruiterClose');
  if (!btn || !overlay) return;
  btn.addEventListener('click', () => { overlay.classList.add('open'); document.body.style.overflow='hidden'; });
  closeBtn?.addEventListener('click', () => { overlay.classList.remove('open'); document.body.style.overflow=''; });
  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow=''; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { overlay.classList.remove('open'); document.body.style.overflow=''; } });
})();

/* ---- Easter egg (Konami code) ---- */
(function () {
  const overlay = document.getElementById('easterEgg');
  const closeBtn= document.getElementById('eeClose');
  if (!overlay) return;
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[idx]) { idx++; if (idx === KONAMI.length) { overlay.classList.add('active'); idx = 0; document.body.style.overflow='hidden'; } }
    else idx = 0;
  });
  closeBtn?.addEventListener('click', () => { overlay.classList.remove('active'); document.body.style.overflow=''; });
  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.classList.remove('active'); document.body.style.overflow=''; } });
})();

/* ---- Scroll reveals ---- */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.transitionDelay = (en.target.dataset.delay || 0) + 'ms';
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, {threshold:0.07});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ---- Smooth anchor scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); const off = (document.getElementById('nav')?.offsetHeight||68)+12; window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-off,behavior:'smooth'}); }
  });
});

/* ---- Back to top ---- */
document.querySelectorAll('.back-top').forEach(b => b.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'})));
