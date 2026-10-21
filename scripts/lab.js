/* ================================================================
   LAB.JS — Interactive Code Lab demos
================================================================ */

/* ---- Sort Visualizer ---- */
(function () {
  const run   = document.getElementById('sortRun');
  const reset = document.getElementById('sortReset');
  const sel   = document.getElementById('sortAlgo');
  const out   = document.getElementById('sortOut');
  if (!run) return;

  let arr = [38,62,22,85,47,11,73,56,29,91,44,67];
  const bars = document.querySelectorAll('.viz-bar');

  function renderBars(a, comparing=[], sorted=[]) {
    const max = Math.max(...a);
    bars.forEach((b,i) => {
      b.style.height = (a[i]/max*90)+'px';
      b.className = 'viz-bar' + (comparing.includes(i)?' comparing':'') + (sorted.includes(i)?' sorted':'');
      b.setAttribute('title', a[i]);
    });
  }
  function sleep(ms) { return new Promise(r => setTimeout(r,ms)); }

  async function bubble(a) {
    const n=a.length, done=[];
    for(let i=0;i<n;i++){for(let j=0;j<n-i-1;j++){renderBars(a,[j,j+1],done);if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];await sleep(55);}done.push(n-1-i);}
    return a;
  }
  async function selection(a) {
    const n=a.length, done=[];
    for(let i=0;i<n;i++){let m=i;for(let j=i+1;j<n;j++){renderBars(a,[j,m],done);if(a[j]<a[m])m=j;await sleep(55);}[a[i],a[m]]=[a[m],a[i]];done.push(i);}
    return a;
  }
  async function insertion(a) {
    const n=a.length, done=[];
    for(let i=1;i<n;i++){let k=i;while(k>0&&a[k]<a[k-1]){renderBars(a,[k,k-1],done);[a[k],a[k-1]]=[a[k-1],a[k]];k--;await sleep(55);}done.push(k);}
    return a;
  }

  run.addEventListener('click', async () => {
    run.disabled=true;
    const a=[...arr];
    const algo = sel.value;
    const names={bubble:'Bubble Sort',selection:'Selection Sort',insertion:'Insertion Sort'};
    out.textContent=`Running ${names[algo]}...`;
    out.className='lab-out';
    if(algo==='bubble') await bubble(a);
    else if(algo==='selection') await selection(a);
    else await insertion(a);
    renderBars(a,[],a.map((_,i)=>i));
    out.textContent=`${names[algo]} complete.\nSorted: [${a.join(', ')}]`;
    run.disabled=false;
  });

  reset.addEventListener('click', () => {
    arr=Array.from({length:12},()=>Math.floor(Math.random()*85)+10);
    renderBars(arr);
    out.textContent='// Press RUN to start.'; out.className='lab-out empty';
    run.disabled=false;
  });

  renderBars(arr);
  out.textContent='// Press RUN to start.'; out.className='lab-out empty';
})();

/* ---- Binary Playground ---- */
(function () {
  const input  = document.getElementById('binInput');
  const dirSel = document.getElementById('binDir');
  const run    = document.getElementById('binRun');
  const reset  = document.getElementById('binReset');
  const out    = document.getElementById('binOut');
  if (!run) return;

  function go() {
    const val = input.value.trim();
    const dir = dirSel.value;
    if (!val) { setOut('// Enter a value first.', true); return; }

    try {
      if (dir === 'dec-bin') {
        const n = parseInt(val, 10);
        if (isNaN(n) || n < 0 || n > 2**31) throw 'Enter a non-negative integer (0 – 2,147,483,647).';
        const bits = n.toString(2).padStart(8, '0');
        setOut(`Decimal  : ${n}\nBinary   : ${bits}\nHex      : 0x${n.toString(16).toUpperCase().padStart(2,'0')}\nOctal    : ${n.toString(8)}\n\nStep-by-step (last 8 bits):\n${explain(n)}`);
      } else if (dir === 'bin-dec') {
        if (!/^[01]+$/.test(val)) throw 'Binary input must contain only 0 and 1.';
        const n = parseInt(val, 2);
        setOut(`Binary   : ${val}\nDecimal  : ${n}\nHex      : 0x${n.toString(16).toUpperCase()}`);
      } else {
        const n = parseInt(val, 10);
        if (isNaN(n) || n < 0) throw 'Enter a non-negative integer.';
        setOut(`Decimal  : ${n}\nHex      : 0x${n.toString(16).toUpperCase()}\nBinary   : ${n.toString(2)}`);
      }
    } catch(e) { setOut('// Error: ' + e, true); }
  }

  function explain(n) {
    let lines = [], rem = n;
    for (let i = 7; i >= 0; i--) {
      const bit = (rem >> i) & 1;
      lines.push(`  2^${String(i).padStart(2)} = ${Math.pow(2,i).toString().padStart(5)}  →  bit: ${bit}`);
    }
    return lines.join('\n');
  }

  function setOut(t, empty=false) { out.textContent=t; out.className='lab-out'+(empty?' empty':''); }

  run.addEventListener('click', go);
  reset.addEventListener('click', () => { input.value=''; setOut('// Output will appear here...', true); });
  input?.addEventListener('keydown', e => { if (e.key==='Enter') go(); });
})();

