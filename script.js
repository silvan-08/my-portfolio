(function () {
  document.documentElement.classList.add('js');

  var nav = document.getElementById('nav');
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');

  // Mobile menu
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Navbar background after scrolling
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight current section in the menu
  var links = menu.querySelectorAll('a');
  var sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });

    // Fade-in reveal
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); reveal.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('main section:not(.hero) .wrap').forEach(function (el) {
      el.classList.add('reveal');
      reveal.observe(el);
    });
  }

  // Contact form: opens the visitor's email app (no backend needed)
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var body = d.get('message') + '\n\nFrom: ' + d.get('name') + ' (' + d.get('email') + ')';
    window.location.href = 'mailto:' + form.dataset.email +
      '?subject=' + encodeURIComponent('Portfolio message from ' + d.get('name')) +
      '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app to send the message.';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();