/* ================================================
   MAIN.JS — Shared logic: nav, mobile menu,
   command palette, scroll reveals, smooth scroll
   ================================================ */

/* ---- Nav scroll effect ---- */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Mobile nav toggle ---- */
(function () {
  const btn  = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();

/* ---- Command Palette ---- */
(function () {
  const overlay = document.getElementById('cmdPalette');
  const input   = document.getElementById('cpInput');
  const results = document.getElementById('cpResults');
  if (!overlay || !input) return;

  const ITEMS = [
    { icon: '⌂', label: 'Home',       desc: 'page',    action: () => { window.location.href = 'index.html'; } },
    { icon: '◈', label: 'About',      desc: 'page',    action: () => { window.location.href = 'about.html'; } },
    { icon: '◉', label: 'Contact',    desc: 'page',    action: () => { window.location.href = 'contact.html'; } },
    { icon: '/', label: 'Skills',     desc: 'section', action: () => scrollTo('skills') },
    { icon: '⊞', label: 'Projects',   desc: 'section', action: () => scrollTo('projects') },
    { icon: '⌘', label: 'Code Lab',   desc: 'section', action: () => scrollTo('codelab') },
    { icon: '◷', label: 'Education',  desc: 'section', action: () => scrollTo('education') },
    { icon: '✉', label: 'Terminal',   desc: 'section', action: () => scrollTo('terminal') },
    { icon: '↑', label: 'Back to top',desc: '',        action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  ];

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const off = (document.getElementById('nav')?.offsetHeight || 64) + 12;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
  }

  let selected = 0;
  let filtered = [...ITEMS];

  function open() {
    overlay.classList.add('open');
    input.value = '';
    render(ITEMS);
    setTimeout(() => input.focus(), 40);
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function render(items) {
    filtered  = items;
    selected  = 0;
    results.innerHTML = '';
    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'cp-result' + (i === 0 ? ' selected' : '');
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      el.innerHTML = `
        <span class="cp-result-icon">${item.icon}</span>
        <span class="cp-result-label">${item.label}</span>
        <span class="cp-result-desc">${item.desc}</span>`;
      el.addEventListener('click', () => { item.action(); close(); });
      results.appendChild(el);
    });
  }

  function updateSelected(idx) {
    const els = results.querySelectorAll('.cp-result');
    els.forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
      el.setAttribute('aria-selected', String(i === idx));
    });
    selected = idx;
    els[idx]?.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    render(q ? ITEMS.filter(x => x.label.toLowerCase().includes(q) || x.desc.toLowerCase().includes(q)) : ITEMS);
  });

  input.addEventListener('keydown', e => {
    const len = filtered.length;
    if (!len) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); updateSelected((selected + 1) % len); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); updateSelected((selected - 1 + len) % len); }
    if (e.key === 'Enter') { filtered[selected]?.action(); close(); }
    if (e.key === 'Escape') close();
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  // Open triggers
  document.querySelectorAll('[data-cmd-palette]').forEach(el => {
    el.addEventListener('click', open);
  });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
  });
})();

/* ---- Smooth scroll anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const off = (document.getElementById('nav')?.offsetHeight || 64) + 12;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
    }
  });
});

/* ---- Active nav link (single-page) ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !links.length) return;

  const nav = document.getElementById('nav');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id));
      }
    });
  }, { rootMargin: `-${(nav?.offsetHeight || 64) + 10}px 0px -60% 0px` });

  sections.forEach(s => observer.observe(s));
})();

/* ---- Scroll reveal ---- */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
