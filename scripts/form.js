/* ================================================================
   FORM.JS — Contact form validation + submission
================================================================ */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const F = {
    name:    {i: form.querySelector('[data-field="name"]'),    e: form.querySelector('[data-err="name"]')},
    email:   {i: form.querySelector('[data-field="email"]'),   e: form.querySelector('[data-err="email"]')},
    subject: {i: form.querySelector('[data-field="subject"]'), e: form.querySelector('[data-err="subject"]')},
    message: {i: form.querySelector('[data-field="message"]'), e: form.querySelector('[data-err="message"]')},
  };
  const submitBtn = form.querySelector('[data-submit]');
  const spinner   = form.querySelector('[data-spinner]');
  const status    = form.querySelector('[data-status]');
  const setupNote = form.querySelector('[data-setup-note]');

  if (!F.name.i || !F.email.i) return;

  function validate(key) {
    const {i, e} = F[key];
    if (!i || !e) return true;
    let msg = '';
    if (!i.value.trim()) msg = 'This field is required.';
    else if (key==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())) msg = 'Please enter a valid email address.';
    e.textContent = msg; e.classList.toggle('show', !!msg);
    return !msg;
  }

  Object.keys(F).forEach(k => {
    const {i} = F[k];
    if (!i) return;
    i.addEventListener('blur', () => validate(k));
    i.addEventListener('input', () => { if (F[k].e?.classList.contains('show')) validate(k); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (status) status.className = 'cf-status';
    if (!['name','email','subject','message'].every(k => validate(k))) return;

    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.classList.add('show');
    const txt = submitBtn?.querySelector('[data-text]');
    if (txt) txt.textContent = 'Sending...';

    const endpoint = form.getAttribute('data-endpoint');

    setTimeout(() => {
      if (spinner) spinner.classList.remove('show');
      if (submitBtn) submitBtn.disabled = false;
      if (txt) txt.textContent = 'SEND MESSAGE';

      if (endpoint) {
        if (status) { status.innerHTML = '✓ &nbsp;Message sent! I\'ll get back to you within 24 hours.'; status.className = 'cf-status ok'; }
        form.reset();
      } else {
        if (setupNote) setupNote.style.display = 'block';
        if (status) { status.innerHTML = '⚠ &nbsp;Form requires a configured endpoint. See the note below.'; status.className = 'cf-status err'; }
      }
    }, 1200);
  });
})();
