/* Coupons render from data/coupons.json so the client can edit offers and expiry
   without touching HTML. Signup is MOCKED on purpose (Angel, 2026-09-20): it shows
   the real flow without a newsletter tool behind it yet. Nothing is sent anywhere. */
(function () {
  var MOUNTS = document.querySelectorAll('#coupons, #coupons-all');
  if (!MOUNTS.length && !document.getElementById('signup')) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(c, data) {
    var red = c.accent === 'red';
    return '' +
      '<div class="coupon' + (red ? ' red' : '') + '">' +
        '<div class="brandline">' +
          '<img src="assets/logo3.png" alt="Advanced Heating &amp; Air">' +
          '<span class="scissors" aria-hidden="true">✂</span>' +
        '</div>' +
        '<div class="amt">' + esc(c.amount) +
          (c.unit ? '<span class="unit">' + esc(c.unit) + '</span>' : '') + '</div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="blurb">' + esc(c.blurb) + '</p>' +
        '<div class="cta noprint"><a href="tel:+1' + esc(data.phone).replace(/\D/g, '') + '">' +
          'Call ' + esc(data.phone) + '</a></div>' +
        (c.code ? '<div class="code"><span>Mention code</span><b>' + esc(c.code) + '</b></div>' : '') +
        '<div class="foot">' +
          '<span class="printphone printonly">' + esc(data.phone) + '</span>' +
          '<span class="exp">' + esc(data.expires_label) + '</span><br>' +
          esc(data.terms) +
        '</div>' +
      '</div>';
  }

  fetch('data/coupons.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      MOUNTS.forEach(function (m) {
        var list = data.coupons;
        if (m.id === 'coupons') list = list.slice(0, 3);
        m.innerHTML = list.map(function (c) { return card(c, data); }).join('');
      });
      document.querySelectorAll('[data-expiry]').forEach(function (el) {
        el.textContent = data.expires_label;
      });
    })
    .catch(function () {
      MOUNTS.forEach(function (m) {
        m.innerHTML = '<p>Our current offers are on the phone — call ' +
          '<a href="tel:+15203499606">(520) 349-9606</a>.</p>';
      });
    });

  /* ---- mocked signup: real flow, no tool behind it ---- */
  var form = document.getElementById('signup');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('email');
      var v = (input.value || '').trim();
      if (!v || v.indexOf('@') < 1 || v.indexOf('.') < 0) {
        input.focus();
        input.style.borderColor = '#d8262e';
        return;
      }
      var to = document.getElementById('sentto');
      if (to) to.textContent = v;
      document.getElementById('capture').classList.add('sent');
    });
  }
})();
