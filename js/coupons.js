/* Coupons render from data/coupons.json so the client edits offers without HTML.
   ⚠️ The codes and the printable coupon are DELIBERATELY NOT on this page. Anyone could
   screenshot a visible coupon and never give us an address; the email IS the mechanism
   (Angel, 2026-09-20). The page shows what is on offer; the usable coupon arrives by email. */
(function () {
  var FORM = 'https://example.invalid/form';
  var MOUNTS = document.querySelectorAll('#coupons, #coupons-all');
  if (!MOUNTS.length) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(c, data) {
    var red = c.accent === 'red';
    return '' +
      '<div class="coupon locked' + (red ? ' red' : '') + '">' +
        '<div class="brandline">' +
          '<img src="assets/logo3.png" alt="Advanced Heating &amp; Air">' +
          '<span class="scissors" aria-hidden="true">✂</span>' +
        '</div>' +
        '<div class="amt">' + esc(c.amount) +
          (c.unit ? '<span class="unit">' + esc(c.unit) + '</span>' : '') + '</div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="blurb">' + esc(c.blurb) + '</p>' +
        '<div class="lockrow">' +
          '<span class="lk" aria-hidden="true">🔒</span>' +
          '<span>Your code arrives by email</span>' +
        '</div>' +
        '<div class="cta"><a href="' + FORM + '">Email me this coupon</a></div>' +
        '<div class="foot"><span class="exp">' + esc(data.expires_label) + '</span></div>' +
      '</div>';
  }

  fetch('data/coupons.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      MOUNTS.forEach(function (m) {
        m.innerHTML = data.coupons.map(function (c) { return card(c, data); }).join('');
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
})();
