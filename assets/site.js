(function () {
  var EMAIL = 'hello@sleedy.app';
  var form = document.getElementById('wl-form');
  var logo = document.getElementById('logo-btn');
  var copy = document.getElementById('copy-email');

  function check(v) {
    var t = (v || '').trim();
    if (!t) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return 'That email looks incomplete. Try something like name@example.com';
    return '';
  }

  if (form) {
    var input = document.getElementById('wl-email');
    var err = document.getElementById('wl-err');
    var btn = document.getElementById('wl-btn');
    var done = document.getElementById('wl-done');
    var who = document.getElementById('wl-who');
    var edited = false;
    function setErr(m) { err.textContent = m; input.setAttribute('aria-invalid', m ? 'true' : 'false'); }
    input.addEventListener('input', function () { edited = true; setErr(''); });
    input.addEventListener('blur', function () { if (edited && input.value.trim()) setErr(check(input.value)); });
    document.getElementById('wl-reset').addEventListener('click', function () {
      done.hidden = true; form.hidden = false; input.value = ''; edited = false; setErr(''); input.focus();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = check(input.value);
      if (msg) { setErr(msg); input.focus(); return; }
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { return; } // bots fill the hidden field
      var url = window.SLEEDY_WAITLIST_URL;
      if (!url) { setErr('The waitlist is not open just yet. Please try again soon.'); return; }
      btn.disabled = true; setErr('');
      var body = new URLSearchParams({ email: input.value.trim(), source: 'sleedy.app', ts: new Date().toISOString() });
      // Apps Script web apps need a simple form-encoded POST. no-cors hides the reply, so success means the request was sent.
      fetch(url, { method: 'POST', mode: 'no-cors', body: body }).then(function () {
        who.textContent = input.value.trim();
        form.hidden = true; done.hidden = false; btn.disabled = false;
      }).catch(function () {
        btn.disabled = false;
        setErr('Something went wrong. Please check your connection and try again.');
      });
    });
  }

  if (logo) {
    logo.addEventListener('click', function () {
      logo.classList.remove('lr-run');
      void logo.offsetWidth;
      logo.classList.add('lr-run');
    });
  }

  if (copy) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      var ok = function () { copy.textContent = 'Copied!'; setTimeout(function () { copy.textContent = 'Copy'; }, 2000); };
      var fb = function () {
        try {
          var t = document.createElement('textarea');
          t.value = EMAIL; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
          document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); ok();
        } catch (x) {}
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(EMAIL).then(ok, fb); else fb();
    });
  }
})();
