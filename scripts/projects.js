/* ================================================================
   PROJECTS.JS — Filter + orb parallax + skill tabs
================================================================ */

/* ---- Project filters ---- */
(function () {
  const btns  = document.querySelectorAll('.pf');
  const cards = document.querySelectorAll('.proj-card');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      btns.forEach(b => b.classList.toggle('active', b===btn));
      cards.forEach(c => { c.dataset.hidden = (f==='all'||c.dataset.cat===f)?'false':'true'; });
    });
  });
})();

/* ---- Skills category tabs ---- */
(function () {
  const btns   = document.querySelectorAll('.sk-cat');
  const panels = document.querySelectorAll('.skill-panels > div');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b=>b.classList.toggle('active',b===btn));
      panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.cat));
    });
    btn.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); btn.click(); } });
  });
})();

/* ---- Orb mouse parallax (home page) ---- */
(function () {
  const scene = document.querySelector('.orb-scene');
  if (!scene) return;
  if (window.matchMedia('(hover:none)').matches) return;
  let mx=0, my=0, tx=0, ty=0;
  window.addEventListener('mousemove', e => { mx=(e.clientX/window.innerWidth-0.5)*14; my=(e.clientY/window.innerHeight-0.5)*14; }, {passive:true});
  (function animate() {
    requestAnimationFrame(animate);
    tx += (mx-tx)*0.08; ty += (my-ty)*0.08;
    scene.style.transform = `translate(${tx}px,${ty}px)`;
  })();
})();

/* ---- System map (skills page) ---- */
(function () {
  const nodes = document.querySelectorAll('.sysmap-node');
  const desc  = document.getElementById('sysmapDesc');
  if (!nodes.length || !desc) return;

  const INFO = {
    'Software Dev': 'Writing and designing software using Java, Python, HTML/CSS/JavaScript — my primary interest and career direction.',
    'Databases':    'Designing relational schemas, writing SQL queries, and understanding how data is stored and retrieved efficiently.',
    'Networking':   'Understanding protocols, topologies, and how systems communicate across networks — studied in Year 3.',
    'Systems':      'Computer architecture, Linux, and how hardware and software interact at a low level.',
    'Problem Solving': 'At the core of every discipline: decomposing problems, writing algorithms, and applying logic to find solutions.',
    'Java':         'Used in OOP coursework, console applications, and desktop projects. My primary programming language.',
    'Python':       'Used for scripting and general programming exercises.',
    'C/C++':        'Studied for systems programming and computer architecture.',
    'HTML/CSS/JS':  'Frontend web development — used to build this portfolio and web projects.',
    'SQL':          'Relational database queries: SELECT, JOIN, WHERE, aggregate functions.',
    'Linux':        'Operating system coursework and practical CLI usage.',
    'Git':          'Version control and collaboration via GitHub.',
  };

  nodes.forEach(n => {
    n.addEventListener('click', () => {
      const key = n.textContent.trim();
      desc.textContent = INFO[key] || 'No additional information available for this node.';
      nodes.forEach(x=>x.style.borderColor=''); n.style.borderColor='var(--c-blue)';
    });
  });
})();
