/* ================================================
   HOME.JS — index.html: terminal, projects,
   skills tabs, codelab
   ================================================ */

/* ===================== SKILLS CATEGORY TABS ===================== */
(function () {
  const btns   = document.querySelectorAll('.skill-cat-btn');
  const panels = document.querySelectorAll('.skills-panel');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      btns.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === cat));
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
})();

/* ===================== PROJECT FILTERS ===================== */
(function () {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.proj-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => b.classList.toggle('active', b === btn));
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.dataset.hidden = match ? 'false' : 'true';
      });
    });
  });
})();

/* ===================== PROJECT MODAL ===================== */
(function () {
  const overlay = document.getElementById('projModal');
  if (!overlay) return;
  const modal = overlay.querySelector('.proj-modal');

  window.openProjectModal = function (data) {
    document.getElementById('pmId').textContent    = data.id    || '';
    document.getElementById('pmTitle').textContent = data.title || '';
    document.getElementById('pmDesc').textContent  = data.desc  || '';
    document.getElementById('pmProblem').textContent = data.problem || '—';
    document.getElementById('pmFeatures').innerHTML = (data.features || []).map(f => `<li>${f}</li>`).join('') || '—';
    const tags = document.getElementById('pmTags');
    tags.innerHTML = (data.tags || []).map(t => `<span class="skill-chip">${t}</span>`).join('');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.pm-close').focus();
  };

  window.closeProjectModal = function () {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) window.closeProjectModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeProjectModal(); });
})();

/* ===================== CODE LAB TABS ===================== */
(function () {
  const tabs   = document.querySelectorAll('.cl-tab');
  const panels = document.querySelectorAll('.cl-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === tab.dataset.panel));
    });
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); }
    });
  });
})();

