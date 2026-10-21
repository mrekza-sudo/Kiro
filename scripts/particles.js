/* ================================================
   PARTICLES.JS — Multi-color floating network
   Beyond the Code palette
   ================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COUNT = 50;
  const DIST  = 125;

  // Color stops from our palette
  const COLORS = [
    { r: 52,  g: 120, b: 246 },  // --blue
    { r: 136, g: 87,  b: 255 },  // --purple
    { r: 49,  g: 213, b: 255 },  // --cyan
    { r: 102, g: 242, b: 194 },  // --mint
  ];

  let particles = [], animId;

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (init) {
    this.x  = Math.random() * canvas.width;
    this.y  = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -10 : canvas.height + 10);
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 1.4 + 0.4;
    this.a  = Math.random() * 0.3 + 0.05;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.color = c;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10 || this.x > canvas.width + 10)  this.vx *= -1;
    if (this.y < -10 || this.y > canvas.height + 10)  this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    const { r, g, b } = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.a})`;
    ctx.fill();
  };

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < DIST) {
          const a = (1 - d / DIST) * 0.07;
          const { r, g, b } = particles[i].color;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    animId = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
  }

  function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: COUNT }, () => new Particle());
    cancelAnimationFrame(animId);
    frame();
  }

  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(init, 200); }, { passive: true });
  init();
})();