/* ---- SQL Explorer ---- */
(function () {
  const run   = document.getElementById('sqlRun');
  const reset = document.getElementById('sqlReset');
  const ta    = document.getElementById('sqlInput');
  const out   = document.getElementById('sqlOut');
  if (!run) return;

  const DB = {
    students: [
      {id:1,name:'Alice',    year:3,major:'Computer Science',gpa:3.8},
      {id:2,name:'Bob',      year:1,major:'Information Systems',gpa:3.2},
      {id:3,name:'Reabetswe',year:3,major:'Computer Science',gpa:3.9},
      {id:4,name:'Carol',    year:2,major:'Computer Science',gpa:3.5},
      {id:5,name:'David',    year:3,major:'Networking',gpa:3.1},
    ],
    courses: [
      {id:101,name:'Algorithms',       credits:4,instructor:'Dr. Smith'},
      {id:102,name:'Database Systems', credits:3,instructor:'Dr. Jones'},
      {id:103,name:'Networking',       credits:3,instructor:'Dr. Patel'},
      {id:104,name:'Web Development',  credits:3,instructor:'Dr. Nkosi'},
      {id:105,name:'Operating Systems',credits:4,instructor:'Dr. Adams'},
    ]
  };

  function runQuery() {
    const q = ta.value.trim().toLowerCase();
    if (!q) { setOut('// Enter a SQL query.', true); return; }
    try {
      let m;
      // SHOW TABLES
      if (/^show tables;?$/.test(q)) { return setOut('Tables:\n  · students (id, name, year, major, gpa)\n  · courses  (id, name, credits, instructor)'); }
      // COUNT(*)
      m = q.match(/^select count\(\*\) from (\w+);?$/);
      if (m) { const r=DB[m[1]]; if(!r) throw `Table "${m[1]}" not found.`; return setOut(`count(*)\n--------\n${r.length}\n\n1 row returned.`); }
      // AVG
      m = q.match(/^select avg\((\w+)\) from (\w+);?$/);
      if (m) { const col=m[1],rows=DB[m[2]]; if(!rows) throw `Table "${m[2]}" not found.`; if(!rows[0]||!(col in rows[0])) throw `Column "${col}" not found.`; const avg=(rows.reduce((a,r)=>a+parseFloat(r[col]),0)/rows.length).toFixed(2); return setOut(`avg(${col})\n---------\n${avg}\n\n1 row returned.`); }
      // SELECT * with optional WHERE and ORDER BY
      m = q.match(/^select \* from (\w+)(?:\s+where\s+(.+?))?(?:\s+order by\s+(\w+)(?:\s+(asc|desc))?)?;?$/);
      if (m) {
        let rows=DB[m[1]]; if(!rows) throw `Table "${m[1]}" not found.`;
        if (m[2]) {
          const wh = m[2].trim();
          const wm = wh.match(/^(\w+)\s*([><=!]+)\s*['"]?([^'"]+)['"]?$/);
          if (!wm) throw `Unsupported WHERE clause. Try: column = value`;
          const [,col,op,val] = wm;
          rows = rows.filter(r => {
            const rv = isNaN(r[col]) ? r[col] : parseFloat(r[col]);
            const tv = isNaN(val) ? val.trim() : parseFloat(val);
            if(op==='=') return String(rv).toLowerCase()===String(tv).toLowerCase();
            if(op==='>') return rv>tv; if(op==='<') return rv<tv;
            if(op==='>=') return rv>=tv; if(op==='<=') return rv<=tv;
            if(op==='!='||op==='<>') return rv!=tv;
            throw `Unknown operator: ${op}`;
          });
        }
        if (m[3]) {
          const col=m[3], desc=(m[4]==='desc');
          rows=[...rows].sort((a,b)=>{ const av=isNaN(a[col])?a[col]:+a[col]; const bv=isNaN(b[col])?b[col]:+b[col]; return desc?(bv>av?1:-1):(av>bv?1:-1); });
        }
        return setOut(rows.length ? fmtTable(rows) : '// 0 rows returned.');
      }
      throw 'Query not recognised. Type a valid SELECT statement or try a preset query above.';
    } catch(e) { setOut('// Error: '+e, true); }
  }

  function fmtTable(rows) {
    const keys=Object.keys(rows[0]);
    const widths=keys.map(k=>Math.max(k.length,...rows.map(r=>String(r[k]).length)));
    const sep='+-'+widths.map(w=>'-'.repeat(w)).join('-+-')+'-+';
    const head='| '+keys.map((k,i)=>k.padEnd(widths[i])).join(' | ')+' |';
    const body=rows.map(r=>'| '+keys.map((k,i)=>String(r[k]).padEnd(widths[i])).join(' | ')+' |');
    return [sep,head,sep,...body,sep,`\n${rows.length} row(s) returned.`].join('\n');
  }

  function setOut(t, empty=false) { out.textContent=t; out.className='lab-out'+(empty?' empty':''); }

  document.querySelectorAll('.sq-btn').forEach(b => {
    b.addEventListener('click', () => { ta.value=b.dataset.query; setOut('// Press RUN to execute.', true); });
  });
  run.addEventListener('click', runQuery);
  reset.addEventListener('click', () => { ta.value='SELECT * FROM students'; setOut('// Output will appear here...', true); });
  ta?.addEventListener('keydown', e => { if ((e.ctrlKey||e.metaKey)&&e.key==='Enter') runQuery(); });

  setOut('// Click a preset query or type your own, then press RUN.', true);
})();