/* ===================== CODE LAB: DEMO 1 — Binary Converter ===================== */
(function () {
  const input  = document.getElementById('clBinInput');
  const selDir = document.getElementById('clBinDir');
  const run    = document.getElementById('clBinRun');
  const reset  = document.getElementById('clBinReset');
  const output = document.getElementById('clBinOutput');
  if (!input || !run) return;

  function runDemo() {
    const val = input.value.trim();
    const dir = selDir.value;
    if (!val) { setOut('// Enter a value above, then click RUN.', true); return; }

    if (dir === 'dec-bin') {
      const n = parseInt(val, 10);
      if (isNaN(n) || n < 0) { setOut('// Error: enter a non-negative integer.', true); return; }
      setOut(`Decimal  : ${n}\nBinary   : ${n.toString(2)}\nHex      : 0x${n.toString(16).toUpperCase()}\nOctal    : 0o${n.toString(8)}`);
    } else if (dir === 'bin-dec') {
      if (!/^[01]+$/.test(val)) { setOut('// Error: binary must contain only 0 and 1.', true); return; }
      const n = parseInt(val, 2);
      setOut(`Binary   : ${val}\nDecimal  : ${n}\nHex      : 0x${n.toString(16).toUpperCase()}`);
    } else if (dir === 'dec-hex') {
      const n = parseInt(val, 10);
      if (isNaN(n) || n < 0) { setOut('// Error: enter a non-negative integer.', true); return; }
      setOut(`Decimal  : ${n}\nHex      : 0x${n.toString(16).toUpperCase()}\nBinary   : ${n.toString(2)}`);
    }
  }

  function setOut(text, empty = false) {
    output.textContent  = text;
    output.className    = 'cl-output' + (empty ? ' empty' : '');
  }

  run.addEventListener('click', runDemo);
  reset.addEventListener('click', () => { input.value = ''; setOut('// Output will appear here...', true); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') runDemo(); });
})();

/* ===================== CODE LAB: DEMO 2 — SQL Query Simulator ===================== */
(function () {
  const run    = document.getElementById('clSqlRun');
  const reset  = document.getElementById('clSqlReset');
  const input  = document.getElementById('clSqlInput');
  const output = document.getElementById('clSqlOutput');
  if (!run || !input) return;

  // Mock dataset
  const DB = {
    students: [
      { id: 1, name: 'Alice',    year: 3, major: 'Computer Science', gpa: 3.8 },
      { id: 2, name: 'Bob',      year: 1, major: 'Information Systems', gpa: 3.2 },
      { id: 3, name: 'Reabetswe',year: 3, major: 'Computer Science', gpa: 3.9 },
      { id: 4, name: 'Carol',    year: 2, major: 'Computer Science', gpa: 3.5 },
      { id: 5, name: 'David',    year: 3, major: 'Networking',        gpa: 3.1 },
    ],
    courses: [
      { id: 101, name: 'Algorithms',        credits: 4, instructor: 'Dr. Smith'  },
      { id: 102, name: 'Database Systems',  credits: 3, instructor: 'Dr. Jones'  },
      { id: 103, name: 'Networking',        credits: 3, instructor: 'Dr. Patel'  },
      { id: 104, name: 'Web Development',   credits: 3, instructor: 'Dr. Nkosi'  },
      { id: 105, name: 'Operating Systems', credits: 4, instructor: 'Dr. Adams'  },
    ]
  };

  function runQuery() {
    const q = input.value.trim().toLowerCase();
    if (!q) { setOut('// Enter a SQL query above.', true); return; }

    try {
      // SELECT * FROM table
      let m = q.match(/^select \* from (\w+)$/);
      if (m) { const rows = DB[m[1]]; if (!rows) throw `Table "${m[1]}" not found.`; return setOut(formatTable(rows)); }

      // SELECT * FROM table WHERE col = val
      m = q.match(/^select \* from (\w+) where (\w+)\s*=\s*['"]?([^'"]+)['"]?$/);
      if (m) {
        const rows = DB[m[1]]; if (!rows) throw `Table "${m[1]}" not found.`;
        const col = m[2], val = m[3].trim();
        const res = rows.filter(r => String(r[col]).toLowerCase() === val.toLowerCase());
        return setOut(res.length ? formatTable(res) : '// 0 rows returned.');
      }

      // SELECT * FROM table WHERE col > val
      m = q.match(/^select \* from (\w+) where (\w+)\s*([><=!]+)\s*(['"]?)([^'"]+)\4$/);
      if (m) {
        const rows = DB[m[1]]; if (!rows) throw `Table "${m[1]}" not found.`;
        const col = m[2], op = m[3], val = isNaN(m[5]) ? m[5].trim() : parseFloat(m[5]);
        const res = rows.filter(r => {
          const rv = isNaN(r[col]) ? r[col] : parseFloat(r[col]);
          if (op === '>') return rv > val;
          if (op === '<') return rv < val;
          if (op === '>=') return rv >= val;
          if (op === '<=') return rv <= val;
          if (op === '=' || op === '==') return String(rv).toLowerCase() === String(val).toLowerCase();
          if (op === '!=' || op === '<>') return rv !== val;
          return false;
        });
        return setOut(res.length ? formatTable(res) : '// 0 rows returned.');
      }

      // SHOW TABLES
      if (q === 'show tables' || q === 'show tables;') {
        return setOut('Tables:\n  · students\n  · courses\n\nTry: SELECT * FROM students');
      }

      // COUNT
      m = q.match(/^select count\(\*\) from (\w+)$/);
      if (m) {
        const rows = DB[m[1]]; if (!rows) throw `Table "${m[1]}" not found.`;
        return setOut(`COUNT(*)\n--------\n${rows.length}`);
      }

      throw 'Query not recognised. Try:\n  SELECT * FROM students\n  SELECT * FROM courses\n  SELECT * FROM students WHERE year = 3\n  SELECT * FROM students WHERE gpa > 3.5\n  SHOW TABLES';
    } catch (err) {
      setOut('// Error: ' + err, true);
    }
  }

  function formatTable(rows) {
    if (!rows.length) return '// 0 rows returned.';
    const keys = Object.keys(rows[0]);
    const widths = keys.map(k => Math.max(k.length, ...rows.map(r => String(r[k]).length)));
    const sep  = '+-' + widths.map(w => '-'.repeat(w)).join('-+-') + '-+';
    const head = '| ' + keys.map((k, i) => k.padEnd(widths[i])).join(' | ') + ' |';
    const body = rows.map(r => '| ' + keys.map((k, i) => String(r[k]).padEnd(widths[i])).join(' | ') + ' |');
    return [sep, head, sep, ...body, sep, `\n${rows.length} row(s) returned.`].join('\n');
  }

  function setOut(text, empty = false) {
    output.textContent = text;
    output.className   = 'cl-output' + (empty ? ' empty' : '');
  }

  run.addEventListener('click', runQuery);
  reset.addEventListener('click', () => { input.value = 'SELECT * FROM students'; setOut('// Output will appear here...', true); });
  input?.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runQuery(); });
})();

/* ===================== CODE LAB: DEMO 3 — Sort Visualizer ===================== */
(function () {
  const run    = document.getElementById('clSortRun');
  const reset  = document.getElementById('clSortReset');
  const algoSel= document.getElementById('clSortAlgo');
  const bars   = document.querySelectorAll('.viz-bar');
  const output = document.getElementById('clSortOutput');
  if (!run || !bars.length) return;

  let arr = [38, 62, 22, 85, 47, 11, 73, 56, 29, 91];

  function renderBars(a, comparing = [], sorted = []) {
    const max = Math.max(...a);
    bars.forEach((b, i) => {
      b.style.height = (a[i] / max * 90) + 'px';
      b.className    = 'viz-bar' +
        (comparing.includes(i) ? ' comparing' : '') +
        (sorted.includes(i) ? ' sorted' : '');
      b.setAttribute('title', a[i]);
    });
  }

  async function bubbleSort(a) {
    const n = a.length;
    const sorted = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        renderBars(a, [j, j + 1], sorted);
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
        await sleep(60);
      }
      sorted.push(n - 1 - i);
    }
    return a;
  }

  async function selectionSort(a) {
    const n = a.length;
    const sorted = [];
    for (let i = 0; i < n; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        renderBars(a, [j, min], sorted);
        if (a[j] < a[min]) min = j;
        await sleep(60);
      }
      [a[i], a[min]] = [a[min], a[i]];
      sorted.push(i);
    }
    return a;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  run.addEventListener('click', async () => {
    run.disabled = true;
    const a = [...arr];
    const algo = algoSel.value;

    if (algo === 'bubble') {
      output.textContent = 'Running Bubble Sort...\nComparing adjacent pairs, swapping if needed.';
      await bubbleSort(a);
    } else {
      output.textContent = 'Running Selection Sort...\nFinding the minimum and placing it in position.';
      await selectionSort(a);
    }

    renderBars(a, [], a.map((_, i) => i));
    output.textContent += `\n\nSorted: [${a.join(', ')}]\nDone.`;
    run.disabled = false;
  });

  reset.addEventListener('click', () => {
    arr = arr.map(() => Math.floor(Math.random() * 85) + 10);
    renderBars(arr);
    output.textContent = '// Press RUN to start the sort visualizer.';
    output.className   = 'cl-output empty';
  });

  // Initial render
  renderBars(arr);
})();

/* ===================== INTERACTIVE TERMINAL ===================== */
(function () {
  const body  = document.getElementById('terminalBody');
  const input = document.getElementById('terminalInput');
  if (!body || !input) return;

  const SKILLS_TABLE = `
  PROGRAMMING    Java · Python · C/C++
  WEB            HTML5 · CSS3 · JavaScript
  DATABASES      SQL · Database Design
  SYSTEMS        Linux · Networking · Computer Architecture
  TOOLS          Git · GitHub · VS Code · NetBeans`;

  const COMMANDS = {
    help() {
      return [
        { t: 'out', text: '  Available commands:' },
        { t: 'out', text: '  help        — show this list' },
        { t: 'out', text: '  whoami      — identity' },
        { t: 'out', text: '  about       — introduction' },
        { t: 'out', text: '  skills      — technical capabilities' },
        { t: 'out', text: '  projects    — project database' },
        { t: 'out', text: '  education   — learning path' },
        { t: 'out', text: '  contact     — get in touch' },
        { t: 'out', text: '  github      — open GitHub profile' },
        { t: 'out', text: '  clear       — clear terminal' },
      ];
    },
    whoami() {
      return [
        { t: 'out', text: '  Reabetswe' },
        { t: 'out', text: '  Third-year Computer Science student' },
        { t: 'out', text: '  Aspiring software developer' },
        { t: 'out', text: '  Location: South Africa (SAST / UTC+2)' },
        { t: 'out', text: '  Status  : ● Available for opportunities' },
      ];
    },
    about() {
      return [
        { t: 'out', text: '  I\'m Reabetswe, a third-year CS student passionate about' },
        { t: 'out', text: '  software development, databases, networking, and systems.' },
        { t: 'out', text: '' },
        { t: 'out', text: '  I enjoy turning complex problems into practical solutions' },
        { t: 'out', text: '  and continuously learning through hands-on projects.' },
        { t: 'out', text: '' },
        { t: 'out', text: '  → type "skills" or "projects" to explore further.' },
      ];
    },
    skills() {
      return SKILLS_TABLE.split('\n').map(l => ({ t: 'out', text: l }));
    },
    projects() {
      return [
        { t: 'out', text: '  Querying project database...' },
        { t: 'out', text: '' },
        { t: 'out', text: '  [PRJ-001]  Java Application        → Java · OOP · NetBeans' },
        { t: 'out', text: '  [PRJ-002]  Database System         → SQL · DB Design · ERD' },
        { t: 'out', text: '  [PRJ-003]  Web Dev Project         → HTML · CSS · JavaScript' },
        { t: 'out', text: '  [PRJ-004]  Networking / Systems    → Linux · Networking · C' },
        { t: 'out', text: '' },
        { t: 'out', text: '  * Placeholders — replace with your actual projects.' },
      ];
    },
    education() {
      return [
        { t: 'out', text: '  Year 1  — CS Foundations: programming, maths, logic' },
        { t: 'out', text: '  Year 2  — Data structures, algorithms, databases, web' },
        { t: 'out', text: '  Year 3  — Advanced systems, networking, software engineering [NOW]' },
        { t: 'out', text: '' },
        { t: 'out', text: '  Institution : [ Add your institution name ]' },
        { t: 'out', text: '  Qualification: [ Add your degree/programme name ]' },
      ];
    },
    contact() {
      return [
        { t: 'out', text: '  Email    : your.email@example.com' },
        { t: 'out', text: '  GitHub   : github.com/yourusername' },
        { t: 'out', text: '  LinkedIn : linkedin.com/in/yourprofile' },
        { t: 'out', text: '  Response : < 24 hours' },
      ];
    },
    github() {
      window.open('https://github.com/yourusername', '_blank', 'noopener,noreferrer');
      return [{ t: 'out', text: '  Opening GitHub profile...' }];
    },
  };

  let history = [], histIdx = -1;

  function appendLines(lines) {
    lines.forEach(l => {
      const el = document.createElement('div');
      el.className = 'it-line' + (l.t === 'out' ? ' it-out-line' : l.t === 'err' ? ' it-err-line' : ' it-user-line');
      el.innerHTML = `<span class="it-text">${l.text}</span>`;
      body.appendChild(el);
    });
    body.scrollTop = body.scrollHeight;
  }

  function appendCmd(cmd) {
    const el = document.createElement('div');
    el.className = 'it-line it-user-line';
    el.innerHTML = `<span class="t-prompt">root@reabetswe:~$</span><span class="it-cmd-echo"> ${escHtml(cmd)}</span>`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    history.unshift(cmd);
    histIdx = -1;
    appendCmd(raw.trim());

    if (cmd === 'clear') { body.innerHTML = ''; return; }

    const fn = COMMANDS[cmd];
    if (fn) {
      appendLines(fn());
    } else {
      appendLines([{ t: 'err', text: `  Command not found: "${escHtml(cmd)}". Type help for available commands.` }]);
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx < history.length - 1) input.value = history[++histIdx]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); histIdx > 0 ? input.value = history[--histIdx] : (histIdx = -1, input.value = ''); }
    // Basic tab completion
    else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const match   = Object.keys(COMMANDS).concat(['clear']).find(c => c.startsWith(partial) && c !== partial);
      if (match) input.value = match;
    }
  });

  // Hint buttons
  document.querySelectorAll('.t-hint').forEach(btn => {
    btn.addEventListener('click', () => { input.value = btn.dataset.cmd; input.focus(); });
  });

  // Click terminal to focus
  document.querySelector('.terminal-wrap')?.addEventListener('click', () => input.focus());
})();
