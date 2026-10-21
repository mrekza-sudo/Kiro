/* ================================================
   CONTACT.JS — Contact form validation
   Works for both standalone contact.html
   and inline #contact section on index.html
   ================================================ */
(function () {
  // Support both form IDs
  const forms = document.querySelectorAll('#contactForm, #cpContactForm');

  forms.forEach(form => {
    if (!form) return;

    const fields = {
      name:    { input: form.querySelector('[data-field="name"]'),    err: form.querySelector('[data-err="name"]')    },
      email:   { input: form.querySelector('[data-field="email"]'),   err: form.querySelector('[data-err="email"]')   },
      subject: { input: form.querySelector('[data-field="subject"]'), err: form.querySelector('[data-err="subject"]') },
      message: { input: form.querySelector('[data-field="message"]'), err: form.querySelector('[data-err="message"]') },
    };

    const submitBtn = form.querySelector('[data-submit]');
    const spinner   = form.querySelector('[data-spinner]');
    const status    = form.querySelector('[data-status]');
    const setupNote = form.querySelector('[data-setup-note]');

    // Only proceed if essential fields exist
    if (!fields.name.input || !fields.email.input) return;

    function validate(key) {
      const { input, err } = fields[key];
      if (!input || !err) return true;
      let msg = '';
      if (!input.value.trim()) {
        msg = 'This field is required.';
      } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) {
        msg = 'Please enter a valid email address.';
      }
      err.textContent = msg;
      err.classList.toggle('show', !!msg);
      const wrap = input.closest('.cpf-input-wrap, .input-wrap');
      if (wrap) wrap.classList.toggle('invalid', !!msg);
      return !msg;
    }

    function validateAll() {
      return ['name', 'email', 'subject', 'message'].every(k => validate(k));
    }

    // Blur validation
    Object.keys(fields).forEach(key => {
      const { input } = fields[key];
      if (!input) return;
      input.addEventListener('blur', () => validate(key));
      input.addEventListener('input', () => {
        if (fields[key].err?.classList.contains('show')) validate(key);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (status) status.className = 'cpf-status';

      if (!validateAll()) return;

      if (submitBtn) submitBtn.disabled = true;
      if (spinner)   spinner.classList.add('show');
      if (submitBtn) { const t = submitBtn.querySelector('[data-text]'); if (t) t.textContent = 'Sending...'; }

      // Check if form has a real action endpoint configured
      const hasEndpoint = form.getAttribute('data-endpoint');

      setTimeout(() => {
        if (spinner) spinner.classList.remove('show');
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtn) { const t = submitBtn.querySelector('[data-text]'); if (t) t.textContent = 'SEND MESSAGE'; }

        if (hasEndpoint) {
          // Real submission would go here (Formspree, EmailJS, etc.)
          if (status) {
            status.innerHTML = '✓ &nbsp;Message sent! I\'ll get back to you within 24 hours.';
            status.className = 'cpf-status success';
          }
          form.reset();
        } else {
          // No endpoint — show setup note honestly
          if (setupNote) setupNote.style.display = 'block';
          if (status) {
            status.innerHTML = '⚠ &nbsp;Form submission requires configuration. See the note below.';
            status.className = 'cpf-status error';
          }
        }
      }, 1200);
    });
  });
})();
