/* Advanced Air — coupons + the embedded email gate.
   The OFFER is on the page; the CODE is not. Codes come back from the Cloudflare Worker
   after a successful submit, so the lock is the real gate rather than a CSS effect, and
   the n8n endpoint never appears in this HTML. (Angel, 2026-09-20) */
(function () {
  var API = 'https://djangelic-edge.djangelic.workers.dev/advancedair/coupons';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(c, data) {
    return '' +
      '<div class="coupon' + (c.accent === 'red' ? ' red' : '') + '" data-id="' + esc(c.id) + '">' +
        '<div class="brandline"><img src="assets/logo3.png" alt="Advanced Heating &amp; Air">' +
          '<span class="scissors" aria-hidden="true">✂</span></div>' +
        '<div class="amt">' + esc(c.amount) +
          (c.unit ? '<span class="unit">' + esc(c.unit) + '</span>' : '') + '</div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="blurb">' + esc(c.blurb) + '</p>' +
        '<div class="lockrow">' +
          '<span class="lk" aria-hidden="true">🔒</span>' +
          '<span class="lbl">Your code arrives by email</span>' +
          '<b class="codeval" data-code></b>' +
        '</div>' +
        '<div class="foot">' +
          '<span class="printphone printonly">' + esc(data.phone) + '</span>' +
          '<span class="exp">' + esc(data.expires_label) + '</span><br>' + esc(data.terms) +
        '</div>' +
      '</div>';
  }

  var mounts = document.querySelectorAll('#coupons, #coupons-all');
  if (mounts.length) {
    fetch('data/coupons.json').then(function (r) { return r.json(); }).then(function (data) {
      mounts.forEach(function (m) {
        m.innerHTML = data.coupons.map(function (c) { return card(c, data); }).join('');
      });
      document.querySelectorAll('[data-expiry]').forEach(function (el) { el.textContent = data.expires_label; });
    }).catch(function () {
      mounts.forEach(function (m) {
        m.innerHTML = '<p>Our current offers are on the phone — call <a href="tel:+15203499606">(520) 349-9606</a>.</p>';
      });
    });
  }

  /* ---- the embedded gate ---- */
  var gate = document.querySelector('[data-gate]');
  if (!gate) return;
  var form = gate.querySelector('form');
  var err  = gate.querySelector('[data-err]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    err.hidden = true;
    if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 0) {
      err.textContent = 'Please enter an email address we can send them to.';
      err.hidden = false; form.elements.email.focus(); return;
    }
    var consentBox = form.elements.consent;
    var consent = !!(consentBox && consentBox.checked);
    var token = '';
    try { token = (window.turnstile && window.turnstile.getResponse()) || ''; } catch (_) {}

    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, consent: consent, turnstile: token })
    })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (res) {
      if (!res.ok) throw new Error((res.j && res.j.error) || 'Something went wrong.');
      var codes = (res.j && res.j.codes) || {};
      document.querySelectorAll('.coupon').forEach(function (c) {
        var b = c.querySelector('[data-code]');
        if (b && codes[c.dataset.id]) {
          b.textContent = codes[c.dataset.id];
          c.querySelector('.lbl').textContent = 'Mention code';
          c.classList.add('unlocked');
        }
      });
      var bar = document.querySelector('[data-printbar]');
      if (bar) bar.hidden = false;
      var to = gate.querySelector('[data-sentto]');
      if (to) to.textContent = email;
      var cn = gate.querySelector('[data-consentnote]');
      if (cn) cn.textContent = consent
        ? 'You are on the monthly list too — one email a month, and you can stop any time.'
        : 'This was a one-off. We will not email you again unless you ask.';
      gate.classList.add('sent');
      var first = document.querySelector('.coupon');
      if (first && first.scrollIntoView) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(function (e2) {
      err.textContent = e2.message || 'Something went wrong. Please try again.';
      err.hidden = false;
      btn.disabled = false; btn.textContent = 'Send me the coupons';
      try { window.turnstile && window.turnstile.reset(); } catch (_) {}
    });
  });
})();
