/* ================================================
   BOOT.JS — Elegant boot sequence (index only)
   ================================================ */
(function () {
  const screen = document.getElementById('bootScreen');
  if (!screen) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    screen.classList.add('hidden');
    return;
  }

  if (sessionStorage.getItem('rbtw-booted')) {
    screen.classList.add('hidden');
    return;
  }

  const lines = screen.querySelectorAll('.boot-line');
  const bar   = screen.querySelector('.boot-bar');
  const skip  = document.getElementById('bootSkip');

  function finish() {
    sessionStorage.setItem('rbtw-booted', '1');
    screen.classList.add('fade-out');
    setTimeout(() => screen.classList.add('hidden'), 720);
  }

  skip?.addEventListener('click', finish);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === ' ') finish();
  }, { once: true });

  const STEPS = [
    { delay: 200,  barTo: 20 },
    { delay: 800,  barTo: 52 },
    { delay: 1400, barTo: 80 },
    { delay: 2100, barTo: 100 },
  ];

  STEPS.forEach((step, i) => {
    setTimeout(() => {
      if (lines[i]) lines[i].classList.add('show');
      if (i > 0 && lines[i - 1]) lines[i - 1].classList.add('done');
      if (bar) bar.style.width = step.barTo + '%';
    }, step.delay);
  });

  setTimeout(() => {
    if (lines[lines.length - 1]) lines[lines.length - 1].classList.add('done');
    setTimeout(finish, 400);
  }, 2900);
})();
