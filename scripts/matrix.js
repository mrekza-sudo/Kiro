/* ================================================
   MATRIX.JS — Colorful code-rain background
   Beyond the Code palette
   ================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS     = '01アイウエカキクコサシスセタチツテ{}[]<>/\\|:;+-=~';
  const FONT_SIZE = 13;
  const COLORS    = ['#3478F6', '#8857FF', '#31D5FF', '#66F2C2'];
  let cols, drops, animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }

  function draw() {
    ctx.fillStyle = 'rgba(11,16,32,0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT_SIZE + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const ch     = CHARS[Math.floor(Math.random() * CHARS.length)];
      const bright = Math.random() > 0.96;
      ctx.fillStyle  = bright ? '#FFFFFF' : COLORS[i % COLORS.length];
      ctx.globalAlpha = bright ? 0.35 : (0.06 + Math.random() * 0.12);
      ctx.fillText(ch, i * FONT_SIZE, drops[i] * FONT_SIZE);
      ctx.globalAlpha = 1;

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.977) drops[i] = 0;
      drops[i] += 0.45;
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { cancelAnimationFrame(animId); init(); }, 200);
  }, { passive: true });

  function init() {
    resize();
    function loop() { draw(); animId = requestAnimationFrame(loop); }
    loop();
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(init);
  } else {
    init();
  }
})();
