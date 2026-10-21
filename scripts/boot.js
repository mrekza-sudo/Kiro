/* ================================================
   BOOT.JS — Boot sequence animation (index only)
   ================================================ */
(function () {
  const screen = document.getElementById('bootScreen');
  if (!screen) return;

  // Respect reduced-motion: skip instantly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    screen.classList.add('hidden');
    return;
  }

  // Check sessionStorage — only show once per session
  if (sessionStorage.getItem('booted')) {
    screen.classList.add('hidden');
    return;
  }

  const lines  = screen.querySelectorAll('.boot-line');
  const bar    = screen.querySelector('.boot-bar');
  const skip   = document.getElementById('bootSkip');

  function finish() {
    sessionStorage.setItem('booted', '1');
    screen.classList.add('fade-out');
    setTimeout(() => screen.classList.add('hidden'), 650);
  }

  skip.addEventListener('click', finish);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === ' ') finish();
  }, { once: true });

  const STEPS = [
    { delay: 200,  text: 'Establishing secure connection...', barTo: 20  },
    { delay: 750,  text: 'Loading developer profile...',      barTo: 50  },
    { delay: 1300, text: 'Initializing REABETSWE.EXE...',     barTo: 80  },
    { delay: 2000, text: 'SYSTEM ONLINE',                     barTo: 100 },
  ];

  STEPS.forEach((step, i) => {
    setTimeout(() => {
      if (lines[i]) {
        lines[i].classList.add('show');
        // mark previous as done
        if (i > 0 && lines[i - 1]) lines[i - 1].classList.add('done');
      }
      if (bar) bar.style.width = step.barTo + '%';
    }, step.delay);
  });

  // Auto-dismiss after all steps + pause
  setTimeout(finish, 2800);
})();
